# This script automates the audit, build, deployment to AWS S3 + CloudFront, and Git operations for the Fulxerpro frontend project.

#region Parameters
$projectDir = "C:\Users\Remzy\fulxerpro"
$s3BucketName = "fulxerpro-frontend"
$apiGatewayUrl = "https://0bsy5p2yqk.execute-api.us-east-1.amazonaws.com/prod/api"
$region = "us-east-1"
$commitMessage = "Deploy: Automate S3/CloudFront deployment and connect to API Gateway"
#endregion

# Function to execute a command and handle errors
function Invoke-CheckedCommand {
    Param (
        [string]$Command,
        [string]$ErrorMessage = "Command failed.",
        [string]$SuccessMessage = "Command executed successfully."
    )
    Write-Host "Executing: $Command"
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Error $ErrorMessage
        exit 1
    }
    Write-Host $SuccessMessage
}

#region Step 1: CD to C:\Users\Remzy\fulxerpro
Write-Host "--- Step 1: Changing directory ---"
try {
    Set-Location -Path $projectDir -ErrorAction Stop
    Write-Host "Successfully changed directory to $projectDir"
}
catch {
    Write-Error "Failed to change directory to $projectDir. Please make sure the directory exists."
    exit 1
}
#endregion

#region Step 2: Audit the project
Write-Host "--- Step 2: Auditing project files ---"

Write-Host "Checking key files:"
$keyFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "index.html",
    "src/App.tsx"
)
foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "  - $file (Found)"
    } else {
        Write-Warning "  - $file (Not Found) - This might indicate a missing project file."
    }
}

Write-Host "Checking for node_modules directory..."
if (-not (Test-Path "node_modules")) {
    Write-Warning "  - node_modules directory not found. npm install will be executed."
    $runNpmInstall = $true
} else {
    Write-Host "  - node_modules directory found."
    $runNpmInstall = $false
}

Write-Host "Checking and cleaning dist/ directory..."
if (Test-Path "dist") {
    try {
        Remove-Item -Path "dist" -Recurse -Force -ErrorAction Stop
        Write-Host "  - Existing dist/ directory cleaned."
    }
    catch {
        Write-Error "  - Failed to clean dist/ directory: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "  - dist/ directory does not exist, no cleaning needed."
}
#endregion

#region Step 3: Run npm install if node_modules missing
Write-Host "--- Step 3: Installing npm dependencies ---"
if ($runNpmInstall) {
    Invoke-CheckedCommand "npm install" "npm install failed." "npm install completed."
} else {
    Write-Host "npm install skipped as node_modules already exists."
}
#endregion

#region Step 4: Run npm run build and check for success
Write-Host "--- Step 4: Building the frontend project ---"
Invoke-CheckedCommand "npm run build" "Frontend build failed. Check build logs for errors." "Frontend built successfully."
#endregion

#region Step 5: Upload the entire dist/ folder to S3 bucket
Write-Host "--- Step 5: Uploading frontend to S3 bucket '$s3BucketName' ---"
Invoke-CheckedCommand "aws s3 sync ./dist s3://$s3BucketName --region $region --delete" `
    "Failed to upload files to S3 bucket $s3BucketName. Ensure AWS CLI is configured and the bucket exists." `
    "Successfully uploaded frontend to S3 bucket '$s3BucketName'."
#endregion

#region Step 6: Create a CloudFront invalidation for /*
Write-Host "--- Step 6: Creating CloudFront invalidation ---"

# Get CloudFront Distribution ID for the S3 bucket
# This requires a separate lookup. Assuming the bucket is directly associated with a CF distribution.
# This part is a placeholder and might need manual lookup or a more robust way to find the distribution ID.
# For simplicity, we assume there's one CF distribution associated with the S3 bucket or user provides it.
# A more robust solution would list distributions and filter by origin domain name.
Write-Host "Attempting to find CloudFront Distribution ID for S3 bucket '$s3BucketName'..."
try {
    $distributionId = (aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?S3OriginConfig.OriginAccessIdentity].DomainName=='$($s3BucketName).s3.$($region).amazonaws.com'].Id | [0]" --output text --region $region)
    if (-not $distributionId) {
        $distributionId = (aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='$($s3BucketName).s3.$($region).amazonaws.com'].Id | [0]" --output text --region $region)
    }
    if ([string]::IsNullOrEmpty($distributionId)) {
        Write-Warning "Could not automatically determine CloudFront Distribution ID for S3 bucket '$s3BucketName'. Skipping CloudFront invalidation."
        $cloudFrontInvalidationSkipped = $true
    } else {
        Write-Host "Found CloudFront Distribution ID: $distributionId"
        Invoke-CheckedCommand "aws cloudfront create-invalidation --distribution-id $distributionId --paths '/*' --region $region" `
            "Failed to create CloudFront invalidation." `
            "Successfully created CloudFront invalidation for '/*'."
        $cloudFrontInvalidationSkipped = $false
    }
}
catch {
    Write-Error "Error finding CloudFront Distribution ID or creating invalidation: $($_.Exception.Message)"
    $cloudFrontInvalidationSkipped = $true
}
#endregion

#region Step 7: Provide the CloudFront domain name or S3 endpoint for testing
Write-Host "--- Step 7: Providing access endpoints ---"
if (-not $cloudFrontInvalidationSkipped) {
    try {
        $cloudFrontDomainName = (aws cloudfront get-distribution --id $distributionId --query "Distribution.DomainName" --output text --region $region)
        if (-not [string]::IsNullOrEmpty($cloudFrontDomainName)) {
            Write-Host "CloudFront Domain Name (for testing): https://$cloudFrontDomainName"
        }
    }
    catch {
        Write-Warning "Could not retrieve CloudFront Domain Name: $($_.Exception.Message)"
    }
}
Write-Host "S3 Website Endpoint (if configured, for testing): http://$s3BucketName.s3-website.$region.amazonaws.com"
#endregion

#region Step 8: Git commit any changes and push to main
Write-Host "--- Step 8: Git operations ---"

# Ensure .env contains VITE_API_URL
Write-Host "Updating .env with VITE_API_URL..."
$envFilePath = Join-Path $projectDir ".env"
try {
    Set-Content -Path $envFilePath -Value "VITE_API_URL=$apiGatewayUrl" -Force -ErrorAction Stop
    Write-Host "  - .env file updated successfully."
}
catch {
    Write-Error "  - Failed to update .env file: $($_.Exception.Message)"
    exit 1
}

Invoke-CheckedCommand "git add ." "Failed to add files to git staging area." "Successfully added all changes to git staging area."
Invoke-CheckedCommand "git commit -m '$commitMessage'" "Failed to commit changes to git." "Successfully committed changes."
Invoke-CheckedCommand "git push origin main" "Failed to push changes to main branch. Check git configuration and permissions." "Successfully pushed changes to main branch."
#endregion

Write-Host "--- Deployment process completed. ---"
Write-Host "Please verify your frontend at the provided CloudFront or S3 endpoint."

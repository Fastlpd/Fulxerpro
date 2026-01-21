# This script updates the Fulxerpro frontend project to connect to the AWS API Gateway backend.

# Set the project directory
$projectDir = "C:\Users\Remzy\fulxerpro"

# Set the API Gateway URL
$apiUrl = "https://0bsy5p2yqk.execute-api.us-east-1.amazonaws.com/prod/api"

# Set the commit message
$commitMessage = "Connect frontend to AWS API Gateway backend"

# Change to the project directory
try {
    Set-Location -Path $projectDir -ErrorAction Stop
    Write-Host "Successfully changed directory to $projectDir"
}
catch {
    Write-Error "Failed to change directory to $projectDir. Please make sure the directory exists."
    exit 1
}

# Create or update the .env file
try {
    $envFile = ".env"
    "VITE_API_URL=$apiUrl" | Set-Content -Path $envFile -ErrorAction Stop
    Write-Host "Successfully created/updated the $envFile file."
}
catch {
    Write-Error "Failed to create/update the $envFile file."
    exit 1
}

# Run npm run build
try {
    npm run build -ErrorAction Stop
    Write-Host "Successfully built the frontend."
}
catch {
    Write-Error "Failed to build the frontend. Please make sure Node.js and npm are installed and the project dependencies are installed."
    exit 1
}

# Git add .env and any changed files
try {
    git add . -ErrorAction Stop
    Write-Host "Successfully added files to the staging area."
}
catch {
    Write-Error "Failed to add files to the staging area. Please make sure git is installed and you are in a git repository."
    exit 1
}

# Git commit
try {
    git commit -m "$commitMessage" -ErrorAction Stop
    Write-Host "Successfully committed the changes."
}
catch {
    Write-Error "Failed to commit the changes."
    exit 1
}

# Git push
try {
    git push origin main -ErrorAction Stop
    Write-Host "Successfully pushed the changes to the main branch."
}
catch {
    Write-Error "Failed to push the changes. Please make sure you have the correct permissions and the remote repository is configured correctly."
    exit 1
}

Write-Host "Successfully updated the frontend project."

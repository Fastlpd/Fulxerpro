# This script monitors and troubleshoots AWS ACM certificate validation for fulxerpro.com and www.fulxerpro.com.

#region Parameters
param (
    [string]$CertificateId = "1e759de3-9095-4dce-b498-f82f2ccb2626",
    [string]$DomainName = "fulxerpro.com",
    [string]$WwwDomainName = "www.fulxerpro.com",
    [string]$WwwCnameName = "_ad723f60459f482e591930f5cbe281bd.www.fulxerpro.com",
    [string]$WwwCnameValue = "_42ca117ebeab96a185e6d73bd6d2c004.jkddzztszm.acm-validations.aws",
    [int]$PollingIntervalSeconds = 30, # How often to check ACM status
    [int]$TimeoutMinutes = 60 # Maximum time to monitor
)
#endregion

# Function to execute a command and handle errors
function Invoke-CheckedCommand {
    Param (
        [string]$Command,
        [string]$ErrorMessage = "Command failed.",
        [string]$SuccessMessage = ""
    )
    $result = Invoke-Expression $Command 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "$ErrorMessage`n$result"
        exit 1
    }
    if ($SuccessMessage) {
        Write-Host $SuccessMessage
    }
    return $result
}

Write-Host "--- Monitoring ACM Certificate Validation ---"
Write-Host "Certificate ID: $CertificateId"
Write-Host "Monitoring for domains: $DomainName, $WwwDomainName"

$startTime = Get-Date
$validationComplete = $false

do {
    $currentTime = Get-Date
    $elapsedTime = ($currentTime - $startTime).TotalMinutes
    Write-Host "`nChecking certificate status... (Elapsed: $($elapsedTime.ToString('N0')) minutes of $TimeoutMinutes)"

    try {
        $certInfo = Invoke-CheckedCommand "aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1::certificate/$CertificateId --region us-east-1" `
            "Failed to describe certificate. Check Certificate ID and AWS CLI configuration."

        $certDetails = ConvertFrom-Json $certInfo

        $status = $certDetails.Certificate.Status
        Write-Host "Current Certificate Status: $status"

        if ($status -eq "ISSUED") {
            Write-Host "Certificate has been successfully ISSUED!"
            $validationComplete = $true
            break
        }

        # Check domain statuses
        foreach ($domain in $certDetails.Certificate.DomainValidationOptions) {
            Write-Host "  Domain: $($domain.DomainName)"
            Write-Host "    Validation Status: $($domain.ValidationStatus)"
            Write-Host "    Validation Method: $($domain.ValidationMethod)"

            if ($domain.DomainName -eq $WwwDomainName -and $domain.ValidationStatus -eq "PENDING_VALIDATION") {
                Write-Warning "  $WwwDomainName is still PENDING_VALIDATION."
                Write-Host "  Please ensure the following CNAME record is correctly configured in Hostinger DNS:"
                Write-Host "    Name: $WwwCnameName"
                Write-Host "    Value: $WwwCnameValue"
                Write-Host "  It can take some time for DNS changes to propagate."
                Write-Host "  You can verify DNS propagation using tools like: dig $WwwCnameName @8.8.8.8 +short"
            }
        }
    }
    catch {
        Write-Error "An error occurred during certificate status check: $($_.Exception.Message)"
        # Do not exit, continue trying unless it's a critical error
    }

    if ($elapsedTime -ge $TimeoutMinutes) {
        Write-Error "Timeout reached. Certificate validation did not complete within $($TimeoutMinutes) minutes."
        exit 1
    }

    if (-not $validationComplete) {
        Write-Host "Waiting for $PollingIntervalSeconds seconds before checking again..."
        Start-Sleep -Seconds $PollingIntervalSeconds
    }

} while (-not $validationComplete)

Write-Host "--- ACM Certificate Validation Monitoring Complete ---"

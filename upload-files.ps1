# Simple file upload script for Hostinger VPS
param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username = "root"
)

$SourcePath = "C:\xampp\htdocs\aim3"
$TempPath = "C:\temp\aim3-upload"
$RemotePath = "/var/www/aim3"

Write-Host "🚀 Preparing files for upload..." -ForegroundColor Green

# Create temp directory
if (Test-Path $TempPath) {
    Remove-Item $TempPath -Recurse -Force
}
New-Item -ItemType Directory -Path $TempPath | Out-Null

# Copy files excluding problematic folders
Write-Host "📁 Copying files (excluding node_modules, .next, out, .git)..." -ForegroundColor Yellow

# Copy all files and folders except excluded ones
Get-ChildItem -Path $SourcePath -Recurse | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\.next\\" -and
    $_.FullName -notmatch "\\out\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\.env\\.local" -and
    $_.FullName -notmatch "\\.env\\.development"
} | ForEach-Object {
    $relativePath = $_.FullName.Substring($SourcePath.Length + 1)
    $destPath = Join-Path $TempPath $relativePath
    
    if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    } else {
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $_.FullName -Destination $destPath -Force
    }
}

Write-Host "✅ Files prepared for upload" -ForegroundColor Green
Write-Host "📤 Uploading to server..." -ForegroundColor Yellow

# Upload files
try {
    scp -r "$TempPath" "$Username@$ServerIP`:/var/www/"
    Write-Host "✅ Upload completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $TempPath -Recurse -Force

Write-Host ""
Write-Host "🎉 Upload completed!" -ForegroundColor Green
Write-Host "📋 Next steps on your server:" -ForegroundColor Yellow
Write-Host "1. SSH into server: ssh $Username@$ServerIP" -ForegroundColor White
Write-Host "2. cd /var/www/aim3-upload" -ForegroundColor White
Write-Host "3. mv * /var/www/aim3/" -ForegroundColor White
Write-Host "4. cd /var/www/aim3" -ForegroundColor White
Write-Host "5. npm install --production" -ForegroundColor White
Write-Host "6. npm run build" -ForegroundColor White
Write-Host "7. Continue with deployment steps..." -ForegroundColor White

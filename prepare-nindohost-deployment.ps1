# Nindohost Deployment Preparation Script
# This script prepares your files for Nindohost deployment

Write-Host "🚀 Preparing files for Nindohost deployment..." -ForegroundColor Green

# Create deployment directory
$deployDir = "nindohost-deployment"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "📁 Created deployment directory: $deployDir" -ForegroundColor Yellow

# Copy required files and folders
$filesToCopy = @(
    "src",
    "public", 
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    ".env.production"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        if (Test-Path $file -PathType Container) {
            # Copy directory
            Copy-Item $file -Destination $deployDir -Recurse
            Write-Host "✅ Copied directory: $file" -ForegroundColor Green
        } else {
            # Copy file
            Copy-Item $file -Destination $deployDir
            Write-Host "✅ Copied file: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
    }
}

# Rename .env.production to .env
if (Test-Path "$deployDir\.env.production") {
    Rename-Item "$deployDir\.env.production" "$deployDir\.env"
    Write-Host "✅ Renamed .env.production to .env" -ForegroundColor Green
}

# Create upload directories
$uploadDirs = @(
    "$deployDir\public\uploads",
    "$deployDir\public\uploads\document",
    "$deployDir\public\uploads\image"
)

foreach ($dir in $uploadDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Create deployment instructions
$instructions = @"
# Nindohost Deployment Instructions

## Files Ready for Upload
All files are prepared in the '$deployDir' folder.

## Next Steps:
1. Upload the entire '$deployDir' folder to your Nindohost server
2. Run: npm install --production
3. Run: npm run init-db
4. Run: npm run create-chat-tables
5. Run: npm run create-activity-options
6. Run: npm start

## Environment Variables:
Make sure your .env file contains the correct database credentials.

## Domain:
Point aim-event.com to your Nindohost server.

Good luck with your deployment!
"@

$instructions | Out-File -FilePath "$deployDir\DEPLOYMENT_INSTRUCTIONS.txt" -Encoding UTF8

Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "📁 Files ready in: $deployDir" -ForegroundColor Cyan
Write-Host "📋 Check DEPLOYMENT_INSTRUCTIONS.txt for next steps" -ForegroundColor Cyan
Write-Host "`n📦 Ready to upload to Nindohost!" -ForegroundColor Magenta

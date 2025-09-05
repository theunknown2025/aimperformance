# PowerShell script to upload AIM3 application to Hostinger VPS
# Run this script from your local Windows machine

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$AppPath = "C:\xampp\htdocs\aim3",
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath = "/var/www/aim3"
)

Write-Host "🚀 Starting upload to Hostinger VPS..." -ForegroundColor Green
Write-Host "Server: $ServerIP" -ForegroundColor Yellow
Write-Host "Username: $Username" -ForegroundColor Yellow
Write-Host "Local Path: $AppPath" -ForegroundColor Yellow
Write-Host "Remote Path: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# Check if SCP is available (requires OpenSSH or PuTTY)
if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SCP command not found. Please install OpenSSH or use PuTTY's pscp." -ForegroundColor Red
    Write-Host "You can install OpenSSH from: https://github.com/PowerShell/Win32-OpenSSH/releases" -ForegroundColor Yellow
    exit 1
}

# Create temporary directory for upload
$TempDir = "$env:TEMP\aim3-upload"
if (Test-Path $TempDir) {
    Remove-Item $TempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "📁 Preparing files for upload..." -ForegroundColor Yellow

# Copy application files to temp directory
Copy-Item "$AppPath\*" -Destination $TempDir -Recurse -Force

# Remove unnecessary files
$ExcludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    "out",
    "*.log",
    ".env.local",
    ".env.development"
)

foreach ($pattern in $ExcludePatterns) {
    $items = Get-ChildItem -Path $TempDir -Name $pattern -Recurse -Force -ErrorAction SilentlyContinue
    foreach ($item in $items) {
        $fullPath = Join-Path $TempDir $item
        if (Test-Path $fullPath) {
            Remove-Item $fullPath -Recurse -Force
            Write-Host "Removed: $item" -ForegroundColor Gray
        }
    }
}

# Create .env.production from template
$envContent = @"
# Database Configuration
DB_HOST=localhost
DB_USER=aimevent_admin
DB_PASSWORD=badBOY@2010
DB_NAME=aimevent_aim3_registrations
DB_PORT=3306

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=bboslama@gmail.com
EMAIL_PASS=jpbi sqib iwuk pbno

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_production_nextauth_secret_here
NEXTAUTH_URL=https://yourdomain.com

# File Upload Configuration
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=10485760

# Production Environment
NODE_ENV=production
PORT=3000
"@

$envContent | Out-File -FilePath (Join-Path $TempDir ".env.production") -Encoding UTF8

Write-Host "✅ Files prepared for upload" -ForegroundColor Green
Write-Host ""

# Upload files to server
Write-Host "📤 Uploading files to server..." -ForegroundColor Yellow
Write-Host "This may take several minutes depending on your connection..." -ForegroundColor Gray

try {
    # Create remote directory if it doesn't exist
    Write-Host "Creating remote directory..." -ForegroundColor Gray
    ssh $Username@$ServerIP "mkdir -p $RemotePath"
    
    # Upload files
    scp -r "$TempDir\*" "$Username@$ServerIP`:$RemotePath/"
    
    Write-Host "✅ Files uploaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up temp directory
Remove-Item $TempDir -Recurse -Force

Write-Host ""
Write-Host "🎉 Upload completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps on your server:" -ForegroundColor Yellow
Write-Host "1. SSH into your server: ssh $Username@$ServerIP" -ForegroundColor White
Write-Host "2. Navigate to app directory: cd $RemotePath" -ForegroundColor White
Write-Host "3. Install dependencies: npm install --production" -ForegroundColor White
Write-Host "4. Build the application: npm run build" -ForegroundColor White
Write-Host "5. Initialize database: npm run init-db" -ForegroundColor White
Write-Host "6. Start with PM2: pm2 start ecosystem.config.js --env production" -ForegroundColor White
Write-Host "7. Save PM2 config: pm2 save && pm2 startup" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Don't forget to:" -ForegroundColor Yellow
Write-Host "- Update .env.production with your actual values" -ForegroundColor White
Write-Host "- Replace 'yourdomain.com' with your actual domain" -ForegroundColor White
Write-Host "- Generate a strong NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "- Add your OpenAI API key" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your application is ready to be deployed!" -ForegroundColor Green

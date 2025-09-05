# PowerShell script to deploy AIM3 to Netlify

Write-Host "🚀 Deploying AIM3 to Netlify with Supabase..." -ForegroundColor Green

# Check if Netlify CLI is installed
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Build the application
Write-Host "📦 Building application..." -ForegroundColor Blue
npm run build:netlify

# Deploy to Netlify
Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Blue
netlify deploy --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Your app is now live on Netlify with Supabase integration!" -ForegroundColor Cyan

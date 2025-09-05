# Supabase MCP Setup Script
# This script helps configure the Supabase MCP server for your project

Write-Host "🚀 Setting up Supabase MCP Configuration" -ForegroundColor Green
Write-Host ""

# Check if npx is available
try {
    $npxVersion = npx --version
    Write-Host "✅ NPX is available: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPX is not available. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install the Supabase MCP server
Write-Host "📦 Installing Supabase MCP server..." -ForegroundColor Yellow
try {
    npx -y @supabase/mcp-server-supabase@latest --help
    Write-Host "✅ Supabase MCP server installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Supabase MCP server" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configuration Steps:" -ForegroundColor Cyan
Write-Host "1. Get your Personal Access Token from Supabase Dashboard" -ForegroundColor White
Write-Host "   - Go to: https://supabase.com/dashboard/account/tokens" -ForegroundColor Gray
Write-Host "   - Create a new token with appropriate permissions" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update the mcp-config.json file:" -ForegroundColor White
Write-Host "   - Replace <personal-access-token> with your actual token" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Update the .env.supabase file:" -ForegroundColor White
Write-Host "   - Replace <your-anon-key> with your Supabase anon key" -ForegroundColor Gray
Write-Host "   - Replace <your-service-role-key> with your service role key" -ForegroundColor Gray
Write-Host "   - Replace <your-personal-access-token> with your personal access token" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test the configuration:" -ForegroundColor White
Write-Host "   - Run: npx @supabase/mcp-server-supabase@latest --project-ref=tcmmloypcovltgciocdm --read-only" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Your Supabase Project Details:" -ForegroundColor Cyan
Write-Host "Project URL: https://supabase.com/dashboard/project/tcmmloypcovltgciocdm" -ForegroundColor White
Write-Host "Project Reference: tcmmloypcovltgciocdm" -ForegroundColor White
Write-Host "Supabase URL: https://tcmmloypcovltgciocdm.supabase.co" -ForegroundColor White
Write-Host ""

Write-Host "Setup complete! Follow the configuration steps above." -ForegroundColor Green

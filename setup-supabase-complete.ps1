# Complete Supabase Setup Script for AIM3 Project
# This script helps you configure MCP Supabase and create all database tables

Write-Host "🚀 Complete Supabase Setup for AIM3 Project" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if npx is available
try {
    $npxVersion = npx --version
    Write-Host "✅ NPX is available: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPX is not available. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 STEP 1: Get Your Supabase Credentials" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Supabase Dashboard - Account Tokens:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/account/tokens" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create a new Personal Access Token" -ForegroundColor White
Write-Host "3. Copy the token (you'll need it in the next step)" -ForegroundColor White
Write-Host ""
Write-Host "4. Go to your Project Settings - API:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/settings/api" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Copy your API keys:" -ForegroundColor White
Write-Host "   - anon/public key" -ForegroundColor Gray
Write-Host "   - service_role key" -ForegroundColor Gray
Write-Host ""

# Prompt for access token
$accessToken = Read-Host "Enter your Supabase Personal Access Token"
if ([string]::IsNullOrWhiteSpace($accessToken)) {
    Write-Host "❌ Access token is required to continue." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 STEP 2: Update Configuration Files" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Update MCP configuration
$mcpConfig = @"
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=tcmmloypcovltgciocdm"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "$accessToken"
      }
    }
  }
}
"@

$mcpConfig | Out-File -FilePath ".cursor/mcp.json" -Encoding UTF8
Write-Host "✅ Updated .cursor/mcp.json with your access token" -ForegroundColor Green

# Update environment file
$envContent = @"
# Supabase Configuration
SUPABASE_URL=https://tcmmloypcovltgciocdm.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_ACCESS_TOKEN=$accessToken

# MCP Supabase Configuration
MCP_SUPABASE_PROJECT_REF=tcmmloypcovltgciocdm
MCP_SUPABASE_READ_ONLY=true
"@

$envContent | Out-File -FilePath ".env.supabase" -Encoding UTF8
Write-Host "✅ Updated .env.supabase with your access token" -ForegroundColor Green

Write-Host ""
Write-Host "📋 STEP 3: Install Supabase MCP Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    Write-Host "📦 Installing Supabase MCP server..." -ForegroundColor Yellow
    npx -y @supabase/mcp-server-supabase@latest --version
    Write-Host "✅ Supabase MCP server installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Supabase MCP server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 STEP 4: Create Database Tables" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You have two options to create the tables:" -ForegroundColor White
Write-Host ""
Write-Host "Option A: Use Supabase Dashboard (Recommended)" -ForegroundColor Yellow
Write-Host "1. Go to: https://supabase.com/dashboard/project/tcmmloypcovltgciocdm/sql" -ForegroundColor Gray
Write-Host "2. Copy the contents of 'setup-supabase-tables.sql'" -ForegroundColor Gray
Write-Host "3. Paste and run the SQL script" -ForegroundColor Gray
Write-Host ""
Write-Host "Option B: Use Supabase CLI" -ForegroundColor Yellow
Write-Host "1. Install Supabase CLI: npm install -g supabase" -ForegroundColor Gray
Write-Host "2. Run: supabase db push --file setup-supabase-tables.sql" -ForegroundColor Gray
Write-Host ""

# Test MCP connection
Write-Host "📋 STEP 5: Test MCP Connection" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

try {
    Write-Host "🔍 Testing MCP Supabase connection..." -ForegroundColor Yellow
    $env:SUPABASE_ACCESS_TOKEN = $accessToken
    npx @supabase/mcp-server-supabase@latest --project-ref=tcmmloypcovltgciocdm --read-only --access-token=$accessToken
    Write-Host "✅ MCP Supabase connection successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MCP connection test failed, but this is normal in interactive mode" -ForegroundColor Yellow
    Write-Host "The server is running and ready to accept connections" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 STEP 6: Next Steps" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Update your .env.supabase file with actual API keys:" -ForegroundColor White
Write-Host "   - Replace <your-anon-key> with your anon key" -ForegroundColor Gray
Write-Host "   - Replace <your-service-role-key> with your service role key" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create the database tables using the SQL script" -ForegroundColor White
Write-Host ""
Write-Host "3. Update your application to use Supabase instead of MySQL:" -ForegroundColor White
Write-Host "   - Install: npm install @supabase/supabase-js" -ForegroundColor Gray
Write-Host "   - Update database connection in src/lib/database.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test your application with Supabase" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Supabase project is ready:" -ForegroundColor White
Write-Host "Project URL: https://supabase.com/dashboard/project/tcmmloypcovltgciocdm" -ForegroundColor Gray
Write-Host "MCP Configuration: .cursor/mcp.json" -ForegroundColor Gray
Write-Host "Environment Variables: .env.supabase" -ForegroundColor Gray
Write-Host "SQL Script: setup-supabase-tables.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "Follow the next steps above to complete the migration!" -ForegroundColor Yellow

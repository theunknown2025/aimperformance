#!/bin/bash

echo "🚀 Deploying AIM3 to Netlify with Supabase..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build the application
echo "📦 Building application..."
npm run build:netlify

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo "🔗 Your app is now live on Netlify with Supabase integration!"

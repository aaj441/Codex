#!/bin/bash

# Railway Deployment Analyzer Setup Script
# ========================================

echo "🚀 Setting up Railway Deployment Analyzer"
echo "========================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if Railway CLI is installed
echo "🔍 Checking for Railway CLI..."
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI is installed"
    echo "   Run 'railway login' to authenticate"
else
    echo "⚠️  Railway CLI not found"
    echo "   Install with: npm install -g @railway/cli"
    echo "   Then run: railway login"
fi

# Make scripts executable
chmod +x railway_deployment_analyzer.py
chmod +x railway_config_helper.py
chmod +x test_analyzer.py

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get a GitHub Personal Access Token from: https://github.com/settings/tokens"
echo "2. Run the analyzer: python3 railway_deployment_analyzer.py --github-user YOUR_USERNAME"
echo "3. Or test it first: python3 test_analyzer.py"
echo ""
echo "📚 For more help, see: RAILWAY_ANALYZER_README.md"
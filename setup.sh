#!/bin/bash

# GitHub Automation Framework Setup Script
# This script helps you set up the project quickly

echo "🚀 GitHub Automation Framework Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✓ Playwright browsers installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f "tests/.env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example tests/.env
    echo "✓ .env file created at tests/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit tests/.env and add your GitHub credentials:"
    echo "   - GITHUB_USERNAME"
    echo "   - GITHUB_PASSWORD"
    echo "   - GITHUB_TOKEN"
    echo ""
    echo "   To get a token, visit:"
    echo "   https://github.com/settings/tokens"
    echo ""
else
    echo "✓ .env file already exists"
    echo ""
fi

# Create directories if they don't exist
mkdir -p tests/.auth
mkdir -p tests/logs
mkdir -p screenshots
mkdir -p test-results

echo "✓ Directory structure created"
echo ""

echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Edit tests/.env with your GitHub credentials"
echo "   2. Run: npm test"
echo "   3. View report: npm run test:report"
echo ""
echo "For detailed instructions, see:"
echo "   - README.md (complete documentation)"
echo "   - QUICK_START.md (quick start guide)"
echo ""
echo "Happy testing! 🎉"

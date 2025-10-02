#!/bin/bash

echo "🚀 Pushing CCIP data to GitHub..."

# Get the current directory
CURRENT_DIR="/Users/dtbdesign/Downloads/cciptracker"

# Navigate to the directory
cd "$CURRENT_DIR"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
git add .

# Create commit with current date
COMMIT_MSG="📊 Update CCIP data - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"

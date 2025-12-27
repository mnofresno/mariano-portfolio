#!/bin/bash

# Setup script for RenderCV
# This script sets up the Python virtual environment and installs RenderCV

set -e  # Exit on any error

echo "🚀 Setting up RenderCV environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install it first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ Error: pip3 is not installed. Please install it first."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Update pip
echo "⬆️  Updating pip..."
pip install --upgrade pip

# Install RenderCV with all dependencies
echo "📥 Installing RenderCV..."
pip install "rendercv[full]"

echo ""
echo "✅ Installation completed!"
echo ""
echo "To use RenderCV:"
echo "  1. Activate the virtual environment: source venv/bin/activate"
echo "  2. Edit the files cv-en.yaml (English) and cv-es.yaml (Spanish) with your information"
echo "  3. Run ./generate.sh to generate the PDFs"
echo "     - ./generate.sh        # Generate both CVs"
echo "     - ./generate.sh en     # Generate English CV only"
echo "     - ./generate.sh es    # Generate Spanish CV only"
echo ""

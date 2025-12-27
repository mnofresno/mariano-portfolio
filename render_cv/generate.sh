#!/bin/bash

# Script to generate CV in PDF using RenderCV
# This script activates the virtual environment and generates PDF from YAML files
# Usage: ./generate.sh [en|es|both]
#   - en: Generate English CV only
#   - es: Generate Spanish CV only
#   - both or no argument: Generate both CVs

set -e  # Exit on any error

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment does not exist."
    echo "   Please run first: ./setup.sh"
    exit 1
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Check if RenderCV is installed
if ! command -v rendercv &> /dev/null; then
    echo "❌ Error: RenderCV is not installed."
    echo "   Please run first: ./setup.sh"
    exit 1
fi

# Get language parameter (default: both)
LANG_PARAM="${1:-both}"

# Function to generate CV
generate_cv() {
    local yaml_file=$1
    local lang_name=$2
    
    if [ ! -f "$yaml_file" ]; then
        echo "⚠️  Warning: File $yaml_file does not exist. Skipping..."
        return 1
    fi
    
    echo "📄 Generating $lang_name CV from $yaml_file..."
    rendercv render "$yaml_file"
    echo "✅ $lang_name CV generated successfully!"
    echo ""
}

# Generate CVs based on parameter
case "$LANG_PARAM" in
    en)
        echo "🌐 Generating English CV only..."
        echo ""
        generate_cv "cv-en.yaml" "English"
        ;;
    es)
        echo "🌐 Generating Spanish CV only..."
        echo ""
        generate_cv "cv-es.yaml" "Spanish"
        ;;
    both|"")
        echo "🌐 Generating both CVs (English and Spanish)..."
        echo ""
        generate_cv "cv-en.yaml" "English"
        generate_cv "cv-es.yaml" "Spanish"
        ;;
    *)
        echo "❌ Error: Invalid language parameter."
        echo ""
        echo "Usage: ./generate.sh [en|es|both]"
        echo "  en   - Generate English CV only"
        echo "  es   - Generate Spanish CV only"
        echo "  both - Generate both CVs (default)"
        exit 1
        ;;
esac

echo "✅ All CVs generated successfully!"
echo ""
echo "The PDFs and other files are in the folder: rendercv_output/"
echo ""

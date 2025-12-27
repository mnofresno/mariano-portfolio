#!/bin/bash

# Script to generate CV in PDF using RenderCV
# This script activates the virtual environment and generates PDF from YAML files
# Usage: ./generate.sh [en|es|both|all] [variant]
#   - en: Generate English CV only
#   - es: Generate Spanish CV only
#   - both: Generate both CVs (default, general version)
#   - all: Generate all variants (dev, lead, iot) for both languages
#   - variant: dev, lead, iot (optional, for specific variant)

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
VARIANT="${2:-}"

# Function to generate CV
generate_cv() {
    local yaml_file=$1
    local lang_name=$2
    local lang_code=$3
    
    if [ ! -f "$yaml_file" ]; then
        echo "⚠️  Warning: File $yaml_file does not exist. Skipping..."
        return 1
    fi
    
    echo "📄 Generating $lang_name CV from $yaml_file..."
    
    # Generate with language-specific output paths to avoid overwriting
    rendercv render "$yaml_file" \
        --pdf-path "rendercv_output/CV-${lang_code}.pdf" \
        --markdown-path "rendercv_output/CV-${lang_code}.md" \
        --html-path "rendercv_output/CV-${lang_code}.html" \
        --typst-path "rendercv_output/CV-${lang_code}.typ" \
        --png-path "rendercv_output/CV-${lang_code}.png"
    
    echo "✅ $lang_name CV generated successfully!"
    echo ""
}

# Generate CVs based on parameter
case "$LANG_PARAM" in
    en)
        if [ -n "$VARIANT" ]; then
            echo "🌐 Generating English CV ($VARIANT variant)..."
            echo ""
            generate_cv "cv-en-${VARIANT}.yaml" "English ($VARIANT)" "en-${VARIANT}"
        else
            echo "🌐 Generating English CV only..."
            echo ""
            generate_cv "cv-en.yaml" "English" "en"
        fi
        ;;
    es)
        if [ -n "$VARIANT" ]; then
            echo "🌐 Generating Spanish CV ($VARIANT variant)..."
            echo ""
            generate_cv "cv-es-${VARIANT}.yaml" "Spanish ($VARIANT)" "es-${VARIANT}"
        else
            echo "🌐 Generating Spanish CV only..."
            echo ""
            generate_cv "cv-es.yaml" "Spanish" "es"
        fi
        ;;
    both|"")
        echo "🌐 Generating both CVs (English and Spanish)..."
        echo ""
        generate_cv "cv-en.yaml" "English" "en"
        generate_cv "cv-es.yaml" "Spanish" "es"
        ;;
    all)
        echo "🌐 Generating all CV variants (English and Spanish)..."
        echo ""
        # General versions
        generate_cv "cv-en.yaml" "English (General)" "en"
        generate_cv "cv-es.yaml" "Spanish (General)" "es"
        # Development variants
        generate_cv "cv-en-dev.yaml" "English (Development)" "en-dev"
        generate_cv "cv-es-dev.yaml" "Spanish (Desarrollo)" "es-dev"
        # Tech Lead variants
        generate_cv "cv-en-lead.yaml" "English (Tech Lead)" "en-lead"
        generate_cv "cv-es-lead.yaml" "Spanish (Líder Técnico)" "es-lead"
        # IoT variants
        generate_cv "cv-en-iot.yaml" "English (IoT)" "en-iot"
        generate_cv "cv-es-iot.yaml" "Spanish (IoT)" "es-iot"
        ;;
    *)
        echo "❌ Error: Invalid language parameter."
        echo ""
        echo "Usage: ./generate.sh [en|es|both|all] [variant]"
        echo "  en      - Generate English CV only"
        echo "  es      - Generate Spanish CV only"
        echo "  both    - Generate both CVs (default, general version)"
        echo "  all     - Generate all variants (dev, lead, iot) for both languages"
        echo "  variant - dev, lead, iot (optional, for specific variant)"
        exit 1
        ;;
esac

echo "✅ All CVs generated successfully!"
echo ""
echo "The PDFs and other files are in the folder: rendercv_output/"
if [ "$LANG_PARAM" = "all" ]; then
    echo ""
    echo "Generated files:"
    echo "  English: CV-en.pdf, CV-en-dev.pdf, CV-en-lead.pdf, CV-en-iot.pdf"
    echo "  Spanish: CV-es.pdf, CV-es-dev.pdf, CV-es-lead.pdf, CV-es-iot.pdf"
elif [ "$LANG_PARAM" = "both" ] || [ -z "$LANG_PARAM" ]; then
    echo ""
    echo "Generated files:"
    echo "  - CV-en.pdf (English)"
    echo "  - CV-es.pdf (Spanish)"
fi
echo ""

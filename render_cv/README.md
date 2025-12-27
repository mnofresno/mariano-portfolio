# RenderCV - Resume Generator

This directory contains the configuration to generate your Curriculum Vitae in PDF format using [RenderCV](https://docs.rendercv.com/), an open source tool that allows you to create professional CVs from YAML files.

## 🚀 Quick Start

### 1. Installation

Run the setup script to configure the environment:

```bash
cd render_cv
chmod +x setup.sh
./setup.sh
```

This script:
- Creates a Python virtual environment
- Installs RenderCV with all its dependencies
- Sets up everything needed to generate CVs

### 2. Edit Your CV

Edit the YAML files with your personal information:

- **cv-en.yaml**: English version of your CV
- **cv-es.yaml**: Spanish version of your CV

```bash
nano cv-en.yaml  # Edit English version
nano cv-es.yaml  # Edit Spanish version
# or use your favorite editor
```

The YAML files contain all typical CV sections:
- Personal information (name, email, phone, etc.)
- Social profiles (GitHub, LinkedIn)
- Professional summary
- Education
- Work experience
- Technical skills
- Projects
- Languages
- Interests
- Certifications
- And more...

### 3. Generate the PDF

Once you've edited the YAML files, generate the PDFs:

```bash
chmod +x generate.sh
./generate.sh        # Generate both CVs (English and Spanish)
./generate.sh en     # Generate English CV only
./generate.sh es     # Generate Spanish CV only
```

The PDFs and other generated files will be in the `rendercv_output/` folder.

## 📋 File Structure

```
render_cv/
├── cv-en.yaml          # YAML file with your CV information in English
├── cv-es.yaml          # YAML file with your CV information in Spanish
├── setup.sh             # Installation script
├── generate.sh           # Script to generate PDFs
├── .gitignore           # Files to ignore in Git
├── README.md            # This file
└── venv/                # Virtual environment (created when running setup.sh)
```

## 🎨 Customization

### Change the Template

RenderCV comes with several templates. To see available ones:

```bash
source venv/bin/activate
rendercv list-templates
```

To use a specific template, edit the `design` section in the YAML files:

```yaml
design:
  color_scheme: blue      # blue, green, red, etc.
  page_size: A4           # A4, Letter
  font: Source Sans 3     # Different fonts available
  theme: modern           # modern, classic, etc.
  sidebar: left           # left, right
  accent_color: "#2563eb" # Custom color
  language: en            # en for English, es for Spanish
```

### See More Options

To see all available options:

```bash
source venv/bin/activate
rendercv --help
rendercv render --help
```

## 📚 Documentation

- [Official RenderCV Documentation](https://docs.rendercv.com/)
- [YAML Examples](https://docs.rendercv.com/user_guide/)
- [Available Templates](https://docs.rendercv.com/templates/)

## 🔄 Workflow

1. **Edit**: Modify `cv-en.yaml` and/or `cv-es.yaml` with your updated information
2. **Generate**: Run `./generate.sh` to create the PDFs
3. **Review**: Open the PDFs in `rendercv_output/` to verify
4. **Repeat**: Go back to step 1 if you need to make changes

## 💡 Tips

- Keep the YAML files versioned in Git (but not the generated files)
- You can create multiple CV versions by changing the YAML file names
- RenderCV also generates HTML and Markdown in addition to PDF
- YAML format is sensitive to indentation, use spaces (not tabs)
- Make sure the `language` field in the `design` section matches the CV language:
  - `language: en` for English CVs
  - `language: es` for Spanish CVs

## 🐛 Troubleshooting

### Error: "rendercv: command not found"
- Make sure you've run `./setup.sh` first
- Activate the virtual environment: `source venv/bin/activate`

### Error: "Python 3 is not installed"
- Install Python 3.8 or higher
- On Ubuntu/Debian: `sudo apt install python3 python3-pip python3-venv`
- On macOS: `brew install python3`

### Error generating PDF
- Verify that the YAML files have correct syntax
- Check error messages in the console
- Make sure you have all dependencies installed: `pip install "rendercv[full]"`

### Language-specific issues
- Make sure the `language` field in the `design` section matches the CV content language
- English CV should have `language: en`
- Spanish CV should have `language: es`

## 📝 Notes

- Generated files in `rendercv_output/` are in `.gitignore` and won't be uploaded to Git
- The virtual environment `venv/` is also ignored
- Only the YAML files and scripts should be versioned
- Both YAML files (cv-en.yaml and cv-es.yaml) should be kept in sync with your information

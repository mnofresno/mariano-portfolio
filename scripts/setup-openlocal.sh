#!/bin/bash
# Setup completo para openlocal

echo "🚀 Configurando openlocal..."
echo "=============================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Verificar requisitos
echo "1. Verificando requisitos..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama no está instalado"
    echo "📥 Instalando Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# 2. Verificar modelos
echo "2. Verificando modelos de Ollama..."

if ! ollama list | grep -q "deepseek-coder"; then
    echo "📥 Descargando modelo deepseek-coder:latest..."
    ollama pull deepseek-coder:latest
fi

# 3. Hacer scripts ejecutables
echo "3. Configurando scripts..."

chmod +x "$SCRIPT_DIR/openlocal" 2>/dev/null
chmod +x "$SCRIPT_DIR/openlocal.py" 2>/dev/null
chmod +x "$SCRIPT_DIR/openlocal-v2.py" 2>/dev/null
chmod +x "$SCRIPT_DIR/install-openlocal.sh" 2>/dev/null
chmod +x "$SCRIPT_DIR/setup-openlocal.sh" 2>/dev/null

# 4. Configurar alias
echo "4. Configurando alias..."

# Detectar shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_RC="$HOME/.bash_profile"
    else
        SHELL_RC="$HOME/.bashrc"
    fi
    SHELL_NAME="bash"
else
    SHELL_RC="$HOME/.profile"
    SHELL_NAME="shell"
fi

ALIAS_CMD="alias openlocal='$SCRIPT_DIR/openlocal'"

# Agregar alias si no existe
if ! grep -q "alias openlocal=" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# Alias para openlocal - comandos con lenguaje natural" >> "$SHELL_RC"
    echo "$ALIAS_CMD" >> "$SHELL_RC"
    echo "✅ Alias agregado a $SHELL_RC"
else
    echo "✅ Alias ya existe en $SHELL_RC"
fi

# 5. Agregar al PATH
if [[ ":$PATH:" != *":$SCRIPT_DIR:"* ]]; then
    echo "" >> "$SHELL_RC"
    echo "# Agregar scripts al PATH" >> "$SHELL_RC"
    echo "export PATH=\"\$PATH:$SCRIPT_DIR\"" >> "$SHELL_RC"
    echo "✅ Scripts agregados al PATH"
fi

# 6. Mostrar resumen
echo ""
echo "🎉 Configuración completada!"
echo "=============================="
echo ""
echo "📋 Resumen:"
echo "  • Python3: ✅"
echo "  • Ollama: ✅"
echo "  • Modelo deepseek-coder: ✅"
echo "  • Scripts ejecutables: ✅"
echo "  • Alias 'openlocal': ✅"
echo "  • PATH configurado: ✅"
echo ""
echo "🚀 Para usar openlocal:"
echo ""
echo "1. Recarga tu configuración de shell:"
echo "   source $SHELL_RC"
echo ""
echo "2. Prueba estos ejemplos:"
echo "   openlocal --fast \"mi ip en la lan\""
echo "   openlocal --dry-run \"puerto 56000\""
echo "   openlocal \"procesos que usan mas memoria\""
echo "   openlocal --verbose \"espacio en disco\""
echo ""
echo "3. Modos disponibles:"
echo "   --fast      Usa comandos predefinidos (más rápido)"
echo "   --dry-run   Muestra comando sin ejecutar"
echo "   --verbose   Muestra detalles del proceso"
echo "   --model     Especifica modelo de Ollama"
echo ""
echo "📚 Documentación completa en:"
echo "   $SCRIPT_DIR/README-openlocal.md"
echo ""
echo "💡 Tip: Para comandos comunes, usa --fast para mayor velocidad"
echo ""
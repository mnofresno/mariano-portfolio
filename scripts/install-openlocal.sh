#!/bin/bash
# Instalador para openlocal

echo "🔧 Instalando openlocal..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENLOCAL_PATH="$SCRIPT_DIR/openlocal"

# Verificar que el script existe
if [ ! -f "$OPENLOCAL_PATH" ]; then
    echo "❌ Error: No se encontró $OPENLOCAL_PATH"
    exit 1
fi

# Hacer ejecutable
chmod +x "$OPENLOCAL_PATH"
chmod +x "$SCRIPT_DIR/openlocal.py"

# Detectar shell profile
if [ -n "$ZSH_VERSION" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_PROFILE="$HOME/.bash_profile"
    fi
    SHELL_NAME="bash"
else
    SHELL_PROFILE="$HOME/.profile"
    SHELL_NAME="shell"
fi

# Agregar alias al profile
ALIAS_LINE="alias openlocal='$OPENLOCAL_PATH'"

if grep -q "alias openlocal=" "$SHELL_PROFILE" 2>/dev/null; then
    echo "📝 Actualizando alias existente en $SHELL_PROFILE..."
    # Actualizar línea existente
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|alias openlocal=.*|$ALIAS_LINE|" "$SHELL_PROFILE"
    else
        sed -i "s|alias openlocal=.*|$ALIAS_LINE|" "$SHELL_PROFILE"
    fi
else
    echo "📝 Agregando alias a $SHELL_PROFILE..."
    echo "" >> "$SHELL_PROFILE"
    echo "# Alias para openlocal - comandos de consola con lenguaje natural" >> "$SHELL_PROFILE"
    echo "$ALIAS_LINE" >> "$SHELL_PROFILE"
fi

# También agregar al PATH por si acaso
if [[ ":$PATH:" != *":$SCRIPT_DIR:"* ]]; then
    echo "📝 Agregando $SCRIPT_DIR al PATH..."
    echo "" >> "$SHELL_PROFILE"
    echo "# Agregar scripts al PATH" >> "$SHELL_PROFILE"
    echo "export PATH=\"\$PATH:$SCRIPT_DIR\"" >> "$SHELL_PROFILE"
fi

echo ""
echo "✅ Instalación completada!"
echo ""
echo "Para usar openlocal:"
echo "1. Cierra y reabre tu terminal, o ejecuta:"
echo "   source $SHELL_PROFILE"
echo ""
echo "2. Usa openlocal con descripciones en lenguaje natural:"
echo "   openlocal \"decime cual es mi ip en la lan\""
echo "   openlocal \"quien usa el puerto 56000\""
echo "   openlocal --dry-run \"muestrame los procesos que más memoria usan\""
echo "   openlocal --verbose \"cuánto espacio libre tengo en disco\""
echo ""
echo "Opciones disponibles:"
echo "  --model MODELO    Usar un modelo específico de Ollama"
echo "  --dry-run         Mostrar comando sin ejecutarlo"
echo "  --verbose, -v     Mostrar información detallada"
echo ""
echo "Modelos disponibles en tu sistema:"
ollama list | head -10
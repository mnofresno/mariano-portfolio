# openlocal - Comandos de Consola con Lenguaje Natural

Un script que usa Ollama para ejecutar comandos de terminal basados en descripciones en lenguaje natural.

## Instalación

```bash
cd /Users/mariano.fresno/mariano-portfolio/scripts
./install-openlocal.sh
```

Luego cierra y reabre tu terminal, o ejecuta:
```bash
source ~/.zshrc  # o ~/.bashrc según tu shell
```

## Uso Básico

```bash
# Ejecutar un comando
openlocal "decime cual es mi ip en la lan"

# Ver qué comando se generaría sin ejecutarlo
openlocal --dry-run "quien usa el puerto 56000"

# Usar un modelo específico
openlocal --model qwen2.5-coder:7b "muestrame los procesos que más CPU usan"

# Modo verbose para ver detalles
openlocal --verbose "cuánto espacio libre tengo en disco"
```

## Ejemplos

| Descripción | Comando generado (ejemplo) |
|-------------|----------------------------|
| "decime cual es mi ip en la placa de red de la lan" | `ipconfig getifaddr en0 \|\| ifconfig en0 \| grep 'inet ' \| awk '{print \$2}'` |
| "decime quien usa el puerto 56000" | `lsof -i :56000 \|\| netstat -tulpn \| grep :56000` |
| "muestrame los procesos que más memoria usan" | `ps aux --sort=-%mem \| head -11` |
| "reinicia el servicio de docker" | `sudo systemctl restart docker \|\| sudo service docker restart` |
| "busca archivos .log modificados hoy" | `find . -name "*.log" -type f -mtime -1` |
| "muestra el uso de red en tiempo real" | `iftop \|\| nethogs` |

## Características

- ✅ **Seguro**: Pide confirmación antes de ejecutar comandos
- ✅ **Inteligente**: Usa el mejor modelo de codificación (deepseek-coder:latest por defecto)
- ✅ **Rápido**: Respuestas en segundos
- ✅ **Flexible**: Soporta múltiples modelos de Ollama
- ✅ **Cross-platform**: Funciona en macOS y Linux
- ✅ **Verbose**: Opción para ver detalles del proceso

## Modelos Recomendados

1. **deepseek-coder:latest** (default) - Mejor para generación de código/comandos
2. **qwen2.5-coder:7b** - Buen balance entre velocidad y calidad
3. **qwen3-coder:latest** - Más potente pero más lento

Ver todos tus modelos:
```bash
ollama list
```

## Opciones

```
openlocal [OPCIONES] "descripción del comando"

Opciones:
  --model MODELO    Usar un modelo específico de Ollama
  --dry-run         Mostrar el comando sin ejecutarlo
  --verbose, -v     Mostrar información detallada
  --help            Mostrar esta ayuda
```

## Requisitos

- Python 3.6+
- Ollama instalado y corriendo
- Modelos de Ollama descargados (al menos deepseek-coder:latest)

## Solución de Problemas

**Error: Ollama no está instalado**
```bash
# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

**Error: Modelo no encontrado**
```bash
# Descargar el modelo
ollama pull deepseek-coder:latest
```

**El comando no se ejecuta**
- Usa `--dry-run` primero para ver qué comando se generaría
- Verifica que tienes los permisos necesarios
- Algunos comandos requieren `sudo`

**Respuesta lenta**
- Usa un modelo más pequeño: `--model qwen2.5-coder:1.5b-base`
- Asegúrate que Ollama esté corriendo: `ollama serve`

## Archivos

- `openlocal.py` - Script principal en Python
- `openlocal` - Wrapper bash
- `install-openlocal.sh` - Instalador
- `README-openlocal.md` - Esta documentación

## Contribuir

Para modificar el comportamiento del sistema prompt, edita la variable `system_prompt` en `openlocal.py`.
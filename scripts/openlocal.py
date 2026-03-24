#!/usr/bin/env python3
"""
openlocal - Ejecuta comandos de consola usando lenguaje natural con Ollama
Uso: openlocal "descripción del comando en lenguaje natural"
"""

import subprocess
import sys
import json
import os
import re
import argparse
from pathlib import Path


def run_command(cmd, capture_output=True):
    """Ejecuta un comando y retorna el resultado"""
    try:
        if capture_output:
            result = subprocess.run(
                cmd, shell=True, capture_output=True, text=True, timeout=30
            )
            return result.returncode, result.stdout, result.stderr
        else:
            result = subprocess.run(cmd, shell=True, text=True, timeout=30)
            return result.returncode, "", ""
    except subprocess.TimeoutExpired:
        return 1, "", "Comando expiró después de 30 segundos"
    except Exception as e:
        return 1, "", str(e)


def get_ollama_response(prompt, model="deepseek-coder:latest"):
    """Obtiene respuesta de Ollama para generar comandos"""

    system_prompt = """Eres un asistente experto en sistemas Linux/macOS que genera comandos de terminal PRECISOS y EJECUTABLES.
REGLAS ESTRICTAS:
1. Generar EXACTAMENTE UN comando de terminal
2. El comando DEBE funcionar en el sistema operativo actual
3. Incluir manejo de errores (2>/dev/null) y alternativas (||)
4. NO usar 'sudo' a menos que sea absolutamente necesario
5. Los comandos deben ser SEGUROS y NO destructivos
6. Para macOS: usar comandos nativos como 'ipconfig', 'netstat', 'lsof'
7. Para Linux: usar comandos como 'ip', 'ss', 'netstat', 'lsof'
8. SIEMPRE usar el formato exacto: ```bash\ncomando\n```

EJEMPLOS PERFECTOS:
Usuario: "decime cual es mi ip en la placa de red de la lan"
Respuesta: ```bash
ipconfig getifaddr en0 2>/dev/null || ifconfig en0 2>/dev/null | grep 'inet ' | head -1 | awk '{print $2}' || echo "No se pudo obtener IP"
```

Usuario: "decime quien usa el puerto 56000"
Respuesta: ```bash
lsof -i :56000 2>/dev/null || (netstat -an 2>/dev/null | grep '.56000') || echo "Puerto 56000 no encontrado"
```

Usuario: "muestrame los procesos que más CPU usan"
Respuesta: ```bash
ps aux --sort=-%cpu 2>/dev/null | head -11 || top -l 1 -o cpu -n 10 2>/dev/null
```

Usuario: "cuánto espacio libre tengo en disco"
Respuesta: ```bash
df -h 2>/dev/null || diskutil list 2>/dev/null
```

IMPORTANTE: Solo el comando, sin explicaciones."""

    full_prompt = f"{system_prompt}\n\nUsuario: {prompt}\nRespuesta:"

    # Crear el payload para Ollama
    payload = {
        "model": model,
        "prompt": full_prompt,
        "stream": False,
        "options": {"temperature": 0.1, "num_predict": 200},
    }

    # Convertir a JSON y enviar a Ollama
    try:
        result = subprocess.run(
            ["ollama", "run", model],
            input=full_prompt,
            capture_output=True,
            text=True,
            timeout=60,
        )

        if result.returncode != 0:
            return None, f"Error en Ollama: {result.stderr}"

        response = result.stdout.strip()

        # Extraer el comando del código bash
        bash_match = re.search(r"```bash\s*(.+?)\s*```", response, re.DOTALL)
        if bash_match:
            command = bash_match.group(1).strip()
            # Limpiar comentarios y líneas extra
            lines = command.split("\n")
            clean_lines = []
            for line in lines:
                line = line.strip()
                # Eliminar líneas que son solo comentarios
                if line and not line.startswith("#") and "#" not in line:
                    clean_lines.append(line)
                # Si tiene comentario al final, tomar solo la parte antes del #
                elif "#" in line:
                    cmd_part = line.split("#")[0].strip()
                    if cmd_part:
                        clean_lines.append(cmd_part)

            if clean_lines:
                # Tomar solo la primera línea no vacía (el comando principal)
                command = clean_lines[0]
            else:
                command = command.split("\n")[0].strip()
        else:
            # Si no encuentra el formato, buscar la primera línea que parezca un comando
            lines = response.split("\n")
            for line in lines:
                line = line.strip()
                # Buscar líneas que parezcan comandos (no vacías, no comentarios, no marcadores)
                if (
                    line
                    and not line.startswith("```")
                    and not line.startswith("Usuario:")
                    and not line.startswith("Respuesta:")
                    and not line.startswith("#")
                    and len(line) > 3
                ):  # Evitar líneas muy cortas
                    # Limpiar si tiene comentario
                    if "#" in line:
                        line = line.split("#")[0].strip()
                    command = line
                    break
            else:
                # Último recurso: tomar la primera línea no vacía
                for line in lines:
                    if line.strip():
                        command = line.strip()
                        break
                else:
                    command = response.strip()

        return command, None

    except subprocess.TimeoutExpired:
        return None, "Ollama tardó demasiado en responder"
    except Exception as e:
        return None, f"Error: {str(e)}"


def get_system_info():
    """Obtiene información del sistema para contexto"""
    system_info = {}

    # Detectar sistema operativo
    if sys.platform == "darwin":
        system_info["os"] = "macOS"
    elif sys.platform.startswith("linux"):
        system_info["os"] = "Linux"
    else:
        system_info["os"] = sys.platform

    # Obtener interfaces de red
    try:
        if system_info["os"] == "macOS":
            result = subprocess.run(["ifconfig", "-l"], capture_output=True, text=True)
            if result.returncode == 0:
                system_info["interfaces"] = result.stdout.strip().split()
        else:
            result = subprocess.run(
                ["ip", "-o", "link", "show"], capture_output=True, text=True
            )
            if result.returncode == 0:
                interfaces = []
                for line in result.stdout.split("\n"):
                    if ":" in line:
                        parts = line.split(":")
                        if len(parts) > 1:
                            interfaces.append(parts[1].strip())
                system_info["interfaces"] = interfaces
    except:
        system_info["interfaces"] = []

    return system_info


def main():
    parser = argparse.ArgumentParser(
        description="Ejecuta comandos de consola usando lenguaje natural"
    )
    parser.add_argument(
        "query", nargs="+", help="Descripción del comando en lenguaje natural"
    )
    parser.add_argument(
        "--model", default="deepseek-coder:latest", help="Modelo de Ollama a usar"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Mostrar el comando sin ejecutarlo"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Mostrar información detallada"
    )

    args = parser.parse_args()
    query = " ".join(args.query)

    if args.verbose:
        print(f"🔍 Consulta: {query}")
        print(f"🤖 Modelo: {args.model}")

    # Obtener información del sistema para contexto
    system_info = get_system_info()
    if args.verbose:
        print(f"💻 Sistema: {system_info['os']}")
        if system_info.get("interfaces"):
            print(f"📡 Interfaces: {', '.join(system_info['interfaces'][:3])}...")

    # Obtener el comando de Ollama
    print("🧠 Generando comando...")
    command, error = get_ollama_response(query, args.model)

    if error:
        print(f"❌ Error: {error}")
        sys.exit(1)

    if not command:
        print("❌ No se pudo generar un comando válido")
        sys.exit(1)

    print(f"📝 Comando generado:\n   {command}")

    if args.dry_run:
        print("🚫 Dry-run: comando no ejecutado")
        sys.exit(0)

    # Preguntar confirmación antes de ejecutar
    print("\n⚠️  ¿Ejecutar este comando? (s/n): ", end="")
    response = input().strip().lower()

    if response not in ["s", "si", "y", "yes"]:
        print("❌ Comando cancelado")
        sys.exit(0)

    # Ejecutar el comando
    print("🚀 Ejecutando comando...\n")
    print("=" * 60)

    returncode, stdout, stderr = run_command(command, capture_output=True)

    if stdout:
        print(stdout)

    if stderr:
        print(f"\n⚠️  Errores:\n{stderr}", file=sys.stderr)

    print("=" * 60)

    if returncode != 0:
        print(f"❌ Comando falló con código: {returncode}")
        sys.exit(returncode)
    else:
        print("✅ Comando ejecutado exitosamente")


if __name__ == "__main__":
    main()

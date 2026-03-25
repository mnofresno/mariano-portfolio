#!/usr/bin/env python3
"""
openlocal v2 - Versión mejorada con fallback y comandos más robustos
"""

import subprocess
import sys
import re
import argparse


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


def get_builtin_command(prompt):
    """Comandos predefinidos para casos comunes (fallback)"""
    prompt_lower = prompt.lower()

    # Mapeo de comandos comunes
    command_map = {
        # IP y red
        "ip": "ipconfig getifaddr en0 2>/dev/null || ifconfig en0 2>/dev/null | grep \"inet \" | awk '{print $2}'",
        "direccion ip": "ipconfig getifaddr en0 2>/dev/null || ifconfig en0 2>/dev/null | grep \"inet \" | awk '{print $2}'",
        "mi ip": "curl -s ifconfig.me 2>/dev/null || dig +short myip.opendns.com @resolver1.opendns.com 2>/dev/null",
        # Puertos
        "puerto": lambda x: (
            f'lsof -i :{extract_port(x)} 2>/dev/null || netstat -an 2>/dev/null | grep ":{extract_port(x)}"'
        ),
        "puerto 56000": 'lsof -i :56000 2>/dev/null || netstat -an 2>/dev/null | grep ".56000"',
        # Procesos
        "procesos": "ps aux --sort=-%cpu 2>/dev/null | head -11",
        "cpu": "top -l 1 -o cpu -n 10 2>/dev/null | head -20",
        "memoria": "ps aux --sort=-%mem 2>/dev/null | head -11",
        # Disco
        "disco": "df -h 2>/dev/null",
        "espacio": "df -h 2>/dev/null",
        # Docker
        "docker": 'docker ps 2>/dev/null || echo "Docker no está corriendo"',
        "contenedores": "docker ps -a 2>/dev/null",
        # Sistema
        "uptime": "uptime",
        "memoria libre": "free -h 2>/dev/null || vm_stat 2>/dev/null",
        "temperatura": 'sudo powermetrics --samplers smc 2>/dev/null | grep -i temperature || echo "No disponible"',
    }

    # Buscar coincidencias
    for key, cmd in command_map.items():
        if key in prompt_lower:
            if callable(cmd):
                return cmd(prompt)
            return cmd

    return None


def extract_port(prompt):
    """Extrae número de puerto del prompt"""
    match = re.search(r"puerto\s+(\d+)", prompt.lower())
    if match:
        return match.group(1)

    # Buscar cualquier número de 4-5 dígitos (puertos comunes)
    match = re.search(r"\b(\d{4,5})\b", prompt)
    if match:
        return match.group(1)

    return ""


def get_ollama_command(prompt, model="deepseek-coder:latest"):
    """Obtiene comando de Ollama con prompt optimizado"""

    system_prompt = """GENERA EXACTAMENTE UN COMANDO DE BASH para esta tarea.
REGLAS:
1. SOLO el comando, sin explicaciones
2. Usar manejo de errores: 2>/dev/null
3. Usar alternativas: || 
4. Para macOS: ipconfig, ifconfig, lsof, netstat
5. Para Linux: ip, ss, lsof, netstat
6. EVITAR sudo a menos que sea necesario

EJEMPLOS:
Tarea: "mi ip en la lan"
Comando: ipconfig getifaddr en0 2>/dev/null || ifconfig en0 2>/dev/null | grep "inet " | awk '{print $2}'

Tarea: "puerto 56000"
Comando: lsof -i :56000 2>/dev/null || netstat -an 2>/dev/null | grep ".56000"

Tarea: "procesos que usan mas cpu"
Comando: ps aux --sort=-%cpu 2>/dev/null | head -11

Tarea: "espacio en disco"
Comando: df -h 2>/dev/null

AHORA GENERA EL COMANDO PARA ESTA TAREA:"""

    full_prompt = f'{system_prompt}\nTarea: "{prompt}"\nComando:'

    try:
        result = subprocess.run(
            ["ollama", "run", model],
            input=full_prompt,
            capture_output=True,
            text=True,
            timeout=45,
        )

        if result.returncode != 0:
            return None

        response = result.stdout.strip()

        # Extraer primera línea que parezca comando
        lines = response.split("\n")
        for line in lines:
            line = line.strip()
            # Filtrar líneas vacías, comentarios, etc.
            if (
                line
                and not line.startswith("```")
                and not line.startswith("Tarea:")
                and not line.startswith("Comando:")
                and not line.startswith("#")
                and len(line) > 5
            ):
                # Limpiar si tiene comentario
                if "#" in line:
                    line = line.split("#")[0].strip()
                return line

        return response.split("\n")[0].strip() if response else None

    except Exception:
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Ejecuta comandos con lenguaje natural"
    )
    parser.add_argument("query", nargs="+", help="Descripción del comando")
    parser.add_argument(
        "--model", default="deepseek-coder:latest", help="Modelo de Ollama"
    )
    parser.add_argument("--dry-run", action="store_true", help="Mostrar sin ejecutar")
    parser.add_argument(
        "--fast", action="store_true", help="Usar solo comandos predefinidos"
    )
    parser.add_argument("--verbose", "-v", action="store_true", help="Modo detallado")

    args = parser.parse_args()
    query = " ".join(args.query)

    if args.verbose:
        print(f"🔍 Consulta: {query}")

    # 1. Primero intentar con comandos predefinidos (más rápido)
    if args.fast:
        print("⚡ Usando modo rápido (comandos predefinidos)...")
        command = get_builtin_command(query)
        if command:
            print(f"📝 Comando: {command}")

            if args.dry_run:
                print("🚫 Dry-run: comando no ejecutado")
                return

            # Ejecutar directamente (comandos predefinidos son seguros)
            print("🚀 Ejecutando...\n")
            returncode, stdout, stderr = run_command(command)

            if stdout:
                print(stdout)
            if stderr:
                print(f"⚠️  {stderr}")

            return

    # 2. Intentar con Ollama
    print("🧠 Consultando a Ollama...")
    command = get_ollama_command(query, args.model)

    if not command:
        # 3. Fallback a comandos predefinidos
        print("⚠️  Ollama no respondió, usando comando predefinido...")
        command = get_builtin_command(query)
        if not command:
            print("❌ No se pudo generar un comando para esta consulta")
            return

    print(f"📝 Comando: {command}")

    if args.dry_run:
        print("🚫 Dry-run: comando no ejecutado")
        return

    # Confirmación para comandos generados por IA
    print("\n⚠️  ¿Ejecutar este comando? (s/n): ", end="")
    response = input().strip().lower()

    if response not in ["s", "si", "y", "yes"]:
        print("❌ Cancelado")
        return

    print("🚀 Ejecutando...\n")
    returncode, stdout, stderr = run_command(command)

    if stdout:
        print(stdout)

    if stderr:
        print(f"\n⚠️  Errores:\n{stderr}")

    if returncode != 0:
        print(f"❌ Comando falló (código: {returncode})")


if __name__ == "__main__":
    main()

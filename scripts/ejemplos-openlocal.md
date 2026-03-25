# Ejemplos Prácticos de openlocal

## Comandos de Red
```bash
# IP local
openlocal --fast "mi ip en la lan"
openlocal "direccion ip de mi mac"

# Puertos
openlocal "quien usa el puerto 8080"
openlocal --dry-run "puerto 56000"
openlocal "puertos abiertos en mi maquina"

# Conexiones
openlocal "conexiones de red activas"
openlocal "estado de la red"
```

## Sistema y Procesos
```bash
# Procesos
openlocal --fast "procesos que mas cpu usan"
openlocal "procesos que mas memoria consumen"
openlocal "busca procesos de python"

# Sistema
openlocal "cuanto tiempo lleva encendida la maquina"
openlocal "temperatura del sistema"
openlocal "memoria libre disponible"
```

## Disco y Archivos
```bash
# Espacio
openlocal --fast "espacio en disco"
openlocal "cuanto espacio libre tengo"
openlocal "discos montados"

# Archivos
openlocal "archivos grandes en el directorio actual"
openlocal "busca archivos .log modificados hoy"
openlocal "cuantos archivos hay en esta carpeta"
```

## Docker y Contenedores
```bash
# Docker
openlocal "contenedores docker corriendo"
openlocal "estado de docker"
openlocal "imagenes de docker"

# Servicios
openlocal "servicios systemd activos"
openlocal "reinicia el servicio de nginx"
```

## Usuarios y Permisos
```bash
# Usuarios
openlocal "quien esta conectado ahora"
openlocal "usuarios logueados en el sistema"

# Permisos
openlocal "permisos del directorio actual"
openlocal "cambia permisos de este archivo a 755"
```

## Búsqueda y Filtrado
```bash
# Buscar
openlocal "busca la palabra 'error' en archivos .log"
openlocal "encuentra archivos con extension .py"
openlocal "filtrar logs por fecha"

# Grep y awk
openlocal "extrae las direcciones ip del archivo access.log"
openlocal "cuenta lineas en todos los archivos .txt"
```

## Scripting Avanzado
```bash
# Con pipes
openlocal "muestra las 10 lineas mas comunes en el log"
openlocal "ordenar procesos por uso de memoria"
openlocal "filtrar y formatear salida de docker ps"

# Automatización
openlocal "backup de la carpeta actual"
openlocal "monitorea uso de cpu cada 5 segundos"
openlocal "mata procesos zombie"
```

## Tips de Uso

### Modo Rápido (--fast)
```bash
# Usa comandos predefinidos - instantáneo
openlocal --fast "mi ip"
openlocal --fast "procesos"
openlocal --fast "disco"
```

### Modo Seguro (--dry-run)
```bash
# Verifica antes de ejecutar
openlocal --dry-run "elimina archivos temporales"
openlocal --dry-run "reinicia servicios"
```

### Verbose (--verbose)
```bash
# Ve qué está pasando
openlocal --verbose "analiza el sistema"
openlocal -v "diagnostico de red"
```

### Modelos Específicos
```bash
# Usa diferentes modelos
openlocal --model qwen2.5-coder:7b "comando complejo"
openlocal --model deepseek-coder:latest "script avanzado"
```

## Comandos Personalizados

Puedes extender openlocal editando `openlocal-v2.py` y agregando más comandos predefinidos en la función `get_builtin_command()`.

Ejemplo para agregar un comando personalizado:
```python
'backup': 'tar -czf backup-$(date +%Y%m%d).tar.gz . 2>/dev/null && echo "Backup creado"',
'limpiar cache': 'sudo rm -rf /var/cache/* 2>/dev/null && echo "Cache limpiado"',
```
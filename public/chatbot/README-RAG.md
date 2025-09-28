# Sistema RAG Chatbot para Portfolio de Mariano Fresno

## Descripción

Este sistema implementa un chatbot inteligente que utiliza técnicas de RAG (Retrieval-Augmented Generation) para responder preguntas sobre Mariano Fresno basándose en el contenido extraído automáticamente de su sitio web portfolio.

## Características Principales

### 🤖 Extracción Automática de Contenido
- **Información Personal**: Nombre, título profesional, edad, ciudad, fecha de nacimiento
- **Habilidades Técnicas**: Tecnologías, porcentajes de dominio, detalles específicos
- **Servicios**: Servicios ofrecidos con descripciones
- **Información de Contacto**: Email, teléfono, redes sociales
- **Experiencia Profesional**: Historial laboral y proyectos
- **Información "About"**: Descripción personal y profesional

### 🧠 Sistema RAG Inteligente
- **Vectorización**: Convierte el contenido en embeddings para búsqueda semántica
- **Búsqueda por Similitud**: Encuentra información relevante usando similitud coseno
- **Respuestas Contextuales**: Genera respuestas basadas en el contenido extraído
- **Fallback Inteligente**: Sistema de respuestas de respaldo si falla el modelo principal

### 🔧 Tecnologías Utilizadas
- **JavaScript Vanilla**: Sin dependencias externas pesadas
- **ONNX.js**: Framework para ejecutar modelos de IA localmente
- **Embeddings Simples**: Sistema de vectorización ligero
- **Búsqueda Semántica**: Algoritmo de similitud coseno

## Estructura de Archivos

```
public/chatbot/
├── chatbot-rag.js          # Sistema RAG principal
├── chatbot-widget.js       # Widget del chatbot (modificado)
├── test-rag.html          # Página de prueba
└── README-RAG.md          # Esta documentación
```

## Cómo Funciona

### 1. Extracción de Contenido
El sistema analiza automáticamente el DOM del sitio web y extrae:
- Texto de elementos específicos (IDs y clases)
- Enlaces sociales
- Información de contacto
- Habilidades y servicios
- Experiencia profesional

### 2. Procesamiento de Datos
- Convierte el contenido extraído en una base de conocimiento estructurada
- Genera embeddings para cada documento
- Crea un índice de búsqueda semántica

### 3. Generación de Respuestas
- Analiza la consulta del usuario
- Busca documentos relevantes usando similitud coseno
- Genera respuestas contextuales basadas en el contenido encontrado

## Uso

### Integración en el Sitio Web
El sistema se integra automáticamente con el chatbot existente:

```html
<!-- En index.html -->
<script src="/chatbot/chatbot-rag.js"></script>
<script type="module" src="/chatbot/chatbot-widget.js"></script>
```

### Página de Prueba
Accede a `/chatbot/test-rag.html` para probar el sistema de forma independiente.

### Ejemplos de Preguntas
- "¿Quién es Mariano Fresno?"
- "¿Cuáles son sus habilidades técnicas?"
- "¿Qué servicios ofrece?"
- "¿Cómo puedo contactarlo?"
- "¿Cuál es su experiencia profesional?"

## Configuración

### Modo Demo (Por Defecto)
El chatbot funciona en modo demo usando el sistema RAG local.

### Modo Backend
Para usar un backend externo, modifica la configuración:

```javascript
initChatbotWidget({
  demoMode: false,
  backendUrl: 'https://tu-backend.com/chatbot'
});
```

## Personalización

### Agregar Nuevas Fuentes de Información
Modifica el método `extractWebsiteContent()` en `chatbot-rag.js`:

```javascript
extractCustomInfo() {
  // Tu lógica de extracción personalizada
  return customData;
}
```

### Mejorar las Respuestas
Edita el método `generateIntelligentResponse()` para personalizar las respuestas:

```javascript
generateIntelligentResponse(query, context) {
  // Tu lógica de generación de respuestas
  return customResponse;
}
```

## Limitaciones Actuales

1. **Modelo ONNX**: Actualmente usa un sistema de fallback en lugar del modelo Qwen 0.5B real
2. **Embeddings Simples**: Los embeddings son básicos, no usan un modelo de embeddings real
3. **Tokenización Básica**: La tokenización es simple, no usa un tokenizador real

## Mejoras Futuras

1. **Integración Real de Qwen 0.5B**: Implementar la carga real del modelo
2. **Embeddings Avanzados**: Usar un modelo de embeddings real
3. **Cache de Respuestas**: Implementar cache para respuestas frecuentes
4. **Análisis de Sentimiento**: Agregar análisis de sentimiento a las consultas
5. **Métricas de Uso**: Implementar tracking de consultas y respuestas

## Solución de Problemas

### El Chatbot No Responde
1. Verifica que `chatbot-rag.js` se esté cargando correctamente
2. Revisa la consola del navegador para errores
3. Asegúrate de que el contenido del sitio sea accesible

### Respuestas Incorrectas
1. Verifica que la extracción de contenido funcione correctamente
2. Revisa los selectores CSS en los métodos de extracción
3. Ajusta los umbrales de similitud en `findRelevantDocuments()`

### Rendimiento Lento
1. El sistema está optimizado para ser ligero
2. Considera implementar cache de respuestas
3. Optimiza la extracción de contenido para que sea más eficiente

## Licencia

Este sistema está diseñado específicamente para el portfolio de Mariano Fresno y utiliza tecnologías de código abierto.

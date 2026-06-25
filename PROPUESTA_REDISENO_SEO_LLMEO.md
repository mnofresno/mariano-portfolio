# Propuesta de rediseño para Mariano Fresno

## Objetivo

Reorientar el sitio para que no funcione solo como portfolio visual, sino como una máquina de autoridad y generación de oportunidades.

La meta es:

- vender mejor servicios de alto valor,
- mejorar descubrimiento orgánico,
- aumentar confianza antes del primer contacto,
- hacer que el contenido sea legible por humanos, buscadores y motores de respuesta basados en LLM.

## Diagnóstico

Con base en el repositorio actual, el sitio ya tiene buena señal técnica y una narrativa relativamente consistente, pero todavía presenta fricción para revenue y autoridad:

- el hero comunica capacidad, pero no una oferta comprable;
- faltan case studies con evidencia dura;
- la prueba social es débil o inexistente;
- hay rastros de plantilla en la base del sitio;
- el contenido está muy centrado en lo que hacés, pero menos en el resultado que compra un cliente;
- no hay una capa explícita de contenido optimizado para motores de respuesta tipo LLM.

## Posicionamiento recomendado

La propuesta es mover el posicionamiento principal a:

> Technical lead especializado en secure automation, delivery reliability y observability.

Ese ángulo es más fuerte que un “full-stack developer” genérico porque:

- te diferencia por profundidad operativa,
- se alinea con proyectos de mayor ticket,
- transmite valor de negocio, no solo stack técnico,
- mejora la coherencia entre portfolio, CV y proyectos.

## Arquitectura de contenido

### Home

La home debería responder en los primeros 10 segundos:

- qué resolvés,
- para quién,
- qué resultado producís,
- cómo contactarte.

Propongo esta estructura:

1. Hero con propuesta concreta.
2. Tres servicios empaquetados.
3. Tres case studies destacados.
4. Señales de autoridad.
5. CTA de contacto o auditoría.

### Servicios

Conviene dejar de vender capacidades sueltas y pasar a ofertas comprables:

- Automation Audit
- Delivery Reliability Sprint
- Observability / Ops Hardening

Cada servicio debería incluir:

- problema que resuelve,
- entregables,
- duración estimada,
- rango de inversión o al menos nivel de esfuerzo,
- CTA específico.

### Case studies

Hay que transformar proyectos actuales en piezas de venta y autoridad.

Formato recomendado por caso:

- contexto,
- problema,
- decisión técnica,
- implementación,
- resultado medible,
- screenshots o diagramas,
- qué aprendimos,
- link al repo o demo si aplica.

### About

La página About debería dejar de ser una biografía amplia y pasar a ser:

- credenciales,
- áreas de profundidad,
- decisiones técnicas representativas,
- metodología de trabajo,
- por qué confiar.

## SEO

### Prioridades

1. `title` y `meta description` únicos por página.
2. `canonical` correcto en cada URL.
3. `robots.txt`.
4. `sitemap.xml`.
5. Open Graph y Twitter Cards completos.
6. JSON-LD para `Person`, `Service`, `WebSite` y `CreativeWork`.
7. headings semánticos limpios, una sola jerarquía por página.
8. imágenes con `alt` descriptivos y peso optimizado.
9. enlaces internos entre home, services, case studies y labs.

### Schema recomendado

- `Person`: nombre, rol, ubicación, redes.
- `Service`: cada servicio comercial.
- `CreativeWork`: proyectos destacados.
- `FAQPage`: dudas frecuentes de clientes.

### Contenido SEO

El sitio debería apuntar a búsquedas más valiosas que “portfolio personal”:

- technical lead automation
- CI/CD consultant
- observability engineer
- secure remote execution
- infrastructure automation
- internal tools consultant

## LLMEO

Entiendo `LLMEO` como la optimización para motores de respuesta y asistentes basados en LLM.

La idea no es “escribir para el chatbot”, sino publicar contenido que:

- sea fácil de extraer,
- tenga estructura clara,
- exponga hechos verificables,
- responda preguntas frecuentes con precisión,
- use datos concretos y no solo branding.

### Qué conviene agregar

- páginas con preguntas y respuestas directas;
- resúmenes ejecutivos al inicio de cada página;
- bloques de “what I do / who it is for / results”;
- listado claro de servicios y entregables;
- una página de casos destacados con datos concretos;
- una página `llms.txt` o sección equivalente con:
  - quién sos,
  - qué hacés,
  - servicios,
  - proyectos,
  - contacto,
  - fuentes primarias del sitio.

### Buenas prácticas

- usar lenguaje natural y directo;
- evitar claims no demostrables;
- repetir las mismas facts clave en home, about y service pages;
- mantener URLs estables;
- usar tablas o listas cuando haya comparaciones o paquetes;
- incluir datos que un agente pueda citar sin ambigüedad.

## Rediseño visual

No hace falta una estética más “llamativa”. Hace falta una estética más confiable y más propia.

Recomiendo:

- menos efecto genérico de template;
- menos stock imagery;
- más screenshots, diagramas y artefactos propios;
- tipografía consistente;
- sistema de color sobrio con un acento fuerte;
- layout más editorial, menos genérico de landing.

## Conversión

Para revenue, el sitio debería empujar a una de estas dos acciones:

- agendar una llamada,
- escribir con un problema concreto.

### CTAs recomendados

- “Request an automation audit”
- “Book a delivery reliability review”
- “Discuss an ops bottleneck”

### Pruebas de confianza

- testimonios breves,
- métricas reales,
- logos si se pueden publicar,
- enlaces a GitHub,
- resultados antes/después.

### Tracking

Medir como mínimo:

- clicks en CTA,
- clicks en WhatsApp,
- clicks en email,
- downloads de CV,
- visitas a case studies,
- scroll depth en home.

## Roadmap sugerido

### Fase 1: quick wins

- reescribir hero y CTA,
- agregar `robots.txt` y `sitemap.xml`,
- agregar JSON-LD,
- corregir copy inconsistente,
- reemplazar imágenes genéricas.

### Fase 2: autoridad

- crear 3 case studies fuertes,
- crear 3 páginas de servicio,
- agregar FAQ por servicio,
- sumar evidencias y métricas.

### Fase 3: LLMEO y distribución

- publicar `llms.txt`,
- crear resúmenes aptos para extracción,
- sumar artículos técnicos con foco en problemas reales,
- enlazar los contenidos entre sí con estructura semántica clara.

## Métricas de éxito

La propuesta debería mejorar:

- tasa de contacto,
- calidad del lead,
- tiempo en página de case studies,
- tráfico orgánico de intención alta,
- CTR desde buscadores y respuestas de LLM,
- ratio de descargas de CV o solicitudes de auditoría.

## Resumen ejecutivo

El sitio ya muestra capacidad técnica. El siguiente paso es convertirlo en un activo comercial:

- más claridad,
- más evidencia,
- más foco en resultados,
- más estructura para SEO y LLMEO,
- menos dependencia de una narrativa genérica de portfolio.

Si querés, el siguiente paso lógico es implementar esta propuesta directamente en el sitio.

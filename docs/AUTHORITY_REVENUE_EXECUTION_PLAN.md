# Plan de ejecucion: autoridad y rentabilidad del portfolio

## 1. Objetivo

Convertir `mariano.fresno.ar` en un activo comercial que:

- explique en menos de 10 segundos que problemas resuelve Mariano;
- demuestre capacidad con evidencia publica y controlada;
- ofrezca servicios que un potencial cliente pueda entender y contratar;
- genere contactos calificados sin exponer informacion privada;
- construya autoridad acumulativa mediante casos y notas tecnicas;
- sea rastreable por buscadores y legible por motores de respuesta.

El sitio debe posicionar a Mariano como un operador tecnico capaz de convertir operaciones complejas en sistemas confiables, observables y operables. No debe presentarlo como un desarrollador generalista que vende horas.

## 2. Restricciones no negociables

### 2.1 Privacidad y confidencialidad

Todo contenido nuevo debe cumplir estas reglas:

1. No publicar nombres, logos, dominios, capturas, repositorios, personas ni datos internos de clientes o empleadores sin autorizacion escrita.
2. No publicar fragmentos de conversaciones, tickets, logs, contratos, configuraciones, credenciales, URLs privadas ni topologias identificables.
3. No atribuir a Mariano un proyecto presentado o ejecutado por otra persona.
4. No publicar metricas recordadas de forma aproximada como si fueran exactas.
5. No combinar detalles que, aunque sean anonimos por separado, permitan identificar a una organizacion.
6. No usar testimonios sin aprobacion explicita de la persona citada.
7. No enviar contenido privado a APIs, analytics, modelos o servicios externos.
8. No inferir revenue, ahorro o impacto comercial sin una fuente verificable.

### 2.2 Regla de publicacion de claims

Cada afirmacion relevante debe registrarse en `content/claims.json` con uno de estos estados:

- `verified_public`: se puede publicar y su fuente ya es publica.
- `verified_private`: esta respaldada, pero debe publicarse anonimizada.
- `needs_confirmation`: no se publica hasta que Mariano la confirme.
- `rejected`: no se utiliza.

Un claim necesita los siguientes campos:

```json
{
  "id": "claim-test-suite-runtime",
  "statement": "Reduced a large test suite runtime from 45 to 20 minutes.",
  "status": "needs_confirmation",
  "public_wording": "Reduced a large test suite runtime by more than 50%.",
  "source_type": "private_career_record",
  "identification_risk": "low",
  "approved_at": null,
  "notes": "Confirm both measurements before publication."
}
```

La UI solo puede renderizar claims con estado `verified_public` o `verified_private`. Los tests deben hacer fallar el build si aparece contenido `needs_confirmation` o `rejected` en una pagina publica.

### 2.3 Alcance tecnico

- Mantener el sitio estatico actual.
- Preferir HTML, CSS y JavaScript existentes.
- No introducir un framework frontend.
- No agregar un CMS en esta etapa.
- No agregar trackers invasivos ni session replay.
- Mantener cambios pequenos y revisables.
- No modificar `todoist-mcp-server.log` ni otros archivos ajenos al portfolio.

## 3. Forma de trabajo para un agente Qwen 27B local

El agente debe implementar una fase por PR. No debe intentar ejecutar todo el plan en una sola sesion.

Para cada PR:

1. Leer `AGENTS.md`, este documento, `README.md`, `package.json` y los archivos mencionados por la fase.
2. Ejecutar `git status --short` y no tocar cambios preexistentes no relacionados.
3. Crear una rama desde `origin/master` con el nombre indicado.
4. Cambiar solamente los archivos listados, salvo que exista una dependencia directa y explicable.
5. Ejecutar los tests especificos de la fase.
6. Revisar el diff con `git diff --check` y `git diff --stat`.
7. Buscar secretos y referencias privadas antes de commitear.
8. Incluir en el PR: objetivo, archivos, validacion, riesgos y capturas si cambia la UI.
9. Detenerse si un dato comercial requiere confirmacion humana.

El agente no debe inventar contenido para completar un campo. Debe usar `TODO_REQUIRES_MARIANO_APPROVAL` en archivos no publicos y bloquear su renderizado.

## 4. Arquitectura de contenido objetivo

### Navegacion principal

- Home
- Services
- Case Studies
- Insights
- About
- Contact

### Embudo

1. Una persona llega por recomendacion, buscador, GitHub o una nota.
2. La home identifica su problema y muestra resultados verificables.
3. La persona abre un servicio o caso relacionado.
4. Encuentra alcance, entregables, forma de trabajo y limites.
5. Completa un contacto con contexto suficiente para calificar la oportunidad.

### Posicionamiento base

Texto de trabajo, sujeto a revision editorial:

> I turn complex technical operations into systems teams can actually run.

Descriptor sugerido:

> Technical Operator - Automation, Platforms and Production Systems

No publicar este copy automaticamente. Incluirlo como propuesta en el PR de contenido para aprobacion.

## 5. Roadmap implementable

## Fase 0 - Baseline y guardrails

**Rama:** `portfolio/00-baseline-privacy`

**Objetivo:** crear controles que eviten publicar material privado o claims no aprobados.

### Pasos

1. Crear `content/claims.json` con el esquema anterior y sin datos identificables.
2. Crear `content/privacy-policy.md` con las reglas de la seccion 2.
3. Crear `scripts/validate-public-content.mjs`.
4. Hacer que el script recorra `public/**/*.html`, `public/**/*.json`, `public/**/*.txt` y `public/**/*.xml`.
5. Bloquear patrones de alto riesgo:
   - claves privadas;
   - tokens comunes;
   - URLs con credenciales;
   - direcciones IP privadas;
   - rutas absolutas del home local;
   - marcadores `TODO_REQUIRES_MARIANO_APPROVAL`;
   - claims no aprobados.
6. Mantener una allowlist pequena para falsos positivos documentados.
7. Agregar `npm run validate:content` a `package.json`.
8. Ejecutar el validador antes de Jest en `.github/workflows/push.yml`.
9. Agregar tests unitarios del validador en `__tests__/public-content-validation.test.js`.

### Criterios de aceptacion

- `npm run validate:content` termina con codigo 0 sobre el contenido actual.
- Un fixture con token, ruta local o claim pendiente hace fallar el test.
- El reporte indica archivo y regla, pero nunca imprime el valor secreto completo.
- No se publica ninguna fuente privada ni ruta hacia conversaciones locales.

## Fase 1 - Estabilizar build, tests y documentacion

**Rama:** `portfolio/01-reliable-foundation`

**Objetivo:** asegurar que cada cambio editorial pueda validarse de forma repetible.

### Pasos

1. Corregir en `README.md` comandos que no existen, como `npm run web` o `npm run dev`, o agregarlos de forma consistente a `package.json`.
2. Ejecutar `npm ci`, `npm test -- --runInBand` y registrar fallos reales.
3. Reparar tests obsoletos sin reducir cobertura ni eliminar assertions utiles.
4. Agregar un smoke test que valide:
   - home;
   - `/about/`;
   - `/labs/`;
   - recursos SEO;
   - enlaces internos principales.
5. Agregar una verificacion HTML minima: un `h1`, title, description y canonical por pagina.
6. Documentar el flujo local real y el puerto en `README.md`.
7. Mantener CI en Node 20 y usar `npm ci` en lugar de `npm install`.

### Criterios de aceptacion

- La instalacion limpia funciona con el lockfile.
- Todos los tests pasan localmente y en CI.
- Los comandos documentados existen.
- Ninguna pagina principal devuelve un recurso inexistente durante el smoke test.

## Fase 2 - SEO tecnico y LLMEO basico

**Rama:** `portfolio/02-seo-llmeo-foundation`

**Objetivo:** corregir descubrimiento y crear fuentes primarias consistentes.

### Pasos

1. Crear `public/robots.txt` con acceso permitido y referencia absoluta al sitemap.
2. Crear `public/sitemap.xml` con URLs canonicas reales.
3. Crear `public/llms.txt` con:
   - identidad profesional;
   - servicios;
   - areas de experiencia;
   - enlaces canonicos;
   - contacto publico;
   - politica de no inventar afiliaciones ni resultados.
4. Crear `public/llms-full.txt` solamente si puede generarse desde contenido ya aprobado.
5. Normalizar canonical con slash final donde corresponda.
6. Verificar titles y descriptions unicos.
7. Agregar JSON-LD consistente para `Person`, `WebSite`, `Service` y `CreativeWork`.
8. No usar `FAQPage` para preguntas que no sean visibles en la pagina.
9. Agregar Open Graph y Twitter metadata a las paginas secundarias.
10. Crear tests para parsear XML, validar URLs y comprobar que los recursos sean servidos con `200` localmente.

### Criterios de aceptacion

- `/robots.txt`, `/sitemap.xml` y `/llms.txt` responden `200` en local.
- Sitemap y canonical usan `https://mariano.fresno.ar`.
- JSON-LD es JSON valido y no contiene claims pendientes.
- No existe informacion adicional en `llms.txt` que no aparezca en una pagina publica.

## Fase 3 - Ofertas comercializables

**Rama:** `portfolio/03-productized-services`

**Objetivo:** transformar capacidades tecnicas en tres entradas de compra claras.

### Servicios iniciales

1. **Technical Systems Audit**
   - para equipos con incidentes, deuda operativa o sistemas dificiles de entender;
   - entregables: mapa del sistema, riesgos priorizados y plan de accion;
   - CTA: `Request a systems audit`.
2. **Automation Opportunity Assessment**
   - para procesos manuales, repetitivos o propensos a errores;
   - entregables: inventario de tareas, matriz impacto/esfuerzo y prototipo opcional;
   - CTA: `Assess an operation`.
3. **Production Reliability Sprint**
   - para delivery, observabilidad y diagnostico de produccion;
   - entregables: baseline, mejoras acotadas, runbook y verificacion;
   - CTA: `Discuss a reliability bottleneck`.

### Pasos

1. Crear `public/services/index.html` y una pagina por servicio.
2. Para cada servicio definir:
   - sintomas del problema;
   - para quien es y para quien no;
   - entregables concretos;
   - duracion orientativa;
   - prerequisitos;
   - proceso de trabajo;
   - limites;
   - preguntas frecuentes;
   - CTA con nombre del servicio en el mensaje.
3. No publicar precios hasta definir moneda, rango y mercado objetivo.
4. Evitar garantias de ahorro, revenue o disponibilidad.
5. Agregar los servicios al JSON-LD y sitemap.
6. Agregar enlaces desde home, casos y About.

### Criterios de aceptacion

- Una persona puede explicar que compra despues de leer cada pagina.
- Cada servicio tiene un solo CTA principal.
- No hay lenguaje como `guaranteed`, `always`, `100%` o resultados no verificables.
- Mobile y desktop no presentan overflow ni solapamientos.

## Fase 4 - Sistema de case studies anonimizados

**Rama:** `portfolio/04-case-study-system`

**Objetivo:** demostrar resultados sin revelar organizaciones ni informacion interna.

### Modelo de datos

Crear `public/data/case-studies.json` con:

```json
{
  "items": [
    {
      "slug": "enterprise-api-delivery",
      "title": "Shipping a platform component across a distributed environment",
      "visibility": "draft",
      "organization": "An enterprise software company",
      "context": "",
      "problem": "",
      "constraints": [],
      "decisions": [],
      "implementation": [],
      "result_claim_ids": [],
      "lessons": [],
      "services": [],
      "reviewed_for_privacy": false
    }
  ]
}
```

Solo renderizar items con `visibility: "public"`, `reviewed_for_privacy: true` y claims aprobados.

### Primeros borradores

1. **Distributed platform delivery**
   - empresa anonima;
   - API o plataforma, sin nombre de producto;
   - seguridad, compliance, packaging, despliegue y rollout progresivo;
   - no publicar cantidad de data centers o servidores hasta confirmarla.
2. **Faster engineering feedback**
   - suite de tests empresarial;
   - separar pruebas que no necesitaban base de datos;
   - publicar reduccion de tiempo solamente despues de confirmar mediciones.
3. **Operational lead platform**
   - producto privado, sin nombres ni datos de usuarios;
   - ingesta, clasificacion, consentimiento, matching auditable y seguimiento;
   - enfatizar arquitectura y controles humanos, no volumen ni conversion sin validar.
4. **Developer debugging enablement**
   - documentacion y automatizacion del entorno de debugging;
   - adopcion organizacional descrita sin nombrar empresa ni personas.
5. **Physical-digital parking assistant**
   - caso propio y publicable;
   - Android, vision, BLE y firmware;
   - usar solo repositorios o imagenes cuya publicacion este autorizada.

### Pasos

1. Implementar listado en `public/case-studies/index.html`.
2. Crear una plantilla estatica accesible para el detalle.
3. Empezar con todos los casos en estado draft.
4. Generar un reporte de privacidad por caso en `content/reviews/<slug>.md`.
5. Requerir aprobacion manual de Mariano para cambiar a `public`.
6. Incluir un diagrama propio sin topologia, nombres o datos internos.
7. Agregar CTA contextual hacia el servicio relacionado.
8. Agregar schema `CreativeWork` solo a casos publicos.

### Criterios de aceptacion

- Ningun draft aparece en HTML publico, sitemap o `llms.txt`.
- No aparecen nombres de empleadores, clientes, equipos, personas o productos privados.
- Toda cifra visible referencia un claim aprobado.
- Cada caso explica contexto, problema, decision, resultado y aprendizaje.

## Fase 5 - Home orientada a conversion

**Rama:** `portfolio/05-conversion-home`

**Objetivo:** conectar posicionamiento, prueba y oferta en la primera pagina.

### Orden de secciones

1. Hero: problema, resultado y CTA.
2. Tres sintomas que Mariano resuelve.
3. Tres servicios.
4. Tres casos aprobados.
5. Metodo de trabajo.
6. Evidencia publica: repositorios, herramientas, articulos o proyectos.
7. CTA final.

### Pasos

1. Reemplazar `Hire Me` por un CTA especifico.
2. Evitar claims vagos como `Recent Outcomes` si no hay resultados visibles debajo.
3. Mantener la fabricacion aditiva como prueba secundaria de amplitud tecnica.
4. No dejar que la seccion 3D compita con los servicios principales.
5. Usar imagenes propias, diagramas o capturas publicables.
6. Mantener una sola accion primaria por viewport.
7. Agregar parametros `utm_content` internos a los CTA, sin datos personales.
8. Verificar teclado, focus, contraste, reduced motion y responsive.

### Criterios de aceptacion

- El hero identifica problema, audiencia y resultado.
- Servicios y casos se alcanzan sin depender de JavaScript.
- El CTA conserva contexto del servicio elegido.
- Lighthouse no muestra regresiones criticas de accesibilidad o SEO.

## Fase 6 - About como prueba de criterio y liderazgo

**Rama:** `portfolio/06-authority-about`

**Objetivo:** explicar la trayectoria sin convertir la pagina en un CV largo.

### Pasos

1. Describir la progresion desde sistemas fisicos y redes hacia software y plataformas.
2. Explicar experiencia liderando developers y QA sin identificar equipos privados.
3. Mostrar trabajo cross-functional con producto, ventas, seguridad e infraestructura.
4. Incluir principios operativos verificables:
   - investigar antes de cambiar;
   - medir produccion;
   - automatizar con controles;
   - dejar sistemas operables por otros;
   - documentar decisiones y handoffs.
5. Enlazar CV, GitHub, casos y servicios.
6. Evitar una cronologia exhaustiva de empleadores.

### Criterios de aceptacion

- La pagina demuestra criterio, liderazgo y rango tecnico.
- No contiene informacion nueva no aprobada.
- No repite el CV completo.

## Fase 7 - Contacto y calificacion de oportunidades

**Rama:** `portfolio/07-qualified-contact`

**Objetivo:** aumentar la calidad del contacto sin recolectar datos innecesarios.

### Pasos

1. Crear `public/contact/index.html`.
2. Ofrecer WhatsApp y email con mensajes prellenados por servicio.
3. Pedir solo:
   - tipo de problema;
   - estado actual;
   - resultado buscado;
   - urgencia aproximada;
   - forma de contacto.
4. No pedir credenciales, logs, datos de clientes ni documentos sensibles.
5. Mostrar una advertencia: no enviar secretos ni informacion regulada en el primer contacto.
6. Si se agrega formulario, usar un backend propio o proveedor aprobado y publicar su politica de privacidad.
7. Agregar eventos de conversion sin incluir texto escrito por el usuario.

### Criterios de aceptacion

- El CTA indica que informacion enviar.
- No se transmiten datos al hacer click hasta que el usuario elige WhatsApp o email.
- Analytics no recibe nombres, email, telefono, mensaje ni query strings sensibles.

## Fase 8 - Analytics respetuoso y dashboard comercial

**Rama:** `portfolio/08-privacy-first-analytics`

**Objetivo:** medir el embudo sin vigilar a los visitantes.

### Eventos permitidos

- `service_view`
- `case_study_view`
- `cta_click`
- `contact_channel_selected`
- `cv_download`
- `outbound_github_click`

### Pasos

1. Elegir una solucion privacy-first o logs agregados del servidor.
2. Desactivar session replay, fingerprinting y captura de formularios.
3. Crear `public/assets/js/analytics.js` con una interfaz desacoplada.
4. Enviar solo nombre de evento, pagina, servicio/caso y timestamp aproximado.
5. Documentar retencion y acceso.
6. Crear un dashboard semanal con:
   - visitas por fuente;
   - paso home -> servicio;
   - paso servicio -> contacto;
   - casos mas leidos;
   - contactos calificados;
   - oportunidades y revenue registrados manualmente fuera del sitio.
7. No inferir revenue automaticamente desde visitas.

### Criterios de aceptacion

- Ningun payload contiene PII.
- La politica de privacidad describe la medicion real.
- Los eventos se validan en tests sin contactar un servicio externo.

## Fase 9 - Motor editorial de autoridad

**Rama:** `portfolio/09-insights-system`

**Objetivo:** publicar conocimiento que acumule autoridad y atraiga demanda relevante.

### Lineas editoriales

1. Production RCA y diagnostico entre servicios.
2. Automatizacion con aprobacion, auditoria y fallback.
3. Delivery reproducible y despliegues confiables.
4. Observabilidad vinculada con revenue y eficiencia.
5. Sistemas que combinan hardware y software.

### Pasos

1. Crear `public/insights/index.html`.
2. Crear una plantilla semantica para articulos estaticos.
3. Cada articulo debe contener:
   - pregunta concreta;
   - resumen ejecutivo;
   - contexto anonimo o reproducible;
   - enfoque;
   - tradeoffs;
   - checklist reutilizable;
   - fuentes publicas;
   - CTA relacionado.
4. Publicar primero cinco piezas evergreen, no noticias.
5. Extraer ejemplos solo de proyectos propios/publicos o recreaciones sinteticas.
6. No convertir incidentes privados en contenido reconocible.
7. Agregar RSS/Atom, sitemap y metadata `Article`.
8. Reutilizar cada articulo en LinkedIn y GitHub con enlace canonico al sitio.

### Primer backlog editorial

- How to prove a production fix across source, runtime and served assets.
- Assisted-first automation: where human approval prevents expensive failures.
- Observability that answers business questions, not only uptime.
- Designing auditable agent workflows for real operations.
- What physical prototyping teaches about software constraints.

### Criterios de aceptacion

- Cada articulo responde una pregunta de alta intencion.
- Todos los ejemplos son publicos, sinteticos o anonimizados y aprobados.
- RSS, canonical, schema y enlaces internos son validos.

## Fase 10 - Distribucion y autoridad externa

**Responsable:** humano asistido por agente. No automatizar publicaciones sin aprobacion.

### Rutina semanal

1. Elegir una pregunta surgida de trabajo real que pueda tratarse sin datos privados.
2. Publicar una nota corta o ampliar una nota evergreen.
3. Crear un post de LinkedIn con una idea, una evidencia y un enlace.
4. Actualizar README o documentacion de un proyecto publico relacionado.
5. Participar con respuestas tecnicas utiles en dos conversaciones relevantes.
6. Contactar a una persona de confianza para feedback, no para pedir una recomendacion generica.

### Rutina mensual

1. Revisar consultas y oportunidades recibidas.
2. Identificar que contenido origino conversaciones calificadas.
3. Actualizar un caso con evidencia nueva aprobada.
4. Eliminar o corregir claims desactualizados.
5. Revisar Search Console y enlaces rotos.
6. Elegir un experimento comercial para el mes siguiente.

### Activos externos prioritarios

- LinkedIn coherente con el nuevo posicionamiento.
- GitHub profile README con servicios y casos publicos.
- Repositorios publicos con README orientado a problema, uso y evidencia.
- Apariciones, charlas o demos enlazadas desde el sitio solamente si son publicas.

## Fase 11 - Experimentos de rentabilidad

Ejecutar un experimento por vez durante al menos cuatro semanas.

### Experimento A - Auditoria como entrada

- CTA principal hacia Technical Systems Audit.
- Medir visitas, contactos y oportunidades calificadas.
- Entregar un informe estandarizado y reutilizable.

### Experimento B - Reliability sprint

- Publicar un caso relacionado con produccion.
- Enlazarlo directamente al sprint.
- Evaluar si atrae equipos con mayor urgencia y presupuesto.

### Experimento C - Workshop privado

- Workshop para equipos sobre agent workflows auditables.
- Alcance cerrado, duracion definida y materiales incluidos.
- No usar ejemplos privados en la presentacion.

### Criterio economico

Registrar manualmente por oportunidad:

- fuente;
- servicio de interes;
- calidad del problema;
- valor potencial;
- horas de preventa;
- estado;
- revenue cerrado.

No almacenar esta informacion en el repositorio publico ni enviarla a analytics web.

## 6. Metricas de exito

### Autoridad

- consultas de marca;
- backlinks relevantes;
- invitaciones a conversaciones o colaboraciones;
- lecturas completas de casos;
- repositorios y articulos citados;
- contactos que mencionan una idea o caso concreto.

### Rentabilidad

- contactos calificados por mes;
- porcentaje de contactos que encajan con un servicio;
- oportunidades creadas;
- conversion a propuesta;
- conversion a proyecto;
- ticket promedio;
- horas de preventa por proyecto cerrado;
- revenue atribuido manualmente a contenido o servicio.

### Calidad

- CI verde;
- cero secretos detectados;
- cero claims pendientes publicados;
- cero enlaces rotos;
- Core Web Vitals sin regresiones relevantes;
- accesibilidad sin errores criticos.

## 7. Checklist de privacidad antes de cada publicacion

- [ ] El contenido no identifica clientes, empleadores, personas o sistemas privados.
- [ ] Todas las cifras visibles estan confirmadas.
- [ ] No hay capturas con nombres, URLs, datos o metadata privada.
- [ ] Los diagramas fueron redibujados y simplificados para publicacion.
- [ ] No hay logs, tokens, headers, IDs, IPs ni rutas locales.
- [ ] Los testimonios tienen permiso escrito.
- [ ] Los claims estan aprobados en `content/claims.json`.
- [ ] `npm run validate:content` pasa.
- [ ] `npm test -- --runInBand` pasa.
- [ ] Mariano realizo la revision humana final del contenido comercial.

## 8. Orden recomendado

1. Fase 0: guardrails.
2. Fase 1: base confiable.
3. Fase 2: SEO/LLMEO.
4. Fase 3: servicios.
5. Fase 4: casos.
6. Fase 5: home.
7. Fase 6: About.
8. Fase 7: contacto.
9. Fase 8: analytics.
10. Fase 9: contenido.
11. Fases 10 y 11: distribucion y experimentos continuos.

No empezar la home comercial antes de tener al menos un servicio y un caso aprobados. No publicar un caso para completar una grilla visual.

## 9. Definicion de terminado

El proyecto alcanza su primera version comercial cuando:

- existen tres servicios claros;
- hay al menos tres casos aprobados, dos tecnicos y uno de producto propio;
- home, About, Services, Case Studies y Contact forman un embudo coherente;
- SEO, sitemap, robots y LLMEO funcionan en produccion;
- el sitio mide conversiones sin PII;
- existe una rutina editorial sostenible;
- cada claim y activo visual tiene trazabilidad de aprobacion;
- al menos una oferta genero conversaciones calificadas y se pudo medir su resultado.

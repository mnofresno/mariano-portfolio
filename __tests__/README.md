# Tests del Sistema de Chatbot RAG

Este directorio contiene todos los tests para el sistema de chatbot RAG implementado en el portfolio de Mariano Fresno.

## 📁 Estructura de Tests

### `chatbot-widget.test.js`
Tests para el widget del chatbot, incluyendo:
- Renderizado del botón flotante y popup
- Modo demo y backend
- Cambio de idioma
- Integración con sistema RAG
- Manejo de errores

### `chatbot-rag.test.js`
Tests para el sistema RAG, incluyendo:
- Clase RAGChatbot
- Extracción de contenido del sitio web
- Generación de base de conocimiento
- Sistema de embeddings y búsqueda
- Generación de respuestas inteligentes
- Funcionalidades de WhatsApp
- Sistema de fallback
- Soporte multiidioma

### `chatbot-integration.test.js`
Tests de integración completa, incluyendo:
- Integración completa del sistema RAG
- Respuestas a preguntas específicas
- Integración con WhatsApp
- Cambio de idioma en tiempo real
- Rendimiento y confiabilidad
- Manejo de errores del sistema completo

## 🚀 Ejecutar Tests

### Instalar Dependencias
```bash
npm install
```

### Ejecutar Todos los Tests
```bash
npm run test:all
```

### Ejecutar Tests Específicos
```bash
# Tests del widget
npm run test:widget

# Tests del sistema RAG
npm run test:rag

# Tests de integración
npm run test:integration

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Ejecutar Tests Individuales
```bash
# Test específico
npx jest __tests__/chatbot-rag.test.js

# Test con verbose
npx jest __tests__/chatbot-widget.test.js --verbose

# Test con cobertura
npx jest __tests__/chatbot-integration.test.js --coverage
```

## 📊 Cobertura de Tests

Los tests cubren:

### ✅ Funcionalidades del Widget
- [x] Renderizado de UI
- [x] Apertura/cierre del popup
- [x] Modo demo y backend
- [x] Cambio de idioma
- [x] Integración con RAG
- [x] Manejo de errores
- [x] Fallback a demo

### ✅ Sistema RAG
- [x] Extracción de contenido del DOM
- [x] Generación de base de conocimiento
- [x] Sistema de embeddings
- [x] Búsqueda semántica
- [x] Generación de respuestas
- [x] Respuestas específicas por tecnología
- [x] Integración con WhatsApp
- [x] Sistema de fallback
- [x] Soporte multiidioma

### ✅ Integración Completa
- [x] Flujo completo de preguntas y respuestas
- [x] Respuestas a preguntas sobre tecnologías
- [x] Respuestas de contacto con WhatsApp
- [x] Fallback inteligente
- [x] Cambio de idioma en tiempo real
- [x] Rendimiento con múltiples consultas
- [x] Manejo de errores del sistema completo

## 🧪 Tipos de Tests

### Unit Tests
- Tests individuales de cada método y clase
- Mocks de dependencias externas
- Verificación de comportamiento específico

### Integration Tests
- Tests de integración entre componentes
- Flujos completos de usuario
- Interacción entre widget y RAG

### End-to-End Tests
- Tests del sistema completo
- Simulación de casos de uso reales
- Verificación de funcionalidades completas

## 🔧 Configuración

### Jest Configuration (`jest.config.js`)
- Entorno: jsdom para simular DOM del navegador
- Cobertura: Archivos del chatbot excluyendo vendor
- Setup: Archivo de configuración inicial
- Mocks: Objetos globales del navegador

### Setup File (`jest.setup.js`)
- Mocks de APIs del navegador
- Limpieza entre tests
- Configuración global

## 📈 Métricas de Calidad

Los tests aseguran:
- **Cobertura de código**: >90% en archivos del chatbot
- **Funcionalidad**: Todas las características implementadas
- **Robustez**: Manejo de errores y casos edge
- **Rendimiento**: Múltiples consultas simultáneas
- **Usabilidad**: Cambio de idioma y fallback

## 🐛 Debugging

### Ver Tests Fallidos
```bash
npx jest --verbose --no-coverage
```

### Debug Tests Específicos
```bash
npx jest __tests__/chatbot-rag.test.js --verbose --no-coverage
```

### Ver Cobertura Detallada
```bash
npm run test:coverage
# Abre coverage/lcov-report/index.html en el navegador
```

## 📝 Escribir Nuevos Tests

### Estructura de Test
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  test('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Mocks Comunes
```javascript
// Mock RAG system
window.RAGChatbot = jest.fn().mockImplementation(() => ({
  initialize: jest.fn().mockResolvedValue(),
  processQuery: jest.fn().mockResolvedValue('response')
}));

// Mock DOM
document.body.innerHTML = '<div id="test">Test</div>';

// Mock console
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
```

## 🎯 Objetivos de Testing

1. **Confiabilidad**: El sistema funciona consistentemente
2. **Mantenibilidad**: Fácil de modificar y extender
3. **Documentación**: Los tests documentan el comportamiento
4. **Regresión**: Prevenir bugs al hacer cambios
5. **Calidad**: Asegurar estándares de código

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JSDOM Environment](https://jestjs.io/docs/tutorial-jquery)
- [Testing Best Practices](https://jestjs.io/docs/snapshot-testing)

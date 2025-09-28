#!/usr/bin/env node
// test-all.js
// Script para ejecutar todos los tests del sistema de chatbot

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Ejecutando todos los tests del sistema de chatbot...\n');

// Verificar que Jest esté instalado
try {
  execSync('npx jest --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Jest no está instalado. Instalando dependencias...');
  try {
    execSync('npm install --save-dev jest @jest/globals', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Error instalando Jest:', installError.message);
    process.exit(1);
  }
}

// Función para ejecutar tests con reporte
function runTests(testPattern, description) {
  console.log(`\n📋 ${description}`);
  console.log('=' .repeat(50));
  
  try {
    const output = execSync(`npx jest ${testPattern} --verbose --coverage`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`);
    console.error(error.stdout || error.message);
    return false;
  }
}

// Función para mostrar resumen
function showSummary(results) {
  console.log('\n📊 RESUMEN DE TESTS');
  console.log('=' .repeat(50));
  
  const total = results.length;
  const passed = results.filter(r => r).length;
  const failed = total - passed;
  
  console.log(`Total de suites: ${total}`);
  console.log(`✅ Exitosos: ${passed}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📈 Porcentaje de éxito: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.');
    process.exit(1);
  } else {
    console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  const results = [];
  
  // Tests del widget
  results.push(runTests('__tests__/chatbot-widget.test.js', 'Tests del Widget del Chatbot'));
  
  // Tests del sistema RAG
  results.push(runTests('__tests__/chatbot-rag.test.js', 'Tests del Sistema RAG'));
  
  // Tests de integración
  results.push(runTests('__tests__/chatbot-integration.test.js', 'Tests de Integración'));
  
  // Test completo de todo el sistema
  results.push(runTests('__tests__/', 'Tests Completos del Sistema'));
  
  showSummary(results);
}

// Verificar que los archivos de test existen
const testFiles = [
  '__tests__/chatbot-widget.test.js',
  '__tests__/chatbot-rag.test.js',
  '__tests__/chatbot-integration.test.js'
];

const missingFiles = testFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Archivos de test faltantes:', missingFiles.join(', '));
  process.exit(1);
}

// Ejecutar tests
runAllTests().catch(error => {
  console.error('❌ Error ejecutando tests:', error.message);
  process.exit(1);
});

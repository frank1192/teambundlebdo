/**
 * Test comprehensivo de todos los READMEs
 * Valida cada README y muestra un resumen de resultados
 */

const fs = require('fs');
const path = require('path');

// Simular el módulo @actions/core
let currentTestErrors = [];
const core = {
  info: (msg) => {},
  error: (msg) => { currentTestErrors.push(msg); },
  warning: (msg) => {},
  startGroup: (name) => {},
  endGroup: () => {},
  debug: () => {},
  getInput: () => null
};

// Mock del módulo
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === '@actions/core') {
    return core;
  }
  return originalRequire.apply(this, arguments);
};

// Importar la función de validación
const { validateReadmeTemplate } = require('../index.js');

console.log('================================================================================');
console.log('🧪 TEST COMPREHENSIVO: Validación de TODOS los READMEs');
console.log('================================================================================\n');

const readmesDir = path.join(__dirname, '..', 'bancos readme a evaluar');
const testDir = path.join(__dirname, 'temp_test_all');

// Crear directorio temporal
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Obtener todos los archivos README
const readmeFiles = fs.readdirSync(readmesDir)
  .filter(f => f.toLowerCase().startsWith('readme') && f.toLowerCase().endsWith('.md'))
  .sort();

console.log(`📂 Encontrados ${readmeFiles.length} archivos README para validar\n`);

const results = [];

async function testReadme(filename) {
  currentTestErrors = [];
  
  const sourcePath = path.join(readmesDir, filename);
  const targetPath = path.join(testDir, 'README.md');
  
  try {
    // Copiar README
    fs.copyFileSync(sourcePath, targetPath);
    
    // Validar
    await validateReadmeTemplate(testDir);
    
    // Si llega aquí, pasó la validación
    return {
      file: filename,
      passed: true,
      errors: []
    };
  } catch (error) {
    // Extraer errores del mensaje
    const errorMsg = error.message;
    const errorMatch = errorMsg.match(/SE ENCONTRARON (\d+) ERROR/);
    const errorCount = errorMatch ? parseInt(errorMatch[1]) : 1;
    
    return {
      file: filename,
      passed: false,
      errorCount: errorCount,
      errors: currentTestErrors.filter(e => e.includes('❌')).map(e => e.replace('❌', '').trim())
    };
  } finally {
    // Limpiar
    try {
      fs.unlinkSync(targetPath);
    } catch (e) {
      // Ignorar
    }
  }
}

async function runAllTests() {
  console.log('🔍 Iniciando validaciones...\n');
  console.log('─'.repeat(80));
  
  for (let i = 0; i < readmeFiles.length; i++) {
    const filename = readmeFiles[i];
    process.stdout.write(`\r[${i + 1}/${readmeFiles.length}] Validando: ${filename.padEnd(50)}`);
    
    const result = await testReadme(filename);
    results.push(result);
  }
  
  console.log('\n' + '─'.repeat(80));
  
  // Resumen
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE VALIDACIONES');
  console.log('='.repeat(80));
  console.log(`Total de READMEs: ${results.length}`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Tasa de éxito: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  // Mostrar READMEs que pasaron
  if (passed > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log('✅ READMEs QUE PASARON:');
    console.log('─'.repeat(80));
    results.filter(r => r.passed).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.file}`);
    });
  }
  
  // Mostrar READMEs que fallaron con detalles
  if (failed > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log('❌ READMEs QUE FALLARON:');
    console.log('─'.repeat(80));
    results.filter(r => !r.passed).forEach((r, i) => {
      console.log(`\n  ${i + 1}. ${r.file}`);
      console.log(`     Errores: ${r.errorCount}`);
      if (r.errors.length > 0) {
        console.log(`     Primeros errores:`);
        r.errors.slice(0, 3).forEach(e => {
          const shortError = e.length > 100 ? e.substring(0, 100) + '...' : e;
          console.log(`       - ${shortError}`);
        });
        if (r.errors.length > 3) {
          console.log(`       ... y ${r.errors.length - 3} más`);
        }
      }
    });
  }
  
  // Análisis de errores comunes
  console.log('\n' + '─'.repeat(80));
  console.log('📋 ANÁLISIS DE ERRORES COMUNES:');
  console.log('─'.repeat(80));
  
  const allErrors = results.filter(r => !r.passed).flatMap(r => r.errors);
  const errorTypes = {
    datapower: allErrors.filter(e => e.toLowerCase().includes('datapower')).length,
    sql: allErrors.filter(e => e.toLowerCase().includes('código') || e.toLowerCase().includes('sql')).length,
    wsdl: allErrors.filter(e => e.toLowerCase().includes('wsdl')).length,
    swagger: allErrors.filter(e => e.toLowerCase().includes('swagger')).length,
    dependencias: allErrors.filter(e => e.toLowerCase().includes('dependencia')).length,
    otros: 0
  };
  errorTypes.otros = allErrors.length - Object.values(errorTypes).reduce((a, b) => a + b, 0) + errorTypes.otros;
  
  console.log(`  DataPower: ${errorTypes.datapower} errores`);
  console.log(`  SQL: ${errorTypes.sql} errores`);
  console.log(`  WSDL: ${errorTypes.wsdl} errores`);
  console.log(`  Swagger: ${errorTypes.swagger} errores`);
  console.log(`  Dependencias: ${errorTypes.dependencias} errores`);
  console.log(`  Otros: ${errorTypes.otros} errores`);
  
  console.log('\n' + '='.repeat(80));
  
  // Limpiar directorio temporal
  try {
    fs.rmdirSync(testDir);
  } catch (e) {
    // Ignorar
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();

/**
 * Test del README (dtp).md usando la función completa de validación
 * Debe pasar DataPower y SQL, pero fallar en WSDL
 */

const fs = require('fs');
const path = require('path');

// Simular el módulo @actions/core y capturar errores
let errorMessages = [];
let allMessages = [];
const core = {
  info: (msg) => { console.log(msg); allMessages.push(msg); },
  error: (msg) => { console.log(msg); allMessages.push(msg); errorMessages.push(msg); },
  warning: (msg) => { console.log(msg); allMessages.push(msg); },
  startGroup: (name) => { console.log(`\n${'='.repeat(80)}\n${name}\n${'='.repeat(80)}`); allMessages.push(name); },
  endGroup: () => console.log(''),
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
console.log('🧪 TEST: README (dtp).md - Validación Completa');
console.log('================================================================================\n');

// Crear un directorio temporal con el README
const testDir = path.join(__dirname, 'temp_test_dtp');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Copiar el README a validar
const sourceReadme = path.join(__dirname, '..', 'bancos readme a evaluar', 'README (dtp).md');
const targetReadme = path.join(testDir, 'README.md');
fs.copyFileSync(sourceReadme, targetReadme);

console.log(`📂 README copiado a: ${testDir}`);
console.log(`📄 Archivo: README.md\n`);

// Ejecutar la validación
async function runTest() {
  try {
    console.log('🔍 Iniciando validación...\n');
    await validateReadmeTemplate(testDir);
    console.log('\n✅ VALIDACIÓN PASÓ - No se esperaba este resultado');
    process.exit(1);
  } catch (error) {
    console.log(`\n📊 VALIDACIÓN FALLÓ (esperado):`);
    console.log(`   ${error.message}`);
    
    // Buscar solo en los mensajes de error
    const errorsOutput = errorMessages.join('\n').toLowerCase();
    
    console.log(`\n🔍 Errores capturados (${errorMessages.length}):`);
    errorMessages.forEach((msg, i) => console.log(`   ${i + 1}. ${msg.substring(0, 100)}...`));
    
    const hasDataPowerError = errorsOutput.includes('datapower') && (errorsOutput.includes('debe tener') || errorsOutput.includes('endpoint'));
    const hasSQLError = errorsOutput.includes('código') && errorsOutput.includes('numérico');
    const hasWSDLError = errorsOutput.includes('wsdl') && errorsOutput.includes('debe comenzar');
    
    console.log('\n📋 Análisis de errores:');
    console.log(`   DataPower con errores: ${hasDataPowerError ? '❌ SÍ' : '✅ NO'}`);
    console.log(`   SQL con errores: ${hasSQLError ? '❌ SÍ' : '✅ NO'}`);
    console.log(`   WSDL con errores: ${hasWSDLError ? '✅ SÍ (esperado)' : '❌ NO'}`);
    
    // El test pasa si:
    // - NO hay errores de DataPower
    // - NO hay errores de SQL
    // - SÍ hay error de WSDL
    if (!hasDataPowerError && !hasSQLError && hasWSDLError) {
      console.log('\n✅ TEST PASÓ: Solo error de WSDL como se esperaba');
      process.exit(0);
    } else {
      console.log('\n❌ TEST FALLÓ: Errores inesperados');
      if (hasDataPowerError) console.log('   - DataPower no debería tener errores');
      if (hasSQLError) console.log('   - SQL no debería tener errores');
      if (!hasWSDLError) console.log('   - WSDL debería tener error');
      process.exit(1);
    }
  } finally {
    // Limpiar
    try {
      fs.unlinkSync(targetReadme);
      fs.rmdirSync(testDir);
    } catch (e) {
      // Ignorar errores de limpieza
    }
  }
}

runTest();

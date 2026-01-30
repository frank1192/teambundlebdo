/**
 * Test para los nuevos fixes:
 * 1. Validación de grupos con sufijo "Policy"
 * 2. Validación de DataPower con N/A en todas las celdas
 */

const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('PRUEBAS DE NUEVOS FIXES');
console.log('============================================================\n');

// =============================================================================
// TEST 1: Validación de grupos con sufijo "Policy"
// =============================================================================
console.log('========== TEST 1: Búsqueda de grupos con Policy ==========');

// Simular configuración que tiene el sufijo "Policy"
const configConPolicy = `
# Configuración de ejemplo
ESB_ACE12_ConsultaProductoConSaldosPolicy.Transactional=BOGESERVICIOSTX_CONSULTASALDOS01,BOGESERVICIOSTX_CONSULTASALDOS02
ESB_ACE12_ConsultaProductoConSaldosPolicy.Notification=BOGESERVICIOSNT_CONSULTASALDOS01
ESB_ACE12_OtroServicio.Transactional=GRUPO1,GRUPO2
`;

const serviceName = 'ConsultaProductoConSaldos';

// Primera búsqueda sin Policy
let transactionalMatch = configConPolicy.match(new RegExp(`ESB_ACE12_${serviceName}\\.Transactional=([^\n]+)`, 'i'));
let notificationMatch = configConPolicy.match(new RegExp(`ESB_ACE12_${serviceName}\\.Notification=([^\n]+)`, 'i'));

console.log(`[INFO] Primera búsqueda (sin Policy):`);
console.log(`  Transactional encontrado: ${transactionalMatch ? '✅ SÍ' : '❌ NO'}`);
console.log(`  Notification encontrado: ${notificationMatch ? '✅ SÍ' : '❌ NO'}`);

// Si no se encuentra, buscar con Policy
if (!transactionalMatch && !notificationMatch) {
  console.log(`[INFO] Intentando con sufijo Policy...`);
  transactionalMatch = configConPolicy.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Transactional=([^\n]+)`, 'i'));
  notificationMatch = configConPolicy.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Notification=([^\n]+)`, 'i'));
  
  console.log(`[INFO] Segunda búsqueda (con Policy):`);
  console.log(`  Transactional encontrado: ${transactionalMatch ? '✅ SÍ' : '❌ NO'}`);
  console.log(`  Notification encontrado: ${notificationMatch ? '✅ SÍ' : '❌ NO'}`);
}

if (transactionalMatch || notificationMatch) {
  console.log(`[SUCCESS] ✅ Se encontraron las entradas con Policy`);
  if (transactionalMatch) {
    console.log(`  Transactional: ${transactionalMatch[1]}`);
  }
  if (notificationMatch) {
    console.log(`  Notification: ${notificationMatch[1]}`);
  }
} else {
  console.log(`[ERROR] ❌ No se encontraron entradas (con o sin Policy)`);
}

console.log('');

// =============================================================================
// TEST 2: Validación de DataPower con N/A
// =============================================================================
console.log('========== TEST 2: Validación de filas con N/A en DataPower ==========');

// Simular filas de la tabla DataPower
const testRows = [
  {
    description: 'Fila con N/A en todas las celdas',
    cols: ['DESARROLLO', 'N/A', 'N/A', 'N/A', 'N/A'],
    shouldBeNA: true
  },
  {
    description: 'Fila con datos reales en DESARROLLO',
    cols: ['DESARROLLO', 'WSP', 'wsp_dmz_iib_01', 'BODPDEV', 'https://boc201.des.app.bancodeoccidente.net:4805/test'],
    shouldBeNA: false
  },
  {
    description: 'Fila con N/A en CALIDAD',
    cols: ['CALIDAD', 'N/A', 'N/A', 'N/A', 'N/A'],
    shouldBeNA: true
  },
  {
    description: 'Fila con datos reales en CALIDAD',
    cols: ['CALIDAD', 'WSP', 'WS_Services_Azure', 'BODPDMZQAS', 'https://boc201.tesdmz.app.bancodeoccidente.net:4827/accounts/BalanceInquiry'],
    shouldBeNA: false
  },
  {
    description: 'Fila con N/A mixto (solo debe contar como NA si TODAS son NA)',
    cols: ['PRODUCCION', 'WSP', 'N/A', 'N/A', 'N/A'],
    shouldBeNA: false
  }
];

let allTestsPassed = true;

testRows.forEach((test, index) => {
  console.log(`\n[TEST ${index + 1}] ${test.description}`);
  console.log(`  Columnas: [${test.cols.join(', ')}]`);
  
  const [ambiente, tipoComponente, nombreWSP, datapower, endpoint] = test.cols;
  
  // Lógica mejorada para detectar filas N/A
  const isNARow = /^(N\/?A|NA|Pendiente)$/i.test(tipoComponente) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(nombreWSP) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(datapower) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(endpoint);
  
  console.log(`  ¿Es fila N/A?: ${isNARow ? 'SÍ' : 'NO'}`);
  console.log(`  Esperado: ${test.shouldBeNA ? 'SÍ' : 'NO'}`);
  
  if (isNARow === test.shouldBeNA) {
    console.log(`  ✅ CORRECTO`);
  } else {
    console.log(`  ❌ INCORRECTO`);
    allTestsPassed = false;
  }
});

console.log('\n============================================================');
console.log('RESUMEN FINAL');
console.log('============================================================');

if (allTestsPassed) {
  console.log('✅ TODOS LOS TESTS PASARON CORRECTAMENTE');
} else {
  console.log('❌ ALGUNOS TESTS FALLARON');
}

console.log('============================================================\n');

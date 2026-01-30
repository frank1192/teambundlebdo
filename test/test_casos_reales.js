/**
 * Test integrado para verificar:
 * 1. Validación con README de usuario (readme(edi).md) - tiene N/A en DESARROLLO
 * 2. Búsqueda de grupos con sufijo Policy
 */

const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('TEST INTEGRADO - CASOS REALES');
console.log('============================================================\n');

// =============================================================================
// TEST 1: README con N/A en DESARROLLO (caso real del usuario)
// =============================================================================
console.log('========== TEST 1: README con N/A en DESARROLLO ==========');

const readmeRuta = path.join(__dirname, '..', 'bancos readme a evaluar', 'readme(edi).md');
if (!fs.existsSync(readmeRuta)) {
  console.log('❌ No se encontró el archivo readme(edi).md');
  process.exit(1);
}

const content = fs.readFileSync(readmeRuta, 'utf8');

// Buscar sección DataPower Externo
const lines = content.split('\n');
let capturing = false;
let dpExternoLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/^###\s*DataPower Externo/i.test(line)) {
    capturing = true;
    continue;
  }
  if (capturing && /^###\s*/.test(line)) {
    break;
  }
  if (capturing) {
    dpExternoLines.push(line);
  }
}

const dpExternoText = dpExternoLines.join('\n');
console.log('[INFO] Contenido DataPower Externo capturado');
console.log('---');
console.log(dpExternoText.substring(0, 400));
console.log('---\n');

// Extraer filas de la tabla
const tableRows = dpExternoText.split('\n').filter(line => line.trim().startsWith('|'));
console.log(`[INFO] Filas de tabla encontradas: ${tableRows.length}`);

let desarrolloConNA = false;
let calidadConDatos = false;
let produccionConDatos = false;

for (const row of tableRows) {
  const cols = row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
  
  if (cols.length < 5) continue;
  
  const [ambiente, tipoComponente, nombreWSP, datapower, endpoint] = cols;
  
  // Verificar si es una fila de encabezado
  if (/^AMBIENTE$/i.test(ambiente) || /^---/.test(ambiente)) {
    continue;
  }
  
  console.log(`\n[FILA] ${ambiente}`);
  console.log(`  TIPO COMPONENTE: ${tipoComponente}`);
  console.log(`  NOMBRE WSP O MPG: ${nombreWSP}`);
  console.log(`  DATAPOWER: ${datapower}`);
  console.log(`  ENDPOINT: ${endpoint}`);
  
  // Detectar si es fila N/A
  const isNARow = /^(N\/?A|NA|Pendiente)$/i.test(tipoComponente) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(nombreWSP) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(datapower) && 
                  /^(N\/?A|NA|Pendiente)$/i.test(endpoint);
  
  console.log(`  ¿Es fila N/A?: ${isNARow ? '✅ SÍ' : '❌ NO'}`);
  
  if (/^DESARROLLO/i.test(ambiente) && isNARow) {
    desarrolloConNA = true;
    console.log('  ✅ DESARROLLO tiene N/A (correcto)');
  }
  
  if (/^CALIDAD/i.test(ambiente) && !isNARow) {
    calidadConDatos = true;
  }
  
  if (/^PRODUCCI[OÓ]N/i.test(ambiente) && !isNARow) {
    produccionConDatos = true;
  }
}

console.log('\n[RESUMEN TEST 1]');
if (desarrolloConNA && calidadConDatos && produccionConDatos) {
  console.log('✅ README válido: DESARROLLO con N/A, CALIDAD y PRODUCCION con datos');
} else {
  console.log('❌ Problema con la validación');
  console.log(`  DESARROLLO con N/A: ${desarrolloConNA}`);
  console.log(`  CALIDAD con datos: ${calidadConDatos}`);
  console.log(`  PRODUCCION con datos: ${produccionConDatos}`);
}

// =============================================================================
// TEST 2: Simulación de búsqueda de grupos con Policy
// =============================================================================
console.log('\n\n========== TEST 2: Búsqueda de grupos con Policy ==========');

// Configuración de prueba
const configEjemplo = `
# Archivo de configuración simulado
ESB_ACE12_ConsultaProductoConSaldosPolicy.Transactional=BOGESERVICIOSTX_CONSULTASALDOS01,BOGESERVICIOSTX_CONSULTASALDOS02
ESB_ACE12_ConsultaProductoConSaldosPolicy.Notification=BOGESERVICIOSNT_CONSULTASALDOS01
ESB_ACE12_OtroServicioSinPolicy.Transactional=GRUPO1,GRUPO2
ESB_ACE12_BalanceInquiry.Transactional=BOGESERVICIOSWS_ICBS02
`;

function buscarGruposConPolicy(configContent, serviceName) {
  console.log(`\n[INFO] Buscando grupos para: ESB_ACE12_${serviceName}`);
  
  // Primera búsqueda sin Policy
  let transactionalMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Transactional=([^\n]+)`, 'i'));
  let notificationMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Notification=([^\n]+)`, 'i'));
  
  console.log('[INFO] Búsqueda sin Policy:');
  console.log(`  Transactional: ${transactionalMatch ? '✅ Encontrado' : '❌ No encontrado'}`);
  console.log(`  Notification: ${notificationMatch ? '✅ Encontrado' : '❌ No encontrado'}`);
  
  // Si no se encuentra, intentar con Policy
  if (!transactionalMatch && !notificationMatch) {
    console.log('[INFO] Intentando con sufijo Policy...');
    transactionalMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Transactional=([^\n]+)`, 'i'));
    notificationMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Notification=([^\n]+)`, 'i'));
    
    console.log('[INFO] Búsqueda con Policy:');
    console.log(`  Transactional: ${transactionalMatch ? '✅ Encontrado' : '❌ No encontrado'}`);
    console.log(`  Notification: ${notificationMatch ? '✅ Encontrado' : '❌ No encontrado'}`);
  }
  
  if (transactionalMatch || notificationMatch) {
    console.log('\n✅ ÉXITO: Grupos encontrados');
    if (transactionalMatch) {
      console.log(`  Transactional: ${transactionalMatch[1]}`);
    }
    if (notificationMatch) {
      console.log(`  Notification: ${notificationMatch[1]}`);
    }
    return true;
  } else {
    console.log('\n❌ ERROR: No se encontraron grupos');
    return false;
  }
}

// Probar con servicio que tiene Policy
const test1 = buscarGruposConPolicy(configEjemplo, 'ConsultaProductoConSaldos');

// Probar con servicio sin Policy
const test2 = buscarGruposConPolicy(configEjemplo, 'BalanceInquiry');

console.log('\n\n============================================================');
console.log('RESUMEN FINAL');
console.log('============================================================');
console.log(`TEST 1 (README con N/A): ${desarrolloConNA && calidadConDatos && produccionConDatos ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`TEST 2a (Búsqueda con Policy): ${test1 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`TEST 2b (Búsqueda sin Policy): ${test2 ? '✅ PASÓ' : '❌ FALLÓ'}`);

const todosLosPruebas = desarrolloConNA && calidadConDatos && produccionConDatos && test1 && test2;
console.log(`\n${todosLosPruebas ? '✅ TODOS LOS TESTS PASARON' : '❌ ALGUNOS TESTS FALLARON'}`);
console.log('============================================================\n');

process.exit(todosLosPruebas ? 0 : 1);

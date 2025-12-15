/**
 * Test: Validación de grupos con viñetas markdown
 * Reproduce el error donde los * (asteriscos) se extraían como grupos
 */

// Simular extracción de grupos con VIÑETAS (*, -, •)
function extractGroupsOLD(text) {
  console.log('🔧 Método ANTIGUO (con bug):');
  console.log('Texto de entrada:', JSON.stringify(text));
  
  const groups = text
    .split(/[\s,]+/)
    .filter(g => g.trim())
    .map(g => g.toLowerCase());
  
  console.log('Grupos extraídos:', groups);
  console.log('Cantidad:', groups.length);
  return groups;
}

function extractGroupsNEW(text) {
  console.log('\n✅ Método NUEVO (fix aplicado):');
  console.log('Texto de entrada:', JSON.stringify(text));
  
  const groups = text
    .split(/[\s,]+/)
    .filter(g => g.trim())
    .filter(g => !/^[*\-•]$/.test(g)) // Remove markdown bullets
    .map(g => g.toLowerCase());
  
  console.log('Grupos extraídos:', groups);
  console.log('Cantidad:', groups.length);
  return groups;
}

// TEST CASES
console.log('═══════════════════════════════════════════════════════');
console.log('TEST 1: Grupos con viñetas * (caso del usuario)');
console.log('═══════════════════════════════════════════════════════\n');

const caso1 = '*  BOGESERVICIOSWS01_SRV01\n*  BOGESERVICIOSWS01_SRV02';
const groupsOld1 = extractGroupsOLD(caso1);
const groupsNew1 = extractGroupsNEW(caso1);

console.log('\n📊 COMPARACIÓN:');
console.log('Antiguo:', groupsOld1);
console.log('Nuevo:  ', groupsNew1);
console.log('✅ Fix correcto?', !groupsNew1.includes('*') && groupsNew1.length === 2);

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 2: Grupos con viñetas - (guiones)');
console.log('═══════════════════════════════════════════════════════\n');

const caso2 = '- BOGESERVICIOSWS05_SRV01\n- BOGESERVICIOSWS05_SRV02';
const groupsOld2 = extractGroupsOLD(caso2);
const groupsNew2 = extractGroupsNEW(caso2);

console.log('\n📊 COMPARACIÓN:');
console.log('Antiguo:', groupsOld2);
console.log('Nuevo:  ', groupsNew2);
console.log('✅ Fix correcto?', !groupsNew2.includes('-') && groupsNew2.length === 2);

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 3: Grupos separados por comas (sin viñetas)');
console.log('═══════════════════════════════════════════════════════\n');

const caso3 = 'BOGESERVICIOSWS01_SRV01, BOGESERVICIOSWS01_SRV02';
const groupsOld3 = extractGroupsOLD(caso3);
const groupsNew3 = extractGroupsNEW(caso3);

console.log('\n📊 COMPARACIÓN:');
console.log('Antiguo:', groupsOld3);
console.log('Nuevo:  ', groupsNew3);
console.log('✅ Fix correcto?', groupsNew3.length === 2 && JSON.stringify(groupsOld3) === JSON.stringify(groupsNew3));

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 4: Grupos en misma línea después de ":"');
console.log('═══════════════════════════════════════════════════════\n');

const caso4 = 'BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02';
const groupsOld4 = extractGroupsOLD(caso4);
const groupsNew4 = extractGroupsNEW(caso4);

console.log('\n📊 COMPARACIÓN:');
console.log('Antiguo:', groupsOld4);
console.log('Nuevo:  ', groupsNew4);
console.log('✅ Fix correcto?', groupsNew4.length === 2 && JSON.stringify(groupsOld4) === JSON.stringify(groupsNew4));

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 5: Grupos con viñetas • (bullet unicode)');
console.log('═══════════════════════════════════════════════════════\n');

const caso5 = '• BOGESERVICIOSWS03_SRV01\n• BOGESERVICIOSWS03_SRV02\n• BOGESERVICIOSWS03_SRV03';
const groupsOld5 = extractGroupsOLD(caso5);
const groupsNew5 = extractGroupsNEW(caso5);

console.log('\n📊 COMPARACIÓN:');
console.log('Antiguo:', groupsOld5);
console.log('Nuevo:  ', groupsNew5);
console.log('✅ Fix correcto?', !groupsNew5.includes('•') && groupsNew5.length === 3);

console.log('\n═══════════════════════════════════════════════════════');
console.log('RESUMEN FINAL');
console.log('═══════════════════════════════════════════════════════\n');

const allTests = [
  { name: 'Viñetas *', pass: !groupsNew1.includes('*') && groupsNew1.length === 2 },
  { name: 'Viñetas -', pass: !groupsNew2.includes('-') && groupsNew2.length === 2 },
  { name: 'Sin viñetas (comas)', pass: groupsNew3.length === 2 },
  { name: 'Sin viñetas (espacios)', pass: groupsNew4.length === 2 },
  { name: 'Viñetas •', pass: !groupsNew5.includes('•') && groupsNew5.length === 3 }
];

allTests.forEach(test => {
  console.log(`${test.pass ? '✅' : '❌'} ${test.name}`);
});

const allPassed = allTests.every(t => t.pass);
console.log('\n' + (allPassed ? '🎉 TODOS LOS TESTS PASARON!' : '❌ ALGUNOS TESTS FALLARON'));

if (allPassed) {
  console.log('\n✅ El fix elimina correctamente las viñetas markdown (*, -, •)');
  console.log('✅ Los grupos se extraen sin incluir caracteres de formato');
  console.log('✅ LISTO PARA COMPILAR Y PUSHEAR 🚀');
}

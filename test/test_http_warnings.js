/**
 * Test: Validación de URLs HTTP vs HTTPS con warnings
 * Verifica que HTTP sea aceptado pero con advertencia
 */

console.log('═══════════════════════════════════════════════════════');
console.log('TEST: Validación HTTP vs HTTPS en Endpoint BUS');
console.log('═══════════════════════════════════════════════════════\n');

// Simular validación de endpoints
function validateEndpoint(ambiente, endpoint) {
  const warnings = [];
  const errors = [];
  
  if (ambiente === 'DESARROLLO') {
    if (!/^https?:\/\/adbog162e/i.test(endpoint)) {
      errors.push(`Endpoint BUS en DESARROLLO debe comenzar con https://adbog162e o http://adbog162e. Encontrado: ${endpoint}`);
    } else if (/^http:\/\//i.test(endpoint)) {
      warnings.push(`⚠️  Endpoint BUS en DESARROLLO usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
    }
  } else if (ambiente === 'CALIDAD') {
    if (!/^https?:\/\/a[dt]bog16[34][de]/i.test(endpoint)) {
      errors.push(`Endpoint BUS en CALIDAD debe comenzar con nodos esperados (atbog163d, atbog164e, adbog163e, adbog164d). Encontrado: ${endpoint}`);
    } else if (/^http:\/\//i.test(endpoint)) {
      warnings.push(`⚠️  Endpoint BUS en CALIDAD usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
    }
  } else if (ambiente === 'PRODUCCION') {
    if (!(/^https?:\/\/adbog16[56][ab]/i.test(endpoint) || /^https?:\/\/boc060ap\.prd\.app/.test(endpoint))) {
      errors.push(`Endpoint BUS en PRODUCCION debe comenzar con nodos esperados (adbog165a, adbog165b, adbog166a, adbog166b o boc060ap.prd.app). Encontrado: ${endpoint}`);
    } else if (/^http:\/\//i.test(endpoint)) {
      warnings.push(`⚠️  Endpoint BUS en PRODUCCION usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
    }
  }
  
  return { warnings, errors };
}

// TEST 1: HTTPS (correcto - sin warnings)
console.log('📝 TEST 1: Endpoint con HTTPS en DESARROLLO');
const test1 = validateEndpoint('DESARROLLO', 'https://adbog162e:7899/DevolucionChequeService/DevolucionChequePort');
console.log('Endpoint:', 'https://adbog162e:7899/...');
console.log('Errores:', test1.errors.length);
console.log('Warnings:', test1.warnings.length);
console.log('✅ Correcto?', test1.errors.length === 0 && test1.warnings.length === 0);

// TEST 2: HTTP (válido pero con warning)
console.log('\n📝 TEST 2: Endpoint con HTTP en DESARROLLO (debe generar warning)');
const test2 = validateEndpoint('DESARROLLO', 'http://adbog162e:7899/DevolucionChequeService/DevolucionChequePort');
console.log('Endpoint:', 'http://adbog162e:7899/...');
console.log('Errores:', test2.errors.length);
console.log('Warnings:', test2.warnings.length);
if (test2.warnings.length > 0) {
  console.log('Warning:', test2.warnings[0]);
}
console.log('✅ Correcto?', test2.errors.length === 0 && test2.warnings.length === 1);

// TEST 3: HTTP en CALIDAD
console.log('\n📝 TEST 3: Endpoint con HTTP en CALIDAD (debe generar warning)');
const test3 = validateEndpoint('CALIDAD', 'http://atbog163d:7899/DevolucionChequeService/DevolucionChequePort');
console.log('Endpoint:', 'http://atbog163d:7899/...');
console.log('Errores:', test3.errors.length);
console.log('Warnings:', test3.warnings.length);
if (test3.warnings.length > 0) {
  console.log('Warning:', test3.warnings[0]);
}
console.log('✅ Correcto?', test3.errors.length === 0 && test3.warnings.length === 1);

// TEST 4: HTTP en PRODUCCION
console.log('\n📝 TEST 4: Endpoint con HTTP en PRODUCCION (debe generar warning)');
const test4 = validateEndpoint('PRODUCCION', 'http://adbog165a:7899/Service/Port');
console.log('Endpoint:', 'http://adbog165a:7899/...');
console.log('Errores:', test4.errors.length);
console.log('Warnings:', test4.warnings.length);
if (test4.warnings.length > 0) {
  console.log('Warning:', test4.warnings[0]);
}
console.log('✅ Correcto?', test4.errors.length === 0 && test4.warnings.length === 1);

// TEST 5: URL incorrecta (debe generar error)
console.log('\n📝 TEST 5: Endpoint con URL incorrecta (debe generar error)');
const test5 = validateEndpoint('DESARROLLO', 'https://servidor-incorrecto:7899/Service/Port');
console.log('Endpoint:', 'https://servidor-incorrecto:7899/...');
console.log('Errores:', test5.errors.length);
console.log('Warnings:', test5.warnings.length);
if (test5.errors.length > 0) {
  console.log('Error:', test5.errors[0]);
}
console.log('✅ Correcto?', test5.errors.length === 1 && test5.warnings.length === 0);

// TEST 6: HTTPS válido en CALIDAD con múltiples nodos
console.log('\n📝 TEST 6: HTTPS válidos en diferentes nodos de CALIDAD');
const calidad_nodos = [
  'https://atbog163d:7899/Service/Port',
  'https://atbog164e:7900/Service/Port',
  'https://adbog163e:7899/Service/Port',
  'https://adbog164d:7900/Service/Port'
];

let allValid = true;
calidad_nodos.forEach(url => {
  const result = validateEndpoint('CALIDAD', url);
  if (result.errors.length > 0 || result.warnings.length > 0) {
    allValid = false;
  }
});
console.log('Nodos probados:', calidad_nodos.length);
console.log('✅ Todos válidos?', allValid);

// RESUMEN
console.log('\n═══════════════════════════════════════════════════════');
console.log('RESUMEN');
console.log('═══════════════════════════════════════════════════════');

const allTests = [
  { name: 'HTTPS en DESARROLLO', pass: test1.errors.length === 0 && test1.warnings.length === 0 },
  { name: 'HTTP en DESARROLLO (warning)', pass: test2.errors.length === 0 && test2.warnings.length === 1 },
  { name: 'HTTP en CALIDAD (warning)', pass: test3.errors.length === 0 && test3.warnings.length === 1 },
  { name: 'HTTP en PRODUCCION (warning)', pass: test4.errors.length === 0 && test4.warnings.length === 1 },
  { name: 'URL incorrecta (error)', pass: test5.errors.length === 1 && test5.warnings.length === 0 },
  { name: 'Múltiples nodos CALIDAD', pass: allValid }
];

allTests.forEach(test => {
  console.log(`${test.pass ? '✅' : '❌'} ${test.name}`);
});

const allPassed = allTests.every(t => t.pass);
console.log(allPassed ? '\n🎉 TODOS LOS TESTS PASARON' : '\n❌ ALGUNOS TESTS FALLARON');

if (allPassed) {
  console.log('\n✅ HTTP es aceptado pero genera warnings');
  console.log('✅ HTTPS pasa sin warnings');
  console.log('✅ URLs incorrectas generan errores');
  console.log('✅ LISTO PARA COMPILAR 🚀');
}

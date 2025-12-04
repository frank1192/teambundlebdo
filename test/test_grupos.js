// Test local para validar grupos de ejecución
const fs = require('fs');
const path = require('path');

// Simular core de GitHub Actions
const core = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warning: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`)
};

// Simular contenido README SIN grupos de ejecución
const readmeWithoutGroups = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar

## ACCESO AL SERVICIO
...
`;

// Simular contenido README CON grupos de ejecución
const readmeWithGroups = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02

## ACCESO AL SERVICIO
...
`;

// Simular contenido README CON grupos vacíos
const readmeWithEmptyGroups = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar y desplegar en los grupos de ejecución:

## ACCESO AL SERVICIO
...
`;

function testExtractGroups(content, testName) {
  console.log(`\n========== ${testName} ==========`);
  
  try {
    // Extract service name
    const titleMatch = content.match(/^# ESB_ACE12_(.+)\.?$/m) || content.match(/^# ESB_(.+)\.?$/m);
    if (!titleMatch) {
      throw new Error('No se pudo extraer el nombre del servicio del README');
    }
    
    let serviceName = titleMatch[1].replace(/\.$/, '').trim();
    if (serviceName.startsWith('ACE12_')) {
      serviceName = serviceName.substring(6);
    }
    
    core.info(`Servicio detectado: ESB_ACE12_${serviceName}`);
    
    // Extract deployment section
    const deploymentSectionMatch = content.match(/^## Procedimiento de despliegue\s*\n([\s\S]*?)(?=\n## |$)/im);
    if (!deploymentSectionMatch) {
      throw new Error('No se encontró la sección "## Procedimiento de despliegue" en el README');
    }
    
    core.info('✅ Sección "Procedimiento de despliegue" encontrada');
    
    const deploymentSection = deploymentSectionMatch[1];
    const deploymentMatch = deploymentSection.match(/desplegar en los grupos de ejecución:\s*\n?([^\n#]+)/i);
    
    if (!deploymentMatch) {
      throw new Error(`No se encontró la frase "desplegar en los grupos de ejecución:" en el procedimiento de despliegue`);
    }
    
    core.info('✅ Frase "desplegar en los grupos de ejecución:" encontrada');
    core.info(`   Captura: "${deploymentMatch[1]}"`);
    
    const readmeGroups = deploymentMatch[1]
      .split(/[\s,]+/)
      .filter(g => g.trim())
      .map(g => g.toLowerCase());
    
    if (readmeGroups.length === 0) {
      throw new Error(`No se pudieron extraer los grupos de ejecución. Línea encontrada: ${deploymentMatch[0]}`);
    }
    
    core.info(`✅ Grupos extraídos (${readmeGroups.length}): ${readmeGroups.join(', ')}`);
    core.info(`✅ TEST PASÓ: ${testName}`);
    return true;
    
  } catch (error) {
    core.error(`❌ ${error.message}`);
    core.error(`❌ TEST FALLÓ: ${testName}`);
    return false;
  }
}

// Ejecutar tests
console.log('='.repeat(60));
console.log('PRUEBAS DE EXTRACCIÓN DE GRUPOS DE EJECUCIÓN');
console.log('='.repeat(60));

const test1 = testExtractGroups(readmeWithGroups, 'README con grupos definidos');
const test2 = testExtractGroups(readmeWithoutGroups, 'README sin grupos (debe fallar)');
const test3 = testExtractGroups(readmeWithEmptyGroups, 'README con grupos vacíos (debe fallar)');

console.log('\n' + '='.repeat(60));
console.log('RESUMEN DE TESTS');
console.log('='.repeat(60));
console.log(`Test 1 (con grupos): ${test1 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`Test 2 (sin grupos): ${test2 ? '❌ NO DEBERÍA PASAR' : '✅ FALLÓ CORRECTAMENTE'}`);
console.log(`Test 3 (grupos vacíos): ${test3 ? '❌ NO DEBERÍA PASAR' : '✅ FALLÓ CORRECTAMENTE'}`);
console.log('='.repeat(60));

// Verificar que test1 pase y test2/test3 fallen
const allCorrect = test1 === true && test2 === false && test3 === false;
if (allCorrect) {
  console.log('\n🎉 TODAS LAS PRUEBAS FUNCIONAN CORRECTAMENTE');
  process.exit(0);
} else {
  console.log('\n❌ ALGUNAS PRUEBAS NO FUNCIONAN COMO ESPERADO');
  process.exit(1);
}

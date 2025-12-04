// Test completo del flujo de validación
const fs = require('fs');
const path = require('path');

// Mock de core
const logs = [];
const errors = [];
const warnings = [];

const core = {
  info: (msg) => { console.log(`[INFO] ${msg}`); logs.push(msg); },
  error: (msg) => { console.error(`[ERROR] ${msg}`); errors.push(msg); },
  warning: (msg) => { console.warn(`[WARN] ${msg}`); warnings.push(msg); },
  debug: (msg) => { console.log(`[DEBUG] ${msg}`); },
  startGroup: (name) => { console.log(`\n========== ${name} ==========`); },
  endGroup: () => { console.log(''); }
};

// Simular el flujo principal
async function testValidationFlow(testName, readmeContent, hasToken) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(70));
  
  // Reset
  logs.length = 0;
  errors.length = 0;
  warnings.length = 0;
  
  const results = {
    branchName: null,
    readmeExistence: null,
    readmeTemplate: null,
    bdFolders: null,
    executionGroups: null,
    reviewersAndRoutes: null
  };
  
  const configRepoToken = hasToken ? 'fake-token' : null;
  const skipReadmeValidation = false;
  
  // Simular el Job 2
  if (!skipReadmeValidation) {
    core.startGroup('📄 Validación: README y Grupos de Ejecución');
    try {
      // Simular: README exists
      results.readmeExistence = true;
      core.info('✅ README.md encontrado');
      
      // Simular: README template válido
      if (results.readmeExistence) {
        results.readmeTemplate = true;
        core.info('✅ Plantilla README válida');
        
        // Validate execution groups
        if (configRepoToken) {
          core.info('🔍 Iniciando validación de grupos de ejecución');
          
          // Extract service name
          const titleMatch = readmeContent.match(/^# ESB_ACE12_(.+)\.?$/m) || readmeContent.match(/^# ESB_(.+)\.?$/m);
          if (!titleMatch) {
            throw new Error('No se pudo extraer el nombre del servicio del README');
          }
          
          let serviceName = titleMatch[1].replace(/\.$/, '').trim();
          core.info(`📝 Servicio detectado: ESB_ACE12_${serviceName}`);
          
          // Extract deployment section
          const deploymentSectionMatch = readmeContent.match(/^## Procedimiento de despliegue\s*$([\s\S]*?)(?=^## |\Z)/im);
          if (!deploymentSectionMatch) {
            throw new Error('No se encontró la sección "## Procedimiento de despliegue" en el README');
          }
          
          core.debug(`Sección de despliegue encontrada: "${deploymentSectionMatch[1]}"`);
          
          const deploymentSection = deploymentSectionMatch[1];
          const deploymentMatch = deploymentSection.match(/desplegar en los grupos de ejecución:\s*([^\n#]+)/i);
          
          if (!deploymentMatch) {
            throw new Error(`No se encontró la frase "desplegar en los grupos de ejecución:" en el procedimiento de despliegue para el servicio '${serviceName}'`);
          }
          
          // Extract groups - could be on same line or next line
          let groupsText = deploymentMatch[1].trim();
          
          // If empty, try to get from next line
          if (!groupsText) {
            const nextLineMatch = deploymentSection.match(/desplegar en los grupos de ejecución:\s*\n\s*([^\n#]+)/i);
            if (nextLineMatch && nextLineMatch[1]) {
              groupsText = nextLineMatch[1].trim();
            }
          }
          
          if (!groupsText) {
            throw new Error(`No se pudieron extraer los grupos de ejecución para el servicio '${serviceName}'. La frase "desplegar en los grupos de ejecución:" se encontró pero no hay grupos especificados después.`);
          }
          
          const readmeGroups = groupsText
            .split(/[\s,]+/)
            .filter(g => g.trim())
            .map(g => g.toLowerCase());
          
          if (readmeGroups.length === 0) {
            throw new Error(`No se pudieron extraer los grupos de ejecución para el servicio '${serviceName}'`);
          }
          
          core.info(`📚 Grupos en README (${readmeGroups.length}): ${readmeGroups.join(', ')}`);
          
          // Si llegamos aquí, la validación pasó
          results.executionGroups = true;
          core.info('✅ Grupos de ejecución coinciden');
        } else {
          core.warning('⚠️  Token de configuración no provisto, saltando validación de grupos de ejecución');
          results.executionGroups = true; // Mark as passed if skipped
        }
      }
    } catch (error) {
      core.error(`❌ Error en validación de README: ${error.message}`);
      
      // Set specific result based on which validation failed
      if (results.readmeExistence === null) {
        results.readmeExistence = false;
      } else if (results.readmeTemplate === null) {
        results.readmeTemplate = false;
      } else if (results.executionGroups === null) {
        results.executionGroups = false;
      }
    }
    core.endGroup();
  }
  
  // Resumen
  core.startGroup('📊 Resumen de Validaciones');
  const allPassed = Object.values(results).every(r => r !== false);
  
  core.info('Resultados:');
  core.info(`  - README existencia: ${results.readmeExistence !== false ? '✅' : '❌'}`);
  core.info(`  - README plantilla: ${results.readmeTemplate !== false ? '✅' : '❌'}`);
  core.info(`  - Grupos de ejecución: ${results.executionGroups !== false ? '✅' : '❌'}`);
  
  if (allPassed) {
    core.info('🎉 Todas las validaciones pasaron exitosamente');
  } else {
    core.error('❌ Una o más validaciones fallaron');
  }
  core.endGroup();
  
  return { allPassed, results, errors, warnings };
}

// Test cases
const readmeConGrupos = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02

## ACCESO AL SERVICIO
...
`;

const readmeSinGrupos = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar

## ACCESO AL SERVICIO
...
`;

const readmeGruposVacios = `
# ESB_ACE12_MiServicio

## INFORMACIÓN DEL SERVICIO
Descripción del servicio...

## Procedimiento de despliegue
Aplicar MiServicio.properties a MiServicio.bar y desplegar en los grupos de ejecución:

## ACCESO AL SERVICIO
...
`;

// Ejecutar tests
(async () => {
  const test1 = await testValidationFlow('README con grupos + token', readmeConGrupos, true);
  const test2 = await testValidationFlow('README sin grupos + token', readmeSinGrupos, true);
  const test3 = await testValidationFlow('README grupos vacíos + token', readmeGruposVacios, true);
  const test4 = await testValidationFlow('README con grupos SIN token', readmeConGrupos, false);
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('RESUMEN DE TESTS');
  console.log('='.repeat(70));
  
  const results = [
    { name: 'Test 1 (con grupos + token)', expected: true, actual: test1.allPassed, test: test1 },
    { name: 'Test 2 (sin grupos + token)', expected: false, actual: test2.allPassed, test: test2 },
    { name: 'Test 3 (grupos vacíos + token)', expected: false, actual: test3.allPassed, test: test3 },
    { name: 'Test 4 (con grupos SIN token)', expected: true, actual: test4.allPassed, test: test4 }
  ];
  
  let allOk = true;
  results.forEach(r => {
    const status = r.expected === r.actual ? '✅ CORRECTO' : '❌ ERROR';
    console.log(`${status}: ${r.name}`);
    console.log(`   Esperado: ${r.expected ? 'PASAR' : 'FALLAR'}, Actual: ${r.actual ? 'PASÓ' : 'FALLÓ'}`);
    console.log(`   executionGroups: ${r.test.results.executionGroups}`);
    console.log(`   Errores: ${r.test.errors.length}`);
    if (r.expected !== r.actual) {
      allOk = false;
      console.log(`   Detalles errores:`, r.test.errors);
    }
    console.log('');
  });
  
  console.log('='.repeat(70));
  if (allOk) {
    console.log('🎉 TODOS LOS TESTS PASARON CORRECTAMENTE');
    process.exit(0);
  } else {
    console.log('❌ ALGUNOS TESTS FALLARON');
    process.exit(1);
  }
})();

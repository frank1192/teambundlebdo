/**
 * Test de validación de revisores
 * Verifica que el mensaje de error incluya el sufijo _bocc
 */

console.log('================================================================================');
console.log('🧪 TEST: Validación de Revisores (con y sin sufijo)');
console.log('================================================================================\n');

// Simular la función de validación de revisores
function testReviewerValidation() {
  // Obtener valor por defecto (igual que en index.js)
  const validReviewersInput = 'DRamirezM,cdgomez,acardenasm,CAARIZA,JJPARADA';
  const validReviewers = validReviewersInput.split(',').map(r => r.trim());
  
  console.log('📋 Revisores válidos configurados por defecto:');
  validReviewers.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
  
  console.log('\n💡 NOTA: La validación ahora acepta revisores con o sin sufijo organizacional');
  
  // Helper function to normalize reviewer name (remove common suffixes)
  const normalizeReviewer = (name) => {
    return name.replace(/_bocc$/i, '').trim();
  };
  
  // Simular diferentes escenarios
  const testCases = [
    {
      name: 'PR develop → quality SIN revisor',
      source: 'develop',
      target: 'quality',
      reviewers: [],
      shouldFail: true
    },
    {
      name: 'PR develop → quality CON revisor válido sin sufijo (DRamirezM)',
      source: 'develop',
      target: 'quality',
      reviewers: ['DRamirezM'],
      shouldFail: false
    },
    {
      name: 'PR develop → quality CON revisor válido CON sufijo (DRamirezM_bocc)',
      source: 'develop',
      target: 'quality',
      reviewers: ['DRamirezM_bocc'],
      shouldFail: false
    },
    {
      name: 'PR develop → quality CON revisor válido sin sufijo (cdgomez)',
      source: 'develop',
      target: 'quality',
      reviewers: ['cdgomez'],
      shouldFail: false
    },
    {
      name: 'PR develop → quality CON revisor válido CON sufijo (cdgomez_bocc)',
      source: 'develop',
      target: 'quality',
      reviewers: ['cdgomez_bocc'],
      shouldFail: false
    },
    {
      name: 'PR develop → quality CON revisor inválido (usuario_no_autorizado)',
      source: 'develop',
      target: 'quality',
      reviewers: ['usuario_no_autorizado'],
      shouldFail: true
    },
    {
      name: 'PR quality → main CON revisor válido sin sufijo (acardenasm)',
      source: 'quality',
      target: 'main',
      reviewers: ['acardenasm'],
      shouldFail: false
    },
    {
      name: 'PR quality → main CON revisor válido CON sufijo (acardenasm_bocc)',
      source: 'quality',
      target: 'main',
      reviewers: ['acardenasm_bocc'],
      shouldFail: false
    },
    {
      name: 'PR quality → main SIN revisor',
      source: 'quality',
      target: 'main',
      reviewers: [],
      shouldFail: true
    },
    {
      name: 'PR quality → develop SIN revisor',
      source: 'quality',
      target: 'develop',
      reviewers: [],
      shouldFail: true
    },
    {
      name: 'PR main → quality SIN revisor',
      source: 'main',
      target: 'quality',
      reviewers: [],
      shouldFail: true
    }
  ];
  
  console.log('\n' + '='.repeat(80));
  console.log('🧪 Ejecutando casos de prueba...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log(`  Source: ${testCase.source} → Target: ${testCase.target}`);
    console.log(`  Revisores: ${testCase.reviewers.length > 0 ? testCase.reviewers.join(', ') : 'ninguno'}`);
    
    // Normalize both lists for comparison (case-insensitive and suffix-insensitive)
    const normalizedValidReviewers = validReviewers.map(r => normalizeReviewer(r).toLowerCase());
    const normalizedRequestedReviewers = testCase.reviewers.map(r => normalizeReviewer(r).toLowerCase());
    
    const hasValidReviewer = normalizedRequestedReviewers.some(reviewer => 
      normalizedValidReviewers.includes(reviewer)
    );
    
    let shouldGenerateError = false;
    let errorMessage = '';
    
    // Validar según el flujo
    if (testCase.target === 'quality' && testCase.source === 'develop') {
      if (!hasValidReviewer) {
        shouldGenerateError = true;
        errorMessage = `Falta revisor válido para calidad. Autorizados: ${validReviewers.join(', ')}`;
      }
    } else if (testCase.target === 'main' && testCase.source === 'quality') {
      if (!hasValidReviewer) {
        shouldGenerateError = true;
        errorMessage = `Falta revisor válido para producción. Autorizados: ${validReviewers.join(', ')}`;
      }
    } else if (testCase.target === 'quality' && testCase.source === 'main') {
      if (!hasValidReviewer) {
        shouldGenerateError = true;
        errorMessage = `Falta revisor válido para rollback de producción. Autorizados: ${validReviewers.join(', ')}`;
      }
    } else if (testCase.target === 'develop' && testCase.source === 'quality') {
      if (!hasValidReviewer) {
        shouldGenerateError = true;
        errorMessage = `Falta revisor válido para rollback a develop. Autorizados: ${validReviewers.join(', ')}`;
      }
    }
    
    const actuallyFailed = shouldGenerateError;
    const testPassed = actuallyFailed === testCase.shouldFail;
    
    if (testPassed) {
      console.log(`  ✅ PASSED`);
      if (shouldGenerateError) {
        console.log(`  Mensaje de error: "${errorMessage}"`);
        
        // Verificar que el mensaje contiene _bocc
        const hasBoccSuffix = errorMessage.includes('_bocc');
        if (hasBoccSuffix) {
          console.log(`  ✅ El mensaje incluye el sufijo _bocc correctamente`);
        } else {
          console.log(`  ❌ El mensaje NO incluye el sufijo _bocc`);
          failed++;
          return;
        }
      }
      passed++;
    } else {
      console.log(`  ❌ FAILED`);
      console.log(`  Esperaba fallo: ${testCase.shouldFail}, obtuvo: ${actuallyFailed}`);
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN');
  console.log('='.repeat(80));
  console.log(`Total: ${testCases.length}`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Tasa de éxito: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n✅ TODOS LOS TESTS PASARON');
    console.log('✅ Los mensajes de error incluyen correctamente el sufijo _bocc');
  } else {
    console.log('\n❌ ALGUNOS TESTS FALLARON');
  }
  
  console.log('='.repeat(80));
  
  return failed === 0;
}

const success = testReviewerValidation();
process.exit(success ? 0 : 1);

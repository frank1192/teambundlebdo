/**
 * Test de validación de revisores para diferentes flujos de ramas
 * Simula múltiples PRs con diferentes combinaciones de ramas y revisores
 */

console.log('='.repeat(80));
console.log('🧪 TEST: Validación de Revisores en Diferentes Flujos de Ramas');
console.log('='.repeat(80));

// Revisores válidos (igual que en el código)
const validReviewers = ['DRamirezM_bocc', 'cdgomez_bocc', 'acardenasm_bocc', 'CAARIZA_bocc', 'JJPARADA_bocc'];

/**
 * Función simulada de validación de revisores
 */
function validateReviewersAndRoutes(sourceBranch, targetBranch, requestedReviewers) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📋 PR: ${sourceBranch} → ${targetBranch}`);
  console.log(`👥 Revisores solicitados: ${requestedReviewers.length > 0 ? requestedReviewers.join(', ') : 'ninguno'}`);
  
  // Check if any valid reviewer is assigned
  const hasValidReviewer = requestedReviewers.some(r => validReviewers.includes(r));
  
  // Validate develop → quality
  if (targetBranch === 'quality' && sourceBranch === 'develop') {
    console.log(`📍 Validando revisores para flujo develop → quality`);
    if (!hasValidReviewer) {
      console.log(`❌ ERROR: Falta revisor válido para calidad. Autorizados: ${validReviewers.join(', ')}`);
      return false;
    }
    console.log(`✅ Revisor válido encontrado para calidad`);
    return true;
  }
  
  // Validate quality → main
  if (targetBranch === 'main' && sourceBranch === 'quality') {
    console.log(`📍 Validando revisores para flujo quality → main`);
    if (!hasValidReviewer) {
      console.log(`❌ ERROR: Falta revisor válido para producción. Autorizados: ${validReviewers.join(', ')}`);
      return false;
    }
    console.log(`✅ Revisor válido encontrado para producción`);
    return true;
  }
  
  // Validate main → quality (rollback de producción a calidad)
  if (targetBranch === 'quality' && sourceBranch === 'main') {
    console.log(`📍 Validando revisores para flujo main → quality (rollback de producción)`);
    if (!hasValidReviewer) {
      console.log(`❌ ERROR: Falta revisor válido para rollback de producción. Autorizados: ${validReviewers.join(', ')}`);
      return false;
    }
    console.log(`✅ Revisor válido encontrado para rollback de producción`);
    return true;
  }
  
  // Validate quality → develop (rollback o corrección)
  if (targetBranch === 'develop' && sourceBranch === 'quality') {
    console.log(`📍 Validando revisores para flujo quality → develop (rollback/corrección)`);
    if (!hasValidReviewer) {
      console.log(`❌ ERROR: Falta revisor válido para rollback a develop. Autorizados: ${validReviewers.join(', ')}`);
      return false;
    }
    console.log(`✅ Revisor válido encontrado para rollback`);
    return true;
  }
  
  // Check for emergency exception (feature/** → develop)
  if (targetBranch === 'develop' && sourceBranch.startsWith('feature/')) {
    console.log(`📍 Validando flujo feature → develop (opcional)`);
    if (!hasValidReviewer) {
      console.log(`ℹ️  No hay revisor asignado, pero no es obligatorio para este flujo`);
    } else {
      console.log(`✅ Revisor asignado: ${requestedReviewers.join(', ')}`);
    }
    return true;
  }
  
  // Para cualquier otro flujo, no requerir revisores
  console.log(`📍 Flujo ${sourceBranch} → ${targetBranch}: validación de revisores no requerida`);
  console.log(`✅ Validación no aplicable para este flujo`);
  return true;
}

// ============================================================================
// CASOS DE PRUEBA
// ============================================================================

const testCases = [
  // === CASOS QUE REQUIEREN REVISOR ===
  {
    name: 'Caso 1: develop → quality CON revisor válido',
    source: 'develop',
    target: 'quality',
    reviewers: ['DRamirezM_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 2: develop → quality SIN revisor',
    source: 'develop',
    target: 'quality',
    reviewers: [],
    expectedResult: false
  },
  {
    name: 'Caso 3: develop → quality CON revisor NO autorizado',
    source: 'develop',
    target: 'quality',
    reviewers: ['otro_usuario_bocc'],
    expectedResult: false
  },
  {
    name: 'Caso 4: quality → main CON revisor válido',
    source: 'quality',
    target: 'main',
    reviewers: ['cdgomez_bocc', 'acardenasm_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 5: quality → main SIN revisor',
    source: 'quality',
    target: 'main',
    reviewers: [],
    expectedResult: false
  },
  {
    name: 'Caso 6: main → quality (rollback) CON revisor',
    source: 'main',
    target: 'quality',
    reviewers: ['CAARIZA_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 7: main → quality (rollback) SIN revisor',
    source: 'main',
    target: 'quality',
    reviewers: [],
    expectedResult: false
  },
  {
    name: 'Caso 8: quality → develop (rollback) CON revisor',
    source: 'quality',
    target: 'develop',
    reviewers: ['DRamirezM_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 9: quality → develop (rollback) SIN revisor',
    source: 'quality',
    target: 'develop',
    reviewers: [],
    expectedResult: false
  },
  
  // === CASOS OPCIONALES ===
  {
    name: 'Caso 10: feature/TAC-123 → develop CON revisor',
    source: 'feature/TAC-123',
    target: 'develop',
    reviewers: ['JJPARADA_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 11: feature/TAC-456 → develop SIN revisor (opcional)',
    source: 'feature/TAC-456',
    target: 'develop',
    reviewers: [],
    expectedResult: true
  },
  
  // === CASOS QUE NO REQUIEREN VALIDACIÓN ===
  {
    name: 'Caso 12: feature/TEST → feature/base',
    source: 'feature/TEST',
    target: 'feature/base',
    reviewers: [],
    expectedResult: true
  },
  {
    name: 'Caso 13: bugfix/issue-1 → develop',
    source: 'bugfix/issue-1',
    target: 'develop',
    reviewers: [],
    expectedResult: true
  },
  {
    name: 'Caso 14: hotfix/critical → main',
    source: 'hotfix/critical',
    target: 'main',
    reviewers: ['DRamirezM_bocc'],
    expectedResult: true
  },
  {
    name: 'Caso 15: develop → main (directo, no común pero válido)',
    source: 'develop',
    target: 'main',
    reviewers: [],
    expectedResult: true
  }
];

// ============================================================================
// EJECUTAR TESTS
// ============================================================================

console.log(`\n\n📊 Ejecutando ${testCases.length} casos de prueba...\n`);

let passed = 0;
let failed = 0;
const failures = [];

testCases.forEach((testCase, index) => {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🧪 ${testCase.name}`);
  
  const result = validateReviewersAndRoutes(
    testCase.source,
    testCase.target,
    testCase.reviewers
  );
  
  const success = result === testCase.expectedResult;
  
  if (success) {
    console.log(`\n✅ PASSED - Resultado esperado: ${testCase.expectedResult}, obtenido: ${result}`);
    passed++;
  } else {
    console.log(`\n❌ FAILED - Resultado esperado: ${testCase.expectedResult}, obtenido: ${result}`);
    failed++;
    failures.push({
      name: testCase.name,
      expected: testCase.expectedResult,
      actual: result
    });
  }
});

// ============================================================================
// RESUMEN FINAL
// ============================================================================

console.log(`\n\n${'═'.repeat(80)}`);
console.log('📊 RESUMEN DE TESTS');
console.log(`${'═'.repeat(80)}`);
console.log(`Total de tests: ${testCases.length}`);
console.log(`✅ Pasados: ${passed}`);
console.log(`❌ Fallados: ${failed}`);
console.log(`📈 Tasa de éxito: ${((passed / testCases.length) * 100).toFixed(1)}%`);

if (failed > 0) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log('❌ TESTS FALLADOS:');
  console.log(`${'─'.repeat(80)}`);
  failures.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.name}`);
    console.log(`   Esperado: ${failure.expected}, Obtenido: ${failure.actual}`);
  });
}

console.log(`\n${'═'.repeat(80)}`);

// Retornar código de salida apropiado
process.exit(failed > 0 ? 1 : 0);

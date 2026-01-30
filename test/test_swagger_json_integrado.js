/**
 * Test integrado usando el código real de validación de SWAGGER y JSON
 */

const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('TEST INTEGRADO: SWAGGER y JSON con código real');
console.log('============================================================\n');

// Test cases
const testCases = [
  {
    name: 'SWAGGER con path correcto (forward slash)',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**SWAGGER:**
git/ESB_ACE12_AccountsTransactionHistory/Broker/SWAGGER/

**Otro Campo:**
Algo más
`,
    shouldPass: true
  },
  {
    name: 'SWAGGER sin dos puntos después de ** (caso problemático)',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**SWAGGER**
git/ESB_ACE12_AccountsTransactionHistory/Broker/SWAGGER/

**Otro Campo:**
Algo más
`,
    shouldPass: true
  },
  {
    name: 'SWAGGER con backslashes',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**SWAGGER:**
git\\ESB_ACE12_AccountsTransactionHistory\\Broker\\SWAGGER\\

**Otro Campo:**
Algo más
`,
    shouldPass: true
  },
  {
    name: 'JSON con path correcto',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**JSON:**
git\\ESB_ACE12_AccountsTransactionHistory\\Broker\\JSON

**Otro Campo:**
Algo más
`,
    shouldPass: true
  },
  {
    name: 'JSON en carpeta SWAGGER (válido)',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**JSON:**
git/ESB_ACE12_AccountsTransactionHistory/Broker/SWAGGER/api.json

**Otro Campo:**
Algo más
`,
    shouldPass: true
  },
  {
    name: 'SWAGGER con path incorrecto',
    title: '# ESB_ACE12_AccountsTransactionHistory',
    docContent: `
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**SWAGGER:**
git/OtroRepositorio/Broker/SWAGGER/

**Otro Campo:**
Algo más
`,
    shouldPass: false
  }
];

let allPassed = true;

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST ${index + 1}: ${testCase.name}`);
  console.log('='.repeat(60));
  
  const content = testCase.title + '\n' + testCase.docContent;
  const docContent = testCase.docContent;
  
  // Extract repo name
  const titleMatch = content.match(/^#\s*(ESB_.+)$/m);
  const repo_name = titleMatch ? titleMatch[1].replace(/\.$/, '').trim() : '';
  console.log(`Repositorio detectado: ${repo_name}`);
  
  // Check for SWAGGER/JSON
  const hasSWAGGER = /\*\*SWAGGER\*?\*?:?/i.test(docContent);
  const hasJSON = /\*\*JSON\*?\*?:?/i.test(docContent);
  
  console.log(`¿Tiene SWAGGER?: ${hasSWAGGER ? 'SÍ' : 'NO'}`);
  console.log(`¿Tiene JSON?: ${hasJSON ? 'SÍ' : 'NO'}`);
  
  let validationPassed = false;
  let errorMessage = '';
  
  // Validate SWAGGER
  if (hasSWAGGER) {
    const swaggerStart = docContent.search(/\*\*SWAGGER\*?\*?:?/i);
    if (swaggerStart !== -1) {
      const headerMatch = docContent.substring(swaggerStart).match(/^\*\*SWAGGER\*?\*?:?/i);
      const headerLength = headerMatch ? headerMatch[0].length : 12;
      
      const nextFieldMatch = docContent.substring(swaggerStart + headerLength).search(/\*\*[A-Z]/);
      const swaggerEnd = nextFieldMatch > 0 ? swaggerStart + headerLength + nextFieldMatch : docContent.length;
      const swaggerFragment = docContent.substring(swaggerStart, swaggerEnd);
      
      const cleanFragment = swaggerFragment
        .replace(/\*\*SWAGGER\*?\*?:?/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
      const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
      const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
      const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
      
      if (gitPatternBackslashSwagger.test(swaggerFragment) || 
          gitPatternForwardslashSwagger.test(swaggerFragment) ||
          gitPatternBackslashJSON.test(swaggerFragment) ||
          gitPatternForwardslashJSON.test(swaggerFragment) ||
          /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        validationPassed = true;
        console.log('✅ Validación SWAGGER: PASÓ');
      } else {
        errorMessage = `El campo 'SWAGGER' debe comenzar con 'git/${repo_name}/Broker/SWAGGER/' o 'git/${repo_name}/Broker/JSON/'`;
        console.log(`❌ Validación SWAGGER: FALLÓ - ${errorMessage}`);
      }
    }
  }
  
  // Validate JSON
  if (hasJSON) {
    const jsonStart = docContent.search(/\*\*JSON\*?\*?:?/i);
    if (jsonStart !== -1) {
      const headerMatch = docContent.substring(jsonStart).match(/^\*\*JSON\*?\*?:?/i);
      const headerLength = headerMatch ? headerMatch[0].length : 8;
      
      const nextFieldMatch = docContent.substring(jsonStart + headerLength).search(/\*\*[A-Z]/);
      const jsonEnd = nextFieldMatch > 0 ? jsonStart + headerLength + nextFieldMatch : docContent.length;
      const jsonFragment = docContent.substring(jsonStart, jsonEnd);
      
      const cleanFragment = jsonFragment
        .replace(/\*\*JSON\*?\*?:?/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
      const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
      const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
      const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
      
      if (gitPatternBackslashJSON.test(jsonFragment) || 
          gitPatternForwardslashJSON.test(jsonFragment) ||
          gitPatternBackslashSwagger.test(jsonFragment) ||
          gitPatternForwardslashSwagger.test(jsonFragment) ||
          /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        validationPassed = true;
        console.log('✅ Validación JSON: PASÓ');
      } else {
        errorMessage = `El campo 'JSON' debe comenzar con 'git/${repo_name}/Broker/JSON/' o 'git/${repo_name}/Broker/SWAGGER/'`;
        console.log(`❌ Validación JSON: FALLÓ - ${errorMessage}`);
      }
    }
  }
  
  // Check if result matches expectation
  const testPassed = validationPassed === testCase.shouldPass;
  if (testPassed) {
    console.log(`\n✅ TEST EXITOSO (resultado esperado: ${testCase.shouldPass ? 'PASAR' : 'FALLAR'})`);
  } else {
    console.log(`\n❌ TEST FALLÓ (se esperaba que ${testCase.shouldPass ? 'PASARA' : 'FALLARA'}, pero ${validationPassed ? 'PASÓ' : 'FALLÓ'})`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(60));
console.log('RESUMEN FINAL');
console.log('='.repeat(60));
console.log(allPassed ? '✅ TODOS LOS TESTS PASARON' : '❌ ALGUNOS TESTS FALLARON');
console.log('='.repeat(60) + '\n');

process.exit(allPassed ? 0 : 1);

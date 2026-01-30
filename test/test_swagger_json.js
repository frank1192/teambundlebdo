/**
 * Test para debug de validación SWAGGER/JSON
 */

const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('TEST DEBUG: SWAGGER y JSON');
console.log('============================================================\n');

// Caso 1: SWAGGER con path correcto
const testCase1 = `
**SWAGGER**
git/ESB_ACE12_AccountsTransactionHistory/Broker/SWAGGER/
`;

// Caso 2: SWAGGER con backslashes
const testCase2 = `
**SWAGGER:**
git\\ESB_ACE12_AccountsTransactionHistory\\Broker\\SWAGGER\\
`;

// Caso 3: JSON
const testCase3 = `
**JSON:**
git\\ESB_ACE12_AccountsTransactionHistory\\Broker\\JSON
`;

// Caso 4: JSON con forward slashes
const testCase4 = `
**JSON:**
git/ESB_ACE12_AccountsTransactionHistory/Broker/JSON/
`;

function testSWAGGERValidation(testName, docContent, repo_name) {
  console.log(`\n========== ${testName} ==========`);
  console.log('Contenido:');
  console.log(docContent);
  console.log('');
  
  // Detectar si tiene SWAGGER o JSON
  const hasSWAGGER = /\*\*SWAGGER\*\*/i.test(docContent) || /SWAGGER:/i.test(docContent);
  const hasJSON = /\*\*JSON\*\*/i.test(docContent) || /JSON:/i.test(docContent);
  
  console.log(`¿Tiene SWAGGER?: ${hasSWAGGER ? '✅ SÍ' : '❌ NO'}`);
  console.log(`¿Tiene JSON?: ${hasJSON ? '✅ SÍ' : '❌ NO'}`);
  
  if (hasSWAGGER) {
    // Capturar contenido SWAGGER
    const swaggerStart = docContent.search(/\*\*SWAGGER(?:\*\*)?:/i);
    if (swaggerStart === -1) {
      console.log('[ERROR] No se encontró el inicio de SWAGGER');
      return;
    }
    
    console.log(`Inicio de SWAGGER: posición ${swaggerStart}`);
    
    // Buscar el siguiente campo que empieza con **
    const afterSwagger = docContent.substring(swaggerStart + 12);
    const nextFieldMatch = afterSwagger.search(/\*\*[A-Z]/);
    const swaggerEnd = nextFieldMatch > 0 ? swaggerStart + 12 + nextFieldMatch : docContent.length;
    const swaggerFragment = docContent.substring(swaggerStart, swaggerEnd);
    
    console.log('Fragmento capturado:');
    console.log('---');
    console.log(swaggerFragment);
    console.log('---');
    console.log(`Longitud: ${swaggerFragment.length} caracteres`);
    
    // Limpiar el fragmento
    const cleanFragment = swaggerFragment
      .replace(/\*\*SWAGGER(?:\*\*)?:/i, '')
      .replace(/<br>/gi, '')
      .trim();
    
    console.log('Fragmento limpio:');
    console.log(`"${cleanFragment}"`);
    
    // Validar
    const gitPatternBackslash = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER\\\\`, 'i');
    const gitPatternForwardslash = new RegExp(`git/${repo_name}/Broker/SWAGGER/`, 'i');
    
    console.log('\nPatrones de validación:');
    console.log(`  Backslash: git\\\\${repo_name}\\\\Broker\\\\SWAGGER\\\\`);
    console.log(`  Forwardslash: git/${repo_name}/Broker/SWAGGER/`);
    
    const matchBackslash = gitPatternBackslash.test(swaggerFragment);
    const matchForwardslash = gitPatternForwardslash.test(swaggerFragment);
    const isNA = /^\s*N\/?A\s*$/i.test(cleanFragment);
    
    console.log('\nResultados de validación:');
    console.log(`  ¿Coincide con backslash?: ${matchBackslash ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Coincide con forwardslash?: ${matchForwardslash ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Es N/A?: ${isNA ? '✅ SÍ' : '❌ NO'}`);
    
    if (matchBackslash || matchForwardslash || isNA) {
      console.log('\n✅ VALIDACIÓN EXITOSA');
    } else {
      console.log('\n❌ VALIDACIÓN FALLÓ');
    }
  }
  
  if (hasJSON) {
    console.log('\n[INFO] Detectado campo JSON (actualmente no se valida)');
    
    // Capturar contenido JSON
    const jsonStart = docContent.search(/\*\*JSON(?:\*\*)?:/i);
    if (jsonStart === -1) {
      console.log('[ERROR] No se encontró el inicio de JSON');
      return;
    }
    
    console.log(`Inicio de JSON: posición ${jsonStart}`);
    
    const afterJSON = docContent.substring(jsonStart + 8);
    const nextFieldMatch = afterJSON.search(/\*\*[A-Z]/);
    const jsonEnd = nextFieldMatch > 0 ? jsonStart + 8 + nextFieldMatch : docContent.length;
    const jsonFragment = docContent.substring(jsonStart, jsonEnd);
    
    console.log('Fragmento capturado:');
    console.log('---');
    console.log(jsonFragment);
    console.log('---');
    
    // Limpiar el fragmento
    const cleanFragment = jsonFragment
      .replace(/\*\*JSON(?:\*\*)?:/i, '')
      .replace(/<br>/gi, '')
      .trim();
    
    console.log('Fragmento limpio:');
    console.log(`"${cleanFragment}"`);
    
    // Validar JSON (debe aceptar git/.../Broker/JSON o git/.../Broker/SWAGGER)
    const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
    const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
    const gitPatternBackslashSWAGGER = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
    const gitPatternForwardslashSWAGGER = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
    
    console.log('\nPatrones de validación para JSON:');
    console.log(`  Backslash JSON: git\\\\${repo_name}\\\\Broker\\\\JSON`);
    console.log(`  Forwardslash JSON: git/${repo_name}/Broker/JSON`);
    console.log(`  Backslash SWAGGER: git\\\\${repo_name}\\\\Broker\\\\SWAGGER`);
    console.log(`  Forwardslash SWAGGER: git/${repo_name}/Broker/SWAGGER`);
    
    const matchBackslashJSON = gitPatternBackslashJSON.test(jsonFragment);
    const matchForwardslashJSON = gitPatternForwardslashJSON.test(jsonFragment);
    const matchBackslashSWAGGER = gitPatternBackslashSWAGGER.test(jsonFragment);
    const matchForwardslashSWAGGER = gitPatternForwardslashSWAGGER.test(jsonFragment);
    const isNA = /^\s*N\/?A\s*$/i.test(cleanFragment);
    
    console.log('\nResultados de validación:');
    console.log(`  ¿Coincide con backslash JSON?: ${matchBackslashJSON ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Coincide con forwardslash JSON?: ${matchForwardslashJSON ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Coincide con backslash SWAGGER?: ${matchBackslashSWAGGER ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Coincide con forwardslash SWAGGER?: ${matchForwardslashSWAGGER ? '✅ SÍ' : '❌ NO'}`);
    console.log(`  ¿Es N/A?: ${isNA ? '✅ SÍ' : '❌ NO'}`);
    
    if (matchBackslashJSON || matchForwardslashJSON || matchBackslashSWAGGER || matchForwardslashSWAGGER || isNA) {
      console.log('\n✅ VALIDACIÓN EXITOSA (si JSON estuviera implementado)');
    } else {
      console.log('\n❌ VALIDACIÓN FALLARÍA');
    }
  }
}

const repoName = 'ESB_ACE12_AccountsTransactionHistory';

testSWAGGERValidation('Caso 1: SWAGGER sin dos puntos', testCase1, repoName);
testSWAGGERValidation('Caso 2: SWAGGER con backslashes', testCase2, repoName);
testSWAGGERValidation('Caso 3: JSON con backslashes', testCase3, repoName);
testSWAGGERValidation('Caso 4: JSON con forward slashes', testCase4, repoName);

console.log('\n============================================================');
console.log('FIN DEL TEST');
console.log('============================================================\n');

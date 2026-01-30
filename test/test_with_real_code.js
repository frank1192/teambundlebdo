/**
 * Test usando validateReadmeTemplate directamente
 */

const fs = require('fs');
const path = require('path');

// Mock core
global.core = {
  info: () => {},
  error: () => {},
  warning: () => {},
  startGroup: () => {},
  endGroup: () => {},
  setOutput: () => {},
  setFailed: () => {}
};

// Mock github
global.github = {
  context: { repo: { owner: 'test', repo: 'test' } },
  getOctokit: () => {}
};

// Cargar index.js
const indexPath = path.join(__dirname, '..', 'index.js');
const indexCode = fs.readFileSync(indexPath, 'utf8');

// Extraer solo la función validateReadmeTemplate
const funcMatch = indexCode.match(/async function validateReadmeTemplate\([\s\S]*?\n}\n\n/);
if (!funcMatch) {
  console.error('No se pudo extraer validateReadmeTemplate');
  process.exit(1);
}

// Ejecutar la función
const funcCode = funcMatch[0];
eval(funcCode);

console.log('============================================================');
console.log('TEST: Validando READMEs con código real de index.js');
console.log('============================================================\n');

async function testReadme(fileName) {
  console.log(`\n--- Probando: ${fileName} ---`);
  
  const readmePath = path.join(__dirname, '..', 'bancos readme a evaluar', fileName);
  
  try {
    const result = await validateReadmeTemplate(path.dirname(readmePath));
    console.log(`✅ ${fileName}: VÁLIDO`);
    return true;
  } catch (error) {
    console.log(`❌ ${fileName}: ERROR - ${error.message}`);
    return false;
  }
}

(async () => {
  const result13 = await testReadme('README (13).md');
  const result14 = await testReadme('README (14).md');
  
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN:');
  console.log(`README (13): ${result13 ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`README (14): ${result14 ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log('='.repeat(60));
  
  process.exit((result13 && result14) ? 0 : 1);
})();

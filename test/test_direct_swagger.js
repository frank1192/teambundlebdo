/**
 * Test directo de validación de SWAGGER/JSON usando el código de index.js
 */

const fs = require('fs');
const path = require('path');

// Simular core functions
const core = {
  info: (msg) => console.log(msg),
  error: (msg) => console.error(msg),
  warning: (msg) => console.warn(msg)
};

// Test con el README que tiene **SWAGGER** (sin dos puntos)
const readmePath = path.join(__dirname, 'README_TEST_SWAGGER.md');
if (!fs.existsSync(readmePath)) {
  console.error('No se encontró README_TEST_SWAGGER.md');
  process.exit(1);
}

const content = fs.readFileSync(readmePath, 'utf8');

// Buscar sección DOCUMENTACION
const docMatch = content.match(/^## DOCUMENTACION[\s\S]*?(?=^## |\n*$)/m);
if (!docMatch) {
  console.error('No se encontró sección DOCUMENTACION');
  process.exit(1);
}

const docContent = docMatch[0];

console.log('============================================================');
console.log('TEST: Validación de README_TEST_SWAGGER.md');
console.log('============================================================\n');

// Extract repo name
const titleMatch = content.match(/^#\s*(ESB_.+)$/m);
const repo_name = titleMatch ? titleMatch[1].replace(/\.$/, '').trim() : '';
console.log(`Repositorio: ${repo_name}\n`);

// Check for SWAGGER/JSON
const hasSWAGGER = /\*\*SWAGGER\*?\*?:?/i.test(docContent);
const hasJSON = /\*\*JSON\*?\*?:?/i.test(docContent);

console.log(`¿Tiene SWAGGER?: ${hasSWAGGER ? '✅ SÍ' : '❌ NO'}`);
console.log(`¿Tiene JSON?: ${hasJSON ? '✅ SÍ' : '❌ NO'}\n`);

// Show the SWAGGER section
const swaggerMatch = docContent.match(/\*\*SWAGGER\*?\*?:?[\s\S]*?(?=\*\*[A-Z]|$)/i);
if (swaggerMatch) {
  console.log('Contenido SWAGGER encontrado:');
  console.log('---');
  console.log(swaggerMatch[0]);
  console.log('---\n');
}

let errors = [];
let notices = [];

// Validate SWAGGER
if (hasSWAGGER) {
  core.info('Validando campo SWAGGER...');
  const swaggerStart = docContent.search(/\*\*SWAGGER\*?\*?:?/i);
  if (swaggerStart === -1) {
    errors.push("Error interno: SWAGGER detectado pero no se pudo localizar");
  } else {
    const headerMatch = docContent.substring(swaggerStart).match(/^\*\*SWAGGER\*?\*?:?/i);
    const headerLength = headerMatch ? headerMatch[0].length : 12;
    
    console.log(`Header encontrado: "${headerMatch[0]}"`);
    console.log(`Longitud header: ${headerLength}\n`);
    
    const nextFieldMatch = docContent.substring(swaggerStart + headerLength).search(/\*\*[A-Z]/);
    const swaggerEnd = nextFieldMatch > 0 ? swaggerStart + headerLength + nextFieldMatch : docContent.length;
    const swaggerFragment = docContent.substring(swaggerStart, swaggerEnd);
    
    console.log('Fragmento capturado:');
    console.log('---');
    console.log(swaggerFragment);
    console.log('---\n');
    
    const cleanFragment = swaggerFragment
      .replace(/\*\*SWAGGER\*?\*?:?/i, '')
      .replace(/<br>/gi, '')
      .trim();
    
    console.log(`Fragmento limpio: "${cleanFragment}"\n`);
    
    const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
    const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
    const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
    const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
    
    console.log('Patrones de validación:');
    console.log(`  1. git\\\\${repo_name}\\\\Broker\\\\SWAGGER`);
    console.log(`  2. git/${repo_name}/Broker/SWAGGER`);
    console.log(`  3. git\\\\${repo_name}\\\\Broker\\\\JSON`);
    console.log(`  4. git/${repo_name}/Broker/JSON\n`);
    
    const match1 = gitPatternBackslashSwagger.test(swaggerFragment);
    const match2 = gitPatternForwardslashSwagger.test(swaggerFragment);
    const match3 = gitPatternBackslashJSON.test(swaggerFragment);
    const match4 = gitPatternForwardslashJSON.test(swaggerFragment);
    const isNA = /^\s*N\/?A\s*$/i.test(cleanFragment);
    
    console.log('Resultados:');
    console.log(`  1. Backslash SWAGGER: ${match1 ? '✅' : '❌'}`);
    console.log(`  2. Forwardslash SWAGGER: ${match2 ? '✅' : '❌'}`);
    console.log(`  3. Backslash JSON: ${match3 ? '✅' : '❌'}`);
    console.log(`  4. Forwardslash JSON: ${match4 ? '✅' : '❌'}`);
    console.log(`  5. Es N/A: ${isNA ? '✅' : '❌'}\n`);
    
    if (match1 || match2 || match3 || match4 || isNA) {
      notices.push(`Ruta SWAGGER válida para repositorio '${repo_name}'`);
      console.log('✅ VALIDACIÓN EXITOSA\n');
    } else {
      errors.push(`El campo 'SWAGGER' debe comenzar con 'git/${repo_name}/Broker/SWAGGER/' o 'git/${repo_name}/Broker/JSON/' (también acepta backslashes) o contener solo 'N/A'.`);
      console.log('❌ VALIDACIÓN FALLÓ\n');
    }
  }
}

console.log('============================================================');
console.log('RESUMEN');
console.log('============================================================');
console.log(`Errores: ${errors.length}`);
errors.forEach(err => console.log(`  ❌ ${err}`));
console.log(`Notices: ${notices.length}`);
notices.forEach(notice => console.log(`  ✅ ${notice}`));

if (errors.length === 0) {
  console.log('\n✅ VALIDACIÓN COMPLETA EXITOSA');
  process.exit(0);
} else {
  console.log('\n❌ VALIDACIÓN FALLÓ');
  process.exit(1);
}

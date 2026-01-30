/**
 * Test completo de los READMEs (13) y (14)
 */

const fs = require('fs');
const path = require('path');

function testReadme(fileName) {
  console.log('\n' + '='.repeat(70));
  console.log(`PROBANDO: ${fileName}`);
  console.log('='.repeat(70));
  
  const readmePath = path.join(__dirname, '..', 'bancos readme a evaluar', fileName);
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ No se encontró ${fileName}`);
    return false;
  }
  
  const content = fs.readFileSync(readmePath, 'utf8');
  
  // Extract repo name
  const titleMatch = content.match(/^#\s*(ESB_.+)$/m);
  const repo_name = titleMatch ? titleMatch[1].replace(/\.$/, '').trim() : '';
  console.log(`\nRepositorio: ${repo_name}`);
  
  // Find DOCUMENTACION section - line by line approach like index.js
  const docLines = content.split('\n');
  let docSection = '';
  let capturingDoc = false;
  for (const line of docLines) {
    if (/^\s*## DOCUMENTACION/i.test(line)) {
      capturingDoc = true;
      continue;
    }
    if (capturingDoc && /^\s*## /.test(line)) break;
    if (capturingDoc) docSection += line + '\n';
  }
  
  if (!docSection.trim()) {
    console.error('❌ No se encontró sección DOCUMENTACION');
    return false;
  }
  
  const docContent = docSection;
  
  // Check for SWAGGER/JSON/WSDL
  const hasWSDL = /\*\*WSDL(\*\*)?:?/i.test(docContent);
  const hasSWAGGER = /\*\*SWAGGER(\*\*)?:?/i.test(docContent);
  const hasJSON = /\*\*JSON(\*\*)?:?/i.test(docContent);
  
  console.log(`\n¿Tiene WSDL?: ${hasWSDL ? '✅ SÍ' : '❌ NO'}`);
  console.log(`¿Tiene SWAGGER?: ${hasSWAGGER ? '✅ SÍ' : '❌ NO'}`);
  console.log(`¿Tiene JSON?: ${hasJSON ? '✅ SÍ' : '❌ NO'}`);
  
  if (!hasWSDL && !hasSWAGGER && !hasJSON) {
    console.error('\n❌ ERROR: Debe tener al menos WSDL, SWAGGER o JSON');
    return false;
  }
  
  let allPassed = true;
  let errors = [];
  let notices = [];
  
  // Validate WSDL
  if (hasWSDL) {
    console.log('\n--- Validando WSDL ---');
    const wsdlStart = docContent.search(/\*\*WSDL(?::\*\*|\*\*:|:)/i);
    if (wsdlStart !== -1) {
      const headerMatch = docContent.substring(wsdlStart).match(/^\*\*WSDL(?::\*\*|\*\*:|:)/i);
      const headerLength = headerMatch ? headerMatch[0].length : 8;
      
      const nextFieldMatch = docContent.substring(wsdlStart + headerLength).search(/\*\*[A-Z]/);
      const wsdlEnd = nextFieldMatch > 0 ? wsdlStart + headerLength + nextFieldMatch : docContent.length;
      const wsdlFragment = docContent.substring(wsdlStart, wsdlEnd);
      
      const cleanFragment = wsdlFragment
        .replace(/\*\*WSDL(?::\*\*|\*\*:|:)/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      console.log(`Contenido: "${cleanFragment.substring(0, 100)}${cleanFragment.length > 100 ? '...' : ''}"`);
      
      const gitPatternBackslash = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
      const gitPatternForwardslash = new RegExp(`git/${repo_name}/Broker/WSDL/wsdl/`, 'i');
      
      if (gitPatternBackslash.test(wsdlFragment) || gitPatternForwardslash.test(wsdlFragment) || /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        notices.push('Ruta WSDL válida');
        console.log('✅ WSDL válido');
      } else {
        errors.push(`WSDL debe comenzar con 'git/${repo_name}/Broker/WSDL/wsdl/' o contener N/A`);
        console.log('❌ WSDL inválido');
        allPassed = false;
      }
    }
  }
  
  // Validate SWAGGER
  if (hasSWAGGER) {
    console.log('\n--- Validando SWAGGER ---');
    const swaggerStart = docContent.search(/\*\*SWAGGER\*?\*?:?/i);
    if (swaggerStart !== -1) {
      const headerMatch = docContent.substring(swaggerStart).match(/^\*\*SWAGGER\*?\*?:?/i);
      const headerLength = headerMatch ? headerMatch[0].length : 12;
      
      console.log(`Header detectado: "${headerMatch[0]}"`);
      
      const nextFieldMatch = docContent.substring(swaggerStart + headerLength).search(/\*\*[A-Z]/);
      const swaggerEnd = nextFieldMatch > 0 ? swaggerStart + headerLength + nextFieldMatch : docContent.length;
      const swaggerFragment = docContent.substring(swaggerStart, swaggerEnd);
      
      const cleanFragment = swaggerFragment
        .replace(/\*\*SWAGGER\*?\*?:?/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      console.log(`Contenido: "${cleanFragment}"`);
      
      const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
      const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
      const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
      const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
      
      if (gitPatternBackslashSwagger.test(swaggerFragment) || 
          gitPatternForwardslashSwagger.test(swaggerFragment) ||
          gitPatternBackslashJSON.test(swaggerFragment) ||
          gitPatternForwardslashJSON.test(swaggerFragment) ||
          /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        notices.push('Ruta SWAGGER válida');
        console.log('✅ SWAGGER válido');
      } else {
        errors.push(`SWAGGER debe comenzar con 'git/${repo_name}/Broker/SWAGGER/' o 'git/${repo_name}/Broker/JSON/' o contener N/A`);
        console.log('❌ SWAGGER inválido - falta prefijo git/');
        allPassed = false;
      }
    }
  }
  
  // Validate JSON
  if (hasJSON) {
    console.log('\n--- Validando JSON ---');
    const jsonStart = docContent.search(/\*\*JSON\*?\*?:?/i);
    if (jsonStart !== -1) {
      const headerMatch = docContent.substring(jsonStart).match(/^\*\*JSON\*?\*?:?/i);
      const headerLength = headerMatch ? headerMatch[0].length : 8;
      
      console.log(`Header detectado: "${headerMatch[0]}"`);
      
      const nextFieldMatch = docContent.substring(jsonStart + headerLength).search(/\*\*[A-Z]/);
      const jsonEnd = nextFieldMatch > 0 ? jsonStart + headerLength + nextFieldMatch : docContent.length;
      const jsonFragment = docContent.substring(jsonStart, jsonEnd);
      
      const cleanFragment = jsonFragment
        .replace(/\*\*JSON\*?\*?:?/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      console.log(`Contenido: "${cleanFragment}"`);
      
      const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
      const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
      const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
      const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
      
      if (gitPatternBackslashJSON.test(jsonFragment) || 
          gitPatternForwardslashJSON.test(jsonFragment) ||
          gitPatternBackslashSwagger.test(jsonFragment) ||
          gitPatternForwardslashSwagger.test(jsonFragment) ||
          /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        notices.push('Ruta JSON válida');
        console.log('✅ JSON válido');
      } else {
        errors.push(`JSON debe comenzar con 'git/${repo_name}/Broker/JSON/' o 'git/${repo_name}/Broker/SWAGGER/' o contener N/A`);
        console.log('❌ JSON inválido - falta prefijo git/');
        allPassed = false;
      }
    }
  }
  
  console.log('\n--- RESUMEN ---');
  if (allPassed) {
    console.log('✅ TODAS LAS VALIDACIONES PASARON');
  } else {
    console.log('❌ HAY ERRORES:');
    errors.forEach(err => console.log(`  - ${err}`));
  }
  
  return allPassed;
}

console.log('='.repeat(70));
console.log('TEST DE READMES (13) y (14)');
console.log('='.repeat(70));

const result13 = testReadme('README (13).md');
const result14 = testReadme('README (14).md');

console.log('\n' + '='.repeat(70));
console.log('RESULTADO FINAL');
console.log('='.repeat(70));
console.log(`README (13): ${result13 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`README (14): ${result14 ? '✅ PASÓ' : '❌ FALLÓ'}`);

if (result13 && result14) {
  console.log('\n✅ AMBOS READMES SON VÁLIDOS CON LOS CAMBIOS');
  process.exit(0);
} else {
  console.log('\n❌ AL MENOS UN README TIENE PROBLEMAS');
  process.exit(1);
}

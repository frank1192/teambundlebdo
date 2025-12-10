// Test con el archivo README real del usuario
const fs = require('fs');
const path = require('path');

const readmeContent = fs.readFileSync(path.join(__dirname, 'README_USUARIO.md'), 'utf8');

console.log('Longitud total del README:', readmeContent.length);
console.log('\n' + '='.repeat(70));
console.log('TEST: Extracción sección Procedimiento de despliegue');
console.log('='.repeat(70));

const deploymentMatch = readmeContent.match(/^## Procedimiento de despliegue\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (deploymentMatch) {
  console.log('✅ Sección capturada');
  console.log(`Longitud: ${deploymentMatch[1].length} caracteres`);
  console.log('\n--- Contenido capturado ---');
  console.log(deploymentMatch[1]);
  console.log('--- Fin ---\n');
  
  // Buscar grupos
  const groupsMatch = deploymentMatch[1].match(/desplegar en los grupos de ejecución:\s*\n?\s*([^\n#]+)/i);
  if (groupsMatch) {
    console.log('✅ Grupos encontrados!');
    console.log(`Texto: "${groupsMatch[1]}"`);
    const groups = groupsMatch[1].trim().split(/[\s,]+/).filter(g => g.trim());
    console.log(`Total: ${groups.length} grupos`);
    console.log('Grupos:', groups);
  } else {
    console.log('❌ NO se encontraron grupos con el regex');
  }
} else {
  console.log('❌ NO se capturó la sección');
}

console.log('\n' + '='.repeat(70));
console.log('TEST: Tabla XSL');
console.log('='.repeat(70));

const depMatch = readmeContent.match(/^##\s*DEPENDENCIAS\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (depMatch) {
  console.log('✅ Sección DEPENDENCIAS encontrada');
  const xslMatch = depMatch[1].match(/\|\s*XSL\s*\|[\s\S]*?(?=\n\s*\n\s*\||\Z)/im);
  if (xslMatch) {
    console.log('✅ Tabla XSL capturada');
    const lines = xslMatch[0].split('\n');
    console.log(`Total líneas: ${lines.length}`);
    lines.forEach((line, i) => {
      console.log(`  ${i}: ${line}`);
    });
  } else {
    console.log('❌ NO se capturó tabla XSL');
  }
} else {
  console.log('❌ NO se encontró sección DEPENDENCIAS');
}

console.log('\n' + '='.repeat(70));
console.log('TEST: WSDL');
console.log('='.repeat(70));

const docMatch = readmeContent.match(/^##\s*DOCUMENTACION\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (docMatch) {
  console.log('✅ Sección DOCUMENTACION encontrada');
  const docContent = docMatch[1].replace(/\r?\n/g, ' ');
  
  const hasWSDL = /\*\*WSDL\*\*/i.test(docContent);
  console.log(`¿Tiene **WSDL:**? ${hasWSDL}`);
  
  if (hasWSDL) {
    const wsdlFragment = (docContent.match(/\*\*WSDL(?:\*\*)?:[\s\S]*?(?=\*\*[A-Z]|$)/i) || [''])[0];
    console.log(`\nFragmento capturado (primeros 200 chars):\n"${wsdlFragment.substring(0, 200)}"`);
    
    const repo_name = (readmeContent.match(/^#\s*ESB_(.+)$/m) || ['',''])[1].replace(/\.$/, '').trim();
    console.log(`\nRepo: ${repo_name}`);
    const gitPattern = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
    console.log(`Patrón: git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`);
    console.log(`¿Coincide? ${gitPattern.test(wsdlFragment)}`);
  }
} else {
  console.log('❌ NO se encontró sección DOCUMENTACION');
}

const fs = require('fs');

const content = fs.readFileSync('bancos readme a evaluar/README (13).md', 'utf8');

console.log('Buscando SWAGGER en README (13)...\n');

// Buscar líneas con SWAGGER
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (/SWAGGER/i.test(lines[i])) {
    console.log(`Línea ${i+1}: "${lines[i]}"`);
  }
}

console.log('\n--- Probando diferentes regex ---\n');

// Test 1
const test1 = content.match(/^## DOCUMENTACION[\s\S]*?(?=^## |\n*$)/m);
console.log('Test 1 (original): ', test1 ? `${test1[0].length} chars` : 'NO MATCH');

// Test 2
const test2 = content.match(/^## DOCUMENTACION[\s\S]*?(?=^## [A-Z]|$)/m);
console.log('Test 2 (con [A-Z]): ', test2 ? `${test2[0].length} chars` : 'NO MATCH');

// Test 3 - capturar todo hasta SQL
const test3 = content.match(/^## DOCUMENTACION[\s\S]*?(?=^## SQL|$)/m);
console.log('Test 3 (hasta SQL): ', test3 ? `${test3[0].length} chars` : 'NO MATCH');

// Test 4 - sin lookahead, capturar hasta encontrar ^## en nueva línea
const test4 = content.match(/^## DOCUMENTACION\n[\s\S]*?(?=\n## )/m);
console.log('Test 4 (\\n## ): ', test4 ? `${test4[0].length} chars` : 'NO MATCH');
if (test4) {
  console.log('\nContenido capturado (Test 4):');
  console.log('---');
  console.log(test4[0].substring(0, 300) + '...');
  console.log('---');
  console.log('\n¿Tiene SWAGGER?:', /\*\*SWAGGER/.test(test4[0]));
  console.log('¿Tiene **SWAGGER**?:', /\*\*SWAGGER(\*\*)?:?/i.test(test4[0]));
}

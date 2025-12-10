// Inspección byte por byte del README real
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'README_USUARIO.md'), 'utf8');

// Encontrar la sección Procedimiento de despliegue
const idx = content.indexOf('## Procedimiento de despliegue');
const seccion = content.substring(idx, Math.min(idx + 300, content.length));

console.log('Primeros 300 caracteres desde "## Procedimiento de despliegue":');
console.log('='.repeat(70));

for (let i = 0; i < seccion.length; i++) {
  const char = seccion[i];
  const code = char.charCodeAt(0);
  
  if (i % 20 === 0 && i > 0) console.log(''); // Nueva línea cada 20 chars
  
  if (char === '\n') process.stdout.write('[LF]');
  else if (char === '\r') process.stdout.write('[CR]');
  else if (char === ' ') process.stdout.write('␣');
  else if (code === 160) process.stdout.write('[NBSP]');
  else if (code < 32 || code > 126) process.stdout.write(`[${code}]`);
  else process.stdout.write(char);
}

console.log('\n\n' + '='.repeat(70));
console.log('Buscando el caracter problema en "UtilizacionCreditoRotativoPlus":');
console.log('='.repeat(70));

const palabra = 'UtilizacionCreditoRotativoPlus';
const idx2 = seccion.indexOf('Aplicar');
const fragmento = seccion.substring(idx2, idx2 + 80);

console.log('\nFragmento:', fragmento);
console.log('\nCódigos ASCII:');
for (let i = 0; i < Math.min(fragmento.length, 80); i++) {
  const char = fragmento[i];
  const code = char.charCodeAt(0);
  console.log(`${i.toString().padStart(2)}: '${char}' = ${code} ${code > 127 ? '← UNICODE' : ''}`);
}

// Test específico para DataPower Externo
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'README_USUARIO.md'), 'utf8');

console.log('='.repeat(80));
console.log('TEST: Extracción de subsección DataPower Externo');
console.log('='.repeat(80));

// Función getSubsection CORREGIDA (ahora salta el encabezado como awk 'next')
function getSubsection(subHeaderRegex) {
  const re = new RegExp(subHeaderRegex, 'mi');
  const start = content.search(re);
  if (start === -1) return null;
  const tail = content.slice(start);
  // Find first newline to skip the header line itself (like awk's 'next')
  const firstNewline = tail.indexOf('\n');
  if (firstNewline === -1) return '';
  const contentAfterHeader = tail.slice(firstNewline + 1);
  // Find next subsection or section
  const m = contentAfterHeader.match(/^(###\s+|##\s+)/m);
  if (m && m.index !== undefined) {
    return contentAfterHeader.slice(0, m.index).trim();
  }
  return contentAfterHeader.trim();
}

// Intentar extraer como lo hace index.js
const regex = '^###\\s*DataPower Externo';
console.log(`\nRegex usado: ${regex}`);

const dpExterno = getSubsection(regex);
console.log(`\n¿Se encontró? ${!!dpExterno}`);

if (dpExterno) {
  console.log('\nContenido extraído:');
  console.log('---');
  console.log(dpExterno);
  console.log('---');
  console.log(`\nLongitud: ${dpExterno.length} caracteres`);
  
  // Probar isOnlyNA
  const clean = dpExterno
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log(`\nTexto limpio: "${clean}"`);
  const isOnlyNA = /^(N\s*\/?\s*A|No\s+Aplica)$/i.test(clean);
  console.log(`¿Es solo NA? ${isOnlyNA}`);
  
  if (!isOnlyNA) {
    // Buscar filas de tabla
    const lines = dpExterno.split(/\r?\n/);
    let inTable = false;
    let rows = [];
    for (const line of lines) {
      if (/^\|---/.test(line)) { inTable = true; continue; }
      if (inTable && /^\|/.test(line)) rows.push(line);
    }
    console.log(`\nFilas de tabla: ${rows.length}`);
    if (rows.length === 0) {
      console.log('❌ ERROR: validateDatapowerTable() daría error aquí');
    }
  } else {
    console.log('\n✅ CORRECTO: isOnlyNA detectó "No aplica", NO debe validar tabla');
  }
} else {
  console.log('\n❌ ERROR: No se encontró la subsección');
  console.log('\nBuscando en el README...');
  
  // Buscar manualmente
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/### DataPower/i.test(lines[i])) {
      console.log(`Línea ${i}: ${lines[i]}`);
    }
  }
}

// Probar con regex que incluya los dos puntos
console.log('\n' + '='.repeat(80));
console.log('PROBANDO con regex que incluya :');
console.log('='.repeat(80));

const regex2 = '^###\\s*DataPower Externo\\s*:?';
console.log(`\nRegex: ${regex2}`);

const dpExterno2 = getSubsection(regex2);
console.log(`¿Se encontró? ${!!dpExterno2}`);

if (dpExterno2) {
  console.log('\nPrimeros 200 caracteres:');
  console.log(dpExterno2.substring(0, 200));
  
  const clean2 = dpExterno2
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const isOnlyNA2 = /^(N\s*\/?\s*A|No\s+Aplica)$/i.test(clean2);
  console.log(`\n¿Es solo NA? ${isOnlyNA2}`);
}

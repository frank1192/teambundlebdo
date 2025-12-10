// Inspección byte por byte

const texto = `## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO`;

console.log('Analizando caracteres del texto:');
console.log('='.repeat(60));

const lines = texto.split('\n');
for (let i = 0; i < Math.min(lines.length, 8); i++) {
  const line = lines[i];
  const chars = [];
  for (let j = 0; j < Math.min(line.length, 80); j++) {
    const code = line.charCodeAt(j);
    if (code === 32) chars.push('␣');
    else if (code === 160) chars.push('[NBSP]');
    else if (code < 32) chars.push(`[${code}]`);
    else chars.push(line[j]);
  }
  console.log(`Línea ${i}: "${chars.join('')}"`);
  console.log(`       Códigos primeros 20 chars:`, line.substring(0, 20).split('').map(c => c.charCodeAt(0)));
}

console.log('\n' + '='.repeat(60));
console.log('Buscando dónde se trunca...\n');

// Extraer después del encabezado
const afterHeader = texto.substring(texto.indexOf('## Procedimiento de despliegue') + 30);
console.log('Después del encabezado (primeros 200 chars):');
console.log(afterHeader.substring(0, 200));
console.log('\nCódigos ASCII de primeros 30 caracteres:');
console.log(afterHeader.substring(0, 30).split('').map((c, i) => `${i}:${c.charCodeAt(0)}(${c === '\n' ? '\\n' : c === ' ' ? '␣' : c})`).join(' '));

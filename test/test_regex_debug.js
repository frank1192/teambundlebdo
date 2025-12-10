// Test para ver qué está pasando con la captura

const texto = `## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO`;

console.log('Probando diferentes regex:\n');

// 1. Regex actual del código
const r1 = /^## Procedimiento de despliegue\s*$([\s\S]*?)(?=^## |\Z)/im;
const m1 = texto.match(r1);
console.log('1. /^## Procedimiento de despliegue\\s*$([\\s\\S]*?)(?=^## |\\Z)/im');
console.log('   Captura:', m1 ? `"${m1[1].substring(0, 50)}..."` : 'NO');
console.log('   Longitud:', m1 ? m1[1].length : 0);

// 2. Sin el $ después de despliegue
const r2 = /^## Procedimiento de despliegue$([\s\S]*?)(?=^## |\Z)/im;
const m2 = texto.match(r2);
console.log('\n2. /^## Procedimiento de despliegue$([\\s\\S]*?)(?=^## |\\Z)/im');
console.log('   Captura:', m2 ? `"${m2[1].substring(0, 50)}..."` : 'NO');
console.log('   Longitud:', m2 ? m2[1].length : 0);

// 3. Usando \r?\n explícito
const r3 = /^## Procedimiento de despliegue\s*\r?\n([\s\S]*?)(?=^## |\Z)/im;
const m3 = texto.match(r3);
console.log('\n3. /^## Procedimiento de despliegue\\s*\\r?\\n([\\s\\S]*?)(?=^## |\\Z)/im');
console.log('   Captura:', m3 ? `"${m3[1].substring(0, 50)}..."` : 'NO');
console.log('   Longitud:', m3 ? m3[1].length : 0);

// 4. Modo greedy
const r4 = /^## Procedimiento de despliegue\s*\r?\n([\s\S]*?)(?=\r?\n## |\Z)/im;
const m4 = texto.match(r4);
console.log('\n4. /^## Procedimiento de despliegue\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n## |\\Z)/im');
console.log('   Captura:', m4 ? `"${m4[1].substring(0, 100)}..."` : 'NO');
console.log('   Longitud:', m4 ? m4[1].length : 0);

if (m4) {
  console.log('\n--- Contenido completo capturado (regex 4) ---');
  console.log(m4[1]);
  console.log('--- Fin ---');
}

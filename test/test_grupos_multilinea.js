/**
 * Test: Extracción de grupos multi-línea con viñetas
 * Reproduce el caso donde los grupos están en líneas separadas con viñetas
 */

console.log('═══════════════════════════════════════════════════════');
console.log('TEST: Extracción de grupos en múltiples líneas');
console.log('═══════════════════════════════════════════════════════\n');

// CASO 1: Grupos con viñetas en líneas separadas (caso DevolucionCheque)
console.log('📝 CASO 1: Grupos con viñetas en líneas separadas');
const text1 = `## Procedimiento de despliegue
1. Aplicar DevolucionCheque.properties a DevolucionCheque.bar y desplegar en los grupos de ejecución:
*  BOGESERVICIOSWS01_SRV01
*  BOGESERVICIOSWS01_SRV02`;

// Simular extracción
const lines1 = text1.split('\n');
let groupsText1 = '';
for (let i = 0; i < lines1.length; i++) {
  const line = lines1[i];
  if (/desplegar en los grupos de ejecución:/i.test(line)) {
    const sameLineMatch = line.match(/desplegar en los grupos de ejecución:\s*(.+)/i);
    if (sameLineMatch && sameLineMatch[1].trim()) {
      groupsText1 = sameLineMatch[1].trim();
    } else {
      // Get next lines until we hit another section
      for (let j = i + 1; j < lines1.length && j < i + 10; j++) {
        const nextLine = lines1[j].trim();
        if (!nextLine || /^##/.test(nextLine)) break;
        groupsText1 += (groupsText1 ? ' ' : '') + nextLine;
      }
    }
    break;
  }
}

console.log('Texto capturado:', JSON.stringify(groupsText1));

const groups1 = groupsText1
  .split(/[\s,]+/)
  .filter(g => g.trim())
  .filter(g => !/^[*\-•]$/.test(g))
  .map(g => g.toLowerCase());

console.log('Grupos extraídos:', groups1);
console.log('Cantidad:', groups1.length);
console.log('✅ Correcto?', groups1.length === 2 && groups1.includes('bogeserviciosws01_srv01') && groups1.includes('bogeserviciosws01_srv02'));

// CASO 2: Grupos en misma línea separados por espacios
console.log('\n📝 CASO 2: Grupos en misma línea separados por espacios');
const text2 = `## Procedimiento de despliegue
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02`;

const lines2 = text2.split('\n');
let groupsText2 = '';
for (let i = 0; i < lines2.length; i++) {
  const line = lines2[i];
  if (/desplegar en los grupos de ejecución:/i.test(line)) {
    const sameLineMatch = line.match(/desplegar en los grupos de ejecución:\s*(.+)/i);
    if (sameLineMatch && sameLineMatch[1].trim()) {
      groupsText2 = sameLineMatch[1].trim();
    } else {
      for (let j = i + 1; j < lines2.length && j < i + 10; j++) {
        const nextLine = lines2[j].trim();
        if (!nextLine || /^##/.test(nextLine)) break;
        groupsText2 += (groupsText2 ? ' ' : '') + nextLine;
      }
    }
    break;
  }
}

console.log('Texto capturado:', JSON.stringify(groupsText2));

const groups2 = groupsText2
  .split(/[\s,]+/)
  .filter(g => g.trim())
  .filter(g => !/^[*\-•]$/.test(g))
  .map(g => g.toLowerCase());

console.log('Grupos extraídos:', groups2);
console.log('Cantidad:', groups2.length);
console.log('✅ Correcto?', groups2.length === 4);

// CASO 3: Grupos en misma línea que "desplegar..."
console.log('\n📝 CASO 3: Grupos en misma línea después de ":"');
const text3 = `## Procedimiento de despliegue
1. desplegar en los grupos de ejecución: BOGESERVICIOSWS03_SRV01, BOGESERVICIOSWS03_SRV02`;

const lines3 = text3.split('\n');
let groupsText3 = '';
for (let i = 0; i < lines3.length; i++) {
  const line = lines3[i];
  if (/desplegar en los grupos de ejecución:/i.test(line)) {
    const sameLineMatch = line.match(/desplegar en los grupos de ejecución:\s*(.+)/i);
    if (sameLineMatch && sameLineMatch[1].trim()) {
      groupsText3 = sameLineMatch[1].trim();
    } else {
      for (let j = i + 1; j < lines3.length && j < i + 10; j++) {
        const nextLine = lines3[j].trim();
        if (!nextLine || /^##/.test(nextLine)) break;
        groupsText3 += (groupsText3 ? ' ' : '') + nextLine;
      }
    }
    break;
  }
}

console.log('Texto capturado:', JSON.stringify(groupsText3));

const groups3 = groupsText3
  .split(/[\s,]+/)
  .filter(g => g.trim())
  .filter(g => !/^[*\-•]$/.test(g))
  .map(g => g.toLowerCase());

console.log('Grupos extraídos:', groups3);
console.log('Cantidad:', groups3.length);
console.log('✅ Correcto?', groups3.length === 2);

// RESUMEN
console.log('\n═══════════════════════════════════════════════════════');
console.log('RESUMEN');
console.log('═══════════════════════════════════════════════════════');

const test1Pass = groups1.length === 2 && groups1.includes('bogeserviciosws01_srv01') && groups1.includes('bogeserviciosws01_srv02');
const test2Pass = groups2.length === 4;
const test3Pass = groups3.length === 2;

console.log(`${test1Pass ? '✅' : '❌'} Caso 1: Viñetas multi-línea (${groups1.length} grupos)`);
console.log(`${test2Pass ? '✅' : '❌'} Caso 2: Espacios misma línea (${groups2.length} grupos)`);
console.log(`${test3Pass ? '✅' : '❌'} Caso 3: Comas en línea (${groups3.length} grupos)`);

if (test1Pass && test2Pass && test3Pass) {
  console.log('\n🎉 TODOS LOS TESTS PASARON');
  console.log('✅ Extracción de grupos funciona para todos los formatos');
} else {
  console.log('\n❌ ALGUNOS TESTS FALLARON');
}

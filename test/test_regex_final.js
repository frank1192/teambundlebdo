// Test final para encontrar el regex correcto

const texto = `## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO`;

console.log('Texto completo a parsear:');
console.log('='.repeat(60));
console.log(texto);
console.log('='.repeat(60));
console.log('\nProbando regex sin ^ en lookahead:\n');

// Problema: ^## en lookahead hace match con el MISMO ##  
// Solución: (?=\n##) para que busque ## en NUEVA línea
const regex = /^## Procedimiento de despliegue\s*\n([\s\S]*?)(?=\n## |\Z)/im;
const match = texto.match(regex);

console.log('Regex: /^## Procedimiento de despliegue\\s*\\n([\\s\\S]*?)(?=\\n## |\\Z)/im');
console.log('Match encontrado:', !!match);

if (match) {
  console.log('\n--- Contenido capturado ---');
  console.log(match[1]);
  console.log('--- Fin ---');
  console.log('\nLongitud:', match[1].length, 'caracteres');
  
  // Buscar la frase
  const groupsMatch = match[1].match(/desplegar en los grupos de ejecución:\s*\n?\s*([^\n]+)/i);
  console.log(`\n¿Encontró "desplegar en los grupos de ejecución:"? ${!!groupsMatch}`);
  if (groupsMatch) {
    console.log(`Grupos capturados: "${groupsMatch[1].trim()}"`);
    const groups = groupsMatch[1].trim().split(/[\s,]+/).filter(g => g.trim());
    console.log(`Total grupos: ${groups.length}`);
    console.log('Grupos:', groups);
  }
}

// Test para verificar por qué la sección se trunca

const texto = `## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO`;

console.log('Texto original:');
console.log('---');
console.log(texto);
console.log('---\n');

// Regex actual (MAL)
const regex1 = /^## Procedimiento de despliegue\s*$([\s\S]*?)(?=^## |\Z)/im;
const match1 = texto.match(regex1);
console.log('Regex ACTUAL: /^## Procedimiento de despliegue\\s*$([\s\S]*?)(?=^## |\\Z)/im');
console.log('Resultado:', match1 ? `"${match1[1]}"` : 'NO MATCH');
console.log('Longitud:', match1 ? match1[1].length : 0);

// Regex correcto (sin $)
const regex2 = /^## Procedimiento de despliegue\s*\n([\s\S]*?)(?=^## |\Z)/im;
const match2 = texto.match(regex2);
console.log('\nRegex CORRECTO: /^## Procedimiento de despliegue\\s*\\n([\\s\\S]*?)(?=^## |\\Z)/im');
console.log('Resultado:', match2 ? `"${match2[1]}"` : 'NO MATCH');
console.log('Longitud:', match2 ? match2[1].length : 0);

if (match2) {
  console.log('\n--- Contenido capturado ---');
  console.log(match2[1]);
  console.log('--- Fin ---\n');
  
  // Buscar la frase
  const groupsMatch = match2[1].match(/desplegar en los grupos de ejecución:\s*([^\n#]+)/i);
  console.log(`¿Encontró "desplegar en los grupos de ejecución:"? ${!!groupsMatch}`);
  if (groupsMatch) {
    console.log(`Grupos: "${groupsMatch[1].trim()}"`);
  }
}

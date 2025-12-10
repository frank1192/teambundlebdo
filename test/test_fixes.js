// Test rápido de los fixes aplicados

const readmeContent = `# ESB_ACE12_UtilizacionCreditoRotativoPlus.

## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO
### DataPower Externo :
 
No aplica
<br><br>

## DEPENDENCIAS
|Servicios|
|---|
|CacheHomologacionTipos_StaticLib|
||

|XSL|
|---|
|REQ_ACOperacion_017.xsl|
|REQ_ACOperacion_277.xsl|
|REQ_FCUBSRTService_CreateTransaction_656.xsl|
|RES_FCUBSRTService_CreateTransaction|
|RES_ACOperacion_017|
|RES_ACOperacion_277|
||

## DOCUMENTACION
 
**WSDL:** <br>
git\\ESB_ACE12_UtilizacionCreditoRotativoPlus\\Broker\\WSDL\\wsdl\\UtililzacionCreditoRotativoPlus.wsdl  
 
## SQL`;

console.log('='.repeat(70));
console.log('TEST FIX 1: Extracción sección Procedimiento de despliegue');
console.log('='.repeat(70));

const deploymentMatch = readmeContent.match(/^## Procedimiento de despliegue\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (deploymentMatch) {
  console.log('✅ Sección capturada correctamente');
  console.log(`Longitud: ${deploymentMatch[1].length} caracteres`);
  console.log('Contenido:\n---');
  console.log(deploymentMatch[1]);
  console.log('---\n');
} else {
  console.log('❌ NO se capturó la sección');
}

console.log('='.repeat(70));
console.log('TEST FIX 2: Extracción grupos de ejecución');
console.log('='.repeat(70));

if (deploymentMatch) {
  const groupsMatch = deploymentMatch[1].match(/desplegar en los grupos de ejecución:\s*\n?\s*([^\n#]+)/i);
  if (groupsMatch) {
    console.log('✅ Grupos encontrados');
    console.log(`Texto capturado: "${groupsMatch[1]}"`);
    const groups = groupsMatch[1].trim().split(/[\s,]+/).filter(g => g.trim());
    console.log(`Total grupos: ${groups.length}`);
    console.log('Grupos:', groups);
  } else {
    console.log('❌ NO se encontraron grupos');
  }
}

console.log('\n' + '='.repeat(70));
console.log('TEST FIX 3: Extracción tabla XSL');
console.log('='.repeat(70));

const depMatch = readmeContent.match(/^##\s*DEPENDENCIAS\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (depMatch) {
  const xslMatch = depMatch[1].match(/\|\s*XSL\s*\|[\s\S]*?(?=\n\s*\n\s*\||\Z)/im);
  if (xslMatch) {
    console.log('✅ Tabla XSL capturada');
    console.log('Contenido:\n---');
    console.log(xslMatch[0]);
    console.log('---');
    
    // Contar filas
    const lines = xslMatch[0].split(/\r?\n/);
    let dataRows = 0;
    let foundSeparator = false;
    for (const line of lines) {
      if (/^\|---/.test(line)) { foundSeparator = true; continue; }
      if (foundSeparator && /^\|/.test(line)) {
        const content = line.replace(/^\||\|$/g, '').trim();
        if (content) dataRows++;
      }
    }
    console.log(`\n✅ Filas de datos extraídas: ${dataRows}`);
  } else {
    console.log('❌ NO se capturó tabla XSL');
  }
}

console.log('\n' + '='.repeat(70));
console.log('TEST FIX 4: Detección WSDL');
console.log('='.repeat(70));

const docMatch = readmeContent.match(/^##\s*DOCUMENTACION\s*\n([\s\S]*?)(?=\n## |\Z)/im);
if (docMatch) {
  const docContent = docMatch[1].replace(/\r?\n/g, ' ');
  const hasWSDL = /\*\*WSDL\*\*/i.test(docContent);
  console.log(`¿Tiene WSDL? ${hasWSDL}`);
  
  if (hasWSDL) {
    const wsdlFragment = (docContent.match(/\*\*WSDL(?:\*\*)?:[\s\S]*?(?=\*\*[A-Z]|$)/i) || [''])[0];
    console.log(`\nFragmento capturado:\n"${wsdlFragment}"`);
    
    const repo_name = (readmeContent.match(/^#\s*ESB_(.+)$/m) || ['',''])[1].replace(/\.$/, '').trim();
    const gitPattern = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
    const matches = gitPattern.test(wsdlFragment);
    console.log(`\nPatrón esperado: git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`);
    console.log(`✅ ¿Coincide? ${matches}`);
  }
}

console.log('\n' + '='.repeat(70));
console.log('RESUMEN');
console.log('='.repeat(70));

// Test con el README REAL del usuario para reproducir los 4 errores
const fs = require('fs');
const path = require('path');

// README exacto del usuario
const readmeContent = `# ESB_ACE12_UtilizacionCreditoRotativoPlus.
 
 
## INFORMACIÓN DEL SERVICIO
 
El presente documento expone de manera detallada la funcionalidad y componentes del flujo, UtilizacionCreditoRotativoPlus, y su operación utilizarCredito. Este servicio recibe una petición desde el sistema consumidor (IVR ALO, PB, BM ó CANALES) e interactúa con los sistemas legados AC y FlexCube finalmente devuelve una respuesta al consumidor.
 
 
### Último despliege
 
|CQ |JIRA | Fecha|
|---|---|---|
| NA |NA |6/10/2023 (WS) |
 
## Procedimiento de despliegue
 
Aplicar UtilizacionCreditoRotativoPlus.properties a UtilizacionCreditoRotativoPlus.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02 BOGESERVICIOSTCP01_SRV01 BOGESERVICIOSTCP01_SRV02
 
 
## ACCESO AL SERVICIO
### DataPower Externo :
 
No aplica
<br><br>
 
### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|WSServicioPilotoATHInterno|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4806/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|CALIDAD|WSP|WSServicioPilotoATHInterno|BODPQAS|https://boc201.testint.app.bancodeoccidente.net:4806/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|PRODUCCION|WSP|WSServicioPilotoATHInterno|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:4806/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
 
<br><br>
 
 
### Endpoint BUS
 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS05_SRV01|https://adbog162e.bancodeoccidente.net:4907/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|DESARROLLO|BOGESERVICIOSWS05_SRV02|https://adbog162e.bancodeoccidente.net:4908/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|CALIDAD|N1-BOGESERVICIOSWS05_SRV01|https://atbog163d.bancodeoccidente.net:4907/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|CALIDAD|N1-BOGESERVICIOSWS05_SRV02|https://atbog163d.bancodeoccidente.net:4908/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|CALIDAD|N2-BOGESERVICIOSWS05_SRV01|https://atbog164e.bancodeoccidente.net:4907/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|CALIDAD|N2-BOGESERVICIOSWS05_SRV02|https://atbog164e.bancodeoccidente.net:4908/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
|PRODUCCION|BOGESERVICIOSWS05_SRV01<br>BOGESERVICIOSWS05_SRV02|https://boc060ap.prd.app.bancodeoccidente.net:4907/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort<br> https://boc060ap.prd.app.bancodeoccidente.net:4908/UtililzacionCreditoRotativoPlusService/UtililzacionCreditoRotativoPlusPort|
 
<br><br>		
## CANALES - APLICACIONES
 

|||||
|---|---|---|---|
|**Consumidor**|CANALES|PB|IVR|
|||||
|---|---|---|---|
|**Backends**|NA|||
## DEPENDENCIAS
|Servicios|
|---|
|CacheHomologacionTipos_StaticLib|
|ConsultaCupoCarteraPaqueteCaller|
|GeneradorSecuenciaESBCaller|
|IntegracionACCaller|
|IntegracionFCCaller|
|IntegracionWSCaller|
|MessageSet_017_StaticLib|
|Util|
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
 
**Documento de diseño detallado:** <br>
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_UtilizacionCreditoRotativoPlus
 
**Mapeo:**   <br>
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_UtilizacionCreditoRotativoPlus
 
**Evidencias (Unitarias/Auditoria/Monitoreo):**      <br>
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_UtilizacionCreditoRotativoPlus
 
**WSDL:** <br>
git\\ESB_ACE12_UtilizacionCreditoRotativoPlus\\Broker\\WSDL\\wsdl\\UtililzacionCreditoRotativoPlus.wsdl  
 
 
		
## SQL
Filtrar por cola del servicio
\`\`\`
select *
from admesb.ESB_LOG_AUDITORIA
where 1 = 1
--and str_id_oper_apl_origen like '%ListenerB24_PeticionMQ' and str_msg_error like '%MQ_TrfrnciaCuentaDestino_IN%'
\`\`\`
Filtrar por P3
\`\`\`
select *
from admesb.ESB_LOG_AUDITORIA
where 1 = 1
--or str_id_oper_apl_origen like '%ListenerB24_PeticionTCP' and str_msg_error like '%cnx:AT15%402020%'
--or str_id_oper_apl_origen like '%ListenerB24_PeticionTCP' and str_msg_error like '%cnx:AT15%402010%'
--or str_id_oper_apl_origen like '%ListenerB24_PeticionTCP' and str_msg_error like '%cnx:AT15%401020%'
--or str_id_oper_apl_origen like '%ListenerB24_PeticionTCP' and str_msg_error like '%cnx:AT15%401010%'
\`\`\`
Filtrar por Codigo de Operacion
\`\`\`
* select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '999042'  
* select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '999042'  
\`\`\``;

console.log('==========================================');
console.log('TEST 1: DataPower Externo con "No aplica"');
console.log('==========================================\n');

// Extraer sección DataPower Externo
const dpExternoMatch = readmeContent.match(/^###\s*DataPower Externo\s*:?\s*$([\s\S]*?)(?=^###\s|\Z)/im);
if (dpExternoMatch) {
  const dpExterno = dpExternoMatch[1];
  console.log('✓ Sección encontrada:');
  console.log('---');
  console.log(dpExterno);
  console.log('---\n');
  
  // Probar isOnlyNA
  const clean = dpExterno
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log(`Texto limpio: "${clean}"`);
  console.log(`¿Es solo NA? ${/^(N\s*\/?\s*A|No\s+Aplica)$/i.test(clean)}`);
  
  // Probar extractTableRows
  const lines = dpExterno.split(/\r?\n/);
  const rows = [];
  let inTable = false;
  for (const line of lines) {
    if (/^\|---/.test(line)) { inTable = true; continue; }
    if (inTable && /^\|/.test(line)) { rows.push(line); }
  }
  console.log(`Filas extraídas: ${rows.length}`);
  if (rows.length > 0) {
    console.log('Filas:', rows);
  }
} else {
  console.log('✗ NO SE ENCONTRÓ la sección DataPower Externo');
}

console.log('\n==========================================');
console.log('TEST 2: Tabla XSL');
console.log('==========================================\n');

const depMatch = readmeContent.match(/^##\s*DEPENDENCIAS\s*$([\s\S]*?)(?=^##\s|\Z)/im);
if (depMatch) {
  const dependencias = depMatch[1];
  const xslMatch = dependencias.match(/\|\s*XSL\s*\|[\s\S]*?(?=^\s*\r?\n|$)/im);
  if (xslMatch) {
    console.log('✓ Tabla XSL encontrada:');
    console.log('---');
    console.log(xslMatch[0]);
    console.log('---\n');
    
    // Extraer filas de datos
    const xslTable = xslMatch[0];
    const xslLines = xslTable.split(/\r?\n/);
    let xslDataRows = [];
    let foundSeparator = false;
    for (const line of xslLines) {
      console.log(`Línea: "${line}" | ¿Separador? ${/^\|---/.test(line)} | ¿Fila? ${/^\|/.test(line)}`);
      if (/^\|---/.test(line)) { foundSeparator = true; continue; }
      if (foundSeparator && /^\|/.test(line)) {
        const cellContent = line.replace(/^\||\|$/g, '').trim();
        if (cellContent) xslDataRows.push(cellContent);
      }
    }
    console.log(`\nFilas de datos extraídas: ${xslDataRows.length}`);
    console.log('Contenido:', xslDataRows);
  } else {
    console.log('✗ NO se encontró la tabla XSL');
  }
}

console.log('\n==========================================');
console.log('TEST 3: WSDL');
console.log('==========================================\n');

const docMatch = readmeContent.match(/^##\s*DOCUMENTACION\s*$([\s\S]*?)(?=^##\s|\Z)/im);
if (docMatch) {
  const docSection = docMatch[1];
  const docContent = docSection.replace(/^##.*\n?/, ' ').replace(/\r?\n/g, ' ');
  
  console.log('Buscando **WSDL:**...');
  const hasWSDL = /\*\*WSDL\*\*/i.test(docContent) || /WSDL:/i.test(docContent);
  console.log(`¿Tiene WSDL? ${hasWSDL}`);
  
  if (hasWSDL) {
    const wsdlFragment = (docContent.match(/\*\*WSDL(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
    console.log(`\nFragmento WSDL: "${wsdlFragment}"`);
    
    const repo_name = (readmeContent.match(/^#\s*ESB_(.+)$/m) || ['',''])[1].replace(/\.$/, '').trim();
    console.log(`Repo name: "${repo_name}"`);
    
    const gitPattern = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
    console.log(`Patrón esperado: git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`);
    console.log(`¿Coincide? ${gitPattern.test(wsdlFragment)}`);
  }
}

console.log('\n==========================================');
console.log('TEST 4: Grupos de ejecución');
console.log('==========================================\n');

const deploymentMatch = readmeContent.match(/^## Procedimiento de despliegue\s*$([\s\S]*?)(?=^## |\Z)/im);
if (deploymentMatch) {
  const deploymentSection = deploymentMatch[1];
  console.log('✓ Sección de despliegue encontrada:');
  console.log('---');
  console.log(deploymentSection);
  console.log('---\n');
  
  const groupsMatch = deploymentSection.match(/desplegar en los grupos de ejecución:\s*([^\n#]+)/i);
  console.log(`¿Encontró la frase? ${!!groupsMatch}`);
  
  if (groupsMatch) {
    console.log(`Grupos en misma línea: "${groupsMatch[1].trim()}"`);
  } else {
    console.log('No encontró en la misma línea, buscando en siguiente...');
    const nextLineMatch = deploymentSection.match(/desplegar en los grupos de ejecución:\s*\n\s*([^\n#]+)/i);
    if (nextLineMatch) {
      console.log(`Grupos en siguiente línea: "${nextLineMatch[1].trim()}"`);
    } else {
      console.log('✗ NO encontró grupos ni en misma línea ni en siguiente');
    }
  }
} else {
  console.log('✗ NO se encontró la sección de despliegue');
}

console.log('\n==========================================');
console.log('FIN DE TESTS');
console.log('==========================================');

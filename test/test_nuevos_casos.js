const { validateReadmeTemplate } = require('../index');
const fs = require('fs');
const path = require('path');

// Test cases
const testCases = [
  {
    name: 'DataPower con valores Pendiente',
    readme: `# ESB_ACE12_TestService

## INFORMACIÓN DEL SERVICIO
Descripción del servicio de prueba

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|NA|NA|NA|

## Procedimiento de despliegue
Desplegar en los grupos de ejecución: BOGESERVICIOSTX_TEST01

## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|Pendiente|Pendiente|Pendiente|
|CALIDAD|WSP|Pendiente|Pendiente|Pendiente|
|PRODUCCION|WSP|Pendiente|Pendiente|Pendiente|

### DataPower Interno :
no expuesto en DP Interno

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|TEST|https://adbog162e:7800/test|
|CALIDAD|TEST|https://atbog163d:7800/test|
|PRODUCCION|TEST|https://adbog165a:7800/test|

## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|TEST|

|||||
|---|---|---|---|
|**Backends**|TEST|

## DEPENDENCIAS
|Servicios|
|---|
|TestService|

|XSL|
|---|
|NA|

## DOCUMENTACION

**Documento de diseño detallado:** https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test

**Mapeo:** https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test

**Evidencias (Unitarias/Auditoria/Monitoreo):** https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test

**WSDL:** git/ESB_ACE12_TestService/Broker/WSDL/wsdl/test.wsdl

## SQL
SELECT * FROM TEST WHERE ID = '123';
`
  },
  {
    name: 'DataPower Externo con texto alternativo',
    readme: `# ESB_ACE12_TestService2

## INFORMACIÓN DEL SERVICIO
Descripción del servicio de prueba 2

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|NA|NA|NA|

## Procedimiento de despliegue
Desplegar en los grupos de ejecución: BOGESERVICIOSTX_TEST01

## ACCESO AL SERVICIO
 
### DataPower Externo :
no expuesto en DP Externo

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|Test|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4800/test|
|CALIDAD|WSP|Test|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:4800/test|
|PRODUCCION|WSP|Test|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:4800/test|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|TEST|https://adbog162e:7800/test|
|CALIDAD|TEST|https://atbog163d:7800/test|
|PRODUCCION|TEST|https://adbog165a:7800/test|

## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|TEST|

|||||
|---|---|---|---|
|**Backends**|TEST|

## DEPENDENCIAS
|Servicios|
|---|
|TestService|

|XSL|
|---|
|NA|

## DOCUMENTACION

**Documento de diseño detallado:** https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/test

**Mapeo:** https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/test

**Evidencias (Unitarias/Auditoria/Monitoreo):** https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/test

**WSDL:** git\\ESB_ACE12_TestService2\\Broker\\WSDL\\wsdl\\test.wsdl

## SQL
SELECT * FROM TEST WHERE ID = '456';
`
  }
];

(async () => {
  const originalReadme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`PROBANDO: ${testCase.name}`);
    console.log('='.repeat(70));
    
    // Write test README
    fs.writeFileSync(path.join(process.cwd(), 'README.md'), testCase.readme, 'utf8');
    
    try {
      const ok = await validateReadmeTemplate();
      console.log(`\n✅ ${testCase.name}: EXITOSO`);
    } catch (err) {
      console.log(`\n❌ ${testCase.name}: FALLÓ`);
      console.log(`Error: ${err.message}`);
    }
  }
  
  // Restore original README
  fs.writeFileSync(path.join(process.cwd(), 'README.md'), originalReadme, 'utf8');
  console.log(`\n${'='.repeat(70)}`);
  console.log('TESTS COMPLETADOS - README original restaurado');
  console.log('='.repeat(70));
})();

# ESB_ACE12_TestTildes

## INFORMACIÓN DEL SERVICIO
Test para validar que PRODUCCIÓN con tilde funciona correctamente.

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
|DESARROLLO|WSP|Test|BODPDMZDEV|https://boc201.des.app.bancodeoccidente.net:4800/test|
|CALIDAD|WSP|Test|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4800/test|
|PRODUCCIÓN|WSP|Test|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4800/test|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|Test|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4800/test|
|CALIDAD|WSP|Test|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:4800/test|
|PRODUCCIÓN|WSP|Test|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:4800/test|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|TEST|https://adbog162e:7800/test|
|CALIDAD|TEST|https://atbog163d:7800/test|
|PRODUCCIÓN|TEST|https://apbog165a:7800/test|

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

**WSDL:** git/ESB_ACE12_TestTildes/Broker/WSDL/wsdl/test.wsdl

## SQL
SELECT * FROM TEST WHERE ID = '123';

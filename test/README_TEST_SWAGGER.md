# ESB_ACE12_AccountsTransactionHistory

## INFORMACIÓN DEL SERVICIO
Este es un servicio REST para consulta de transacciones.

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|12345|TEST-001|2025-01-15|

## Procedimiento de despliegue
Aplicar AccountsTransactionHistory.properties a AccountsTransactionHistory.bar y desplegar en los grupos de ejecución:
BOGESERVICIOSWS05_SRV01 BOGESERVICIOSWS05_SRV02

## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|wsp_dmz_iib_01|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4805/test|
|CALIDAD|WSP|wsp_dmz_iib_01|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4805/test|
|PRODUCCION|WSP|wsp_dmz_iib_01|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4805/test|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|wsp_int_iib_02|BODPDEV|https://boc201.des.app.bancodeoccidente.net:7866/test|
|CALIDAD|WSP|wsp_int_iib_02|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:7866/test|
|PRODUCCION|WSP|wsp_int_iib_02|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:7866/test|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS05_SRV01|https://adbog19ds:4922/test|
|CALIDAD|BOGESERVICIOSWS05_SRV01|https://atbog110d:4922/test|
|PRODUCCION|BOGESERVICIOSWS05_SRV01|https://apbog110d:4922/test|

## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|MB|PB|ICBS|
 
|||||
|---|---|---|---|
|**Backends**|FC|SAM|CRM|

## DEPENDENCIAS
|Servicios|
|---|
|ESB_ACE12_OtroServicio|

|XSL|
|---|
|N/A|

## DOCUMENTACION
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Mapeo:**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**Evidencias (Unitarias/Auditoria/Monitoreo):**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/test.pdf

**SWAGGER**
git/ESB_ACE12_AccountsTransactionHistory/Broker/SWAGGER/

## SQL
```sql
SELECT * FROM TABLE WHERE OPERATION_CODE = '123'
```

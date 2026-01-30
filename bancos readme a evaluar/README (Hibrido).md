# ESB_ACE12_ServicioHibrido

## INFORMACIÓN DEL SERVICIO
Este es un servicio híbrido que expone tanto interfaces SOAP (WSDL) como REST (SWAGGER) para permitir la integración con diferentes tipos de consumidores.

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|NA|TECH-100|15/01/2026|

## Procedimiento de despliegue
Aplicar ServicioHibrido.properties a ServicioHibrido.bar y desplegar en los grupos de ejecución:
  - BOGESERVICIOSTX_HIBRIDO01
  - BOGESERVICIOSTX_HIBRIDO02

## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP/MPG|WS_Hibrido|BODPDMZDEV|https://boc201.des.app.bancodeoccidente.net:4850/hibrido/v1/service|
|CALIDAD|WSP/MPG|WS_Hibrido|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4850/hibrido/v1/service|
|PRODUCCION|WSP/MPG|WS_Hibrido|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4850/hibrido/v1/service|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP/MPG|WS_Hibrido_Int|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4850/hibrido/v1/service|
|CALIDAD|WSP/MPG|WS_Hibrido_Int|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:4850/hibrido/v1/service|
|PRODUCCION|WSP/MPG|WS_Hibrido_Int|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:4850/hibrido/v1/service|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSTX_HIBRIDO01|https://adbog162e:7850/hibrido/v1/service|
|DESARROLLO|BOGESERVICIOSTX_HIBRIDO02|https://adbog162e:7851/hibrido/v1/service|
|CALIDAD|BOGESERVICIOSTX_HIBRIDO01|https://atbog163d:7850/hibrido/v1/service|
|CALIDAD|BOGESERVICIOSTX_HIBRIDO02|https://atbog163d:7851/hibrido/v1/service|
|PRODUCCION|BOGESERVICIOSTX_HIBRIDO01|https://apbog165a:7850/hibrido/v1/service|
|PRODUCCION|BOGESERVICIOSTX_HIBRIDO02|https://apbog166b:7851/hibrido/v1/service|
		
## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|SOAP Clients|REST Clients|Web Apps|
 
|||||
|---|---|---|---|
|**Backends**|SAM|FC|CRM|AS400|
 
## DEPENDENCIAS
|Servicios|
|---|
|IntegracionWSCaller|
|IntegracionRESTCaller|
|Util|
 
|XSL|
|---|
|REQ_Operacion1.xsl|
|RES_Operacion1.xsl|
|REQ_Operacion2.xsl|
|RES_Operacion2.xsl|
 
## DOCUMENTACION

**Documento de diseño detallado:** 
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos/ESB_ACE12_ServicioHibrido/Diseno

**Mapeo:**   
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos/ESB_ACE12_ServicioHibrido/Mapeo

**Evidencias (Unitarias/Auditoria/Monitoreo):**
https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos/ESB_ACE12_ServicioHibrido/Evidencias

**WSDL:**     
git/ESB_ACE12_ServicioHibrido/Broker/WSDL/wsdl/ServicioHibrido.wsdl

**SWAGGER:**
git/ESB_ACE12_ServicioHibrido/Broker/SWAGGER/swagger-hibrido.json

## SQL
- Operación híbrida
```
SELECT * FROM ADMESB.ESB_LOG_AUDITORIA WHERE NUM_ID_TIPO_OPERACION = '99999';
```

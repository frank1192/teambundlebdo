# ESB_ACE12_DesembolsoCartera

## INFORMACIÓN DEL SERVICIO

Realizar desembolso de cartera del credito rotativo 

### Último despliegue

|CQ |JIRA |Fecha|
|---|---|---|
| C43156 |NA |14/05/25 10:10 PM|

## Procedimiento de despliegue
Aplicar DesembolsoCartera.properties a DesembolsoCartera.bar y desplegar en los grupos de ejecución:

 - BOGESERVICIOSWS03_SRV01
 - BOGESERVICIOSWS03_SRV02

## ACCESO AL SERVICIO
 
### DataPower Externo :
No expuesto en datapower Externo
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|N/A|N/A|N/A|N/A|
|CALIDAD|N/A|N/A|N/A|N/A|
|PRODUCCION|N/A|N/A|N/A|N/A|
### DataPower Interno :

|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|Web Service Proxy|WSServicioPilotoATHInterno|BODPDEV|https://boc201.des.app.bancodeoccidente.net:7903/DesembolsoCarteraService/DesembolsoCarteraPort|
|CALIDAD   |Web Service Proxy|WSServicioPilotoATHInterno|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:7903/DesembolsoCarteraService/DesembolsoCarteraPort|
|PRODUCCION|Web Service Proxy|WSServicioPilotoATHInterno|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:7903/DesembolsoCarteraService/DesembolsoCarteraPort|

### Endpoint BUS 

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|                                                           
|DESARROLLO|BOGESERVICIOSWS03_SRV01|https://adbog162e.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|DESARROLLO|BOGESERVICIOSWS03_SRV02|https://adbog162e.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|DESARROLLO|BOGESERVICIOSWS03_SRV01|https://adbog162e.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|
|DESARROLLO|BOGESERVICIOSWS03_SRV02|https://adbog162e.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|
|CALIDAD|N1-BOGESERVICIOSWS03_SRV01|https://atbog163d.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|CALIDAD|N1-BOGESERVICIOSWS03_SRV02|https://atbog164e.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|CALIDAD|N2-BOGESERVICIOSWS03_SRV01|https://atbog163d.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|
|CALIDAD|N2-BOGESERVICIOSWS03_SRV02|https://atbog164e.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|
|PRODUCCION|BOGESERVICIOSWS03_SRV01|https://apbog165a.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|PRODUCCION|BOGESERVICIOSWS03_SRV02|https://apbog166b.bancodeoccidente.net:4903/DesembolsoCarteraService/DesembolsoCarteraPort|
|PRODUCCION|BOGESERVICIOSWS03_SRV01|https://apbog165a.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|
|PRODUCCION|BOGESERVICIOSWS03_SRV02|https://apbog166b.bancodeoccidente.net:4904/DesembolsoCarteraService/DesembolsoCarteraPort|

		
## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|OFICINAS|
 
|||||
|---|---|---|---|
|**Backends**|ODS| FLEXCUBE
 
## DEPENDENCIAS
|Servicios|
|---|
|GeneradorSecuenciaESBCaller|
|IntegracionFCCaller|
|ConsultaCupoCarteraPaqueteCaller|
|Util|
 
 
## DOCUMENTACION
**Documento de diseño detallado:** 
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_DesembolsoCartera/DISE%C3%91O%20Y%20DESARROLLO?csf=1&web=1&e=NwvlLk

**Mapeo:**   
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_DesembolsoCartera/MAPEO?csf=1&web=1&e=o1E5cn

**Evidencias (Unitarias/Auditoria/Monitoreo):**
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_DesembolsoCartera/MAPEO?csf=1&web=1&e=o1E5cn

**WSDL:**
git\ESB_ACE12_DesembolsoCartera\Broker\WSDL\wsdl\DesembolsoCartera.wsdl

## SQL
|admesb|esb_log_auditoria     |select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '480081'|
|admesb|esb_log_auditoria2    |select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '480081'|
|admesb|esb_log_auditoria_hist|select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '480081'|
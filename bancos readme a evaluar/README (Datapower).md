# ESB_BalanceInquiry.

## INFORMACIÓN DEL SERVICIO
El servicio BalanceInquiry permite realizar la consulta consolidada de productos (T1) y la consulta por producto (T2) para los canales de ICBS, MB y PB. El servicio se expone a través de HTTP/SOAP y HTTP/REST. 
Orquesta el consumo de distintos legados como FlexCube, SAM, ODS, CRM, AS400 y Fiserv. 
### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|N/A|TCIO-15|N/A|

## Procedimiento de despliegue
- Aplicar BalanceInquiry.properties a BalanceInquiry.bar y desplegar en los grupos de ejecución:
  - BOGESERVICIOSWS_ICBS02

## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|wsp_dmz_iib_01|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4805/accounts/BalanceInquiry|
|CALIDAD|WSP|WS_Services_Azure|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4827/accounts/BalanceInquiry|
|CALIDAD|WSP|wsp_dmz_iib_01|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4805/accounts/BalanceInquiry|
|PRODUCCION|WSP|wsp_dmz_iib_01|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4805/accounts/BalanceInquiry|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|wsp_int_iib_02|BODPDEV|https://boc201.des.app.bancodeoccidente.net:7866/accounts/BalanceInquiry|
|CALIDAD|WSP|wsp_int_iib_02|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:7866/accounts/BalanceInquiry|
|PRODUCCION|WSP|wsp_int_iib_02|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:7866/accounts/BalanceInquiry|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS_ICBS02|http://adbog162e:7922/accounts/BalanceInquiry|
|DESARROLLO|BOGESERVICIOSWS_ICBS02|http://adbog162e:7922/accounts/BalanceInquiry|
|CALIDAD|BOGESERVICIOSWS_ICBS02|http://atbog163d.bancodeoccidente.net:7922/accounts/BalanceInquiry|
|CALIDAD|BOGESERVICIOSWS_ICBS02|http://atbog164e.bancodeoccidente.net:7922/accounts/BalanceInquiry|
|PRODUCCION|BOGESERVICIOSWS_ICBS02|http://apbog165a:7922/accounts/BalanceInquiry|
|PRODUCCION|BOGESERVICIOSWS_ICBS02|http://apbog166b:7922/accounts/BalanceInquiry|

## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|MB|PB|ICBS|
 
|||||
|---|---|---|---|
|**Backends**|FC|SAM|CRM|AC|SIIF|Fiserv|
 
## DEPENDENCIAS
|Servicios|
|---|
|ConsultaProductoConSaldosCaller|
|ConsultaSaldoTarjetaCreditoCaller|
|IntegracionAS400LeasingCaller|
|IntegracionEtiquetasSAMCaller|
|IntegracionFCCaller|
|IntegracionPaquetesACCaller|
|IntegracionRESTCaller|
|IntegracionSPCaller|
|IntegracionWSCaller|
|Util|
 
|XSL|
|---|
|REQ_FCUBSAccService_QueryAccBal_600.xsl|
|RES_FCUBSAccService_QueryAccBal.xsl|
|REQ_FCUBSTDService_QueryTdBal_1805.xsl|
|RES_FCUBSTDService_QueryTdBal.xsl|
|REQ_FCUBSTDService_QueryTDAcnt_1572.xsl|
|RES_FCUBSTDService_QueryTDAcnt.xsl|
|REQ_FCUBSCLService_QueryCompBals.xsl|
|RES_FCUBSCLService_QueryCompBals.xsl|
|REQ_EjecucionProcedimientoBaseDatos_ejecutarProcedimiento.xsl|
|RES_EjecucionProcedimientoBaseDatos_ejecutarProcedimiento.xsl|
|REQ_Consulta_detallada_V2_consultasalconsoldetall.xsl|
|RES_Consulta_detallada_V2_consultasalconsoldetall.xsl|
|REQ_ConsultarCreditos_consultarEstadoCredito.xsl|
|RES_ConsultarCreditos_consultarEstadoCredito.xsl|
|REQ_ConsultarCreditos_ConsultarPagoMinimo.xsl|
|RES_ConsultarCreditos_ConsultarPagoMinimo.xsl|
|REQ_DatosFinancierosObligacionesLeasingService_getinfobligaciones.xsl|
|RES_DatosFinancierosObligacionesLeasingService_getinfobligaciones.xsl|
 
## DOCUMENTACION
**Documento de diseño detallado:** 
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/BalanceInquiry/DISE%C3%91O%20Y%20DESARROLLO?csf=1&web=1&e=U6oLdF

**Mapeo:**   
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/BalanceInquiry/MAPEO?csf=1&web=1&e=4b3nVZ

**Evidencias (Unitarias/Auditoria/Monitoreo):**
- https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/BalanceInquiry/MAPEO?csf=1&web=1&e=4b3nVZ

**WSDL:**     
git/ESB_BalanceInquiry/Broker/WSDL/wsdl/BalanceInquiry.wsdl  

## SQL
- Operación getBalanceByProduct - **355011**
```
select * from admesb.esb_log_auditoria where num_id_tipo_operacion = '355011'
select * from admesb.esb_log_auditoria2 where num_id_tipo_operacion = '355011'
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '355011'
select * from admesb.esb_reporte_monitoreo where str_variable1 in('355011');
```
- Operación getBalanceByProductOnline - **355012**
```
select * from admesb.esb_log_auditoria where num_id_tipo_operacion = '355012'
select * from admesb.esb_log_auditoria2 where num_id_tipo_operacion = '355012'
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '355012'
```
- Operación getBalanceGroupedByProduct - **355013**
```
select * from admesb.esb_log_auditoria where num_id_tipo_operacion = '355013'
select * from admesb.esb_log_auditoria2 where num_id_tipo_operacion = '355013'
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '355013'
```

## REVISORES
|Usuario de Github|
|---|
|DRamirezM_bocc|
|JJPARADA_bocc|
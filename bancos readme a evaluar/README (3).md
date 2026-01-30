# ESB_ACE12_ConsultaProductoConSaldos

## INFORMACIÓN DEL SERVICIO
Este servicio permite realizar la consulta consolidada de productos (T1) para los canales de MB, PB y OFICINAS. El servicio se expone a través de HTTP/SOAP y orquesta el consumo de distintos legados como FlexCube, SAM, ODS, CRM, AS400 y Fiserv a través de nodos Aggregate.

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
|N/A|TCIO-44|N/A|

## Procedimiento de despliegue
Aplicar ConsultaProductoConSaldos.properties a ConsultaProductoConSaldos.bar y desplegar en los grupos de ejecución:
  - BOGESERVICIOSTX_CONSULTASALDOS01
  - BOGESERVICIOSTX_CONSULTASALDOS02

## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|N/A|BODPDMZDEV|https://boc201.des.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|CALIDAD|WSP|WS_ServiciosATH|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|PRODUCCION|WSP|WS_ServiciosATH|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|N/A|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|CALIDAD|WSP|WSServicioPilotoATHInterno|BODPQAS|https://boc201.tesint.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|PRODUCCION|WSP|WSServicioPilotoATHInterno|BODPPRD|https://boc201.prdint.app.bancodeoccidente.net:4805/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|

### Endpoint BUS 
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSTX_CONSULTASALDOS01|http://adbog162e:7863/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|DESARROLLO|BOGESERVICIOSTX_CONSULTASALDOS02|http://adbog162e:7864/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|CALIDAD|BOGESERVICIOSTX_CONSULTASALDOS01|http://atbog163d:7863/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|CALIDAD|BOGESERVICIOSTX_CONSULTASALDOS02|http://atbog163d:7864/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|PRODUCCION|BOGESERVICIOSTX_CONSULTASALDOS01|http://apbog165a:7863/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
|PRODUCCION|BOGESERVICIOSTX_CONSULTASALDOS02|http://apbog166b:7864/ConsultaProductoConSaldosService/ConsultaProductoConSaldosPort|
		
## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|MB|PB|CANALES|
 
|||||
|---|---|---|---|
|**Backends**|FC|SAM|CRM|
|AS400|SIIF|Fiserv|
 
## DEPENDENCIAS
|Servicios|
|---|
|IntegracionFCCaller|
|IntegracionSPCaller|
|IntegracionWSCaller|
|IntegracionPaquetesACCaller|
|IntegracionFiservCaller|
|IntegracionRESTCaller|
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
- https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FConsultaProductoConSaldos%2FDISE%C3%91O%20Y%20DESARROLLO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91&csf=1&CID=b18b173b%2D2bc8%2D45da%2Da7f1%2D1acf350bb1e0&FolderCTID=0x01200030787A2810678047BA42A22CE243F54B

**Mapeo:**   
- https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FConsultaProductoConSaldos%2FMAPEO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91&csf=1&CID=b18b173b%2D2bc8%2D45da%2Da7f1%2D1acf350bb1e0&FolderCTID=0x01200030787A2810678047BA42A22CE243F54B

**Evidencias (Unitarias/Auditoria/Monitoreo):**
- https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FConsultaProductoConSaldos%2FMAPEO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91&csf=1&CID=b18b173b%2D2bc8%2D45da%2Da7f1%2D1acf350bb1e0&FolderCTID=0x01200030787A2810678047BA42A22CE243F54B

**WSDL:**     
git/ESB_ACE12_ConsultaProductoConSaldos/Broker/WSDL/wsdl/ConsultaProductoConSaldos.wsdl

## SQL
- Operación consultarSaldos
```
SELECT * FROM ADMESB.ESB_TIPOS_OPERACION WHERE 1=1 AND NUM_ID_TIPO_OPERACION = '480027';
```


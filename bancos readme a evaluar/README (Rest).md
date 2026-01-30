# ESB_ACE12_SiebelAccountsBalance

## INFORMACIÓN DEL SERVICIO
El servicio SiebelAccountsBalance el cual les permite a los Sistemas Consumidores comunicarse con SAM, SIIF, FC, FD, SISCAR, AC y AS400, con el objetivo de consultar el saldo detallado de los diferentes productos de un cliente.
### Último despliege
|CQ |JIRA |Fecha|
|---|---|---|
|NA|PCC-60|21/08/2025|
|NA|PCC-76|24/10/2025|
|NA|PCC-76|07/11/2025|
|NA|PCC-91|24/11/2025|
|NA|PCC-95|22/01/2026|

## Procedimiento de despliegue

* El siguiente proceso se debe realizar en ambos nodos del BUS: 
1. Aplicar SiebelAccountsBalance.properties a SiebelAccountsBalance.bar y desplegar en los grupos de ejecucion:
*  BOGESERVICIOSWS08

## ACCESO AL SERVICIO

### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|Multi-Protocol Gateway|mpg_dmz_iib_04|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4876/accountsManagement/v1/Accounts/Balance|
|CALIDAD|Multi-Protocol Gateway|mpg_dmz_iib_04|BODPDMZQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4876/accountsManagement/v1/Accounts/Balance|
|PRODUCCION|Multi-Protocol Gateway|mpg_dmz_iib_04|BODPDMZPRD|https://boc201.prddmz.app.bancodeoccidente.net:4876/accountsManagement/v1/Accounts/Balance|

### Endpoint BUS REST
|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS08|https://adbog162e.bancodeoccidente.net:4931/accountsManagement/v1/Accounts/Balance|
|CALIDAD|BOGESERVICIOSWS08|https://atbog163d.bancodeoccidente.net:4931/accountsManagement/v1/Accounts/Balance|
|CALIDAD|BOGESERVICIOSWS08|https://atbog164e.bancodeoccidente.net:4931/accountsManagement/v1/Accounts/Balance|
|PRODUCCION|BOGESERVICIOSWS08|https://apbog165a.bancodeoccidente.net:4931/accountsManagement/v1/Accounts/Balance|
|PRODUCCION|BOGESERVICIOSWS08|https://apbog166b.bancodeoccidente.net:4931/accountsManagement/v1/Accounts/Balance|

## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|SIEBEL|

||||||||
|---|---|---|---|---|---|---|
|**Backends**|SAM|SIIF|FC|FD|SISCAR|AS400|

## DEPENDENCIAS
|Servicios|
|---|
|Util|
|IntegracionWSCaller|
|IntegracionFCCaller|
|GeneradorSecuenciaESBCaller|


|XSL|
|---|
|REQ_FCUBSTDService_QueryTDAcnt_1191.xsl|
|RES_FCUBSTDService_QueryTDAcnt.xsl|
|REQ_FCUBSTDService_QueryTdBal_1805.xsl|
|RES_FCUBSTDService_QueryTdBal.xsl|
|REQ_FCUBSAccService_QueryAccBal_600.xsl|
|RES_FCUBSAccService_QueryAccBal.xsl|
|REQ_FCUBSAccService_QueryCustAcc_662.xsl|
|RES_FCUBSAccService_QueryCustAcc.xsl|
|REQ_ConsultaSaldosPrestamos_ConsultarSaldosPrestamos_Siebel.xsl|
|RES_ConsultaSaldosPrestamos_ConsultarSaldosPrestamos_Siebel.xsl|
|REQ_EjecucionProcedimientoBaseDatos_ejecutarProcedimiento.xsl|
|RES_EjecucionProcedimientoBaseDatos_ejecutarProcedimiento.xsl|
|REQ_ConsultarProductoOcciclienteServiceActionService_consultarProducto.xsl|
|RES_ConsultarProductoOcciclienteServiceActionService_consultarProducto.xsl|
|REQ_Consulta_detallada_V2_consultasalconsoldetall.xsl|
|RES_Consulta_detallada_V2_consultasalconsoldetall.xsl|
|REQ_DatosFinancierosObligacionesLeasingService_getinfobligaciones.xsl|
|RES_DatosFinancierosObligacionesLeasingService_getinfobligaciones.xsl|
|REQ_ConsultaDetalladaTarjetaCreditoServices_consultarDetalle.xsl|
|RES_ConsultaDetalladaTarjetaCreditoServices_consultarDetalle.xsl|


## DOCUMENTACION
<!--Se debe colocar las rutas correctas del servicio-->
**Documento de diseño detallado:** <br> https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FSiebelAccountsBalance%2FDISE%C3%91O%20Y%20DESARROLLO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91

<br> **Mapeo:** <br> https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FSiebelAccountsBalance%2FMAPEO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91

<br> **Evidencias (Unitarias/Auditoria/Monitoreo):** <br> https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FSiebelAccountsBalance%2FMAPEO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91

<br> **SWAGGER:** <br> 
git\ESB_ACE12_SiebelAccountsBalance\Broker\SWAGGER\swaggerBalance 1.json

## SQL
Operaciones del servicio
 
- **SiebelAccountsBalance**  
```
SELECT * FROM ADMESB.ESB_LOG_AUDITORIA WHERE NUM_ID_TIPO_OPERACION = '27205'
SELECT * FROM ADMESB.ESB_REPORTE_MONITOREO WHERE NUM_ID_TIPO_OPERACION = '27205'
```
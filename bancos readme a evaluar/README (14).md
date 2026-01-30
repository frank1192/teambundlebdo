# ESB_ACE12_AccountsTransactionHistory.

## INFORMACIÓN DEL SERVICIO
Servicios de consulta de movimientos para un rango de tiempo no superior a 3 meses para productos: Tarjeta de Crédito(TC), Cuenta Corriente(CC) y Cuentas de Ahorro(CA). 

### Último despliege

|CQ |JIRA |Fecha|
|---|---|---|
| CQ_188950|NA |23/05/2022|   

## Procedimiento de despliegue
1. AccountsTransactionHistory.properties a AccountsTransactionHistory.bar y desplegar en los grupos de ejecución:
*  BOGESERVICIOSWS08


## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|mpg_dmz_iib_02 - mpg_dmz_iib_04|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4831/accountsManagement/v1/Accounts/TransactionHistory|
|CALIDAD|WSP|WS_mpg_dmz_iib_02 -mpg_dmz_iib_04|BODPQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4831/accountsManagement/v1/Accounts/TransactionHistory|
|PRODUCCION|WSP|mpg_dmz_iib_02 - mpg_dmz_iib_04|BODPPRD|https://boc201.prddmz.app.bancodeoccidente.net:4831/accountsManagement/v1/Accounts/TransactionHistory|


### DataPower Interno :
N/A

### Endpoint BUS 

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS08|https://adbog162e:4931/accountsManagement/v1/Accounts/TransactionHistory|
|CALIDAD|N1-BOGESERVICIOSWS08|https://atbog163d:4931/accountsManagement/v1/Accounts/TransactionHistory|
|CALIDAD|N1-BOGESERVICIOSWS08|https://atbog163d:4931/accountsManagement/v1/Accounts/TransactionHistory|
|CALIDAD|N2-BOGESERVICIOSWS08|https://atbog164e:4931/accountsManagement/v1/Accounts/TransactionHistory|
|CALIDAD|N2-BOGESERVICIOSWS08|https://atbog164e:4931/accountsManagement/v1/Accounts/TransactionHistory|
|PRODUCCION|BOGESERVICIOSWS08|https://apbog165a:4931/accountsManagement/v1/Accounts/TransactionHistory|
|PRODUCCION|BOGESERVICIOSWS08|https://apbog165a:4931/accountsManagement/v1/Accounts/TransactionHistory|

										 
## CANALES - APLICACIONES
 
|||
|---|---|
|**Consumidor**|SIEBEL|
 
|||
|---|---|
|**Backends**|SAM|
 
## DEPENDENCIAS
|Servicios|
|---|
|IntegracionWSCaller|
|Util|


 
 
|XSL|
|---|
|N/A|

 		
 
## DOCUMENTACION
  
**Documento de diseño detallado:** 
"https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FAccountsTransactionHistory%2FDISE%C3%91O%20Y%20DESARROLLO&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91"  

**Mapeo:**   
"https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FAccountsTransactionHistory%2FMAPEOS&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91"

"**Evidencias (Unitarias/Auditoria/Monitoreo):**    " 
"https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/Documentos%20compartidos/Forms/Docs.aspx?id=%2Fsites%2FBibliotecaAplicaciones%2FDocumentos%20compartidos%2F60%2DIBM%20Integration%20BUS%2F2%2E%20Dise%C3%B1o%20y%20Desarrollo%2FESB%5FACE12%5FAccountsTransactionHistory%2FMAPEOS&viewid=ab1a6f72%2De875%2D4328%2Dbc2d%2Db19a511d2a91"
  
**WSDL:**     
N/A

**JSON:**
git\ESB_ACE12_AccountsTransactionHistory\Broker\JSON

## SQL
-Operaciones del servicio

- **27210**
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '27210'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '27210'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '27210'  
```


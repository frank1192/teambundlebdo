# ESB_ACE12_ConsultarAdqMovNotas.

## INFORMACIÓN DEL SERVICIO
Con este servicio Banco de Occidente desea consultar los movimientos realizados en un producto del banco. Permite realizar las consultas de movimientos de los productos: Cuenta Ahorros, Cuenta Corriente, Créditos, CRC, Moneda Extranjera y Tarjeta de Crédito.

### Último despliege

|CQ |JIRA | Fecha|
|---|---|---|
| NA |NA |18/6/2024 | 

## Procedimiento de despliegue
1. Aplicar ConsultarAdqMovNotas.properties a ConsultarAdqMovNotas.bar y desplegar en los grupos de ejecución:
*  BOGESERVICIOSWS_ICBS01


## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|WSP|WS_Services_Azure <br>WS_ServicesICBS <br>wsp_dmz_iib_01 <br>wsp_dmz_iib_02 <br> wsp_dmz_iib_03|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4827/accounts/AccountActivityInquiry <br> https://boc201.des.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.des.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.des.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.des.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry  |
|CALIDAD|WSP|WS_Services_Azure <br>WS_ServicesICBS <br>wsp_dmz_iib_01 <br>wsp_dmz_iib_02 <br> wsp_dmz_iib_03 |BODPDMZQAS| https://boc201.tesdmz.app.bancodeoccidente.net:4827/accounts/AccountActivityInquiry <br> https://boc201.tesdmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.tesdmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.tesdmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.tesdmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry |
|PRODUCCION|WSP|WS_Services_Azure <br>WS_ServicesICBS <br>wsp_dmz_iib_01 <br>wsp_dmz_iib_02 <br> wsp_dmz_iib_03|BODPDMZPRD|  https://boc201.prddmz.app.bancodeoccidente.net:4827/accounts/AccountActivityInquiry <br> https://boc201.prddmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.prddmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.prddmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry <br> https://boc201.prddmz.app.bancodeoccidente.net:4805/accounts/AccountActivityInquiry |


<br><br>
### DataPower Interno :

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|NA|NA|
|CALIDAD|NA|NA|
|PRODUCCION|NA|NA|

<br><br>
### Endpoint BUS 

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS_ICBS01|https://adbog162e.bancodeoccidente.net:4921/accounts/AccountActivityInquiry |
|DESARROLLO|BOGESERVICIOSWS_ICBS01|https://adbog162e.bancodeoccidente.net:4921/accounts/AccountActivityInquiry |
|CALIDAD|N1-BOGESERVICIOSWS_ICBS01|https://atbog163d.bancodeoccidente.net:4921/accounts/AccountActivityInquiry |
|CALIDAD|N2-|https://atbog164e.bancodeoccidente.net:4921/accounts/AccountActivityInquiry|
|PRODUCCION|N1-BOGESERVICIOSWS_ICBS01|https://boc060ap.prd.app.bancodeoccidente.net:4921/accounts/AccountActivityInquiry|
|PRODUCCION|N2-|https://boc060ap.prd.app.bancodeoccidente.net:4921/accounts/AccountActivityInquiry|

<br><br>		
## CANALES - APLICACIONES
 
 
|||||
|---|---|---|---|
|**Consumidor**|183 ICBS|74	BANCA MOVIL|
 
||||||||
|---|---|---|---|---|---|---|
|**Backends**|AS400 LE|ETIQUETAS |ETL|FISERV|SP|SAM|
 
## DEPENDENCIAS
|Servicios|
|---|
|IntegracionAS400LeasingCaller|
|IntegracionEtiquetasSAMCaller|
|IntegracionETLCaller|
|IntegracionFiservCaller|
|IntegracionSPCaller|
|IntegracionWSCaller|
|Util|
||
 
 
|XSL|
|---|
|...::: Revisar :::... |
||
 		
 
## DOCUMENTACION
 
**Documento de diseño detallado:** <br>
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_ConsultarAdqMovNotas

**Mapeo:**   <br>
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_ConsultarAdqMovNotas

**Evidencias (Unitarias/Auditoria/Monitoreo):**      <br>
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_ConsultarAdqMovNotas

**WSDL:** <br>
git\ESB_ACE12_ConsultarAdqMovNotas\Broker\WSDL\wsdl\AccountActivityInquiry_1.wsdl  

 
## SQL
-Operaciones del servicio

- **AccountActivityAdviseFileRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **AccountActivityImageRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **AccountActivityRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **ActivityAcquirerRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **ActivityGroupedAcquirerAdviseFileRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **ActivityGroupedAcquirerRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **NoteAdviseFileRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **NoteDetailRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```

- **NotesByTypeRequest**  
```
select * from admesb.esb_log_auditoria      where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria2     where num_id_tipo_operacion = '80034'  
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80034'  

```


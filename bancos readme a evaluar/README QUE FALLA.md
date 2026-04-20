# ESB_ACE12_NotificacionPagoObligacionesLeasing

## INFORMACIÓN DEL SERVICIO
Este servicio permite recibir las solicitudes para consultar el saldo de las cuentas a través de un Web Services, Permite realizar la invocación al servicio “NotificacionPagoObligacionesLeasing” del BUS

### Último despliegue

|CQ |JIRA | Fecha|
|---|---|---|
| NA |NA |2024-04-10| 

## Procedimiento de despliegue
1. Aplicar NotificacionPagoObligacionesLeasing.properties a NotificacionPagoObligacionesLeasing.bar y desplegar en los grupos de ejecución:
*  BOGESERVICIOSWS_ICBS07


## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|MPG|WS_Services_ATH_ESB|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|
|CALIDAD|MPG|WS_Services_ATH_ESB|BODPQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|
|PRODUCCION|MPG|WS_Services_ATH_ESB|BODPPRD|https://boc201.prddmz.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|N/A|N/A|N/A|N/A|
|CALIDAD|N/A|N/A|N/A|N/A|
|PRODUCCION|N/A|N/A|N/A|N/A|

### Endpoint BUS 

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS_ICBS07|https://adbog162e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|DESARROLLO|BOGESERVICIOSWS_ICBS07|https://adbog162e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|CALIDAD|N1-BOGESERVICIOSWS_ICBS07|https://atbog163d.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|CALIDAD|N2-BOGESERVICIOSWS_ICBS07|https://atbog164e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|PRODUCCIÓN|N1-BOGESERVICIOSWS_ICBS07|https://apbog165a.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|PRODUCCIÓN|N2-BOGESERVICIOSWS_ICBS07|https://apbog166b.bancodeoccidente.net:4927/payments/LoanPaymentPSE|

<br><br>
## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|ATH|
 
|||||
|---|---|---|---|
|**Backends**|FC|AS400leasing|

 
## DEPENDENCIAS
|Servicios|
|---|
|Util|
|IntegracionAS400LeasingCaller|
|IntegracionPagosActivasCaller|
|IntegracionWSCaller|

|XSL|
|---|
|REQ_FCUBSCLService_CreatePayment.xsl|
|RES_FCUBSCLService_CreatePayment.xsl|		
 
## DOCUMENTACION
 
**Documento de diseño detallado:**
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_NotificacionPagoObligacionesLeasing?csf=1&web=1&e=JnEczN

**Mapeo:**
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_NotificacionPagoObligacionesLeasing?csf=1&web=1&e=JnEczN

**Evidencias (Unitarias/Auditoria/Monitoreo):**
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_NotificacionPagoObligacionesLeasing?csf=1&web=1&e=JnEczN

**WSDL:**     
# ESB_ACE12_NotificacionPagoObligacionesLeasing.

## INFORMACIÓN DEL SERVICIO
Este servicio permite recibir las solicitudes para consultar el saldo de las cuentas a través de un Web Services, Permite realizar la invocación al servicio “NotificacionPagoObligacionesLeasing” del BUS

### Último despliegue

|CQ |JIRA | Fecha|
|---|---|---|
| NA |NA |2024-04-10| 

## Procedimiento de despliegue
1. Aplicar NotificacionPagoObligacionesLeasing.properties a NotificacionPagoObligacionesLeasing.bar y desplegar en los grupos de ejecución:
*  BOGESERVICIOSWS_ICBS07


## ACCESO AL SERVICIO
 
### DataPower Externo :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|MPG|WS_Services_ATH_ESB|BODPDEV|https://boc201.des.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|
|CALIDAD|MPG|WS_Services_ATH_ESB|BODPQAS|https://boc201.tesdmz.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|
|PRODUCCION|MPG|WS_Services_ATH_ESB|BODPPRD|https://boc201.prddmz.app.bancodeoccidente.net:4805/payments/LoanPaymentPSE|

### DataPower Interno :
|AMBIENTE|TIPO COMPONENTE|NOMBRE WSP O MPG|DATAPOWER|ENDPOINT|
|---|---|---|---|---|
|DESARROLLO|N/A|N/A|N/A|N/A|
|CALIDAD|N/A|N/A|N/A|N/A|
|PRODUCCION|N/A|N/A|N/A|N/A|

### Endpoint BUS 

|AMBIENTE|    NODO/GE    |ENDPOINT|
|---|----------|---|
|DESARROLLO|BOGESERVICIOSWS_ICBS07|https://adbog162e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|DESARROLLO|BOGESERVICIOSWS_ICBS07|https://adbog162e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|CALIDAD|N1-BOGESERVICIOSWS_ICBS07|https://atbog163d.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|CALIDAD|N2-BOGESERVICIOSWS_ICBS07|https://atbog164e.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|PRODUCCIÓN|N1-BOGESERVICIOSWS_ICBS07|https://apbog165a.bancodeoccidente.net:4927/payments/LoanPaymentPSE|
|PRODUCCIÓN|N2-BOGESERVICIOSWS_ICBS07|https://apbog166b.bancodeoccidente.net:4927/payments/LoanPaymentPSE|

<br><br>
## CANALES - APLICACIONES
|||||
|---|---|---|---|
|**Consumidor**|ATH|
 
|||||
|---|---|---|---|
|**Backends**|FC|AS400leasing|

 
## DEPENDENCIAS
|Servicios|
|---|
|Util|
|IntegracionAS400LeasingCaller|
|IntegracionPagosActivasCaller|
|IntegracionWSCaller|
 
|XSL|
|---|
|REQ_FCUBSCLService_CreatePayment.xsl|
|RES_FCUBSCLService_CreatePayment.xsl|		
 
## DOCUMENTACION
 
**Documento de diseño detallado:**
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecadeAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_ConsultaClienteNegativo?csf=1&web=1&e=0BEQkt

**Mapeo:**
https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_NotificacionPagoObligacionesLeasing?csf=1&web=1&e=JnEczN

**Evidencias (Unitarias/Auditoria/Monitoreo):**
 https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/Documentos%20compartidos/60-IBM%20Integration%20BUS/2.%20Dise%C3%B1o%20y%20Desarrollo/ESB_ACE12_NotificacionPagoObligacionesLeasing?csf=1&web=1&e=JnEczN

**WSDL:**   
git/ESB_ACE12_ACE12_NotificacionPagoObligacionesLeasing/Broker/WSDL/

## SQL
 
-  **addLoanPmtPSENotification**
 
```
 
select * from admesb.esb_log_auditoria where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_log_auditoria2 where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_reporte_monitoreo where  NUM_ID_TIPO_OPERACION = '80009';
 
```



## SQL
 
-  **addLoanPmtPSENotification**
 
```
 
select * from admesb.esb_log_auditoria where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_log_auditoria2 where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_log_auditoria_hist where num_id_tipo_operacion = '80009'
 
select * from admesb.esb_reporte_monitoreo where  NUM_ID_TIPO_OPERACION = '80009';
 
```


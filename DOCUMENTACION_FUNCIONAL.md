# Documentación Funcional - ESB ACE12 Checklist Validation Action

## 1. Introducción

### 1.1 Descripción General del Action

El **ESB ACE12 Checklist Validation Action** es una herramienta automatizada de validación que se ejecuta cada vez que se crea o actualiza un Pull Request en los repositorios de servicios ESB/ACE12 del Banco de Occidente.

Su propósito principal es asegurar que todos los servicios cumplan con los estándares de documentación, nomenclatura y configuración establecidos por el equipo ESB, antes de que los cambios sean fusionados a las ramas principales (develop, quality, main).

### 1.2 Objetivo del Action

El Action funciona como un **guardián de calidad** que verifica automáticamente:

- ✅ Que el nombre de las ramas siga las convenciones GitFlow
- ✅ Que exista el archivo README.md en la raíz del repositorio
- ✅ Que el README.md cumpla con la plantilla estándar definida
- ✅ Que los grupos de ejecución coincidan con la configuración central
- ✅ Que no existan carpetas "BD" en el repositorio
- ✅ Que los revisores autorizados estén asignados en flujos críticos

Esta automatización reduce errores humanos, estandariza la documentación y acelera los procesos de revisión y aprobación.

---

## 2. ¿Qué es un Action?

### 2.1 Concepto de GitHub Action

Un **GitHub Action** es un proceso automatizado que se ejecuta en respuesta a eventos específicos en un repositorio de GitHub. En este caso, el Action se activa cuando:

- Se abre un nuevo Pull Request
- Se actualiza un Pull Request existente
- Se edita la descripción de un Pull Request

### 2.2 Para qué se utiliza dentro del sistema

Dentro del ecosistema de desarrollo del Banco de Occidente, este Action se utiliza para:

1. **Validar la calidad de la documentación** antes de que llegue a revisión humana
2. **Verificar cumplimiento de estándares** de forma automática y consistente
3. **Reducir el tiempo de revisión** al detectar errores comunes de manera temprana
4. **Garantizar trazabilidad** de cambios mediante validación de nombres de rama y revisores
5. **Mantener sincronización** entre los servicios y la configuración central de grupos de ejecución

---

## 3. Acceso a los Mensajes de Homologación

### 3.1 Dónde se encuentran

Los mensajes de validación se encuentran en la sección de **"Checks"** (Verificaciones) del Pull Request. Para acceder a ellos:

1. Abra el Pull Request en GitHub
2. Navegue a la pestaña **"Checks"** (junto a "Conversation" y "Files changed")
3. Busque el check llamado **"ESB ACE12 Checklist Validation"**

### 3.2 Cómo acceder a ellos

**Paso a paso visual:**

```
Pull Request → Pestaña "Checks" → "ESB ACE12 Checklist Validation" → Ver detalles
```

Cada validación muestra:
- ✅ Marca verde si pasó exitosamente
- ❌ Marca roja si falló
- ⚠️ Advertencia si existe un problema no crítico

### 3.3 Cómo interpretarlos

Los mensajes siguen una estructura clara:

**Formato de mensaje de éxito:**
```
✅ Nombre de rama válido
✅ README.md encontrado
✅ Plantilla README válida
```

**Formato de mensaje de error:**
```
❌ Nombre de rama inválido: 'fix-bug'. 
   Debe comenzar con 'feature/', 'bugfix/', 'hotfix/' o 'release/'
```

**Formato de advertencia:**
```
⚠️ Token de configuración no provisto, saltando validación de grupos de ejecución
```

---

## 4. Interpretación de Resultados

### 4.1 Cuando la automatización está correctamente configurada

**Indicadores de éxito:**

1. **Todos los checks en verde**: Todas las validaciones pasaron correctamente
2. **Mensaje de resumen positivo**: 
   ```
   🎉 Todas las validaciones pasaron exitosamente
   ```
3. **Detalle de validaciones exitosas**:
   ```
   Resultados:
     - Nombre de rama: ✅
     - README existencia: ✅
     - README plantilla: ✅
     - Grupos de ejecución: ✅
     - Carpetas BD: ✅
     - Revisores y rutas: ✅
   ```

**Qué significa:** El Pull Request cumple con todos los estándares y puede proceder a revisión humana.

### 4.2 Cuando existen errores

**Indicadores de error:**

1. **Check en rojo (❌)**: Una o más validaciones fallaron
2. **Mensaje de resumen negativo**:
   ```
   ❌ Una o más validaciones fallaron
   ```
3. **Lista detallada de errores**:
   ```
   ❌ SE ENCONTRARON 3 ERROR(ES):
      1. Falta sección requerida: ## INFORMACIÓN DEL SERVICIO
      2. URLs con boc200 detectadas. Deben usar boc201
      3. Tabla Endpoint BUS debe tener al menos una fila para DESARROLLO
   ```

**Qué hacer:**
- Revise cada error listado
- Corrija los problemas en su repositorio local
- Haga commit y push de los cambios
- El Action se ejecutará automáticamente con el nuevo push
- Verifique que todos los checks pasen antes de solicitar revisión

### 4.3 Cuando todas las validaciones son correctas

**Estado final ideal:**

```
📊 RESUMEN DE VALIDACIÓN README.md

✅ VALIDACIONES EXITOSAS:
   ✓ Título principal encontrado y válido: ESB_ACE12_ServicioEjemplo
   ✓ Tabla 'Último despliegue' es válida
   ✓ Tabla DataPower Externo validada correctamente
   ✓ Tabla Endpoint BUS contiene los 3 ambientes requeridos
   ✓ La fila 'Consumidor' contiene valores
   ✓ Los servicios en README y .project coinciden correctamente

🎉 README.md CUMPLE CON TODOS LOS REQUISITOS
```

**Acción siguiente:** Puede proceder con confianza a solicitar revisión del Pull Request o realizar el merge según el flujo establecido.

---

## 5. Verificación de Automatización

### 5.1 Cómo saber si la automatización está presente en el repositorio

Para verificar que el Action está correctamente configurado en su repositorio:

**Opción 1: Verificar archivo de workflow**
1. Navegue a la carpeta `.github/workflows/` en su repositorio
2. Busque los archivos:
   - `checklist.yml` (workflow del Action)
3. Si existe, la automatización está configurada

**Opción 2: Verificar en la interfaz de GitHub**
1. Vaya a la pestaña **"Actions"** del repositorio
2. Busque el workflow llamado **"checklist"** o **"ESB ACE12 Checklist Validation"**
3. Si aparece en la lista, la automatización está activa

**Opción 3: Crear un Pull Request de prueba**
1. Cree un PR de prueba a develop, quality o main
2. Verifique que aparezca el check de validación en la sección "Checks"
3. Si aparece, la automatización está funcionando

### 5.2 Qué revisar para confirmar que está correctamente integrada

**Lista de verificación:**

- [ ] **Archivo de workflow existe**: `.github/workflows/checklist.yml`
- [ ] **Triggers configurados correctamente**: Se activa en PR hacia main, develop, quality
- [ ] **Permisos apropiados**: El workflow tiene acceso a `contents: read` y `pull-requests: read`
- [ ] **Tokens configurados**:
  - Token de GitHub (automático): `${{ github.token }}`
  - Token de configuración (opcional): `${{ secrets.CONFIG_REPO_TOKEN }}`
- [ ] **Ejecuta en eventos**: opened, synchronize, reopened, edited
- [ ] **Checks aparecen en PR**: Al crear un PR, aparecen las validaciones

**Validación de funcionamiento correcto:**

```
✓ El Action se ejecuta automáticamente al crear/actualizar PR
✓ Los resultados aparecen en la pestaña "Checks"
✓ Los errores se muestran claramente con mensajes descriptivos
✓ Las validaciones exitosas muestran checks verdes
✓ El PR no puede ser mergeado si las validaciones fallan (si está configurado)
```

---

## 6. Ejemplos de Escenarios Comunes

### Escenario 1: Primera vez configurando el Action
**Situación:** Agregando el Action a un repositorio nuevo

**Pasos:**
1. Crear carpeta `.github/workflows/` en la raíz del repositorio
2. Copiar el archivo `checklist.yml` del repositorio del Action
3. Hacer commit y push
4. Crear un PR de prueba
5. Verificar que el check aparece y se ejecuta

### Escenario 2: README con errores de formato
**Situación:** El Action reporta errores en la plantilla del README

**Mensaje típico:**
```
❌ Falta sección requerida: ## DOCUMENTACION
❌ La tabla 'Último despliegue' tiene celdas vacías
```

**Solución:**
1. Abrir el README.md
2. Agregar la sección faltante
3. Completar las celdas vacías con datos o "NA"
4. Guardar, hacer commit y push
5. Verificar que el check pasa

### Escenario 3: Grupos de ejecución desactualizados
**Situación:** Los grupos en el README no coinciden con la configuración central

**Mensaje típico:**
```
❌ Grupos en config que no están en README: grupo3, grupo4
```

**Solución:**
1. Revisar el archivo de configuración central en `ESB_ACE12_General_Configs`
2. Actualizar la sección "Procedimiento de despliegue" del README
3. Agregar los grupos faltantes después de "desplegar en los grupos de ejecución:"
4. Hacer commit y push
5. Verificar sincronización

---

## 7. Preguntas Frecuentes (FAQ)

**P: ¿Puedo omitir la validación del README temporalmente?**
R: Sí, usando el input `skip-readme-validation: 'true'` en la configuración del workflow. Sin embargo, esto no se recomienda para uso regular.

**P: ¿Qué hago si el Action falla por un problema de configuración?**
R: Contacte al equipo ESB (DRamirezM, cdgomez, acardenasm, CAARIZA) para revisar la configuración del Action y los tokens necesarios.

**P: ¿El Action valida el código fuente?**
R: No, solo valida la documentación (README.md), estructura del repositorio, nombres de rama y configuración de revisores.

**P: ¿Puedo personalizar las validaciones?**
R: Las validaciones siguen los estándares del equipo ESB. Para cambios, debe discutirse con el equipo y actualizarse el Action centralmente.

**P: ¿Qué pasa si mi servicio es diferente y no aplican todas las validaciones?**
R: Puede usar valores "NA" o "No Aplica" en las secciones del README que no sean relevantes para su servicio.

---

## 8. Contacto y Soporte

**Equipo ESB - Banco de Occidente**

**Revisores autorizados:**
- DRamirezM
- cdgomez
- acardenasm
- CAARIZA
- JJPARADA

**Para reportar problemas:**
1. Copie el mensaje de error completo del check
2. Incluya el link del Pull Request
3. Contacte al equipo ESB con esta información

**Documentación adicional:**
- Plantilla README estándar
- Guía de GitFlow
- Configuración central de grupos: `ESB_ACE12_General_Configs`

---

## 9. Glosario

| Término | Definición |
|---------|-----------|
| **Action** | Proceso automatizado que se ejecuta en GitHub |
| **Check** | Validación o verificación ejecutada por un Action |
| **Pull Request (PR)** | Solicitud para fusionar cambios de una rama a otra |
| **GitFlow** | Metodología de branching (feature/, bugfix/, hotfix/, release/) |
| **Grupos de ejecución** | Nodos del BUS donde se despliega el servicio |
| **README.md** | Archivo de documentación principal del repositorio |
| **Workflow** | Archivo YAML que define cuándo y cómo se ejecuta un Action |
| **Token** | Credencial de acceso para autenticación en GitHub API |

---

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Autor:** Banco de Occidente - ESB Team

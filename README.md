# ESB ACE12 Checklist Validation Action

Acción reutilizable de GitHub para validar repositorios de servicios ESB/ACE12 cumpliendo con estándares de documentación y configuración.

## 📌 Uso de la Acción

**Referencia oficial para uso:**
```yaml
uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
```

Esta es la nomenclatura estándar y oficial para invocar esta acción en tus workflows de GitHub Actions.

## 📚 Tabla de Contenidos

- [Características](#-características)
- [SECCIÓN 1: Cómo Llamar el Flujo desde Otros Repositorios](#-sección-1-cómo-llamar-el-flujo-desde-otros-repositorios)
  - [Uso Básico](#uso-básico)
  - [Parámetros de Entrada](#parámetros-de-entrada)
  - [Configuración de Secrets](#configuración-de-secrets)
  - [Ejemplo Completo](#ejemplo-completo)
  - [Outputs](#outputs)
- [SECCIÓN 2: Cómo Actualizar el Action](#-sección-2-cómo-actualizar-el-action)
  - [Requisitos Previos](#requisitos-previos)
  - [Proceso de Actualización](#proceso-de-actualización)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Mejores Prácticas](#mejores-prácticas)
- [Validaciones Incluidas](#-validaciones-incluidas)
- [Seguridad](#-seguridad)
- [Changelog](#-changelog)
- [Soporte](#-soporte)
- [Documentación Adicional](#documentación-adicional)

---

## 🚀 Características

- ✅ Validación consolidada de README y grupos de ejecución
- ✅ Revisiones de repositorio (nombre de rama, carpetas BD, revisores)
- ✅ Ejecutado en Node.js 20.x (compatible con 24.11.x cuando esté disponible en GitHub Actions)
- ✅ Acción reutilizable para usar desde cualquier repositorio
- ✅ Reducción de jobs para mejor rendimiento

---

## 📖 SECCIÓN 1: Cómo Llamar el Flujo desde Otros Repositorios

### Uso Básico

Para usar esta acción en tus repositorios de servicios ESB/ACE12, crea o actualiza el archivo `.github/workflows/checklist.yml`:

```yaml
name: checklist

on:
  pull_request:
    branches:
      - main
      - develop
      - quality
      - 'feature/**'
    types:
      - opened
      - synchronize
      - reopened
      - edited

jobs:
  # Job consolidado 1: Validación README y grupos de ejecución
  validacion_readme_y_grupos:
    name: Validación README y Grupos de Ejecución
    runs-on: ubuntu-latest
    steps:
      - name: Descargar código
        uses: actions/checkout@v4

      - name: Ejecutar validaciones
        uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          config-repo-token: ${{ secrets.ESB_ACE12_ORG_REPO_TOKEN }}

  # Job consolidado 2: Revisiones del repositorio
  revisiones_repositorio:
    name: Revisiones Repositorio
    runs-on: ubuntu-latest
    steps:
      - name: Descargar código
        uses: actions/checkout@v4

      - name: Validar nombre de rama
        uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Parámetros de Entrada

| Parámetro | Descripción | Requerido | Default |
|-----------|-------------|-----------|---------|
| `github-token` | Token de GitHub para acceso a la API | No | `${{ github.token }}` |
| `config-repo-token` | Personal Access Token con acceso al repositorio `ESB_ACE12_General_Configs` | No | - |
| `skip-readme-validation` | Omitir validación de README (útil para repositorios que no son servicios) | No | `false` |
| `valid-reviewers` | Lista separada por comas de revisores autorizados | No | `DRamirezM,cdgomez,acardenasm,CAARIZA` |

### Configuración de Secrets

La acción requiere el siguiente secret configurado en tu repositorio u organización:

1. **ESB_ACE12_ORG_REPO_TOKEN**: Personal Access Token con permisos de lectura en el repositorio `bocc-principal/ESB_ACE12_General_Configs`

#### Crear el Personal Access Token:

1. Ve a GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Dale un nombre descriptivo: `ESB_ACE12_Config_Reader`
4. Selecciona el scope: `repo` (Full control of private repositories)
5. Click en "Generate token"
6. Copia el token generado

#### Configurar el Secret:

**A nivel de organización (recomendado):**
```
Settings → Secrets and variables → Actions → New organization secret
Name: ESB_ACE12_ORG_REPO_TOKEN
Value: [tu_token]
Repository access: Selected repositories (incluir todos los repos ESB)
```

**A nivel de repositorio (alternativa):**
```
Repository Settings → Secrets and variables → Actions → New repository secret
Name: ESB_ACE12_ORG_REPO_TOKEN
Value: [tu_token]
```

### Ejemplo Completo

```yaml
name: checklist

on:
  pull_request:
    branches:
      - main
      - develop
      - quality
      - 'feature/**'
    types:
      - opened
      - synchronize
      - reopened
      - edited

jobs:
  validacion_readme_y_grupos:
    name: Validación README y Grupos de Ejecución
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validar README y Configuración
        uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          config-repo-token: ${{ secrets.ESB_ACE12_ORG_REPO_TOKEN }}
          skip-readme-validation: 'false'

  revisiones_repositorio:
    name: Revisiones Repositorio  
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validar Repositorio
        uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Outputs

La acción proporciona los siguientes outputs:

| Output | Descripción |
|--------|-------------|
| `validation-passed` | Boolean indicando si todas las validaciones pasaron |
| `results` | Objeto JSON con resultados detallados de cada validación |

Ejemplo de uso de outputs:

```yaml
- name: Validar
  id: validate
  uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}

- name: Mostrar resultados
  run: |
    echo "Validación pasó: ${{ steps.validate.outputs.validation-passed }}"
    echo "Resultados: ${{ steps.validate.outputs.results }}"
```

---

## 🔧 SECCIÓN 2: Cómo Actualizar el Action

Esta sección explica cómo mantener y actualizar la acción cuando se realizan cambios en el código.

### Requisitos Previos

Asegúrate de tener instalado:
- Node.js 20.x o superior (idealmente 24.11.x)
- npm (incluido con Node.js)
- @vercel/ncc (instalado como dev dependency)

### Proceso de Actualización

#### 1. Instalar Dependencias

Si es la primera vez o después de clonar el repositorio:

```bash
npm install
```

Esto instalará:
- `@actions/core`: ^1.10.0 - Utilidades para GitHub Actions
- `@actions/github`: ^6.0.0 - Cliente de la API de GitHub
- `@vercel/ncc`: ^0.38.1 - Compilador para crear un bundle único

#### 2. Realizar Cambios en el Código

Edita el archivo `index.js` con los cambios necesarios:

```bash
# Editar el código fuente
vim index.js

# O usar tu editor preferido
code index.js
```

#### 3. Compilar con ncc

Después de realizar cambios en `index.js`, **debes** compilar el código:

```bash
npm run build
```

Este comando ejecuta:
```bash
ncc build index.js -o dist
```

Esto genera:
- `dist/index.js` - Bundle compilado con todas las dependencias
- `dist/README.md` - Documentación del bundle

**⚠️ IMPORTANTE**: El archivo `dist/index.js` **DEBE** ser commiteado al repositorio. GitHub Actions ejecuta este archivo compilado, no el `index.js` original.

#### 4. Verificar los Cambios

```bash
# Verificar qué archivos cambiaron
git status

# Deberías ver:
# - index.js (si lo modificaste)
# - dist/index.js (siempre después de compilar)
# - package.json o package-lock.json (si cambiaste dependencias)
```

#### 5. Commit y Push

```bash
# Agregar archivos
git add index.js dist/index.js

# Si cambiaste dependencias, también agregar:
git add package.json package-lock.json

# Commit
git commit -m "feat: actualizar validaciones de checklist"

# Push
git push origin main
```

### Flujo Completo de Actualización

```bash
# 1. Instalar/actualizar dependencias globales (una sola vez)
npm install -g @vercel/ncc

# 2. Instalar dependencias del proyecto
npm install

# 3. Hacer cambios en el código
vim index.js

# 4. Compilar
npm run build

# 5. Probar localmente (opcional)
node dist/index.js

# 6. Commit y push
git add index.js dist/
git commit -m "Descripción de los cambios"
git push
```

### Estructura del Proyecto

```
MigracionNodeActions/
├── .github/
│   └── workflows/
│       └── checklist.yml          # Workflow para testing
├── dist/                           # ⚠️ DEBE estar en git
│   ├── index.js                   # Bundle compilado (ejecutado por GH Actions)
│   └── README.md                  # Info del bundle
├── index.js                        # Código fuente principal
├── action.yml                      # Metadata de la acción
├── package.json                    # Dependencias y scripts
├── package-lock.json              # Lock file de dependencias
└── README.md                      # Esta documentación
```

### Scripts Disponibles

Definidos en `package.json`:

```json
{
  "scripts": {
    "build": "ncc build index.js -o dist",
    "test": "node index.js"
  }
}
```

- `npm run build`: Compila el código fuente a `dist/index.js`
- `npm test`: Ejecuta el código directamente (para testing local)

### Ejemplo de package.json

```json
{
  "name": "esb-ace12-checklist-action",
  "version": "1.0.0",
  "description": "Reusable GitHub Action for validating ESB/ACE12 service repositories",
  "main": "index.js",
  "scripts": {
    "build": "ncc build index.js -o dist",
    "test": "node index.js"
  },
  "keywords": [
    "github-actions",
    "esb",
    "ace12",
    "validation"
  ],
  "author": "Banco de Occidente - ESB Team",
  "license": "UNLICENSED",
  "dependencies": {
    "@actions/core": "^1.10.0",
    "@actions/github": "^6.0.0"
  },
  "devDependencies": {
    "@vercel/ncc": "^0.38.1"
  }
}
```

### Troubleshooting

#### Error: "Cannot find module '@actions/core'"

**Solución**: Ejecutar `npm install` antes de compilar.

```bash
npm install
npm run build
```

#### Error: "ncc: command not found"

**Solución**: Instalar ncc como dependencia de desarrollo.

```bash
npm install --save-dev @vercel/ncc
npm run build
```

#### El workflow falla con "Error: Cannot find module..."

**Causa**: No se compiló el código después de hacer cambios, o no se hizo commit de `dist/index.js`.

**Solución**:
```bash
npm run build
git add dist/
git commit -m "build: update compiled action"
git push
```

#### Los cambios en index.js no se reflejan

**Causa**: Olvidaste compilar con `npm run build`.

**Solución**: Siempre ejecutar `npm run build` después de modificar `index.js`.

### Mejores Prácticas

1. **Siempre compilar antes de commit**
   ```bash
   npm run build && git add dist/
   ```

2. **Usar versionado semántico**
   - Cambios mayores: `v2.0.0`
   - Nuevas funcionalidades: `v1.1.0`
   - Correcciones: `v1.0.1`

3. **Probar localmente antes de push**
   ```bash
   npm test
   ```

4. **Documentar cambios importantes**
   - Actualizar este README
   - Agregar entry en CHANGELOG (si existe)
   - Comentar en el código

5. **No ignorar dist/ en .gitignore**
   - GitHub Actions necesita `dist/index.js`
   - Asegurar que `.gitignore` contiene: `!dist/`

### Migración de Node.js

Actualmente la acción usa `node20` (especificado en `action.yml`):

```yaml
runs:
  using: 'node20'
  main: 'dist/index.js'
```

Cuando GitHub Actions soporte Node.js 24.11.x oficialmente:

1. Actualizar `action.yml`:
   ```yaml
   runs:
     using: 'node24'  # Cuando esté disponible
     main: 'dist/index.js'
   ```

2. Actualizar `package.json` engines (opcional):
   ```json
   "engines": {
     "node": ">=24.11.0"
   }
   ```

3. Recompilar:
   ```bash
   npm run build
   git add action.yml dist/
   git commit -m "chore: migrate to Node.js 24"
   git push
   ```

---

## 📋 Validaciones Incluidas

La acción consolida las siguientes validaciones:

### Job 1: Validación README y Grupos de Ejecución

1. ✅ **README existe**: Verifica la presencia de README.md en la raíz
2. ✅ **Plantilla README**: Valida estructura y secciones requeridas
3. ✅ **Grupos de ejecución**: Sincroniza con configuración central

### Job 2: Revisiones Repositorio

1. ✅ **Nombre de rama**: Formato GitFlow (feature/bugfix/hotfix/release)
2. ✅ **Carpetas BD**: Previene inclusión de carpetas sensibles
3. ✅ **Revisores**: Valida revisores autorizados según ruta de merge

---

## 🔒 Seguridad

- No incluir credenciales en el código
- Usar secrets para tokens sensibles
- El token `ESB_ACE12_ORG_REPO_TOKEN` solo necesita permisos de lectura
- Los tokens se manejan de forma segura a través de GitHub Secrets

---

## 📝 Changelog

### v1.1.1 (2024-12) - Execution Groups Validation Fix
- 🔧 **FIXED**: Corrected `action.yml` duplicate `main:` entry causing source file to run instead of compiled bundle
- 🔧 **FIXED**: Improved error handling for execution groups validation to report failures correctly
- ✨ Separated try-catch blocks for independent validations (README, template, execution groups)
- ✨ Enhanced error messages to clearly identify which specific validation failed
- 📊 Execution groups validation now works correctly with `ESB_ACE12_ORG_REPO_TOKEN`

### v1.1.0 (2024-12) - Comprehensive Validation Feedback Restoration
- 🔧 **FIXED**: Restored comprehensive validation feedback lost in Node.js migration
- ✨ Added detailed progress messages for each validation section
- ✨ Show ALL errors at once instead of stopping at first error
- ✨ Comprehensive summary with error count and list
- ✨ Verbose logging matching bash version (✅/❌ indicators)
- 🎯 GitHub Actions annotations (::notice, ::error) used consistently
- 📊 Clear validation summary showing successful checks and all errors

### v1.0.0 (2024-11)
- ✨ Migración a Node.js 20.x (preparado para 24.11.x)
- ✨ Acción reutilizable con @actions/core y @actions/github
- ✨ Consolidación de jobs (de 6 a 2 jobs principales)
- ✨ Bundle con @vercel/ncc para distribución
- ✨ Documentación completa de uso y actualización

---

## 📞 Soporte

Para preguntas o problemas:
- Crear un issue en este repositorio
- Contactar al equipo ESB/ACE12

---

## 📄 Licencia

UNLICENSED - Uso interno Banco de Occidente

---

## 📚 Documentación Adicional

### Guías Relacionadas

- **[CHECKLIST.md](./CHECKLIST.md)**: Documentación técnica completa de las validaciones del workflow
  - Descripción detallada de cada validación
  - Reglas de negocio implementadas
  - Ejemplos de casos válidos e inválidos
  - Guía de troubleshooting completa
  - Mejores prácticas para desarrolladores

### Estructura de Documentación

Este repositorio contiene la siguiente documentación organizada:

1. **README.md** (este archivo): Guía de uso de la acción para usuarios
2. **CHECKLIST.md**: Documentación técnica detallada de validaciones
3. **action.yml**: Definición de la acción de GitHub
4. **dist/README.md**: Documentación del bundle compilado

### Ejemplo de README de Servicio

Para ver un ejemplo de cómo debe estructurarse el README.md de un servicio ESB/ACE12 que será validado por esta acción, consulta la documentación en CHECKLIST.md, específicamente:
- Sección "Reglas Específicas por Sección"
- Sección "Ejemplos de Validación"

---

## 🔗 Enlaces Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js GitHub Actions](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- Repositorio de configuración central: `bocc-principal/ESB_ACE12_General_Configs`

---

## 📋 Referencia Rápida

### Para Usar la Acción en tu Repositorio

Copia y pega en tu archivo `.github/workflows/checklist.yml`:

```yaml
name: checklist

on:
  pull_request:
    branches: [main, develop, quality, 'feature/**']
    types: [opened, synchronize, reopened, edited]

jobs:
  validacion_readme_y_grupos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bocc-principal/ESB_ACE12_Validate_Readme_Action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          config-repo-token: ${{ secrets.ESB_ACE12_ORG_REPO_TOKEN }}
```

**Nomenclatura oficial**: `bocc-principal/ESB_ACE12_Validate_Readme_Action@main`

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0.0  
**Mantenido por**: Equipo ESB/ACE12 - Banco de Occidente

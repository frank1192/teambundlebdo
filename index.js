const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

/**
 * Get the workspace directory
 * In GitHub Actions, use GITHUB_WORKSPACE; otherwise use current directory
 */
function getWorkspaceDir() {
  return process.env.GITHUB_WORKSPACE || process.cwd();
}

/**
 * Main entry point for the ESB/ACE12 Checklist Action
 * This action validates ESB/ACE12 service repositories for compliance
 */
async function run() {
  try {
    // Get inputs
    const token = core.getInput('github-token') || process.env.GITHUB_TOKEN;
    const configRepoToken = core.getInput('config-repo-token');
    const skipReadmeValidation = core.getInput('skip-readme-validation') === 'true';
    
    const workspaceDir = getWorkspaceDir();
    
    core.info('🚀 Starting ESB/ACE12 Checklist Validation');
    core.info(`Node.js version: ${process.version}`);
    core.info(`Workspace directory: ${workspaceDir}`);
    
    // Log token status (without exposing values)
    core.info(`GitHub token: ${token ? '✅ Provided' : '❌ Not provided'}`);
    core.info(`Config repo token: ${configRepoToken ? '✅ Provided' : '❌ Not provided (validación de grupos se omitirá)'}`);
    core.info(`Skip README validation: ${skipReadmeValidation}`);
    core.info('');
    
    // Get context
    const context = github.context;
    const { payload } = context;
    
    // Log context information
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.info(`Event: ${context.eventName}`);
    
    if (payload.pull_request) {
      core.info(`PR #${payload.pull_request.number}: ${payload.pull_request.title}`);
      core.info(`Branch: ${payload.pull_request.head.ref} → ${payload.pull_request.base.ref}`);
    }
    
    // Validation results
    const results = {
      branchName: null,
      readmeExistence: null,
      readmeTemplate: null,
      bdFolders: null,
      executionGroups: null,
      reviewersAndRoutes: null
    };
    
    // Job 1: Validate branch name
    core.startGroup('📋 Validación: Nombre de rama');
    try {
      results.branchName = await validateBranchName(payload);
      core.info('✅ Nombre de rama válido');
    } catch (error) {
      core.error(`❌ ${error.message}`);
      results.branchName = false;
    }
    core.endGroup();
    
    // Job 2: Validate README existence and template (grouped)
    if (!skipReadmeValidation) {
      core.startGroup('📄 Validación: README y Grupos de Ejecución');
      
      // Check README exists
      try {
        const readmeExists = await validateReadmeExistence(workspaceDir);
        results.readmeExistence = readmeExists;
        core.info('✅ README.md encontrado');
      } catch (error) {
        core.error(`❌ Error en validación de existencia README: ${error.message}`);
        results.readmeExistence = false;
      }
      
      // Validate README template
      if (results.readmeExistence) {
        try {
          results.readmeTemplate = await validateReadmeTemplate(workspaceDir);
          core.info('✅ Plantilla README válida');
        } catch (error) {
          core.error(`❌ Error en validación de plantilla README: ${error.message}`);
          if (error.stack) {
            core.debug(error.stack);
          }
          results.readmeTemplate = false;
        }
      }
      
      // Validate execution groups - INDEPENDIENTE de si la plantilla falló
      if (results.readmeExistence && configRepoToken) {
        try {
          results.executionGroups = await validateExecutionGroups(configRepoToken, workspaceDir);
          core.info('✅ Grupos de ejecución coinciden');
        } catch (error) {
          core.error(`❌ Error en validación de grupos de ejecución: ${error.message}`);
          if (error.stack) {
            core.debug(error.stack);
          }
          results.executionGroups = false;
        }
      } else if (!configRepoToken) {
        core.warning('⚠️  Token de configuración no provisto, saltando validación de grupos de ejecución');
        results.executionGroups = true; // Mark as passed if skipped
      }
      
      core.endGroup();
    } else {
      core.info('⏭️  Validación de README omitida (skip-readme-validation=true)');
    }
    
    // Job 3: Repository reviews (grouped)
    core.startGroup('🔍 Revisiones: Repositorio');
    
    // Validate no BD folders
    try {
      results.bdFolders = await validateNoBDFolders(workspaceDir);
      core.info('✅ No se encontraron carpetas BD');
    } catch (error) {
      core.error(`❌ ${error.message}`);
      results.bdFolders = false;
    }
    
    // Validate reviewers and routes
    if (payload.pull_request) {
      try {
        results.reviewersAndRoutes = await validateReviewersAndRoutes(payload, token);
        core.info('✅ Revisores y rutas válidos');
      } catch (error) {
        core.error(`❌ ${error.message}`);
        results.reviewersAndRoutes = false;
      }
    }
    
    core.endGroup();
    
    // Summary
    core.startGroup('📊 Resumen de Validaciones');
    const allPassed = Object.values(results).every(r => r !== false);
    
    core.info('Resultados:');
    core.info(`  - Nombre de rama: ${results.branchName !== false ? '✅' : '❌'}`);
    if (!skipReadmeValidation) {
      core.info(`  - README existencia: ${results.readmeExistence !== false ? '✅' : '❌'}`);
      
      // README template and groups only show if README exists
      if (results.readmeExistence === false) {
        core.info(`  - README plantilla: ⏭️  (omitida - README no existe)`);
        core.info(`  - Grupos de ejecución: ⏭️  (omitida - README no existe)`);
      } else {
        core.info(`  - README plantilla: ${results.readmeTemplate !== false ? '✅' : '❌'}`);
        core.info(`  - Grupos de ejecución: ${results.executionGroups !== false ? '✅' : '❌'}`);
      }
    }
    core.info(`  - Carpetas BD: ${results.bdFolders !== false ? '✅' : '❌'}`);
    core.info(`  - Revisores y rutas: ${results.reviewersAndRoutes !== false ? '✅' : '❌'}`);
    
    if (allPassed) {
      core.info('🎉 Todas las validaciones pasaron exitosamente');
    } else {
      core.setFailed('❌ Una o más validaciones fallaron');
    }
    core.endGroup();
    
    // Set outputs
    core.setOutput('validation-passed', allPassed);
    core.setOutput('results', JSON.stringify(results));
    
  } catch (error) {
    core.setFailed(`Error en la ejecución: ${error.message}`);
    core.debug(error.stack);
  }
}

/**
 * Validate branch name follows GitFlow convention
 */
async function validateBranchName(payload) {
  if (!payload.pull_request) {
    return true; // Not a PR event
  }
  
  const branchName = payload.pull_request.head.ref;
  // Allow main branches (develop, quality, main) and GitFlow branches
  const pattern = /^(feature|bugfix|hotfix|release)\/[A-Za-z0-9._-]+$|^(develop|quality|main)$/;
  
  if (!pattern.test(branchName)) {
    throw new Error(`Nombre de rama inválido: '${branchName}'. Debe comenzar con 'feature/', 'bugfix/', 'hotfix/', 'release/' o ser 'develop', 'quality', 'main'`);
  }
  
  return true;
}

/**
 * Validate README.md exists
 */
async function validateReadmeExistence(workspaceDir = process.cwd()) {
  const readmePath = path.join(workspaceDir, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    throw new Error('No se encontró el archivo README.md en la raíz del repositorio');
  }
  
  return true;
}

/**
 * Validate README template with comprehensive feedback
 * Validates all sections and subsections, collecting all errors before failing
 */
async function validateReadmeTemplate(workspaceDir = process.cwd()) {
  const readmePath = path.join(workspaceDir, 'README.md');
  const content = fs.readFileSync(readmePath, 'utf8');
  
  // Collect notices and errors to provide comprehensive feedback
  const notices = [];
  const errors = [];
  
  core.info('🔍 Iniciando validación de estructura del README.md');

  // Helper: get section content between a header and the next '## ' header
  function getSection(headerRegex) {
    const re = new RegExp(headerRegex, 'mi');
    const start = content.search(re);
    if (start === -1) return null;
    // slice from start to end
    const tail = content.slice(start);
    // find next '## ' header after the first newline
    const m = tail.match(/\n##\s+/m);
    if (m && m.index !== undefined) {
      return tail.slice(0, m.index).trim();
    }
    return tail.trim();
  }

  // Helper: get subsection (### Name) content until next ### or ##
  function getSubsection(subHeaderRegex) {
    const re = new RegExp(subHeaderRegex, 'mi');
    const start = content.search(re);
    if (start === -1) return null;
    const tail = content.slice(start);
    // Find first newline to skip the header line itself (like awk's 'next')
    const firstNewline = tail.indexOf('\n');
    if (firstNewline === -1) return '';
    const contentAfterHeader = tail.slice(firstNewline + 1);
    // Find next subsection or section
    const m = contentAfterHeader.match(/^(###\s+|##\s+)/m);
    if (m && m.index !== undefined) {
      return contentAfterHeader.slice(0, m.index).trim();
    }
    return contentAfterHeader.trim();
  }

  // ===== 1. VALIDACIÓN DE TÍTULO PRINCIPAL =====
  core.info('✅ Validando título principal del Servicio \'# ESB_...\'');
  
  const titleMatch = content.match(/^#\s*ESB_(.+)$/m);
  if (!titleMatch || !titleMatch[1] || titleMatch[1].trim() === '' || /^[_-]+\.?$/.test(titleMatch[1].trim())) {
    core.error('❌ El título no puede ser solo "ESB_" o "ESB_" seguido solo de guiones. Debe agregar un nombre descriptivo del repositorio después de ESB_');
    errors.push('El título no puede ser solo "ESB_" o "ESB_" seguido solo de guiones');
  } else {
    const cleanTitle = titleMatch[0].replace(/^#\s*/, '');
    core.info(`::notice title=Validación de README.md::✅ Título principal encontrado y válido: ${cleanTitle}`);
    notices.push(`Título principal encontrado y válido: ${cleanTitle}`);
  }

  // ===== 2. VALIDACIÓN DE SECCIONES REQUERIDAS (QUICK CHECK) =====
  const requiredSections = [
    '## INFORMACIÓN DEL SERVICIO',
    '## Procedimiento de despliegue',
    '## ACCESO AL SERVICIO',
    '## CANALES - APLICACIONES',
    '## DEPENDENCIAS',
    '## DOCUMENTACION',
    '## SQL'
  ];

  for (const section of requiredSections) {
    if (!content.match(new RegExp('^' + section.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'mi'))) {
      core.error(`❌ Falta sección requerida: ${section}`);
      errors.push(`Falta sección requerida: ${section}`);
    }
  }

  // ===== 3. VALIDACIÓN DE URLs boc200 (CRÍTICO) =====
  if (content.includes('boc200')) {
    core.error('❌ URLs con boc200 detectadas. Los endpoints de DataPower deben comenzar con \'https://boc201\' (NO \'https://boc200\')');
    errors.push('URLs con boc200 detectadas. Deben usar boc201');
  }

  // ===== 4. INFORMACIÓN DEL SERVICIO =====
  core.info('✅ Validando sección \'## INFORMACIÓN DEL SERVICIO\'');
  
  const infoServicio = getSection('^##\\s*INFORMACIÓN DEL SERVICIO');
  if (!infoServicio) {
    core.error('❌ Falta el encabezado \'## INFORMACIÓN DEL SERVICIO\'');
    errors.push("Falta el encabezado '## INFORMACIÓN DEL SERVICIO'");
  } else {
    core.info('::notice title=Validación de README.md::Encabezado \'## INFORMACIÓN DEL SERVICIO\' encontrado');
    
    // extract lines after header until first ###
    const afterHeader = infoServicio.replace(/^##.*\n?/, '');
    const beforeSub = afterHeader.split(/^### /m)[0].trim();
    if (!beforeSub) {
      core.error('❌ La sección \'## INFORMACIÓN DEL SERVICIO\' no contiene información descriptiva antes de las subsecciones. Debe agregar una descripción del servicio antes de \'### Último despliegue\'.');
      errors.push("La sección '## INFORMACIÓN DEL SERVICIO' no contiene información descriptiva antes de las subsecciones.");
    } else {
      core.info('::notice title=Validación de README.md::✅ La sección \'## INFORMACIÓN DEL SERVICIO\' contiene información descriptiva');
      notices.push("La sección '## INFORMACIÓN DEL SERVICIO' contiene información descriptiva");
    }

    // ===== 4.1 Subsección Último despliegue/despliege =====
    core.info('✅ Validando subsección \'### Último despliegue\'');
    
    const ultimo = getSubsection('^###\\s*[UÚ]ltimo desplie(gue|ge)');
    if (!ultimo) {
      core.error('❌ Falta subsección \'### Último despliegue\' (o \'### Último despliege\' o sin tilde) en la sección \'INFORMACIÓN DEL SERVICIO\'');
      errors.push("Falta subsección '### Último despliegue' (o '### Último despliege' o sin tilde) en la sección 'INFORMACIÓN DEL SERVICIO'");
    } else {
      core.info('::notice title=Validación de README.md::Subsección \'### Último despliegue/despliege\' encontrada');
      notices.push("Subsección '### Último despliegue/despliege' encontrada");
      // look for table header
      if (/\|\s*CQ\s*\|\s*JIRA\s*\|\s*Fecha\s*\|/i.test(ultimo)) {
        core.info('::notice title=Validación de README.md::✅ Encabezado de tabla \'Último despliegue\' encontrado');
        notices.push("Encabezado de tabla 'Último despliegue' encontrado");
        
        // find first data row after separator line with ---
        const lines = ultimo.split(/\r?\n/);
        let dataRow = null;
        for (let i = 0; i < lines.length; i++) {
          if (/^\|[-\s|:]+$/.test(lines[i])) {
            // next non-empty table row
            for (let j = i + 1; j < lines.length; j++) {
              if (/^\|/.test(lines[j])) {
                dataRow = lines[j];
                break;
              }
            }
            break;
          }
        }
        if (!dataRow) {
          core.error('❌ La tabla \'Último despliegue\' no tiene fila de datos. Debe incluir al menos una fila con valores o \'NA\' en cada columna.');
          errors.push("La tabla 'Último despliegue' no tiene fila de datos. Debe incluir al menos una fila con valores o 'NA' en cada columna.");
        } else {
          // split cells
          const cells = dataRow.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
          const empty = cells.some(c => c === '');
          if (empty) {
            core.error('❌ La tabla \'Último despliegue\' tiene celdas vacías en la fila de datos. Si no hay valor, debe colocarse \'NA\' en cada columna (CQ, JIRA, Fecha).');
            errors.push("La tabla 'Último despliegue' tiene celdas vacías en la fila de datos. Si no hay valor, debe colocarse 'NA' en cada columna (CQ, JIRA, Fecha).");
          } else {
            core.info('::notice title=Validación de README.md::✅ La tabla \'Último despliegue\' es válida (todas las celdas tienen valores)');
            notices.push("La tabla 'Último despliegue' es válida (todas las celdas tienen valores)");
          }
        }
      } else {
        core.error('❌ La tabla \'Último despliegue\' no tiene el formato correcto. Debe incluir el encabezado: |CQ |JIRA |Fecha|');
        errors.push("La tabla 'Último despliegue' no tiene el formato correcto. Debe incluir el encabezado: |CQ |JIRA |Fecha|");
      }
    }
  }

  // ===== 5. PROCEDIMIENTO DE DESPLIEGUE =====
  core.info('✅ Validando sección \'## Procedimiento de despliegue\'');
  
  const procedimiento = getSection('^##\\s*Procedimiento de despliegue');
  if (!procedimiento) {
    core.error('❌ No se encontró el encabezado \'## Procedimiento de despliegue\'');
    errors.push("No se encontró el encabezado '## Procedimiento de despliegue'");
  } else {
    core.info('::notice title=Validación de README.md::Encabezado \'## Procedimiento de despliegue\' encontrado');
    
    const body = procedimiento.replace(/^##.*\n?/, '').trim();
    if (!body) {
      core.error('❌ La sección \'## Procedimiento de despliegue\' está vacía. Agrega instrucciones de despliegue debajo del encabezado.');
      errors.push("La sección '## Procedimiento de despliegue' está vacía. Agrega instrucciones de despliegue debajo del encabezado.");
    } else {
      core.info('::notice title=Validación de README.md::✅ La sección \'## Procedimiento de despliegue\' contiene contenido');
      notices.push("La sección '## Procedimiento de despliegue' contiene contenido");
    }
  }

  // ===== 6. ACCESO AL SERVICIO =====
  core.info('✔️ Validando sección \'## ACCESO AL SERVICIO\'');
  
  const acceso = getSection('^##\\s*ACCESO AL SERVICIO');
  if (!acceso) {
    core.error('❌ Falta sección \'ACCESO AL SERVICIO\'');
    errors.push("Falta sección 'ACCESO AL SERVICIO'");
  } else {
    core.info('::notice title=Validación de README.md::Sección \'ACCESO AL SERVICIO\' válida');
    notices.push("Sección 'ACCESO AL SERVICIO' válida");
    
    // ===== 6.1. DataPower Externo e Interno =====
    core.info('✔️ Validando subsecciones DataPower Externo/Interno');
    
    const dpExterno = getSubsection('^###\\s*DataPower Externo');
    const dpInterno = getSubsection('^###\\s*DataPower Interno');

    const hasExterno = !!dpExterno;
    const hasInterno = !!dpInterno;

    const isOnlyNA = (txt) => {
      if (!txt) return false;
      // Remove HTML tags, markdown elements, and whitespace to check if content is only NA/No Aplica or specific texts
      const clean = txt
        .replace(/<[^>]+>/g, '') // Remove HTML tags like <br>
        .replace(/\*\*/g, '')     // Remove bold markdown
        .replace(/\r?\n/g, ' ')   // Replace newlines with space
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();
      return /^(N\s*\/?\s*A|No\s+Aplica|no\s+expuesto\s+en\s+DP\s+(Interno|Externo))$/i.test(clean);
    };

    function extractTableRows(sectionText) {
      if (!sectionText) return [];
      const lines = sectionText.split(/\r?\n/);
      const rows = [];
      let inTable = false;
      for (const line of lines) {
        if (/^\|---/.test(line)) { inTable = true; continue; }
        if (inTable && /^\|/.test(line)) { rows.push(line); }
      }
      return rows;
    }

    function validateDatapowerTable(sectionName, sectionText, isExterno) {
      core.info(`✔️ Validando contenido de tabla ${sectionName}`);
      
      const rows = extractTableRows(sectionText);
      if (rows.length === 0) {
        core.error(`❌ No se encontraron filas de datos en tabla ${sectionName}. Debe contener al menos una fila con datos o valores 'NA'.`);
        errors.push(`No se encontraron filas de datos en tabla ${sectionName}. Debe contener al menos una fila con datos o valores 'NA'.`);
        return;
      }
      let all_na = true;
      let has_des = false, has_cal = false, has_prd = false;
      let has_des_real = false, has_cal_real = false, has_prd_real = false;
      for (const row of rows) {
        const cols = row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
        const ambiente = cols[0] || '';  // AMBIENTE es la primera columna (índice 0)
        const tipoComponente = cols[1] || ''; // TIPO COMPONENTE es la segunda columna
        const nombreWSP = cols[2] || ''; // NOMBRE WSP O MPG es la tercera columna
        const datapower = cols[3] || ''; // DATAPOWER es la cuarta columna (índice 3)
        const endpoint = cols[4] || '';  // ENDPOINT es la quinta columna (índice 4)
        const rowContent = cols.join(' ');
        if (!/^\s*(DESARROLLO|CALIDAD|PRODUCCI[OÓ]?N)/i.test(ambiente)) continue;
        if (!/^(DESARROLLO|CALIDAD|PRODUCCI[OÓ]?N)/i.test(ambiente)) continue;
        
        // Check if this is a N/A row (all values are N/A, NA, or Pendiente)
        const isNARow = /^(N\/?A|NA|Pendiente)$/i.test(tipoComponente) && 
                        /^(N\/?A|NA|Pendiente)$/i.test(nombreWSP) && 
                        /^(N\/?A|NA|Pendiente)$/i.test(datapower) && 
                        /^(N\/?A|NA|Pendiente)$/i.test(endpoint);
        
        // Marcar que existe el ambiente (aunque sea N/A)
        if (/^DESARROLLO/i.test(ambiente)) { has_des = true; if (!isNARow) has_des_real = true; }
        if (/^CALIDAD/i.test(ambiente)) { has_cal = true; if (!isNARow) has_cal_real = true; }
        if (/^PRODUCCI[OÓ]?N/i.test(ambiente)) { has_prd = true; if (!isNARow) has_prd_real = true; }
        
        if (!isNARow) {
          all_na = false;
          // perform validations per ambiente - skip if NA or Pendiente
          if (/^DESARROLLO/i.test(ambiente)) {
            if (datapower && !/^(N\/A|NA|Pendiente)$/i.test(datapower) && !/^BODP.*DEV$/i.test(datapower)) {
              core.error(`❌ Error en ${sectionName}: Datapower en DESARROLLO debe comenzar con BODP y terminar con DEV. Encontrado: ${datapower}`);
              errors.push(`Datapower en DESARROLLO debe comenzar con BODP y terminar con DEV. Encontrado: ${datapower}`);
            }
            if (endpoint && !/^(N\/A|NA|Pendiente)$/i.test(endpoint) && !/^https:\/\/boc201\.des\.app\.bancodeoccidente\.net/i.test(endpoint)) {
              core.error(`❌ Error en ${sectionName}: Endpoint en DESARROLLO debe comenzar con https://boc201.des.app.bancodeoccidente.net Encontrado: ${endpoint}`);
              errors.push(`Endpoint en DESARROLLO debe comenzar con https://boc201.des.app.bancodeoccidente.net Encontrado: ${endpoint}`);
            }
          }
          if (/^CALIDAD/i.test(ambiente)) {
            if (datapower && !/^(N\/A|NA|Pendiente)$/i.test(datapower) && !/^BODP.*QAS$/i.test(datapower)) {
              core.error(`❌ Error en ${sectionName}: Datapower en CALIDAD debe comenzar con BODP y terminar con QAS. Encontrado: ${datapower}`);
              errors.push(`Datapower en CALIDAD debe comenzar con BODP y terminar con QAS. Encontrado: ${datapower}`);
            }
            if (endpoint && !/^(N\/A|NA|Pendiente)$/i.test(endpoint)) {
              if (isExterno) {
                if (!/^https:\/\/boc201\.tesdmz\.app\.bancodeoccidente\.net/i.test(endpoint)) {
                  core.error(`❌ Error en ${sectionName} (Externo): Endpoint en CALIDAD debe comenzar con https://boc201.tesdmz.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                  errors.push(`Endpoint en CALIDAD (Externo) debe comenzar con https://boc201.tesdmz.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                }
              } else {
                if (!/^https:\/\/boc201\.tesint\.app\.bancodeoccidente\.net/i.test(endpoint)) {
                  core.error(`❌ Error en ${sectionName} (Interno): Endpoint en CALIDAD debe comenzar con https://boc201.tesint.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                  errors.push(`Endpoint en CALIDAD (Interno) debe comenzar con https://boc201.tesint.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                }
              }
            }
          }
          if (/^PRODUCCI[OÓ]?N/i.test(ambiente)) {
            if (datapower && !/^(N\/A|NA|Pendiente)$/i.test(datapower) && !/^BODP.*PRD$/i.test(datapower)) {
              core.error(`❌ Error en ${sectionName}: Datapower en PRODUCCION debe comenzar con BODP y terminar con PRD. Encontrado: ${datapower}`);
              errors.push(`Datapower en PRODUCCION debe comenzar con BODP y terminar con PRD. Encontrado: ${datapower}`);
            }
            if (endpoint && !/^(N\/A|NA|Pendiente)$/i.test(endpoint)) {
              if (isExterno) {
                if (!/^https:\/\/boc201\.prddmz\.app\.bancodeoccidente\.net/i.test(endpoint)) {
                  core.error(`❌ Error en ${sectionName} (Externo): Endpoint en PRODUCCION debe comenzar con https://boc201.prddmz.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                  errors.push(`Endpoint en PRODUCCION (Externo) debe comenzar con https://boc201.prddmz.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                }
              } else {
                if (!/^https:\/\/boc201\.prdint\.app\.bancodeoccidente\.net/i.test(endpoint)) {
                  core.error(`❌ Error en ${sectionName} (Interno): Endpoint en PRODUCCION debe comenzar con https://boc201.prdint.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                  errors.push(`Endpoint en PRODUCCION (Interno) debe comenzar con https://boc201.prdint.app.bancodeoccidente.net Encontrado: ${endpoint}`);
                }
              }
            }
          }
        }
      }
      // Validar que existan los 3 ambientes (pueden ser N/A)
      if (!has_des) {
        core.error(`❌ Tabla ${sectionName} debe tener una fila para DESARROLLO (puede ser N/A)`);
        errors.push(`Tabla ${sectionName} debe tener una fila para DESARROLLO (puede ser N/A)`);
      }
      if (!has_cal) {
        core.error(`❌ Tabla ${sectionName} debe tener una fila para CALIDAD (puede ser N/A)`);
        errors.push(`Tabla ${sectionName} debe tener una fila para CALIDAD (puede ser N/A)`);
      }
      if (!has_prd) {
        core.error(`❌ Tabla ${sectionName} debe tener una fila para PRODUCCION (puede ser N/A)`);
        errors.push(`Tabla ${sectionName} debe tener una fila para PRODUCCION (puede ser N/A)`);
      }
      if (all_na) {
        core.info(`::notice title=Validación de README.md::Tabla ${sectionName} contiene solo valores NA (válido)`);
        notices.push(`Tabla ${sectionName} contiene solo valores NA (válido)`);
      } else {
        core.info(`::notice title=Validación de README.md::✅ Tabla ${sectionName} validada correctamente`);
        notices.push(`Tabla ${sectionName} validada correctamente`);
      }
    }

    if (!hasExterno && !hasInterno) {
      core.error('❌ Falta subsección DataPower Externo o Interno');
      errors.push('Falta subsección DataPower Externo o Interno');
    } else {
      if (hasExterno) {
        if (isOnlyNA(dpExterno)) {
          core.info('::notice title=Validación de README.md::DataPower Externo contiene solo \'NA\'/\'N/A\'/\'No Aplica\' (válido - sin tabla)');
          notices.push("DataPower Externo contiene solo 'NA'/'N/A'/'No Aplica' (válido - sin tabla)");
        } else {
          validateDatapowerTable('DataPower Externo', dpExterno, true);
        }
      } else {
        core.warning('⚠️  Recomendación: No se encontró subsección \'DataPower Externo\'. Si el servicio requiere apuntamiento externo, agregarlo.');
      }
      if (hasInterno) {
        if (isOnlyNA(dpInterno)) {
          core.info('::notice title=Validación de README.md::DataPower Interno contiene solo \'NA\'/\'N/A\'/\'No Aplica\' (válido - sin tabla)');
          notices.push("DataPower Interno contiene solo 'NA'/'N/A'/'No Aplica' (válido - sin tabla)");
        } else {
          validateDatapowerTable('DataPower Interno', dpInterno, false);
        }
      } else {
        core.warning('⚠️  Recomendación: No se encontró subsección \'DataPower Interno\'. Si el servicio requiere apuntamiento interno, agregarlo.');
      }
    }
  }

  // ===== 6.2. Endpoint BUS =====
  core.info('✔️ Validando subsección \'### Endpoint BUS\'');
  
  const endpointBusSection = getSubsection('^###\\s*Endpoint BUS');
  if (!endpointBusSection) {
    core.error('❌ Falta subsección \'Endpoint BUS\'');
    errors.push("Falta subsección 'Endpoint BUS'");
  } else {
    core.info('::notice title=Validación de README.md::Subsección \'Endpoint BUS\' válida');
    
    const rows = (endpointBusSection.split(/\r?\n/).filter(l => /^\|/.test(l))).slice();
    // find data rows after separator
    let dataRows = [];
    let inTable = false;
    for (const line of rows) {
      if (/^\|---/.test(line)) { inTable = true; continue; }
      if (inTable) dataRows.push(line);
    }
    if (dataRows.length === 0) {
      core.error('❌ Tabla Endpoint BUS no tiene filas de datos');
      errors.push('Tabla Endpoint BUS no tiene filas de datos');
    } else {
      let has_des = false, has_cal = false, has_prd = false;
      for (const row of dataRows) {
        const cols = row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
        const ambiente = cols[0] || '';  // AMBIENTE es la primera columna (índice 0)
        const endpoint = cols[2] || '';  // ENDPOINT es la tercera columna (índice 2)
        if (/^DESARROLLO/i.test(ambiente)) {
          has_des = true;
          if (/^NA$/i.test(endpoint)) {
            core.error(`❌ Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
            errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          }
          if (!/^https?:\/\/adbog162e/i.test(endpoint)) {
            core.error(`❌ Endpoint BUS en DESARROLLO debe comenzar con https://adbog162e o http://adbog162e. Encontrado: ${endpoint}`);
            errors.push(`Endpoint BUS en DESARROLLO debe comenzar con https://adbog162e o http://adbog162e. Encontrado: ${endpoint}`);
          } else if (/^http:\/\//i.test(endpoint)) {
            core.warning(`⚠️  Endpoint BUS en DESARROLLO usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
          }
        } else if (/^CALIDAD/i.test(ambiente)) {
          has_cal = true;
          if (/^NA$/i.test(endpoint)) {
            core.error(`❌ Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
            errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          }
          if (!/^https?:\/\/a[dt]bog16[34][de]/i.test(endpoint)) {
            core.error(`❌ Endpoint BUS en CALIDAD debe comenzar con nodos esperados (atbog163d, atbog164e, adbog163e, adbog164d). Encontrado: ${endpoint}`);
            errors.push(`Endpoint BUS en CALIDAD debe comenzar con nodos esperados (atbog163d, atbog164e, adbog163e, adbog164d). Encontrado: ${endpoint}`);
          } else if (/^http:\/\//i.test(endpoint)) {
            core.warning(`⚠️  Endpoint BUS en CALIDAD usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
          }
        } else if (/^PRODUCCI[OÓ]?N/i.test(ambiente)) {
          has_prd = true;
          if (/^NA$/i.test(endpoint)) {
            core.error(`❌ Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
            errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          }
          if (!(/^https?:\/\/apbog16[56][ab]/i.test(endpoint) || /^https?:\/\/boc060ap\.prd\.app/.test(endpoint))) {
            core.error(`❌ Endpoint BUS en PRODUCCION debe comenzar con nodos esperados (apbog165a, apbog165b, apbog166a, apbog166b o boc060ap.prd.app). Encontrado: ${endpoint}`);
            errors.push(`Endpoint BUS en PRODUCCION debe comenzar con nodos esperados (apbog165a, apbog165b, apbog166a, apbog166b o boc060ap.prd.app). Encontrado: ${endpoint}`);
          } else if (/^http:\/\//i.test(endpoint)) {
            core.warning(`⚠️  Endpoint BUS en PRODUCCION usa HTTP (no HTTPS): ${endpoint}. Verifica si esto es correcto o si debería usar HTTPS.`);
          }
        }
      }
      if (!has_des) {
        core.error('❌ Tabla Endpoint BUS debe tener al menos una fila para DESARROLLO');
        errors.push('Tabla Endpoint BUS debe tener al menos una fila para DESARROLLO');
      }
      if (!has_cal) {
        core.error('❌ Tabla Endpoint BUS debe tener al menos una fila para CALIDAD');
        errors.push('Tabla Endpoint BUS debe tener al menos una fila para CALIDAD');
      }
      if (!has_prd) {
        core.error('❌ Tabla Endpoint BUS debe tener al menos una fila para PRODUCCION');
        errors.push('Tabla Endpoint BUS debe tener al menos una fila para PRODUCCION');
      }
      if (has_des && has_cal && has_prd) {
        core.info('::notice title=Validación de README.md::✅ Tabla Endpoint BUS contiene los 3 ambientes requeridos');
        notices.push('Tabla Endpoint BUS contiene los 3 ambientes requeridos');
      }
    }
  }

  // ===== 7. CANALES - APLICACIONES =====
  core.info('✔️ Validando sección \'## CANALES - APLICACIONES\'');
  
  const canalesSection = getSection('^##\\s*CANALES - APLICACIONES');
  if (!canalesSection) {
    core.error('❌ Falta sección \'CANALES - APLICACIONES\'');
    errors.push("Falta sección 'CANALES - APLICACIONES'");
  } else {
    core.info('::notice title=Validación de README.md::Sección \'CANALES - APLICACIONES\' válida');
    
    const canalesRows = canalesSection.split(/\r?\n/);
    const consumidorRow = canalesRows.find(l => /^\|\*\*Consumidor\*\*/i.test(l));
    if (!consumidorRow) {
      core.error('❌ No se encontró la fila \'**Consumidor**\' en la sección \'CANALES - APLICACIONES\'.');
      errors.push("No se encontró la fila '**Consumidor**' en la sección 'CANALES - APLICACIONES'.");
    } else {
      const consumidorValues = consumidorRow.replace(/^\|\*\*Consumidor\*\*\|/, '').replace(/\|$/,'').trim();
      if (!consumidorValues) {
        core.error('❌ La fila \'Consumidor\' en \'CANALES - APLICACIONES\' está vacía. Debe tener al menos un valor o \'NA\' si no aplica.');
        errors.push("La fila 'Consumidor' en 'CANALES - APLICACIONES' está vacía. Debe tener al menos un valor o 'NA' si no aplica.");
      } else {
        core.info(`::notice title=Validación de README.md::✅ La fila 'Consumidor' contiene valores: ${consumidorValues}`);
        notices.push(`La fila 'Consumidor' contiene valores: ${consumidorValues}`);
      }
    }
    const backendsRow = canalesRows.find(l => /^\|\*\*Backends\*\*/i.test(l));
    if (!backendsRow) {
      core.error('❌ No se encontró la fila \'**Backends**\' en la sección \'CANALES - APLICACIONES\'.');
      errors.push("No se encontró la fila '**Backends**' en la sección 'CANALES - APLICACIONES'.");
    } else {
      const backendsValues = backendsRow.replace(/^\|\*\*Backends\*\*\|/, '').replace(/\|$/,'').trim();
      if (!backendsValues) {
        core.error('❌ La fila \'Backends\' en \'CANALES - APLICACIONES\' está vacía. Debe tener al menos un valor o \'NA\' si no aplica.');
        errors.push("La fila 'Backends' en 'CANALES - APLICACIONES' está vacía. Debe tener al menos un valor o 'NA' si no aplica.");
      } else {
        core.info(`::notice title=Validación de README.md::✅ La fila 'Backends' contiene valores: ${backendsValues}`);
        notices.push(`La fila 'Backends' contiene valores: ${backendsValues}`);
      }
    }
  }

  // ===== 8. DEPENDENCIAS =====
  core.info('✔️ Validando sección \'## DEPENDENCIAS\'');
  
  const dependencias = getSection('^##\\s*DEPENDENCIAS');
  if (!dependencias) {
    core.error('❌ Falta sección \'DEPENDENCIAS\'');
    errors.push("Falta sección 'DEPENDENCIAS'");
  } else {
    core.info('::notice title=Validación de README.md::Sección \'DEPENDENCIAS\' válida');
    // Extract services table between |Servicios| and |XSL|
    const serviciosMatch = dependencias.match(/\|\s*Servicios\s*\|[\s\S]*?(?=\|\s*XSL\s*\||$)/i);
    if (!serviciosMatch) {
      errors.push("La tabla 'Servicios' en DEPENDENCIAS está vacía o no encontrada.");
    } else {
      notices.push('Tabla Servicios encontrada en DEPENDENCIAS');
      const serviciosTable = serviciosMatch[0];
      // extract services as words (very permissive)
      const serviciosReadme = serviciosTable.split(/\r?\n/).filter(l => l.trim() && !/^\|---/.test(l) && !/^\|\s*Servicios\s*\|/i.test(l)).map(l => l.replace(/^\||\|$/g,'').trim()).join(' ');
      // find .project file
      function findProjectFile(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.name === '.project' && e.isFile()) return path.join(dir, e.name);
        }
        for (const e of entries) {
          if (e.isDirectory() && e.name !== '.git') {
            const found = findProjectFile(path.join(dir, e.name));
            if (found) return found;
          }
        }
        return null;
      }
      const projectFile = findProjectFile(workspaceDir);
      if (!projectFile) {
        notices.push('No se encontró archivo .project para validar los servicios.');
      } else {
        notices.push(`Archivo .project encontrado: ${projectFile}`);
        const proj = fs.readFileSync(projectFile, 'utf8');
        const serviciosProject = Array.from(proj.matchAll(/<project>([^<]+)<\/project>/g)).map(m => m[1].trim()).join(' ');
        // Compare sets
        const setProj = new Set(serviciosProject.split(/\s+/).filter(Boolean));
        const setReadme = new Set(serviciosReadme.split(/\s+/).filter(Boolean));
        const faltantes = [...setProj].filter(s => !setReadme.has(s));
        const extras = [...setReadme].filter(s => !setProj.has(s));
        if (faltantes.length) errors.push(`Servicios en .project que faltan en la tabla DEPENDENCIAS del README: ${faltantes.join(' ')}`);
        if (extras.length) errors.push(`Servicios en README que no existen en el archivo .project: ${extras.join(' ')}`);
        if (!faltantes.length && !extras.length) notices.push('Los servicios en README y .project coinciden correctamente.');
      }
    }
    // XSL table - extract like awk: from |XSL| until next section or empty
    const depLines = dependencias.split('\n');
    let xslLines = [];
    let captureXSL = false;
    for (const line of depLines) {
      if (/^\|XSL\|/i.test(line)) {
        captureXSL = true;
        xslLines.push(line);
        continue;
      }
      if (captureXSL) {
        if (/^## /.test(line)) break; // Next section
        xslLines.push(line);
      }
    }
    const xslMatch = xslLines.length > 0 ? [xslLines.join('\n')] : null;
    if (!xslMatch) {
      errors.push("No se encontró la tabla 'XSL' en DEPENDENCIAS.");
    } else {
      const xslTable = xslMatch[0];
      // Extract data rows (skip header and separator)
      const xslLines = xslTable.split(/\r?\n/);
      let xslDataRows = [];
      let foundSeparator = false;
      for (const line of xslLines) {
        if (/^\|---/.test(line)) { foundSeparator = true; continue; }
        if (foundSeparator && /^\|/.test(line)) {
          const cellContent = line.replace(/^\||\|$/g, '').trim();
          if (cellContent) xslDataRows.push(cellContent);
        }
      }
      
      if (xslDataRows.length === 0) {
        errors.push("La tabla 'XSL' en DEPENDENCIAS está vacía. Si no hay XSLs, debe colocarse explícitamente 'NA'.");
      } else {
        const xslContent = xslDataRows.join(' ');
        if (/\bNA\b/i.test(xslContent)) {
          notices.push("Tabla XSL contiene 'NA' (sin XSLs a consumir).");
        } else {
          notices.push(`Tabla XSL contiene ${xslDataRows.length} XSLs`);
        }
      }
    }
  }

  // ===== 9. DOCUMENTACION =====
  core.info('✔️ Validando sección \'## DOCUMENTACION\'');
  
  // Extract DOCUMENTACION section line by line (more reliable)
  const docLines = content.split('\n');
  let docSection = '';
  let capturingDoc = false;
  for (const line of docLines) {
    if (/^\s*## DOCUMENTACION/i.test(line)) {
      capturingDoc = true;
      continue;
    }
    if (capturingDoc && /^\s*## /.test(line)) break;
    if (capturingDoc) docSection += line + '\n';
  }
  
  if (!docSection.trim()) {
    core.error('❌ Falta sección \'DOCUMENTACION\'');
    errors.push("Falta sección 'DOCUMENTACION'");
  } else {
    core.info('::notice title=Validación de README.md::Sección \'DOCUMENTACION\' válida');
    notices.push("Sección 'DOCUMENTACION' válida");
    const docContent = docSection.replace(/\r?\n/g, ' ');
    
    // ===== 9.1. Documento de diseño detallado =====
    core.info('  ✔️ Validando campo \'Documento de diseño detallado\'');
    if (/\*\*Documento de diseño detallado\*\*/i.test(docContent) || /Documento de diseño detallado/i.test(docContent)) {
      const disenoFragment = (docContent.match(/\*\*Documento de diseño detallado(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/(:f:\/r\/)?sites\/BibliotecaAplicaciones\//i.test(disenoFragment)) notices.push("Enlace SharePoint válido para 'Documento de diseño detallado'"); else errors.push("El campo 'Documento de diseño detallado' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Documento de diseño detallado:**' en la sección DOCUMENTACION");
    }
    // Mapeo
    if (/\*\*Mapeo\*\*/i.test(docContent) || /Mapeo:/i.test(docContent)) {
      const mapeoFragment = (docContent.match(/\*\*Mapeo(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/(:f:\/r\/)?sites\/BibliotecaAplicaciones\//i.test(mapeoFragment)) notices.push("Enlace SharePoint válido para 'Mapeo'"); else errors.push("El campo 'Mapeo' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Mapeo:**' en la sección DOCUMENTACION");
    }
    // Evidencias
    if (/Evidencias\s*\(Unitarias\/.+?\)/i.test(docContent) || /Evidencias/i.test(docContent)) {
      const evFragment = (docContent.match(/\*\*Evidencias[\s\S]*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/(:f:\/r\/)?sites\/BibliotecaAplicaciones\//i.test(evFragment)) notices.push("Enlace SharePoint válido para 'Evidencias'"); else errors.push("El campo 'Evidencias (Unitarias/Auditoria/Monitoreo)' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Evidencias (Unitarias/Auditoria/Monitoreo):**' en la sección DOCUMENTACION");
    }
    // WSDL, SWAGGER y JSON - El servicio puede ser SOAP (WSDL), REST (SWAGGER/JSON) o híbrido (ambos)
    const hasWSDL = /\*\*WSDL\*\*/i.test(docContent) || /WSDL:/i.test(docContent);
    // SWAGGER puede aparecer como **SWAGGER**, **SWAGGER:**, **SWAGGER**: o **SWAGGER**:
    const hasSWAGGER = /\*\*SWAGGER(\*\*)?:?/i.test(docContent);
    // JSON puede aparecer como **JSON**, **JSON:**, **JSON**: o **JSON**:
    const hasJSON = /\*\*JSON(\*\*)?:?/i.test(docContent);
    
    // Extract FULL repo name including ESB_ (like checklist.yml does)
    const titleMatch = content.match(/^#\s*(ESB_.+)$/m);
    const repo_name = titleMatch ? titleMatch[1].replace(/\.$/, '').trim() : '';
    
    if (!hasWSDL && !hasSWAGGER && !hasJSON) {
      errors.push("Falta campo '**WSDL:**', '**SWAGGER:**' o '**JSON:**' en la sección DOCUMENTACION. Debe tener al menos uno.");
    }
    
    // Validate WSDL if present
    if (hasWSDL) {
      core.info('  ✔️ Validando campo \'WSDL\'');
      // Capture WSDL content - get everything after WSDL: including line breaks
      // Match **WSDL:** or **WSDL**: or **WSDL:
      const wsdlStart = docContent.search(/\*\*WSDL(?::\*\*|\*\*:|:)/i);
      
      // Find where WSDL header ends (after the colon)
      const headerMatch = docContent.substring(wsdlStart).match(/^\*\*WSDL(?::\*\*|\*\*:|:)/i);
      const headerLength = headerMatch ? headerMatch[0].length : 10;
      
      const nextFieldMatch = docContent.substring(wsdlStart + headerLength).search(/\*\*[A-Z]/);
      const wsdlEnd = nextFieldMatch > 0 ? wsdlStart + headerLength + nextFieldMatch : docContent.length;
      const wsdlFragment = docContent.substring(wsdlStart, wsdlEnd);
      
      // Clean the fragment to check for N/A
      const cleanFragment = wsdlFragment
        .replace(/\*\*WSDL(?::\*\*|\*\*:|:)/i, '')
        .replace(/<br>/gi, '')
        .trim();
      
      // Accept both forward slash (/) and backslash (\\) in path
      // Allow optional prefixes like ESB_ACE12_ before repo name
      const repoNameBase = repo_name.replace(/^ESB_/, '');
      const gitPatternBackslash = new RegExp(`git\\\\(ESB_)?(ACE12_|ACE_)?${repoNameBase}\\\\Broker\\\\WSDL`, 'i');
      const gitPatternForwardslash = new RegExp(`git/(ESB_)?(ACE12_|ACE_)?${repoNameBase}/Broker/WSDL`, 'i');
      
      if (gitPatternBackslash.test(wsdlFragment) || gitPatternForwardslash.test(wsdlFragment) || /^\s*N\/?A\s*$/i.test(cleanFragment)) {
        notices.push(`Ruta WSDL válida para repositorio '${repo_name}'`);
      } else {
        errors.push(`El campo 'WSDL' debe comenzar con 'git/${repo_name}/Broker/WSDL/' o 'git/ESB_ACE12_${repoNameBase}/Broker/WSDL/' (o con backslashes) o contener solo 'N/A'.`);
      }
    }
    
    // Validate SWAGGER if present
    if (hasSWAGGER) {
      core.info('  ✔️ Validando campo \'SWAGGER\'');
      // Capture SWAGGER content - match multiple formats: **SWAGGER**, **SWAGGER:**, **SWAGGER**: or **SWAGGER**:
      const swaggerStart = docContent.search(/\*\*SWAGGER(\*\*)?:?/i);
      if (swaggerStart === -1) {
        errors.push("Error interno: SWAGGER detectado pero no se pudo localizar");
      } else {
        // Find where SWAGGER header ends (after the colon or after **)
        const headerMatch = docContent.substring(swaggerStart).match(/^\*\*SWAGGER(\*\*)?:?/i);
        const headerLength = headerMatch ? headerMatch[0].length : 12;
        
        const nextFieldMatch = docContent.substring(swaggerStart + headerLength).search(/\*\*[A-Z]/);
        const swaggerEnd = nextFieldMatch > 0 ? swaggerStart + headerLength + nextFieldMatch : docContent.length;
        const swaggerFragment = docContent.substring(swaggerStart, swaggerEnd);
        
        // Clean the fragment to check for N/A
        const cleanFragment = swaggerFragment
          .replace(/\*\*SWAGGER(\*\*)?:?/i, '')
          .replace(/<br>/gi, '')
          .trim();
        
        // Accept both forward slash (/) and backslash (\\) in path
        // Accept both /SWAGGER/ and /JSON/ folders (some projects use JSON folder for swagger files)
        const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
        const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
        const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
        const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
        
        if (gitPatternBackslashSwagger.test(swaggerFragment) || 
            gitPatternForwardslashSwagger.test(swaggerFragment) ||
            gitPatternBackslashJSON.test(swaggerFragment) ||
            gitPatternForwardslashJSON.test(swaggerFragment) ||
            /^\s*N\/?A\s*$/i.test(cleanFragment)) {
          notices.push(`Ruta SWAGGER válida para repositorio '${repo_name}'`);
        } else {
          errors.push(`El campo 'SWAGGER' debe comenzar con 'git/${repo_name}/Broker/SWAGGER/' o 'git/${repo_name}/Broker/JSON/' (también acepta backslashes) o contener solo 'N/A'.`);
        }
      }
    }
    
    // Validate JSON if present (alternative to SWAGGER for REST services)
    if (hasJSON) {
      core.info('  ✔️ Validando campo \'JSON\'');
      // Capture JSON content - match multiple formats: **JSON**, **JSON:**, **JSON**: or **JSON**:
      const jsonStart = docContent.search(/\*\*JSON(\*\*)?:?/i);
      if (jsonStart === -1) {
        errors.push("Error interno: JSON detectado pero no se pudo localizar");
      } else {
        // Find where JSON header ends
        const headerMatch = docContent.substring(jsonStart).match(/^\*\*JSON(\*\*)?:?/i);
        const headerLength = headerMatch ? headerMatch[0].length : 8;
        
        const nextFieldMatch = docContent.substring(jsonStart + headerLength).search(/\*\*[A-Z]/);
        const jsonEnd = nextFieldMatch > 0 ? jsonStart + headerLength + nextFieldMatch : docContent.length;
        const jsonFragment = docContent.substring(jsonStart, jsonEnd);
        
        // Clean the fragment to check for N/A
        const cleanFragment = jsonFragment
          .replace(/\*\*JSON(\*\*)?:?/i, '')
          .replace(/<br>/gi, '')
          .trim();
        
        // Accept both forward slash (/) and backslash (\\) in path
        // Accept both /JSON/ and /SWAGGER/ folders (JSON files can be in either)
        const gitPatternBackslashJSON = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\JSON`, 'i');
        const gitPatternForwardslashJSON = new RegExp(`git/${repo_name}/Broker/JSON`, 'i');
        const gitPatternBackslashSwagger = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\SWAGGER`, 'i');
        const gitPatternForwardslashSwagger = new RegExp(`git/${repo_name}/Broker/SWAGGER`, 'i');
        
        if (gitPatternBackslashJSON.test(jsonFragment) || 
            gitPatternForwardslashJSON.test(jsonFragment) ||
            gitPatternBackslashSwagger.test(jsonFragment) ||
            gitPatternForwardslashSwagger.test(jsonFragment) ||
            /^\s*N\/?A\s*$/i.test(cleanFragment)) {
          notices.push(`Ruta JSON válida para repositorio '${repo_name}'`);
        } else {
          errors.push(`El campo 'JSON' debe comenzar con 'git/${repo_name}/Broker/JSON/' o 'git/${repo_name}/Broker/SWAGGER/' (también acepta backslashes) o contener solo 'N/A'.`);
        }
      }
    }
  }

  // ===== 10. SQL =====
  core.info('✔️ Validando sección \'## SQL\'');
  
  const sqlSection = getSection('^##\\s*SQL');
  if (!sqlSection) {
    core.error('❌ Falta sección \'SQL\'');
    errors.push("Falta sección 'SQL'");
  } else {
    const sqlBody = sqlSection.replace(/^##.*\n?/, '');
    if (!/\S/.test(sqlBody)) {
      core.error('❌ La sección \'SQL\' está vacía. Debe contener queries de auditoría y monitoreo.');
      errors.push("La sección 'SQL' está vacía. Debe contener queries de auditoría y monitoreo.");
    } else {
      core.info('::notice title=Validación de README.md::✅ La sección \'SQL\' contiene contenido');
      notices.push("La sección 'SQL' contiene contenido");
      
      // find lines with where ... = '...' or in(...)
      const lines = sqlBody.split(/\r?\n/);
      let foundQueries = [];
      for (const ln of lines) {
        if (/where.*=\s*'[^']*'/i.test(ln) || /where.*in\s*\(/i.test(ln)) foundQueries.push(ln.trim());
      }
      if (foundQueries.length === 0) {
        core.warning('⚠️  No se encontraron queries SQL con códigos de operación en la sección SQL');
      } else {
        // Verificar si al menos una query usa num_id_tipo_operacion con código numérico
        const hasNumericCode = foundQueries.some(q => {
          const match = q.match(/num_id_tipo_operacion\s*=\s*'(\d+)'/i);
          return match && /^\d+$/.test(match[1]);
        });
        
        // Si hay queries con códigos numéricos, permitir también queries con str_id_oper_apl_origen
        if (!hasNumericCode) {
          // Solo validar estrictamente si NO hay queries con códigos numéricos
          for (const q of foundQueries) {
            // = 'value'
            if (/=\s*'([^']+)'/.test(q)) {
              const val = q.match(/=\s*'([^']+)'/)[1];
              if (!/^\d+$/.test(val)) {
                core.error(`❌ Código de operación contiene caracteres no numéricos. Solo se permiten números: ${q}`);
                errors.push(`Código de operación contiene caracteres no numéricos. Solo se permiten números: ${q}`);
              }
            }
            // in('a','b')
            const inMatch = q.match(/in\s*\(([^)]+)\)/i);
            if (inMatch) {
              const vals = inMatch[1].split(',').map(v => v.replace(/['" ]/g,'').trim()).filter(Boolean);
              for (const v of vals) {
                if (/\D/.test(v)) {
                  core.error(`❌ Código de operación contiene caracteres no numéricos en lista: '${v}' en línea: ${q}`);
                  errors.push(`Código de operación contiene caracteres no numéricos en lista: '${v}' en línea: ${q}`);
                }
              }
            }
          }
        } else {
          core.info('✓ Queries SQL contienen códigos numéricos (queries adicionales con nombres son permitidas)');
        }
      }
    }
  }

  // ===== RESUMEN DE VALIDACIÓN =====
  core.info('');
  core.info('📊 ============================================');
  core.info('   RESUMEN DE VALIDACIÓN README.md');
  core.info('============================================');
  core.info('');
  
  // Log all notices (successes)
  if (notices.length > 0) {
    core.info('✅ VALIDACIONES EXITOSAS:');
    notices.forEach(n => core.info(`   ✓ ${n}`));
    core.info('');
  }
  
  // Log all errors
  if (errors.length > 0) {
    core.info(`❌ SE ENCONTRARON ${errors.length} ERROR(ES):`);
    errors.forEach((e, index) => {
      core.error(`   ${index + 1}. ${e}`);
    });
    core.info('');
    core.error(`README.md no cumple con todos los requisitos de la plantilla. Total de errores: ${errors.length}`);
    throw new Error(`README.md no cumple con todos los requisitos de la plantilla. Se encontraron ${errors.length} errores.`);
  }
  
  core.info('🎉 ============================================');
  core.info('   README.md CUMPLE CON TODOS LOS REQUISITOS');
  core.info('============================================');
  core.info('');

  return true;
}

/**
 * Validate no BD folders exist
 */
async function validateNoBDFolders(workspaceDir = process.cwd()) {
  const findBDFolders = (dir, results = []) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === '.git') continue; // Skip .git directory
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name.toLowerCase() === 'bd') {
          results.push(fullPath);
        }
        // Recursively search subdirectories
        findBDFolders(fullPath, results);
      }
    }
    
    return results;
  };
  
  const bdFolders = findBDFolders(workspaceDir);
  
  if (bdFolders.length > 0) {
    throw new Error(`Se encontraron carpetas 'BD' en el repositorio:\n${bdFolders.join('\n')}`);
  }
  
  return true;
}

/**
 * Validate execution groups match central configuration
 */
async function validateExecutionGroups(token, workspaceDir = process.cwd()) {
  try {
    core.info('🔍 Iniciando validación de grupos de ejecución');
    
    const readmePath = path.join(workspaceDir, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    
    // Extract service name from README title
    const titleMatch = content.match(/^# ESB_ACE12_(.+)\.?$/m) || content.match(/^# ESB_(.+)\.?$/m);
    if (!titleMatch) {
      throw new Error('No se pudo extraer el nombre del servicio del README');
    }
    
    let serviceName = titleMatch[1].replace(/\.$/, '').trim();
    if (serviceName.startsWith('ACE12_')) {
      serviceName = serviceName.substring(6);
    }
    
    core.info(`📝 Servicio detectado: ESB_ACE12_${serviceName}`);
    
    // Extract groups from README - must search within "Procedimiento de despliegue" section
    // Pattern mimics: awk '/^## Procedimiento de despliegue/{flag=1;next}/^## /{flag=0}flag'
    const lines = content.split('\n');
    let deploymentSection = '';
    let capturing = false;
    for (const line of lines) {
      if (/^## Procedimiento de despliegue/i.test(line)) {
        capturing = true;
        continue;
      }
      if (capturing && /^## /.test(line)) {
        break;
      }
      if (capturing) {
        deploymentSection += line + '\n';
      }
    }
    
    if (!deploymentSection.trim()) {
      throw new Error('No se encontró la sección "## Procedimiento de despliegue" en el README');
    }
    
    // Find the line with "desplegar en los grupos de ejecución:" (acepta con y sin tilde)
    const deploymentLines = deploymentSection.split('\n');
    let groupsText = '';
    for (let i = 0; i < deploymentLines.length; i++) {
      const line = deploymentLines[i];
      if (/desplegar en los grupos de ejecuci[oó]n:/i.test(line)) {
        // Try to get groups from same line first
        const sameLineMatch = line.match(/desplegar en los grupos de ejecuci[oó]n:\s*(.+)/i);
        if (sameLineMatch && sameLineMatch[1].trim()) {
          groupsText = sameLineMatch[1].trim();
        } else {
          // Get next lines until we hit another section (skip empty lines)
          for (let j = i + 1; j < deploymentLines.length && j < i + 20; j++) {
            const nextLine = deploymentLines[j].trim();
            if (/^##/.test(nextLine)) break; // Stop at next section
            if (!nextLine) continue; // Skip empty lines but don't stop
            groupsText += (groupsText ? ' ' : '') + nextLine;
          }
        }
        break;
      }
    }
    
    if (!groupsText) {
      throw new Error(`No se encontró la frase "desplegar en los grupos de ejecución:" (o sin tilde: "ejecucion") en el procedimiento de despliegue para el servicio '${serviceName}'`);
    }

    
    const readmeGroups = groupsText
      .split(/[\s,]+/)
      .filter(g => g.trim())
      .filter(g => !/^[*\-•]$/.test(g)) // Remove markdown bullets: *, -, •
      .map(g => g.toLowerCase());
    
    if (readmeGroups.length === 0) {
      throw new Error(`No se pudieron extraer los grupos de ejecución para el servicio '${serviceName}'. Verifica que estén después de 'desplegar en los grupos de ejecución:' (o 'ejecucion' sin tilde) en la misma línea o en la siguiente.`);
    }
    
    core.info(`📚 Grupos en README (${readmeGroups.length}): ${readmeGroups.join(', ')}`);
    
    // Download central configuration using @actions/github
    core.info('📥 Descargando configuración central desde ESB_ACE12_General_Configs...');
    const octokit = github.getOctokit(token);
    let response;
    
    try {
      response = await octokit.rest.repos.getContent({
        owner: 'bocc-principal',
        repo: 'ESB_ACE12_General_Configs',
        path: 'ace-12-common-properties/esb-ace12-general-integration-servers.properties',
        ref: 'main'
      });
    } catch (error) {
      throw new Error(`No se pudo descargar el archivo de configuración central: ${error.message}`);
    }
    
    core.info('✅ Configuración central descargada exitosamente');
    
    // Decode base64 content
    const configContent = Buffer.from(response.data.content, 'base64').toString('utf8');
    
    // Extract groups from config
    // Try to match with and without 'Policy' suffix
    core.info(`🔍 Buscando entradas para ESB_ACE12_${serviceName}...`);
    let transactionalMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Transactional=([^\n]+)`, 'i'));
    let notificationMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Notification=([^\n]+)`, 'i'));
    
    // If not found, try with 'Policy' suffix
    if (!transactionalMatch && !notificationMatch) {
      core.info(`🔍 No se encontró ${serviceName}, intentando con ${serviceName}Policy...`);
      transactionalMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Transactional=([^\n]+)`, 'i'));
      notificationMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}Policy\\.Notification=([^\n]+)`, 'i'));
    }
    
    if (!transactionalMatch && !notificationMatch) {
      throw new Error(`No existe entry ESB_ACE12_${serviceName}.Transactional ni ESB_ACE12_${serviceName}.Notification (ni con sufijo Policy) en el archivo de configuración`);
    }
    
    if (transactionalMatch) {
      core.info(`ℹ️  ESB_ACE12_${serviceName}.Transactional = ${transactionalMatch[1]}`);
    }
    if (notificationMatch) {
      core.info(`ℹ️  ESB_ACE12_${serviceName}.Notification = ${notificationMatch[1]}`);
    }
    
    const configGroups = [
      ...(transactionalMatch ? transactionalMatch[1].split(',') : []),
      ...(notificationMatch ? notificationMatch[1].split(',') : [])
    ].map(g => g.trim().toLowerCase());
    
    core.info(`⚙️  Grupos en config (${configGroups.length}): ${configGroups.join(', ')}`);
    
    // Compare groups
    core.info('🔍 Comparando grupos...');
    const missingInConfig = readmeGroups.filter(g => !configGroups.includes(g));
    const missingInReadme = configGroups.filter(g => !readmeGroups.includes(g));
    
    if (missingInConfig.length > 0) {
      throw new Error(`Grupos en README que no están en config: ${missingInConfig.join(', ')}`);
    }
    
    if (missingInReadme.length > 0) {
      throw new Error(`Grupos en config que no están en README: ${missingInReadme.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    // Add context to the error
    if (error.message.includes('No se pudo')) {
      throw error; // Already has context
    }
    throw new Error(`Error validando grupos de ejecución: ${error.message}`);
  }
}

/**
 * Validate reviewers and routes
 */
async function validateReviewersAndRoutes(payload, token) {
  const sourceBranch = payload.pull_request.head.ref;
  const targetBranch = payload.pull_request.base.ref;
  const prNumber = payload.pull_request.number;
  
  // Get valid reviewers from input or use defaults
  // NOTE: Supports reviewers with or without organization suffix (_bocc, etc.)
  const validReviewersInput = core.getInput('valid-reviewers') || 'DRamirezM,cdgomez,acardenasm,CAARIZA,JJPARADA';
  const validReviewers = validReviewersInput.split(',').map(r => r.trim());
  
  // Extract reviewer logins from PR (GitHub API may return base login or with suffix)
  const requestedReviewers = (payload.pull_request.requested_reviewers || []).map(r => r.login);
  
  // Log for debugging
  core.info(`📋 Revisores solicitados en el PR: ${requestedReviewers.length > 0 ? requestedReviewers.join(', ') : 'ninguno'}`);
  core.info(`📋 Revisores válidos configurados: ${validReviewers.join(', ')}`);
  
  // Helper function to normalize reviewer name (remove common suffixes)
  const normalizeReviewer = (name) => {
    return name.replace(/_bocc$/i, '').trim();
  };
  
  // Normalize both lists for comparison (case-insensitive and suffix-insensitive)
  const normalizedValidReviewers = validReviewers.map(r => normalizeReviewer(r).toLowerCase());
  const normalizedRequestedReviewers = requestedReviewers.map(r => normalizeReviewer(r).toLowerCase());
  
  // Check if any valid reviewer is assigned (comparing normalized names)
  const hasValidReviewer = normalizedRequestedReviewers.some(reviewer => 
    normalizedValidReviewers.includes(reviewer)
  );
  
  // Validate develop → quality
  if (targetBranch === 'quality' && sourceBranch === 'develop') {
    core.info(`📍 Validando revisores para flujo develop → quality`);
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para calidad. Autorizados: ${validReviewers.join(', ')}`);
    }
    core.info(`✓ Revisor válido encontrado para calidad`);
    return true;
  }
  
  // Validate quality → main
  if (targetBranch === 'main' && sourceBranch === 'quality') {
    core.info(`📍 Validando revisores para flujo quality → main`);
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para producción. Autorizados: ${validReviewers.join(', ')}`);
    }
    core.info(`✓ Revisor válido encontrado para producción`);
    return true;
  }
  
  // Validate main → quality (rollback de producción a calidad)
  if (targetBranch === 'quality' && sourceBranch === 'main') {
    core.info(`📍 Validando revisores para flujo main → quality (rollback de producción)`);
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para rollback de producción. Autorizados: ${validReviewers.join(', ')}`);
    }
    core.info(`✓ Revisor válido encontrado para rollback de producción`);
    return true;
  }
  
  // Validate quality → develop (rollback o corrección)
  if (targetBranch === 'develop' && sourceBranch === 'quality') {
    core.info(`📍 Validando revisores para flujo quality → develop (rollback/corrección)`);
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para rollback a develop. Autorizados: ${validReviewers.join(', ')}`);
    }
    core.info(`✓ Revisor válido encontrado para rollback`);
    return true;
  }
  
  // Check for emergency exception (feature/** → develop)
  if (targetBranch === 'develop' && sourceBranch.startsWith('feature/')) {
    core.info(`📍 Validando flujo feature → develop (opcional)`);
    if (!hasValidReviewer) {
      // Check for emergency approval comment using @actions/github
      try {
        const octokit = github.getOctokit(token);
        const { data: comments } = await octokit.rest.issues.listComments({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: prNumber
        });
        
        const hasEmergencyApproval = comments.some(comment => 
          comment.body && comment.body.includes('@bot aprobar excepción')
        );
        
        if (hasEmergencyApproval) {
          core.warning('⚠️  Excepción de emergencia detectada en comentarios');
          return true;
        }
        
        core.info('ℹ️  No hay revisor asignado, pero no es obligatorio para este flujo');
      } catch (error) {
        core.debug(`No se pudieron verificar comentarios del PR: ${error.message}`);
      }
    } else {
      core.info(`✓ Revisor asignado: ${requestedReviewers.join(', ')}`);
    }
    return true;
  }
  
  // Para cualquier otro flujo, no requerir revisores
  core.info(`📍 Flujo ${sourceBranch} → ${targetBranch}: validación de revisores no requerida`);
  return true;
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run, validateReadmeTemplate };

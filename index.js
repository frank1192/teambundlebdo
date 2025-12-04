const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

/**
 * Main entry point for the ESB/ACE12 Checklist Action
 * This action validates ESB/ACE12 service repositories for compliance
 */
async function run() {
  try {
    // Get inputs
    const token = core.getInput('github-token') || process.env.GITHUB_TOKEN;
    const configRepoToken = core.getInput('config-repo-token') || process.env.ESB_ACE12_ORG_REPO_TOKEN;
    const skipReadmeValidation = core.getInput('skip-readme-validation') === 'true';
    
    core.info('🚀 Starting ESB/ACE12 Checklist Validation');
    core.info(`Node.js version: ${process.version}`);
    
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
      try {
        // Check README exists
        const readmeExists = await validateReadmeExistence();
        results.readmeExistence = readmeExists;
        core.info('✅ README.md encontrado');
        
        // Validate README template
        if (readmeExists) {
          results.readmeTemplate = await validateReadmeTemplate();
          core.info('✅ Plantilla README válida');
          
          // Validate execution groups
          if (configRepoToken) {
            results.executionGroups = await validateExecutionGroups(configRepoToken);
            core.info('✅ Grupos de ejecución coinciden');
          } else {
            core.warning('⚠️  Token de configuración no provisto, saltando validación de grupos de ejecución');
          }
        }
      } catch (error) {
        core.error(`❌ ${error.message}`);
        results.readmeTemplate = false;
      }
      core.endGroup();
    } else {
      core.info('⏭️  Validación de README omitida (skip-readme-validation=true)');
    }
    
    // Job 3: Repository reviews (grouped)
    core.startGroup('🔍 Revisiones: Repositorio');
    try {
      // Validate no BD folders
      results.bdFolders = await validateNoBDFolders();
      core.info('✅ No se encontraron carpetas BD');
      
      // Validate reviewers and routes
      if (payload.pull_request) {
        results.reviewersAndRoutes = await validateReviewersAndRoutes(payload, token);
        core.info('✅ Revisores y rutas válidos');
      }
    } catch (error) {
      core.error(`❌ ${error.message}`);
      results.bdFolders = false;
    }
    core.endGroup();
    
    // Summary
    core.startGroup('📊 Resumen de Validaciones');
    const allPassed = Object.values(results).every(r => r !== false);
    
    core.info('Resultados:');
    core.info(`  - Nombre de rama: ${results.branchName !== false ? '✅' : '❌'}`);
    if (!skipReadmeValidation) {
      core.info(`  - README existencia: ${results.readmeExistence !== false ? '✅' : '❌'}`);
      core.info(`  - README plantilla: ${results.readmeTemplate !== false ? '✅' : '❌'}`);
      core.info(`  - Grupos de ejecución: ${results.executionGroups !== false ? '✅' : '❌'}`);
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
  const pattern = /^(feature|bugfix|hotfix|release)\/[A-Za-z0-9._-]+$/;
  
  if (!pattern.test(branchName)) {
    throw new Error(`Nombre de rama inválido: '${branchName}'. Debe comenzar con 'feature/', 'bugfix/', 'hotfix/' o 'release/'`);
  }
  
  return true;
}

/**
 * Validate README.md exists
 */
async function validateReadmeExistence() {
  const readmePath = path.join(process.cwd(), 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    throw new Error('No se encontró el archivo README.md en la raíz del repositorio');
  }
  
  return true;
}

/**
 * Validate README template (simplified version - delegates to bash script for complex validations)
 */
async function validateReadmeTemplate() {
  const readmePath = path.join(process.cwd(), 'README.md');
  const content = fs.readFileSync(readmePath, 'utf8');
  // Collect notices and errors to provide comprehensive feedback
  const notices = [];
  const errors = [];

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
    const m = tail.match(/\n(^###\s+|^##\s+)/m);
    if (m && m.index !== undefined) {
      return tail.slice(0, m.index).trim();
    }
    return tail.trim();
  }

  // Basic required sections check
  const requiredSections = [
    '# ESB_',
    '## INFORMACIÓN DEL SERVICIO',
    '## Procedimiento de despliegue',
    '## ACCESO AL SERVICIO',
    '## CANALES - APLICACIONES',
    '## DEPENDENCIAS',
    '## DOCUMENTACION',
    '## SQL'
  ];

  for (const section of requiredSections) {
    if (!content.match(new RegExp('^' + section.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm'))) {
      errors.push(`Falta sección requerida: ${section}`);
    } else {
      notices.push(`Encabezado '${section}' encontrado`);
    }
  }

  // Title validations
  const titleMatch = content.match(/^#\s*ESB_(.+)$/m);
  if (!titleMatch || !titleMatch[1] || titleMatch[1].trim() === '' || /^[_-]+\.?$/.test(titleMatch[1].trim())) {
    errors.push('El título no puede ser solo "ESB_" o "ESB_" seguido solo de guiones');
  } else {
    notices.push(`Título principal encontrado y válido: ${titleMatch[0].replace(/^#\s*/, '')}`);
  }

  // boc200 check
  if (content.includes('boc200')) {
    errors.push('URLs con boc200 detectadas. Deben usar boc201');
  }

  // 1) INFORMACIÓN DEL SERVICIO -> check content and subsection Último despliege
  const infoServicio = getSection('^##\\s*INFORMACIÓN DEL SERVICIO');
  if (!infoServicio) {
    errors.push("Falta el encabezado '## INFORMACIÓN DEL SERVICIO'");
  } else {
    // extract lines after header until first ###
    const afterHeader = infoServicio.replace(/^##.*\n?/, '');
    const beforeSub = afterHeader.split(/^### /m)[0].trim();
    if (!beforeSub) {
      errors.push("La sección '## INFORMACIÓN DEL SERVICIO' no contiene información descriptiva antes de las subsecciones.");
    } else {
      notices.push("La sección '## INFORMACIÓN DEL SERVICIO' contiene información descriptiva");
    }

    // Último despliege
    const ultimo = getSubsection('^###\\s*Último despliege');
    if (!ultimo) {
      errors.push("Falta subsección '### Último despliege' en la sección 'INFORMACIÓN DEL SERVICIO'");
    } else {
      notices.push("Subsección '### Último despliege' encontrada");
      // look for table header
      if (/\|\s*CQ\s*\|\s*JIRA\s*\|\s*Fecha\s*\|/i.test(ultimo)) {
        notices.push("Encabezado de tabla 'Último despliege' encontrado");
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
          errors.push("La tabla 'Último despliege' no tiene fila de datos. Debe incluir al menos una fila con valores o 'NA' en cada columna.");
        } else {
          // split cells
          const cells = dataRow.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
          const empty = cells.some(c => c === '');
          if (empty) {
            errors.push("La tabla 'Último despliege' tiene celdas vacías en la fila de datos. Si no hay valor, debe colocarse 'NA' en cada columna (CQ, JIRA, Fecha).");
          } else {
            notices.push("La tabla 'Último despliege' es válida (todas las celdas tienen valores)");
          }
        }
      } else {
        errors.push("La tabla 'Último despliege' no tiene el formato correcto. Debe incluir el encabezado: |CQ |JIRA | Fecha|");
      }
    }
  }

  // 2) Procedimiento de despliegue
  const procedimiento = getSection('^##\\s*Procedimiento de despliegue');
  if (!procedimiento) {
    errors.push("No se encontró el encabezado '## Procedimiento de despliegue'");
  } else {
    const body = procedimiento.replace(/^##.*\n?/, '').trim();
    if (!body) {
      errors.push("La sección '## Procedimiento de despliegue' está vacía. Agrega instrucciones de despliegue debajo del encabezado.");
    } else {
      notices.push("La sección '## Procedimiento de despliegue' contiene contenido");
    }
  }

  // 3) ACCESO AL SERVICIO and DataPower subsections
  const acceso = getSection('^##\\s*ACCESO AL SERVICIO');
  if (!acceso) {
    errors.push("Falta sección 'ACCESO AL SERVICIO'");
  } else {
    notices.push("Sección 'ACCESO AL SERVICIO' válida");
    // check DataPower Externo and Interno
    const dpExterno = getSubsection('^###\\s*DataPower Externo');
    const dpInterno = getSubsection('^###\\s*DataPower Interno');

    const hasExterno = !!dpExterno;
    const hasInterno = !!dpInterno;

    const isOnlyNA = (txt) => {
      if (!txt) return false;
      const clean = txt.trim();
      return /^\s*(N\s*\/?\s*A|No\s+Aplica)\s*$/i.test(clean);
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
      const rows = extractTableRows(sectionText);
      if (rows.length === 0) {
        errors.push(`No se encontraron filas de datos en tabla ${sectionName}. Debe contener al menos una fila con datos o valores 'NA'.`);
        return;
      }
      let all_na = true;
      let has_des = false, has_cal = false, has_prd = false;
      for (const row of rows) {
        const cols = row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
        const ambiente = cols[1] || '';
        const datapower = cols[4] || '';
        const endpoint = cols[5] || '';
        const rowContent = cols.join(' ');
        if (!/^\s*(DESARROLLO|CALIDAD|PRODUCCION)/i.test(ambiente)) continue;
        if (!/^(DESARROLLO|CALIDAD|PRODUCCION)/i.test(ambiente)) continue;
        // Determine NA-only pattern
        if (!/^((DESARROLLO|CALIDAD|PRODUCCION)\s+N\/?A\s+N\/?A\s+N\/?A\s+N\/?A)$/i.test(rowContent)) {
          all_na = false;
          // perform validations per ambiente
          if (/^DESARROLLO/i.test(ambiente)) { has_des = true;
            if (datapower && datapower !== 'NA' && !/^BODP.*DEV$/i.test(datapower)) errors.push(`Datapower en DESARROLLO debe comenzar con BODP y terminar con DEV. Encontrado: ${datapower}`);
            if (endpoint && endpoint !== 'NA' && !/^https:\/\/boc201\.des\.app\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint en DESARROLLO debe comenzar con https://boc201.des.app.bancodeoccidente.net Encontrado: ${endpoint}`);
          }
          if (/^CALIDAD/i.test(ambiente)) { has_cal = true;
            if (datapower && datapower !== 'NA' && !/^BODP.*QAS$/i.test(datapower)) errors.push(`Datapower en CALIDAD debe comenzar con BODP y terminar con QAS. Encontrado: ${datapower}`);
            if (endpoint && endpoint !== 'NA') {
              if (isExterno) {
                if (!/^https:\/\/boc201\.testdmz\.app\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint en CALIDAD (Externo) debe comenzar con https://boc201.testdmz.app.bancodeoccidente.net Encontrado: ${endpoint}`);
              } else {
                if (!/^https:\/\/boc201\.testint\.app\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint en CALIDAD (Interno) debe comenzar con https://boc201.testint.app.bancodeoccidente.net Encontrado: ${endpoint}`);
              }
            }
          }
          if (/^PRODUCCION/i.test(ambiente)) { has_prd = true;
            if (datapower && datapower !== 'NA' && !/^BODP.*PRD$/i.test(datapower)) errors.push(`Datapower en PRODUCCION debe comenzar con BODP y terminar con PRD. Encontrado: ${datapower}`);
            if (endpoint && endpoint !== 'NA') {
              if (isExterno) {
                if (!/^https:\/\/boc201\.prddmz\.app\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint en PRODUCCION (Externo) debe comenzar con https://boc201.prddmz.app.bancodeoccidente.net. Encontrado: ${endpoint}`);
              } else {
                if (!/^https:\/\/boc201\.prdint\.app\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint en PRODUCCION (Interno) debe comenzar con https://boc201.prdint.app.bancodeoccidente.net. Encontrado: ${endpoint}`);
              }
            }
          }
        }
      }
      if (!has_des) errors.push(`Tabla ${sectionName} debe tener al menos una endpoint para DESARROLLO`);
      if (!has_cal) errors.push(`Tabla ${sectionName} debe tener al menos una endpoint para CALIDAD`);
      if (!has_prd) errors.push(`Tabla ${sectionName} debe tener al menos una endpoint para PRODUCCION`);
      if (all_na) {
        notices.push(`Tabla ${sectionName} contiene solo valores NA (válido)`);
      } else {
        notices.push(`Tabla ${sectionName} validada correctamente`);
      }
    }

    if (!hasExterno && !hasInterno) {
      errors.push('Falta subsección DataPower Externo o Interno');
    } else {
      if (hasExterno) {
        if (isOnlyNA(dpExterno)) {
          notices.push("DataPower Externo contiene solo 'NA'/'N/A'/'No Aplica' (válido - sin tabla)");
        } else {
          validateDatapowerTable('DataPower Externo', dpExterno, true);
        }
      }
      if (hasInterno) {
        if (isOnlyNA(dpInterno)) {
          notices.push("DataPower Interno contiene solo 'NA'/'N/A'/'No Aplica' (válido - sin tabla)");
        } else {
          validateDatapowerTable('DataPower Interno', dpInterno, false);
        }
      }
    }
  }

  // 4) Endpoint BUS
  const endpointBusSection = getSubsection('^###\\s*Endpoint BUS');
  if (!endpointBusSection) {
    errors.push("Falta subsección 'Endpoint BUS'");
  } else {
    const rows = (endpointBusSection.split(/\r?\n/).filter(l => /^\|/.test(l))).slice();
    // find data rows after separator
    let dataRows = [];
    let inTable = false;
    for (const line of rows) {
      if (/^\|---/.test(line)) { inTable = true; continue; }
      if (inTable) dataRows.push(line);
    }
    if (dataRows.length === 0) {
      errors.push('Tabla Endpoint BUS no tiene filas de datos');
    } else {
      let has_des = false, has_cal = false, has_prd = false;
      for (const row of dataRows) {
        const cols = row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
        const ambiente = cols[1] || '';
        const endpoint = cols[3] || '';
        if (/^DESARROLLO/i.test(ambiente)) {
          has_des = true;
          if (/^NA$/i.test(endpoint)) errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          if (!/^https:\/\/adbog162e\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint BUS en DESARROLLO debe comenzar con https://adbog162e.bancodeoccidente.net. Encontrado: ${endpoint}`);
        } else if (/^CALIDAD/i.test(ambiente)) {
          has_cal = true;
          if (/^NA$/i.test(endpoint)) errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          if (!/^https:\/\/a[dt]bog16[34][de]\.bancodeoccidente\.net/i.test(endpoint)) errors.push(`Endpoint BUS en CALIDAD debe comenzar con nodos esperados. Encontrado: ${endpoint}`);
        } else if (/^PRODUCCION/i.test(ambiente)) {
          has_prd = true;
          if (/^NA$/i.test(endpoint)) errors.push(`Tabla Endpoint BUS no puede contener valores NA. Ambiente: ${ambiente}`);
          if (!(/^https:\/\/adbog16[56][ab]\.bancodeoccidente\.net/i.test(endpoint) || /^https?:\/\/boc060ap\.prd\.app\.bancodeoccidente\.net:/.test(endpoint))) errors.push(`Endpoint BUS en PRODUCCION debe comenzar con nodos esperados. Encontrado: ${endpoint}`);
        }
      }
      if (!has_des) errors.push('Tabla Endpoint BUS debe tener al menos una fila para DESARROLLO');
      if (!has_cal) errors.push('Tabla Endpoint BUS debe tener al menos una fila para CALIDAD');
      if (!has_prd) errors.push('Tabla Endpoint BUS debe tener al menos una fila para PRODUCCION');
      if (has_des && has_cal && has_prd) notices.push('Tabla Endpoint BUS contiene los 3 ambientes requeridos');
    }
  }

  // 5) CANALES - APLICACIONES
  const canalesSection = getSection('^##\\s*CANALES - APLICACIONES');
  if (!canalesSection) {
    errors.push("Falta sección 'CANALES - APLICACIONES'");
  } else {
    const canalesRows = canalesSection.split(/\r?\n/);
    const consumidorRow = canalesRows.find(l => /^\|\*\*Consumidor\*\*/i.test(l));
    if (!consumidorRow) {
      errors.push("No se encontró la fila '**Consumidor**' en la sección 'CANALES - APLICACIONES'.");
    } else {
      const consumidorValues = consumidorRow.replace(/^\|\*\*Consumidor\*\*\|/, '').replace(/\|$/,'').trim();
      if (!consumidorValues) errors.push("La fila 'Consumidor' en 'CANALES - APLICACIONES' está vacía. Debe tener al menos un valor o 'NA' si no aplica."); else notices.push(`La fila 'Consumidor' contiene valores: ${consumidorValues}`);
    }
    const backendsRow = canalesRows.find(l => /^\|\*\*Backends\*\*/i.test(l));
    if (!backendsRow) {
      errors.push("No se encontró la fila '**Backends**' en la sección 'CANALES - APLICACIONES'.");
    } else {
      const backendsValues = backendsRow.replace(/^\|\*\*Backends\*\*\|/, '').replace(/\|$/,'').trim();
      if (!backendsValues) errors.push("La fila 'Backends' en 'CANALES - APLICACIONES' está vacía. Debe tener al menos un valor o 'NA' si no aplica."); else notices.push(`La fila 'Backends' contiene valores: ${backendsValues}`);
    }
  }

  // 6) DEPENDENCIAS
  const dependencias = getSection('^##\\s*DEPENDENCIAS');
  if (!dependencias) {
    errors.push("Falta sección 'DEPENDENCIAS'");
  } else {
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
      const projectFile = findProjectFile(process.cwd());
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
    // XSL table
    const xslMatch = dependencias.match(/\|\s*XSL\s*\|[\s\S]*?(?=^\s*\r?\n|$)/im);
    if (!xslMatch) {
      errors.push("No se encontró la tabla 'XSL' en DEPENDENCIAS.");
    } else {
      const xslTable = xslMatch[0];
      const xslContent = xslTable.split(/\r?\n/).filter(l => l.trim() && !/^\|---/.test(l) && !/^\|\s*XSL\s*\|/i.test(l)).map(l => l.replace(/^\||\|$/g,'').trim()).join(' ');
      if (!xslContent) errors.push("La tabla 'XSL' en DEPENDENCIAS está vacía. Si no hay XSLs, debe colocarse explícitamente 'NA'.");
      else {
        if (/\bNA\b/i.test(xslContent)) notices.push("Tabla XSL contiene 'NA' (sin XSLs a consumir)."); else notices.push(`Tabla XSL contiene XSLs: ${xslContent}`);
      }
    }
  }

  // 7) DOCUMENTACION
  const docSection = getSection('^##\\s*DOCUMENTACION');
  if (!docSection) {
    errors.push("Falta sección 'DOCUMENTACION'");
  } else {
    notices.push("Sección 'DOCUMENTACION' válida");
    const docContent = docSection.replace(/^##.*\n?/, ' ').replace(/\r?\n/g, ' ');
    // Documento de diseño detallado
    if (/\*\*Documento de diseño detallado\*\*/i.test(docContent) || /Documento de diseño detallado/i.test(docContent)) {
      const disenoFragment = (docContent.match(/\*\*Documento de diseño detallado(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/:f:\/r\/sites\/BibliotecaAplicaciones\//i.test(disenoFragment)) notices.push("Enlace SharePoint válido para 'Documento de diseño detallado'"); else errors.push("El campo 'Documento de diseño detallado' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Documento de diseño detallado:**' en la sección DOCUMENTACION");
    }
    // Mapeo
    if (/\*\*Mapeo\*\*/i.test(docContent) || /Mapeo:/i.test(docContent)) {
      const mapeoFragment = (docContent.match(/\*\*Mapeo(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/:f:\/r\/sites\/BibliotecaAplicaciones\//i.test(mapeoFragment)) notices.push("Enlace SharePoint válido para 'Mapeo'"); else errors.push("El campo 'Mapeo' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Mapeo:**' en la sección DOCUMENTACION");
    }
    // Evidencias
    if (/Evidencias\s*\(Unitarias\/.+?\)/i.test(docContent) || /Evidencias/i.test(docContent)) {
      const evFragment = (docContent.match(/\*\*Evidencias[\s\S]*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      if (/https:\/\/bancoccidente\.sharepoint\.com\/:f:\/r\/sites\/BibliotecaAplicaciones\//i.test(evFragment)) notices.push("Enlace SharePoint válido para 'Evidencias'"); else errors.push("El campo 'Evidencias (Unitarias/Auditoria/Monitoreo)' debe tener un enlace que comience con 'https://bancoccidente.sharepoint.com/:f:/r/sites/BibliotecaAplicaciones/'");
    } else {
      errors.push("Falta campo '**Evidencias (Unitarias/Auditoria/Monitoreo):**' en la sección DOCUMENTACION");
    }
    // WSDL
    if (/\*\*WSDL\*\*/i.test(docContent) || /\*\*WSDL\*\*/i.test(docContent)) {
      const wsdlFragment = (docContent.match(/\*\*WSDL(?:\*\*)?:.*?(?=\*\*[A-Z]|$)/i) || [''])[0];
      const repo_name = (content.match(/^#\s*ESB_(.+)$/m) || ['',''])[1].replace(/\.$/, '').trim();
      const gitPattern = new RegExp(`git\\\\${repo_name}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
      if (gitPattern.test(wsdlFragment) || /^\s*N\/?A\s*$/i.test(wsdlFragment)) notices.push(`Ruta WSDL válida para repositorio '${repo_name}'`); else errors.push("El campo 'WSDL' debe comenzar con 'git\\${repo_name}\\Broker\\WSDL\\wsdl\\' o contener solo 'N/A'.");
    } else {
      errors.push("Falta campo '**WSDL:**' en la sección DOCUMENTACION");
    }
  }

  // 8) SQL
  const sqlSection = getSection('^##\\s*SQL');
  if (!sqlSection) {
    errors.push("Falta sección 'SQL'");
  } else {
    const sqlBody = sqlSection.replace(/^##.*\n?/, '');
    if (!/\S/.test(sqlBody)) {
      errors.push("La sección 'SQL' está vacía. Debe contener queries de auditoría y monitoreo.");
    } else {
      notices.push("La sección 'SQL' contiene contenido");
      // find lines with where ... = '...' or in(...)
      const lines = sqlBody.split(/\r?\n/);
      let foundQueries = [];
      for (const ln of lines) {
        if (/where.*=\s*'[^']*'/i.test(ln) || /where.*in\s*\(/i.test(ln)) foundQueries.push(ln.trim());
      }
      if (foundQueries.length === 0) {
        core.warning('No se encontraron queries SQL con códigos de operación en la sección SQL');
      } else {
        for (const q of foundQueries) {
          // = 'value'
          if (/=\s*'([^']+)'/.test(q)) {
            const val = q.match(/=\s*'([^']+)'/)[1];
            if (!/^\d+$/.test(val)) errors.push(`Código de operación contiene caracteres no numéricos. Solo se permiten números: ${q}`);
          }
          // in('a','b')
          const inMatch = q.match(/in\s*\(([^)]+)\)/i);
          if (inMatch) {
            const vals = inMatch[1].split(',').map(v => v.replace(/['" ]/g,'').trim()).filter(Boolean);
            for (const v of vals) {
              if (/\D/.test(v)) errors.push(`Código de operación contiene caracteres no numéricos en lista: '${v}' en línea: ${q}`);
            }
          }
        }
      }
    }
  }

  // Log notices and errors
  notices.forEach(n => core.info(`Notice: ${n}`));
  if (errors.length > 0) {
    errors.forEach(e => core.error(`Error: ${e}`));
    throw new Error('README.md no cumple con todos los requisitos de la plantilla.');
  }

  return true;
}

/**
 * Validate no BD folders exist
 */
async function validateNoBDFolders() {
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
  
  const bdFolders = findBDFolders(process.cwd());
  
  if (bdFolders.length > 0) {
    throw new Error(`Se encontraron carpetas 'BD' en el repositorio:\n${bdFolders.join('\n')}`);
  }
  
  return true;
}

/**
 * Validate execution groups match central configuration
 */
async function validateExecutionGroups(token) {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
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
    
    // Extract groups from README
    const deploymentMatch = content.match(/desplegar en los grupos de ejecución:\s*\n?([^\n#]+)/i);
    if (!deploymentMatch) {
      core.warning('No se encontró la frase "desplegar en los grupos de ejecución:" en el README');
      return true;
    }
    
    const readmeGroups = deploymentMatch[1]
      .split(/[\s,]+/)
      .filter(g => g.trim())
      .map(g => g.toLowerCase());
    
    // Download central configuration using @actions/github
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
    
    // Decode base64 content
    const configContent = Buffer.from(response.data.content, 'base64').toString('utf8');
    
    // Extract groups from config
    const transactionalMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Transactional=([^\n]+)`, 'i'));
    const notificationMatch = configContent.match(new RegExp(`ESB_ACE12_${serviceName}\\.Notification=([^\n]+)`, 'i'));
    
    if (!transactionalMatch && !notificationMatch) {
      throw new Error(`No existe entry ESB_ACE12_${serviceName}.Transactional ni ESB_ACE12_${serviceName}.Notification en el archivo de configuración`);
    }
    
    const configGroups = [
      ...(transactionalMatch ? transactionalMatch[1].split(',') : []),
      ...(notificationMatch ? notificationMatch[1].split(',') : [])
    ].map(g => g.trim().toLowerCase());
    
    // Compare groups
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
  const validReviewersInput = core.getInput('valid-reviewers') || 'DRamirezM,cdgomez,acardenasm,CAARIZA';
  const validReviewers = validReviewersInput.split(',').map(r => r.trim());
  
  const requestedReviewers = (payload.pull_request.requested_reviewers || []).map(r => r.login);
  
  // Check if any valid reviewer is assigned
  const hasValidReviewer = requestedReviewers.some(r => validReviewers.includes(r));
  
  // Validate develop → quality
  if (targetBranch === 'quality' && sourceBranch === 'develop') {
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para calidad. Autorizados: ${validReviewers.join(', ')}`);
    }
  }
  
  // Validate quality → main
  if (targetBranch === 'main' && sourceBranch === 'quality') {
    if (!hasValidReviewer) {
      throw new Error(`Falta revisor válido para producción. Autorizados: ${validReviewers.join(', ')}`);
    }
  }
  
  // Check for emergency exception (feature/** → develop)
  if (targetBranch === 'develop' && sourceBranch.startsWith('feature/')) {
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
      } catch (error) {
        core.debug(`No se pudieron verificar comentarios del PR: ${error.message}`);
      }
    }
  }
  
  return true;
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run, validateReadmeTemplate };

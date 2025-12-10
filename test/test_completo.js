// Test completo para validar los 4 problemas reportados
const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README_USUARIO.md');
const content = fs.readFileSync(readmePath, 'utf8');

console.log('='.repeat(80));
console.log('TEST COMPLETO - Simulando index.js con README del usuario');
console.log('='.repeat(80));

// ============================================================================
// TEST 1: DataPower Externo con "No aplica"
// ============================================================================
console.log('\n1️⃣  TEST: DataPower Externo');
console.log('-'.repeat(80));

// Extraer sección ACCESO AL SERVICIO como lo hace awk
const lines1 = content.split('\n');
let accesoSection = '';
let capturing1 = false;
for (const line of lines1) {
  if (/^## ACCESO AL SERVICIO/i.test(line)) {
    capturing1 = true;
    continue;
  }
  if (capturing1 && /^## /.test(line)) break;
  if (capturing1) accesoSection += line + '\n';
}

// Extraer subsección DataPower Externo
const lines2 = accesoSection.split('\n');
let dpExterno = '';
let capturing2 = false;
for (const line of lines2) {
  if (/^### DataPower Externo/i.test(line)) {
    capturing2 = true;
    continue;
  }
  if (capturing2 && /^### /.test(line)) break;
  if (capturing2) dpExterno += line + '\n';
}

console.log('Contenido DataPower Externo:');
console.log('---');
console.log(dpExterno);
console.log('---');

// Verificar si es solo NA
const cleanDP = dpExterno
  .replace(/<[^>]+>/g, '')
  .replace(/\*\*/g, '')
  .replace(/\r?\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
  
const isOnlyNA = /^(N\s*\/?\s*A|No\s+Aplica)$/i.test(cleanDP);
console.log(`Texto limpio: "${cleanDP}"`);
console.log(`¿Es solo NA? ${isOnlyNA}`);

if (isOnlyNA) {
  console.log('✅ CORRECTO: DataPower Externo contiene solo "No aplica" (válido - sin tabla)');
} else {
  // Buscar filas de tabla
  const dpLines = dpExterno.split('\n');
  let inTable = false;
  let rows = [];
  for (const line of dpLines) {
    if (/^\|---/.test(line)) { inTable = true; continue; }
    if (inTable && /^\|/.test(line)) rows.push(line);
  }
  console.log(`Filas de tabla encontradas: ${rows.length}`);
  if (rows.length === 0) {
    console.log('❌ ERROR: No se encontraron filas de datos');
  } else {
    console.log('✅ CORRECTO: Tabla con filas de datos');
  }
}

// ============================================================================
// TEST 2: WSDL
// ============================================================================
console.log('\n2️⃣  TEST: WSDL');
console.log('-'.repeat(80));

// Extraer sección DOCUMENTACION
const linesDoc = content.split('\n');
let docSection = '';
let capturingDoc = false;
for (const line of linesDoc) {
  if (/^## DOCUMENTACION/i.test(line)) {
    capturingDoc = true;
    continue;
  }
  if (capturingDoc && /^## /.test(line)) break;
  if (capturingDoc) docSection += line + '\n';
}

console.log('Sección DOCUMENTACION encontrada:', docSection.length > 0 ? 'SÍ' : 'NO');

// Buscar WSDL (como lo hace el shell con grep -Piq)
const hasWSDL = /\*\*WSDL(\*\*)?:/i.test(docSection);
console.log(`¿Tiene **WSDL:**? ${hasWSDL}`);

if (hasWSDL) {
  // Extraer fragmento WSDL (hasta siguiente **CAMPO o fin)
  const wsdlStartIndex = docSection.search(/\*\*WSDL(\*\*)?:/i);
  console.log(`Índice inicio WSDL: ${wsdlStartIndex}`);
  
  if (wsdlStartIndex >= 0) {
    const afterWSDL = docSection.substring(wsdlStartIndex);
    const nextFieldMatch = afterWSDL.substring(10).search(/\*\*[A-Z]/);
    const wsdlFragment = nextFieldMatch > 0 
      ? afterWSDL.substring(0, 10 + nextFieldMatch)
      : afterWSDL;
    
    console.log('\nFragmento WSDL capturado:');
    console.log('---');
    console.log(wsdlFragment);
    console.log('---');
    
    // Extraer nombre repositorio COMPLETO incluyendo ESB_ (como hace checklist.yml)
    const titleMatch = content.match(/^#\s*(ESB_.+)$/m);
    const repoName = titleMatch ? titleMatch[1].replace(/\.$/, '').trim() : '';
    console.log(`\nRepositorio: ${repoName}`);
    
    // Verificar patrón git\repo\Broker\WSDL\wsdl\
    const gitPattern = new RegExp(`git\\\\${repoName}\\\\Broker\\\\WSDL\\\\wsdl\\\\`, 'i');
    const matches = gitPattern.test(wsdlFragment);
    
    console.log(`Patrón esperado: git\\${repoName}\\Broker\\WSDL\\wsdl\\`);
    console.log(`¿Coincide? ${matches}`);
    
    if (matches) {
      console.log('✅ CORRECTO: WSDL válido');
    } else {
      console.log('❌ ERROR: WSDL no coincide con patrón');
    }
  }
}

// ============================================================================
// TEST 3: Grupos de ejecución
// ============================================================================
console.log('\n3️⃣  TEST: Grupos de ejecución');
console.log('-'.repeat(80));

// Extraer sección Procedimiento de despliegue
const linesDep = content.split('\n');
let deploySection = '';
let capturingDep = false;
for (const line of linesDep) {
  if (/^## Procedimiento de despliegue/i.test(line)) {
    capturingDep = true;
    continue;
  }
  if (capturingDep && /^## /.test(line)) break;
  if (capturingDep) deploySection += line + '\n';
}

console.log('Sección Procedimiento de despliegue:');
console.log('---');
console.log(deploySection);
console.log('---');

// Buscar línea con "desplegar en los grupos de ejecución:"
const deployLines = deploySection.split('\n');
let groupsText = '';
for (let i = 0; i < deployLines.length; i++) {
  const line = deployLines[i];
  if (/desplegar en los grupos de ejecución:/i.test(line)) {
    console.log(`\n✅ Frase encontrada en línea ${i}: "${line}"`);
    
    // Intentar capturar en misma línea
    const sameLineMatch = line.match(/desplegar en los grupos de ejecución:\s*(.+)/i);
    if (sameLineMatch && sameLineMatch[1].trim()) {
      groupsText = sameLineMatch[1].trim();
      console.log(`Grupos en misma línea: "${groupsText}"`);
    } else if (i + 1 < deployLines.length) {
      // Capturar siguiente línea (getline)
      groupsText = deployLines[i + 1].trim();
      console.log(`Grupos en siguiente línea: "${groupsText}"`);
    }
    break;
  }
}

if (groupsText) {
  const groups = groupsText.split(/[\s,]+/).filter(g => g.trim());
  console.log(`\n✅ CORRECTO: ${groups.length} grupos encontrados`);
  console.log('Grupos:', groups);
} else {
  console.log('❌ ERROR: No se encontraron grupos');
}

// ============================================================================
// TEST 4: Tabla XSL
// ============================================================================
console.log('\n4️⃣  TEST: Tabla XSL');
console.log('-'.repeat(80));

// Extraer sección DEPENDENCIAS
const linesDeps = content.split('\n');
let depsSection = '';
let capturingDeps = false;
for (const line of linesDeps) {
  if (/^## DEPENDENCIAS/i.test(line)) {
    capturingDeps = true;
    continue;
  }
  if (capturingDeps && /^## /.test(line)) break;
  if (capturingDeps) depsSection += line + '\n';
}

// Extraer tabla XSL
const depsLines = depsSection.split('\n');
let xslLines = [];
let captureXSL = false;
for (const line of depsLines) {
  if (/^\|XSL\|/i.test(line)) {
    captureXSL = true;
    xslLines.push(line);
    continue;
  }
  if (captureXSL) {
    if (/^## /.test(line)) break;
    xslLines.push(line);
  }
}

console.log(`Líneas XSL capturadas: ${xslLines.length}`);
console.log('Contenido:');
console.log('---');
xslLines.forEach((line, i) => console.log(`${i}: ${line}`));
console.log('---');

// Contar filas de datos
let xslDataRows = [];
let foundSeparator = false;
for (const line of xslLines) {
  if (/^\|---/.test(line)) { foundSeparator = true; continue; }
  if (foundSeparator && /^\|/.test(line)) {
    const content = line.replace(/^\||\|$/g, '').trim();
    if (content) xslDataRows.push(content);
  }
}

console.log(`\nFilas de datos: ${xslDataRows.length}`);
if (xslDataRows.length > 0) {
  console.log('✅ CORRECTO: Tabla XSL con', xslDataRows.length, 'XSLs');
  xslDataRows.forEach(row => console.log(`  - ${row}`));
} else {
  console.log('❌ ERROR: Tabla XSL vacía');
}

console.log('\n' + '='.repeat(80));
console.log('FIN DE TESTS');
console.log('='.repeat(80));

// ============================================
// CONFIGURACIÓN: Modo de datos
// ============================================
const USE_MOCK_DATA = true; // Cambiar a false cuando Firebase esté listo

// ============================================
// DATOS MOCK (solo para desarrollo)
// ============================================
const mockData = [
  {
    id: '1', nombre: 'Juan', apellido: 'Pérez', dni: '12345678', edad: 35,
    relacionHogar: 'Padre', sexo: 'Masculino', householdId: 'household_1',
    household: { id: 'household_1', grupoFamiliar: 'Pérez-García',
      direccion: { calle: 'San Martín', numero: '123', barrio: 'Centro' }},
    flags: { hasDisability: false, hasBenefit: true },
    benefit: { nombre: 'AUH' }, creadoEn: { toDate: () => new Date('2024-01-15') }
  },
  {
    id: '2', nombre: 'María', apellido: 'García', dni: '87654321', edad: 32,
    relacionHogar: 'Madre', sexo: 'Femenino', householdId: 'household_1',
    household: { id: 'household_1', grupoFamiliar: 'Pérez-García',
      direccion: { calle: 'San Martín', numero: '123', barrio: 'Centro' }},
    flags: { hasDisability: true, hasBenefit: false },
    disability: { tipo: 'Visual' }, creadoEn: { toDate: () => new Date('2024-01-15') }
  },
  {
    id: '3', nombre: 'Carlos', apellido: 'Pérez', dni: '11223344', edad: 8,
    relacionHogar: 'Hijo', sexo: 'Masculino', householdId: 'household_1',
    household: { id: 'household_1', grupoFamiliar: 'Pérez-García',
      direccion: { calle: 'San Martín', numero: '123', barrio: 'Centro' }},
    flags: { hasDisability: false, hasBenefit: true },
    benefit: { nombre: 'AUH' }, creadoEn: { toDate: () => new Date('2024-01-15') }
  },
  {
    id: '4', nombre: 'Ana', apellido: 'López', dni: '55667788', edad: 67,
    relacionHogar: 'Abuela', sexo: 'Femenino', householdId: 'household_2',
    household: { id: 'household_2', grupoFamiliar: 'López',
      direccion: { calle: 'Córdoba', numero: '789', barrio: 'Pichincha' }},
    flags: { hasDisability: true, hasBenefit: true },
    disability: { tipo: 'Motriz' }, benefit: { nombre: 'Pensión' },
    creadoEn: { toDate: () => new Date('2024-01-20') }
  },
  {
    id: '5', nombre: 'Elena', apellido: 'López', dni: '33445566', edad: 24,
    relacionHogar: 'Nieta', sexo: 'Femenino', householdId: 'household_2',
    household: { id: 'household_2', grupoFamiliar: 'López',
      direccion: { calle: 'Córdoba', numero: '789', barrio: 'Pichincha' }},
    flags: { hasDisability: false, hasBenefit: true },
    benefit: { nombre: 'Beca Progresar' }, creadoEn: { toDate: () => new Date('2024-01-20') }
  }
];

// ============================================
// VARIABLES GLOBALES
// ============================================
let allData = USE_MOCK_DATA ? mockData : [];
let filteredData = [];
const itemsPerPage = 10;
let currentPage = 1;
let currentUserRole = null;

// ============================================
// AUTENTICACIÓN
// ============================================
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentUser = sessionStorage.getItem('currentUser');
  const userRole = sessionStorage.getItem('userRole');

  if (isLoggedIn === 'true' && currentUser) {
    currentUserRole = userRole || 'admin';
    
    // Mostrar info del usuario
    const userInfo = document.createElement('div');
    userInfo.style.cssText = 'position: fixed; top: 10px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; z-index: 1000;';
    userInfo.textContent = `Conectado como: ${getRoleDisplay(currentUserRole)} - ${currentUser}`;
    document.body.appendChild(userInfo);
    
    setupRolePermissions(currentUserRole);
    return true;
  } else {
    alert('Acceso denegado. Debe iniciar sesión.');
    window.location.href = 'index.html';
    return false;
  }
}

function getRoleDisplay(role) {
  const roles = {
    'admin': 'Administrador',
    'operador': 'Operador', 
    'lectura': 'Solo Lectura'
  };
  return roles[role] || 'Usuario';
}

function handleLogout() {
  if (confirm('¿Desea cerrar la sesión?')) {
    sessionStorage.clear();
    alert('Sesión cerrada exitosamente');
    window.location.href = 'index.html';
  }
}

// ============================================
// PERMISOS POR ROL
// ============================================
function setupRolePermissions(userRole) {
  showRoleBanner(userRole);
  
  const userManagementLink = document.getElementById('userManagementLink');
  const exportButton = document.querySelector('[onclick="exportData()"]');
  
  if (userRole === 'lectura') {
    // Solo lectura: máximas restricciones
    if (userManagementLink) userManagementLink.style.display = 'none';
    if (exportButton) exportButton.style.display = 'none';
    
  } else if (userRole === 'operador') {
    // Operador: restricciones medias
    if (userManagementLink) userManagementLink.style.display = 'none';
    
  } else if (userRole === 'admin') {
    // Admin: acceso completo
    if (userManagementLink) userManagementLink.style.display = 'inline-block';
  }
}

function showRoleBanner(userRole) {
  let message = '';
  let bgColor = '';
  let restrictions = '';
  
  switch(userRole) {
    case 'admin':
      message = '🔧 ADMINISTRADOR';
      restrictions = 'Acceso completo: Ver • Crear • Editar • Eliminar • Exportar • Gestionar usuarios';
      bgColor = 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      break;
      
    case 'operador':
      message = '👤 OPERADOR';
      restrictions = 'Puede: Ver • Crear • Editar • Eliminar (con confirmación) • Exportar | No puede: Gestionar usuarios';
      bgColor = 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      break;
      
    case 'lectura':
      message = '👁️ SOLO LECTURA';
      restrictions = 'Puede: Ver datos • Usar filtros | No puede: Modificar • Eliminar • Exportar • Gestionar usuarios';
      bgColor = 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      break;
  }
  
  const banner = document.createElement('div');
  banner.id = 'roleBanner';
  banner.style.cssText = `
    position: fixed; top: 50px; left: 20px; right: 20px; padding: 12px 15px; 
    border-radius: 6px; font-size: 14px; z-index: 999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1); ${bgColor}
  `;
  
  banner.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">${message}</div>
    <div style="font-size: 13px;">${restrictions}</div>
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 8px; right: 12px; background: none; border: none; font-size: 18px; cursor: pointer; color: inherit;">×</button>
  `;
  
  document.body.appendChild(banner);
  
  setTimeout(() => {
    if (document.getElementById('roleBanner')) {
      banner.remove();
    }
  }, 12000);
}

// ============================================
// ESTADÍSTICAS
// ============================================
function calculateStats() {
  const totalPersons = allData.length;
  const uniqueHouseholds = new Set(allData.map(person => person.householdId));
  const totalHouseholds = uniqueHouseholds.size;
  const averageSize = totalHouseholds > 0 ? (totalPersons / totalHouseholds).toFixed(1) : 0;
  const withDisabilities = allData.filter(p => p.flags?.hasDisability).length;
  const withBenefits = allData.filter(p => p.flags?.hasBenefit).length;
  const minors = allData.filter(p => p.edad && p.edad < 18).length;

  return { totalHouseholds, totalPersons, averageSize, withDisabilities, withBenefits, minors };
}

function updateStats() {
  const stats = calculateStats();
  document.getElementById('totalHouseholds').textContent = stats.totalHouseholds;
  document.getElementById('totalPersons').textContent = stats.totalPersons;
  document.getElementById('averageHouseholdSize').textContent = stats.averageSize;
  document.getElementById('totalDisabilities').textContent = stats.withDisabilities;
  document.getElementById('totalBenefits').textContent = stats.withBenefits;
  document.getElementById('totalMinors').textContent = stats.minors;
}

// ============================================
// FILTROS
// ============================================
function populateHouseholdFilter() {
  const householdFilter = document.getElementById('filterHousehold');
  const uniqueHouseholds = [...new Set(allData.map(p => p.household.grupoFamiliar))].sort();
  householdFilter.innerHTML = '<option value="">Todas las familias</option>' +
    uniqueHouseholds.map(household => `<option value="${household}">${household}</option>`).join('');
}

function filterData() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const relationFilter = document.getElementById('filterRelation').value;
  const disabilityFilter = document.getElementById('filterDisability').value;
  const householdFilter = document.getElementById('filterHousehold').value;

  filteredData = allData.filter(person => {
    const matchesSearch = searchMatches(person, searchTerm);
    const matchesRelation = !relationFilter || person.relacionHogar === relationFilter;
    const matchesDisability = disabilityMatches(person, disabilityFilter);
    const matchesHousehold = !householdFilter || person.household.grupoFamiliar === householdFilter;
    
    return matchesSearch && matchesRelation && matchesDisability && matchesHousehold;
  });

  currentPage = 1;
  displayData();
}

function searchMatches(person, searchTerm) {
  if (!searchTerm) return true;
  return [
    person.nombre, person.apellido, person.dni, person.household.grupoFamiliar,
    person.household.direccion?.calle || '', person.household.direccion?.barrio || ''
  ].some(field => field.toLowerCase().includes(searchTerm));
}

function disabilityMatches(person, disabilityFilter) {
  if (!disabilityFilter) return true;
  return (disabilityFilter === 'true' && person.flags?.hasDisability) ||
         (disabilityFilter === 'false' && !person.flags?.hasDisability);
}

// ============================================
// TABLA DE DATOS
// ============================================
function displayData() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);
  const tbody = document.getElementById('dataTableBody');
  
  if (pageData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading">No se encontraron resultados</td></tr>';
    document.getElementById('resultCount').textContent = '0 resultados';
    return;
  }

  tbody.innerHTML = pageData.map(person => createTableRow(person, currentUserRole)).join('');
  document.getElementById('resultCount').textContent = `${filteredData.length} resultado${filteredData.length !== 1 ? 's' : ''}`;
}

function createTableRow(person, userRole) {
  const direccion = person.household.direccion || {};
  const direccionCompleta = [direccion.calle, direccion.numero, direccion.barrio].filter(Boolean).join(' ');
  const fechaRegistro = person.creadoEn.toDate().toLocaleDateString('es-AR');

  // Botones según el rol
  let actionButtons = '';
  
  if (userRole === 'lectura') {
    actionButtons = `<button class="btn btn-secondary btn-small" onclick="viewDetails('${person.id}', true)">Consultar</button>`;
  } else if (userRole === 'operador') {
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="viewDetails('${person.id}', false)">Ver</button>
      <button class="btn btn-danger btn-small" onclick="deletePerson('${person.id}', true)">Eliminar</button>
    `;
  } else {
    // admin
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="viewDetails('${person.id}', false)">Ver</button>
      <button class="btn btn-danger btn-small" onclick="deletePerson('${person.id}', false)">Eliminar</button>
    `;
  }

  return `
    <tr>
      <td><strong>${person.nombre} ${person.apellido}</strong></td>
      <td>${person.dni || 'N/A'}</td>
      <td>${person.edad || 'N/A'}</td>
      <td>${person.relacionHogar || 'N/A'}</td>
      <td><strong>${person.household.grupoFamiliar || 'N/A'}</strong></td>
      <td>${direccionCompleta || 'N/A'}</td>
      <td>${formatDisabilityBadge(person)}</td>
      <td>${formatBenefitBadge(person)}</td>
      <td>${fechaRegistro}</td>
      <td>${actionButtons}</td>
    </tr>
  `;
}

function formatDisabilityBadge(person) {
  if (person.flags?.hasDisability) {
    const tipo = person.disability?.tipo || 'N/E';
    return `<span class="status-badge status-active">Sí - ${tipo}</span>`;
  }
  return '<span class="status-badge status-disabled">No</span>';
}

function formatBenefitBadge(person) {
  if (person.flags?.hasBenefit) {
    const nombre = person.benefit?.nombre || 'Sí';
    return `<span class="status-badge status-active">${nombre}</span>`;
  }
  return '<span class="status-badge status-disabled">No</span>';
}

// ============================================
// ACCIONES
// ============================================
function viewDetails(personId, isReadOnly) {
  const person = allData.find(p => p.id === personId);
  if (!person) return;
  
  const readOnlyWarning = isReadOnly ? '\n\n⚠️ Usuario de solo lectura - No puede modificar datos' : '';
  
  const details = [
    isReadOnly ? '=== CONSULTA DE DATOS (SOLO LECTURA) ===' : 'Detalles completos:',
    '',
    `Nombre: ${person.nombre} ${person.apellido}`,
    `DNI: ${person.dni}`,
    `Edad: ${person.edad}`,
    `Sexo: ${person.sexo}`,
    `Relación: ${person.relacionHogar}`,
    `Grupo Familiar: ${person.household.grupoFamiliar}`,
    `Dirección: ${[person.household.direccion?.calle, person.household.direccion?.numero, person.household.direccion?.barrio].filter(Boolean).join(' ')}`,
    `Discapacidad: ${person.flags?.hasDisability ? 'Sí - ' + (person.disability?.tipo || 'N/E') : 'No'}`,
    `Beneficios: ${person.flags?.hasBenefit ? person.benefit?.nombre || 'Sí' : 'No'}`,
    readOnlyWarning
  ].join('\n');
  
  alert(details);
}

function deletePerson(personId, needsConfirmation) {
  const person = allData.find(p => p.id === personId);
  if (!person) return;
  
  const message = needsConfirmation 
    ? `⚠️ CONFIRMACIÓN DE OPERADOR\n\nEstá a punto de eliminar:\n${person.nombre} ${person.apellido} (DNI: ${person.dni})\n\nEsta acción no se puede deshacer.\n\n¿Confirma la eliminación?`
    : `¿Está seguro de que desea eliminar este registro?\n\n${person.nombre} ${person.apellido}`;
  
  if (confirm(message)) {
    allData = allData.filter(p => p.id !== personId);
    loadData();
    const user = sessionStorage.getItem('currentUser');
    alert(`✅ Registro eliminado${needsConfirmation ? ' por operador: ' + user : ' exitosamente'}`);
  }
}

function exportData() {
  const userRole = sessionStorage.getItem('userRole');
  
  if (userRole === 'lectura') {
    alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden exportar datos.\n\nContacte a un administrador.');
    return;
  }
  
  alert('Función de exportación (requiere configuración adicional)');
}

// ============================================
// CARGA INICIAL
// ============================================
function loadData() {
  updateStats();
  populateHouseholdFilter();
  filteredData = [...allData];
  displayData();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('input', filterData);
  document.getElementById('filterRelation').addEventListener('change', filterData);
  document.getElementById('filterDisability').addEventListener('change', filterData);
  document.getElementById('filterHousehold').addEventListener('change', filterData);

  if (checkAuth()) {
    loadData();
  }
});

// ============================================
// FUNCIONES GLOBALES (para onclick en HTML)
// ============================================
window.viewDetails = viewDetails;
window.deletePerson = deletePerson;
window.exportData = exportData;
window.handleLogout = handleLogout;
window.loadData = loadData;
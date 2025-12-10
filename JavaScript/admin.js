// JavaScript/admin.js - VERSIÓN LOCALSTORAGE CON DATOS MOCK

// ============================================
// VARIABLES GLOBALES
// ============================================
let allData = [];
let filteredData = [];
const itemsPerPage = 10;
let currentPage = 1;

// ============================================
// DATOS MOCK INICIALES
// ============================================
function initializeMockData() {
  console.log('📦 Inicializando datos mock de ejemplo...');
  
  const mockHouseholds = {
    'household_001': {
      id: 'household_001',
      grupoFamiliar: 'Familia González',
      vivienda: 'Propia',
      direccion: {
        calle: 'San Martín',
        numero: '1234',
        barrio: 'Centro',
        ciudad: 'Rosario',
        provincia: 'Santa Fe'
      },
      miembros: [],
      creadoEn: new Date('2024-01-15').toISOString()
    },
    'household_002': {
      id: 'household_002',
      grupoFamiliar: 'Familia Rodríguez',
      vivienda: 'Alquilada',
      direccion: {
        calle: 'Belgrano',
        numero: '567',
        barrio: 'Alberdi',
        ciudad: 'Rosario',
        provincia: 'Santa Fe'
      },
      miembros: [],
      creadoEn: new Date('2024-02-10').toISOString()
    },
    'household_003': {
      id: 'household_003',
      grupoFamiliar: 'Familia Martínez',
      vivienda: 'Propia',
      direccion: {
        calle: 'Córdoba',
        numero: '890',
        barrio: 'Fisherton',
        ciudad: 'Rosario',
        provincia: 'Santa Fe'
      },
      miembros: [],
      creadoEn: new Date('2024-03-05').toISOString()
    }
  };
  
  const mockPersons = [
    {
      id: 'person_001',
      householdId: 'household_001',
      relacionHogar: 'Padre',
      nombre: 'Carlos',
      apellido: 'González',
      dni: '25678901',
      cuit: '20-25678901-3',
      fechaNacimiento: '1980-05-15',
      edad: 44,
      sexo: 'Masculino',
      correo: 'carlos.gonzalez@email.com',
      tel: '341-5551234',
      ocupacion: 'Empleado de comercio',
      estadoCivil: 'Casado/a',
      educacion: {
        nivelActual: 'Secundario',
        institucion: 'Escuela Técnica N° 1',
        estado: 'Completo',
        anteriores: []
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        tratamientoMedico: false,
        conCUD: false,
        cudVencimiento: ''
      },
      beneficioSocial: {
        tiene: false,
        nombre: '',
        organismo: '',
        estado: ''
      },
      obraSocial: {
        tiene: true,
        nombre: 'IAPOS'
      },
      flags: {
        esMayor: true,
        hasDisability: false,
        hasBenefit: false,
        hasObraSocial: true
      },
      creadoEn: new Date('2024-01-15').toISOString()
    },
    {
      id: 'person_002',
      householdId: 'household_001',
      relacionHogar: 'Madre',
      nombre: 'María',
      apellido: 'González',
      dni: '27890123',
      cuit: '27-27890123-4',
      fechaNacimiento: '1982-08-20',
      edad: 42,
      sexo: 'Femenino',
      correo: 'maria.gonzalez@email.com',
      tel: '341-5551234',
      ocupacion: 'Docente',
      estadoCivil: 'Casado/a',
      educacion: {
        nivelActual: 'Universitario',
        institucion: 'UNR',
        estado: 'Completo',
        anteriores: []
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        tratamientoMedico: false,
        conCUD: false,
        cudVencimiento: ''
      },
      beneficioSocial: {
        tiene: false,
        nombre: '',
        organismo: '',
        estado: ''
      },
      obraSocial: {
        tiene: true,
        nombre: 'IAPOS'
      },
      flags: {
        esMayor: true,
        hasDisability: false,
        hasBenefit: false,
        hasObraSocial: true
      },
      creadoEn: new Date('2024-01-15').toISOString()
    },
    {
      id: 'person_003',
      householdId: 'household_001',
      relacionHogar: 'Hijo',
      nombre: 'Lucas',
      apellido: 'González',
      dni: '45123456',
      cuit: '',
      fechaNacimiento: '2010-03-10',
      edad: 14,
      sexo: 'Masculino',
      correo: '',
      tel: '',
      ocupacion: 'Estudiante',
      estadoCivil: 'Soltero/a',
      educacion: {
        nivelActual: 'Secundario',
        institucion: 'Escuela N° 123',
        estado: 'Cursando',
        anteriores: []
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        tratamientoMedico: false,
        conCUD: false,
        cudVencimiento: ''
      },
      beneficioSocial: {
        tiene: true,
        nombre: 'AUH',
        organismo: 'ANSES',
        estado: 'Activo'
      },
      obraSocial: {
        tiene: true,
        nombre: 'IAPOS'
      },
      flags: {
        esMayor: false,
        hasDisability: false,
        hasBenefit: true,
        hasObraSocial: true
      },
      creadoEn: new Date('2024-01-15').toISOString()
    },
    {
      id: 'person_004',
      householdId: 'household_002',
      relacionHogar: 'Madre',
      nombre: 'Ana',
      apellido: 'Rodríguez',
      dni: '30456789',
      cuit: '27-30456789-5',
      fechaNacimiento: '1985-11-25',
      edad: 39,
      sexo: 'Femenino',
      correo: 'ana.rodriguez@email.com',
      tel: '341-5557890',
      ocupacion: 'Desempleada',
      estadoCivil: 'Divorciado/a',
      educacion: {
        nivelActual: 'Secundario',
        institucion: 'Escuela N° 45',
        estado: 'Incompleto',
        anteriores: []
      },
      discapacidad: {
        tiene: true,
        tipo: 'Visual',
        tratamientoMedico: true,
        conCUD: true,
        cudVencimiento: '2025-06-30'
      },
      beneficioSocial: {
        tiene: true,
        nombre: 'Pensión por discapacidad',
        organismo: 'ANSES',
        estado: 'Activo'
      },
      obraSocial: {
        tiene: true,
        nombre: 'PAMI'
      },
      flags: {
        esMayor: true,
        hasDisability: true,
        hasBenefit: true,
        hasObraSocial: true
      },
      creadoEn: new Date('2024-02-10').toISOString()
    },
    {
      id: 'person_005',
      householdId: 'household_002',
      relacionHogar: 'Hija',
      nombre: 'Sofía',
      apellido: 'Rodríguez',
      dni: '48234567',
      cuit: '',
      fechaNacimiento: '2015-07-18',
      edad: 9,
      sexo: 'Femenino',
      correo: '',
      tel: '',
      ocupacion: 'Estudiante',
      estadoCivil: 'Soltero/a',
      educacion: {
        nivelActual: 'Primario',
        institucion: 'Escuela Primaria N° 78',
        estado: 'Cursando',
        anteriores: []
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        tratamientoMedico: false,
        conCUD: false,
        cudVencimiento: ''
      },
      beneficioSocial: {
        tiene: true,
        nombre: 'AUH',
        organismo: 'ANSES',
        estado: 'Activo'
      },
      obraSocial: {
        tiene: false,
        nombre: ''
      },
      flags: {
        esMayor: false,
        hasDisability: false,
        hasBenefit: true,
        hasObraSocial: false
      },
      creadoEn: new Date('2024-02-10').toISOString()
    },
    {
      id: 'person_006',
      householdId: 'household_003',
      relacionHogar: 'Abuela',
      nombre: 'Rosa',
      apellido: 'Martínez',
      dni: '12345678',
      cuit: '27-12345678-9',
      fechaNacimiento: '1950-04-12',
      edad: 74,
      sexo: 'Femenino',
      correo: '',
      tel: '341-5553456',
      ocupacion: 'Jubilada',
      estadoCivil: 'Viudo/a',
      educacion: {
        nivelActual: 'Primario',
        institucion: '',
        estado: 'Completo',
        anteriores: []
      },
      discapacidad: {
        tiene: true,
        tipo: 'Motriz',
        tratamientoMedico: true,
        conCUD: true,
        cudVencimiento: '2026-12-31'
      },
      beneficioSocial: {
        tiene: true,
        nombre: 'Jubilación',
        organismo: 'ANSES',
        estado: 'Activo'
      },
      obraSocial: {
        tiene: true,
        nombre: 'PAMI'
      },
      flags: {
        esMayor: true,
        hasDisability: true,
        hasBenefit: true,
        hasObraSocial: true
      },
      creadoEn: new Date('2024-03-05').toISOString()
    }
  ];
  
  // Actualizar miembros en households
  mockHouseholds['household_001'].miembros = [
    { personId: 'person_001', relacionHogar: 'Padre', nombre: 'Carlos', apellido: 'González', dni: '25678901', cuit: '20-25678901-3', edad: 44, sexo: 'Masculino' },
    { personId: 'person_002', relacionHogar: 'Madre', nombre: 'María', apellido: 'González', dni: '27890123', cuit: '27-27890123-4', edad: 42, sexo: 'Femenino' },
    { personId: 'person_003', relacionHogar: 'Hijo', nombre: 'Lucas', apellido: 'González', dni: '45123456', cuit: '', edad: 14, sexo: 'Masculino' }
  ];
  
  mockHouseholds['household_002'].miembros = [
    { personId: 'person_004', relacionHogar: 'Madre', nombre: 'Ana', apellido: 'Rodríguez', dni: '30456789', cuit: '27-30456789-5', edad: 39, sexo: 'Femenino' },
    { personId: 'person_005', relacionHogar: 'Hija', nombre: 'Sofía', apellido: 'Rodríguez', dni: '48234567', cuit: '', edad: 9, sexo: 'Femenino' }
  ];
  
  mockHouseholds['household_003'].miembros = [
    { personId: 'person_006', relacionHogar: 'Abuela', nombre: 'Rosa', apellido: 'Martínez', dni: '12345678', cuit: '27-12345678-9', edad: 74, sexo: 'Femenino' }
  ];
  
  // Guardar en localStorage
  localStorage.setItem('cic_households', JSON.stringify(mockHouseholds));
  localStorage.setItem('cic_persons', JSON.stringify(mockPersons));
  
  console.log('✅ Datos mock inicializados: 3 familias, 6 personas');
}

// ============================================
// CARGAR DATOS DESDE LOCALSTORAGE
// ============================================
function loadFromLocalStorage() {
  console.log('📦 Cargando datos desde localStorage...');
  
  try {
    // 1. Cargar personas
    let persons = JSON.parse(localStorage.getItem('cic_persons') || '[]');
    
    // 2. Cargar households
    let households = JSON.parse(localStorage.getItem('cic_households') || '{}');
    
    // 3. Si no hay datos, inicializar con mock
    if (persons.length === 0 || Object.keys(households).length === 0) {
      console.log('⚠️ No hay datos en localStorage, inicializando con datos de ejemplo...');
      initializeMockData();
      persons = JSON.parse(localStorage.getItem('cic_persons') || '[]');
      households = JSON.parse(localStorage.getItem('cic_households') || '{}');
    }
    
    // 4. Combinar datos
    allData = persons.map(person => {
      const household = households[person.householdId] || {
        id: person.householdId,
        grupoFamiliar: 'N/A',
        direccion: {}
      };
      
      return {
        ...person,
        household: household,
        disability: person.discapacidad?.tiene ? {
          tipo: person.discapacidad.tipo,
          tratamientoMedico: person.discapacidad.tratamientoMedico,
          conCUD: person.discapacidad.conCUD,
          cudVencimiento: person.discapacidad.cudVencimiento
        } : null,
        benefit: person.beneficioSocial?.tiene ? {
          nombre: person.beneficioSocial.nombre,
          organismo: person.beneficioSocial.organismo,
          estado: person.beneficioSocial.estado
        } : null,
        creadoEn: {
          toDate: () => new Date(person.creadoEn)
        }
      };
    });
    
    console.log(`✅ ${allData.length} registros cargados`);
    
    // Si no hay datos, mostrar mensaje
    if (allData.length === 0) {
      const tbody = document.getElementById('dataTableBody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #666;"><strong>📝 No hay registros todavía</strong><br><br>Los formularios completados aparecerán aquí</td></tr>';
      }
    }
    
    loadData();
    
  } catch (error) {
    console.error('❌ Error cargando desde localStorage:', error);
    alert('Error al cargar datos: ' + error.message);
  }
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentUser = sessionStorage.getItem('currentUser');
  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = sessionStorage.getItem('isAdmin');
  const adminUser = sessionStorage.getItem('adminUser');
  
  if ((isLoggedIn === 'true' && currentUser) || (isAdmin === 'true' && adminUser)) {
    const displayUser = currentUser || adminUser;
    const displayRole = userRole || 'admin';
    
    const userInfo = document.createElement('div');
    userInfo.style.cssText = 'position: fixed; top: 10px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; z-index: 1000;';
    userInfo.textContent = `Conectado como: ${getRoleDisplay(displayRole)} - ${displayUser}`;
    document.body.appendChild(userInfo);
    
    setupRolePermissions(displayRole);
    return true;
  } else {
    alert('Acceso denegado. Debe iniciar sesión.');
   window.location.href = 'admin-login.html';
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

function setupRolePermissions(userRole) {
  showRoleBanner(userRole);
  
  const userManagementLink = document.getElementById('userManagementLink');
  const exportButton = document.querySelector('[onclick="exportData()"]');
  
  if (userRole === 'lectura') {
    if (userManagementLink) userManagementLink.style.display = 'none';
    if (exportButton) exportButton.style.display = 'none';
    
    window.originalCreateTableRow = createTableRow;
    window.createTableRow = function(person) {
      const direccion = person.household.direccion || {};
      const direccionCompleta = [direccion.calle, direccion.numero, direccion.barrio].filter(Boolean).join(' ');
      const fechaRegistro = person.creadoEn.toDate().toLocaleDateString('es-AR');
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
          <td>
            <button class="btn btn-secondary btn-small" onclick="viewDetailsReadOnly('${person.id}')">Consultar</button>
          </td>
        </tr>
      `;
    };
    
    window.viewDetailsReadOnly = function(personId) {
      const person = allData.find(p => p.id === personId);
      if (!person) return;
      
      const details = [
        `=== CONSULTA DE DATOS (SOLO LECTURA) ===`,
        ``,
        `Nombre: ${person.nombre} ${person.apellido}`,
        `DNI: ${person.dni}`,
        `CUIT: ${person.cuit || 'N/A'}`,
        `Edad: ${person.edad}`,
        `Sexo: ${person.sexo}`,
        `Relación: ${person.relacionHogar}`,
        `Grupo Familiar: ${person.household.grupoFamiliar}`,
        `Dirección: ${[person.household.direccion?.calle, person.household.direccion?.numero, person.household.direccion?.barrio].filter(Boolean).join(' ')}`,
        `Discapacidad: ${person.flags?.hasDisability ? 'Sí - ' + (person.disability?.tipo || 'N/E') : 'No'}`,
        `Beneficios: ${person.flags?.hasBenefit ? person.benefit?.nombre || 'Sí' : 'No'}`,
        ``,
        `⚠️ Usuario de solo lectura - No puede modificar datos`
      ].join('\n');
      
      alert(details);
    };
    
    window.exportData = function() {
      alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden exportar datos.\n\nContacte a un administrador.');
    };
    
  } else if (userRole === 'operador') {
    if (userManagementLink) userManagementLink.style.display = 'none';
    
    window.originalCreateTableRow = createTableRow;
    window.createTableRow = function(person) {
      const direccion = person.household.direccion || {};
      const direccionCompleta = [direccion.calle, direccion.numero, direccion.barrio].filter(Boolean).join(' ');
      const fechaRegistro = person.creadoEn.toDate().toLocaleDateString('es-AR');
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
          <td>
            <button class="btn btn-primary btn-small" onclick="viewDetails('${person.id}')">Ver</button>
            <button class="btn btn-danger btn-small" onclick="deletePersonOperator('${person.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    };
    
    window.deletePersonOperator = function(personId) {
      const person = allData.find(p => p.id === personId);
      if (!person) return;
      
      const confirmMessage = `⚠️ CONFIRMACIÓN DE OPERADOR\n\nEstá a punto de eliminar:\n${person.nombre} ${person.apellido} (DNI: ${person.dni})\n\nEsta acción no se puede deshacer.\n\n¿Confirma la eliminación?`;
      
      if (confirm(confirmMessage)) {
        // Eliminar de allData
        allData = allData.filter(p => p.id !== personId);
        
        // Eliminar de localStorage
        let persons = JSON.parse(localStorage.getItem('cic_persons') || '[]');
        persons = persons.filter(p => p.id !== personId);
        localStorage.setItem('cic_persons', JSON.stringify(persons));
        
        loadData();
        alert(`✅ Registro eliminado por operador: ${sessionStorage.getItem('currentUser')}`);
      }
    };
    
  } else if (userRole === 'admin') {
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

function populateHouseholdFilter() {
  const householdFilter = document.getElementById('filterHousehold');
  const uniqueHouseholds = [...new Set(allData.map(p => p.household.grupoFamiliar))].sort();
  
  householdFilter.innerHTML = '<option value="">Todas las familias</option>' +
    uniqueHouseholds.map(household => `<option value="${household}">${household}</option>`).join('');
}

// ============================================
// FILTROS Y VISUALIZACIÓN
// ============================================
function handleLogout() {
  if (confirm('¿Desea cerrar la sesión?')) {
    sessionStorage.clear();
    alert('Sesión cerrada exitosamente');
    window.location.href = 'index.html'; 
  }
}

function loadData() {
  updateStats();
  populateHouseholdFilter();
  filteredData = [...allData];
  displayData();
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
    person.nombre, person.apellido, person.dni, person.cuit || '', person.household.grupoFamiliar,
    person.household.direccion?.calle || '', person.household.direccion?.barrio || ''
  ].some(field => field.toLowerCase().includes(searchTerm));
}

function disabilityMatches(person, disabilityFilter) {
  if (!disabilityFilter) return true;
  return (disabilityFilter === 'true' && person.flags?.hasDisability) ||
         (disabilityFilter === 'false' && !person.flags?.hasDisability);
}

function displayData() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);
  const tbody = document.getElementById('dataTableBody');
  
  if (pageData.length === 0 && allData.length > 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading">No se encontraron resultados con los filtros aplicados</td></tr>';
    document.getElementById('resultCount').textContent = '0 resultados';
    return;
  }
  
  if (allData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #666;"><strong>📝 No hay registros todavía</strong><br><br>Los formularios completados aparecerán aquí</td></tr>';
    document.getElementById('resultCount').textContent = '0 resultados';
    return;
  }
  
  tbody.innerHTML = pageData.map(person => createTableRow(person)).join('');
  document.getElementById('resultCount').textContent = `${filteredData.length} resultado${filteredData.length !== 1 ? 's' : ''}`;
}

function createTableRow(person) {
  const direccion = person.household.direccion || {};
  const direccionCompleta = [direccion.calle, direccion.numero, direccion.barrio].filter(Boolean).join(' ');
  const fechaRegistro = person.creadoEn.toDate().toLocaleDateString('es-AR');
  
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
      <td>
        <button class="btn btn-primary btn-small" onclick="viewDetails('${person.id}')">Ver</button>
        <button class="btn btn-danger btn-small" onclick="deletePerson('${person.id}')">Eliminar</button>
      </td>
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
// FUNCIONES DE ACCIÓN
// ============================================
window.viewDetails = function(personId) {
  const person = allData.find(p => p.id === personId);
  if (!person) return;
  
  const details = [
    `Nombre: ${person.nombre} ${person.apellido}`,
    `DNI: ${person.dni}`,
    `CUIT: ${person.cuit || 'N/A'}`,
    `Edad: ${person.edad}`,
    `Sexo: ${person.sexo}`,
    `Relación: ${person.relacionHogar}`,
    `Grupo Familiar: ${person.household.grupoFamiliar}`,
    `Dirección: ${[person.household.direccion?.calle, person.household.direccion?.numero, person.household.direccion?.barrio].filter(Boolean).join(' ')}`,
    `Discapacidad: ${person.flags?.hasDisability ? 'Sí - ' + (person.disability?.tipo || 'N/E') : 'No'}`,
    `Beneficios: ${person.flags?.hasBenefit ? person.benefit?.nombre || 'Sí' : 'No'}`
  ].join('\n');
  
  alert(`Detalles completos:\n\n${details}`);
};

window.deletePerson = function(personId) {
  if (confirm('¿Está seguro de que desea eliminar este registro?')) {
    // Eliminar de allData
    allData = allData.filter(p => p.id !== personId);
    
    // Eliminar de localStorage
    let persons = JSON.parse(localStorage.getItem('cic_persons') || '[]');
    persons = persons.filter(p => p.id !== personId);
    localStorage.setItem('cic_persons', JSON.stringify(persons));
    
    loadData();
    alert('Registro eliminado exitosamente');
  }
};

window.exportData = function() {
  alert('Función de exportación (requiere configuración adicional)');
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('input', filterData);
  document.getElementById('filterRelation').addEventListener('change', filterData);
  document.getElementById('filterDisability').addEventListener('change', filterData);
  document.getElementById('filterHousehold').addEventListener('change', filterData);
  
  // Inicializar
  if (checkAuth()) {
    loadFromLocalStorage(); // CARGAR DESDE LOCALSTORAGE
  }
});

// Funciones globales
window.handleLogout = handleLogout;
window.loadData = loadData;
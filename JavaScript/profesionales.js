// ============================================
// CONFIGURACIÓN: Modo de datos
// ============================================
const USE_MOCK_DATA = true; // Cambiar a false cuando Firebase esté listo

// ============================================
// DATOS MOCK (solo para desarrollo)
// ============================================
const mockProfesionales = [
  {
    id: 'prof_001',
    nombre: 'María',
    apellido: 'González',
    especialidad: 'Trabajador Social',
    matricula: 'TS-12345',
    email: 'maria.gonzalez@cic.gob.ar',
    telefono: '341-1234567',
    horarios: 'Lunes a Viernes 8-14hs',
    casosActivos: 8,
    casosResueltos: 45,
    activo: true,
    creadoEn: { toDate: () => new Date('2024-01-10') }
  },
  {
    id: 'prof_002',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    especialidad: 'Psicólogo',
    matricula: 'PSI-98765',
    email: 'carlos.rodriguez@cic.gob.ar',
    telefono: '341-7654321',
    horarios: 'Lunes, Miércoles y Viernes 9-13hs',
    casosActivos: 5,
    casosResueltos: 32,
    activo: true,
    creadoEn: { toDate: () => new Date('2024-01-15') }
  },
  {
    id: 'prof_003',
    nombre: 'Ana',
    apellido: 'Martínez',
    especialidad: 'Enfermero',
    matricula: 'ENF-55443',
    email: 'ana.martinez@cic.gob.ar',
    telefono: '341-5556677',
    horarios: 'Martes y Jueves 10-16hs',
    casosActivos: 3,
    casosResueltos: 18,
    activo: true,
    creadoEn: { toDate: () => new Date('2024-02-01') }
  },
  {
    id: 'prof_004',
    nombre: 'Jorge',
    apellido: 'López',
    especialidad: 'Abogado',
    matricula: 'AB-33221',
    email: 'jorge.lopez@cic.gob.ar',
    telefono: '341-9998877',
    horarios: 'Lunes a Viernes 14-18hs',
    casosActivos: 12,
    casosResueltos: 67,
    activo: true,
    creadoEn: { toDate: () => new Date('2024-01-20') }
  },
  {
    id: 'prof_005',
    nombre: 'Laura',
    apellido: 'Fernández',
    especialidad: 'Administrativo',
    matricula: '',
    email: 'laura.fernandez@cic.gob.ar',
    telefono: '341-4443322',
    horarios: 'Lunes a Viernes 8-16hs',
    casosActivos: 0,
    casosResueltos: 0,
    activo: true,
    creadoEn: { toDate: () => new Date('2024-02-10') }
  },
  {
    id: 'prof_006',
    nombre: 'Roberto',
    apellido: 'Gómez',
    especialidad: 'Coordinador',
    matricula: '',
    email: 'roberto.gomez@cic.gob.ar',
    telefono: '341-1112233',
    horarios: 'Lunes a Viernes 8-16hs',
    casosActivos: 0,
    casosResueltos: 0,
    activo: false,
    creadoEn: { toDate: () => new Date('2023-12-01') }
  }
];

// ============================================
// VARIABLES GLOBALES
// ============================================
let allProfesionales = USE_MOCK_DATA ? mockProfesionales : [];
let filteredProfesionales = [];
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
    
    const userInfo = document.createElement('div');
    userInfo.style.cssText = 'position: fixed; top: 10px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; z-index: 1000;';
    userInfo.textContent = `Conectado como: ${getRoleDisplay(currentUserRole)} - ${currentUser}`;
    document.body.appendChild(userInfo);
    
    setupRolePermissions(currentUserRole);
    
    return true;
  } else {
    alert('Acceso denegado. Debe iniciar sesión.');
    window.location.href = '../index.html';
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

// ============================================
// PERMISOS POR ROL
// ============================================
function setupRolePermissions(userRole) {
  const addButton = document.querySelector('a[href="profesionales-form.html"]');
  
  if (userRole === 'lectura') {
    // SOLO LECTURA: Ocultar botón agregar
    if (addButton) addButton.style.display = 'none';
  }
  
  // Los botones de la tabla se manejan en createTableRow según el rol
}

function handleLogout() {
  if (confirm('¿Desea cerrar la sesión?')) {
    sessionStorage.clear();
    alert('Sesión cerrada exitosamente');
    window.location.href = '../index.html';
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================
function calculateStats() {
  const total = allProfesionales.length;
  const activos = allProfesionales.filter(p => p.activo).length;
  const totalCasosActivos = allProfesionales.reduce((sum, p) => sum + (p.casosActivos || 0), 0);
  const totalCasosResueltos = allProfesionales.reduce((sum, p) => sum + (p.casosResueltos || 0), 0);

  return { total, activos, totalCasosActivos, totalCasosResueltos };
}

function updateStats() {
  const stats = calculateStats();
  document.getElementById('totalProfesionales').textContent = stats.total;
  document.getElementById('profesionalesActivos').textContent = stats.activos;
  document.getElementById('casosAsignados').textContent = stats.totalCasosActivos;
  document.getElementById('casosResueltos').textContent = stats.totalCasosResueltos;
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================
function filterProfesionales() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const especialidadFilter = document.getElementById('filterEspecialidad').value;
  const estadoFilter = document.getElementById('filterEstado').value;

  filteredProfesionales = allProfesionales.filter(prof => {
    const matchesSearch = searchMatches(prof, searchTerm);
    const matchesEspecialidad = !especialidadFilter || prof.especialidad === especialidadFilter;
    const matchesEstado = !estadoFilter || prof.activo.toString() === estadoFilter;
    
    return matchesSearch && matchesEspecialidad && matchesEstado;
  });

  displayProfesionales();
}

function searchMatches(prof, searchTerm) {
  if (!searchTerm) return true;
  return [
    prof.nombre, prof.apellido, prof.especialidad, prof.matricula, prof.email
  ].some(field => field.toLowerCase().includes(searchTerm));
}

// ============================================
// TABLA DE DATOS
// ============================================
function displayProfesionales() {
  const tbody = document.getElementById('profesionalesTableBody');
  
  if (filteredProfesionales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading">No se encontraron profesionales</td></tr>';
    document.getElementById('resultCount').textContent = '0 resultados';
    return;
  }

  tbody.innerHTML = filteredProfesionales.map(prof => createTableRow(prof)).join('');
  document.getElementById('resultCount').textContent = `${filteredProfesionales.length} resultado${filteredProfesionales.length !== 1 ? 's' : ''}`;
}

function createTableRow(prof) {
  const estadoBadge = prof.activo 
    ? '<span class="status-badge status-active">Activo</span>'
    : '<span class="status-badge status-disabled">Inactivo</span>';
  
  // Botones según el rol
  let actionButtons = '';
  
  if (currentUserRole === 'lectura') {
    // SOLO LECTURA: Solo ver
    actionButtons = `<button class="btn btn-secondary btn-small" onclick="verDetallesProfesional('${prof.id}')">Ver</button>`;
  } else if (currentUserRole === 'operador') {
    // OPERADOR: Ver, editar, activar/desactivar con confirmación
    const toggleButton = prof.activo
      ? `<button class="btn btn-danger btn-small" onclick="toggleEstadoOperador('${prof.id}')">Desactivar</button>`
      : `<button class="btn btn-primary btn-small" onclick="toggleEstadoOperador('${prof.id}')">Activar</button>`;
    
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="editarProfesional('${prof.id}')">Editar</button>
      ${toggleButton}
    `;
  } else {
    // ADMIN: Acceso completo
    const toggleButton = prof.activo
      ? `<button class="btn btn-danger btn-small" onclick="toggleEstado('${prof.id}')">Desactivar</button>`
      : `<button class="btn btn-primary btn-small" onclick="toggleEstado('${prof.id}')">Activar</button>`;
    
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="editarProfesional('${prof.id}')">Editar</button>
      ${toggleButton}
    `;
  }

  return `
    <tr>
      <td><strong>${prof.nombre} ${prof.apellido}</strong></td>
      <td>${prof.especialidad}</td>
      <td>${prof.matricula || 'N/A'}</td>
      <td>${prof.email}</td>
      <td>${prof.telefono || 'N/A'}</td>
      <td>${prof.horarios || 'N/A'}</td>
      <td><strong>${prof.casosActivos || 0}</strong></td>
      <td>${prof.casosResueltos || 0}</td>
      <td>${estadoBadge}</td>
      <td>${actionButtons}</td>
    </tr>
  `;
}

// ============================================
// ACCIONES
// ============================================
function verDetallesProfesional(profId) {
  const prof = allProfesionales.find(p => p.id === profId);
  if (!prof) return;
  
  const detalles = `
=== CONSULTA DE PROFESIONAL (SOLO LECTURA) ===

Nombre: ${prof.nombre} ${prof.apellido}
Especialidad: ${prof.especialidad}
Matrícula: ${prof.matricula || 'N/A'}
Email: ${prof.email}
Teléfono: ${prof.telefono || 'N/A'}
Horarios: ${prof.horarios || 'N/A'}
Estado: ${prof.activo ? 'Activo' : 'Inactivo'}
Casos Activos: ${prof.casosActivos || 0}
Casos Resueltos: ${prof.casosResueltos || 0}

⚠️ Usuario de solo lectura - No puede modificar datos
  `.trim();
  
  alert(detalles);
}

function editarProfesional(profId) {
  // Verificar permisos
  if (currentUserRole === 'lectura') {
    alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden editar profesionales.');
    return;
  }
  
  // Redirigir al formulario con el ID en la URL
  window.location.href = `profesionales-form.html?id=${profId}`;
}

function toggleEstadoOperador(profId) {
  const prof = allProfesionales.find(p => p.id === profId);
  if (!prof) return;
  
  const accion = prof.activo ? 'desactivar' : 'activar';
  const mensaje = `⚠️ CONFIRMACIÓN DE OPERADOR\n\n¿Está seguro de que desea ${accion} a ${prof.nombre} ${prof.apellido}?\n\nEsta acción afectará la asignación de casos.`;
  
  if (confirm(mensaje)) {
    prof.activo = !prof.activo;
    
    // TODO: Cuando Firebase esté listo, actualizar en la base de datos
    // await updateDoc(doc(db, "profesionales", profId), { activo: prof.activo });
    
    saveProfesionalesToLocalStorage();
    loadProfesionales();
    const usuario = sessionStorage.getItem('currentUser');
    alert(`✅ Profesional ${prof.activo ? 'activado' : 'desactivado'} por operador: ${usuario}`);
  }
}

function toggleEstado(profId) {
  const prof = allProfesionales.find(p => p.id === profId);
  if (!prof) return;
  
  const accion = prof.activo ? 'desactivar' : 'activar';
  const mensaje = `¿Está seguro de que desea ${accion} a ${prof.nombre} ${prof.apellido}?`;
  
  if (confirm(mensaje)) {
    prof.activo = !prof.activo;
    
    // TODO: Cuando Firebase esté listo, actualizar en la base de datos
    // await updateDoc(doc(db, "profesionales", profId), { activo: prof.activo });
    
    saveProfesionalesToLocalStorage();
    loadProfesionales();
    alert(`Profesional ${prof.activo ? 'activado' : 'desactivado'} exitosamente`);
  }
}

// ============================================
// CARGA INICIAL
// ============================================
function loadProfesionales() {
  // TODO: Cuando Firebase esté listo, cargar desde la base de datos
  // const snapshot = await getDocs(collection(db, "profesionales"));
  // allProfesionales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // MOCK: Cargar desde localStorage si existe, sino usar mock inicial
  if (USE_MOCK_DATA) {
    const stored = localStorage.getItem('mockProfesionales');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Reconstruir fechas
        allProfesionales = parsed.map(p => ({
          ...p,
          creadoEn: { toDate: () => new Date(p.creadoEn._date) }
        }));
      } catch (e) {
        console.error('Error cargando profesionales de localStorage:', e);
        allProfesionales = mockProfesionales;
      }
    } else {
      allProfesionales = mockProfesionales;
      saveProfesionalesToLocalStorage();
    }
  }
  
  updateStats();
  filteredProfesionales = [...allProfesionales];
  displayProfesionales();
}

function saveProfesionalesToLocalStorage() {
  if (USE_MOCK_DATA) {
    // Serializar fechas para localStorage
    const toStore = allProfesionales.map(p => ({
      ...p,
      creadoEn: { _date: p.creadoEn.toDate().toISOString() }
    }));
    localStorage.setItem('mockProfesionales', JSON.stringify(toStore));
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('input', filterProfesionales);
  document.getElementById('filterEspecialidad').addEventListener('change', filterProfesionales);
  document.getElementById('filterEstado').addEventListener('change', filterProfesionales);

  if (checkAuth()) {
    loadProfesionales();
  }
});

// ============================================
// FUNCIONES GLOBALES (para onclick en HTML)
// ============================================
window.verDetallesProfesional = verDetallesProfesional;
window.editarProfesional = editarProfesional;
window.toggleEstado = toggleEstado;
window.toggleEstadoOperador = toggleEstadoOperador;
window.loadProfesionales = loadProfesionales;
window.handleLogout = handleLogout;
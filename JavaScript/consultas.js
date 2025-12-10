// ============================================
// CONFIGURACIÓN: Modo de datos
// ============================================
const USE_MOCK_DATA = true; // Cambiar a false cuando Firebase esté listo

// ============================================
// DATOS MOCK (solo para desarrollo)
// ============================================
const mockConsultas = [
  {
    id: 'consulta_001',
    personId: '1',
    personaNombre: 'Juan Pérez',
    personDni: '12345678',
    householdId: 'household_1',
    fechaCreacion: { toDate: () => new Date('2024-12-01') },
    tipo: 'espontanea',
    derivadoPor: '',
    motivo: 'Ayuda alimentaria',
    descripcion: 'Familia con 3 menores sin ingresos. Solicita módulo alimentario.',
    estado: 'resuelto',
    prioridad: 'alta',
    profesionalAsignado: 'prof_001',
    profesionalNombre: 'María González',
    accionesTomadas: 'Se entregó módulo alimentario para 1 mes',
    fechaResolucion: { toDate: () => new Date('2024-12-02') },
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-12-01'), usuario: 'admin' },
      { estado: 'en_proceso', fecha: new Date('2024-12-01'), usuario: 'operador1' },
      { estado: 'resuelto', fecha: new Date('2024-12-02'), usuario: 'operador1' }
    ],
    observaciones: [
      { fecha: new Date('2024-12-01'), usuario: 'admin', nota: 'Familia muy necesitada, priorizar' }
    ]
  },
  {
    id: 'consulta_002',
    personId: '2',
    personaNombre: 'María García',
    personDni: '87654321',
    householdId: 'household_1',
    fechaCreacion: { toDate: () => new Date('2024-12-03') },
    tipo: 'derivacion',
    derivadoPor: 'Hospital Iturraspe',
    motivo: 'Trámite de CUD',
    descripcion: 'Derivada desde hospital. Tiene discapacidad visual. Necesita tramitar CUD.',
    estado: 'en_proceso',
    prioridad: 'media',
    profesionalAsignado: 'prof_001',
    profesionalNombre: 'María González',
    accionesTomadas: 'Se inició gestión con ANSES. Esperando turno.',
    fechaResolucion: null,
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-12-03'), usuario: 'admin' },
      { estado: 'en_proceso', fecha: new Date('2024-12-03'), usuario: 'admin' }
    ],
    observaciones: [
      { fecha: new Date('2024-12-03'), usuario: 'admin', nota: 'Hospital envió documentación médica' }
    ]
  },
  {
    id: 'consulta_003',
    personId: '4',
    personaNombre: 'Ana López',
    personDni: '55667788',
    householdId: 'household_2',
    fechaCreacion: { toDate: () => new Date('2024-12-04') },
    tipo: 'espontanea',
    derivadoPor: '',
    motivo: 'Trámite de pensión',
    descripcion: 'Adulta mayor sin ingresos. Solicita asesoramiento para pensión no contributiva.',
    estado: 'pendiente',
    prioridad: 'alta',
    profesionalAsignado: 'prof_004',
    profesionalNombre: 'Jorge López',
    accionesTomadas: '',
    fechaResolucion: null,
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-12-04'), usuario: 'admin' }
    ],
    observaciones: []
  },
  {
    id: 'consulta_004',
    personId: '5',
    personaNombre: 'Elena López',
    personDni: '33445566',
    householdId: 'household_2',
    fechaCreacion: { toDate: () => new Date('2024-12-02') },
    tipo: 'derivacion',
    derivadoPor: 'Escuela N° 123',
    motivo: 'Apoyo escolar',
    descripcion: 'Derivada desde la escuela. Necesita apoyo escolar y psicológico.',
    estado: 'notificado',
    prioridad: 'media',
    profesionalAsignado: 'prof_002',
    profesionalNombre: 'Carlos Rodríguez',
    accionesTomadas: 'Se programó entrevista con psicólogo. Familia notificada.',
    fechaResolucion: null,
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-12-02'), usuario: 'admin' },
      { estado: 'en_proceso', fecha: new Date('2024-12-02'), usuario: 'operador1' },
      { estado: 'notificado', fecha: new Date('2024-12-03'), usuario: 'operador1' }
    ],
    observaciones: [
      { fecha: new Date('2024-12-02'), usuario: 'admin', nota: 'Coordinar con escuela seguimiento' }
    ]
  },
  {
    id: 'consulta_005',
    personId: '3',
    personaNombre: 'Carlos Pérez',
    personDni: '11223344',
    householdId: 'household_1',
    fechaCreacion: { toDate: () => new Date('2024-12-05') },
    tipo: 'espontanea',
    derivadoPor: '',
    motivo: 'Derivación a salud',
    descripcion: 'Menor con problema de salud. Necesita control médico urgente.',
    estado: 'pendiente',
    prioridad: 'urgente',
    profesionalAsignado: 'prof_003',
    profesionalNombre: 'Ana Martínez',
    accionesTomadas: '',
    fechaResolucion: null,
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-12-05'), usuario: 'admin' }
    ],
    observaciones: [
      { fecha: new Date('2024-12-05'), usuario: 'admin', nota: 'URGENTE - Coordinar turno inmediato' }
    ]
  },
  {
    id: 'consulta_006',
    personId: '1',
    personaNombre: 'Juan Pérez',
    personDni: '12345678',
    householdId: 'household_1',
    fechaCreacion: { toDate: () => new Date('2024-11-15') },
    tipo: 'espontanea',
    derivadoPor: '',
    motivo: 'Búsqueda laboral',
    descripcion: 'Solicita orientación para búsqueda de empleo. Sin trabajo hace 6 meses.',
    estado: 'cerrado',
    prioridad: 'baja',
    profesionalAsignado: 'prof_005',
    profesionalNombre: 'Laura Fernández',
    accionesTomadas: 'Derivado a oficina de empleo municipal. Inscripto en curso de capacitación.',
    fechaResolucion: { toDate: () => new Date('2024-11-20') },
    historicoEstados: [
      { estado: 'pendiente', fecha: new Date('2024-11-15'), usuario: 'admin' },
      { estado: 'en_proceso', fecha: new Date('2024-11-16'), usuario: 'operador1' },
      { estado: 'resuelto', fecha: new Date('2024-11-20'), usuario: 'operador1' },
      { estado: 'cerrado', fecha: new Date('2024-11-25'), usuario: 'admin' }
    ],
    observaciones: [
      { fecha: new Date('2024-11-16'), usuario: 'operador1', nota: 'Persona motivada, buen perfil' }
    ]
  }
];

// Profesionales mock (con teléfonos para WhatsApp)
const mockProfesionalesSimple = [
  { id: 'prof_001', nombre: 'María González', telefono: '341-1234567' },
  { id: 'prof_002', nombre: 'Carlos Rodríguez', telefono: '341-7654321' },
  { id: 'prof_003', nombre: 'Ana Martínez', telefono: '341-5556677' },
  { id: 'prof_004', nombre: 'Jorge López', telefono: '341-9998877' },
  { id: 'prof_005', nombre: 'Laura Fernández', telefono: '341-4443322' }
];

// ============================================
// VARIABLES GLOBALES
// ============================================
let allConsultas = USE_MOCK_DATA ? mockConsultas : [];
let filteredConsultas = [];
let currentConsultaId = null;
let currentUserRole = null;

// ============================================
// FUNCIÓN: NOTIFICAR POR WHATSAPP
// ============================================
function notificarPorWhatsApp(consultaId) {
  const consulta = allConsultas.find(c => c.id === consultaId);
  if (!consulta) {
    alert('❌ No se encontró la consulta');
    return;
  }
  
  if (!consulta.profesionalAsignado) {
    alert('❌ Esta consulta no tiene profesional asignado');
    return;
  }
  
  const profesional = mockProfesionalesSimple.find(p => p.id === consulta.profesionalAsignado);
  
  if (!profesional || !profesional.telefono) {
    alert('❌ No se encontró el teléfono del profesional');
    return;
  }
  
  const telefonoLimpio = profesional.telefono.replace(/\D/g, '');
  
  const prioridadEmoji = {
    'urgente': '🚨',
    'alta': '⚠️',
    'media': 'ℹ️',
    'baja': '📋'
  };
  
  const mensaje = `${prioridadEmoji[consulta.prioridad] || '📋'} *Notificación de Caso - CIC Pavón Arriba*

*Paciente:* ${consulta.personaNombre}
*DNI:* ${consulta.personDni || 'N/A'}
*Motivo:* ${consulta.motivo}
*Prioridad:* ${consulta.prioridad.toUpperCase()}
*Estado actual:* ${consulta.estado.toUpperCase()}
*Tipo:* ${consulta.tipo === 'derivacion' ? 'Derivación Institucional' : 'Demanda Espontánea'}
${consulta.derivadoPor ? `*Derivado por:* ${consulta.derivadoPor}` : ''}

*Descripción:*
${consulta.descripcion}

*Fecha de creación:* ${consulta.fechaCreacion.toDate().toLocaleDateString('es-AR')}

Por favor confirmar recepción.

_Mensaje automático del Sistema CIC_`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=54${telefonoLimpio}&text=${mensajeCodificado}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Confirmación visual
  const confirmacion = document.createElement('div');
  confirmacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #25D366;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: bold;
  `;
  confirmacion.textContent = `✅ WhatsApp abierto para ${profesional.nombre}`;
  document.body.appendChild(confirmacion);
  
  setTimeout(() => {
    confirmacion.remove();
  }, 3000);
}

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
  const addButton = document.querySelector('a[href="consultas-form.html"]');
  
  if (userRole === 'lectura') {
    // SOLO LECTURA: Ocultar botón nueva consulta
    if (addButton) addButton.style.display = 'none';
  }
  
  // Los botones de la tabla se manejan en createTableRow según el rol
}

function handleLogout() {
  if (confirm('¿Desea cerrar la sesión?')) {
    sessionStorage.clear();
    alert('Sesión cerrada exitosamente');
    window.location.href = 'index.html'; 
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================
function calculateStats() {
  const total = allConsultas.length;
  const pendientes = allConsultas.filter(c => c.estado === 'pendiente').length;
  const enProceso = allConsultas.filter(c => c.estado === 'en_proceso').length;
  const resueltas = allConsultas.filter(c => c.estado === 'resuelto' || c.estado === 'cerrado').length;
  const urgentes = allConsultas.filter(c => c.prioridad === 'urgente').length;
  const derivacion = allConsultas.filter(c => c.tipo === 'derivacion').length;

  return { total, pendientes, enProceso, resueltas, urgentes, derivacion };
}

function updateStats() {
  const stats = calculateStats();
  document.getElementById('totalConsultas').textContent = stats.total;
  document.getElementById('consultasPendientes').textContent = stats.pendientes;
  document.getElementById('consultasEnProceso').textContent = stats.enProceso;
  document.getElementById('consultasResueltas').textContent = stats.resueltas;
  document.getElementById('consultasUrgentes').textContent = stats.urgentes;
  document.getElementById('consultasDerivacion').textContent = stats.derivacion;
}

// ============================================
// FILTROS
// ============================================
function populateProfesionalFilter() {
  const filterSelect = document.getElementById('filterProfesional');
  filterSelect.innerHTML = '<option value="">Todos los profesionales</option>' +
    mockProfesionalesSimple.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
}

function filterConsultas() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const estadoFilter = document.getElementById('filterEstado').value;
  const tipoFilter = document.getElementById('filterTipo').value;
  const prioridadFilter = document.getElementById('filterPrioridad').value;
  const profesionalFilter = document.getElementById('filterProfesional').value;

  filteredConsultas = allConsultas.filter(consulta => {
    const matchesSearch = searchMatches(consulta, searchTerm);
    const matchesEstado = !estadoFilter || consulta.estado === estadoFilter;
    const matchesTipo = !tipoFilter || consulta.tipo === tipoFilter;
    const matchesPrioridad = !prioridadFilter || consulta.prioridad === prioridadFilter;
    const matchesProfesional = !profesionalFilter || consulta.profesionalAsignado === profesionalFilter;
    
    return matchesSearch && matchesEstado && matchesTipo && matchesPrioridad && matchesProfesional;
  });

  displayConsultas();
}

function searchMatches(consulta, searchTerm) {
  if (!searchTerm) return true;
  return [
    consulta.personaNombre, consulta.motivo, consulta.profesionalNombre, consulta.descripcion
  ].some(field => field.toLowerCase().includes(searchTerm));
}

// ============================================
// TABLA DE DATOS
// ============================================
function displayConsultas() {
  const tbody = document.getElementById('consultasTableBody');
  
  if (filteredConsultas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="loading">No se encontraron consultas</td></tr>';
    document.getElementById('resultCount').textContent = '0 resultados';
    return;
  }

  tbody.innerHTML = filteredConsultas.map(consulta => createTableRow(consulta)).join('');
  document.getElementById('resultCount').textContent = `${filteredConsultas.length} resultado${filteredConsultas.length !== 1 ? 's' : ''}`;
}

function createTableRow(consulta) {
  const fecha = consulta.fechaCreacion.toDate().toLocaleDateString('es-AR');
  const estadoBadge = getEstadoBadge(consulta.estado);
  const prioridadBadge = getPrioridadBadge(consulta.prioridad);
  const tipoBadge = consulta.tipo === 'derivacion' 
    ? '<span class="status-badge" style="background: #e7f3ff; color: #004085;">Derivación</span>'
    : '<span class="status-badge" style="background: #f8f9fa; color: #495057;">Espontánea</span>';

  // Botón de WhatsApp (solo si hay profesional asignado y no es usuario de solo lectura)
  let whatsappButton = '';
  if (consulta.profesionalAsignado && currentUserRole !== 'lectura') {
    whatsappButton = `<button class="btn btn-success btn-small" onclick="notificarPorWhatsApp('${consulta.id}')" title="Notificar por WhatsApp">📱</button>`;
  }

  // Botones según el rol
  let actionButtons = '';
  
  if (currentUserRole === 'lectura') {
    // SOLO LECTURA: Solo ver
    actionButtons = `<button class="btn btn-secondary btn-small" onclick="verDetalles('${consulta.id}')">Ver</button>`;
  } else if (currentUserRole === 'operador') {
    // OPERADOR: Ver, cambiar estado y WhatsApp
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="verDetalles('${consulta.id}')">Ver</button>
      <button class="btn btn-secondary btn-small" onclick="abrirModalEstadoOperador('${consulta.id}')">Cambiar Estado</button>
      ${whatsappButton}
    `;
  } else {
    // ADMIN: Acceso completo
    actionButtons = `
      <button class="btn btn-primary btn-small" onclick="verDetalles('${consulta.id}')">Ver</button>
      <button class="btn btn-secondary btn-small" onclick="abrirModalEstado('${consulta.id}')">Cambiar Estado</button>
      ${whatsappButton}
    `;
  }

  return `
    <tr>
      <td>${fecha}</td>
      <td><strong>${consulta.personaNombre}</strong></td>
      <td>${consulta.motivo}</td>
      <td>${tipoBadge}</td>
      <td>${consulta.profesionalNombre || 'Sin asignar'}</td>
      <td>${estadoBadge}</td>
      <td>${prioridadBadge}</td>
      <td>${actionButtons}</td>
    </tr>
  `;
}

function getEstadoBadge(estado) {
  const estados = {
    'pendiente': { color: '#fff3cd', text: '#856404', label: 'Pendiente' },
    'en_proceso': { color: '#cfe2ff', text: '#084298', label: 'En Proceso' },
    'notificado': { color: '#ffe5cc', text: '#cc5200', label: 'Notificado' },
    'resuelto': { color: '#d1e7dd', text: '#0f5132', label: 'Resuelto' },
    'cerrado': { color: '#e2e3e5', text: '#41464b', label: 'Cerrado' }
  };
  const e = estados[estado] || estados['pendiente'];
  return `<span class="status-badge" style="background: ${e.color}; color: ${e.text};">${e.label}</span>`;
}

function getPrioridadBadge(prioridad) {
  const prioridades = {
    'baja': { color: '#d1e7dd', text: '#0f5132', label: 'Baja' },
    'media': { color: '#cfe2ff', text: '#084298', label: 'Media' },
    'alta': { color: '#fff3cd', text: '#856404', label: 'Alta' },
    'urgente': { color: '#f8d7da', text: '#842029', label: 'Urgente' }
  };
  const p = prioridades[prioridad] || prioridades['media'];
  return `<span class="status-badge" style="background: ${p.color}; color: ${p.text};">${p.label}</span>`;
}

// ============================================
// FUNCIÓN: RECALCULAR CASOS DE PROFESIONALES
// ============================================
function recalcularCasosProfesionales() {
  console.log('🔄 Recalculando casos de profesionales...');
  
  const consultas = JSON.parse(localStorage.getItem('mockConsultas') || '[]');
  let profesionales = JSON.parse(localStorage.getItem('mockProfesionales') || '[]');
  
  // Resetear contadores
  profesionales.forEach(prof => {
    prof.casosActivos = 0;
    prof.casosResueltos = 0;
  });
  
  // Contar casos
  consultas.forEach(consulta => {
    if (!consulta.profesionalAsignado) return;
    const prof = profesionales.find(p => p.id === consulta.profesionalAsignado);
    if (!prof) return;
    
    if (['pendiente', 'en_proceso', 'notificado'].includes(consulta.estado)) {
      prof.casosActivos++;
    }
    if (['resuelto', 'cerrado'].includes(consulta.estado)) {
      prof.casosResueltos++;
    }
  });
  
  localStorage.setItem('mockProfesionales', JSON.stringify(profesionales));
  console.log('✅ Casos recalculados');
}

// ============================================
// ACCIONES
// ============================================
function verDetalles(consultaId) {
  const consulta = allConsultas.find(c => c.id === consultaId);
  if (!consulta) return;
  
  const derivacion = consulta.tipo === 'derivacion' ? `\nDerivado por: ${consulta.derivadoPor}` : '';
  const resolucion = consulta.fechaResolucion 
    ? `\n\nResolución: ${consulta.fechaResolucion.toDate().toLocaleDateString('es-AR')}\nAcciones: ${consulta.accionesTomadas}`
    : '';
  
  const detalles = `
=== DETALLES DE CONSULTA ===

Persona: ${consulta.personaNombre}
Fecha: ${consulta.fechaCreacion.toDate().toLocaleDateString('es-AR')}
Tipo: ${consulta.tipo === 'derivacion' ? 'Derivación Institucional' : 'Demanda Espontánea'}${derivacion}

Motivo: ${consulta.motivo}
Descripción: ${consulta.descripcion}

Estado: ${consulta.estado.toUpperCase()}
Prioridad: ${consulta.prioridad.toUpperCase()}
Profesional: ${consulta.profesionalNombre}${resolucion}

Observaciones: ${consulta.observaciones.length} registradas
  `.trim();
  
  alert(detalles);
}

function abrirModalEstado(consultaId) {
  // Verificar permisos
  if (currentUserRole === 'lectura') {
    alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden cambiar estados de consultas.');
    return;
  }
  
  currentConsultaId = consultaId;
  const consulta = allConsultas.find(c => c.id === consultaId);
  if (!consulta) return;
  
  document.getElementById('nuevoEstado').value = consulta.estado;
  document.getElementById('observacionEstado').value = '';
  document.getElementById('estadoModal').style.display = 'flex';
}

function abrirModalEstadoOperador(consultaId) {
  currentConsultaId = consultaId;
  const consulta = allConsultas.find(c => c.id === consultaId);
  if (!consulta) return;
  
  // Mostrar advertencia para operadores
  const advertencia = document.createElement('div');
  advertencia.id = 'operadorWarning';
  advertencia.style.cssText = 'background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #ffeaa7;';
  advertencia.innerHTML = '<strong>⚠️ OPERADOR:</strong> Asegúrese de documentar el cambio en las observaciones.';
  
  document.getElementById('nuevoEstado').value = consulta.estado;
  document.getElementById('observacionEstado').value = '';
  document.getElementById('estadoModal').style.display = 'flex';
  
  // Agregar advertencia si no existe
  const modal = document.querySelector('#estadoModal > div');
  if (modal && !document.getElementById('operadorWarning')) {
    modal.insertBefore(advertencia, modal.firstChild.nextSibling);
  }
}

function cerrarModalEstado() {
  currentConsultaId = null;
  document.getElementById('estadoModal').style.display = 'none';
  
  // Limpiar advertencia de operador si existe
  const warning = document.getElementById('operadorWarning');
  if (warning) warning.remove();
}

function confirmarCambioEstado() {
  if (!currentConsultaId) return;
  
  const consulta = allConsultas.find(c => c.id === currentConsultaId);
  if (!consulta) return;
  
  const nuevoEstado = document.getElementById('nuevoEstado').value;
  const observacion = document.getElementById('observacionEstado').value.trim();
  const usuario = sessionStorage.getItem('currentUser');
  
  // Validación especial para operadores: observación obligatoria
  if (currentUserRole === 'operador' && !observacion) {
    alert('⚠️ OPERADORES DEBEN AGREGAR OBSERVACIÓN\n\nPor favor, documente el motivo del cambio de estado.');
    document.getElementById('observacionEstado').focus();
    return;
  }
  
  // Actualizar estado
  consulta.estado = nuevoEstado;
  
  // Agregar al historial
  consulta.historicoEstados.push({
    estado: nuevoEstado,
    fecha: new Date(),
    usuario: usuario
  });
  
  // Agregar observación (siempre para operadores, opcional para admin)
  if (observacion) {
    consulta.observaciones.push({
      fecha: new Date(),
      usuario: usuario,
      nota: observacion
    });
  }
  
  // TODO: Cuando Firebase esté listo, actualizar en la base de datos
  // await updateDoc(doc(db, "consultas", currentConsultaId), { ... });
  
  // Guardar en localStorage
  saveConsultasToLocalStorage();
  
  // RECALCULAR CASOS DE PROFESIONALES
  recalcularCasosProfesionales();
  
  cerrarModalEstado();
  loadConsultas();
  
  const mensaje = currentUserRole === 'operador'
    ? `✅ Estado actualizado por operador: ${usuario}`
    : '✅ Estado actualizado exitosamente';
  alert(mensaje);
}

// ============================================
// CARGA INICIAL
// ============================================
function loadConsultas() {
  // TODO: Cuando Firebase esté listo, cargar desde la base de datos
  // const snapshot = await getDocs(collection(db, "consultas"));
  // allConsultas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // MOCK: Cargar desde localStorage si existe, sino usar mock inicial
  if (USE_MOCK_DATA) {
    const stored = localStorage.getItem('mockConsultas');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Reconstruir fechas
        allConsultas = parsed.map(c => ({
          ...c,
          fechaCreacion: { toDate: () => new Date(c.fechaCreacion._date) },
          fechaResolucion: c.fechaResolucion ? { toDate: () => new Date(c.fechaResolucion._date) } : null
        }));
      } catch (e) {
        console.error('Error cargando consultas de localStorage:', e);
        allConsultas = mockConsultas;
      }
    } else {
      allConsultas = mockConsultas;
      saveConsultasToLocalStorage();
    }
  }
  
  updateStats();
  populateProfesionalFilter();
  filteredConsultas = [...allConsultas];
  displayConsultas();
}

function saveConsultasToLocalStorage() {
  if (USE_MOCK_DATA) {
    // Serializar fechas para localStorage
    const toStore = allConsultas.map(c => ({
      ...c,
      fechaCreacion: { _date: c.fechaCreacion.toDate().toISOString() },
      fechaResolucion: c.fechaResolucion ? { _date: c.fechaResolucion.toDate().toISOString() } : null
    }));
    localStorage.setItem('mockConsultas', JSON.stringify(toStore));
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('input', filterConsultas);
  document.getElementById('filterEstado').addEventListener('change', filterConsultas);
  document.getElementById('filterTipo').addEventListener('change', filterConsultas);
  document.getElementById('filterPrioridad').addEventListener('change', filterConsultas);
  document.getElementById('filterProfesional').addEventListener('change', filterConsultas);

  if (checkAuth()) {
    loadConsultas();
  }
});

// ============================================
// FUNCIONES GLOBALES (para onclick en HTML)
// ============================================
window.verDetalles = verDetalles;
window.abrirModalEstado = abrirModalEstado;
window.abrirModalEstadoOperador = abrirModalEstadoOperador;
window.cerrarModalEstado = cerrarModalEstado;
window.confirmarCambioEstado = confirmarCambioEstado;
window.loadConsultas = loadConsultas;
window.handleLogout = handleLogout;
window.notificarPorWhatsApp = notificarPorWhatsApp;
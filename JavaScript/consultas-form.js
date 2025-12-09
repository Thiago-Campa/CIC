// ============================================
// CONFIGURACIÓN: Modo de datos
// ============================================
const USE_MOCK_DATA = true; // Cambiar a false cuando Firebase esté listo

// ============================================
// DATOS MOCK - Personas (del sistema principal)
// ============================================
const mockPersonas = [
  {
    id: '1', nombre: 'Juan', apellido: 'Pérez', dni: '12345678', edad: 35,
    householdId: 'household_1',
    household: { grupoFamiliar: 'Pérez-García' }
  },
  {
    id: '2', nombre: 'María', apellido: 'García', dni: '87654321', edad: 32,
    householdId: 'household_1',
    household: { grupoFamiliar: 'Pérez-García' }
  },
  {
    id: '3', nombre: 'Carlos', apellido: 'Pérez', dni: '11223344', edad: 8,
    householdId: 'household_1',
    household: { grupoFamiliar: 'Pérez-García' }
  },
  {
    id: '4', nombre: 'Ana', apellido: 'López', dni: '55667788', edad: 67,
    householdId: 'household_2',
    household: { grupoFamiliar: 'López' }
  },
  {
    id: '5', nombre: 'Elena', apellido: 'López', dni: '33445566', edad: 24,
    householdId: 'household_2',
    household: { grupoFamiliar: 'López' }
  }
];

// ============================================
// DATOS MOCK - Profesionales activos
// ============================================
// NOTA: Los profesionales se cargan dinámicamente de localStorage
// para sincronizar con profesionales.js y profesionales-form.js
let mockProfesionales = [];

function cargarProfesionalesDeLocalStorage() {
  const stored = localStorage.getItem('mockProfesionales');
  
  if (stored) {
    try {
      mockProfesionales = JSON.parse(stored);
      console.log('✅ Profesionales cargados de localStorage:', mockProfesionales.length);
    } catch (e) {
      console.error('Error cargando profesionales:', e);
      // Profesionales por defecto si falla
      mockProfesionales = [
        { id: 'prof_001', nombre: 'María', apellido: 'González', especialidad: 'Trabajador Social', telefono: '341-1234567', activo: true },
        { id: 'prof_002', nombre: 'Carlos', apellido: 'Rodríguez', especialidad: 'Psicólogo', telefono: '341-7654321', activo: true },
        { id: 'prof_003', nombre: 'Ana', apellido: 'Martínez', especialidad: 'Enfermero', telefono: '341-5556677', activo: true },
        { id: 'prof_004', nombre: 'Jorge', apellido: 'López', especialidad: 'Abogado', telefono: '341-9998877', activo: true },
        { id: 'prof_005', nombre: 'Laura', apellido: 'Fernández', especialidad: 'Administrativo', telefono: '341-4443322', activo: true }
      ];
    }
  } else {
    // Si no hay nada en localStorage, usar profesionales por defecto
    console.warn('⚠️ No hay profesionales en localStorage, usando datos por defecto');
    mockProfesionales = [
      { id: 'prof_001', nombre: 'María', apellido: 'González', especialidad: 'Trabajador Social', telefono: '341-1234567', activo: true },
      { id: 'prof_002', nombre: 'Carlos', apellido: 'Rodríguez', especialidad: 'Psicólogo', telefono: '341-7654321', activo: true },
      { id: 'prof_003', nombre: 'Ana', apellido: 'Martínez', especialidad: 'Enfermero', telefono: '341-5556677', activo: true },
      { id: 'prof_004', nombre: 'Jorge', apellido: 'López', especialidad: 'Abogado', telefono: '341-9998877', activo: true },
      { id: 'prof_005', nombre: 'Laura', apellido: 'Fernández', especialidad: 'Administrativo', telefono: '341-4443322', activo: true }
    ];
  }
}

// ============================================
// VARIABLES GLOBALES
// ============================================
const $ = (id) => document.getElementById(id);
const statusEl = $("status");
let currentUserRole = null;
let ultimaConsultaCreada = null;

// ============================================
// FUNCIÓN: NOTIFICAR POR WHATSAPP
// ============================================
function notificarPorWhatsApp(consulta, profesional) {
  const telefonoLimpio = profesional.telefono.replace(/\D/g, '');
  
  const prioridadEmoji = {
    'urgente': '🚨',
    'alta': '⚠️',
    'media': 'ℹ️',
    'baja': '📋'
  };
  
  const mensaje = `${prioridadEmoji[consulta.prioridad] || '📋'} *Nuevo Caso Asignado - CIC Pavón Arriba*

*Paciente:* ${consulta.personaNombre}
*DNI:* ${consulta.personDni || 'N/A'}
*Motivo:* ${consulta.motivo}
*Prioridad:* ${consulta.prioridad.toUpperCase()}
*Tipo:* ${consulta.tipo === 'derivacion' ? 'Derivación Institucional' : 'Demanda Espontánea'}
${consulta.derivadoPor ? `*Derivado por:* ${consulta.derivadoPor}` : ''}

*Descripción:*
${consulta.descripcion}

*Fecha de asignación:* ${new Date().toLocaleDateString('es-AR')}

Por favor confirmar recepción.

_Mensaje automático del Sistema CIC_`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=54${telefonoLimpio}&text=${mensajeCodificado}`;
  
  window.open(whatsappUrl, '_blank');
}

// ============================================
// FUNCIÓN: MOSTRAR MODAL DE CONFIRMACIÓN
// ============================================
function mostrarConfirmacionWhatsApp(consulta) {
  const profesional = mockProfesionales.find(p => p.id === consulta.profesionalAsignado);
  
  if (!profesional || !profesional.telefono) {
    setTimeout(() => {
      window.location.href = 'consultas.html';
    }, 1500);
    return;
  }
  
  const modal = document.createElement('div');
  modal.id = 'whatsappModal';
  modal.style.cssText = `
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <h2 style="color: #25D366; margin-bottom: 20px; text-align: center;">✅ Consulta Registrada</h2>
      
      <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Profesional asignado:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 16px;">${profesional.nombre} ${profesional.apellido}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">📱 ${profesional.telefono}</p>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
          <strong>💡 Sugerencia:</strong> Notifique al profesional por WhatsApp para una respuesta más rápida.
        </p>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
        <button onclick="cerrarModalWhatsApp()" style="background: #6c757d; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Más tarde
        </button>
        <button onclick="enviarWhatsAppYCerrar()" style="background: #25D366; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">
          📱 Enviar WhatsApp
        </button>
      </div>
      
      <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #666;">
        Se abrirá WhatsApp Web con el mensaje pre-cargado
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  ultimaConsultaCreada = { consulta, profesional };
}

window.cerrarModalWhatsApp = function() {
  const modal = document.getElementById('whatsappModal');
  if (modal) modal.remove();
  window.location.href = 'consultas.html';
};

window.enviarWhatsAppYCerrar = function() {
  if (ultimaConsultaCreada) {
    notificarPorWhatsApp(ultimaConsultaCreada.consulta, ultimaConsultaCreada.profesional);
  }
  
  setTimeout(() => {
    cerrarModalWhatsApp();
  }, 500);
};

// ============================================
// AUTENTICACIÓN Y PERMISOS
// ============================================
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentUser = sessionStorage.getItem('currentUser');
  const userRole = sessionStorage.getItem('userRole');

  if (isLoggedIn === 'true' && currentUser) {
    currentUserRole = userRole || 'admin';
    
    if (currentUserRole === 'lectura') {
      alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden crear consultas.');
      window.location.href = 'consultas.html';
      return false;
    }
    
    return true;
  } else {
    alert('Acceso denegado. Debe iniciar sesión.');
    window.location.href = '../index.html';
    return false;
  }
}

// ============================================
// CARGAR SELECTORES
// ============================================
function loadPersonas() {
  const select = $("personId");
  
  select.innerHTML = '<option value="">— Seleccione una persona —</option>' +
    mockPersonas.map(p => 
      `<option value="${p.id}" data-nombre="${p.nombre} ${p.apellido}" data-dni="${p.dni}" data-edad="${p.edad}" data-familia="${p.household.grupoFamiliar}">
        ${p.nombre} ${p.apellido} - DNI: ${p.dni} (${p.household.grupoFamiliar})
      </option>`
    ).join('');
}

function loadProfesionales() {
  const select = $("profesionalAsignado");
  
  // Filtrar solo profesionales activos
  const profesionalesActivos = mockProfesionales.filter(p => p.activo);
  
  select.innerHTML = '<option value="">— Sin asignar —</option>' +
    profesionalesActivos.map(p => 
      `<option value="${p.id}">${p.nombre} ${p.apellido} - ${p.especialidad}</option>`
    ).join('');
  
  console.log('✅ Selector de profesionales cargado:', profesionalesActivos.length, 'activos');
}

// ============================================
// MOSTRAR DATOS DE PERSONA SELECCIONADA
// ============================================
function showPersonInfo() {
  const select = $("personId");
  const selectedOption = select.options[select.selectedIndex];
  const personInfo = $("personInfo");
  const personDetails = $("personDetails");
  
  if (select.value) {
    const nombre = selectedOption.getAttribute('data-nombre');
    const dni = selectedOption.getAttribute('data-dni');
    const edad = selectedOption.getAttribute('data-edad');
    const familia = selectedOption.getAttribute('data-familia');
    
    personDetails.innerHTML = `
      <div><strong>Nombre:</strong> ${nombre}</div>
      <div><strong>DNI:</strong> ${dni}</div>
      <div><strong>Edad:</strong> ${edad} años</div>
      <div><strong>Grupo Familiar:</strong> ${familia}</div>
    `;
    personInfo.style.display = 'block';
  } else {
    personInfo.style.display = 'none';
  }
}

// ============================================
// MOSTRAR/OCULTAR CAMPOS
// ============================================
function toggleDerivadoPor() {
  const tipo = $("tipo").value;
  const container = document.getElementById("derivadoPorContainer");
  const input = $("derivadoPor");
  
  if (tipo === 'derivacion') {
    container.style.display = 'block';
    input.required = true;
  } else {
    container.style.display = 'none';
    input.required = false;
    input.value = '';
  }
}

function toggleOtroMotivo() {
  const motivo = $("motivo").value;
  const container = document.getElementById("otroMotivoContainer");
  const input = $("otroMotivo");
  
  if (motivo === 'Otro') {
    container.style.display = 'block';
    input.required = true;
  } else {
    container.style.display = 'none';
    input.required = false;
    input.value = '';
  }
}

// ============================================
// CONSTRUIR PAYLOAD DE CONSULTA
// ============================================
function buildConsultaPayload() {
  const personId = $("personId").value;
  const personOption = $("personId").options[$("personId").selectedIndex];
  const personaNombre = personOption.getAttribute('data-nombre');
  const personaDni = personOption.getAttribute('data-dni');
  
  const persona = mockPersonas.find(p => p.id === personId);
  
  let motivoFinal = $("motivo").value;
  if (motivoFinal === 'Otro') {
    motivoFinal = $("otroMotivo").value.trim();
  }
  
  const payload = {
    personId: personId,
    personaNombre: personaNombre,
    personDni: personaDni,
    householdId: persona ? persona.householdId : '',
    tipo: $("tipo").value,
    derivadoPor: $("derivadoPor").value.trim(),
    motivo: motivoFinal,
    descripcion: $("descripcion").value.trim(),
    prioridad: $("prioridad").value,
    profesionalAsignado: $("profesionalAsignado").value || '',
    estado: 'pendiente',
    accionesTomadas: '',
    fechaResolucion: null,
    historicoEstados: [
      {
        estado: 'pendiente',
        fecha: new Date(),
        usuario: sessionStorage.getItem('currentUser') || 'admin'
      }
    ],
    observaciones: []
  };
  
  if (payload.profesionalAsignado) {
    const prof = mockProfesionales.find(p => p.id === payload.profesionalAsignado);
    payload.profesionalNombre = prof ? `${prof.nombre} ${prof.apellido}` : '';
  } else {
    payload.profesionalNombre = '';
  }
  
  const obsInicial = $("observacionInicial").value.trim();
  if (obsInicial) {
    payload.observaciones.push({
      fecha: new Date(),
      usuario: sessionStorage.getItem('currentUser') || 'admin',
      nota: obsInicial
    });
  }
  
  return payload;
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
// GUARDAR CONSULTA
// ============================================
async function saveConsulta(payload) {
  try {
    const newConsulta = {
      id: `consulta_${Date.now()}`,
      ...payload,
      fechaCreacion: { toDate: () => new Date() }
    };
    
    console.log('Nueva consulta creada:', newConsulta);
    
    if (USE_MOCK_DATA) {
      const stored = localStorage.getItem('mockConsultas');
      let consultas = [];
      
      if (stored) {
        try {
          consultas = JSON.parse(stored);
        } catch (e) {
          console.error('Error parseando consultas:', e);
        }
      }
      
      consultas.push({
        ...newConsulta,
        fechaCreacion: { _date: new Date().toISOString() },
        fechaResolucion: null
      });
      
      localStorage.setItem('mockConsultas', JSON.stringify(consultas));
      
      // RECALCULAR CASOS DE PROFESIONALES
      if (payload.profesionalAsignado) {
        recalcularCasosProfesionales();
      }
    }
    
    const mensaje = currentUserRole === 'operador'
      ? `✅ Consulta registrada por operador: ${sessionStorage.getItem('currentUser')}`
      : '✅ Consulta registrada exitosamente';
    statusEl.innerHTML = `<span class="ok">${mensaje}</span>`;
    
    if (payload.profesionalAsignado) {
      setTimeout(() => {
        mostrarConfirmacionWhatsApp(newConsulta);
      }, 800);
    } else {
      setTimeout(() => {
        window.location.href = 'consultas.html';
      }, 1500);
    }
    
  } catch (error) {
    console.error('Error guardando consulta:', error);
    statusEl.innerHTML = `<span class="err">❌ Error al guardar: ${error.message}</span>`;
  }
}

// ============================================
// VALIDACIONES
// ============================================
function validateForm() {
  const personId = $("personId").value;
  const tipo = $("tipo").value;
  const derivadoPor = $("derivadoPor").value.trim();
  const motivo = $("motivo").value;
  const otroMotivo = $("otroMotivo").value.trim();
  const descripcion = $("descripcion").value.trim();
  
  if (!personId) {
    statusEl.innerHTML = `<span class="err">❌ Debe seleccionar una persona</span>`;
    $("personId").focus();
    return false;
  }
  
  if (!tipo) {
    statusEl.innerHTML = `<span class="err">❌ Debe seleccionar el tipo de consulta</span>`;
    $("tipo").focus();
    return false;
  }
  
  if (tipo === 'derivacion' && !derivadoPor) {
    statusEl.innerHTML = `<span class="err">❌ Debe indicar quién deriva la consulta</span>`;
    $("derivadoPor").focus();
    return false;
  }
  
  if (!motivo) {
    statusEl.innerHTML = `<span class="err">❌ Debe seleccionar el motivo</span>`;
    $("motivo").focus();
    return false;
  }
  
  if (motivo === 'Otro' && !otroMotivo) {
    statusEl.innerHTML = `<span class="err">❌ Debe especificar el motivo</span>`;
    $("otroMotivo").focus();
    return false;
  }
  
  if (!descripcion) {
    statusEl.innerHTML = `<span class="err">❌ Debe agregar una descripción</span>`;
    $("descripcion").focus();
    return false;
  }
  
  if (descripcion.length < 20) {
    statusEl.innerHTML = `<span class="err">❌ La descripción debe tener al menos 20 caracteres</span>`;
    $("descripcion").focus();
    return false;
  }
  
  return true;
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  if (!checkAuth()) {
    return;
  }
  
  // IMPORTANTE: Cargar profesionales PRIMERO desde localStorage
  cargarProfesionalesDeLocalStorage();
  
  loadPersonas();
  loadProfesionales();
  
  $("personId").addEventListener('change', showPersonInfo);
  $("tipo").addEventListener('change', toggleDerivadoPor);
  $("motivo").addEventListener('change', toggleOtroMotivo);
});

$("consultaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  statusEl.textContent = "Guardando consulta...";
  
  const payload = buildConsultaPayload();
  await saveConsulta(payload);
});
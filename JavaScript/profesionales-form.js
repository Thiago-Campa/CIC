// ============================================
// CONFIGURACIÓN: Modo de datos
// ============================================
const USE_MOCK_DATA = true; // Cambiar a false cuando Firebase esté listo

// ============================================
// DATOS MOCK (mismo que profesionales.js)
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
const $ = (id) => document.getElementById(id);
const statusEl = $("status");
let editMode = false;
let currentProfId = null;
let currentUserRole = null;

// ============================================
// AUTENTICACIÓN Y PERMISOS
// ============================================
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentUser = sessionStorage.getItem('currentUser');
  const userRole = sessionStorage.getItem('userRole');

  if (isLoggedIn === 'true' && currentUser) {
    currentUserRole = userRole || 'admin';
    
    // Verificar permisos para acceder al formulario
    if (currentUserRole === 'lectura') {
      alert('❌ ACCESO DENEGADO\n\nUsuarios de solo lectura no pueden crear o editar profesionales.');
      window.location.href = 'profesionales.html';
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
// UTILIDADES
// ============================================
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ============================================
// CARGAR DATOS PARA EDICIÓN
// ============================================
async function loadProfesionalData(profId) {
  try {
    // TODO: Cuando Firebase esté listo
    // const docRef = doc(db, "profesionales", profId);
    // const docSnap = await getDoc(docRef);
    // if (!docSnap.exists()) { ... }
    // const prof = docSnap.data();
    
    // MOCK: Cargar desde localStorage
    const stored = localStorage.getItem('mockProfesionales');
    let profesionales = mockProfesionales;
    
    if (stored) {
      try {
        profesionales = JSON.parse(stored);
      } catch (e) {
        console.error('Error parseando profesionales:', e);
      }
    }
    
    const prof = profesionales.find(p => p.id === profId);
    
    if (!prof) {
      alert('Profesional no encontrado');
      window.location.href = 'profesionales.html';
      return;
    }
    
    // Llenar el formulario con los datos
    $("nombre").value = prof.nombre || '';
    $("apellido").value = prof.apellido || '';
    $("email").value = prof.email || '';
    $("telefono").value = prof.telefono || '';
    $("especialidad").value = prof.especialidad || '';
    $("matricula").value = prof.matricula || '';
    $("horarios").value = prof.horarios || '';
    $("activo").value = prof.activo.toString();
    
    // Cambiar título
    $("formTitle").textContent = `Editar Profesional: ${prof.nombre} ${prof.apellido}`;
    $("submitBtn").textContent = "Actualizar Profesional";
    
  } catch (error) {
    console.error('Error cargando profesional:', error);
    statusEl.innerHTML = `<span class="err">❌ Error al cargar datos: ${error.message}</span>`;
  }
}

// ============================================
// GUARDAR PROFESIONAL
// ============================================
function buildProfesionalPayload() {
  return {
    nombre: $("nombre").value.trim(),
    apellido: $("apellido").value.trim(),
    email: $("email").value.trim(),
    telefono: $("telefono").value.trim(),
    especialidad: $("especialidad").value,
    matricula: $("matricula").value.trim(),
    horarios: $("horarios").value.trim(),
    activo: $("activo").value === "true",
    casosActivos: 0, // Por defecto
    casosResueltos: 0, // Por defecto
  };
}

async function saveProfesional(payload) {
  try {
    if (editMode && currentProfId) {
      // MODO EDICIÓN
      // TODO: Cuando Firebase esté listo
      // await updateDoc(doc(db, "profesionales", currentProfId), payload);
      
      // MOCK: Cargar, actualizar y guardar en localStorage
      const stored = localStorage.getItem('mockProfesionales');
      let profesionales = [];
      
      if (stored) {
        try {
          profesionales = JSON.parse(stored);
        } catch (e) {
          console.error('Error parseando profesionales:', e);
        }
      }
      
      const index = profesionales.findIndex(p => p.id === currentProfId);
      if (index !== -1) {
        profesionales[index] = { ...profesionales[index], ...payload };
        localStorage.setItem('mockProfesionales', JSON.stringify(profesionales));
      }
      
      const mensaje = currentUserRole === 'operador' 
        ? `✅ Profesional actualizado por operador: ${sessionStorage.getItem('currentUser')}`
        : '✅ Profesional actualizado exitosamente';
      statusEl.innerHTML = `<span class="ok">${mensaje}</span>`;
      
    } else {
      // MODO CREACIÓN
      // TODO: Cuando Firebase esté listo
      // const docRef = await addDoc(collection(db, "profesionales"), {
      //   ...payload,
      //   creadoEn: serverTimestamp()
      // });
      
      // MOCK: Agregar al array y guardar en localStorage
      const newProf = {
        id: `prof_${Date.now()}`,
        ...payload,
        creadoEn: { _date: new Date().toISOString() }
      };
      
      const stored = localStorage.getItem('mockProfesionales');
      let profesionales = [];
      
      if (stored) {
        try {
          profesionales = JSON.parse(stored);
        } catch (e) {
          console.error('Error parseando profesionales:', e);
        }
      }
      
      profesionales.push(newProf);
      localStorage.setItem('mockProfesionales', JSON.stringify(profesionales));
      
      const mensaje = currentUserRole === 'operador'
        ? `✅ Profesional creado por operador: ${sessionStorage.getItem('currentUser')}`
        : '✅ Profesional creado exitosamente';
      statusEl.innerHTML = `<span class="ok">${mensaje}</span>`;
    }
    
    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      window.location.href = 'profesionales.html';
    }, 1500);
    
  } catch (error) {
    console.error('Error guardando profesional:', error);
    statusEl.innerHTML = `<span class="err">❌ Error al guardar: ${error.message}</span>`;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación primero
  if (!checkAuth()) {
    return;
  }
  
  // Verificar si estamos en modo edición
  currentProfId = getURLParameter('id');
  
  if (currentProfId) {
    editMode = true;
    loadProfesionalData(currentProfId);
  }
});

// SUBMIT del formulario
$("profesionalForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Guardando...";
  
  const payload = buildProfesionalPayload();
  await saveProfesional(payload);
});
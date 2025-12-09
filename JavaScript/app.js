// js/app.js - VERSIÓN LOCALSTORAGE
const $ = (id) => document.getElementById(id);
const statusEl = $("status");

// ============================================
// UTILIDADES
// ============================================
const edadFrom = (yyyyMmDd) => {
  if (!yyyyMmDd) return null;
  const fn = new Date(yyyyMmDd), h = new Date();
  let e = h.getFullYear() - fn.getFullYear();
  const m = h.getMonth() - fn.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < fn.getDate())) e--;
  return e;
};

// Validar formato CUIT (XX-XXXXXXXX-X)
function validarCUIT(cuit) {
  if (!cuit) return true; // Opcional
  const regex = /^\d{2}-\d{8}-\d{1}$/;
  return regex.test(cuit);
}

// Formatear CUIT mientras se escribe
function formatearCUIT(input) {
  let value = input.replace(/\D/g, ''); // Solo números
  if (value.length > 2) {
    value = value.slice(0, 2) + '-' + value.slice(2);
  }
  if (value.length > 11) {
    value = value.slice(0, 11) + '-' + value.slice(11, 12);
  }
  return value;
}

// ============================================
// LOCALSTORAGE HELPERS
// ============================================
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error leyendo de localStorage:', e);
    return null;
  }
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// HOUSEHOLD
// ============================================
function ensureHousehold() {
  const hhId = $("hhId").value.trim();
  
  // Cargar households existentes
  let households = getFromLocalStorage('cic_households') || {};
  
  // Si hay ID, actualizar o crear
  if (hhId) {
    if (!households[hhId]) {
      // Crear nuevo con ese ID
      households[hhId] = {
        id: hhId,
        grupoFamiliar: $("grupoFamiliar").value.trim() || "",
        vivienda: $("vivienda").value || "",
        direccion: {
          calle: $("calle").value || "",
          numero: $("numero").value || "",
          barrio: $("barrio").value || "",
          ciudad: $("ciudad").value || "",
          provincia: $("provincia").value || ""
        },
        miembros: [],
        creadoEn: new Date().toISOString()
      };
    } else {
      // Actualizar existente (merge)
      households[hhId] = {
        ...households[hhId],
        grupoFamiliar: $("grupoFamiliar").value.trim() || households[hhId].grupoFamiliar || "",
        vivienda: $("vivienda").value || households[hhId].vivienda || "",
        direccion: {
          ...(households[hhId].direccion || {}),
          calle: $("calle").value || households[hhId].direccion?.calle || "",
          numero: $("numero").value || households[hhId].direccion?.numero || "",
          barrio: $("barrio").value || households[hhId].direccion?.barrio || "",
          ciudad: $("ciudad").value || households[hhId].direccion?.ciudad || "",
          provincia: $("provincia").value || households[hhId].direccion?.provincia || ""
        }
      };
    }
    
    saveToLocalStorage('cic_households', households);
    return hhId;
  }
  
  // Crear uno nuevo con ID autogenerado
  const newId = generateId('household');
  households[newId] = {
    id: newId,
    grupoFamiliar: $("grupoFamiliar").value.trim() || "",
    vivienda: $("vivienda").value || "",
    direccion: {
      calle: $("calle").value || "",
      numero: $("numero").value || "",
      barrio: $("barrio").value || "",
      ciudad: $("ciudad").value || "",
      provincia: $("provincia").value || ""
    },
    miembros: [],
    creadoEn: new Date().toISOString()
  };
  
  saveToLocalStorage('cic_households', households);
  return newId;
}

// ============================================
// PERSON
// ============================================
function buildPersonPayload(householdId) {
  const edad = edadFrom($("fechaNacimiento").value);
  const cuitValue = $("cuit").value.trim();
  
  const payload = {
    id: generateId('person'),
    householdId,
    relacionHogar: $("relacionHogar").value || "",
    nombre: $("nombre").value.trim(),
    apellido: $("apellido").value.trim(),
    dni: $("dni").value.trim(),
    cuit: cuitValue || "",
    fechaNacimiento: $("fechaNacimiento").value || "",
    edad,
    sexo: $("sexo").value || "",
    correo: $("email").value.trim(),
    tel: $("telefono").value.trim(),
    ocupacion: $("ocupacion").value.trim(),
    estadoCivil: $("estadoCivil").value || "nd",
    educacion: {
      nivelActual: $("nivelActual").value || "",
      institucion: $("institucion").value || "",
      estado: $("estadoEdu").value || "",
      anteriores: []
    },
    discapacidad: {
      tiene: $("tieneDis").value === "true",
      tipo: $("tipoDis").value.trim(),
      tratamientoMedico: $("tratDis").value === "true",
      conCUD: $("conCUD") ? $("conCUD").value === "true" : false,
      cudVencimiento: $("cudVto") ? $("cudVto").value || "" : ""
    },
    beneficioSocial: {
      tiene: $("tieneBen").value === "true",
      nombre: $("nomBen").value.trim(),
      organismo: $("orgBen").value.trim(),
      estado: $("estBen") ? $("estBen").value || "" : ""
    },
    obraSocial: {
      tiene: $("tieneOS").value === "true",
      nombre: $("nomOS").value.trim()
    },
    flags: {
      esMayor: (edad !== null ? edad >= 18 : null),
      hasDisability: $("tieneDis").value === "true",
      hasBenefit: $("tieneBen").value === "true",
      hasObraSocial: $("tieneOS").value === "true"
    },
    creadoEn: new Date().toISOString()
  };
  
  // Parsear estudios anteriores
  const prevLines = $("anteriores").value.split("\n").map(s => s.trim()).filter(Boolean);
  for (const line of prevLines) {
    const [nivel, institucion, estado] = line.split("|").map(s => (s || "").trim());
    if (nivel || institucion || estado) {
      payload.educacion.anteriores.push({ 
        nivel: nivel || "", 
        institucion: institucion || "", 
        estado: estado || "" 
      });
    }
  }
  
  return payload;
}

function persistPersonToLocalStorage(householdId, personPayload) {
  // 1. Guardar persona
  let persons = getFromLocalStorage('cic_persons') || [];
  persons.push(personPayload);
  saveToLocalStorage('cic_persons', persons);
  
  // 2. Actualizar household con snapshot del miembro
  let households = getFromLocalStorage('cic_households') || {};
  if (households[householdId]) {
    if (!households[householdId].miembros) {
      households[householdId].miembros = [];
    }
    
    households[householdId].miembros.push({
      personId: personPayload.id,
      relacionHogar: personPayload.relacionHogar,
      nombre: personPayload.nombre,
      apellido: personPayload.apellido,
      dni: personPayload.dni,
      cuit: personPayload.cuit,
      edad: personPayload.edad,
      sexo: personPayload.sexo
    });
    
    saveToLocalStorage('cic_households', households);
  }
  
  return personPayload.id;
}

// ============================================
// EVENT LISTENERS
// ============================================
// Auto-formatear CUIT mientras se escribe
document.addEventListener('DOMContentLoaded', function() {
  const cuitInput = $("cuit");
  
  if (cuitInput) {
    cuitInput.addEventListener('input', function(e) {
      const cursorPos = e.target.selectionStart;
      const oldLength = e.target.value.length;
      e.target.value = formatearCUIT(e.target.value);
      const newLength = e.target.value.length;
      
      // Ajustar cursor después del formato
      const diff = newLength - oldLength;
      e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
    });
  }
});

// SUBMIT
document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Validar CUIT antes de enviar
  const cuitValue = $("cuit").value.trim();
  if (cuitValue && !validarCUIT(cuitValue)) {
    statusEl.innerHTML = `<span class="err">❌ El formato del CUIT es incorrecto. Use: XX-XXXXXXXX-X</span>`;
    $("cuit").focus();
    return;
  }
  
  statusEl.textContent = "Guardando...";
  
  try {
    const hhId = ensureHousehold();
    const personPayload = buildPersonPayload(hhId);
    const personId = persistPersonToLocalStorage(hhId, personPayload);
    
    statusEl.innerHTML = `<span class="ok">✅ Guardado exitosamente!<br>Household: <code>${hhId}</code><br>Persona: <code>${personId}</code></span>`;
    
    e.target.reset();
    $("hhId").value = hhId; // seguir sumando al mismo hogar
    
    // Scroll al mensaje de éxito
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = `<span class="err">❌ Error: ${err.message || err}</span>`;
  }
});
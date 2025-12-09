// js/app.js - VERSIÓN LOCALSTORAGE CON SELECTOR DE FAMILIAS
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
// CARGAR FAMILIAS EXISTENTES
// ============================================
function cargarFamiliasExistentes() {
  const households = getFromLocalStorage('cic_households') || {};
  const selectFamilia = $('familiaExistente');
  
  if (!selectFamilia) return;
  
  // Limpiar selector
  selectFamilia.innerHTML = '<option value="">— Crear nueva familia —</option>';
  
  // Agregar familias existentes
  const familias = Object.values(households).sort((a, b) => 
    (a.grupoFamiliar || '').localeCompare(b.grupoFamiliar || '')
  );
  
  familias.forEach(familia => {
    const miembrosCount = familia.miembros ? familia.miembros.length : 0;
    const option = document.createElement('option');
    option.value = familia.id;
    option.textContent = `${familia.grupoFamiliar || 'Sin nombre'} (${miembrosCount} miembro${miembrosCount !== 1 ? 's' : ''})`;
    selectFamilia.appendChild(option);
  });
  
  console.log(`✅ Cargadas ${familias.length} familias existentes`);
}

function onFamiliaExistenteChange() {
  const selectFamilia = $('familiaExistente');
  const hhIdInput = $('hhId');
  const grupoFamiliarInput = $('grupoFamiliar');
  const nuevaFamiliaSection = $('nuevaFamiliaSection');
  
  if (selectFamilia.value) {
    // Familia existente seleccionada
    hhIdInput.value = selectFamilia.value;
    
    // Cargar datos de la familia
    const households = getFromLocalStorage('cic_households') || {};
    const familia = households[selectFamilia.value];
    
    if (familia) {
      grupoFamiliarInput.value = familia.grupoFamiliar || '';
      $('vivienda').value = familia.vivienda || '';
      $('calle').value = familia.direccion?.calle || '';
      $('numero').value = familia.direccion?.numero || '';
      $('barrio').value = familia.direccion?.barrio || '';
      $('ciudad').value = familia.direccion?.ciudad || 'Rosario';
      $('provincia').value = familia.direccion?.provincia || 'Santa Fe';
      
      // Deshabilitar campos de household (ya existen)
      nuevaFamiliaSection.style.opacity = '0.6';
      nuevaFamiliaSection.querySelectorAll('input, select').forEach(input => {
        if (input.id !== 'grupoFamiliar') {
          input.disabled = true;
        }
      });
      
      // Mostrar info de la familia
      mostrarInfoFamilia(familia);
    }
  } else {
    // Nueva familia
    hhIdInput.value = '';
    grupoFamiliarInput.value = '';
    $('vivienda').value = '';
    $('calle').value = '';
    $('numero').value = '';
    $('barrio').value = '';
    $('ciudad').value = 'Rosario';
    $('provincia').value = 'Santa Fe';
    
    // Habilitar campos
    nuevaFamiliaSection.style.opacity = '1';
    nuevaFamiliaSection.querySelectorAll('input, select').forEach(input => {
      input.disabled = false;
    });
    
    // Ocultar info de familia
    const infoDiv = $('infoFamiliaExistente');
    if (infoDiv) infoDiv.remove();
  }
}

function mostrarInfoFamilia(familia) {
  // Remover info anterior si existe
  const infoAnterior = $('infoFamiliaExistente');
  if (infoAnterior) infoAnterior.remove();
  
  // Crear div con info
  const infoDiv = document.createElement('div');
  infoDiv.id = 'infoFamiliaExistente';
  infoDiv.style.cssText = `
    background: #e8f4f8;
    border: 2px solid #3498db;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
  `;
  
  const miembros = familia.miembros || [];
  const miembrosList = miembros.length > 0 
    ? `<ul style="margin: 10px 0; padding-left: 20px;">
        ${miembros.map(m => `<li>${m.nombre} ${m.apellido} (${m.relacionHogar}) - DNI: ${m.dni}</li>`).join('')}
       </ul>`
    : '<p style="margin: 10px 0;">No hay miembros registrados aún.</p>';
  
  infoDiv.innerHTML = `
    <strong style="color: #2c3e50;">ℹ️ Familia Seleccionada:</strong>
    <p style="margin: 10px 0;"><strong>${familia.grupoFamiliar || 'Sin nombre'}</strong></p>
    <p style="margin: 5px 0; font-size: 14px;">Dirección: ${[familia.direccion?.calle, familia.direccion?.numero, familia.direccion?.barrio].filter(Boolean).join(', ') || 'No especificada'}</p>
    <p style="margin: 10px 0; font-weight: bold;">Miembros actuales (${miembros.length}):</p>
    ${miembrosList}
    <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
      💡 La nueva persona se agregará a esta familia. Los datos de dirección están prellenados.
    </p>
  `;
  
  // Insertar después del selector
  const selectFamilia = $('familiaExistente');
  selectFamilia.parentElement.parentElement.insertBefore(infoDiv, selectFamilia.parentElement.nextSibling);
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
  
  // Cargar familias existentes
  cargarFamiliasExistentes();
  
  // Event listener para selector de familia
  const selectFamilia = $('familiaExistente');
  if (selectFamilia) {
    selectFamilia.addEventListener('change', onFamiliaExistenteChange);
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
    
    // Recargar familias existentes
    cargarFamiliasExistentes();
    
    // Scroll al mensaje de éxito
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = `<span class="err">❌ Error: ${err.message || err}</span>`;
  }
});
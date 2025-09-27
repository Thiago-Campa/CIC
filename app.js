// js/app.js
import {
  db, collection, doc, addDoc, setDoc, getDoc, updateDoc,
  serverTimestamp, arrayUnion
} from "./firebase.js";

const $ = (id) => document.getElementById(id);
const statusEl = $("status");

const edadFrom = (yyyyMmDd) => {
  if (!yyyyMmDd) return null;
  const fn = new Date(yyyyMmDd), h = new Date();
  let e = h.getFullYear() - fn.getFullYear();
  const m = h.getMonth() - fn.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < fn.getDate())) e--;
  return e;
};

async function ensureHousehold() {
  const hhId = $("hhId").value.trim();

  // Si hay ID, lo busco; si no existe, lo creo con merge para no perder datos futuros
  if (hhId) {
    const hhRef = doc(db, "households", hhId);
    const snap = await getDoc(hhRef);
    if (!snap.exists()) {
      await setDoc(hhRef, {
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
        creadoEn: serverTimestamp()
      }, { merge: true });
    } else {
      // merge no destructivo
      await setDoc(hhRef, {
        grupoFamiliar: $("grupoFamiliar").value.trim() || snap.data().grupoFamiliar || "",
        vivienda: $("vivienda").value || snap.data().vivienda || "",
        direccion: {
          ...(snap.data().direccion || {}),
          calle: $("calle").value || (snap.data().direccion || {}).calle || "",
          numero: $("numero").value || (snap.data().direccion || {}).numero || "",
          barrio: $("barrio").value || (snap.data().direccion || {}).barrio || "",
          ciudad: $("ciudad").value || (snap.data().direccion || {}).ciudad || "",
          provincia: $("provincia").value || (snap.data().direccion || {}).provincia || ""
        }
      }, { merge: true });
    }
    return hhRef;
  }

  // Crear uno nuevo
  const hhRef = doc(collection(db, "households"));
  await setDoc(hhRef, {
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
    creadoEn: serverTimestamp()
  });
  return hhRef;
}

function buildPersonPayload(householdId) {
  const edad = edadFrom($("fechaNacimiento").value);
  const payload = {
    householdId,
    relacionHogar: $("relacionHogar").value || "",
    nombre: $("nombre").value.trim(),
    apellido: $("apellido").value.trim(),
    dni: $("dni").value.trim(),
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
      tratamientoMedico: $("tratDis").value === "true"
    },
    beneficioSocial: {
      tiene: $("tieneBen").value === "true",
      nombre: $("nomBen").value.trim(),
      organismo: $("orgBen").value.trim()
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
    creadoEn: serverTimestamp()
  };

  // Parsear estudios anteriores (una línea por estudio: "nivel | institución | estado")
  const prevLines = $("anteriores").value.split("\n").map(s => s.trim()).filter(Boolean);
  for (const line of prevLines) {
    const [nivel, institucion, estado] = line.split("|").map(s => (s || "").trim());
    if (nivel || institucion || estado) {
      payload.educacion.anteriores.push({ nivel: nivel || "", institucion: institucion || "", estado: estado || "" });
    }
  }
  return payload;
}

async function persistPersonGraph(hhRef, personPayload) {
  // PERSON
  const personRef = doc(collection(db, "persons"));
  await setDoc(personRef, personPayload);

  // EDUCATIONS (actual)
  if (personPayload.educacion.nivelActual || personPayload.educacion.institucion || personPayload.educacion.estado) {
    await addDoc(collection(db, "educations"), {
      personId: personRef.id,
      nivel: personPayload.educacion.nivelActual || "",
      institucion: personPayload.educacion.institucion || "",
      estado: personPayload.educacion.estado || "",
      esActual: true
    });
  }
  // EDUCATIONS (anteriores)
  for (const e of personPayload.educacion.anteriores) {
    await addDoc(collection(db, "educations"), {
      personId: personRef.id, nivel: e.nivel || "", institucion: e.institucion || "",
      estado: e.estado || "", esActual: false
    });
  }

  // PERSON_DISABILITY
  if (personPayload.discapacidad.tiene) {
    await addDoc(collection(db, "person_disabilities"), {
      personId: personRef.id,
      tipo: personPayload.discapacidad.tipo || "",
      tratamientoMedico: personPayload.discapacidad.tratamientoMedico || false,
      conCUD: $("conCUD").value === "true",
      cudVencimiento: $("cudVto").value || ""
    });
  }

  // PERSON_BENEFIT
  if (personPayload.beneficioSocial.tiene) {
    await addDoc(collection(db, "person_benefits"), {
      personId: personRef.id,
      nombre: personPayload.beneficioSocial.nombre || "",
      organismo: personPayload.beneficioSocial.organismo || "",
      estado: $("estBen").value || ""
    });
  }

  // Vincular en household.miembros (snapshot mínimo)
  await updateDoc(hhRef, {
    miembros: arrayUnion({
      personId: personRef.id,
      relacionHogar: personPayload.relacionHogar,
      nombre: personPayload.nombre,
      apellido: personPayload.apellido,
      dni: personPayload.dni,
      edad: personPayload.edad,
      sexo: personPayload.sexo
    })
  });

  return personRef.id;
}

// SUBMIT
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Guardando...";
  try {
    const hhRef = await ensureHousehold();
    const personPayload = buildPersonPayload(hhRef.id);
    const personId = await persistPersonGraph(hhRef, personPayload);

    statusEl.innerHTML = `<span class="ok">✅ Guardado: household <code>${hhRef.id}</code> • person <code>${personId}</code></span>`;
    e.target.reset();
    $("hhId").value = hhRef.id; // seguir sumando al mismo hogar
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = `<span class="err">❌ Error: ${err.message || err}</span>`;
  }
});

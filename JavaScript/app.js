// /JavaScript/app.js

import { db, storage } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
  setDoc, // necesario para definir IDs personalizados
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// --------- REFERENCIAS DEL DOM ---------
const form = document.getElementById("formulario");
const statusEl = document.getElementById("status");
const listaGrupos = document.getElementById("listaGrupos");
const inputFoto = document.getElementById("foto");
const preview = document.getElementById("preview");

// --------- FUNCIONES UTILES ---------

function setStatus(msg, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "red" : "green";
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// Mostrar preview de la foto
if (inputFoto && preview) {
  inputFoto.addEventListener("change", () => {
    preview.innerHTML = "";
    const file = inputFoto.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.style.maxWidth = "200px";
    img.style.maxHeight = "200px";
    img.style.objectFit = "cover";

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// --------- CARGAR GRUPOS FAMILIARES EXISTENTES ---------

async function cargarGruposFamiliares() {
  try {
    const snap = await getDocs(collection(db, "households"));
    listaGrupos.innerHTML = "";
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const opt = document.createElement("option");
      opt.value = data.nombre || docSnap.id;
      listaGrupos.appendChild(opt);
    });
  } catch (err) {
    console.error("Error cargando grupos:", err);
    setStatus("No se pudieron cargar los grupos familiares existentes.", true);
  }
}

document.addEventListener("DOMContentLoaded", cargarGruposFamiliares);

// --------- MANEJO DEL FORMULARIO ---------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Guardando datos, por favor espere...");

  const btnSubmit = form.querySelector('button[type="submit"]');
  if (btnSubmit) btnSubmit.disabled = true;

  try {
    // --- LEER CAMPOS DEL FORMULARIO ---

    // Grupo familiar
    const hhIdManual = getValue("hhId"); // código manual ingresado
    const grupoFamiliar = getValue("grupoFamiliar");
    const vivienda = getValue("vivienda");
    const calle = getValue("calle");
    const numero = getValue("numero");
    const barrio = getValue("barrio");
    const ciudad = getValue("ciudad");
    const provincia = getValue("provincia");

    // Persona
    const relacionHogar = getValue("relacionHogar");
    const nombre = getValue("nombre");
    const apellido = getValue("apellido");
    const dni = getValue("dni");
    const fechaNacimiento = getValue("fechaNacimiento");
    const sexo = getValue("sexo");
    const email = getValue("email");
    const telefono = getValue("telefono");
    const ocupacion = getValue("ocupacion");
    const estadoCivil = getValue("estadoCivil");

    // Educación
    const nivelActual = getValue("nivelActual");
    const institucion = getValue("institucion");
    const estadoEdu = getValue("estadoEdu");
    const anteriores = getValue("anteriores");

    // Discapacidad / Beneficio / Obra social
    const tieneDis = getValue("tieneDis");
    const tipoDis = getValue("tipoDis");
    const tratDis = getValue("tratDis");
    const conCUD = getValue("conCUD");
    const cudVto = getValue("cudVto");

    const tieneBen = getValue("tieneBen");
    const nomBen = getValue("nomBen");
    const orgBen = getValue("orgBen");
    const estBen = getValue("estBen");

    const tieneOS = getValue("tieneOS");
    const nomOS = getValue("nomOS");

    // Foto
    const file = inputFoto?.files?.[0] || null;

    // --------- VALIDACIONES BASICAS ---------

    if (!nombre || !apellido) {
      throw new Error("Nombre y apellido son obligatorios.");
    }

    // Para evitar duplicados, pedimos DNI o Email (para la lógica de duplicados)
    if (!dni && !email) {
      throw new Error("Debe ingresar al menos DNI o correo para evitar duplicados.");
    }

    // Para el ID personalizado, necesitamos sí o sí DNI
    if (!dni) {
      throw new Error("Debe ingresar DNI para poder generar el ID de la persona.");
    }

    // --------- VERIFICAR USUARIO DUPLICADO ---------
    // Regla: no se permite registrar otra persona con el mismo DNI (si lo cargó)
    // o el mismo email (si no tiene DNI).

    let q;
    if (dni) {
      q = query(collection(db, "persons"), where("dni", "==", dni));
    } else {
      q = query(collection(db, "persons"), where("email", "==", email));
    }

    const dupSnap = await getDocs(q);
    if (!dupSnap.empty) {
      throw new Error("Ya existe una persona registrada con ese DNI o correo.");
    }

    // --------- CREAR / OBTENER GRUPO FAMILIAR ---------
    let householdId;

    if (hhIdManual) {
      // Si el usuario escribe algo en hhId, lo usamos como ID (y creamos si no existe)
      const hhRef = doc(db, "households", hhIdManual);
      const hhSnap = await getDoc(hhRef);

      if (!hhSnap.exists()) {
        // Crear grupo familiar nuevo con ese ID
        const hhData = {
          nombre: grupoFamiliar || hhIdManual, // si no puso nombre, usamos el ID como nombre
          vivienda: vivienda || "",
          calle: calle || "",
          numero: numero || "",
          barrio: barrio || "",
          ciudad: ciudad || "",
          provincia: provincia || "",
          creadoEn: serverTimestamp(),
        };
        await setDoc(hhRef, hhData);
      }

      householdId = hhRef.id;
    } else {
      // Si no hay hhIdManual, usamos el flujo por nombre
      if (grupoFamiliar) {
        const qHh = query(
          collection(db, "households"),
          where("nombre", "==", grupoFamiliar)
        );
        const hhRes = await getDocs(qHh);
        if (!hhRes.empty) {
          // usar el primero que coincida
          householdId = hhRes.docs[0].id;
        }
      }

      // Si no existe todavía, crear uno nuevo
      if (!householdId) {
        const hhData = {
          nombre:
            grupoFamiliar ||
            `Grupo de ${apellido || nombre || "sin nombre"}`,
          vivienda: vivienda || "",
          calle: calle || "",
          numero: numero || "",
          barrio: barrio || "",
          ciudad: ciudad || "",
          provincia: provincia || "",
          creadoEn: serverTimestamp(),
        };

        const hhDocRef = await addDoc(collection(db, "households"), hhData);
        householdId = hhDocRef.id;
      }
    }

    // --------- SUBIR FOTO (SI HAY) ---------
    let fotoURL = "";
    if (file) {
      const baseNombre = dni || `${Date.now()}`;
      const storageRef = ref(
        storage,
        `fotosPersonas/${baseNombre}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      fotoURL = await getDownloadURL(storageRef);
    }

    // --------- GENERAR ID PERSONALIZADO PARA LA PERSONA ---------
    const inicialNombre = nombre.charAt(0).toUpperCase();
    const inicialApellido = apellido.charAt(0).toUpperCase();
    const customId = `${inicialNombre}${inicialApellido}${dni}`;

    // --------- GUARDAR PERSONA ---------

    const personaData = {
      householdId,
      relacionHogar,
      nombre,
      apellido,
      dni: dni || "",
      fechaNacimiento: fechaNacimiento || "",
      sexo: sexo || "",
      email: email || "",
      telefono: telefono || "",
      ocupacion: ocupacion || "",
      estadoCivil: estadoCivil || "",

      nivelActual: nivelActual || "",
      institucion: institucion || "",
      estadoEdu: estadoEdu || "",
      estudiosAnteriores: anteriores || "",

      tieneDis: tieneDis || "",
      tipoDis: tipoDis || "",
      tratDis: tratDis || "",
      conCUD: conCUD || "",
      cudVto: cudVto || "",

      tieneBen: tieneBen || "",
      nomBen: nomBen || "",
      orgBen: orgBen || "",
      estBen: estBen || "",

      tieneOS: tieneOS || "",
      nomOS: nomOS || "",

      fotoURL,
      creadoEn: serverTimestamp(),
      personaId: customId, // para tenerlo tambien en el documento
    };

    // Colección global de personas, con ID personalizado
    await setDoc(doc(db, "persons", customId), personaData);

    // Además, guardar dentro como subcolección con el mismo ID
    await setDoc(
      doc(db, "households", householdId, "persons", customId),
      personaData
    );

    setStatus("Formulario guardado correctamente.");
    form.reset();
    if (preview) preview.innerHTML = "";
    await cargarGruposFamiliares(); // refresca datalist con el posible nuevo grupo
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Ocurrió un error al guardar los datos.", true);
  } finally {
    const btnSubmit2 = form.querySelector('button[type="submit"]');
    if (btnSubmit2) btnSubmit2.disabled = false;
  }
});

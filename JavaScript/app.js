
// form.js
import { db, serverTimestamp } from "./firebase.js";
import {
  runTransaction, doc, collection, setDoc, getDoc, getDocs, query, orderBy, limit
} from "firebase/firestore";

const $ = (s, ctx=document)=>ctx.querySelector(s);
const statusEl = $("#status");
const form = $("#formulario");

// ==== helpers ====
function normStr(v){ return (v ?? "").toString().trim(); }
function onlyDigits(v){ return normStr(v).replace(/\D+/g,""); }
function slugifyName(v){
  return normStr(v)
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function toBool(v){
  if(v==null) return null;
  const s = String(v).trim().toLowerCase();
  if(["si","sí","true","1","yes"].includes(s)) return true;
  if(["no","false","0"].includes(s)) return false;
  return null;
}
function parseEstudios(txt){
  if(!txt) return [];
  return txt.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{
    const [nivel="", institucion="", estado=""] = l.split("|").map(x=>x?.trim()||"");
    return { nivel, institucion, estado };
  });
}

// ==== cache & datalist ====
const HOUSEHOLDS_CACHE = { list: [], loadedAt: 0 };

async function loadHouseholdsIntoCacheAndUI(){
  if(Date.now() - HOUSEHOLDS_CACHE.loadedAt < 60000 && HOUSEHOLDS_CACHE.list.length) return;

  // orden por nombre (si no hay, por id)
  const q = query(collection(db, "households"));
  const snap = await getDocs(q);

  HOUSEHOLDS_CACHE.list = [];
  snap.forEach(d=>{
    const data = d.data() || {};
    HOUSEHOLDS_CACHE.list.push({ id:d.id, nombre: normStr(data.grupoFamiliar||""), slug: normStr(data.slug||"") });
  });
  HOUSEHOLDS_CACHE.loadedAt = Date.now();

  const dl = $("#listaGrupos");
  if(dl){
    dl.innerHTML = "";
    HOUSEHOLDS_CACHE.list
      .sort((a,b)=> (a.nombre||a.id).localeCompare(b.nombre||b.id))
      .forEach(h=>{
        const opt = document.createElement("option");
        opt.value = h.nombre || h.id;
        dl.appendChild(opt);
      });
  }
}

// ==== ensureHousehold (modular + índice único por slug) ====
async function ensureHousehold(hhIdInput, grupoFamiliarInput){
  const hhId = normStr(hhIdInput);
  const nombre = normStr(grupoFamiliarInput);
  const slug = slugifyName(nombre);

  return await runTransaction(db, async (tx)=>{
    const householdsCol = collection(db, "households");

    // 1) Con ID explícito
    if(hhId){
      const ref = doc(householdsCol, hhId);
      const snap = await tx.get(ref);
      if(!snap.exists()){
        tx.set(ref, { createdAt: serverTimestamp(), systemNote: "Creado al vuelo por carga de persona" });
      }
      return ref.id;
    }

    // 2) Con nombre: usar índice household_slug_index/{slug}
    if(nombre){
      const idxRef = doc(collection(db, "household_slug_index"), slug);
      const idxSnap = await tx.get(idxRef);
      if(idxSnap.exists()){
        const { householdId } = idxSnap.data();
        return householdId; // reutiliza existente
      }

      // crear nuevo household y el índice
      const newRef = doc(householdsCol);
      tx.set(newRef, { grupoFamiliar: nombre, slug, createdAt: serverTimestamp() });
      tx.set(idxRef, { householdId: newRef.id, createdAt: serverTimestamp() });
      return newRef.id;
    }

    // 3) Sin datos → crear vacío
    const newRef = doc(householdsCol);
    tx.set(newRef, { createdAt: serverTimestamp() });
    return newRef.id;
  });
}

// ==== upsert household data ====
async function upsertHouseholdData(householdId, data){
  const ref = doc(collection(db, "households"), householdId);
  const payload = {
    updatedAt: serverTimestamp(),
    direccion: {
      calle: data.calle || "",
      numero: data.numero || "",
      barrio: data.barrio || "",
      ciudad: data.ciudad || "",
      provincia: data.provincia || "",
    }
  };
  if(data.grupoFamiliar) payload.grupoFamiliar = data.grupoFamiliar;
  if(data.vivienda) payload.vivienda = data.vivienda;

  await setDoc(ref, payload, { merge:true });
}

// ==== guardar persona con índice único de DNI ====
async function savePersonTransactional(householdId, p){
  const dniClean = onlyDigits(p.dni);
  const email = normStr(p.email).toLowerCase();

  if(!normStr(p.nombre) || !normStr(p.apellido)){
    throw new Error("Nombre y Apellido son obligatorios.");
  }
  if(!dniClean){
    throw new Error("DNI es requerido para verificar duplicados.");
  }

  const personPayload = {
    householdId,

    relacionHogar: normStr(p.relacionHogar),
    nombre: normStr(p.nombre),
    apellido: normStr(p.apellido),
    dni: dniClean,
    fechaNacimiento: normStr(p.fechaNacimiento),
    sexo: normStr(p.sexo),
    email,
    telefono: normStr(p.telefono),
    ocupacion: normStr(p.ocupacion),
    estadoCivil: normStr(p.estadoCivil),

    nivelActual: normStr(p.nivelActual),
    institucion: normStr(p.institucion),
    estadoEdu: normStr(p.estadoEdu),
    estudiosAnteriores: parseEstudios(p.anteriores),

    tieneDis_label: normStr(p.tieneDis),
    tieneDis: toBool(p.tieneDis),
    tipoDis: normStr(p.tipoDis),
    tratDis_label: normStr(p.tratDis),
    tratDis: toBool(p.tratDis),
    conCUD_label: normStr(p.conCUD),
    conCUD: toBool(p.conCUD),
    cudVto: normStr(p.cudVto),

    tieneBen_label: normStr(p.tieneBen),
    tieneBen: toBool(p.tieneBen),
    nomBen: normStr(p.nomBen),
    orgBen: normStr(p.orgBen),
    estBen: normStr(p.estBen),

    tieneOS_label: normStr(p.tieneOS),
    tieneOS: toBool(p.tieneOS),
    nomOS: normStr(p.nomOS),

    createdAt: serverTimestamp()
  };

  await runTransaction(db, async (tx)=>{
    const idxRef = doc(collection(db, "dni_index"), dniClean);
    const idxSnap = await tx.get(idxRef);
    if(idxSnap.exists()){
      throw new Error("Ya existe una persona registrada con ese DNI.");
    }

    const personRef = doc(collection(db, "persons"));
    tx.set(personRef, personPayload);
    tx.set(idxRef, { personId: personRef.id, householdId, createdAt: serverTimestamp() });
  });
}

// ==== submit ====
async function onSubmit(e){
  e.preventDefault();
  statusEl.textContent = "Guardando...";
  statusEl.classList.remove("ok","err");

  try{
    // HOUSEHOLD
    const householdPayload = {
      hhId: $("#hhId").value,
      grupoFamiliar: $("#grupoFamiliar").value,
      vivienda: $("#vivienda").value || "",
      calle: $("#calle").value,
      numero: $("#numero").value,
      barrio: $("#barrio").value,
      ciudad: $("#ciudad").value,
      provincia: $("#provincia").value,
    };
    const householdId = await ensureHousehold(householdPayload.hhId, householdPayload.grupoFamiliar);
    await upsertHouseholdData(householdId, householdPayload);

    // PERSON
    const personPayload = {
      relacionHogar: $("#relacionHogar").value,
      nombre: $("#nombre").value,
      apellido: $("#apellido").value,
      dni: $("#dni").value,
      fechaNacimiento: $("#fechaNacimiento").value,
      sexo: $("#sexo").value,
      email: $("#email").value,
      telefono: $("#telefono").value,
      ocupacion: $("#ocupacion").value,
      estadoCivil: $("#estadoCivil").value,

      nivelActual: $("#nivelActual").value,
      institucion: $("#institucion").value,
      estadoEdu: $("#estadoEdu").value,
      anteriores: $("#anteriores").value,

      tieneDis: $("#tieneDis").value,
      tipoDis: $("#tipoDis").value,
      tratDis: $("#tratDis").value,
      conCUD: $("#conCUD").value,
      cudVto: $("#cudVto").value,

      tieneBen: $("#tieneBen").value,
      nomBen: $("#nomBen").value,
      orgBen: $("#orgBen").value,
      estBen: $("#estBen").value,

      tieneOS: $("#tieneOS").value,
      nomOS: $("#nomOS").value,
    };

    await savePersonTransactional(householdId, personPayload);

    statusEl.textContent = `✔ Guardado. Household: ${householdId}`;
    statusEl.classList.add("ok");
    form.reset();
    $("#hhId").value = householdId; // seguir cargando al mismo hogar
    loadHouseholdsIntoCacheAndUI();

  }catch(err){
    console.error(err);
    statusEl.textContent = "Error: " + (err.message || "No se pudo guardar");
    statusEl.classList.add("err");
  }
}

// ==== init ====
document.addEventListener("DOMContentLoaded", ()=>{
  loadHouseholdsIntoCacheAndUI();
  form.addEventListener("submit", onSubmit);
});

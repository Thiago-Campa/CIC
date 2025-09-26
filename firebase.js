// js/firebase.js
// SDKs (ESM) desde CDN y export de utilidades que usa app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection, doc, addDoc, setDoc, getDoc, updateDoc,
  serverTimestamp, arrayUnion
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 1) Configuración de tu proyecto Firebase
const firebaseConfig = {
  // TODO: reemplazar por la configuración de tu proyecto
  // apiKey: "...",
  // authDomain: "...",
  // projectId: "...",
  // storageBucket: "...",
  // messagingSenderId: "...",
  // appId: "..."
};

// 2) Inicializar App + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3) Exportar db + helpers de Firestore que usa app.js
export {
  db,
  collection, doc, addDoc, setDoc, getDoc, updateDoc,
  serverTimestamp, arrayUnion
};

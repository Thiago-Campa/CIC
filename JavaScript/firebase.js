// /JavaScript/firebase.js
// Módulo de inicialización de Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Config del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyC53FSplPAH9DilXPurPbMl_5OHJvVeBbw",
  authDomain: "cic-db.firebaseapp.com",
  databaseURL: "https://cic-db-default-rtdb.firebaseio.com",
  projectId: "cic-db",
  storageBucket: "cic-db.firebasestorage.app",
  messagingSenderId: "200568123888",
  appId: "1:200568123888:web:348b446a1e5a60a5d7ad35",
  measurementId: "G-D17ZTJQX1E"
};

// Inicializar app
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const storage = getStorage(app);

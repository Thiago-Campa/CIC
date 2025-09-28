// firebase.js (CDN ESM)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC53FSplPAH9DilXPurPbMl_5OHJvVeBbw",
  authDomain: "cic-db.firebaseapp.com",
  projectId: "cic-db",
  // opcionales: databaseURL, storageBucket, etc.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// export para módulos
export { db, serverTimestamp };

// exponer para scripts no-modulares
window.db = db;
window.serverTimestamp = serverTimestamp;
console.log("[firebase] init ok");



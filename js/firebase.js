// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuAxMgfYcmgVUTXgvE8mWm2FeEGaVkIFA",
  authDomain: "pachos-panificadora.firebaseapp.com",
  projectId: "pachos-panificadora",
  storageBucket: "pachos-panificadora.firebasestorage.app",
  messagingSenderId: "1090965550427",
  appId: "1:1090965550427:web:24832e07c73dcddb3a567e"
};

const app = initializeApp(firebaseConfig);

// Exportamos la instancia de la base de datos
export const db = getFirestore(app);
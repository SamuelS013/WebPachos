// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC75jK43Kh4ptC0CHb7Uzfk0wIEvrpz6us",
    authDomain: "panificadora-pachos-75b2a.firebaseapp.com",
    projectId: "panificadora-pachos-75b2a",
    storageBucket: "panificadora-pachos-75b2a.firebasestorage.app",
    messagingSenderId: "582397152337",
    appId: "1:582397152337:web:eb3b667328a3f687913c70"
};

const app = initializeApp(firebaseConfig);

// Exportamos la instancia de la base de datos
export const db = getFirestore(app);
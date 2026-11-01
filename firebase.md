npm install -g firebase-tools

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC75jK43Kh4ptC0CHb7Uzfk0wIEvrpz6us",
    authDomain: "panificadora-pachos-75b2a.firebaseapp.com",
    projectId: "panificadora-pachos-75b2a",
    storageBucket: "panificadora-pachos-75b2a.firebasestorage.app",
    messagingSenderId: "582397152337",
    appId: "1:582397152337:web:eb3b667328a3f687913c70"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC75jK43Kh4ptC0CHb7Uzfk0wIEvrpz6us",
  authDomain: "panificadora-pachos-75b2a.firebaseapp.com",
  projectId: "panificadora-pachos-75b2a",
  storageBucket: "panificadora-pachos-75b2a.firebasestorage.app",
  messagingSenderId: "582397152337",
  appId: "1:582397152337:web:eb3b667328a3f687913c70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


Puedes realizar la implementación ahora o más adelante. Para hacerlo ahora mismo, abre una ventana de la terminal y, luego, navega al directorio raíz de tu app web o crea uno.

Acceder a Google
firebase login
Inicia el proyecto
Ejecuta el siguiente comando en el directorio raíz de tu app:

firebase init
Cuando tengas todo listo, implementa tu app web
Ubica los archivos estáticos (p. ej., HTML, CSS y JS) en el directorio de implementación de la app (el directorio predeterminado es "public"). Luego, ejecuta este comando desde el directorio raíz de tu app:

firebase deploy
Después de la implementación, consulta tu app en panificadora-pachos-75b2a.web.app

¿Necesitas ayuda? Consulta los documentos de Hosting.
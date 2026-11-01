// lectura.js
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../firebase.js";

export function escucharProductos(alRecibir, alFallar) {
  return onSnapshot(
    collection(db, "productos"),
    (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        ...documento.data(),
        id: documento.id
      }));
      alRecibir(lista);
    },
    alFallar
  );
}

// ─────────────────────────────────────────────
// FORMA 1: Leer TODA una colección (getDocs)
// ─────────────────────────────────────────────
export async function leerTodosLosLibros() {
  const librosRef = collection(db, "libros");
  const snapshot = await getDocs(librosRef);
  
  // snapshot.docs es un array de documentos
  const libros = snapshot.docs.map(doc => ({
    id: doc.id,        // el ID del documento
    ...doc.data()      // los campos (titulo, autor, etc.)
  }));
  
  console.log("📚 Libros encontrados:", libros.length);
  console.table(libros); // console.table lo muestra bonito en la consola
  return libros;
}

// ─────────────────────────────────────────────
// FORMA 2: Leer UN documento por su ID (getDoc)
// ─────────────────────────────────────────────
export async function leerLibroPorId(id) {
  const libroRef = doc(db, "libros", id); // referencia al documento concreto
  const snapshot = await getDoc(libroRef);
  
  if (snapshot.exists()) {
    const libro = { id: snapshot.id, ...snapshot.data() };
    console.log("📖 Libro encontrado:", libro);
    return libro;
  } else {
    console.warn("⚠️ No existe un libro con ID:", id);
    return null;
  }
}

// ─────────────────────────────────────────────
// FORMA 3: Consulta con filtros (query + where)
// ─────────────────────────────────────────────
export async function buscarLibrosPorAutor(autor) {
  const librosRef = collection(db, "libros");
  
  // query: "de la colección libros, donde autor == X, ordenado por título, máximo 10"
  const q = query(
    librosRef,
    where("autor", "==", autor),
    orderBy("titulo", "asc"),
    limit(10)
  );
  
  const snapshot = await getDocs(q);
  const libros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`🔍 Libros de "${autor}":`, libros.length);
  console.table(libros);
  return libros;
}
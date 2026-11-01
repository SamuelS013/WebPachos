// escritura.js
import { collection, doc, getDocs, runTransaction } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../firebase.js";

export async function agregarProductos(lista) {
  if (lista.length > 500) {
    throw new RangeError("Firestore permite como máximo 500 escrituras en un lote.");
  }
  if (lista.some((producto) => !producto.id)) {
    throw new TypeError("Cada producto debe tener un ID para guardarse en Firestore.");
  }

  const coleccionRef = collection(db, "productos");
  const referencias = lista.map((producto) => doc(coleccionRef, producto.id));

  await runTransaction(db, async (transaccion) => {
    const documentos = await Promise.all(
      referencias.map((referencia) => transaccion.get(referencia))
    );

    documentos.forEach((documento, indice) => {
      const producto = lista[indice];
      const datosActualizados = { ...producto };

      if (documento.exists() && Object.hasOwn(documento.data(), "likes")) {
        datosActualizados.likes = documento.data().likes;
      }

      transaccion.set(referencias[indice], datosActualizados);
    });
  });
}

export async function sincronizarProductosIniciales(lista) {
  const coleccionRef = collection(db, "productos");
  const snapshot = await getDocs(coleccionRef);
  const idsExistentes = new Set(snapshot.docs.map((documento) => documento.id));
  const productosFaltantes = lista.filter((producto) => !idsExistentes.has(producto.id));

  if (productosFaltantes.length > 0) {
    await agregarProductos(productosFaltantes);
  }

  return productosFaltantes.length;
}

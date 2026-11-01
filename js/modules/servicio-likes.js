import { doc, runTransaction } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../firebase.js";

export async function actualizarLikesProducto(productoId, incremento) {
    if (!productoId || ![-1, 1].includes(incremento)) {
        throw new TypeError("Se necesita un producto y un incremento de like válido.");
    }

    const referenciaProducto = doc(db, "productos", productoId);

    return runTransaction(db, async (transaccion) => {
        const documento = await transaccion.get(referenciaProducto);
        if (!documento.exists()) {
            throw new Error(`No existe el producto "${productoId}" en Firestore.`);
        }

        const likesActuales = Number(documento.data().likes) || 0;
        const likesActualizados = Math.max(0, likesActuales + incremento);
        transaccion.update(referenciaProducto, { likes: likesActualizados });

        return likesActualizados;
    });
}

import { collection, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../js/firebase.js";

const listaProductos = document.querySelector("#lista-productos");
const estadoPanel = document.querySelector("#estado-panel");

if (!(listaProductos instanceof HTMLElement) || !(estadoPanel instanceof HTMLElement)) {
    throw new Error("No se pudo iniciar el panel de disponibilidad.");
}

const productosPorId = new Map();
const tarjetasPorId = new Map();
const actualizacionesPendientes = new Set();
const coleccionProductos = collection(db, "productos");

function mostrarEstado(mensaje, esError = false) {
    estadoPanel.textContent = mensaje;
    estadoPanel.dataset.error = String(esError);
}

function actualizarTarjeta(producto) {
    const tarjeta = tarjetasPorId.get(producto.id);
    if (!tarjeta) {
        return;
    }

    const boton = tarjeta.querySelector(".availability-button");
    const disponible = producto.disponible;
    const pendiente = actualizacionesPendientes.has(producto.id);

    boton.textContent = pendiente
        ? "Guardando…"
        : disponible
            ? "Disponible"
            : "No disponible";
    boton.dataset.available = String(disponible);
    boton.setAttribute("aria-pressed", String(disponible));
    boton.setAttribute(
        "aria-label",
        `${producto.nombre}: ${disponible ? "disponible" : "no disponible"}. Cambiar disponibilidad`
    );
    boton.disabled = pendiente;
}

function crearTarjeta(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "product-card";

    const info = document.createElement("div");
    info.className = "product-info";

    const nombre = document.createElement("h2");
    nombre.className = "product-name";

    const boton = document.createElement("button");
    boton.className = "availability-button";
    boton.type = "button";
    boton.addEventListener("click", () => cambiarDisponibilidad(producto.id));

    info.append(nombre);
    tarjeta.append(info, boton);
    tarjetasPorId.set(producto.id, tarjeta);
    actualizarContenidoTarjeta(tarjeta, producto);
    actualizarTarjeta(producto);
    return tarjeta;
}

function actualizarContenidoTarjeta(tarjeta, producto) {
    tarjeta.querySelector(".product-name").textContent = producto.nombre;
}

async function cambiarDisponibilidad(productoId) {
    const producto = productosPorId.get(productoId);
    if (!producto || actualizacionesPendientes.has(productoId)) {
        return;
    }

    const disponibleActualizado = !producto.disponible;
    actualizacionesPendientes.add(productoId);
    actualizarTarjeta(producto);
    mostrarEstado(`Guardando disponibilidad de ${producto.nombre}…`);

    try {
        await updateDoc(doc(coleccionProductos, productoId), {
            disponible: disponibleActualizado
        });
        mostrarEstado(`Disponibilidad de ${producto.nombre} actualizada.`);
    } catch (error) {
        console.error(`No se pudo actualizar la disponibilidad de ${producto.nombre}:`, error);
        mostrarEstado(`No se pudo actualizar ${producto.nombre}. Inténtalo de nuevo.`, true);
    } finally {
        actualizacionesPendientes.delete(productoId);
        actualizarTarjeta(productosPorId.get(productoId) ?? producto);
    }
}

function recibirProductos(snapshot) {
    const productosActualizados = new Map();

    snapshot.docs.forEach((documento) => {
        const datos = documento.data();
        productosActualizados.set(documento.id, {
            id: documento.id,
            nombre: typeof datos.nombre === "string" && datos.nombre.trim()
                ? datos.nombre
                : "Producto sin nombre",
            disponible: datos.disponible !== false
        });
    });

    productosPorId.clear();
    productosActualizados.forEach((producto, id) => productosPorId.set(id, producto));

    tarjetasPorId.forEach((tarjeta, id) => {
        if (!productosActualizados.has(id)) {
            tarjeta.remove();
            tarjetasPorId.delete(id);
        }
    });

    const ordenados = [...productosActualizados.values()].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es")
    );
    ordenados.forEach((producto) => {
        let tarjeta = tarjetasPorId.get(producto.id);
        if (!tarjeta) {
            tarjeta = crearTarjeta(producto);
        } else {
            actualizarContenidoTarjeta(tarjeta, producto);
            actualizarTarjeta(producto);
        }
        listaProductos.append(tarjeta);
    });

    mostrarEstado(
        ordenados.length
            ? `${ordenados.length} ${ordenados.length === 1 ? "producto" : "productos"} en el catálogo.`
            : "No hay productos en Firestore."
    );
}

onSnapshot(
    coleccionProductos,
    recibirProductos,
    (error) => {
        console.error("No se pudieron leer los productos de Firestore:", error);
        mostrarEstado("No se pudieron cargar los productos. Revisa la conexión e inténtalo de nuevo.", true);
    }
);
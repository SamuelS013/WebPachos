import { productos } from "./modules/productos.js";
import { escucharProductos } from "./modules/servicio-lectura.js";
import { agregarProductos } from "./modules/servicio-escritura.js";
import { sincronizarProductosIniciales } from "./modules/servicio-escritura.js";
import { actualizarLikesProducto } from "./modules/servicio-likes.js";
import { obtenerDolarBCV } from "./modules/dolarService.js";
import { burst } from 'https://esm.sh/burst-particles';

// Navegación móvil compartida: activa la barra lateral definida en style.css.
const botonMenu = document.querySelector(".boton-menu");
const menuPrincipal = document.querySelector("#menu-principal");

if (botonMenu instanceof HTMLButtonElement && menuPrincipal instanceof HTMLElement) {
    const encabezado = document.querySelector(".main-header");
    const piePagina = document.querySelector(".main-footer");
    const actualizarAlturaMenu = () => {
        if (!(encabezado instanceof HTMLElement) || !(piePagina instanceof HTMLElement)) {
            return;
        }

        const top = encabezado.getBoundingClientRect().bottom;
        const altura = piePagina.getBoundingClientRect().top - top;
        menuPrincipal.style.setProperty("--menu-top", `${top}px`);
        menuPrincipal.style.setProperty("--altura-main", `${Math.max(0, altura)}px`);
    };
    const cerrarMenu = () => {
        menuPrincipal.classList.remove("menu-abierto");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.setAttribute("aria-label", "Abrir menú");
    };

    actualizarAlturaMenu();
    window.addEventListener("resize", actualizarAlturaMenu);
    window.addEventListener("scroll", actualizarAlturaMenu, { passive: true });

    if (encabezado instanceof HTMLElement && piePagina instanceof HTMLElement && "ResizeObserver" in window) {
        const observadorAlturaMenu = new ResizeObserver(actualizarAlturaMenu);
        observadorAlturaMenu.observe(document.body);
        observadorAlturaMenu.observe(encabezado);
        observadorAlturaMenu.observe(piePagina);
    }

    botonMenu.addEventListener("click", () => {
        const abierto = botonMenu.getAttribute("aria-expanded") !== "true";
        menuPrincipal.classList.toggle("menu-abierto", abierto);
        botonMenu.setAttribute("aria-expanded", String(abierto));
        botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    menuPrincipal.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("click", (evento) => {
        if (
            evento.target instanceof Node &&
            !menuPrincipal.contains(evento.target) &&
            !botonMenu.contains(evento.target)
        ) {
            cerrarMenu();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") {
            cerrarMenu();
            botonMenu.focus();
        }
    });
}

// Modal compartido de contacto: los enlaces del nav lo abren en todas las páginas.
const dialogoContactos = document.querySelector("#dialogo-contactos");

if (dialogoContactos instanceof HTMLDialogElement) {
    document.querySelectorAll("[data-abrir-contactos]").forEach((enlace) => {
        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();
            if (!dialogoContactos.open) {
                dialogoContactos.showModal();
            }
        });
    });

    dialogoContactos.querySelectorAll("[data-cerrar-contactos]").forEach((boton) => {
        boton.addEventListener("click", () => dialogoContactos.close());
    });

    dialogoContactos.addEventListener("click", (evento) => {
        if (evento.target === dialogoContactos) {
            dialogoContactos.close();
        }
    });
}

const gridProductos = document.querySelector("#productos-grid");
const plantillaProducto = document.querySelector("#plantilla-producto");
const filtrosCategoria = document.querySelectorAll("[data-category]");
const estadoProductos = document.querySelector("#estado-productos");
const estadoTasa = document.querySelector("#estado-tasa");

if (
    !(gridProductos instanceof HTMLElement) ||
    !(plantillaProducto instanceof HTMLTemplateElement) ||
    !(estadoProductos instanceof HTMLElement) ||
    !(estadoTasa instanceof HTMLElement)
) {
    throw new Error("No se pudo iniciar el catálogo. Revisa tu conexión e intenta de nuevo");
}

const formatoPrecio = new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const formatoPrecioBolivares = new Intl.NumberFormat("es-VE", {
    maximumFractionDigits: 0
});
const productosLocalesPorId = new Map(productos.map((producto) => [producto.id, producto]));
const FAVORITOS_STORAGE_KEY = "panificadora-pachos:productos-favoritos";
const favoritosLocales = cargarFavoritosLocales();
let productosCatalogo = productos;
let categoriaActiva = "todos";
let tasaDolar = null;

function cargarFavoritosLocales() {
    try {
        const favoritosGuardados = JSON.parse(localStorage.getItem(FAVORITOS_STORAGE_KEY) || "[]");
        return new Set(Array.isArray(favoritosGuardados) ? favoritosGuardados : []);
    } catch (error) {
        console.error("No se pudieron leer los favoritos guardados en este navegador:", error);
        return new Set();
    }
}

function guardarFavoritosLocales() {
    try {
        localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify([...favoritosLocales]));
    } catch (error) {
        console.error("No se pudieron guardar los favoritos en este navegador:", error);
        estadoProductos.textContent = "Like guardado en Firebase; no se pudo recordar tu selección en este navegador.";
    }
}

function redondearBolivaresADecenaSuperior(monto) {
    return Math.ceil(monto / 10) * 10;
}

function crearTarjeta(producto) {
    const tarjeta = plantillaProducto.content.firstElementChild.cloneNode(true);
    const imagen = tarjeta.querySelector(".producto-imagen");
    const marcadorImagen = tarjeta.querySelector(".producto-imagen-placeholder");
    const botonLike = tarjeta.querySelector(".boton-like");
    const iconoLike = botonLike.querySelector("i");
    const contadorLikes = tarjeta.querySelector(".contador-likes");
    const precioBs = tarjeta.querySelector(".producto-precio-bs");
    const precioReferencia = tarjeta.querySelector(".producto-precio span");
    const favorito = favoritosLocales.has(producto.id);

    tarjeta.dataset.id = producto.id;
    tarjeta.dataset.category = producto.categoria;
    tarjeta.querySelector(".producto-titulo").textContent = producto.nombre;
    tarjeta.querySelector(".producto-descripcion").textContent = producto.descripcion;
    tarjeta.querySelector(".producto-precio").firstChild.textContent = "Ref: ";
    precioReferencia.textContent = `~$${formatoPrecio.format(producto.precio)}`;
    precioBs.textContent = tasaDolar
        ? `${formatoPrecioBolivares.format(redondearBolivaresADecenaSuperior(producto.precio * tasaDolar))}`
        : "Consultando tasa...";
    contadorLikes.textContent = String(producto.likes);
    botonLike.setAttribute("aria-pressed", String(favorito));
    botonLike.setAttribute("aria-label", favorito
        ? `Quitar ${producto.nombre} de favoritos`
        : `Agregar ${producto.nombre} a favoritos`);
    iconoLike.classList.toggle("fa-solid", favorito);
    iconoLike.classList.toggle("fa-regular", !favorito);

    if (producto.imagen) {
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.addEventListener("error", () => {
            imagen.hidden = true;
            marcadorImagen.hidden = false;
        }, { once: true });
        marcadorImagen.hidden = true;
    } else {
        imagen.hidden = true;
        marcadorImagen.hidden = false;
    }

    botonLike.addEventListener("click", async (event) => {
        const marcado = !favoritosLocales.has(producto.id);
        
        if (marcado){
            burst(event, {
                "count": 50,
                "speedMin": 4.8,
                "speedMax": 10,
                "gravity": 0.18,
                "shapes": [],
                "colors": ["#fbbf24"],
                "chars": ["🥐", "🥨", "🍩", "🍪", "🍞", "⭐", "🧡"],
                "spread": 5,
                "drag": 0.98,
                "sizeMin": 10,
                "sizeMax": 18,
                "lifeMin": 100,
                "lifeMax": 200,
                "rotates": true,
                "fadeOut": true,
                "drift": 0,
                "riseInit": 0
            });
        };
        
        botonLike.disabled = true;
        
        try {
            const likesActualizados = await actualizarLikesProducto(producto.id, marcado ? 1 : -1);
            if (marcado) {
                favoritosLocales.add(producto.id);
            } else {
                favoritosLocales.delete(producto.id);
            }
            guardarFavoritosLocales();


            productosCatalogo = productosCatalogo.map((item) =>
                item.id === producto.id ? { ...item, likes: likesActualizados } : item
            );
            mostrarProductos();
        } catch (error) {
            console.error(`No se pudo actualizar el like de "${producto.nombre}" en Firestore:`, error);
            estadoProductos.textContent = `No se pudo guardar el like de ${producto.nombre}. Inténtalo de nuevo.`;
            botonLike.disabled = false;
        }
    });

    return tarjeta;
}

function mostrarProductos() {
    const fragmento = document.createDocumentFragment();
    const productosVisibles = productosCatalogo.filter((producto) =>
        producto.disponible && (categoriaActiva === "todos" || producto.categoria === categoriaActiva)
    );

    productosVisibles.forEach((producto) => fragmento.append(crearTarjeta(producto)));
    gridProductos.replaceChildren(fragmento);
}

function normalizarProducto(producto) {
    const base = productosLocalesPorId.get(producto.id);
    const precio = Number(producto.precio ?? base?.precio ?? 0);
    const precioBs = Number(producto.precioBs ?? base?.precioBs ?? 0);
    const imagenRemota = String(producto.imagen ?? "").trim();

    return {
        id: producto.id,
        nombre: String(producto.nombre ?? base?.nombre ?? "Producto"),
        descripcion: String(producto.descripcion ?? base?.descripcion ?? ""),
        categoria: producto.categoria === "panes" || producto.categoria === "reposteria"
            ? producto.categoria
            : base?.categoria ?? "reposteria",
        precio: Number.isFinite(precio) && precio >= 0 ? precio : 0,
        precioBs: Number.isFinite(precioBs) && precioBs >= 0 ? precioBs : 0,
        imagen: imagenRemota && !imagenRemota.startsWith("ruta-a/")
            ? imagenRemota
            : base?.imagen ?? "",
        likes: Math.max(0, Number(producto.likes ?? base?.likes ?? 0) || 0),
        disponible: producto.disponible ?? base?.disponible ?? true
    };
}

function mostrarErrorFirebase(error) {
    console.error("No se pudo sincronizar el catálogo. Revisa tu conexión e intenta de nuevo", error);
    estadoProductos.textContent = "No se pudo conectar con Firebase. Se muestra el catálogo local.";
}

function iniciarEscuchaProductos() {
    try {
        escucharProductos((productosRemotos) => {
            if (productosRemotos.length === 0) {
                productosCatalogo = productos;
                mostrarProductos();
                return;
            }

            productosCatalogo = productosRemotos.map(normalizarProducto);
            mostrarProductos();
        }, mostrarErrorFirebase);
    } catch (error) {
        mostrarErrorFirebase(error);
    }

    sincronizarProductosIniciales(productos).catch((error) => {
        console.error("No se pudieron guardar los productos locales faltantes en Firebase:", error);
        estadoProductos.textContent = "Catálogo cargado; no se pudieron sincronizar algunos productos locales con Firebase.";
    });
}

async function actualizarTasaDolar() {
    try {
        tasaDolar = await obtenerDolarBCV();
        mostrarProductos();
    } catch (error) {
        console.error("No se pudo actualizar la tasa del dólar:", error);
        estadoTasa.textContent = tasaDolar
            ? `No se pudo actualizar la tasa; se conserva el último valor: Bs. ${formatoPrecio.format(tasaDolar)} por dólar.`
            : "No se pudo obtener la tasa del dólar; precios en bolívares no disponibles.";
    }
}

filtrosCategoria.forEach((filtro) => {
    filtro.addEventListener("click", () => {
        categoriaActiva = filtro.dataset.category;
        filtrosCategoria.forEach((item) => {
            const activo = item === filtro;
            item.classList.toggle("activo", activo);
            item.setAttribute("aria-pressed", String(activo));
        });
        mostrarProductos();
    });
});

mostrarProductos();
iniciarEscuchaProductos();
actualizarTasaDolar();
window.setInterval(actualizarTasaDolar, 15 * 60 * 1000);

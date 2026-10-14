import { inicializarProductos } from "./productos.js";

const rutas = {
    inicio: null,
    ubicacion: { archivo: "ubicacion.html", estilos: "css/ubicacion.css" },
    emprende: { archivo: "emprende.html", estilos: "css/emprende.css" },
    "sobre-nosotros": { archivo: "sobre-nosotros.html", estilos: "css/sobre-nosotros.css" }
};

function configurarContactos() {
    const dialogo = document.querySelector("#dialogo-contactos");
    if (!(dialogo instanceof HTMLDialogElement)) {
        throw new Error("La página debe incluir el diálogo de contactos.");
    }

    document.addEventListener("click", (evento) => {
        const elemento = evento.target;
        if (!(elemento instanceof Element)) return;

        if (elemento.closest("[data-abrir-contactos]")) {
            evento.preventDefault();
            if (!dialogo.open) dialogo.showModal();
        } else if (elemento.closest("[data-cerrar-contactos]")) {
            dialogo.close();
        } else if (elemento === dialogo) {
            dialogo.close();
        }
    });
}

function configurarMenu() {
    const boton = document.querySelector(".boton-menu");
    const menu = document.querySelector("#menu-principal");
    const main = document.querySelector("main");
    if (!boton || !menu || !main) return () => {};

    const actualizarAltura = () => {
        menu.style.setProperty("--altura-main", `${main.getBoundingClientRect().height}px`);
    };
    const actualizarAccesibilidad = () => {
        const abierto = boton.getAttribute("aria-expanded") === "true";
        const oculto = window.matchMedia("(max-width: 700px)").matches && !abierto;
        menu.setAttribute("aria-hidden", String(oculto));
        menu.inert = oculto;
    };
    const cerrarMenu = () => {
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Abrir menú");
        menu.classList.remove("menu-abierto");
        actualizarAccesibilidad();
    };

    boton.addEventListener("click", () => {
        const abierto = boton.getAttribute("aria-expanded") !== "true";
        boton.setAttribute("aria-expanded", String(abierto));
        boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        menu.classList.toggle("menu-abierto", abierto);
        actualizarAccesibilidad();
    });

    menu.addEventListener("click", (evento) => {
        if (evento.target.closest("a")) cerrarMenu();
    });

    document.addEventListener("click", (evento) => {
        if (!menu.contains(evento.target) && !boton.contains(evento.target)) cerrarMenu();
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") cerrarMenu();
    });

    window.addEventListener("resize", () => {
        actualizarAltura();
        actualizarAccesibilidad();
    });
    new ResizeObserver(actualizarAltura).observe(main);
    actualizarAltura();
    actualizarAccesibilidad();

    return cerrarMenu;
}

function configurarVistas(cerrarMenu) {
    const contenedor = document.querySelector("#contenido-vista");
    const enlacesVista = document.querySelectorAll("[data-vista]");
    if (!contenedor) {
        inicializarProductos();
        return;
    }

    const pieInicio = document.querySelector("footer");
    if (!pieInicio) {
        throw new Error("La página de inicio debe incluir un elemento footer.");
    }

    const pieInicioOriginal = pieInicio.cloneNode(true);
    let pieActual = pieInicio;
    const contenidoInicio = contenedor.innerHTML;
    let vistaActual = "inicio";
    let hojaDeEstilos = null;
    const tituloInicio = document.title;
    let solicitudActual = 0;

    const marcarVistaActiva = (vista) => {
        enlacesVista.forEach((enlace) => {
            if (enlace.dataset.vista === vista) {
                enlace.setAttribute("aria-current", "page");
            } else {
                enlace.removeAttribute("aria-current");
            }
        });
    };

    const cargarEstilos = (ruta) => new Promise((resolve, reject) => {
        if (hojaDeEstilos?.getAttribute("href") === ruta.estilos) {
            resolve(hojaDeEstilos);
            return;
        }

        const nuevaHoja = document.createElement("link");
        nuevaHoja.rel = "stylesheet";
        nuevaHoja.href = ruta.estilos;
        nuevaHoja.dataset.vistaEstilos = "";
        nuevaHoja.onload = () => resolve(nuevaHoja);
        nuevaHoja.onerror = () => {
            nuevaHoja.remove();
            reject(new Error(`No se pudieron cargar los estilos de la vista ${ruta.estilos}.`));
        };
        document.head.append(nuevaHoja);
    });

    const mostrarError = (error) => {
        contenedor.querySelector(".error-vista")?.remove();
        const aviso = document.createElement("p");
        aviso.className = "error-vista";
        aviso.setAttribute("role", "alert");
        aviso.textContent = `No se pudo abrir esta sección. ${error.message}`;
        contenedor.prepend(aviso);
    };

    const irA = async (vista, { actualizarHistorial = true, desplazarse = true } = {}) => {
        if (!Object.hasOwn(rutas, vista)) return;

        const solicitud = ++solicitudActual;
        cerrarMenu();
        contenedor.querySelector(".error-vista")?.remove();

        try {
            let nuevoContenido = contenidoInicio;
            let nuevoTitulo = tituloInicio;
            let nuevaHoja = null;
            let nuevoPie = pieInicioOriginal.cloneNode(true);

            if (rutas[vista]) {
                const respuesta = await fetch(rutas[vista].archivo);
                if (!respuesta.ok) {
                    throw new Error(`El servidor respondió con el estado ${respuesta.status}.`);
                }

                const documento = new DOMParser().parseFromString(await respuesta.text(), "text/html");
                if (solicitud !== solicitudActual) return;
                const mainFuente = documento.querySelector("main");
                if (!mainFuente) {
                    throw new Error(`El archivo ${rutas[vista].archivo} no contiene un elemento main.`);
                }
                const pieFuente = documento.querySelector("footer");
                if (!pieFuente) {
                    throw new Error(`El archivo ${rutas[vista].archivo} no contiene un elemento footer.`);
                }

                nuevaHoja = await cargarEstilos(rutas[vista]);
                if (solicitud !== solicitudActual) {
                    if (nuevaHoja !== hojaDeEstilos) nuevaHoja.remove();
                    return;
                }
                nuevoContenido = mainFuente.innerHTML;
                nuevoTitulo = documento.title || tituloInicio;
                nuevoPie = pieFuente.cloneNode(true);
            }

            contenedor.innerHTML = nuevoContenido;
            pieActual.replaceWith(nuevoPie);
            pieActual = nuevoPie;
            contenedor.dataset.vistaActual = vista;
            if (hojaDeEstilos && hojaDeEstilos !== nuevaHoja) hojaDeEstilos.remove();
            hojaDeEstilos = nuevaHoja;
            vistaActual = vista;
            document.title = nuevoTitulo;
            marcarVistaActiva(vista);

            if (vista === "inicio" || vista === "catalogo") inicializarProductos();
            if (actualizarHistorial) {
                history.pushState({ vista }, "", `#vista-${vista}`);
            }
            if (desplazarse) window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            if (solicitud !== solicitudActual) return;
            mostrarError(error);
            const hashAnterior = vistaActual === "inicio" ? "" : `#vista-${vistaActual}`;
            history.replaceState({ vista: vistaActual }, "", hashAnterior);
        }
    };

    document.addEventListener("click", (evento) => {
        const enlace = evento.target.closest("a[data-vista]");
        if (!enlace || !Object.hasOwn(rutas, enlace.dataset.vista)) return;

        evento.preventDefault();
        void irA(enlace.dataset.vista);
    });

    window.addEventListener("popstate", () => {
        const vista = window.location.hash.replace("#vista-", "");
        if (Object.hasOwn(rutas, vista)) {
            void irA(vista, { actualizarHistorial: false, desplazarse: false });
        } else {
            void irA("inicio", { actualizarHistorial: false, desplazarse: false });
        }
    });

    const vistaInicial = window.location.hash.replace("#vista-", "");
    if (Object.hasOwn(rutas, vistaInicial) && vistaInicial !== "inicio") {
        void irA(vistaInicial, { actualizarHistorial: false, desplazarse: false });
    } else {
        marcarVistaActiva("inicio");
        inicializarProductos();
    }
}

configurarContactos();
configurarVistas(configurarMenu());

import { obtenerDolarBCV } from "./modules/dolarService.js";

let valorDolar = 0;

async function obtenerDolar() {
  try {
    valorDolar = await obtenerDolarBCV();
    console.log("Dólar BCV:", valorDolar);
  } catch (error) {
    console.error("No se pudo cargar el valor del dólar.", error);
  }
  return valorDolar;
}

const productos = [
     {
        nombre: "Palmeritas",
        descripcion: "Hojaldre crujiente con azúcar, horneado cada día.",
        precio: "$0.90",
        precioBs: "0",
        imagen: "css/img/palmeritas2.jpeg",
        categoria: "reposteria",
        likes: 0 },
    { 
        nombre: "Pan salado", 
        descripcion: "Pan suave y dorado, perfecto para cualquier momento.",
        precio: "$1.50",
        precioBs: "0",
        imagen: "css/img/pan-salado.jpeg",
        categoria: "panes",
        likes: 0 },
    {
        nombre: "Pan dulce",
        descripcion: "Pan esponjoso con un delicado toque de azúcar.",
        precio: "$1.50",
        precioBs: "0",
        imagen: "css/img/pan-dulce.jpeg",
        categoria: "panes",
        likes: 0 },
    {
        nombre: "Acema dulce",
        descripcion: "Acema artesanal con glaseado de azúcar.",
        precio: "$0.60",
        precioBs: "0",
        imagen: "css/img/pan-dulce.jpeg",
        categoria: "panes",
        likes: 0 },
    {
        nombre: "Paledonia",
        descripcion: "Paledonia suave tradicional, ideal para acompañar el café.",
        precio: "$0.90",
        precioBs: "0",
        imagen: "css/img/paledonias.jpeg",
        categoria: "reposteria",
        likes: 0 },
    {
        nombre: "Torta marmoleada",
        descripcion: "Torta marmoleada con suave combinación de vainilla y chocolate, recubierta de arequipe y lluvia de chocolate.",
        precio: "$0.90",
        precioBs: "0",
        imagen: "css/img/torta-marmoleada.png",
        categoria: "reposteria",
        likes: 0 },
    {
        nombre: "Palitos de hojaldre",
        descripcion: "Trocitos de hojaldre crujiente en forma de palitos. Ideal para compartir en familia.",
        precio: "$0.90",
        precioBs: "0",
        imagen: "css/img/palitos-palmeritas.jpg",
        categoria: "reposteria", 
        likes: 0 },
    {
        nombre: "Cannolos de arequipe",
        descripcion: "Cannolo clásico de hojaldre relleno de arequipe, con una cobertura de arequipe y lluvia de chocolate.",
        precio: "$0.90",
        precioBs: "0",
        imagen: "css/img/cannolos.jpg",
        categoria: "reposteria",
        likes: 0
    }
];

const numeroWhatsApp = "584140770512";
const numeroWhatsAppSamuel = "584261351097";

function crearTarjeta(producto, plantilla) {
  const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
  const imagen = tarjeta.querySelector(".producto-imagen, .product-image");
  const titulo = tarjeta.querySelector(".producto-titulo, .product-name");
  const descripcion = tarjeta.querySelector(".producto-descripcion, .product-description");
  const precio = tarjeta.querySelector(".producto-precio span") || tarjeta.querySelector(".product-price");
  const precioBs = tarjeta.querySelector(".producto-precio-bs") || tarjeta.querySelector(".product-price-bs");

  tarjeta.dataset.category = producto.categoria;
  tarjeta.dataset.nombre = producto.nombre;



  tarjeta.dataset.category = producto.categoria;
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  titulo.textContent = producto.nombre;
  descripcion.textContent = producto.descripcion;
  precio.textContent = producto.precio;

  const contador = tarjeta.querySelector(".contador-likes");
  if (contador) contador.textContent = producto.likes ?? 0;


  const precioLimpioUsd = parseFloat(producto.precio.replace("$", "")) || 0;
  const precioLimpioBs = precioLimpioUsd * valorDolar;

  if (precioBs) {
    precioBs.textContent = `${precioLimpioBs.toFixed(2)} Bs`;
  }

  return tarjeta;
}

function prepararFavoritos(contenedor) {
  contenedor.addEventListener("click", (evento) => {
    const botonLike = evento.target.closest(".boton-like");
    if (!botonLike || !contenedor.contains(botonLike)) return;

    const tarjeta = botonLike.closest("[data-nombre]");
    if (!tarjeta) return;

    const contador = tarjeta.querySelector(".contador-likes");
    if (!contador) return;

    // Buscar el producto original en el array
    const producto = productos.find(p => p.nombre === tarjeta.dataset.nombre);
    if (!producto) return;

    // Toggle
    const activo = botonLike.getAttribute("aria-pressed") !== "true";
    botonLike.setAttribute("aria-pressed", String(activo));

    const delta = activo ? 1 : -1;
    producto.likes = Math.max(0, (producto.likes ?? 0) + delta);

    contador.textContent = producto.likes;

    localStorage.setItem("likes", JSON.stringify(productos.map(p => p.likes ?? 0)));
  });
}

export async function inicializarProductos() {
    try {
  const guardados = JSON.parse(localStorage.getItem("likes") || "[]");
  productos.forEach((p, i) => { p.likes = guardados[i] ?? 0; });
} catch { /* silencio */ }

  await obtenerDolar(); // ⬅️ Espera el valor antes de renderizar

  const contenedor = document.querySelector("#productos-grid, #product-container");
  const plantilla = document.querySelector("#plantilla-producto");
  if (!contenedor || !plantilla) return;

  const filtros = document.querySelectorAll("[data-category]");
    const filtrarPor = (categoria) => {
        const esTodos = categoria === "todos" || categoria === "all";

        let lista = esTodos
            ? productos
            : productos.filter((p) => p.categoria === categoria);

        if (esTodos) {
            lista = [...lista].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        }

        const tarjetas = lista.map((p) => crearTarjeta(p, plantilla));
        contenedor.replaceChildren(...tarjetas);
  };

  filtros.forEach((filtro) => {
    filtro.addEventListener("click", () => {
      const categoria = filtro.dataset.category;
      filtros.forEach((el) => {
        const activo = el === filtro;
        el.classList.toggle("activo", activo);
        el.classList.toggle("active", activo);
        el.setAttribute("aria-pressed", String(activo));
      });
      filtrarPor(categoria);
    });
  });

  prepararFavoritos(contenedor);
  filtrarPor("todos");
}
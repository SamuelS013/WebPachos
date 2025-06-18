/**
 * PANADERÍA PACHO'S - SCRIPT COMPLETO
 * Funcionalidades:
 * 1. Menú hamburguesa móvil
 * 2. Secciones desplegables
 * 3. Filtrado de categorías de productos
 * 4. Control de interacciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // 1. ELEMENTOS DEL DOM
    // ======================
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.getElementById('menu');
    const botonesSeccion = document.querySelectorAll('.boton-seccion');
    const botonesCategoria = document.querySelectorAll('.boton-categoria');
    const secciones = document.querySelectorAll('.contenido-seccion');
    const categoriasProductos = document.querySelectorAll('.productos-categoria');

    // ======================
    // 2. MENÚ HAMBURGUESA
    // ======================
    function toggleMenu() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });

    // ======================
    // 3. SECCIONES DESPLEGABLES
    // ======================
    function manejarSecciones(targetId) {
        // Cerrar todas las secciones
        secciones.forEach(seccion => {
            seccion.classList.remove('activo');
        });

        // Abrir sección seleccionada
        const seccionActiva = document.getElementById(targetId);
        if (seccionActiva) {
            seccionActiva.classList.add('activo');
            
            // Scroll suave
            setTimeout(() => {
                seccionActiva.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Eventos para botones de sección
    botonesSeccion.forEach(boton => {
        boton.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            manejarSecciones(targetId);
        });
    });

    // ======================
    // 4. FILTRADO DE CATEGORÍAS
    // ======================
    function filtrarProductos(categoria) {
        // Actualizar botones activos
        botonesCategoria.forEach(boton => {
            boton.classList.remove('activo');
            if (boton.getAttribute('data-categoria') === categoria) {
                boton.classList.add('activo');
            }
        });

        // Mostrar/ocultar productos
        categoriasProductos.forEach(contenedor => {
            contenedor.style.display = 'none';
            if (contenedor.id === categoria) {
                contenedor.style.display = 'grid';
            }
        });
    }

    // Eventos para botones de categoría
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', function() {
            filtrarProductos(this.getAttribute('data-categoria'));
        });
    });

    // ======================
		// 5. INICIALIZACIÓN
		// ======================
		function init() {
			// Configuración inicial
			dropdownMenu.style.display = 'none';
			
			// REMOVIMOS ESTA LÍNEA para que no muestre nada por defecto
			// filtrarProductos('panes');
			
			// Cerrar todas las secciones al cargar
			secciones.forEach(seccion => {
				seccion.classList.remove('activo');
			});
		}

    init();
});

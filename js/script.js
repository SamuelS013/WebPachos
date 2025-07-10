document.addEventListener('DOMContentLoaded', () => {
    // --- Galería de Productos ---
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price'); // Elemento para el precio
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const navigationDotsContainer = document.querySelector('.navigation-dots');

    // Array de productos con sus nombres, imágenes y precios
    const products = [
        { name: 'Palmeritas', image: 'img/palmeritas.jpeg', price: '$1.50' },
        { name: 'Pan Salado', image: 'img/pan-salado.jpeg', price: '$0.75' },
        { name: 'Pan Dulce', image: 'img/pan-dulce.jpeg', price: '$1.00' },
        { name: 'Paledonia (Trozo)', image: 'https://via.placeholder.com/400x400?text=Paledonia', price: '$2.25' },
        { name: 'Torta Marmoleada (Trozo)', image: 'https://via.placeholder.com/400x400?text=Torta+Marmoleada', price: '$3.50' },
        { name: 'Acema Dulce', image: 'https://via.placeholder.com/400x400?text=Acema+Dulce', price: '$1.20' }
    ];

    let currentProductIndex = 0; // Índice del producto actual en la galería

    // Función para actualizar la imagen, el nombre y el precio del producto mostrado, con animación de fade
    function updateProductDisplay() {
        // Inicia la animación de fade out (ocultando la imagen, el texto y el precio)
        productImage.style.opacity = 0;
        productName.style.opacity = 0;
        productPrice.style.opacity = 0; // Oculta el precio también

        // Espera un breve momento (300ms) antes de cambiar el contenido
        setTimeout(() => {
            // Obtiene el producto actual
            const currentProduct = products[(currentProductIndex + products.length) % products.length];

            // Actualiza la fuente de la imagen, el texto del nombre y el precio del producto
            productImage.src = currentProduct.image;
            productName.textContent = currentProduct.name;
            productPrice.textContent = currentProduct.price; // Actualiza el precio

            // Actualiza el estado de los puntos de navegación (dot indicators)
            updateActiveDot();

            // Inicia la animación de fade in (mostrando la nueva imagen, texto y precio)
            productImage.style.opacity = 1;
            productName.style.opacity = 1;
            productPrice.style.opacity = 1; // Muestra el precio
        }, 300); // La duración debe ser menor o igual a la transición CSS para un efecto suave
    }

    // Función para crear dinámicamente los puntos de navegación (dots)
    function createNavigationDots() {
        // Limpia cualquier dot existente antes de crearlos de nuevo
        navigationDotsContainer.innerHTML = ''; 
        products.forEach((_, index) => {
            const dot = document.createElement('div'); // Crea un nuevo div para cada dot
            dot.classList.add('dot'); // Añade la clase 'dot' para estilizarlo
            dot.dataset.index = index; // Almacena el índice del producto asociado en un atributo de datos

            // Añade un event listener para cambiar al producto correspondiente al hacer clic en el dot
            dot.addEventListener('click', (event) => {
                currentProductIndex = parseInt(event.target.dataset.index); // Obtiene el índice del dot clickeado
                updateProductDisplay(); // Actualiza la galería
            });
            navigationDotsContainer.appendChild(dot); // Añade el dot al contenedor de dots
        });
        updateActiveDot(); // Asegura que el dot inicial esté activo
    }

    // Función para actualizar la clase 'active' en el dot correspondiente al producto actual
    function updateActiveDot() {
        const dots = document.querySelectorAll('.navigation-dots .dot'); // Selecciona todos los dots
        dots.forEach((dot, index) => {
            if (index === currentProductIndex) {
                dot.classList.add('active'); // Añade la clase 'active' si es el dot del producto actual
            } else {
                dot.classList.remove('active'); // Remueve la clase 'active' de los demás dots
            }
        });
    }

    // Event listener para la flecha izquierda (anterior producto)
    leftArrow.addEventListener('click', () => {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
        updateProductDisplay();
    });

    // Event listener para la flecha derecha (siguiente producto)
    rightArrow.addEventListener('click', () => {
        currentProductIndex = (currentProductIndex + 1) % products.length;
        updateProductDisplay();
    });

    createNavigationDots(); // Llama a la función para crear los dots al cargar la página
    updateProductDisplay(); // Muestra el primer producto y activa su dot al cargar la página

    // --- Menú Hamburguesa ---
    const hamburgerIcon = document.querySelector('.hamburger-menu .fa-bars');
    const navLinks = document.querySelector('.nav-links');

    // Alterna la clase 'active' en los enlaces de navegación al hacer clic en el icono de hamburguesa
    hamburgerIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cierra el menú de hamburguesa si se hace clic fuera de él o de su icono
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburgerIcon.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // Cierra el menú de hamburguesa al hacer clic en cualquiera de sus enlaces
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Bloques de Información Clickeables ---
    const infoBlocks = document.querySelectorAll('.info-block.clickable');

    // Añade un event listener a cada bloque de información clickeable
    infoBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const blockId = block.id; // Obtiene el ID del bloque clickeado
            switch (blockId) {
                case 'catalogo-completo-section':
                    alert('Navegando a la sección: Catálogo completo de productos');
                    break;
                case 'puntos-venta-section':
                    alert('Navegando a la sección: Puntos de venta');
                    break;
                case 'emprende-section':
                    alert('Navegando a la sección: Emprende con nosotros');
                    break;
                default:
                    console.log('Bloque clickeado sin acción definida:', blockId);
            }
        });
    });
});

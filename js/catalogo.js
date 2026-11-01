document.addEventListener('DOMContentLoaded', () => {

    // --- Base de datos simple de productos ---
    const products = [
        // Panes
        { name: 'Pan Salado', description: 'Pan de masa madre, suave y delicioso.', price: '$1.20', image: 'img/pan-salado.jpeg', category: 'panes' },
        { name: 'Palmeritas', description: 'Delicadas palmeritas de hojaldre con azúcar.', price: '$1.20', image: 'img/palmeritas.jpeg', category: 'panes' },
        { name: 'Pan Dulce', description: 'Pan esponjoso con un toque de azúcar.', price: '$1.20', image: 'img/pan-dulce.jpeg', category: 'panes' },
        { name: 'Acema Dulce', description: 'Acema artesanal con glaseado de azúcar.', price: '$0.60', image: 'https://placehold.co/400x400/fff9ec/301711?text=Acema', category: 'panes' },

        // Repostería
        { name: 'Paledonia', description: 'Paledonia casera, ideal para el café.', price: '$0.90', image: 'https://placehold.co/400x400/fff9ec/301711?text=Paledonia', category: 'reposteria' },
        { name: 'Torta Marmoleada', description: 'Torta de vainilla y chocolate, por porción.', price: '$1.00', image: 'https://placehold.co/400x400/fff9ec/301711?text=Torta+Marmoleada', category: 'reposteria' },
    ];

    const productContainer = document.getElementById('product-container');
    const categoryIcons = document.querySelectorAll('.category-icon');

    // Función para crear la tarjeta de un producto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.setAttribute('data-category', product.category);
        
        const content = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price}</p>
        `;
        
        card.innerHTML = content;
        return card;
    }

    // Función para renderizar los productos en la página
    function renderProducts(filteredProducts) {
        productContainer.innerHTML = ''; // Limpia el contenedor
        filteredProducts.forEach(product => {
            const card = createProductCard(product);
            productContainer.appendChild(card);
        });
    }

    // Función para manejar el clic en los iconos de categoría
    function handleCategoryClick(event) {
        // Remueve la clase 'active' de todos los íconos y la agrega al clickeado
        categoryIcons.forEach(icon => icon.classList.remove('active'));
        const clickedIcon = event.currentTarget;
        clickedIcon.classList.add('active');

        // Obtiene la categoría del ícono clickeado
        const category = clickedIcon.getAttribute('data-category');

        // Filtra los productos
        const filteredProducts = category === 'all'
            ? products
            : products.filter(product => product.category === category);
        
        // Renderiza los productos filtrados
        renderProducts(filteredProducts);
    }

    // Agrega los event listeners a cada ícono de categoría
    categoryIcons.forEach(icon => {
        icon.addEventListener('click', handleCategoryClick);
    });

    // Renderiza todos los productos al cargar la página por primera vez
    renderProducts(products);
});

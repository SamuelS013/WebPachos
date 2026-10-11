document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Menú Hamburguesa (Común para ambas páginas) ---
    const hamburgerIcon = document.querySelector('.hamburger-menu .fa-bars');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerIcon && navLinks) {
        hamburgerIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el evento se propague al documento
            navLinks.classList.toggle('active');
        });

        // Cierra el menú de hamburguesa si se hace clic fuera de él
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerIcon.contains(event.target)) {
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
    }

    // --- Lógica de la Galería de Productos (SOLO en index.html) ---
    // Esta sección solo se ejecuta si el elemento de la galería existe en la página
    if (document.getElementById('product-image')) {
        const productImage = document.getElementById('product-image');
        const productName = document.getElementById('product-name');
        const productPrice = document.getElementById('product-price');
        const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
        
        const leftArrowDesktop = document.querySelector('.left-arrow.desktop-arrow');
        const rightArrowDesktop = document.querySelector('.right-arrow.desktop-arrow');
        const leftArrowMobile = document.querySelector('.left-arrow.mobile-arrow');
        const rightArrowMobile = document.querySelector('.right-arrow.mobile-arrow');
        const navigationDotsContainer = document.querySelector('.navigation-dots');

        const products = [
            { name: 'Palmeritas', image: 'img/palmeritas.jpeg', price: '$1.20' },
            { name: 'Pan Salado', image: 'img/pan-salado.jpeg', price: '$1.20' },
            { name: 'Pan Dulce', image: 'img/pan-dulce.jpeg', price: '$1.20' },
            { name: 'Paledonia (Trozo)', image: 'https://via.placeholder.com/400x400?text=Paledonia', price: '$0.90' },
            { name: 'Torta Marmoleada (Trozo)', image: 'https://via.placeholder.com/400x400?text=Torta+Marmoleada', price: '$1.00' },
            { name: 'Acema Dulce', image: 'https://via.placeholder.com/400x400?text=Acema+Dulce', price: '$0.60' }
        ];

        let currentProductIndex = 0;

        function updateProductDisplay() {
            productImage.style.opacity = 0;
            productName.style.opacity = 0;
            productPrice.style.opacity = 0;
            whatsappOrderBtn.style.opacity = 0;

            setTimeout(() => {
                const currentProduct = products[(currentProductIndex + products.length) % products.length];
                const imageUrl = currentProduct.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(currentProduct.name)}`;
                
                productImage.src = imageUrl;
                productName.textContent = currentProduct.name;
                productPrice.textContent = currentProduct.price;

                const whatsappMessage = `Hola, me gustaría ordenar un(a) *${currentProduct.name}* que cuesta *${currentProduct.price}*. ¡Gracias!`;
                const whatsappLink = `https://wa.me/+584140770512?text=${encodeURIComponent(whatsappMessage)}`;
                whatsappOrderBtn.href = whatsappLink;

                updateActiveDot();

                productImage.style.opacity = 1;
                productName.style.opacity = 1;
                productPrice.style.opacity = 1;
                whatsappOrderBtn.style.opacity = 1;
            }, 300);
        }

        function createNavigationDots() {
            navigationDotsContainer.innerHTML = ''; 
            products.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.dataset.index = index;

                dot.addEventListener('click', (event) => {
                    currentProductIndex = parseInt(event.target.dataset.index);
                    updateProductDisplay();
                });
                navigationDotsContainer.appendChild(dot);
            });
            updateActiveDot();
        }

        function updateActiveDot() {
            const dots = document.querySelectorAll('.navigation-dots .dot');
            dots.forEach((dot, index) => {
                if (index === currentProductIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        [leftArrowDesktop, leftArrowMobile].forEach(arrow => {
            if (arrow) {
                arrow.addEventListener('click', () => {
                    currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
                    updateProductDisplay();
                });
            }
        });

        [rightArrowDesktop, rightArrowMobile].forEach(arrow => {
            if (arrow) {
                arrow.addEventListener('click', () => {
                    currentProductIndex = (currentProductIndex + 1) % products.length;
                    updateProductDisplay();
                });
            }
        });

        createNavigationDots();
        updateProductDisplay();

        // --- Bloques de Información Clickeables (SOLO en index.html) ---
        const infoBlocks = document.querySelectorAll('.info-block.clickable');
        infoBlocks.forEach(block => {
            block.addEventListener('click', (event) => {
                const link = block.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                } else {
                    const blockId = block.id;
                    switch (blockId) {
                        case 'puntos-venta-section':
                            console.log('Navegando a la sección: Puntos de venta');
                            break;
                        case 'emprende-section':
                            console.log('Navegando a la sección: Emprende con nosotros');
                            break;
                        default:
                            console.log('Bloque clickeado sin acción definida:', blockId);
                    }
                }
            });
        });
    }

    // --- Lógica del Menú de Categorías (SOLO en catalogo.html) ---
    // Esta sección solo se ejecuta si el elemento del menú de categorías existe en la página
    if (document.querySelector('.category-menu')) {
        const productsData = [
            // Panes
            { name: 'Pan Salado', description: 'Pan de masa madre, suave y delicioso.', price: '$1.20', image: 'img/pan-salado.jpeg', category: 'panes' },
            { name: 'Pan Dulce', description: 'Pan esponjoso con un toque de azúcar.', price: '$1.20', image: 'img/pan-dulce.jpeg', category: 'panes' },
            { name: 'Acema Dulce', description: 'Acema de masa dulce con glaseado de azúcar.', price: '$0.60', image: 'https://placehold.co/400x400/fff9ec/301711?text=Acema', category: 'panes' },

            // Repostería
            { name: 'Palmeritas', description: 'Palmeritas de hojaldre, nuestro producto estrella.', price: '$1.20', image: 'img/palmeritas.jpeg', category: 'reposteria' },
            { name: 'Paledonia (Trozo)', description: 'Paledonia esponjosa ideal para el café.', price: '$0.90', image: 'https://placehold.co/400x400/fff9ec/301711?text=Paledonia', category: 'reposteria' },
            { name: 'Torta Marmoleada (Trozo)', description: 'Torta de vainilla y chocolate, por porción.', price: '$1.00', image: 'https://placehold.co/400x400/fff9ec/301711?text=Torta+Marmoleada', category: 'reposteria' },
            { name: 'Quesillo', description: 'Quesillo tradicional, cremoso y con caramelo.', price: '$desconocido', image: 'https://placehold.co/400x400/fff9ec/301711?text=Quesillo', category: 'reposteria' },

            // Integral
            { name: 'Acema Integral', description: 'Ideal para los amantes del pan integral.', price: '$1.20', image: 'https://placehold.co/400x400/fff9ec/301711?text=Pan+Integral', category: 'integral' },
            
            // Bebidas
            { name: 'SunCola 2lts', description: 'Refresco SunCola 2lts del sabor preferencial.', price: '$0.1.20', image: 'https://placehold.co/400x400/fff9ec/301711?text=Jugo+Naranja', category: 'bebidas' },
            { name: 'SunCola 400ml', description: 'Refresco SunCola 400ml del sabor prefencial.', price: '$0.75', image: 'https://placehold.co/400x400/fff9ec/301711?text=Cafe', category: 'bebidas' }
        ];

        const productContainer = document.getElementById('product-container');
        const categoryIcons = document.querySelectorAll('.category-icon');

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

        function renderProducts(filteredProducts) {
            productContainer.innerHTML = '';
            filteredProducts.forEach(product => {
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        }

        function handleCategoryClick(event) {
            categoryIcons.forEach(icon => icon.classList.remove('active'));
            const clickedIcon = event.currentTarget;
            clickedIcon.classList.add('active');

            const category = clickedIcon.getAttribute('data-category');
            const filteredProducts = category === 'all'
                ? productsData
                : productsData.filter(product => product.category === category);
            
            renderProducts(filteredProducts);
        }

        categoryIcons.forEach(icon => {
            icon.addEventListener('click', handleCategoryClick);
        });

        renderProducts(productsData);
    }
});

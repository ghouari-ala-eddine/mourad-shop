// Initialize storage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
if (!localStorage.getItem('wishlist')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
}

// Display products
function displayProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.includes(product.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => window.location.href = `product.html?id=${product.id}`;
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <button class="quick-view-btn" onclick="openQuickView(${product.id}, event)">Quick View</button>
                <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    ${isInWishlist ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// View product details
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Add to cart function
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Product added to cart!');
}

// Wishlist functions
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(productId);
}

function toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        showToast('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    displayProducts(getFilteredProducts());
}

// Quick View functionality
function openQuickView(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.includes(product.id);

    const quickViewContent = document.getElementById('quick-view-content');
    quickViewContent.innerHTML = `
        <div class="quick-view-grid">
            <div class="quick-view-image-container">
                <img src="${product.image}" alt="${product.name}" class="quick-view-image">
            </div>
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="quick-view-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="toggleWishlist(${product.id}); updateQuickView(${product.id})">
                        ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                    <a href="product.html?id=${product.id}" class="btn btn-outline">View Details</a>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('quick-view-modal');
    modal.style.display = 'block';
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    modal.style.display = 'none';
}

function updateQuickView(productId) {
    openQuickView(productId);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('quick-view-modal');
    if (event.target === modal) {
        closeQuickView();
    }
}

// Filter functions
function getFilteredProducts() {
    let filtered = [...products];
    
    // Search filter
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    const category = document.getElementById('category-select')?.value || '';
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Price filter
    const minPrice = parseFloat(document.getElementById('min-price')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price')?.value) || Infinity;
    filtered = filtered.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    
    return filtered;
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            displayProducts(getFilteredProducts());
        });
    }

    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            displayProducts(getFilteredProducts());
        });
    }

    const applyPriceBtn = document.getElementById('apply-price');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            displayProducts(getFilteredProducts());
        });
    }
});

// Update counts
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Initialize page
displayProducts();
updateCartCount();
updateWishlistCount();

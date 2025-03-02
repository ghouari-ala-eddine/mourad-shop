document.addEventListener('DOMContentLoaded', () => {
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.productId;
            try {
                const response = await fetch('/api/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        quantity: 1
                    })
                });
                
                if (response.ok) {
                    showToast('Product added to cart!');
                } else {
                    showToast('Failed to add product to cart');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred');
            }
        });
    });
});

function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('#search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Cart quantity updates
const quantityInputs = document.querySelectorAll('.quantity-input');
quantityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const quantity = e.target.value;
        const cartItemId = e.target.dataset.cartItemId;
        // Add functionality to update cart quantity
    });
});

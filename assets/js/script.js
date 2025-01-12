// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
});

// Store Functionality
class Store {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addProduct(product) {
        this.products.push(product);
        this.renderProducts();
    }

    renderProducts() {
        const container = document.querySelector('.store-container');
        container.innerHTML = this.products
            .map(
                (product) => `
                <div class="product-card" data-aos="fade-up">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <button onclick="store.addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `
            )
            .join('');
    }

    addToCart(productId) {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
            this.cart.push(product);
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCart();
        }
    }

    updateCart() {
        console.log('Cart updated:', this.cart);
    }
}

const store = new Store();

// Example Products
store.addProduct({
    id: 1,
    name: 'Traditional Fabric Bag',
    description: 'Handmade bag using traditional African fabrics',
    price: 29.99,
    image: 'assets/images/product1.jpg',
});

store.addProduct({
    id: 2,
    name: 'Kitenge Dress',
    description: 'Vibrant and stylish dress made from Kitenge fabric',
    price: 45.00,
    image: 'assets/images/product2.jpg',
});

// Donation Functionality
document.getElementById('donateButton').addEventListener('click', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('customAmount').value * 100;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, name, email }),
    });

    const session = await response.json();
    const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
    await stripe.redirectToCheckout({ sessionId: session.id });
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    this.reset();
});
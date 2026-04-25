// Lakshmi Herbal Products - Frontend JavaScript
// Handles navigation, products loading, form submission, mobile menu

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling
document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load products
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading products...</p></div>';
    
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        grid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2210%22 fill=%22%23C8E6C9%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%234CAF50%22 font-size=%2212%22 font-weight=%22600%22>${product.name.split(' ')[0]}</text></svg>'">
                <div class="product-content">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}</div>
                    <p class="product-desc">${product.description}</p>
                    <a href="https://wa.me/919876543210?text=I%20want%20to%20order%20${encodeURIComponent(product.name)}%20-%20${product.price}" 
                       class="btn btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> Order via WhatsApp
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center;color:#666;">Unable to load products. Please refresh.</p>';
        console.error('Error loading products:', error);
    }
}

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simulate sending to WhatsApp
        const whatsappUrl = `https://wa.me/919876543210?text=Hi!%20${encodeURIComponent(name)}%20-%20${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        contactForm.reset();
        alert('Message sent to WhatsApp! 📱');
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
});


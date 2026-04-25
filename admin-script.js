// Admin Panel JavaScript
// Handles login, CRUD operations for products

const API_BASE = '/api/admin';
let token = localStorage.getItem('adminToken') || null;

// Elements
const loginModal = document.getElementById('loginModal');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const logoutBtn = document.getElementById('logoutBtn');
const clearFormBtn = document.getElementById('clearFormBtn');

// Initialize
document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
    if (token) {
        showDashboard();
        loadProducts();
    }
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        token = data.token;
        localStorage.setItem('adminToken', token);
        showDashboard();
        loadProducts();
        showMessage('Login successful! Welcome back.', 'success');
    } catch (error) {
        showMessage(`Login failed: ${error.message}`, 'error');
    }
});

function showDashboard() {
    loginModal.classList.remove('active');
    adminDashboard.classList.remove('hidden');
}

function showLogin() {
    loginModal.classList.add('active');
    adminDashboard.classList.add('hidden');
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    token = null;
    showLogin();
});

// Load products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await response.json();
        
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="product-image-small" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNDOEU2QzkiLz4KPHRleHQgeD0iMzIiIHk9IjM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNENBRjUwIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iNjAwIj4kJHtwcm9kdWN0Lm5hbWUuc3BsaXQoJyAnKVswXX0kPC90ZXh0Pgo8L3N2Zz4K'"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td class="action-buttons">
                    <button onclick="editProduct('${product._id}')" class="btn btn-small btn-primary">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct('${product._id}')" class="btn btn-small btn-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    } catch (error) {
        showMessage('Failed to load products: ' + error.message, 'error');
    }
}

// Product Form
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const productId = document.getElementById('productId').value;
    
    formData.append('name', document.getElementById('productName').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('description', document.getElementById('productDesc').value);
    formData.append('category', document.getElementById('productCategory').value);
    
    const imageInput = document.getElementById('productImage');
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    
    try {
        const url = productId 
            ? `${API_BASE}/products/${productId}`
            : `${API_BASE}/products`;
        const method = productId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (!response.ok) throw new Error(await response.text());
        
        const product = await response.json();
        showMessage(`Product ${productId ? 'updated' : 'added'} successfully!`, 'success');
        productForm.reset();
        document.getElementById('productId').value = '';
        loadProducts();
    } catch (error) {
        showMessage('Error saving product: ' + error.message, 'error');
    }
});

clearFormBtn.addEventListener('click', () => {
    productForm.reset();
    document.getElementById('productId').value = '';
});

// Edit product
window.editProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await response.json();
        const product = products.find(p => p._id === id);
        
        if (product) {
            document.getElementById('productId').value = product._id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDesc').value = product.description;
            document.getElementById('productCategory').value = product.category || 'hair-oil';
            
            // Scroll to form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        showMessage('Error loading product: ' + error.message, 'error');
    }
};

// Delete product
window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error(await response.text());
        
        showMessage('Product deleted successfully!', 'success');
        loadProducts();
    } catch (error) {
        showMessage('Error deleting product: ' + error.message, 'error');
    }
};

// Messages
function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    document.querySelector('.admin-main')?.insertBefore(message, document.querySelector('.admin-main').firstChild);
    
    setTimeout(() => message.remove(), 5000);
}

// Image preview (bonus feature)
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let preview = document.querySelector('.image-preview');
            if (!preview) {
                preview = document.createElement('img');
                preview.className = 'image-preview';
                const container = document.querySelector('.form-group:has(#productImage)');
                container.appendChild(preview);
            }
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


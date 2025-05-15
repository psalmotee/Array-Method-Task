// Display output in the output div
function log(message) {
    const output = document.getElementById('output');
    output.innerHTML = message;
}

// Product filtering with filter() and currency conversion with map()
const products = [
    { id: 1, name: "Laptop", price: 999, category: "Electronics", image: "laptop.jpg", available: true },
    { id: 2, name: "Coffee Maker", price: 49, category: "Kitchen", image: "coffee-maker.jpg", available: true },
    { id: 3, name: "Running Shoes", price: 89, category: "Sports", image: "running-shoes.jpg", available: false },
    { id: 4, name: "Bluetooth Speaker", price: 59, category: "Electronics", image: "bluetooth-speaker.jpg", available: true },
    { id: 5, name: "Yoga Mat", price: 29, category: "Sports", image: "yoga-mat.jpeg", available: true },
    { id: 6, name: "Smartphone", price: 699, category: "Electronics", image: "smartphone.jpeg", available: true },
    { id: 7, name: "Blender", price: 79, category: "Kitchen", image: "blender.jpeg", available: false },
    { id: 8, name: "Tennis Racket", price: 119, category: "Sports", image: "tennis-racket.jpeg", available: true },
    { id: 9, name: "Smart Watch", price: 199, category: "Electronics", image: "smart-watch.jpeg", available: true },
    { id: 10, name: "Cooking Pot", price: 39, category: "Kitchen", image: "cooking-pot.jpg", available: false }
];

const exchangeRates = {
    NGN: 815.50,
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    JPY: 151.20,
};

const currencySymbols = { NGN: "₦", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts, 'NGN');
    log(`Found ${filteredProducts.length} products matching "${searchTerm}"`);
}

function filterAndConvert() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const currency = document.getElementById('currencySelect').value;
    
    // First filter products
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
    
    // Then convert currency
    const convertedProducts = filteredProducts.map(product => {
        return {
            ...product,
            convertedPrice: (product.price * exchangeRates[currency]).toFixed(2),
            currency: currency
        };
    });
    
    displayProducts(convertedProducts, currency);
    log(`Found ${filteredProducts.length} products in ${currency}`);
}

function displayProducts(productArray, currency) {
    const productList = document.getElementById('productList');
    
    productList.innerHTML = productArray.map(product => {
        let priceDisplay;
        if (currency === 'USD') {
            priceDisplay = `$${product.price}`;
        } else {
            const convertedPrice = (product.price * exchangeRates[currency]).toFixed(2);
            priceDisplay = `${currencySymbols[currency]}${convertedPrice}`;
        }
        
        return `
            <div class="product-card ${!product.available ? 'unavailable' : ''}" 
                 onclick="${product.available ? `selectProduct(${product.id})` : ''}">
                <div class="product-image" style="background-image: url('images/${product.image}')"></div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="product-price">${priceDisplay}</p>
                    <p class="product-category">${product.category}</p>
                    <p class="availability-status">
                        ${product.available ? 'In Stock' : 'Out of Stock'}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

function selectProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (!product.available) {
            log(`Sorry, ${product.name} is currently out of stock.`);
            return;
        }
        
        // Add to cart if available
        cart.push(product.name);
        updateCartWithNaira();
        log(`Added ${product.name} to cart`);
        
        // Show cart when first item is added
        document.getElementById('cartContainer').style.display = 'block';
    }
}

// Initialize product display
displayProducts(products, 'NGN');

// Shopping cart with push() and splice()
const cart = [];

function updateCartWithNaira() {
    const cartItems = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    
    // Update cart badge count
    cartBadge.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '₦0';
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => {
        const product = products.find(p => p.name === item);
        const price = product ? product.price : 0;
        const ngnPrice = (price * exchangeRates.NGN).toFixed(2);
        
        return `
            <div class="cart-item">
                <span>${item}</span>
                <div>
                    <span class="cart-price">₦${ngnPrice}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Calculate total using reduce()
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.name === item);
        return sum + (product ? product.price : 0);
    }, 0);
    
    const ngnTotal = (total * exchangeRates.NGN).toFixed(2);
    document.getElementById('cartTotal').textContent = `₦${ngnTotal}`;
    
    // Add check eligibility button if not already present
    if (!document.getElementById('checkEligibilityBtn')) {
        const eligibilityBtn = document.createElement('button');
        eligibilityBtn.id = 'checkEligibilityBtn';
        eligibilityBtn.className = 'check-eligibility-btn';
        eligibilityBtn.textContent = 'Check for Discounts';
        eligibilityBtn.onclick = checkCartEligibility;
        
        document.getElementById('cartContainer').appendChild(eligibilityBtn);
    }
}

function removeFromCart(index) {
    const removed = cart.splice(index, 1)[0];
    updateCartWithNaira();
    log(`Removed ${removed} from cart`);
    
    // Hide cart if empty after removal
    if (cart.length === 0) {
        document.getElementById('cartContainer').style.display = 'none';
    }
}

function toggleCart() {
    const cartContainer = document.getElementById('cartContainer');
    if (cartContainer.style.display === 'none') {
        cartContainer.style.display = 'block';
    } else {
        cartContainer.style.display = 'none';
    }
}

function closeCartOnClickOutside(event) {
    const cartContainer = document.getElementById('cartContainer');
    const cartToggle = document.querySelector('.cart-toggle');
    
    // If click is outside cart and not on the toggle button
    if (!cartContainer.contains(event.target) && !cartToggle.contains(event.target)) {
        cartContainer.style.display = 'none';
        document.removeEventListener('click', closeCartOnClickOutside);
    }
}

// Prevent cart toggle from closing when clicking inside the cart
document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Add a function using Array.every() to check if all cart items meet criteria
function checkCartEligibility() {
    if (cart.length === 0) {
        log("Your cart is empty");
        return;
    }
    
    // Check if all items in cart are electronics
    const allElectronics = cart.every(itemName => {
        const product = products.find(p => p.name === itemName);
        return product && product.category === "Electronics";
    });
    
    // Check if all items in cart are under ₦100,000 (using Naira)
    const allUnder100k = cart.every(itemName => {
        const product = products.find(p => p.name === itemName);
        return product && (product.price * exchangeRates.NGN) < 100000;
    });
    
    // Display results
    if (allElectronics) {
        log("All items in your cart are electronics - eligible for tech discount!");
    } else if (allUnder100k) {
        log("All items in your cart are under ₦100,000 - eligible for budget discount!");
    } else {
        log("Your cart has mixed items - no special discounts available");
    }
}

// Add a button to the cart container to check eligibility
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    
    // Update cart badge count
    cartBadge.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '$0';
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => {
        const product = products.find(p => p.name === item);
        const price = product ? product.price : 0;
        
        return `
            <div class="cart-item">
                <span>${item}</span>
                <div>
                    <span class="cart-price">$${price}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Calculate total using reduce()
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.name === item);
        return sum + (product ? product.price : 0);
    }, 0);
    
    document.getElementById('cartTotal').textContent = `$${total}`;
    
    // Add check eligibility button if not already present
    if (!document.getElementById('checkEligibilityBtn')) {
        const eligibilityBtn = document.createElement('button');
        eligibilityBtn.id = 'checkEligibilityBtn';
        eligibilityBtn.className = 'check-eligibility-btn';
        eligibilityBtn.textContent = 'Check for Discounts';
        eligibilityBtn.onclick = checkCartEligibility;
        
        document.getElementById('cartContainer').appendChild(eligibilityBtn);
    }
}

// Initialize displays
displayProducts(products, 'NGN');
updateCartWithNaira(); 

// Add a section for find() and some() - Inventory checking
const inventory = [
    { id: 1, product: "Laptop", inStock: 5 },
    { id: 2, product: "Headphones", inStock: 10 },
    { id: 3, product: "Mouse", inStock: 0 },
    { id: 4, product: "Keyboard", inStock: 2 },
    { id: 5, product: "Monitor", inStock: 7 },
    { id: 6, product: "Printer", inStock: 3 },
    { id: 7, product: "Webcam", inStock: 0 },
    { id: 8, product: "External Hard Drive", inStock: 12 }
];

function displayInventory() {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = inventory.map(item => 
        `<div class="inventory-item ${item.inStock === 0 ? 'out-of-stock' : ''}">
            <span>${item.product}</span>
            <span class="stock-status">${item.inStock > 0 ? 
                `In Stock (${item.inStock})` : 
                'Out of Stock'}</span>
        </div>`
    ).join('');
}

function checkInventory() {
    const productName = document.getElementById('inventoryCheck').value;
    const item = inventory.find(item => 
        item.product.toLowerCase() === productName.toLowerCase()
    );
    
    if (item) {
        const isAvailable = item.inStock > 0;
        document.getElementById('inventoryResult').textContent = 
            isAvailable ? `${item.product} is in stock (${item.inStock} available)` : 
                         `${item.product} is out of stock`;
    } else {
        document.getElementById('inventoryResult').textContent = 
            `Product "${productName}" not found`;
    }
}

function checkAnyInStock() {
    const anyInStock = inventory.some(item => item.inStock > 0);
    document.getElementById('anyInStockResult').textContent = 
        anyInStock ? "Some products are in stock" : "All products are out of stock";
}

// Initialize inventory display
displayInventory();

// Task management with sort(), push() and splice()
const tasks = [];

function addTask() {
    const taskText = document.getElementById('taskInput').value;
    const priority = document.getElementById('prioritySelect').value;
    
    if (taskText.trim() === '') return;
    
    tasks.push({ text: taskText, priority: priority });
    document.getElementById('taskInput').value = '';
    displayTasks();
    log(`Added task: "${taskText}" with ${priority} priority`);
}

function removeTask(index) {
    const removed = tasks.splice(index, 1)[0];
    displayTasks();
    log(`Removed task: "${removed.text}"`);
}

function sortTasks() {
    // Custom sort by priority
    tasks.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    displayTasks();
    log('Tasks sorted by priority');
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-list">No tasks added yet</li>';
        return;
    }
    
    taskList.innerHTML = tasks.map((task, index) => 
        `<li class="task-item">
            <div class="task-content">
                <span>${task.text}</span>
                <span class="task-priority" style="color: ${getPriorityColor(task.priority)}">
                    ${task.priority} priority
                </span>
            </div>
            <button class="remove-btn" onclick="removeTask(${index})">Remove</button>
        </li>`
    ).join('');
}

function getPriorityColor(priority) {
    switch(priority) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'green';
        default: return 'black';
    }
}

// Initialize displays
displayTasks();

// Add a section for Array.from() - Creating arrays from form inputs
function processFormData() {
    const checkboxes = document.querySelectorAll('#featureForm input[type="checkbox"]');
    const selectedFeatures = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    document.getElementById('selectedFeatures').textContent = 
        selectedFeatures.length > 0 ? 
        `Selected features: ${selectedFeatures.join(', ')}` : 
        'No features selected';
}

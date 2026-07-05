// ==================== Utility Functions ====================
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function parseInput(value) {
    return parseInt(value) || 0;
}

// ==================== Navigation ====================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
});

// ==================== Search Form ====================
document.getElementById('searchForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const location = document.getElementById('searchLocation').value;
    const type = document.getElementById('searchType').value;
    const category = document.getElementById('searchCategory').value;
    const priceMin = document.getElementById('searchPriceMin').value;
    const priceMax = document.getElementById('searchPriceMax').value;
    const luas = document.getElementById('searchLuas').value;
    
    console.log('Search submitted:', {
        location,
        type,
        category,
        priceMin,
        priceMax,
        luas
    });
    
    alert('Mencari properti dengan filter: ' + (type || 'Semua Tipe'));
});

// ==================== Interactive Map ====================
let map;
let markers = [];

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Initialize Leaflet map
    map = L.map('map').setView([-6.2088, 106.8456], 13); // Jakarta center
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Sample property data
    const properties = [
        {
            lat: -6.2088,
            lng: 106.8456,
            name: 'Rumah Modern Jakarta',
            price: 'Rp 750.000.000',
            type: 'Rumah Subsidi',
            luas: '100 m²'
        },
        {
            lat: -6.2150,
            lng: 106.8400,
            name: 'Komersial Prime Location',
            price: 'Rp 1.200.000.000',
            type: 'Komersial',
            luas: '250 m²'
        },
        {
            lat: -6.2200,
            lng: 106.8500,
            name: 'Kavling Tanah Strategis',
            price: 'Rp 350.000.000',
            type: 'Kavling',
            luas: '200 m²'
        }
    ];
    
    // Add markers
    properties.forEach(property => {
        const marker = L.marker([property.lat, property.lng]).addTo(map);
        
        const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 10px 0;">${property.name}</h4>
                <p style="margin: 5px 0; color: #666;"><strong>Tipe:</strong> ${property.type}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Harga:</strong> ${property.price}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Luas:</strong> ${property.luas}</p>
                <button onclick="selectProperty('${property.name}')" style="width: 100%; padding: 8px; margin-top: 10px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Lihat Detail</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', function() {
            updatePropertyInfo(property);
        });
        
        markers.push(marker);
    });
}

function updatePropertyInfo(property) {
    document.getElementById('propertyTitle').textContent = property.name;
    document.getElementById('propertyDesc').innerHTML = `
        <strong>Tipe:</strong> ${property.type} | 
        <strong>Harga:</strong> ${property.price} | 
        <strong>Luas:</strong> ${property.luas}
    `;
}

function selectProperty(name) {
    alert('Detail properti: ' + name);
}

// ==================== KPR Calculator ====================
document.getElementById('kprForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const propertyPrice = parseInput(document.getElementById('propertyPrice').value);
    const dpPercentage = parseInput(document.getElementById('dpPercentage').value);
    const tenor = parseInput(document.getElementById('tenor').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 5.5;
    
    if (!propertyPrice || !tenor) {
        alert('Silakan isi semua field');
        return;
    }
    
    // Calculate KPR
    const dp = propertyPrice * (dpPercentage / 100);
    const loanAmount = propertyPrice - dp;
    const monthlyRate = interestRate / 100 / 12;
    const monthCount = tenor * 12;
    
    // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, monthCount)) / 
        (Math.pow(1 + monthlyRate, monthCount) - 1);
    
    const totalPayment = monthlyPayment * monthCount;
    const totalInterest = totalPayment - loanAmount;
    
    // Display results
    document.getElementById('resultPrice').textContent = formatCurrency(propertyPrice);
    document.getElementById('resultDP').textContent = formatCurrency(dp);
    document.getElementById('resultLoan').textContent = formatCurrency(loanAmount);
    document.getElementById('resultMonthly').textContent = formatCurrency(monthlyPayment);
    document.getElementById('resultInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('resultTotal').textContent = formatCurrency(totalPayment);
});

// ==================== Category Cards ====================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        console.log('Category selected:', type);
        // Navigate to properties page or filter
        alert('Menampilkan properti: ' + type);
    });
});

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Initialize on Load ====================
window.addEventListener('load', function() {
    initializeMap();
});

// ==================== Dynamic Content Loading ====================
function loadMoreArticles() {
    console.log('Loading more articles...');
    alert('Memuat artikel lebih banyak');
}

function loadMoreProperties() {
    console.log('Loading more properties...');
    alert('Memuat properti lebih banyak');
}

// ==================== Form Validation ====================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ==================== Mobile Responsive ====================
function handleResponsive() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Mobile adjustments
        console.log('Mobile view');
    } else if (width <= 1024) {
        // Tablet adjustments
        console.log('Tablet view');
    } else {
        // Desktop view
        console.log('Desktop view');
    }
}

window.addEventListener('resize', handleResponsive);
window.addEventListener('load', handleResponsive);

// ==================== Scroll Effects ====================
function handleScroll() {
    const scrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    if (scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ==================== Lazy Loading Images ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== Button Event Listeners ====================
document.querySelector('.btn-whatsapp')?.addEventListener('click', function(e) {
    console.log('WhatsApp button clicked');
});

document.querySelector('.btn-primary')?.addEventListener('click', function(e) {
    if (this.textContent.includes('Hubungi')) {
        e.preventDefault();
        alert('Hubungi tim kami untuk informasi lebih lanjut');
    }
});

// ==================== Export Functions ====================
window.formatCurrency = formatCurrency;
window.selectProperty = selectProperty;
window.loadMoreArticles = loadMoreArticles;
window.loadMoreProperties = loadMoreProperties;
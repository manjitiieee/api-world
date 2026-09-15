/* API WORLD - Core Application Logic (with dynamic products) */

// Default seed products
const DEFAULT_PRODUCTS = [
  {
    id: 'weather-pro',
    name: 'WeatherAPI Pro',
    category: 'Weather',
    description: 'Real-time weather data, forecasts, historical data, and severe weather alerts for 200,000+ cities worldwide.',
    price: 29,
    badge: 'popular',
    tags: ['REST', 'JSON', 'Realtime'],
    endpoints: 45
  },
  {
    id: 'finance-market',
    name: 'MarketData API',
    category: 'Finance',
    description: 'Stock quotes, forex rates, crypto prices, and historical market data with sub-second latency.',
    price: 49,
    badge: 'popular',
    tags: ['REST', 'WebSocket', 'Realtime'],
    endpoints: 62
  },
  {
    id: 'data-enrich',
    name: 'Data Enrichment Suite',
    category: 'Data',
    description: 'Enrich customer records with company data, social profiles, demographics, and firmographics.',
    price: 79,
    badge: null,
    tags: ['REST', 'Batch', 'JSON'],
    endpoints: 28
  },
  {
    id: 'geo-location',
    name: 'GeoLocate API',
    category: 'Location',
    description: 'IP geolocation, reverse geocoding, distance calculation, and timezone data with high accuracy.',
    price: 19,
    badge: 'new',
    tags: ['REST', 'JSON'],
    endpoints: 18
  },
  {
    id: 'nlp-sentiment',
    name: 'Sentiment Analysis API',
    category: 'AI / ML',
    description: 'Detect sentiment, emotions, and key phrases in text across 12 languages. Ideal for social listening.',
    price: 39,
    badge: null,
    tags: ['REST', 'AI', 'JSON'],
    endpoints: 12
  },
  {
    id: 'email-verify',
    name: 'Email Validation API',
    category: 'Data',
    description: 'Real-time email verification, disposable detection, and SMTP validation to reduce bounce rates.',
    price: 15,
    badge: null,
    tags: ['REST', 'JSON'],
    endpoints: 8
  },
  {
    id: 'crypto-tracker',
    name: 'CryptoTracker API',
    category: 'Finance',
    description: 'Live crypto prices, order books, trading pairs, and on-chain metrics for 5,000+ digital assets.',
    price: 35,
    badge: 'new',
    tags: ['REST', 'WebSocket'],
    endpoints: 34
  },
  {
    id: 'news-feed',
    name: 'NewsStream API',
    category: 'Data',
    description: 'Aggregated news from 50,000+ sources with filtering by category, language, and sentiment.',
    price: 25,
    badge: null,
    tags: ['REST', 'JSON', 'Realtime'],
    endpoints: 15
  },
  {
    id: 'image-ai',
    name: 'VisionAI API',
    category: 'AI / ML',
    description: 'Image recognition, object detection, OCR, and content moderation powered by state-of-the-art models.',
    price: 59,
    badge: 'popular',
    tags: ['REST', 'AI', 'Binary'],
    endpoints: 22
  },
  {
    id: 'sms-gateway',
    name: 'SMS Gateway API',
    category: 'Communication',
    description: 'Send and receive SMS globally with delivery reports, two-way messaging, and number validation.',
    price: 22,
    badge: null,
    tags: ['REST', 'JSON'],
    endpoints: 10
  },
  {
    id: 'currency-convert',
    name: 'Currency Exchange API',
    category: 'Finance',
    description: 'Live and historical exchange rates for 170+ currencies with daily averages and fluctuation data.',
    price: 12,
    badge: null,
    tags: ['REST', 'JSON'],
    endpoints: 9
  },
  {
    id: 'translate-pro',
    name: 'Translate Pro API',
    category: 'AI / ML',
    description: 'Neural machine translation supporting 100+ languages with formal/informal tone control.',
    price: 45,
    badge: null,
    tags: ['REST', 'AI', 'JSON'],
    endpoints: 7
  }
];

// Load products from localStorage or seed defaults
function loadProducts() {
  const stored = localStorage.getItem('apiworld_products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [...DEFAULT_PRODUCTS];
    }
  }
  localStorage.setItem('apiworld_products', JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProducts(products) {
  localStorage.setItem('apiworld_products', JSON.stringify(products));
}

let PRODUCTS = loadProducts();

// Cart state
let cart = JSON.parse(localStorage.getItem('apiworld_cart') || '[]');

// ========== CART FUNCTIONS ==========
function saveCart() {
  localStorage.setItem('apiworld_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart();
  showToast(product.name + ' added to cart');
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function clearCart() {
  cart = [];
  saveCart();
}

// ========== UI UPDATES ==========
function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const count = getCartCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }

  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-amount');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🛒</p>
        <p>Your cart is empty</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">Browse the marketplace to add APIs</p>
      </div>`;
    if (totalEl) totalEl.textContent = '$0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <p>$${item.price}/mo × ${item.qty}</p>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
      <div class="cart-item-price">$${item.price * item.qty}</div>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = `$${getCartTotal()}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:var(--success)">✓</span> ${escapeHtml(message)}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ========== PRODUCT RENDERING ==========
function renderProducts(filter = 'all', search = '') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  PRODUCTS = loadProducts();

  let filtered = PRODUCTS;
  if (filter !== 'all') {
    filtered = filtered.filter(p => p.category === filter);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => String(t).toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No APIs match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${escapeHtml(p.category)}">
      <div class="product-header">
        <span class="product-badge ${p.badge || ''}">${escapeHtml(p.badge || p.category)}</span>
        <span style="color:var(--text-muted);font-size:0.8rem;">${p.endpoints || 0} endpoints</span>
      </div>
      <div class="product-body">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="product-meta">
          ${(p.tags || []).map(t => `<span class="meta-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
      <div class="product-footer">
        <div class="price">$${p.price}<span>/mo</span></div>
        <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');
  let currentFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts(currentFilter, searchInput?.value || '');
    });
  });

  searchInput?.addEventListener('input', (e) => {
    renderProducts(currentFilter, e.target.value);
  });
}

// ========== CHECKOUT ==========
function initCheckout() {
  const summaryEl = document.getElementById('order-summary-items');
  const totalEl = document.getElementById('order-total');
  if (!summaryEl) return;

  if (cart.length === 0) {
    window.location.href = 'marketplace.html';
    return;
  }

  summaryEl.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${escapeHtml(item.name)} × ${item.qty}</span>
      <span>$${item.price * item.qty}</span>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = `$${getCartTotal()}`;

  const paypalContainer = document.getElementById('paypal-button-container');
  if (paypalContainer) {
    paypalContainer.innerHTML = `
      <button class="btn btn-primary btn-lg" style="width:100%;background:#0070ba;" onclick="processPayPalPayment()">
        Pay with PayPal — $${getCartTotal()}
      </button>
    `;
  }
}

function processPayPalPayment() {
  const email = document.getElementById('email')?.value;
  const name = document.getElementById('fullname')?.value;

  if (!email || !name) {
    showToast('Please fill in your details');
    return;
  }

  const btn = document.querySelector('#paypal-button-container button');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Processing with PayPal...';
  }

  setTimeout(() => {
    const orderId = 'AW-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('apiworld_last_order', JSON.stringify({
      orderId,
      email,
      name,
      items: cart,
      total: getCartTotal(),
      date: new Date().toISOString()
    }));
    clearCart();
    window.location.href = 'success.html';
  }, 1800);
}

function toggleMobileNav() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  PRODUCTS = loadProducts();
  updateCartUI();
  renderProducts();
  setupFilters();
  initCheckout();
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
});

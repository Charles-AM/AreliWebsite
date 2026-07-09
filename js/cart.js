import { CONTACT_PHONE_INTL } from './products.js';

const CART_KEY = 'areli-cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartUI();
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  openCart();
}

export function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
}

export function clearCart() {
  saveCart([]);
}

export function updateQuantity(id, delta) {
  const cart = getCart().map((item) => {
    if (item.id === id) {
      return { ...item, quantity: Math.max(0, item.quantity + delta) };
    }
    return item;
  }).filter((item) => item.quantity > 0);
  saveCart(cart);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function formatPrice(amount) {
  return `GHS ${amount.toFixed(2)}`;
}

export function buildCartOrderMessage() {
  const cart = getCart();
  if (!cart.length) {
    return 'Hi Areli! I\'d like to place an order.';
  }

  const lines = cart.map((item, index) => {
    const lineTotal = item.price * item.quantity;
    return `${index + 1}. ${item.name} x ${item.quantity} — ${formatPrice(lineTotal)}`;
  });

  return [
    'Hi Areli! I\'d like to order:',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(getCartTotal())}`,
  ].join('\n');
}

export function getWhatsAppCheckoutUrl(includeCart = true) {
  const message = includeCart ? buildCartOrderMessage() : 'Hi Areli! I\'d like to place an order.';
  return `https://api.whatsapp.com/send?phone=${CONTACT_PHONE_INTL}&text=${encodeURIComponent(message)}`;
}

function updateCartFooterButtons() {
  const checkoutBtn = document.querySelector('.cart-checkout');
  const clearBtn = document.querySelector('.cart-clear');
  const hasItems = getCart().length > 0;
  const url = getWhatsAppCheckoutUrl();

  if (checkoutBtn) {
    checkoutBtn.setAttribute('aria-disabled', hasItems ? 'false' : 'true');
    checkoutBtn.href = hasItems ? url : '#';
  }

  if (clearBtn) {
    clearBtn.disabled = !hasItems;
    clearBtn.setAttribute('aria-disabled', hasItems ? 'false' : 'true');
  }

  document.querySelectorAll('.whatsapp-order').forEach((btn) => {
    btn.href = url;
  });
}

export function updateCartUI() {
  const countEl = document.querySelector('.cart-count');
  const itemsEl = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-amount');
  const emptyEl = document.querySelector('.cart-empty');

  const cart = getCart();
  const count = getCartCount();

  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('visible', count > 0);
  }

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    if (totalEl) totalEl.textContent = formatPrice(0);
    updateCartFooterButtons();
    return;
  }

  emptyEl?.classList.add('hidden');
  itemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" loading="lazy"
           onerror="this.src='${item.fallback || ''}'" />
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
  updateCartFooterButtons();
}

export function openCart() {
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.querySelector('.cart-panel')?.classList.add('open');
  document.body.classList.add('cart-open');
}

export function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-panel')?.classList.remove('open');
  document.body.classList.remove('cart-open');
}

export function initCart() {
  updateCartUI();

  document.querySelector('.cart-toggle')?.addEventListener('click', openCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

  document.querySelector('.cart-checkout')?.addEventListener('click', (e) => {
    if (!getCart().length) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    window.open(getWhatsAppCheckoutUrl(), '_blank', 'noopener,noreferrer');
  });

  document.querySelector('.cart-clear')?.addEventListener('click', () => {
    if (getCart().length) clearCart();
  });

  document.querySelector('.cart-items')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('cart-item-remove')) {
      removeFromCart(id);
    } else if (btn.dataset.action === 'increase') {
      updateQuantity(id, 1);
    } else if (btn.dataset.action === 'decrease') {
      updateQuantity(id, -1);
    }
  });
}

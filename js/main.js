import {
  shopFilters,
  lifestyleImages,
  testimonials,
  categories,
  getAllCollectionProducts,
  getProductsForFilter,
  SHOP_FILTER_LIMITS,
  WHATSAPP_URL,
  buildContactWhatsAppUrl,
} from './products.js';
import { addToCart, initCart } from './cart.js';
import {
  initScrollAnimations,
  initStickyNav,
  initBackToTop,
  initMobileMenu,
  initLazyImages,
  initCarousel,
} from './animations.js';

const CARD_CLASS = 'shop-card';

function initShopCardImage(imgEl, product) {
  const reveal = () => imgEl.classList.add('is-ready');

  const useFallback = () => {
    if (imgEl.dataset.fallbackApplied === 'true') {
      reveal();
      return;
    }
    imgEl.dataset.fallbackApplied = 'true';
    imgEl.addEventListener('load', reveal, { once: true });
    imgEl.src = product.fallback;
  };

  imgEl.addEventListener('load', reveal, { once: true });
  imgEl.addEventListener('error', useFallback, { once: true });
  imgEl.src = product.image;

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    reveal();
  }
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = CARD_CLASS;
  card.dataset.category = product.categoryId;
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="shop-card-image-wrap">
      <img src="${product.image}" alt="${product.name}"
           loading="lazy" decoding="async" class="shop-card-image" />
    </div>
    <div class="shop-card-info">
      <p class="shop-card-name">${product.name}</p>
      <p class="shop-card-desc">${product.description || ''}</p>
      <p class="shop-card-price">GHS ${product.price.toFixed(2)}</p>
      <button type="button" class="btn btn-accent btn-add-cart shop-card-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `;

  initShopCardImage(card.querySelector('.shop-card-image'), product);
  return card;
}

let activeShopFilter = 'all';
let showFullCatalog = false;

function isDesktopShopView() {
  return window.matchMedia('(min-width: 768px)').matches;
}

function getShopFilterLimit() {
  return isDesktopShopView() ? SHOP_FILTER_LIMITS.desktop : SHOP_FILTER_LIMITS.mobile;
}

function getFilterLabel(filterId) {
  return shopFilters.find((filter) => filter.id === filterId)?.label ?? 'All';
}

function renderShopGrid(filterId = activeShopFilter, options = {}) {
  const { expandAll = false } = options;
  const container = document.getElementById('collections-container');
  const emptyEl = document.getElementById('collections-empty');
  const activeLabel = document.getElementById('collections-active-filter');
  const showAllBtn = document.getElementById('collections-show-all');
  if (!container) return;

  const filterChanged = filterId !== activeShopFilter;
  activeShopFilter = filterId;
  if (expandAll) {
    showFullCatalog = true;
  } else if (filterChanged) {
    showFullCatalog = false;
  }

  const fullCatalog = filterId === 'all'
    ? getProductsForFilter('all', { landing: false })
    : getProductsForFilter(filterId);
  const sourceProducts = filterId === 'all' && !showFullCatalog
    ? getProductsForFilter('all', { landing: true })
    : fullCatalog;
  const filterLimit = getShopFilterLimit();
  const shouldLimit = !showFullCatalog && sourceProducts.length > filterLimit;
  const products = shouldLimit ? sourceProducts.slice(0, filterLimit) : sourceProducts;
  const catalogTotal = filterId === 'all' ? fullCatalog.length : sourceProducts.length;

  container.innerHTML = '';
  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });

  if (emptyEl) {
    emptyEl.classList.toggle('hidden', products.length > 0);
  }

  if (showAllBtn) {
    const hiddenCount = showFullCatalog ? 0 : catalogTotal - products.length;
    showAllBtn.classList.toggle('hidden', hiddenCount <= 0);
    if (filterId === 'all') {
      showAllBtn.textContent = `View all ${catalogTotal} products`;
    } else {
      showAllBtn.textContent = `View all ${catalogTotal} ${getFilterLabel(filterId).toLowerCase()}`;
    }
  }

  if (activeLabel) {
    if (shouldLimit) {
      activeLabel.textContent = `Showing ${products.length} of ${catalogTotal} products`;
    } else if (filterId === 'all') {
      activeLabel.textContent = `Showing all ${catalogTotal} products`;
    } else {
      activeLabel.textContent = `${getFilterLabel(filterId)} · ${products.length} item${products.length === 1 ? '' : 's'}`;
    }
  }

  document.querySelectorAll('.collections-filter-option').forEach((option) => {
    const isActive = option.dataset.filter === filterId;
    option.classList.toggle('active', isActive);
    option.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  initScrollAnimations();
}

function closeFilterMenu() {
  const menu = document.getElementById('collections-filter-menu');
  const toggle = document.getElementById('collections-filter-toggle');
  if (!menu || !toggle) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
}

function openFilterMenu() {
  const menu = document.getElementById('collections-filter-menu');
  const toggle = document.getElementById('collections-filter-toggle');
  if (!menu || !toggle) return;
  menu.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
}

function initShopFilter() {
  const menu = document.getElementById('collections-filter-menu');
  const toggle = document.getElementById('collections-filter-toggle');
  if (!menu || !toggle) return;

  menu.innerHTML = shopFilters.map((filter) => `
    <button
      type="button"
      class="collections-filter-option${filter.id === activeShopFilter ? ' active' : ''}"
      data-filter="${filter.id}"
      role="option"
      aria-selected="${filter.id === activeShopFilter ? 'true' : 'false'}"
    >${filter.label}</button>
  `).join('');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeFilterMenu();
    else openFilterMenu();
  });

  menu.addEventListener('click', (e) => {
    const option = e.target.closest('.collections-filter-option');
    if (!option) return;
    renderShopGrid(option.dataset.filter);
    closeFilterMenu();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.collections-filter-wrap')) {
      closeFilterMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFilterMenu();
  });

  document.getElementById('collections-show-all')?.addEventListener('click', () => {
    renderShopGrid(activeShopFilter, { expandAll: true });
  });
}

function applyShopFilter(filterId) {
  renderShopGrid(filterId);
  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initShopFilterResize() {
  let lastLimit = getShopFilterLimit();
  window.addEventListener('resize', () => {
    if (showFullCatalog) return;
    const nextLimit = getShopFilterLimit();
    if (nextLimit !== lastLimit) {
      lastLimit = nextLimit;
      renderShopGrid(activeShopFilter);
    }
  });
}

function renderCollections() {
  renderShopGrid('all');
  initShopFilter();
  initShopFilterResize();

  const hash = window.location.hash;
  if (hash.startsWith('#collection-')) {
    const categoryId = hash.slice('#collection-'.length);
    if (shopFilters.some((filter) => filter.id === categoryId)) {
      renderShopGrid(categoryId);
    }
  }
}

function renderLifestyle() {
  const grid = document.querySelector('.lifestyle-grid');
  if (!grid) return;
  lifestyleImages.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'lifestyle-card fade-in-up';
    el.style.transitionDelay = `${i * 0.1}s`;
    el.innerHTML = `
      <img src="${item.fallback}" alt="Style inspiration" loading="lazy" class="lifestyle-image" data-local="${item.image}" />
    `;
    const img = el.querySelector('img');
    const testImg = new Image();
    testImg.onload = () => { img.src = item.image; };
    testImg.onerror = () => { img.src = item.fallback; };
    testImg.src = item.image;
    grid.appendChild(el);
  });
}

function renderTestimonials() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  testimonials.forEach((t, i) => {
    const el = document.createElement('blockquote');
    el.className = 'testimonial-card';
    el.style.transitionDelay = `${i * 0.1}s`;
    el.innerHTML = `
      <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
      <p>"${t.text}"</p>
      <footer>
        <strong>${t.name}</strong>
        <span>${t.location}</span>
      </footer>
    `;
    track.appendChild(el);
  });
}

function renderCategories() {
  const grid = document.querySelector('.category-grid');
  if (!grid) return;
  const icons = {
    necklace: '<path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 13 4-6 7-9 7-13 0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    earrings: '<circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/><circle cx="12" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    bracelet: '<ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    perfume: '<path d="M9 4h6v3a3 3 0 01-6 0V4zM8 10h8v10H8z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    crochet: '<path d="M4 6c4 2 8 2 12 0M4 12c4 2 8 2 12 0M4 18c4 2 8 2 12 0" fill="none" stroke="currentColor" stroke-width="1.2"/>',
  };
  categories.forEach((cat, i) => {
    const el = document.createElement('a');
    el.href = '#collections';
    el.className = 'category-card fade-in-up';
    el.dataset.shopFilter = cat.filter;
    el.style.transitionDelay = `${i * 0.08}s`;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" class="category-icon">${icons[cat.icon]}</svg>
      <span>${cat.name}</span>
    `;
    grid.appendChild(el);
  });

  grid.querySelectorAll('.category-card[data-shop-filter]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      applyShopFilter(card.dataset.shopFilter);
    });
  });
}

function initProductActions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;
    const id = btn.dataset.id;
    const product = getAllCollectionProducts().find((p) => p.id === id);
    if (product) {
      addToCart(product);
      btn.textContent = 'Added!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
      }, 1500);
    }
  });
}

function refreshShopImagesOnRestore() {
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.querySelectorAll('.shop-card-image').forEach((img) => {
      const currentSrc = img.getAttribute('src');
      if (!currentSrc) return;
      img.classList.remove('is-ready');
      img.removeAttribute('data-fallback-applied');
      img.src = '';
      img.src = currentSrc;
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-ready');
      }
    });
  });
}

function revealHeroImage(img) {
  img.classList.add('is-ready');
}

function initHeroImage() {
  const heroImg = document.querySelector('.hero-image');
  if (!heroImg) return;

  const fallback = heroImg.dataset.fallback;
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    revealHeroImage(heroImg);
  };

  if (heroImg.complete && heroImg.naturalWidth > 0) {
    reveal();
    return;
  }

  heroImg.addEventListener('load', reveal, { once: true });
  heroImg.addEventListener('error', () => {
    if (fallback && heroImg.src !== fallback) {
      heroImg.addEventListener('load', reveal, { once: true });
      heroImg.src = fallback;
      return;
    }
    reveal();
  }, { once: true });
}

function refreshHeroImageOnRestore() {
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    const heroImg = document.querySelector('.hero-image');
    if (!heroImg) return;
    heroImg.classList.remove('is-ready');
    const currentSrc = heroImg.getAttribute('src');
    if (!currentSrc) return;
    heroImg.src = '';
    heroImg.src = currentSrc;
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      revealHeroImage(heroImg);
    }
  });
}

function initAboutImages() {
  document.querySelectorAll('.about-image').forEach((img) => {
    const local = img.dataset.local;
    const fallback = img.src;
    if (!local) return;
    const testImg = new Image();
    testImg.onload = () => { img.src = local; };
    testImg.onerror = () => { img.src = fallback; };
    testImg.src = local;
  });
}

function initContactLinks() {
  document.querySelectorAll('[data-whatsapp], a[href*="api.whatsapp.com/send"]').forEach((el) => {
    el.href = WHATSAPP_URL;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const url = buildContactWhatsAppUrl({
      name: data.get('name').trim(),
      phone: data.get('phone').trim(),
      email: data.get('email').trim(),
      subject: data.get('subject'),
      message: data.get('message').trim(),
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileMenu();
  initBackToTop();
  initLazyImages();
  initCarousel();
  initCart();
  initProductActions();
  initHeroImage();
  refreshHeroImageOnRestore();
  refreshShopImagesOnRestore();
  initAboutImages();
  initContactLinks();
  initContactForm();

  renderCollections();
  renderLifestyle();
  renderTestimonials();
  renderCategories();

  initScrollAnimations();
});

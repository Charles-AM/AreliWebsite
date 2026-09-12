import {
  shopFilters,
  clientCamMedia,
  testimonials,
  categories,
  getAllCollectionProducts,
  getProductsForFilter,
  SHOP_FILTER_LIMITS,
  WHATSAPP_URL,
  buildContactWhatsAppUrl,
  hydrateCatalog,
  hydrateClientCam,
} from './products.js';
import { addToCart, initCart } from './cart.js';
import {
  initScrollAnimations,
  initHeroTimeline,
  initStickyNav,
  initBackToTop,
  initMobileMenu,
  initCarousel,
} from './animations.js';
import {
  initCardHoverLift,
  initPressFeedback,
  initCartBadgePop,
  initMobileMenuSpring,
  initProductImageInspection,
} from './interactions.js';
import { initGridStagger, initFlourishDraw } from './decorative.js';
import { bootCachedImages, initImageRestore, initLocalImage } from './images.js';

const CARD_CLASS = 'shop-card';

function initShopCardImage(imgEl, product) {
  initLocalImage(imgEl, { src: product.image, fallback: product.fallback });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = CARD_CLASS;
  card.dataset.category = product.categoryId;
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="shop-card-image-wrap" role="button" tabindex="0"
         aria-label="Inspect image of ${product.name}" aria-pressed="false">
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
let shopResizeInitialized = false;

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
  delete container.dataset.staggerInit;
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
    if (filterId === 'all') {
      activeLabel.textContent = shouldLimit
        ? `Showing ${products.length} of ${catalogTotal} products`
        : `Showing all ${catalogTotal} products`;
    } else {
      activeLabel.textContent = `${getFilterLabel(filterId)} · ${catalogTotal} item${catalogTotal === 1 ? '' : 's'}`;
    }
  }

  document.querySelectorAll('.collections-filter-option').forEach((option) => {
    const isActive = option.dataset.filter === filterId;
    option.classList.toggle('active', isActive);
    option.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  initScrollAnimations();
  initGridStagger('#collections-container');
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

  if (menu.dataset.listenersAttached === 'true') return;
  menu.dataset.listenersAttached = 'true';

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
  if (shopResizeInitialized) return;
  shopResizeInitialized = true;
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

function initClientCamVideos(grid) {
  const videos = grid.querySelectorAll('.client-cam-video');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  videos.forEach((video) => {
    video.addEventListener('loadeddata', () => {
      video.classList.add('is-ready');
    }, { once: true });
    video.addEventListener('error', () => {
      const poster = video.getAttribute('poster');
      if (poster) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = video.getAttribute('aria-label') || 'Client wearing Areli jewellery';
        img.className = 'client-cam-media client-cam-image is-ready';
        img.loading = 'lazy';
        img.decoding = 'async';
        video.replaceWith(img);
        return;
      }
      video.removeAttribute('src');
      video.load();
      video.classList.add('is-ready');
    }, { once: true });
    observer.observe(video);
  });
}

function renderClientCam() {
  const grid = document.querySelector('.client-cam-grid');
  if (!grid) return;

  const section = grid.closest('.client-cam');
  if (section) section.hidden = clientCamMedia.length === 0;
  grid.replaceChildren();

  clientCamMedia.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'client-cam-card';

    if (item.type === 'video') {
      el.classList.add('client-cam-card--video');
      const video = document.createElement('video');
      video.className = 'client-cam-media client-cam-video';
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.controls = false;
      video.disablePictureInPicture = true;
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback noplaybackrate');
      video.setAttribute('disableremoteplayback', '');
      video.tabIndex = -1;
      video.setAttribute('aria-label', 'Client wearing Areli jewellery');
      el.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = 'Client wearing Areli jewellery';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.className = 'client-cam-media client-cam-image';
      el.appendChild(img);
      initLocalImage(img, { src: item.image });
    }

    grid.appendChild(el);
  });

  initClientCamVideos(grid);
}

function renderTestimonials() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  testimonials.forEach((t) => {
    const el = document.createElement('blockquote');
    el.className = 'testimonial-card';
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
  grid.replaceChildren();
  const icons = {
    necklace: '<path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 13 4-6 7-9 7-13 0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    earrings: '<circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/><circle cx="12" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    bracelet: '<ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    perfume: '<path d="M9 4h6v3a3 3 0 01-6 0V4zM8 10h8v10H8z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    men: '<circle cx="8" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="16" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M11.5 12h1M4.5 8.5 2.5 6.5M19.5 8.5l2-2M4.5 15.5l-2 2M19.5 15.5l2 2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
    jewelry: '<path d="M4 9h16l-8 11L4 9Zm0 0 4-5h8l4 5M8 4l4 5 4-5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
  };
  categories.forEach((cat) => {
    const el = document.createElement('a');
    el.href = '#collections';
    el.className = 'category-card';
    el.dataset.shopFilter = cat.filter;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" class="category-icon">${icons[cat.icon] || icons.jewelry}</svg>
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

function initAboutImages() {
  document.querySelectorAll('.about-image').forEach((img) => {
    initLocalImage(img, {
      src: img.dataset.local || img.getAttribute('src'),
      fallback: img.dataset.fallback,
    });
  });
}

function initHeroImage() {
  const heroImg = document.querySelector('.hero-image');
  if (!heroImg) return;

  initLocalImage(heroImg, {
    src: heroImg.getAttribute('src'),
    fallback: heroImg.dataset.fallback,
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

document.addEventListener('DOMContentLoaded', async () => {
  bootCachedImages();
  initStickyNav();
  initMobileMenu();
  initMobileMenuSpring();
  initBackToTop();
  initCarousel();
  initCart();
  initCartBadgePop();
  initProductImageInspection();
  initProductActions();
  initHeroImage();
  initImageRestore('.hero-image, .shop-card-image, .client-cam-image, .about-image');
  initAboutImages();
  initContactLinks();
  initContactForm();
  initCardHoverLift();
  initPressFeedback();
  initFlourishDraw();
  initHeroTimeline();

  const hasShop = document.getElementById('collections-container');

  await Promise.all([
    hasShop ? hydrateCatalog() : Promise.resolve(),
    hydrateClientCam(),
  ]);

  if (hasShop) {
    const catalogStatus = document.getElementById('collections-active-filter');
    if (catalogStatus) catalogStatus.textContent = 'Showing the collection';
    renderCollections();
    renderShopGrid(activeShopFilter);
    initShopFilter();
  }

  renderClientCam();
  renderTestimonials();

  if (document.querySelector('.category-grid')) {
    renderCategories();
  }

  initScrollAnimations();
  initGridStagger('.why-grid, .client-cam-grid, .category-grid, .testimonials-track');
});

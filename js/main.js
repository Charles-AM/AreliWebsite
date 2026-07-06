import { collections, lifestyleImages, testimonials, categories, getAllCollectionProducts, WHATSAPP_URL, buildContactWhatsAppUrl } from './products.js';
import { addToCart, initCart } from './cart.js';
import {
  initScrollAnimations,
  initStickyNav,
  initBackToTop,
  initMobileMenu,
  initLazyImages,
  initCarousel,
} from './animations.js';

function createProductCard(product, gallery = false) {
  const card = document.createElement('article');
  card.className = gallery ? 'gallery-card' : 'product-card fade-in-up';
  card.innerHTML = gallery ? `
    <div class="gallery-image-wrap">
      <img src="${product.fallback}" data-local="${product.image}" alt="${product.name}"
           loading="lazy" class="gallery-image" />
    </div>
    <div class="gallery-info">
      <p class="gallery-name">${product.name}</p>
      ${product.description ? `<p class="gallery-desc">${product.description}</p>` : ''}
      <p class="gallery-price">GHS ${product.price.toFixed(2)}</p>
      <button class="btn btn-accent btn-add-cart btn-gallery-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  ` : `
    <div class="product-image-wrap">
      <img src="${product.fallback}" data-local="${product.image}" alt="${product.name}"
           loading="lazy" class="product-image" />
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <p class="product-price">GHS ${product.price.toFixed(2)}</p>
      <button class="btn btn-accent btn-add-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `;

  const imgEl = card.querySelector('.gallery-image, .product-image');
  const testImg = new Image();
  testImg.onload = () => { imgEl.src = product.image; };
  testImg.onerror = () => { imgEl.src = product.fallback; };
  testImg.src = product.image;

  return card;
}

function renderCollections() {
  const container = document.getElementById('collections-container');
  if (!container) return;

  collections.forEach((group) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'collection-group';
    groupEl.innerHTML = `<h3 class="collection-group-title">${group.group}</h3>`;

    group.categories.forEach((category) => {
      const section = document.createElement('div');
      section.className = 'collection-category collection-gallery';
      section.id = `collection-${category.id}`;
      section.innerHTML = `
        <div class="collection-category-head">
          <h4 class="collection-category-title">${category.name}</h4>
          <span class="scroll-hint">Swipe for more</span>
        </div>
        <div class="carousel-wrapper carousel-wrapper-fade">
          <div class="carousel-track gallery-track" role="list" aria-label="${category.name} products"></div>
        </div>
      `;

      const track = section.querySelector('.carousel-track');
      category.products.forEach((product) => {
        track.appendChild(createProductCard(product, true));
      });

      groupEl.appendChild(section);
    });

    container.appendChild(groupEl);
  });
}

function renderLifestyle() {
  const grid = document.querySelector('.lifestyle-grid');
  if (!grid) return;
  lifestyleImages.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `lifestyle-card fade-in-up`;
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
    el.href = cat.href;
    el.className = 'category-card fade-in-up';
    el.style.transitionDelay = `${i * 0.08}s`;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" class="category-icon">${icons[cat.icon]}</svg>
      <span>${cat.name}</span>
    `;
    grid.appendChild(el);
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
  initAboutImages();
  initContactLinks();
  initContactForm();

  renderCollections();
  renderLifestyle();
  renderTestimonials();
  renderCategories();

  initScrollAnimations();
});

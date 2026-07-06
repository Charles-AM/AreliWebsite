import { collections, bestsellers, lifestyleImages, testimonials, categories, getAllCollectionProducts } from './products.js';
import { addToCart, initCart, initWishlist } from './cart.js';
import {
  initScrollAnimations,
  initStickyNav,
  initBackToTop,
  initMobileMenu,
  initLazyImages,
  initCarousel,
} from './animations.js';

function createProductCard(product, showWishlist = true, gallery = false) {
  const card = document.createElement('article');
  card.className = gallery ? 'gallery-card fade-in-up' : 'product-card fade-in-up';
  card.innerHTML = gallery ? `
    <div class="gallery-image-wrap">
      <img src="${product.fallback}" data-local="${product.image}" alt="${product.name}"
           loading="lazy" class="gallery-image" />
      ${showWishlist ? `<button class="wishlist-btn" data-id="${product.id}" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>` : ''}
    </div>
    <div class="gallery-info">
      <p class="gallery-name">${product.name}</p>
      <p class="gallery-price">GHS ${product.price.toFixed(2)}</p>
      <button class="btn btn-accent btn-add-cart btn-gallery-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  ` : `
    <div class="product-image-wrap">
      <img src="${product.fallback}" data-local="${product.image}" alt="${product.name}"
           loading="lazy" class="product-image" />
      ${showWishlist ? `<button class="wishlist-btn" data-id="${product.id}" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>` : ''}
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
    groupEl.className = 'collection-group fade-in-up';
    groupEl.innerHTML = `<h3 class="collection-group-title">${group.group}</h3>`;

    group.categories.forEach((category) => {
      const isGallery = category.gallery === true;
      const section = document.createElement('div');
      section.className = `collection-category${isGallery ? ' collection-gallery' : ''}`;
      section.id = `collection-${category.id}`;
      section.innerHTML = `
        <div class="collection-category-header">
          <div>
            <h4 class="collection-category-title">${category.name}</h4>
            ${isGallery ? '<p class="scroll-hint">Scroll to explore →</p>' : ''}
          </div>
          <div class="carousel-controls">
            <button class="carousel-prev" aria-label="Previous ${category.name} products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="carousel-next" aria-label="Next ${category.name} products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div class="carousel-wrapper carousel-wrapper-fade">
          <div class="carousel-track${isGallery ? ' gallery-track' : ''}" role="list" aria-label="${category.name} products"></div>
        </div>
      `;

      const track = section.querySelector('.carousel-track');
      category.products.forEach((product) => {
        track.appendChild(createProductCard(product, true, isGallery));
      });

      groupEl.appendChild(section);
    });

    container.appendChild(groupEl);
  });
}

function renderBestsellers() {
  const grid = document.querySelector('.bestsellers-grid');
  if (!grid) return;
  bestsellers.forEach((product) => {
    grid.appendChild(createProductCard(product, false));
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
    el.className = 'testimonial-card fade-in-up';
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
    jewelry: '<path d="M12 2l2 4h5l-4 3 1.5 5L12 12 7.5 14 9 9 5 6h5z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    necklace: '<path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 13 4-6 7-9 7-13 0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
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
    const product = getAllCollectionProducts().find((p) => p.id === id)
      || bestsellers.find((p) => p.id === id);
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

function initHeroImage() {
  const heroImg = document.querySelector('.hero-image');
  if (!heroImg) return;
  const local = heroImg.dataset.local;
  const fallback = heroImg.src;
  if (!local) return;
  const testImg = new Image();
  testImg.onload = () => { heroImg.src = local; };
  testImg.onerror = () => { heroImg.src = fallback; };
  testImg.src = local;
}

function initAboutImage() {
  const aboutImg = document.querySelector('.about-image');
  if (!aboutImg) return;
  const local = aboutImg.dataset.local;
  const fallback = aboutImg.src;
  if (!local) return;
  const testImg = new Image();
  testImg.onload = () => { aboutImg.src = local; };
  testImg.onerror = () => { aboutImg.src = fallback; };
  testImg.src = local;
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileMenu();
  initBackToTop();
  initScrollAnimations();
  initLazyImages();
  initCarousel();
  initCart();
  initWishlist();
  initProductActions();
  initHeroImage();
  initAboutImage();

  renderCollections();
  renderBestsellers();
  renderLifestyle();
  renderTestimonials();
  renderCategories();

  setTimeout(initScrollAnimations, 100);
});

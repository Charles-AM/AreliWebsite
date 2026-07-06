import { products, lifestyleImages, testimonials, categories } from './products.js';
import { addToCart, initCart, initWishlist } from './cart.js';
import {
  initScrollAnimations,
  initStickyNav,
  initBackToTop,
  initMobileMenu,
  initLazyImages,
  initCarousel,
} from './animations.js';

function resolveImageSrc(localPath, fallback) {
  return localPath;
}

function handleImageError(img, fallback) {
  if (fallback && img.src !== fallback) {
    img.src = fallback;
  }
}

function createProductCard(product, showWishlist = true) {
  const card = document.createElement('article');
  card.className = 'product-card fade-in-up';
  card.innerHTML = `
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

  const img = card.querySelector('.product-image');
  const testImg = new Image();
  testImg.onload = () => { img.src = product.image; };
  testImg.onerror = () => { img.src = product.fallback; };
  testImg.src = product.image;

  return card;
}

function renderNewArrivals() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  products.newArrivals.forEach((product) => {
    track.appendChild(createProductCard(product));
  });
}

function renderBestsellers() {
  const grid = document.querySelector('.bestsellers-grid');
  if (!grid) return;
  products.bestsellers.forEach((product) => {
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
    necklace: '<path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 13 4-6 7-9 7-13 0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    ring: '<circle cx="12" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M12 8V2" stroke="currentColor" stroke-width="1.2"/>',
    earrings: '<circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/><path d="M8 10v6M16 10v6" stroke="currentColor" stroke-width="1.2"/>',
    bracelet: '<ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.2"/>',
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
    const allProducts = [...products.newArrivals, ...products.bestsellers];
    const product = allProducts.find((p) => p.id === id);
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

  renderNewArrivals();
  renderBestsellers();
  renderLifestyle();
  renderTestimonials();
  renderCategories();

  // Re-run animations after dynamic content loads
  setTimeout(initScrollAnimations, 100);
});

import { animate } from 'motion';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOVER_SPRING = { type: 'spring', stiffness: 400, damping: 22 };
const PRESS_SPRING = { type: 'spring', stiffness: 500, damping: 25 };

const LIFT_SELECTOR = '.gallery-card, .product-card, .why-card, .shop-card, .category-card, .testimonial-card';
const PRESS_SELECTOR = 'button, .btn';

function isFinePointer(e) {
  return e.pointerType !== 'touch';
}

/**
 * Native-feeling hover/press gestures via event delegation, so dynamically
 * rendered cards (product grids re-render on every filter change) pick up
 * the behaviour automatically without re-binding listeners per element.
 */
export function initCardHoverLift() {
  if (REDUCED_MOTION) return;

  document.addEventListener('pointerover', (e) => {
    if (!isFinePointer(e)) return;
    const card = e.target.closest(LIFT_SELECTOR);
    if (!card || card.contains(e.relatedTarget)) return;
    animate(card, { y: -6, scale: 1.015 }, HOVER_SPRING);
  });

  document.addEventListener('pointerout', (e) => {
    if (!isFinePointer(e)) return;
    const card = e.target.closest(LIFT_SELECTOR);
    if (!card || card.contains(e.relatedTarget)) return;
    animate(card, { y: 0, scale: 1 }, HOVER_SPRING);
  });
}

export function initPressFeedback() {
  if (REDUCED_MOTION) return;

  const press = (target) => animate(target, { scale: 0.95 }, PRESS_SPRING);
  const release = (target) => animate(target, { scale: 1 }, PRESS_SPRING);

  document.addEventListener('pointerdown', (e) => {
    if (!isFinePointer(e)) return;
    const target = e.target.closest(PRESS_SELECTOR);
    if (target && !target.disabled) press(target);
  });

  // pointerleave is intentionally excluded here — it doesn't bubble, so at
  // the document level it only fires as the pointer exits the viewport
  // entirely, with e.target === document (no .closest method).
  ['pointerup', 'pointercancel'].forEach((evt) => {
    document.addEventListener(evt, (e) => {
      if (!isFinePointer(e)) return;
      const target = e.target.closest(PRESS_SELECTOR);
      if (target) release(target);
    });
  });
}

/** Spring-pops the cart count badge whenever the cart changes. */
export function initCartBadgePop() {
  if (REDUCED_MOTION) return;

  window.addEventListener('cart-updated', () => {
    const badge = document.querySelector('.cart-count');
    if (!badge || !badge.classList.contains('visible')) return;
    animate(badge, { scale: [1, 1.4, 1] }, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
  });
}

/** Springs the mobile nav links in with a stagger whenever the menu opens. */
export function initMobileMenuSpring() {
  if (REDUCED_MOTION) return;

  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) return;

  const links = Array.from(overlay.querySelectorAll('.mobile-nav-links a'));
  let wasOpen = false;

  const observer = new MutationObserver(() => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen && !wasOpen) {
      links.forEach((link, i) => {
        animate(link, { scale: [0.85, 1] }, { ...HOVER_SPRING, delay: 0.05 * i });
      });
    }
    wasOpen = isOpen;
  });

  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
}

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

/**
 * Gives product photography a useful close inspection gesture.
 * Touch and pointer users press and hold. Keyboard users toggle with Enter
 * or Space and close with Escape.
 */
export function initProductImageInspection() {
  const HOLD_DELAY = 240;
  const MOVE_TOLERANCE = 10;
  let holdTimer = null;
  let candidate = null;
  let activeWrap = null;
  let startX = 0;
  let startY = 0;
  let resetSequence = 0;

  const clearCandidate = () => {
    window.clearTimeout(holdTimer);
    holdTimer = null;
    candidate = null;
  };

  const setOrigin = (wrap, clientX, clientY) => {
    const image = wrap.querySelector('.shop-card-image');
    if (!image) return;
    const rect = wrap.getBoundingClientRect();
    const x = Math.max(12, Math.min(88, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(12, Math.min(88, ((clientY - rect.top) / rect.height) * 100));
    image.style.transformOrigin = `${x}% ${y}%`;
  };

  const closeInspection = () => {
    if (!activeWrap) return;
    const wrap = activeWrap;
    const image = wrap.querySelector('.shop-card-image');
    const sequence = ++resetSequence;
    activeWrap = null;
    wrap.classList.remove('is-inspecting');
    wrap.setAttribute('aria-pressed', 'false');

    if (image) {
      const controls = animate(image, { scale: 1 }, {
        duration: REDUCED_MOTION ? 0.001 : 0.34,
        ease: [0.16, 1, 0.3, 1],
      });
      controls.finished.then(() => {
        if (sequence !== resetSequence) return;
        image.style.removeProperty('transform');
        image.style.removeProperty('transform-origin');
      }).catch(() => {});
    }
  };

  const openInspection = (wrap, clientX, clientY) => {
    const image = wrap.querySelector('.shop-card-image');
    if (!image) return;

    if (activeWrap && activeWrap !== wrap) closeInspection();
    resetSequence += 1;
    activeWrap = wrap;
    setOrigin(wrap, clientX, clientY);
    wrap.classList.add('is-inspecting');
    wrap.setAttribute('aria-pressed', 'true');
    animate(image, { scale: 1.6 }, REDUCED_MOTION
      ? { duration: 0.001 }
      : {
          type: 'spring',
          stiffness: 210,
          damping: 28,
          mass: 0.7,
        });
  };

  document.addEventListener('pointerdown', (event) => {
    const wrap = event.target.closest('.shop-card-image-wrap');
    if (!wrap || event.button !== 0) return;

    clearCandidate();
    candidate = wrap;
    startX = event.clientX;
    startY = event.clientY;
    holdTimer = window.setTimeout(() => {
      if (candidate === wrap) openInspection(wrap, event.clientX, event.clientY);
    }, HOLD_DELAY);
  });

  document.addEventListener('pointermove', (event) => {
    if (!candidate) return;
    const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (!activeWrap && moved > MOVE_TOLERANCE) {
      clearCandidate();
      return;
    }
    if (activeWrap === candidate) setOrigin(activeWrap, event.clientX, event.clientY);
  }, { passive: true });

  ['pointerup', 'pointercancel'].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      clearCandidate();
      closeInspection();
    });
  });

  document.addEventListener('keydown', (event) => {
    const wrap = event.target.closest('.shop-card-image-wrap');
    if (!wrap) return;

    if (event.key === 'Escape') {
      closeInspection();
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (activeWrap === wrap) {
      closeInspection();
    } else {
      const rect = wrap.getBoundingClientRect();
      openInspection(wrap, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  });

  document.addEventListener('focusout', (event) => {
    if (activeWrap === event.target) closeInspection();
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

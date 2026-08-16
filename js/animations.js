import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll-triggered reveals, driven by GSAP ScrollTrigger.
 * Reuses the existing .fade-in / .fade-in-up / .fade-in-left / .fade-in-right
 * hooks already present across all four pages, so markup never needs to
 * change — only the engine underneath it does. Grid/list entrances
 * (.stagger-children and dynamically-rendered card grids) are owned by
 * Anime.js instead — see decorative.js's initGridStagger — to avoid two
 * engines animating the same elements.
 */
export function initScrollAnimations() {
  if (REDUCED_MOTION) {
    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right')
      .forEach((el) => el.classList.add('visible'));
    return;
  }

  const revealed = new WeakSet();

  const directions = {
    'fade-in': { x: 0, y: 0 },
    'fade-in-up': { x: 0, y: 30 },
    'fade-in-left': { x: -30, y: 0 },
    'fade-in-right': { x: 30, y: 0 },
  };

  Object.entries(directions).forEach(([cls, from]) => {
    document.querySelectorAll(`.${cls}:not(.stagger-children)`).forEach((el) => {
      if (revealed.has(el)) return;
      revealed.add(el);
      gsap.fromTo(el, { opacity: 0, x: from.x, y: from.y }, {
        opacity: 1, x: 0, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onStart: () => el.classList.add('visible'),
      });
    });
  });

  ScrollTrigger.refresh();
}

/** Hero entrance sequence — nav down, eyebrow, headline, tagline, CTAs, image wipe. */
export function initHeroTimeline() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  if (REDUCED_MOTION) {
    hero.querySelectorAll('.hero-eyebrow, h1, .hero-tagline, .hero-cta, .hero-image').forEach((el) => {
      el.style.opacity = 1;
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const imageWrap = hero.querySelector('.hero-image-wrap');

  tl.from('.main-nav', { y: -40, opacity: 0, duration: 0.6, clearProps: 'transform' }, 0)
    .from(hero.querySelectorAll('.hero-eyebrow'), { opacity: 0, y: 16, duration: 0.6 }, 0.15)
    .from(hero.querySelectorAll('h1'), { opacity: 0, y: 24, duration: 0.7 }, 0.25)
    .from(hero.querySelectorAll('.hero-tagline'), { opacity: 0, y: 16, duration: 0.6 }, 0.4)
    .from(hero.querySelectorAll('.hero-cta > *'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 0.5);

  if (imageWrap) {
    tl.from(imageWrap, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'power4.inOut',
    }, 0.1);
  }

  // Backgrounded tabs (e.g. links opened in a new background tab) can fully
  // suspend requestAnimationFrame, which would otherwise leave the hero
  // stuck invisible forever. setTimeout still fires on hidden tabs, so use
  // it as a watchdog that snaps the timeline to its end state.
  setTimeout(() => {
    if (tl.progress() < 1) tl.progress(1);
  }, 1600);
}

export function initStickyNav() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  let lastScroll = 0;
  const onScroll = () => {
    const current = window.scrollY;
    nav.classList.toggle('scrolled', current > 60);
    nav.classList.toggle('nav-hidden', current > lastScroll && current > 300);
    lastScroll = current;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const close = document.querySelector('.mobile-menu-close');

  const open = () => {
    overlay?.classList.add('open');
    document.body.classList.add('menu-open');
  };
  const shut = () => {
    overlay?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', open);
  close?.addEventListener('click', shut);
  overlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', shut));
}

export function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => img.classList.add('loaded'));
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach((img) => imageObserver.observe(img));
}

export function initCarousel() {
  document.querySelectorAll('.carousel-track:not([data-carousel-init]), .lifestyle-grid:not([data-carousel-init]), .category-grid:not([data-carousel-init]), .why-grid:not([data-carousel-init]), .testimonials-track:not([data-carousel-init])').forEach((track) => {
    track.dataset.carouselInit = 'true';
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
}

export function initContactTabs() {
  const tabs = document.querySelectorAll('.contact-tab');
  const panels = document.querySelectorAll('.contact-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
}

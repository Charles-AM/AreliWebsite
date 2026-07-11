let scrollObserver;

function revealIfInView(el) {
  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
  if (inView) {
    el.classList.add('visible');
    scrollObserver?.unobserve(el);
  }
}

export function initScrollAnimations() {
  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
  }

  document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .stagger-children').forEach((el) => {
    if (el.classList.contains('visible')) return;
    revealIfInView(el);
    if (!el.classList.contains('visible')) {
      scrollObserver.observe(el);
    }
  });
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

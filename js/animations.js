export function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .stagger-children').forEach((el) => {
    observer.observe(el);
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
  document.querySelectorAll('.collection-category, .scroll-row-wrap').forEach((section) => {
    const track = section.querySelector('.carousel-track, .scroll-row');
    if (!track) return;

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

export function initHeroParallax() {
  const hero = document.querySelector('.hero--editorial');
  const img = hero?.querySelector('.hero-image');
  if (!hero || !img) return;

  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0) {
      const offset = window.scrollY * 0.12;
      img.style.transform = `scale(1.06) translateY(${offset * 0.3}px)`;
    }
  }, { passive: true });
}

export function initCategoryPills() {
  const pills = document.querySelector('.category-pills');
  if (!pills) return;

  const links = pills.querySelectorAll('a');
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((s) => observer.observe(s));
}

export function revealImage(imgEl) {
  imgEl.classList.add('is-ready');
}

export function initLocalImage(imgEl, { src, fallback } = {}) {
  if (!imgEl) return;

  const primary = src || imgEl.getAttribute('src');
  const reserve = fallback || imgEl.dataset.fallback || '';

  const reveal = () => revealImage(imgEl);

  const applyFallback = () => {
    if (!reserve || imgEl.dataset.fallbackApplied === 'true') {
      reveal();
      return;
    }
    imgEl.dataset.fallbackApplied = 'true';
    imgEl.addEventListener('load', reveal, { once: true });
    imgEl.addEventListener('error', reveal, { once: true });
    imgEl.src = reserve;
  };

  imgEl.addEventListener('load', reveal, { once: true });
  imgEl.addEventListener('error', applyFallback, { once: true });

  if (primary && imgEl.getAttribute('src') !== primary) {
    imgEl.src = primary;
  }

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    reveal();
  }
}

export function bootCachedImages(selector = '.hero-image, .about-image') {
  document.querySelectorAll(selector).forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      revealImage(img);
    }
  });
}

export function initImageRestore(selector) {
  window.addEventListener('pageshow', (event) => {
    document.querySelectorAll(selector).forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        revealImage(img);
        return;
      }

      if (!event.persisted) return;

      const currentSrc = img.currentSrc || img.getAttribute('src');
      if (!currentSrc) return;

      img.removeAttribute('data-fallback-applied');
      img.addEventListener('load', () => revealImage(img), { once: true });
      img.addEventListener('error', () => revealImage(img), { once: true });
      img.src = currentSrc;
    });
  });
}

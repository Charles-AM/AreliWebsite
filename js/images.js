const MEDIA_SELECTOR = 'img, video, picture';

export function protectMediaElement(el) {
  if (!el || el.dataset.mediaProtected === 'true') return;
  el.dataset.mediaProtected = 'true';
  el.setAttribute('draggable', 'false');
}

export function initImageProtection() {
  document.querySelectorAll(MEDIA_SELECTOR).forEach(protectMediaElement);

  const blockSaveGesture = (event) => {
    if (event.target.closest(MEDIA_SELECTOR)) {
      event.preventDefault();
    }
  };

  document.addEventListener('contextmenu', blockSaveGesture);
  document.addEventListener('dragstart', blockSaveGesture);
  document.addEventListener('selectstart', blockSaveGesture);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.(MEDIA_SELECTOR)) protectMediaElement(node);
        node.querySelectorAll?.(MEDIA_SELECTOR).forEach(protectMediaElement);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export function revealImage(imgEl) {
  imgEl.classList.add('is-ready');
}

export function initLocalImage(imgEl, { src, fallback } = {}) {
  if (!imgEl) return;

  protectMediaElement(imgEl);

  const primary = src || imgEl.getAttribute('src');
  const reserve = fallback || imgEl.dataset.fallback || '';

  const reveal = () => revealImage(imgEl);

  const applyFallback = () => {
    if (!reserve || imgEl.dataset.fallbackApplied === 'true') {
      imgEl.classList.add('is-error');
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

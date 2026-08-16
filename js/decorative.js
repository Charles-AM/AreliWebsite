import { animate, stagger, svg, onScroll, createTimeline } from 'animejs';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Staggered card entrances for product/content grids, driven by Anime.js.
 * Runs independently of the GSAP fade-in system — these targets render
 * dynamically (product cards, testimonials) after data is injected, so each
 * grid is wired individually once its cards exist in the DOM.
 */
export function initGridStagger(selector) {
  document.querySelectorAll(selector).forEach((grid) => {
    if (grid.dataset.staggerInit) return;
    const cards = Array.from(grid.children);
    if (!cards.length) return;
    grid.dataset.staggerInit = 'true';

    if (REDUCED_MOTION) {
      cards.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none'; });
      return;
    }

    animate(cards, {
      opacity: [0, 1],
      translateY: [22, 0],
      scale: [0.96, 1],
      delay: stagger(60, { start: 80 }),
      duration: 550,
      ease: 'outQuart',
      autoplay: onScroll({
        target: grid,
        // Anime's threshold format is 'containerEdge targetEdge' (opposite
        // of GSAP's ScrollTrigger DSL) — this fires once the grid's top
        // crosses 90% down the viewport.
        enter: '90% start',
        repeat: false,
      }),
    });
  });
}

/** Draws the decorative ornamental line under a hero/page-hero eyebrow. */
export function initFlourishDraw() {
  const paths = document.querySelectorAll('.flourish-path');
  if (!paths.length) return;

  if (REDUCED_MOTION) {
    paths.forEach((p) => { p.style.opacity = 1; });
    return;
  }

  paths.forEach((path) => {
    const [drawable] = svg.createDrawable(path);
    if (!drawable) return;
    const tl = createTimeline({ defaults: { ease: 'inOutQuad' } })
      .add(drawable, {
        draw: ['0 0', '0 1'],
        opacity: [0, 1],
        duration: 900,
      });

    // Same backgrounded-tab safety net as the GSAP hero timeline.
    setTimeout(() => {
      if (tl.progress < 1) tl.complete();
    }, 1600);
  });
}

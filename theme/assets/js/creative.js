/**
 * ESHYN — Creative/experimental layer: custom cursor, scroll progress,
 * pointer-tilt cards, hero word-cycle, count-up stats, pinned horizontal
 * scroll section. Kept separate from interactions.js so the "signature"
 * effects can be audited/tuned independently of core UI plumbing.
 *
 * Every effect here follows the same rule established for the hero and
 * statement-section reveals: the page must be fully usable and correctly
 * laid out with this entire file absent. Nothing here is load-bearing.
 */

(function () {
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fineHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Custom cursor ---------------- */
  function initCustomCursor() {
    if (!fineHover() || reduceMotion()) return;
    const dot = document.querySelector('[data-cursor-dot]');
    const ring = document.querySelector('[data-cursor-ring]');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let active = false;

    document.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) {
        active = true;
        document.documentElement.classList.add('has-custom-cursor');
      }
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      document.documentElement.classList.remove('has-custom-cursor');
      active = false;
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    const hoverTargets = 'a, button, [data-tilt], input, textarea, .chip, .scent-card, .testimonial-deck__card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets) && !e.relatedTarget?.closest(hoverTargets)) {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    const fill = document.querySelector('[data-scroll-progress-fill]');
    if (!fill) return;
    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      fill.style.width = pct + '%';
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------------- Pointer-follow tilt ---------------- */
  function initTilt() {
    if (!fineHover() || reduceMotion()) return;
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      let raf = null;
      el.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(800px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateZ(0)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---------------- Word-cycle (hero headline, header subtitle, etc.) ---------------- */
  function initWordCycle() {
    document.querySelectorAll('[data-word-cycle]').forEach((el, idx) => {
      let words;
      try { words = JSON.parse(el.dataset.wordCycle); } catch (e) { return; }
      if (!Array.isArray(words) || words.length < 2) return;

      if (reduceMotion()) { el.textContent = words[0]; return; }

      let i = 0;
      el.textContent = words[0];
      el.style.display = 'inline-block';
      // Stagger each instance's interval start so multiple cyclers on the
      // page (hero + header, say) don't all swap in perfect lockstep.
      setTimeout(() => {
        setInterval(() => {
          i = (i + 1) % words.length;
          el.classList.add('is-swapping');
          setTimeout(() => {
            el.textContent = words[i];
            el.classList.remove('is-swapping');
          }, 260);
        }, 2600);
      }, idx * 400);
    });
  }

  /* ---------------- Count-up stats ---------------- */
  function initCountUp() {
    const items = document.querySelectorAll('[data-count-to]');
    if (!items.length) return;

    function animate(el) {
      const to = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.countSuffix || '';
      const prefix = el.dataset.countPrefix || '';
      if (reduceMotion() || !Number.isFinite(to)) {
        el.textContent = prefix + to + suffix;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach(animate);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    items.forEach((el) => io.observe(el));

    // Same safety principle as scroll-reveal: never leave a stat stuck at 0
    // because it never crossed the observer threshold.
    setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight && !el.dataset.counted) {
          animate(el);
        }
      });
    }, 2500);
  }

  /* ---------------- Pinned horizontal-scroll process strip ----------------
   * Base CSS (no JS assumption) is a plain horizontal scroll-snap strip —
   * fully usable by touch, wheel, or keyboard with zero script. JS only
   * upgrades it to a scroll-pinned "scrollytelling" panel on capable,
   * motion-ok, wide-enough viewports; on failure the safe fallback stands. */
  function initProcessScroll() {
    const section = document.querySelector('[data-process]');
    const track = document.querySelector('[data-process-track]');
    if (!section || !track) return;

    let pinned = false;

    function setPinHeight() {
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `calc(100dvh + ${travel}px)`;
    }

    let ticking = false;
    function update() {
      ticking = false;
      // Only the pinned (desktop) path drives the track via transform — on
      // the unpinned mobile/tablet fallback the track scrolls natively via
      // its own overflow-x, and this must never touch its transform, or a
      // stray translateX (from a rect/viewport ratio that no longer makes
      // sense once the section is un-pinned) can shove the whole track off
      // -screen as the page scrolls.
      if (!pinned) return;
      const rect = section.getBoundingClientRect();
      const travel = track.scrollWidth - window.innerWidth;
      if (travel <= 0) { track.style.transform = 'translateX(0)'; return; }
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
      track.style.transform = `translateX(${-progress * travel}px)`;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function evaluate() {
      const shouldPin = !reduceMotion() && window.innerWidth >= 768;
      if (shouldPin && !pinned) {
        pinned = true;
        section.classList.add('is-pinned');
        setPinHeight();
        update();
      } else if (!shouldPin && pinned) {
        pinned = false;
        section.classList.remove('is-pinned');
        section.style.height = '';
        track.style.transform = '';
      } else if (shouldPin && pinned) {
        setPinHeight();
        update();
      }
    }

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', evaluate);
  }

  /* ---------------- Scroll-spy activation for the "Why ESHYN" list ----------------
   * Hover already highlights an item with the mouse. This adds the same
   * highlighted state driven by scroll position, so on touch devices (or a
   * mouse that's simply not moving) whichever row is nearest the viewport
   * center reads as "selected" too — hover and scroll both lead to the same
   * .is-active state, they just have two different ways of setting it. */
  function initValuesScrollSpy() {
    const list = document.querySelector('.values-list');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('.values-list__item'));
    if (!items.length) return;

    let ticking = false;
    function update() {
      ticking = false;
      const viewportCenter = window.innerHeight / 2;
      let closest = null;
      let closestDist = Infinity;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - viewportCenter);
        if (dist < closestDist) { closestDist = dist; closest = item; }
      });

      items.forEach((item) => item.classList.toggle('is-active', item === closest));
      list.classList.toggle('has-active', !!closest);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------------- Mobile auto-scrolling product carousel ----------------
   * At desktop widths .product-rail becomes a static 4-up CSS grid (see
   * responsive.css) — this no-ops there via the display:grid check, so it
   * only ever drives the mobile flex/scroll-snap carousel. Pausing on any
   * touch/pointer/wheel interaction (and resuming after a quiet period)
   * means autoplay never fights a user who's actively swiping. */
  function initProductCarousels() {
    if (reduceMotion()) return;
    document.querySelectorAll('.product-rail').forEach((rail) => {
      let paused = false;
      let resumeTimer = null;

      function pause() {
        paused = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { paused = false; }, 5000);
      }

      function advance() {
        if (paused || getComputedStyle(rail).display === 'grid') return;
        const card = rail.querySelector('.product-card');
        if (!card) return;
        const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || '16');
        const step = card.getBoundingClientRect().width + gap;
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        const next = rail.scrollLeft + step;
        rail.scrollTo({ left: next >= maxScroll - 4 ? 0 : next, behavior: 'smooth' });
      }

      ['pointerdown', 'touchstart', 'wheel'].forEach((evt) => rail.addEventListener(evt, pause, { passive: true }));
      setInterval(advance, 3800);
    });
  }

  /* ---------------- Scent Anatomy: timeline ↔ card sync ----------------
   * Every card's full text is already visible in the base markup (see the
   * comment in sections.css) — this only layers a synced "is-active" state
   * across the timeline dot and its matching card on hover/click/focus, so
   * failure here just means the sync doesn't animate, never that content
   * goes missing. */
  function initScentAnatomy() {
    const timeline = document.querySelector('[data-scent-timeline]');
    const grid = document.querySelector('[data-scent-grid]');
    if (!timeline || !grid) return;
    const stops = Array.from(timeline.querySelectorAll('[data-scent-stop]'));
    const cards = Array.from(grid.querySelectorAll('[data-scent-card]'));
    if (!stops.length || !cards.length) return;

    function setActive(index) {
      stops.forEach((s) => s.classList.toggle('is-active', s.dataset.scentStop === String(index)));
      cards.forEach((c) => c.classList.toggle('is-active', c.dataset.scentCard === String(index)));
    }

    stops.forEach((stop) => stop.addEventListener('click', () => setActive(stop.dataset.scentStop)));
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => setActive(card.dataset.scentCard));
      card.addEventListener('click', () => setActive(card.dataset.scentCard));
    });
  }

  /* ---------------- Testimonial spotlight ↔ deck sync ----------------
   * The spotlight already shows one complete testimonial from the base
   * markup, and every deck card already shows its own name + quote preview
   * — so a JS failure here just freezes the "featured" one on Ananya's,
   * never removes anyone's content from the page. */
  function initTestimonialSpotlight() {
    const spotlight = document.querySelector('[data-testimonial-spotlight]');
    const deck = document.querySelector('[data-testimonial-deck]');
    if (!spotlight || !deck) return;
    const cards = Array.from(deck.querySelectorAll('[data-testimonial-switch]'));
    if (!cards.length) return;

    const starsEl = spotlight.querySelector('[data-testimonial-stars]');
    const textEl = spotlight.querySelector('[data-testimonial-text]');
    const avatarEl = spotlight.querySelector('[data-testimonial-avatar]');
    const nameEl = spotlight.querySelector('[data-testimonial-name]');
    const locEl = spotlight.querySelector('[data-testimonial-loc]');

    function apply(card) {
      cards.forEach((c) => c.classList.toggle('is-active', c === card));
      starsEl.textContent = card.dataset.stars;
      textEl.textContent = card.dataset.text;
      avatarEl.textContent = card.dataset.avatar;
      avatarEl.style.setProperty('--tint', card.dataset.tint);
      nameEl.textContent = card.dataset.name;
      locEl.textContent = card.dataset.loc;
    }

    function swapTo(card) {
      if (card.classList.contains('is-active')) return;
      if (reduceMotion()) { apply(card); return; }
      spotlight.classList.add('is-swapping');
      setTimeout(() => {
        apply(card);
        spotlight.classList.remove('is-swapping');
      }, 180);
    }

    cards.forEach((card) => card.addEventListener('click', () => swapTo(card)));
  }

  /* ---------------- Sliding nav indicator ----------------
   * One shared underline glides between nav items on hover instead of each
   * link drawing its own — reads as a single deliberate motion rather than
   * five independent hover states. */
  function initNavIndicator() {
    const list = document.querySelector('.main-nav__list');
    const indicator = document.querySelector('[data-nav-indicator]');
    if (!list || !indicator) return;
    const links = Array.from(list.querySelectorAll('.main-nav__link'));

    function moveTo(link) {
      const listRect = list.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      indicator.style.width = rect.width + 'px';
      indicator.style.transform = `translateX(${rect.left - listRect.left}px)`;
    }

    links.forEach((link) => link.addEventListener('mouseenter', () => moveTo(link)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollProgress();
    initTilt();
    initWordCycle();
    initCountUp();
    initProcessScroll();
    initValuesScrollSpy();
    initProductCarousels();
    initNavIndicator();
    initScentAnatomy();
    initTestimonialSpotlight();
  });
})();

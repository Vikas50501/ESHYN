/**
 * ESHYN — Sticky header, scroll reveal, rail arrows, announcement bar, accordions/tabs.
 */

(function () {
  function initHeroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hero.classList.add('js-anim-ready');
  }

  function initMaskReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-mask-reveal]').forEach((el) => el.classList.add('js-mask'));
  }

  function initParallax() {
    const items = Array.from(document.querySelectorAll('[data-parallax]'))
      .map((el) => ({ el, inner: el.querySelector('.ph') }))
      .filter((item) => item.inner);
    if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    function update() {
      ticking = false;
      const vh = window.innerHeight;
      items.forEach(({ el, inner }) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const shift = Math.max(-6, Math.min(6, progress * -6));
        inner.style.transform = `translateY(${shift}%)`;
      });
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

  function initStickyHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const isOverlay = header.classList.contains('site-header--overlay');
    const hero = document.querySelector('.hero');

    // Over a hero, the header should stay transparent until the hero has
    // mostly scrolled by — not flip solid after a few px of scroll.
    const threshold = () => (isOverlay && hero ? Math.max(hero.getBoundingClientRect().height - 80, 80) : 4);

    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > threshold());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  function initAnnouncementClose() {
    const bar = document.querySelector('[data-announcement-bar]');
    const closeBtn = document.querySelector('[data-announcement-close]');
    const header = document.querySelector('[data-site-header].site-header--overlay');
    if (!bar || !closeBtn) return;
    closeBtn.addEventListener('click', () => {
      bar.style.display = 'none';
      if (header) header.style.top = '0';
    });
  }

  function initScrollReveal() {
    // [data-mask-reveal] (the statement headline's line-mask animation) reuses
    // this exact reveal + safety-sweep machinery, so it can never get stuck
    // hidden the way a page-load-only animation could (see hero entrance fix).
    let items = Array.from(document.querySelectorAll('[data-reveal], [data-mask-reveal]'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    items.forEach((el) => io.observe(el));

    // Safety net: a very large/instant scroll (deep link, PageDown, automated
    // scroll) can move an element from "below viewport" to "above viewport"
    // between two rendered frames without ever reporting as intersecting,
    // which would leave it permanently invisible. Sweep on scroll/resize and
    // force-reveal anything already inside or past the viewport.
    let ticking = false;
    function sweep() {
      ticking = false;
      items = items.filter((el) => {
        if (el.classList.contains('is-revealed')) return false;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-revealed');
          io.unobserve(el);
          return false;
        }
        return true;
      });
      if (!items.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sweep();
  }

  function initRailArrows() {
    document.querySelectorAll('[data-rail-nav]').forEach((nav) => {
      const rail = document.querySelector(nav.dataset.railNav);
      if (!rail) return;
      nav.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dir = btn.dataset.dir === 'prev' ? -1 : 1;
          rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' });
        });
      });
    });
  }

  function initAccordions() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('is-open');
      if (item.closest('[data-accordion-single]')) {
        item.parentElement.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('is-open'));
      }
      item.classList.toggle('is-open', !wasOpen);
    });
  }

  function initTabs() {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.tabs__tab');
      if (!tab) return;
      const group = tab.closest('[data-tabs]');
      group.querySelectorAll('.tabs__tab').forEach((t) => t.classList.toggle('is-active', t === tab));
      group.querySelectorAll('.tabs__panel').forEach((p) => p.classList.toggle('is-active', p.dataset.tabPanel === tab.dataset.tab));
    });
  }

  function initNewsletterForm() {
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const toastEl = document.querySelector('[data-toast]');
        if (toastEl) {
          toastEl.textContent = "You're on the list — welcome to ESHYN.";
          toastEl.classList.add('is-visible');
          clearTimeout(toastEl._timer);
          toastEl._timer = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
        }
        form.reset();
      });
    });
  }

  function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.btn--magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance();
    initMaskReveal();
    initStickyHeader();
    initAnnouncementClose();
    initScrollReveal();
    initRailArrows();
    initAccordions();
    initTabs();
    initNewsletterForm();
    initMagneticButtons();
    initParallax();
  });
})();

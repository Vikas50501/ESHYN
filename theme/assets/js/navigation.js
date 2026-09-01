/**
 * ESHYN — Header navigation: mobile drawer, nested submenus, touch-friendly mega menu.
 */

(function () {
  function openMobileNav() {
    document.querySelector('[data-mobile-nav]').classList.add('is-open');
    document.querySelector('[data-scrim]').classList.add('is-visible');
    document.body.classList.add('no-scroll');
  }

  function closeMobileNav() {
    document.querySelector('[data-mobile-nav]').classList.remove('is-open');
    document.querySelector('[data-scrim]').classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-mobile-nav-open]')) { e.preventDefault(); openMobileNav(); }
      if (e.target.closest('[data-mobile-nav-close]')) closeMobileNav();
      if (e.target.matches('[data-scrim]') && document.querySelector('[data-mobile-nav]').classList.contains('is-open')) closeMobileNav();

      const subToggle = e.target.closest('[data-mobile-sub-toggle]');
      if (subToggle) {
        e.preventDefault();
        subToggle.closest('.mobile-nav__item').classList.toggle('is-open');
      }

      // Touch devices: tap once to reveal mega menu, tap link/again to follow through.
      const navLink = e.target.closest('.main-nav__link');
      if (navLink && window.matchMedia('(hover: none)').matches) {
        const item = navLink.closest('.main-nav__item');
        const hasMega = item.querySelector('.mega-menu');
        if (hasMega && !item.classList.contains('is-open')) {
          e.preventDefault();
          document.querySelectorAll('.main-nav__item.is-open').forEach((i) => i.classList.remove('is-open'));
          item.classList.add('is-open');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('[data-mobile-nav]').classList.contains('is-open')) closeMobileNav();
    });
  });
})();

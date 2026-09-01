/**
 * ESHYN — Wishlist (provider-agnostic; localStorage stand-in for a
 * future Shopify customer metafield / wishlist app integration).
 */

(function () {
  const STORAGE_KEY = 'eshyn_wishlist';
  let ids = [];

  function load() {
    try {
      ids = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      ids = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function isWishlisted(productId) {
    return ids.includes(productId);
  }

  function toggle(productId) {
    if (isWishlisted(productId)) {
      ids = ids.filter((id) => id !== productId);
    } else {
      ids.push(productId);
    }
    save();
    syncButtons();
    updateCount();
    return isWishlisted(productId);
  }

  function syncButtons() {
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const active = isWishlisted(btn.dataset.productId);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function updateCount() {
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      el.textContent = ids.length;
      el.hidden = ids.length === 0;
    });
  }

  window.esIsWishlisted = isWishlisted;

  document.addEventListener('DOMContentLoaded', () => {
    load();
    syncButtons();
    updateCount();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wishlist-toggle]');
      if (!btn) return;
      e.preventDefault();
      const active = toggle(btn.dataset.productId);
      const product = window.esGetProduct(btn.dataset.productId);
      if (product) {
        const toastEl = document.querySelector('[data-toast]');
        if (toastEl) {
          toastEl.textContent = active ? `${product.title} added to wishlist` : `${product.title} removed from wishlist`;
          toastEl.classList.add('is-visible');
          clearTimeout(toastEl._timer);
          toastEl._timer = setTimeout(() => toastEl.classList.remove('is-visible'), 2000);
        }
      }
    });
  });
})();

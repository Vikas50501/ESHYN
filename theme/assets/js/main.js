/**
 * ESHYN — Entry point: wires product data into homepage rails and
 * handles small page-glue that doesn't belong in a dedicated module.
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (window.esRenderProductGrid) {
      window.esRenderProductGrid('[data-grid="bestsellers"]', [
        'p-mitti-attar', 'p-discovery-set', 'p-sandalwood-attar', 'p-black-musk'
      ]);
      window.esRenderProductGrid('[data-grid="new-arrivals"]', [
        'p-champa-muse', 'p-forest-rush', 'p-dahn-al-oud', 'p-gulab-attar'
      ]);
    }
  });
})();

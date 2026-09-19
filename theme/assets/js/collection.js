/**
 * ESHYN — Collection listing page.
 * Reads ?handle= from the URL (mirroring a Shopify collection route),
 * filters window.PRODUCTS by that handle, and renders them into the
 * shared product-card grid — same component the homepage rails use.
 */

(function () {
  const COLLECTIONS = {
    all: { title: 'All Fragrances', desc: 'The complete ESHYN range — attars, eau de parfum, and gifting, all handcrafted in Kannauj.' },
    attars: { title: 'Attars', desc: 'Alcohol-free, oil-based attars distilled the traditional deg-bhapka way.' },
    'eau-de-parfum': { title: 'Eau de Parfum', desc: 'Modern, alcohol-free eau de parfum with the same botanical intensity as our attars.' },
    gifting: { title: 'Gifting & Sets', desc: 'Discovery sets and gifting edits for someone — or yourself — to fall in love with attars.' },
    bestsellers: { title: 'Bestsellers', desc: 'The ESHYN fragrances our customers keep reordering.' },
    'new-arrivals': { title: 'New Arrivals', desc: 'This season’s latest additions to the ESHYN line.' }
  };

  function getHandle() {
    const params = new URLSearchParams(window.location.search);
    const handle = params.get('handle');
    return COLLECTIONS[handle] ? handle : 'all';
  }

  function getProductsForHandle(handle) {
    const all = window.PRODUCTS || [];
    if (handle === 'all') return all.slice();
    return all.filter((p) => p.collections.includes(handle));
  }

  function sortProducts(products, sort) {
    const sorted = products.slice();
    if (sort === 'price-asc') sorted.sort((a, b) => a.variants[0].price - b.variants[0].price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.variants[0].price - a.variants[0].price);
    else if (sort === 'newest') sorted.reverse();
    return sorted;
  }

  function render() {
    const handle = getHandle();
    const meta = COLLECTIONS[handle];

    document.querySelectorAll('[data-collection-title]').forEach((el) => { el.textContent = meta.title; });
    document.querySelectorAll('[data-collection-desc]').forEach((el) => { el.textContent = meta.desc; });
    document.querySelectorAll('[data-collection-crumb]').forEach((el) => { el.textContent = meta.title; });
    document.querySelectorAll('[data-collection-doctitle]').forEach((el) => { el.textContent = meta.title + ' — ESHYN'; });

    document.querySelectorAll('[data-collection-filter]').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.collectionFilter === handle);
    });

    const sortSelect = document.querySelector('[data-collection-sort]');
    const sort = sortSelect ? sortSelect.value : 'featured';
    const products = sortProducts(getProductsForHandle(handle), sort);

    const countEl = document.querySelector('[data-collection-count]');
    if (countEl) countEl.textContent = products.length + (products.length === 1 ? ' product' : ' products');

    if (window.esRenderProductGrid) {
      window.esRenderProductGrid('[data-collection-grid]', products.map((p) => p.id));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    const sortSelect = document.querySelector('[data-collection-sort]');
    if (sortSelect) sortSelect.addEventListener('change', render);
  });
})();

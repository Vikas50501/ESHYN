/**
 * ESHYN — Predictive search overlay.
 * Filters window.PRODUCTS client-side; on Shopify this calls
 * /search/suggest.json instead of scanning an in-memory array.
 */

(function () {
  const COLLECTIONS = [
    { title: 'Authentic Indian Attars', handle: 'attars' },
    { title: 'Eau de Parfum', handle: 'eau-de-parfum' },
    { title: 'Gifting', handle: 'gifting' }
  ];

  function openSearch() {
    const overlay = document.querySelector('[data-search-overlay]');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    setTimeout(() => overlay.querySelector('input').focus(), 50);
  }

  function closeSearch() {
    const overlay = document.querySelector('[data-search-overlay]');
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function runSearch(query) {
    const resultsEl = document.querySelector('[data-search-results]');
    const resultsWrap = document.querySelector('[data-search-results-wrap]');
    const suggestWrap = document.querySelector('[data-search-suggest-wrap]');

    if (!query.trim()) {
      resultsWrap.hidden = true;
      suggestWrap.hidden = false;
      return;
    }

    const q = query.trim().toLowerCase();
    const products = window.PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
    ).slice(0, 6);

    suggestWrap.hidden = true;
    resultsWrap.hidden = false;

    if (!products.length) {
      resultsEl.innerHTML = `<div class="empty-state"><p>No results for "${query}". Try "attar", "oud" or "musk".</p></div>`;
      return;
    }

    resultsEl.innerHTML = products.map((p) => {
      const range = window.esProductPriceRange(p);
      const priceText = range.min === range.max ? window.esFormatPrice(range.min, 'INR') : `From ${window.esFormatPrice(range.min, 'INR')}`;
      const icon = p.type === 'Gift Set' ? 'gift' : 'bottle';
      return `
        <a class="search-result" href="/products/${p.handle}">
          <span style="display:block;width:4rem;height:5rem;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0">${window.esPlaceholder(p.media[0], p.title, icon)}</span>
          <span>
            <span class="search-result__title">${p.title}</span>
            <span class="search-result__price price">${priceText}</span>
          </span>
        </a>
      `;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('[data-search-overlay]');
    if (!overlay) return;

    const collectionsEl = overlay.querySelector('[data-search-collections]');
    if (collectionsEl) {
      collectionsEl.innerHTML = COLLECTIONS.map((c) => `<a class="chip" href="/collections/${c.handle}">${c.title}</a>`).join('');
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-search-open]')) { e.preventDefault(); openSearch(); }
      if (e.target.closest('[data-search-close]')) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearch();
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !overlay.classList.contains('is-open') && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        openSearch();
      }
    });

    const input = overlay.querySelector('input[type="search"]');
    input.addEventListener('input', (e) => runSearch(e.target.value));
  });
})();

/**
 * ESHYN — Product detail page.
 * Reads ?handle= from the URL, looks the product up in window.PRODUCTS,
 * and fills in the gallery/info/accordion/related-products markup.
 * Mirrors the quick-add modal's option/qty/stock logic (product.js) but
 * uses its own data-pdp-* attributes throughout — the quick-add modal's
 * click handlers key off [data-qty-increase]/[data-qa-option] globally,
 * so reusing those exact attributes here would make clicking this page's
 * own controls silently mutate the (hidden) quick-add modal instead.
 */

(function () {
  const BADGE_LABELS = { new: 'New', sale: 'Sale', bestseller: 'Bestseller', limited: 'Limited Edition' };

  const pdp = { product: null, selected: {} };

  function getHandle() {
    const params = new URLSearchParams(window.location.search);
    return params.get('handle') || 'mitti-attar';
  }

  function selectedVariant() {
    const p = pdp.product;
    if (!p) return null;
    if (!p.options.length) return p.variants[0];
    return p.variants.find((v) => p.options.every((opt) => v.options[opt.name] === pdp.selected[opt.name]));
  }

  function renderGallery() {
    const p = pdp.product;
    const mainEl = document.querySelector('[data-pdp-gallery-main]');
    const thumbsEl = document.querySelector('[data-pdp-gallery-thumbs]');
    const icon = p.type === 'Gift Set' ? 'gift' : 'bottle';

    function show(tone) {
      mainEl.innerHTML = window.esPlaceholder(tone, p.title, icon);
      thumbsEl.querySelectorAll('.product-gallery__thumb').forEach((t) => t.classList.toggle('is-active', t.dataset.tone === tone));
    }

    thumbsEl.innerHTML = p.media
      .map((tone, i) => `<button type="button" class="product-gallery__thumb${i === 0 ? ' is-active' : ''}" data-tone="${tone}">${window.esPlaceholder(tone, '', icon)}</button>`)
      .join('');
    thumbsEl.querySelectorAll('.product-gallery__thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => show(thumb.dataset.tone));
    });
    show(p.media[0]);
  }

  function renderOptions() {
    const p = pdp.product;
    const wrap = document.querySelector('[data-pdp-options]');
    if (!p.options.length) { wrap.innerHTML = ''; return; }

    wrap.innerHTML = p.options
      .map((opt) => {
        const selectedVal = pdp.selected[opt.name];
        const pills = opt.values
          .map((val) => {
            const testSel = { ...pdp.selected, [opt.name]: val };
            const match = p.variants.find((v) => Object.keys(testSel).every((k) => v.options[k] === testSel[k]));
            const disabled = !match || !match.available;
            const isSel = selectedVal === val;
            return `<button type="button" class="option-pill${isSel ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}" data-pdp-option="${opt.name}" data-pdp-value="${val}" ${disabled ? 'aria-disabled="true"' : ''}>${val}</button>`;
          })
          .join('');
        return `
          <div class="option-group">
            <div class="option-group__label"><span>${opt.name}</span> <span class="option-value-selected">${selectedVal || ''}</span></div>
            <div class="option-list">${pills}</div>
          </div>
        `;
      })
      .join('');

    wrap.querySelectorAll('[data-pdp-option]').forEach((pill) => {
      pill.addEventListener('click', () => {
        if (pill.classList.contains('is-disabled')) return;
        pdp.selected[pill.dataset.pdpOption] = pill.dataset.pdpValue;
        renderOptions();
        renderPriceAndStock();
      });
    });
  }

  function renderPriceAndStock() {
    const p = pdp.product;
    const variant = selectedVariant();
    const priceEl = document.querySelector('[data-pdp-price]');
    const stockEl = document.querySelector('[data-pdp-stock]');
    const addBtn = document.querySelector('[data-pdp-add]');
    const currency = p.pricing.currency;

    if (!variant) {
      priceEl.innerHTML = '';
      stockEl.innerHTML = `<span class="stock-message stock-message--out">Select options</span>`;
      addBtn.setAttribute('disabled', 'true');
      return;
    }

    priceEl.innerHTML = `<span class="price-current">${window.esFormatPrice(variant.price, currency)}</span>` +
      (variant.compareAtPrice ? `<span class="price-compare">${window.esFormatPrice(variant.compareAtPrice, currency)}</span>` : '');

    if (!variant.available) {
      stockEl.innerHTML = `<span class="stock-message stock-message--out">Out of Stock</span>`;
      addBtn.setAttribute('disabled', 'true');
    } else if (variant.inventory <= 5) {
      stockEl.innerHTML = `<span class="stock-message stock-message--low">Only ${variant.inventory} left</span>`;
      addBtn.removeAttribute('disabled');
    } else {
      stockEl.innerHTML = `<span class="stock-message stock-message--in">In Stock</span>`;
      addBtn.removeAttribute('disabled');
    }
  }

  function renderRelated() {
    const p = pdp.product;
    const all = window.PRODUCTS || [];
    const related = all
      .filter((other) => other.id !== p.id && (other.type === p.type || other.collections.some((c) => p.collections.includes(c))))
      .slice(0, 4);
    const ids = (related.length ? related : all.filter((o) => o.id !== p.id)).slice(0, 4).map((o) => o.id);
    if (window.esRenderProductGrid) window.esRenderProductGrid('[data-pdp-related]', ids);
  }

  function render() {
    const product = window.esGetProduct(getHandle()) || (window.PRODUCTS || [])[0];
    if (!product) return;
    pdp.product = product;
    pdp.selected = {};
    product.options.forEach((opt) => {
      const firstAvailable = opt.values.find((val) => {
        const test = { ...pdp.selected, [opt.name]: val };
        return product.variants.some((v) => v.available && Object.keys(test).every((k) => v.options[k] === test[k]));
      });
      pdp.selected[opt.name] = firstAvailable || opt.values[0];
    });

    document.querySelectorAll('[data-pdp-title]').forEach((el) => { el.textContent = product.title; });
    document.querySelectorAll('[data-pdp-doctitle]').forEach((el) => { el.textContent = product.title + ' — ESHYN'; });
    document.querySelectorAll('[data-pdp-og-title]').forEach((el) => { el.setAttribute('content', product.title + ' — ESHYN'); });
    document.querySelector('[data-pdp-vendor]').textContent = product.vendor;
    document.querySelector('[data-pdp-desc]').textContent = product.shortDescription;
    const accordionDesc = document.querySelector('[data-pdp-accordion-desc]');
    if (accordionDesc) accordionDesc.textContent = product.shortDescription;

    const stars = Math.round(product.rating.value);
    document.querySelector('[data-pdp-stars]').textContent = '★★★★★'.slice(0, stars) + '☆☆☆☆☆'.slice(0, 5 - stars);
    document.querySelector('[data-pdp-rating-count]').textContent = `${product.rating.value} (${product.rating.count} reviews)`;

    const soldOut = !product.variants.some((v) => v.available);
    const badges = [...product.badges];
    if (soldOut) badges.unshift('soldout');
    document.querySelector('[data-pdp-badges]').innerHTML = badges
      .map((b) => b === 'soldout' ? `<span class="badge badge--soldout">Sold Out</span>` : `<span class="badge badge--${b}">${BADGE_LABELS[b] || b}</span>`)
      .join('');

    const wishlistBtn = document.querySelector('[data-pdp-wishlist]');
    wishlistBtn.dataset.productId = product.id;
    const wishlisted = window.esIsWishlisted ? window.esIsWishlisted(product.id) : false;
    wishlistBtn.classList.toggle('is-active', wishlisted);
    wishlistBtn.setAttribute('aria-pressed', wishlisted);

    renderGallery();
    renderOptions();
    renderPriceAndStock();
    renderRelated();
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();

    document.querySelector('[data-pdp-qty-decrease]').addEventListener('click', () => {
      const input = document.querySelector('[data-pdp-qty-input]');
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    document.querySelector('[data-pdp-qty-increase]').addEventListener('click', () => {
      const input = document.querySelector('[data-pdp-qty-input]');
      const variant = selectedVariant();
      const max = variant ? (variant.inventory || 99) : 99;
      input.value = Math.min(max, (parseInt(input.value, 10) || 1) + 1);
    });
    document.querySelector('[data-pdp-add]').addEventListener('click', () => {
      const variant = selectedVariant();
      if (!variant || !variant.available) return;
      const qty = parseInt(document.querySelector('[data-pdp-qty-input]').value, 10) || 1;
      window.esAddToCart(pdp.product, variant, qty);
      window.esOpenCart && window.esOpenCart();
    });
  });
})();

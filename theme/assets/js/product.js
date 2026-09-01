/**
 * ESHYN — Product card rendering + quick add.
 * Reads from window.PRODUCTS (assets/js/product-data.js).
 */

(function () {
  const BADGE_LABELS = {
    new: 'New',
    sale: 'Sale',
    bestseller: 'Bestseller',
    limited: 'Limited Edition'
  };

  function starsMarkup(value) {
    const full = Math.round(value);
    let out = '';
    for (let i = 0; i < 5; i++) {
      out += `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="${i < full ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.2" d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.8l-5.3 2.8 1.1-5.9L1.5 7.6l5.9-.7z"/></svg>`;
    }
    return out;
  }

  function renderProductCard(product, opts) {
    opts = opts || {};
    const variant = product.variants[0];
    const range = window.esProductPriceRange(product);
    const hasRange = product.variants.length > 1 && range.min !== range.max;
    const currency = product.pricing.currency;
    const compareAt = variant.compareAtPrice;
    const discount = compareAt ? Math.round((1 - variant.price / compareAt) * 100) : null;
    const soldOut = !product.variants.some((v) => v.available);
    const badges = [...product.badges];
    if (soldOut) badges.unshift('soldout');

    const badgeHtml = badges
      .map((b) => {
        if (b === 'soldout') return `<span class="badge badge--soldout">Sold Out</span>`;
        return `<span class="badge badge--${b}">${BADGE_LABELS[b] || b}</span>`;
      })
      .join('');

    const priceHtml = hasRange
      ? `<span class="price-current">From ${window.esFormatPrice(range.min, currency)}</span>`
      : `<span class="price-current">${window.esFormatPrice(variant.price, currency)}</span>` +
        (compareAt ? `<span class="price-compare">${window.esFormatPrice(compareAt, currency)}</span>` : '');

    // The discount now lives on the image as a sticker (see .product-card__sticker)
    // rather than repeated as text next to the price — one clear signal, not two.
    // Never advertise a discount on stock that isn't actually purchasable.
    const stickerHtml = !hasRange && !soldOut && discount
      ? `<div class="product-card__sticker"><strong>-${discount}%</strong><span>Off</span></div>`
      : '';

    const ratingHtml = product.rating && product.rating.count
      ? `<div class="rating"><span class="rating__stars">${starsMarkup(product.rating.value)}</span><span class="rating__count">${product.rating.value} (${product.rating.count})</span></div>`
      : '';

    const hoverTone = product.media[1] || product.media[0];
    const icon = product.type === 'Gift Set' ? 'gift' : 'bottle';
    const wishlisted = window.esIsWishlisted ? window.esIsWishlisted(product.id) : false;

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card__media shine" data-tilt>
          <div class="product-card__img--base">${window.esPlaceholder(product.media[0], product.title + ' — ' + product.type, icon)}</div>
          <div class="product-card__img--hover">${window.esPlaceholder(hoverTone, '', icon)}</div>
          ${badgeHtml ? `<div class="product-card__badges">${badgeHtml}</div>` : ''}
          <button class="product-card__wishlist${wishlisted ? ' is-active' : ''}" type="button" data-wishlist-toggle data-product-id="${product.id}" aria-pressed="${wishlisted}" aria-label="Add ${product.title} to wishlist">
            <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.7-10-9.4C.4 7.7 2 4 5.6 4c2.2 0 3.7 1.3 4.4 2.6C10.7 5.3 12.2 4 14.4 4 18 4 19.6 7.7 18 11.1c-2.5 4.7-10 9.4-10 9.4z"/></svg>
          </button>
          ${stickerHtml}
          ${!soldOut ? `
          <div class="product-card__quickadd">
            <button class="product-card__quickadd-btn" type="button" data-quickadd-open data-product-id="${product.id}" aria-label="Quick add ${product.title} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
              <span>Quick Add</span>
            </button>
          </div>` : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__brand">${product.vendor}</span>
          <h3 class="product-card__title"><a href="/products/${product.handle}">${product.title}</a></h3>
          ${ratingHtml}
          <div class="product-card__price price">${priceHtml}</div>
        </div>
      </article>
    `;
  }

  function renderProductGrid(selector, productIds) {
    const el = document.querySelector(selector);
    if (!el) return;
    const products = productIds.map((id) => window.esGetProduct(id)).filter(Boolean);
    if (!products.length) {
      el.innerHTML = `<div class="empty-state"><p>No products to show yet — check back soon.</p></div>`;
      return;
    }
    el.innerHTML = products.map((p) => renderProductCard(p)).join('');
  }

  window.esRenderProductGrid = renderProductGrid;
  window.esRenderProductCard = renderProductCard;

  /* ---------------- Quick Add ---------------- */

  const quickAdd = {
    root: null,
    state: { product: null, selected: {} }
  };

  function qaSelectedVariant() {
    const p = quickAdd.state.product;
    if (!p) return null;
    if (!p.options.length) return p.variants[0];
    return p.variants.find((v) =>
      p.options.every((opt) => v.options[opt.name] === quickAdd.state.selected[opt.name])
    );
  }

  function qaRenderOptions() {
    const p = quickAdd.state.product;
    const wrap = quickAdd.root.querySelector('[data-quickadd-options]');
    if (!p.options.length) { wrap.innerHTML = ''; return; }

    wrap.innerHTML = p.options
      .map((opt) => {
        const selectedVal = quickAdd.state.selected[opt.name];
        const pills = opt.values
          .map((val) => {
            const testSel = { ...quickAdd.state.selected, [opt.name]: val };
            const match = p.variants.find((v) => Object.keys(testSel).every((k) => v.options[k] === testSel[k]));
            const disabled = !match || !match.available;
            const isSel = selectedVal === val;
            return `<button type="button" class="option-pill${isSel ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}" data-qa-option="${opt.name}" data-qa-value="${val}" ${disabled ? 'aria-disabled="true"' : ''}>${val}</button>`;
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
  }

  function qaRenderPriceAndStock() {
    const variant = qaSelectedVariant();
    const priceEl = quickAdd.root.querySelector('[data-qa-price]');
    const stockEl = quickAdd.root.querySelector('[data-qa-stock]');
    const addBtn = quickAdd.root.querySelector('[data-qa-add]');
    const currency = quickAdd.state.product.pricing.currency;

    if (!variant) {
      priceEl.innerHTML = '';
      stockEl.innerHTML = `<span class="stock-message stock-message--out">Select options</span>`;
      addBtn.setAttribute('aria-disabled', 'true');
      return;
    }

    priceEl.innerHTML = `<span class="price-current">${window.esFormatPrice(variant.price, currency)}</span>` +
      (variant.compareAtPrice ? `<span class="price-compare">${window.esFormatPrice(variant.compareAtPrice, currency)}</span>` : '');

    if (!variant.available) {
      stockEl.innerHTML = `<span class="stock-message stock-message--out">Out of Stock</span>`;
      addBtn.setAttribute('aria-disabled', 'true');
    } else if (variant.inventory <= 5) {
      stockEl.innerHTML = `<span class="stock-message stock-message--low">Only ${variant.inventory} left</span>`;
      addBtn.removeAttribute('aria-disabled');
    } else {
      stockEl.innerHTML = `<span class="stock-message stock-message--in">In Stock</span>`;
      addBtn.removeAttribute('aria-disabled');
    }
  }

  function openQuickAdd(productId) {
    const product = window.esGetProduct(productId);
    if (!product) return;
    quickAdd.state.product = product;
    quickAdd.state.selected = {};
    product.options.forEach((opt) => {
      const firstAvailable = opt.values.find((val) => {
        const test = { ...quickAdd.state.selected, [opt.name]: val };
        return product.variants.some((v) => v.available && Object.keys(test).every((k) => v.options[k] === test[k]));
      });
      quickAdd.state.selected[opt.name] = firstAvailable || opt.values[0];
    });

    const icon = product.type === 'Gift Set' ? 'gift' : 'bottle';
    quickAdd.root.querySelector('[data-qa-image]').innerHTML = window.esPlaceholder(product.media[0], product.title, icon);
    quickAdd.root.querySelector('[data-qa-title]').textContent = product.title;
    quickAdd.root.querySelector('[data-qa-title]').setAttribute('href', `/products/${product.handle}`);

    qaRenderOptions();
    qaRenderPriceAndStock();
    quickAdd.root.querySelector('[data-qty-input]').value = 1;

    document.querySelector('[data-scrim]').classList.add('is-visible');
    quickAdd.root.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeQuickAdd() {
    quickAdd.root.classList.remove('is-open');
    document.querySelector('[data-scrim]').classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('DOMContentLoaded', () => {
    quickAdd.root = document.querySelector('[data-quickadd]');
    if (!quickAdd.root) return;

    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-quickadd-open]');
      if (opener) {
        e.preventDefault();
        openQuickAdd(opener.dataset.productId);
        return;
      }
      if (e.target.closest('[data-quickadd-close]') || (e.target.matches('[data-scrim]') && quickAdd.root.classList.contains('is-open'))) {
        closeQuickAdd();
        return;
      }
      const pill = e.target.closest('[data-qa-option]');
      if (pill && !pill.classList.contains('is-disabled')) {
        quickAdd.state.selected[pill.dataset.qaOption] = pill.dataset.qaValue;
        qaRenderOptions();
        qaRenderPriceAndStock();
      }

      if (e.target.closest('[data-qty-decrease]') || e.target.closest('[data-qty-increase]')) {
        const input = quickAdd.root.querySelector('[data-qty-input]');
        const variant = qaSelectedVariant();
        const max = variant ? (variant.inventory || 99) : 99;
        let val = parseInt(input.value, 10) || 1;
        val += e.target.closest('[data-qty-increase]') ? 1 : -1;
        input.value = Math.max(1, Math.min(val, max));
      }
    });

    quickAdd.root.querySelector('[data-qa-add]').addEventListener('click', () => {
      const variant = qaSelectedVariant();
      if (!variant || !variant.available) return;
      const qty = parseInt(quickAdd.root.querySelector('[data-qty-input]').value, 10) || 1;
      window.esAddToCart(quickAdd.state.product, variant, qty);
      closeQuickAdd();
      window.esOpenCart && window.esOpenCart();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && quickAdd.root.classList.contains('is-open')) closeQuickAdd();
    });
  });
})();

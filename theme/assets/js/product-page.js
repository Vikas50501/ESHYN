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
  const LONGEVITY_LABELS = ['', '1-2 Hours', '2-3 Hours', '3-4 Hours', '4-5 Hours', '5-6 Hours', '6-8 Hours', '6-8 Hours', '8+ Hours', '8+ Hours', 'All Day'];

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
    const addBtn = document.querySelector('[data-pdp-add]');
    const buyNowBtn = document.querySelector('[data-pdp-buy-now]');
    const currency = p.pricing.currency;

    if (!variant) {
      priceEl.innerHTML = '';
      addBtn.setAttribute('disabled', 'true');
      buyNowBtn.setAttribute('disabled', 'true');
      renderStickyBar();
      return;
    }

    priceEl.innerHTML = `<span class="price-current">${window.esFormatPrice(variant.price, currency)}</span>` +
      (variant.compareAtPrice ? `<span class="price-compare">${window.esFormatPrice(variant.compareAtPrice, currency)}</span>` : '');

    if (!variant.available) {
      addBtn.setAttribute('disabled', 'true');
      buyNowBtn.setAttribute('disabled', 'true');
    } else {
      addBtn.removeAttribute('disabled');
      buyNowBtn.removeAttribute('disabled');
    }

    renderStickyBar();
  }

  /* Fixed brand-wide claims, except longevity which pulls the product's
     own value — compact checkmark pills rather than a divided icon strip. */
  function renderTrustPills() {
    const wrap = document.querySelector('[data-pdp-trust-pills]');
    if (!wrap) return;
    const scent = pdp.product.scent;
    const longevityLabel = scent ? (LONGEVITY_LABELS[scent.longevity] || `${scent.longevity}+ Hours`) : '8+ Hours';
    const items = ['Alcohol-Free', 'Skin-Friendly', 'Deg-Bhapka Distilled', `${longevityLabel} Longevity`, 'Cruelty-Free'];
    const check = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5l3.5 3.5L16 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    wrap.innerHTML = items.map((label) => `<span class="trust-pills__item">${check}${label}</span>`).join('');
  }

  /* Notes as circular swatches (tinted by top/heart/base tier), visible
     in the purchase column — same underlying scent data that used to sit
     inside an accordion, now surfaced since notes drive the purchase
     decision for a fragrance. */
  const NOTE_TIER_META = {
    top: { label: 'top', tint: 'var(--color-success)', icon: '<path d="M10 3v4M10 13v4M3 10h4M13 10h4" stroke-linecap="round"/>' },
    heart: { label: 'heart', tint: 'var(--color-primary)', icon: '<path d="M10 17s-6-3.6-6-8a4 4 0 018-.4A4 4 0 0116 9c0 4.4-6 8-6 8z"/>' },
    base: { label: 'base', tint: 'var(--color-secondary)', icon: '<path d="M4 10h12M10 4v12" stroke-linecap="round"/>' }
  };
  function renderNotesStrip() {
    const wrap = document.querySelector('[data-pdp-notes-row]');
    if (!wrap) return;
    const scent = pdp.product.scent;
    const strip = wrap.closest('.notes-strip');
    if (!scent || !scent.notes) { if (strip) strip.style.display = 'none'; return; }
    if (strip) strip.style.display = '';

    const images = scent.noteImages || {};
    wrap.innerHTML = ['top', 'heart', 'base']
      .flatMap((tier) => scent.notes[tier].map((name) => ({ name, tier })))
      .map(({ name, tier }) => {
        const meta = NOTE_TIER_META[tier];
        const tone = images[name];
        // A note with an assigned tone gets a photographic swatch (the
        // shared placeholder-photo system, standing in for real ingredient
        // photography); otherwise it falls back to the tinted icon so
        // every note still renders even before an image is curated for it.
        const swatch = tone
          ? `<span class="notes-strip__swatch notes-strip__swatch--photo">${window.esPlaceholder(tone, name)}</span>`
          : `<span class="notes-strip__swatch" style="--tint:${meta.tint}"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4">${meta.icon}</svg></span>`;
        return `
          <div class="notes-strip__note">
            ${swatch}
            <span class="notes-strip__name">${name}</span>
            <span class="notes-strip__tier">${meta.label}</span>
          </div>
        `;
      })
      .join('');
  }

  function renderFragranceMeta() {
    const scent = pdp.product.scent;
    if (!scent) return;

    const longevityEl = document.querySelector('[data-pdp-longevity-value]');
    if (longevityEl) longevityEl.textContent = LONGEVITY_LABELS[scent.longevity] || `${scent.longevity}+ Hours`;

    const projectionEl = document.querySelector('[data-pdp-projection-value]');
    if (projectionEl) projectionEl.textContent = scent.projection;

    const familyEl = document.querySelector('[data-pdp-family]');
    if (familyEl) familyEl.textContent = scent.family;
  }

  /* Truthful, per-product answer for the one FAQ item that depends on this
     product's own scent data rather than fixed brand copy. */
  function renderFaq() {
    const scent = pdp.product.scent;
    if (!scent) return;

    const longevityEl = document.querySelector('[data-pdp-faq-longevity]');
    if (longevityEl) {
      const label = (LONGEVITY_LABELS[scent.longevity] || `${scent.longevity}+ Hours`).toLowerCase();
      longevityEl.textContent = `${pdp.product.title} lasts around ${label} on skin, with ${scent.projection.toLowerCase()} sillage as it develops through the day.`;
    }
  }

  function renderReviews() {
    const product = pdp.product;
    const scent = product.scent;
    const reviews = (scent && scent.reviews) || [];
    const stars = Math.round(product.rating.value);
    const starStr = '★★★★★'.slice(0, stars) + '☆☆☆☆☆'.slice(0, 5 - stars);

    const valueEl = document.querySelector('[data-pdp-rating-value]');
    const starsEl = document.querySelector('[data-pdp-review-stars]');
    const countEl = document.querySelector('[data-pdp-review-count]');
    if (valueEl) valueEl.textContent = product.rating.value;
    if (starsEl) starsEl.textContent = starStr;
    if (countEl) countEl.textContent = `Based on ${product.rating.count} verified reviews`;

    const grid = document.querySelector('[data-pdp-reviews]');
    if (!grid) return;
    grid.innerHTML = reviews
      .map((r) => {
        const rStars = '★★★★★'.slice(0, r.rating) + '☆☆☆☆☆'.slice(0, 5 - r.rating);
        return `
          <article class="review-card">
            <span class="rating__stars">${rStars}</span>
            <p>"${r.text}"</p>
            <div class="review-card__meta">
              <span>${r.name}, ${r.location}</span>
              <span>·</span>
              <svg viewBox="0 0 20 20"><path fill="currentColor" d="M8 12.5l-3-3 1.4-1.4L8 9.7l5.6-5.6L15 5.5z"/></svg>
              <span>Verified Purchase</span>
            </div>
          </article>
        `;
      })
      .join('');
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
    const categoryEl = document.querySelector('[data-pdp-category]');
    if (categoryEl) categoryEl.textContent = product.type;
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
    renderTrustPills();
    renderFragranceMeta();
    renderNotesStrip();
    renderReviews();
    renderRelated();
    renderFaq();
  }

  /* Populates the sticky bar's product summary; visibility + add-to-cart
     wiring happens once in initStickyBar() below since the elements
     themselves don't get re-created on re-render. */
  function renderStickyBar() {
    const p = pdp.product;
    const variant = selectedVariant();
    const thumbEl = document.querySelector('[data-pdp-sticky-thumb]');
    const priceEl = document.querySelector('[data-pdp-sticky-price]');
    const addBtn = document.querySelector('[data-pdp-sticky-add]');
    if (thumbEl) thumbEl.innerHTML = window.esPlaceholder(p.media[0], '', p.type === 'Gift Set' ? 'gift' : 'bottle');
    if (priceEl) priceEl.textContent = variant ? window.esFormatPrice(variant.price, p.pricing.currency) : '';
    if (addBtn) addBtn.toggleAttribute('disabled', !variant || !variant.available);
  }

  /* Shows the sticky bar once the hero's own purchase controls scroll out
     of view, so the CTA stays reachable without duplicating it on-screen
     the whole time. */
  function initStickyBar() {
    const trigger = document.querySelector('[data-pdp-sticky-trigger]');
    const bar = document.querySelector('[data-pdp-sticky-bar]');
    if (!trigger || !bar || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      bar.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(trigger);

    document.querySelector('[data-pdp-sticky-add]').addEventListener('click', () => {
      const variant = selectedVariant();
      if (!variant || !variant.available) return;
      const qtyInput = document.querySelector('[data-pdp-qty-input]');
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
      window.esAddToCart(pdp.product, variant, qty);
      window.esOpenCart && window.esOpenCart();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    initStickyBar();

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
    document.querySelector('[data-pdp-buy-now]').addEventListener('click', () => {
      const variant = selectedVariant();
      if (!variant || !variant.available) return;
      const qty = parseInt(document.querySelector('[data-pdp-qty-input]').value, 10) || 1;
      window.esAddToCart(pdp.product, variant, qty);
      window.location.href = '/checkout';
    });
  });
})();

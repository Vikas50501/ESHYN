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
      renderStickyBar();
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

    renderStickyBar();
  }

  /* Fixed brand-wide claims, except longevity which pulls the product's
     own value — small bordered cards replacing the old plain-text strip. */
  function renderFeatureHighlights() {
    const wrap = document.querySelector('[data-pdp-feature-highlights]');
    if (!wrap) return;
    const scent = pdp.product.scent;
    const longevityLabel = scent ? `${scent.longevity}+ Hours` : '8+ Hours';
    const items = [
      { label: 'Alcohol-Free', icon: '<path d="M10 2l6 3v5c0 4-2.5 6.5-6 8-3.5-1.5-6-4-6-8V5z"/>' },
      { label: 'Skin-Friendly', icon: '<path d="M10 17s-6-3.6-6-8a4 4 0 018-.4A4 4 0 0116 9c0 4.4-6 8-6 8z"/>' },
      { label: 'Deg-Bhapka Distilled', icon: '<path d="M4 10h9M9 6l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/>' },
      { label: `${longevityLabel} Longevity`, icon: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2" stroke-linecap="round" stroke-linejoin="round"/>' },
      { label: 'Cruelty-Free', icon: '<circle cx="10" cy="10" r="7"/><path d="M7 10l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>' }
    ];
    wrap.innerHTML = items
      .map((item) => `
        <div class="feature-highlights__card">
          <svg class="feature-highlights__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4">${item.icon}</svg>
          <span class="feature-highlights__label">${item.label}</span>
        </div>
      `)
      .join('');
  }

  function renderCharacteristics() {
    const wrap = document.querySelector('[data-pdp-characteristics]');
    if (!wrap) return;
    const chars = pdp.product.scent && pdp.product.scent.characteristics;
    if (!chars) { wrap.closest('section').style.display = 'none'; return; }
    wrap.innerHTML = Object.keys(chars)
      .map((label) => `
        <div class="characteristic">
          <span class="characteristic__label">${label}</span>
          <div class="characteristic__track"><div class="characteristic__fill" style="width:${chars[label]}%"></div></div>
        </div>
      `)
      .join('');
  }

  /* The four occasion buckets are fixed brand copy; which ones highlight
     as "suited" is inferred from this product's own occasions/seasons so
     it stays truthful per-product without needing extra authored data. */
  function renderOccasionCards() {
    const wrap = document.querySelector('[data-pdp-occasion-cards]');
    if (!wrap) return;
    const scent = pdp.product.scent;
    const occ = (scent && scent.occasions) || [];
    const seasons = (scent && scent.seasons) || [];
    const has = (list, ...keys) => keys.some((k) => list.some((v) => v.toLowerCase().includes(k)));

    const cards = [
      { title: 'Daily Wear', desc: 'Light, easy, effortless to reach for.', icon: '<path d="M10 3v3M10 14v3M3 10h3M14 10h3" stroke-linecap="round"/><circle cx="10" cy="10" r="4"/>', suited: has(occ, 'daily', 'casual', 'daytime') },
      { title: 'Office', desc: 'Refined, close to skin, never loud.', icon: '<rect x="4" y="6" width="12" height="10" rx="1"/><path d="M7 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round"/>', suited: has(occ, 'daily', 'formal', 'daytime') },
      { title: 'Evening', desc: 'Warmer, more expressive after dark.', icon: '<path d="M14 11a5 5 0 11-5-7 4 4 0 005 7z"/>', suited: has(occ, 'evening', 'date', 'night') },
      { title: 'Special Occasions', desc: 'Festive, celebratory, memorable.', icon: '<path d="M10 3l1.5 3.5L15 8l-3 2 .8 4-2.8-1.8L7.2 14l.8-4-3-2 3.5-1.5z" stroke-linejoin="round"/>', suited: has(occ, 'festive', 'wedding') || has(seasons, 'winter') }
    ];

    wrap.innerHTML = cards
      .map((c) => `
        <div class="occasion-card${c.suited ? ' is-suited' : ''}">
          <svg class="occasion-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3">${c.icon}</svg>
          <h3 class="occasion-card__title">${c.title}</h3>
          <p class="occasion-card__desc">${c.desc}</p>
          <span class="occasion-card__badge">✓ Great Fit</span>
        </div>
      `)
      .join('');
  }

  /* Reuses the exact .scent-timeline/.scent-grid/.scent-card markup and
     copy structure from the homepage's "Anatomy of a Scent" section — same
     visual language, populated with this product's own notes. creative.js's
     initScentAnatomy() (already loaded on this page) picks up the timeline
     ↔ card hover/click sync automatically since it queries generically for
     [data-scent-timeline]/[data-scent-grid], no extra wiring needed here. */
  function renderScentPyramid() {
    const grid = document.querySelector('[data-pdp-scent-grid]');
    if (!grid) return;
    const notes = pdp.product.scent && pdp.product.scent.notes;
    if (!notes) { grid.closest('section').style.display = 'none'; return; }

    const tiers = [
      { key: 'top', cls: 'scent-card--top', label: 'Top Note — First 15 Minutes', name: 'The Introduction', desc: 'Bright and immediate — the first impression that fades fastest.', notes: notes.top },
      { key: 'heart', cls: 'scent-card--heart', label: 'Heart Note — Hours 1–4', name: 'The Character', desc: "The fragrance's true identity — rounder, warmer, most memorable.", notes: notes.heart },
      { key: 'base', cls: 'scent-card--base', label: 'Base Note — Hours 4+', name: 'The Memory', desc: 'Deep and lasting — what lingers on skin and fabric long after.', notes: notes.base }
    ];

    grid.innerHTML = tiers
      .map((tier, i) => `
        <article class="scent-card ${tier.cls}${i === 0 ? ' is-active' : ''}" data-scent-card="${i}">
          <span class="scent-card__index" aria-hidden="true">0${i + 1}</span>
          <span class="scent-card__label">${tier.label}</span>
          <h3 class="scent-card__name">${tier.name}</h3>
          <p class="scent-card__desc">${tier.desc}</p>
          <div class="scent-card__notes">${tier.notes.map((n) => `<span>${n}</span>`).join('')}</div>
        </article>
      `)
      .join('');
  }

  function renderFragranceMeta() {
    const scent = pdp.product.scent;
    if (!scent) return;

    const longevityLabels = ['', '1-2 Hours', '2-3 Hours', '3-4 Hours', '4-5 Hours', '5-6 Hours', '6-8 Hours', '6-8 Hours', '8+ Hours', '8+ Hours', 'All Day'];
    const longevityEl = document.querySelector('[data-pdp-longevity-value]');
    if (longevityEl) longevityEl.textContent = longevityLabels[scent.longevity] || `${scent.longevity}+ Hours`;

    const projectionEl = document.querySelector('[data-pdp-projection-value]');
    if (projectionEl) projectionEl.textContent = scent.projection;

    const intensityEl = document.querySelector('[data-pdp-intensity]');
    if (intensityEl) intensityEl.textContent = scent.intensity || scent.projection;

    const familyEl = document.querySelector('[data-pdp-family]');
    if (familyEl) familyEl.textContent = scent.family;
  }

  /* Truthful, per-product answers for the three FAQ items that depend on
     this product's own scent data rather than fixed brand copy. */
  function renderFaq() {
    const scent = pdp.product.scent;
    if (!scent) return;

    const longevityLabels = ['', '1-2 hours', '2-3 hours', '3-4 hours', '4-5 hours', '5-6 hours', '6-8 hours', '6-8 hours', '8+ hours', '8+ hours', 'all day'];
    const longevityEl = document.querySelector('[data-pdp-faq-longevity]');
    if (longevityEl) {
      longevityEl.textContent = `${pdp.product.title} lasts around ${longevityLabels[scent.longevity] || `${scent.longevity}+ hours`} on skin, with ${scent.projection.toLowerCase()} sillage as it develops through the day.`;
    }

    const smellEl = document.querySelector('[data-pdp-faq-smell]');
    if (smellEl && scent.notes) {
      const familyLower = scent.family.toLowerCase();
      const article = /^[aeiou]/.test(familyLower) ? 'An' : 'A';
      smellEl.textContent = `${article} ${familyLower} fragrance that opens with ${scent.notes.top.join(' and ')}, settles into ${scent.notes.heart.join(' and ')}, and finishes with a lasting ${scent.notes.base.join(' and ')} base.`;
    }

    const everydayEl = document.querySelector('[data-pdp-faq-everyday]');
    if (everydayEl) {
      const suitedForDaily = (scent.occasions || []).some((o) => /daily|casual|daytime/i.test(o));
      everydayEl.textContent = suitedForDaily
        ? `Yes — its ${scent.projection.toLowerCase()} projection is easy to wear close to the skin, making it a natural fit for everyday use.`
        : `It's best suited to ${(scent.occasions || ['special occasions']).join(', ').toLowerCase()} rather than daily wear, thanks to its ${scent.projection.toLowerCase()} projection.`;
    }
  }

  function renderStory() {
    const scent = pdp.product.scent;
    const mediaEl = document.querySelector('[data-pdp-story-media]');
    const textEl = document.querySelector('[data-pdp-story]');
    if (mediaEl) mediaEl.innerHTML = window.esPlaceholder(pdp.product.media[1] || pdp.product.media[0], pdp.product.title, 'vessel');
    if (textEl) textEl.textContent = scent ? scent.story : pdp.product.shortDescription;
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
    renderFeatureHighlights();
    renderScentPyramid();
    renderFragranceMeta();
    renderCharacteristics();
    renderOccasionCards();
    renderStory();
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
  });
})();

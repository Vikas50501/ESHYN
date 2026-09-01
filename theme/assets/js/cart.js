/**
 * ESHYN — Cart drawer (AJAX-style, localStorage-backed for the static prototype).
 * On Shopify this maps to the Cart AJAX API (/cart/add.js, /cart/change.js, /cart/update.js).
 */

(function () {
  const STORAGE_KEY = 'eshyn_cart';
  const FREE_SHIPPING_THRESHOLD = 999;

  let lines = [];

  function load() {
    try {
      lines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      lines = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }

  function addToCart(product, variant, qty) {
    const existing = lines.find((l) => l.variantId === variant.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, variant.inventory || 99);
    } else {
      lines.push({
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title === 'Default' ? '' : variant.title,
        handle: product.handle,
        tone: product.media[0],
        icon: product.type === 'Gift Set' ? 'gift' : 'bottle',
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        qty: qty,
        maxQty: variant.inventory || 99
      });
    }
    save();
    render();
    toast(`${product.title} added to cart`);
  }

  function changeQty(variantId, delta) {
    const line = lines.find((l) => l.variantId === variantId);
    if (!line) return;
    line.qty = Math.max(1, Math.min(line.qty + delta, line.maxQty));
    save();
    render();
  }

  function removeLine(variantId) {
    lines = lines.filter((l) => l.variantId !== variantId);
    save();
    render();
  }

  function subtotal() {
    return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  }

  function itemCount() {
    return lines.reduce((sum, l) => sum + l.qty, 0);
  }

  function toast(message) {
    const el = document.querySelector('[data-toast]');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('is-visible'), 2400);
  }

  function lineTemplate(line) {
    return `
      <div class="cart-line" data-variant-id="${line.variantId}">
        <div class="cart-line__media">${window.esPlaceholder(line.tone, line.title, line.icon)}</div>
        <div class="cart-line__info">
          <div class="cart-line__top">
            <div>
              <p class="cart-line__title">${line.title}</p>
              ${line.variantTitle ? `<p class="cart-line__variant">${line.variantTitle}</p>` : ''}
            </div>
            <div class="cart-line__price price">
              ${window.esFormatPrice(line.price * line.qty, 'INR')}
              ${line.compareAtPrice ? `<span class="price-compare">${window.esFormatPrice(line.compareAtPrice * line.qty, 'INR')}</span>` : ''}
            </div>
          </div>
          <div class="cart-line__bottom">
            <div class="qty-stepper" role="group" aria-label="Quantity">
              <button type="button" data-cart-decrease aria-label="Decrease quantity">−</button>
              <input type="text" value="${line.qty}" readonly aria-label="Quantity">
              <button type="button" data-cart-increase aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="cart-line__remove" data-cart-remove>Remove</button>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const itemsEl = document.querySelector('[data-cart-items]');
    const emptyEl = document.querySelector('[data-cart-empty]');
    const footEl = document.querySelector('[data-cart-foot]');
    const countEls = document.querySelectorAll('[data-cart-count]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const shippingBar = document.querySelector('[data-shipping-fill]');
    const shippingMsg = document.querySelector('[data-shipping-message]');

    countEls.forEach((el) => { el.textContent = itemCount(); el.hidden = itemCount() === 0; });

    if (!itemsEl) return;

    if (!lines.length) {
      itemsEl.innerHTML = '';
      emptyEl.hidden = false;
      footEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    footEl.hidden = false;
    itemsEl.innerHTML = lines.map(lineTemplate).join('');
    subtotalEl.textContent = window.esFormatPrice(subtotal(), 'INR');

    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal());
    const pct = Math.min(100, (subtotal() / FREE_SHIPPING_THRESHOLD) * 100);
    if (shippingBar) shippingBar.style.width = pct + '%';
    if (shippingMsg) {
      shippingMsg.innerHTML = remaining > 0
        ? `Add <strong>${window.esFormatPrice(remaining, 'INR')}</strong> more to unlock free shipping`
        : `<strong>You've unlocked free shipping 🎉</strong>`;
    }
  }

  function openCart() {
    document.querySelector('[data-cart-drawer]').classList.add('is-open');
    document.querySelector('[data-scrim]').classList.add('is-visible');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    document.querySelector('[data-cart-drawer]').classList.remove('is-open');
    document.querySelector('[data-scrim]').classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  }

  window.esAddToCart = addToCart;
  window.esOpenCart = openCart;
  window.esCloseCart = closeCart;

  document.addEventListener('DOMContentLoaded', () => {
    load();
    render();

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openCart(); }
      if (e.target.closest('[data-cart-close]')) closeCart();
      if (e.target.matches('[data-scrim]') && document.querySelector('[data-cart-drawer]').classList.contains('is-open')) closeCart();

      const decrease = e.target.closest('[data-cart-decrease]');
      const increase = e.target.closest('[data-cart-increase]');
      const remove = e.target.closest('[data-cart-remove]');
      if (decrease || increase || remove) {
        const row = e.target.closest('.cart-line');
        const variantId = row.dataset.variantId;
        if (decrease) changeQty(variantId, -1);
        if (increase) changeQty(variantId, 1);
        if (remove) removeLine(variantId);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('[data-cart-drawer]').classList.contains('is-open')) closeCart();
    });
  });
})();

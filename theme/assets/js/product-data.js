/**
 * ESHYN — Product data source.
 * Structure mirrors the eventual Shopify product/variant object 1:1,
 * so this file is replaced by Liquid/JSON output during theme conversion —
 * no template markup should ever need to change shape.
 */

const PRODUCTS = [
  {
    id: 'p-mitti-attar',
    title: 'Mitti Attar',
    handle: 'mitti-attar',
    vendor: 'ESHYN',
    type: 'Attar',
    shortDescription: 'The scent of first rain on dry earth — smoked terracotta, wet soil, sandalwood.',
    pricing: { currency: 'INR' },
    media: ['terracotta', 'clay'],
    options: [{ name: 'Size', values: ['6ml', '12ml'] }],
    variants: [
      { id: 'v-mitti-6', title: '6ml', sku: 'ESH-MIT-06', price: 949, compareAtPrice: 1149, available: true, inventory: 34, options: { Size: '6ml' } },
      { id: 'v-mitti-12', title: '12ml', sku: 'ESH-MIT-12', price: 1649, compareAtPrice: 1949, available: true, inventory: 3, options: { Size: '12ml' } }
    ],
    rating: { value: 4.8, count: 175 },
    badges: ['bestseller', 'sale'],
    tags: ['attar', 'earthy', 'unisex'],
    collections: ['attars', 'bestsellers']
  },
  {
    id: 'p-sandalwood-attar',
    title: 'Sandalwood Attar',
    handle: 'sandalwood-attar',
    vendor: 'ESHYN',
    type: 'Attar',
    shortDescription: 'Aged Mysore-style sandalwood, warm and creamy, distilled the traditional deg-bhapka way.',
    pricing: { currency: 'INR' },
    media: ['olive', 'sand'],
    options: [{ name: 'Size', values: ['6ml', '12ml'] }],
    variants: [
      { id: 'v-sandal-6', title: '6ml', sku: 'ESH-SAN-06', price: 1349, compareAtPrice: null, available: true, inventory: 51, options: { Size: '6ml' } },
      { id: 'v-sandal-12', title: '12ml', sku: 'ESH-SAN-12', price: 2399, compareAtPrice: null, available: true, inventory: 18, options: { Size: '12ml' } }
    ],
    rating: { value: 4.7, count: 142 },
    badges: ['bestseller'],
    tags: ['attar', 'woody'],
    collections: ['attars', 'bestsellers']
  },
  {
    id: 'p-gulab-attar',
    title: 'Gulab Attar',
    handle: 'gulab-attar',
    vendor: 'ESHYN',
    type: 'Attar',
    shortDescription: 'Kannauj rose, steam-distilled into sandalwood oil over three weeks.',
    pricing: { currency: 'INR' },
    media: ['blush', 'clay'],
    options: [{ name: 'Size', values: ['6ml', '12ml'] }],
    variants: [
      { id: 'v-gulab-6', title: '6ml', sku: 'ESH-GUL-06', price: 1090, compareAtPrice: null, available: true, inventory: 27, options: { Size: '6ml' } },
      { id: 'v-gulab-12', title: '12ml', sku: 'ESH-GUL-12', price: 1990, compareAtPrice: null, available: false, inventory: 0, options: { Size: '12ml' } }
    ],
    rating: { value: 4.9, count: 107 },
    badges: [],
    tags: ['attar', 'floral'],
    collections: ['attars']
  },
  {
    id: 'p-champa-muse',
    title: 'Champa Muse',
    handle: 'champa-muse',
    vendor: 'ESHYN',
    type: 'Eau de Parfum',
    shortDescription: 'Golden champa blossom over warm musk and a whisper of vanilla bean.',
    pricing: { currency: 'INR' },
    media: ['gold', 'blush'],
    options: [{ name: 'Size', values: ['30ml', '50ml'] }],
    variants: [
      { id: 'v-champa-30', title: '30ml', sku: 'ESH-CHA-30', price: 1638, compareAtPrice: 1847, available: true, inventory: 22, options: { Size: '30ml' } },
      { id: 'v-champa-50', title: '50ml', sku: 'ESH-CHA-50', price: 2450, compareAtPrice: 2750, available: true, inventory: 9, options: { Size: '50ml' } }
    ],
    rating: { value: 4.9, count: 9 },
    badges: ['new', 'sale'],
    tags: ['edp', 'floral'],
    collections: ['eau-de-parfum', 'new-arrivals']
  },
  {
    id: 'p-dahn-al-oud',
    title: 'Dahn Al Oud',
    handle: 'dahn-al-oud',
    vendor: 'ESHYN',
    type: 'Eau de Parfum',
    shortDescription: 'Cambodian oud wood, dark and resinous, softened with saffron and rose.',
    pricing: { currency: 'INR' },
    media: ['espresso', 'ink'],
    options: [{ name: 'Size', values: ['30ml', '50ml'] }],
    variants: [
      { id: 'v-oud-30', title: '30ml', sku: 'ESH-OUD-30', price: 1939, compareAtPrice: 2150, available: true, inventory: 15, options: { Size: '30ml' } },
      { id: 'v-oud-50', title: '50ml', sku: 'ESH-OUD-50', price: 2899, compareAtPrice: 3200, available: true, inventory: 6, options: { Size: '50ml' } }
    ],
    rating: { value: 4.8, count: 8 },
    badges: ['sale'],
    tags: ['edp', 'woody', 'oud'],
    collections: ['eau-de-parfum']
  },
  {
    id: 'p-forest-rush',
    title: 'Forest Rush',
    handle: 'forest-rush',
    vendor: 'ESHYN',
    type: 'Eau de Parfum',
    shortDescription: 'Green vetiver and crushed fig leaf, cool as a walk through wet pine.',
    pricing: { currency: 'INR' },
    media: ['olive', 'gold'],
    options: [{ name: 'Size', values: ['50ml'] }],
    variants: [
      { id: 'v-forest-50', title: '50ml', sku: 'ESH-FOR-50', price: 1638, compareAtPrice: 1847, available: true, inventory: 40, options: { Size: '50ml' } }
    ],
    rating: { value: 4.6, count: 3 },
    badges: ['new'],
    tags: ['edp', 'fresh', 'green'],
    collections: ['eau-de-parfum', 'new-arrivals']
  },
  {
    id: 'p-discovery-set',
    title: 'Discovery Set — Five Attars',
    handle: 'discovery-set',
    vendor: 'ESHYN',
    type: 'Gift Set',
    shortDescription: 'Five signature attars in 2ml vials — the whole house, one box.',
    pricing: { currency: 'INR' },
    media: ['gold', 'sand'],
    options: [],
    variants: [
      { id: 'v-set-1', title: 'Default', sku: 'ESH-SET-05', price: 1420, compareAtPrice: null, available: true, inventory: 60, options: {} }
    ],
    rating: { value: 4.9, count: 248 },
    badges: ['bestseller'],
    tags: ['gift', 'set'],
    collections: ['gifting', 'bestsellers']
  },
  {
    id: 'p-black-musk',
    title: 'Black Musk',
    handle: 'black-musk',
    vendor: 'ESHYN',
    type: 'Attar',
    shortDescription: 'Deep animalic musk grounded in dark amber and a trace of cardamom.',
    pricing: { currency: 'INR' },
    media: ['ink', 'espresso'],
    options: [{ name: 'Size', values: ['12ml'] }],
    variants: [
      { id: 'v-musk-12', title: '12ml', sku: 'ESH-MUS-12', price: 1693, compareAtPrice: 1839, available: false, inventory: 0, options: { Size: '12ml' } }
    ],
    rating: { value: 4.7, count: 18 },
    badges: ['sale'],
    tags: ['attar', 'musk'],
    collections: ['attars']
  }
];

function esFormatPrice(amount, currency) {
  if (amount == null) return '';
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return symbol + Number(amount).toLocaleString('en-IN');
}

function esGetProduct(id) {
  return PRODUCTS.find((p) => p.id === id || p.handle === id);
}

function esProductPriceRange(product) {
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Renders a CSS-gradient + line-art-icon placeholder standing in for
 * real product photography. `tone` picks a .ph--* palette class from
 * components.css; `icon` is one of assets/images/icon-*.svg.
 */
function esPlaceholder(tone, alt, icon) {
  icon = icon || 'bottle';
  return `<div class="ph ph--${tone}" role="img" aria-label="${alt}"><span class="ph__icon"><img src="assets/images/icon-${icon}.svg" alt="" aria-hidden="true" loading="lazy"></span></div>`;
}

window.PRODUCTS = PRODUCTS;
window.esFormatPrice = esFormatPrice;
window.esGetProduct = esGetProduct;
window.esProductPriceRange = esProductPriceRange;
window.esPlaceholder = esPlaceholder;

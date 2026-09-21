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
    collections: ['attars', 'bestsellers'],
    scent: {
      notes: { top: ['Citrus', 'Green Leaf'], heart: ['Wet Earth', 'Rose'], base: ['Sandalwood', 'Musk'] },
      longevity: 8, projection: 'Strong',
      concentration: 'Pure Perfume Oil (Attar)', family: 'Earthy Woody',
      characteristics: { Earthy: 95, Woody: 60, Smoky: 55, Fresh: 25, Warm: 70, Musky: 50 },
      occasions: ['Evening', 'Festive'], seasons: ['Monsoon', 'Winter'],
      bestFor: 'Those drawn to nostalgic, earthy scents with old-world depth.',
      story: "Named for petrichor — the scent of the first monsoon rain hitting dry Kannauj soil. Our perfumers have chased this exact moment for over two centuries, distilling baked clay and rain-soaked earth into a single vial of oil.",
      highlights: ['Alcohol-free & skin-friendly', 'Deg-bhapka distilled over weeks, not hours', 'Evolves for 8+ hours on skin'],
      reviews: [
        { name: 'Ananya R.', location: 'Mumbai', rating: 5, text: "Smells exactly like the first monsoon rain. I've never had a fragrance stop strangers before." },
        { name: 'Rohit K.', location: 'Pune', rating: 5, text: "Unlike anything from a mall counter. Genuinely unique and it lasts the whole day." }
      ]
    }
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
    collections: ['attars', 'bestsellers'],
    scent: {
      notes: { top: ['Bergamot'], heart: ['Rose', 'Saffron'], base: ['Mysore Sandalwood', 'Amber'] },
      longevity: 9, projection: 'Strong',
      concentration: 'Pure Perfume Oil (Attar)', family: 'Woody Creamy',
      characteristics: { Earthy: 40, Woody: 95, Smoky: 20, Fresh: 15, Warm: 75, Musky: 45 },
      occasions: ['Daily Wear', 'Formal'], seasons: ['All Season', 'Winter'],
      bestFor: 'Sandalwood purists who want warmth without sweetness.',
      story: "Aged for months using wood sourced in the Mysore tradition, then rested in leather bhapkas until the raw wood note rounds into something creamy and skin-like.",
      highlights: ['Alcohol-free & skin-friendly', 'No synthetic sandalwood substitutes', 'Ages beautifully on skin over the day'],
      reviews: [
        { name: 'Meera T.', location: 'Bengaluru', rating: 5, text: 'The creaminess is unreal — nothing like the sharp, synthetic sandalwood I’ve tried before.' },
        { name: 'Arjun V.', location: 'Delhi', rating: 4, text: 'Beautiful, warm, long-lasting. Wish the 12ml came in a bigger size too.' }
      ]
    }
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
    collections: ['attars'],
    scent: {
      notes: { top: ['Green Leaf', 'Litchi'], heart: ['Damask Rose', 'Mogra'], base: ['Musk', 'Sandalwood'] },
      longevity: 6, projection: 'Moderate',
      concentration: 'Pure Perfume Oil (Attar)', family: 'Floral',
      characteristics: { Earthy: 20, Woody: 35, Smoky: 5, Fresh: 55, Warm: 40, Musky: 30 },
      occasions: ['Daytime', 'Wedding'], seasons: ['Spring', 'Summer'],
      bestFor: 'Romantics who want a true, unsweetened rose.',
      story: "Thousands of hand-picked Damask roses are distilled at dawn, when their oils are most concentrated, straight into sandalwood oil over three slow weeks — the same method Kannauj has used for generations.",
      highlights: ['Real Damask rose, not rose-scented alcohol', 'Alcohol-free & skin-friendly', 'A light, wearable floral for daytime'],
      reviews: [
        { name: 'Priya S.', location: 'Jaipur', rating: 5, text: 'Finally a rose attar that smells like real roses, not rose-flavoured candy.' },
        { name: 'Kavya N.', location: 'Hyderabad', rating: 5, text: 'Wore this to my sister’s wedding and got asked about it all day.' }
      ]
    }
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
    collections: ['eau-de-parfum', 'new-arrivals'],
    scent: {
      notes: { top: ['Bergamot', 'Pink Pepper'], heart: ['Champa Blossom', 'Ylang Ylang'], base: ['Musk', 'Vanilla Bean'] },
      longevity: 7, projection: 'Moderate',
      concentration: 'Eau de Parfum', family: 'Floral Gourmand',
      characteristics: { Earthy: 15, Woody: 30, Smoky: 10, Fresh: 35, Warm: 70, Musky: 55 },
      occasions: ['Evening', 'Date Night'], seasons: ['Autumn', 'Winter'],
      bestFor: 'Those who want a warm, magnetic floral that lingers.',
      story: "Champa Muse translates the golden, honeyed scent of champa blossoms — sacred in Indian gardens for centuries — into a modern, alcohol-free eau de parfum built for evenings that matter.",
      highlights: ['Alcohol-free eau de parfum', 'Golden champa, not a generic floral', 'Warm musk-vanilla base that lasts'],
      reviews: [
        { name: 'Ishita M.', location: 'Kolkata', rating: 5, text: 'Golden, warm, and so different from anything else in my collection. New favourite.' },
        { name: 'Neha D.', location: 'Chandigarh', rating: 5, text: 'The vanilla base makes it feel expensive without being loud.' }
      ]
    }
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
    collections: ['eau-de-parfum'],
    scent: {
      notes: { top: ['Saffron', 'Rose'], heart: ['Cambodian Oud', 'Amber'], base: ['Musk', 'Sandalwood'] },
      longevity: 9, projection: 'Strong',
      concentration: 'Eau de Parfum', family: 'Oud Woody',
      characteristics: { Earthy: 45, Woody: 85, Smoky: 65, Fresh: 15, Warm: 75, Musky: 60 },
      occasions: ['Evening', 'Festive'], seasons: ['Winter', 'Autumn'],
      bestFor: 'Oud lovers who want depth without a heavy, medicinal edge.',
      story: "Dark, resinous Cambodian oud wood, softened with saffron and rose — a modern take on a scent that has anchored South Asian and Middle Eastern perfumery for centuries.",
      highlights: ['Real Cambodian oud, alcohol-free', 'Rounded with saffron — never harsh', 'Room-filling projection that holds all day'],
      reviews: [
        { name: 'Kabir S.', location: 'Delhi', rating: 5, text: "Finally an oud that doesn't give me a headache. Lasts the entire workday without fading." },
        { name: 'Farhan A.', location: 'Lucknow', rating: 4, text: 'Rich and smoky without being overwhelming. Perfect for winter evenings.' }
      ]
    }
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
    collections: ['eau-de-parfum', 'new-arrivals'],
    scent: {
      notes: { top: ['Vetiver', 'Bergamot'], heart: ['Fig Leaf', 'Green Accord'], base: ['Cedar', 'Musk'] },
      longevity: 5, projection: 'Light',
      concentration: 'Eau de Parfum', family: 'Green Fresh',
      characteristics: { Earthy: 35, Woody: 45, Smoky: 10, Fresh: 90, Warm: 20, Musky: 25 },
      occasions: ['Daytime', 'Casual'], seasons: ['Summer', 'Spring'],
      bestFor: 'Anyone who wants an easy, energizing everyday scent.',
      story: "Built around cool vetiver and crushed fig leaf — meant to feel like a walk through wet pine after rain, bottled for the days you want to feel awake.",
      highlights: ['Alcohol-free & lightweight', 'Office-friendly, never overpowering', 'Refreshing green accord, not sweet'],
      reviews: [
        { name: 'Sara J.', location: 'Goa', rating: 5, text: 'My go-to for gym mornings. Fresh without being sharp or synthetic.' },
        { name: 'Vikram P.', location: 'Chennai', rating: 4, text: 'Light and clean. Would love a bigger bottle option.' }
      ]
    }
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
    collections: ['gifting', 'bestsellers'],
    scent: {
      notes: { top: ['Citrus', 'Bergamot'], heart: ['Rose', 'Oud'], base: ['Sandalwood', 'Musk'] },
      longevity: 7, projection: 'Moderate',
      concentration: 'Pure Perfume Oil (Attar) — 5 Scents', family: 'Mixed Collection',
      characteristics: { Earthy: 55, Woody: 60, Smoky: 35, Fresh: 40, Warm: 55, Musky: 45 },
      occasions: ['Gifting', 'Discovery'], seasons: ['All Season'],
      bestFor: 'Gifting, or anyone still finding their signature scent.',
      story: "For the undecided — five of our signature attars in travel-friendly 2ml vials, so you (or someone you love) can find a favourite before committing to a full bottle.",
      highlights: ['5 full-strength attars, 2ml each', 'The easiest way to discover your signature scent', 'Alcohol-free, gift-box ready'],
      reviews: [
        { name: 'Meera T.', location: 'Bengaluru', rating: 5, text: "Gifted this to my sister — she's since reordered three full bottles. Packaging felt genuinely premium." },
        { name: 'Aditi R.', location: 'Mumbai', rating: 5, text: 'Perfect way to try the whole range before picking a favourite. Great gift too.' }
      ]
    }
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
    collections: ['attars'],
    scent: {
      notes: { top: ['Cardamom'], heart: ['Black Musk'], base: ['Dark Amber'] },
      longevity: 8, projection: 'Strong',
      concentration: 'Pure Perfume Oil (Attar)', family: 'Animalic Musk',
      characteristics: { Earthy: 30, Woody: 40, Smoky: 25, Fresh: 5, Warm: 65, Musky: 95 },
      occasions: ['Evening', 'Winter Nights'], seasons: ['Winter'],
      bestFor: 'Those who want a bold, skin-like musk that draws people close.',
      story: "A deep, animalic musk grounded in dark amber and a trace of cardamom — inspired by the rare musk attars once reserved for royal courts.",
      highlights: ['Alcohol-free & long-wearing', 'A true animalic musk, not a synthetic "clean musk"', 'Best worn where people get close'],
      reviews: [
        { name: 'Devika L.', location: 'Ahmedabad', rating: 5, text: 'Bold and unapologetic. Not for everyone, but I love it.' },
        { name: 'Sameer H.', location: 'Indore', rating: 4, text: 'Deep and warm. A little goes a very long way.' }
      ]
    }
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

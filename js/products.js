/**
 * Areli Jewellery — Collections catalog
 *
 * HOW TO ADD / UPDATE PRODUCTS (live stock):
 * 1. Upload your photo to public/images/collections/<folder>/ on GitHub
 *    (any filename, e.g. pearl-layer-necklace.jpg)
 * 2. Add or edit a product() entry below with matching name, description, price
 * 3. Commit — Netlify redeploys in ~1–2 min
 *
 * Rows stay scrollable with any number of products — add as many as you have in stock.
 */

const product = (id, folder, filename, fallback, name, price, description = '') => ({
  id,
  name,
  description,
  price,
  image: `/images/collections/${folder}/${filename}`,
  fallback,
});

/** Placeholder slots — full product name + GHS price (update when stock is ready) */
function placeholderProducts(folder, filePrefix, fallback, label, basePrice = 65) {
  return Array.from({ length: 5 }, (_, i) => {
    const n = i + 1;
    return product(
      `${folder}-${n}`,
      folder,
      `${filePrefix}-${n}.jpg`,
      fallback,
      `${label} ${n}`,
      basePrice + i * 5,
      '',
    );
  });
}

const FALLBACKS = {
  necklace: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
  earring: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  bracelet: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80',
  perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
  crochet: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80',
};

export const collections = [
  {
    group: 'Jewelry',
    categories: [
      {
        id: 'necklaces',
        name: 'Necklaces',
        gallery: true,
        products: [
          product('necklaces-1', 'necklaces', 'necklace-1.jpg', FALLBACKS.necklace, 'Rosalia Necklace', 65, ''),
          product('necklaces-2', 'necklaces', 'necklace-2.jpg', FALLBACKS.necklace, 'Flutter Charm Necklace', 45, ''),
          product('necklaces-3', 'necklaces', 'necklace-3.jpg', FALLBACKS.necklace, 'Necklace 3', 95, ''),
          product('necklaces-4', 'necklaces', 'necklace-4.jpg', FALLBACKS.necklace, 'Necklace 4', 100, ''),
          product('necklaces-5', 'necklaces', 'necklace-5.jpg', FALLBACKS.necklace, '316 L Necklace', 120, ''),
        ],
      },
      {
        id: 'earrings-rings',
        name: 'Earrings & Rings',
        gallery: true,
        products: [
          product('earrings-rings-1', 'earrings-rings', 'earrings-rings-1.jpg', FALLBACKS.earring, 'Spherina Earrings', 50, ''),
          product('earrings-rings-2', 'earrings-rings', 'earrings-rings-2.jpg', FALLBACKS.earring, 'Black Petal', 45, ''),
          product('earrings-rings-3', 'earrings-rings', 'earrings-rings-3.jpg', FALLBACKS.earring, 'Luna Earrings', 50, ''),
          product('earrings-rings-4', 'earrings-rings', 'earrings-rings-4.jpg', FALLBACKS.earring, 'Octavia Earrings', 50, ''),
          product('earrings-rings-5', 'earrings-rings', 'earrings-rings-5.jpg', FALLBACKS.earring, 'Earring / Ring 5', 65, ''),
        ],
      },
      {
        id: 'bracelets-bangles',
        name: 'Bracelets & Bangles',
        gallery: true,
        products: [
          product('bracelets-bangles-1', 'bracelets-bangles', 'bracelet-1.jpg', FALLBACKS.bracelet, 'Butterfly Bangle', 65, ''),
          product('bracelets-bangles-2', 'bracelets-bangles', 'bracelet-2.jpg', FALLBACKS.bracelet, 'Bracelet / Bangle 2', 60, ''),
          product('bracelets-bangles-3', 'bracelets-bangles', 'bracelet-3.jpg', FALLBACKS.bracelet, 'Chana Bangle', 65, ''),
          product('bracelets-bangles-4', 'bracelets-bangles', 'bracelet-4.jpg', FALLBACKS.bracelet, 'Bracelet / Bangle 4', 70, ''),
          product('bracelets-bangles-5', 'bracelets-bangles', 'bracelet-5.jpg', FALLBACKS.bracelet, 'Bracelet / Bangle 5', 75, ''),
        ],
      },
    ],
  },
  {
    group: 'Extras',
    categories: [
      {
        id: 'perfume',
        name: "Victoria's Secret Splashes",
        gallery: true,
        products: [
          product('perfume-1', 'perfume', 'perfume-1.jpg', FALLBACKS.perfume, 'Amber Romance', 160, ''),
          product('perfume-2', 'perfume', 'perfume-2.jpg', FALLBACKS.perfume, 'Vanilla Lace', 160, ''),
          product('perfume-3', 'perfume', 'perfume-3.jpg', FALLBACKS.perfume, 'Pure Seduction Joy', 160, ''),
          product('perfume-4a', 'perfume', 'perfume-4.jpg', FALLBACKS.perfume, 'Velvet Petals (Left)', 160, ''),
          product('perfume-4b', 'perfume', 'perfume-4.jpg', FALLBACKS.perfume, 'Love Spell (Right)', 160, ''),
          product('perfume-5', 'perfume', 'perfume-5.jpg', FALLBACKS.perfume, 'Camelia Sunset', 160, ''),
        ],
      },
      {
        id: 'crochet',
        name: 'Crochet Items',
        gallery: true,
        products: [
          product('crochet-1', 'crochet', 'crochet-1.jpg', FALLBACKS.crochet, 'Blue Crochet Mat', 50, ''),
          product('crochet-2', 'crochet', 'crochet-2.jpg', FALLBACKS.crochet, 'Crochet Set', 50, 'GHS 50 each'),
          product('crochet-3', 'crochet', 'crochet-3.jpg', FALLBACKS.crochet, 'Pink Crochet Mat', 50, ''),
          product('crochet-4', 'crochet', 'crochet-4.jpg', FALLBACKS.crochet, 'Crochet Set', 50, ''),
          product('crochet-5', 'crochet', 'crochet-5.jpg', FALLBACKS.crochet, 'Crochet Set', 50, ''),
        ],
      },
    ],
  },
];

export const collectionTabs = [
  {
    id: 'jewelry',
    label: 'Jewelry',
    categoryIds: ['necklaces', 'earrings-rings', 'bracelets-bangles'],
  },
  {
    id: 'perfume',
    label: 'Perfume',
    categoryIds: ['perfume'],
  },
  {
    id: 'crochet',
    label: 'Crochet',
    categoryIds: ['crochet'],
  },
];

export function getCategoryById(id) {
  for (const group of collections) {
    const category = group.categories.find((c) => c.id === id);
    if (category) return category;
  }
  return null;
}

export function getTabForCategory(categoryId) {
  const tab = collectionTabs.find((t) => t.categoryIds.includes(categoryId));
  return tab?.id ?? 'jewelry';
}

export function getAllCollectionProducts() {
  return collections.flatMap((g) => g.categories.flatMap((c) => c.products));
}

export const lifestyleImages = [
  { image: '/images/lifestyle/work.jpg', fallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80' },
  { image: '/images/lifestyle/gym.jpg', fallback: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' },
  { image: '/images/lifestyle/night-out.jpg', fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80' },
  { image: '/images/lifestyle/brunch.jpg', fallback: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80' },
  { image: '/images/lifestyle/casual.jpg', fallback: 'https://images.unsplash.com/photo-1483985988350-763728e1935b?w=800&q=80' },
  { image: '/images/lifestyle/travel.jpg', fallback: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80' },
];

export const testimonials = [
  {
    name: 'Bella',
    location: 'Ghana',
    text: 'Received all the accessories for my birthday shoot and I love them! Thank you so much.',
    rating: 5,
  },
  {
    name: 'Appiah',
    location: 'Ghana',
    text: 'Two years later, my 2024 pieces from Areli are still the first accessories I grab whenever I\'m heading out.',
    rating: 5,
  },
  {
    name: 'Kris',
    location: 'Ghana',
    text: 'Just wanted to say thank you so much, I really appreciate the work you did for me. I\'m grateful!',
    rating: 5,
  },
];

export const categories = [
  { id: 'necklaces', name: 'Necklaces', icon: 'necklace', tab: 'jewelry' },
  { id: 'earrings-rings', name: 'Earrings & Rings', icon: 'earrings', tab: 'jewelry' },
  { id: 'bracelets-bangles', name: 'Bracelets', icon: 'bracelet', tab: 'jewelry' },
  { id: 'perfume', name: 'Perfume', icon: 'perfume', tab: 'perfume' },
  { id: 'crochet', name: 'Crochet', icon: 'crochet', tab: 'crochet' },
];

export const deliveryTiers = [
  { location: 'Within Accra', fee: '20 – 50 GHS' },
  { location: 'Outskirts of Accra', fee: '45 – 65 GHS' },
  { location: 'Other Regions', fee: '45 – 50 GHS' },
];

/** Ghana: 053 997 4264 → international 233539974264 (no + in WhatsApp URLs) */
export const CONTACT_PHONE_DISPLAY = '053 997 4264';
export const CONTACT_PHONE_LOCAL = '0539974264';
export const CONTACT_PHONE_INTL = '233539974264';
export const PAYMENT_ACCOUNT_NAME = 'Areli Jewellery';
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${CONTACT_PHONE_INTL}`;
export const TEL_URL = `tel:+${CONTACT_PHONE_INTL}`;

const CONTACT_SUBJECTS = {
  order: 'Place an Order',
  question: 'General Question',
  custom: 'Custom Request',
  other: 'Other',
};

export function buildContactWhatsAppUrl({ name, phone, email, subject, message }) {
  const lines = [
    'Hi Areli! New message from your website:',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
  ];

  if (email) lines.push(`Email: ${email}`);
  lines.push(
    `Subject: ${CONTACT_SUBJECTS[subject] || subject}`,
    '',
    'Message:',
    message,
  );

  return `${WHATSAPP_URL}&text=${encodeURIComponent(lines.join('\n'))}`;
}

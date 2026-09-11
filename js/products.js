/**
 * Areli Jewellery — Collections catalog
 *
 * HOW TO ADD / UPDATE PRODUCTS (live stock):
 * 1. Upload your photo to public/images/collections/<folder>/ on GitHub
 * 2. For named products, add or edit a product() entry in the matching category below
 * 3. New image files are picked up automatically on the next deploy (see collection-manifest.json)
 * 4. Replace an existing filename to update that product photo without code changes
 */

import collectionManifest from '../public/collection-manifest.json';
import { fetchPublishedCatalog } from './supabase.js';

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

const CATEGORY_DEFAULTS = {
  necklaces: { fallback: FALLBACKS.necklace, price: 65 },
  'earrings-rings': { fallback: FALLBACKS.earring, price: 50 },
  'bracelets-bangles': { fallback: FALLBACKS.bracelet, price: 65 },
  perfume: { fallback: FALLBACKS.perfume, price: 160 },
  crochet: { fallback: FALLBACKS.crochet, price: 50 },
};

function slugFromFilename(filename) {
  return filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function humanizeFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function withDiscoveredProducts(categories) {
  return categories.map((category) => {
    const manifestFiles = collectionManifest[category.id] ?? [];
    const usedFiles = new Set(
      category.products.map((item) => item.image.split('/').pop()),
    );

    const discovered = manifestFiles
      .filter((filename) => !usedFiles.has(filename))
      .filter((filename) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\./i.test(filename))
      .map((filename) => {
        const defaults = CATEGORY_DEFAULTS[category.id];
        return product(
          `${category.id}-disc-${slugFromFilename(filename)}`,
          category.id,
          filename,
          defaults.fallback,
          humanizeFilename(filename),
          defaults.price,
          '',
        );
      });

    return {
      ...category,
      products: [...category.products, ...discovered],
    };
  });
}

const baseCollections = [
  {
    group: 'Jewelry',
    categories: [
      {
        id: 'necklaces',
        name: 'Necklaces',
        gallery: true,
        products: [
          product('necklaces-16', 'necklaces', 'necklace-16.jpg', FALLBACKS.necklace, 'Pulse Necklace', 65, ''),
          product('necklaces-7', 'necklaces', 'necklace-7.jpg', FALLBACKS.necklace, 'Halo Set', 130, ''),
          product('necklaces-15', 'necklaces', 'necklace-15.jpg', FALLBACKS.necklace, 'Aurora Necklace', 65, ''),
          product('necklaces-6', 'necklaces', 'necklace-6.jpg', FALLBACKS.necklace, 'Sea Pearl Set', 125, ''),
          product('necklaces-14', 'necklaces', 'necklace-14.jpg', FALLBACKS.necklace, 'Isla Necklace', 65, ''),
          product('necklaces-4', 'necklaces', 'necklace-4.jpg', FALLBACKS.necklace, 'Linea Heart Necklace', 65, ''),
          product('necklaces-13', 'necklaces', 'necklace-13.jpg', FALLBACKS.necklace, 'Stella Necklace', 65, ''),
          product('necklaces-1', 'necklaces', 'necklace-1.jpg', FALLBACKS.necklace, 'Rosalia Necklace', 65, ''),
          product('necklaces-12', 'necklaces', 'necklace-12.jpg', FALLBACKS.necklace, 'Aria Necklace', 65, ''),
          product('necklaces-2', 'necklaces', 'necklace-2.jpg', FALLBACKS.necklace, 'Flutter Charm Necklace', 45, ''),
          product('necklaces-11', 'necklaces', 'necklace-11.jpg', FALLBACKS.necklace, 'Vienna Necklace', 65, ''),
          product('necklaces-3', 'necklaces', 'necklace-3.jpg', FALLBACKS.necklace, 'Roseraie Set', 125, ''),
          product('necklaces-10', 'necklaces', 'necklace-10.jpg', FALLBACKS.necklace, 'Nova Necklace', 65, ''),
          product('necklaces-5', 'necklaces', 'necklace-5.jpg', FALLBACKS.necklace, '316 L Necklace', 120, ''),
          product('necklaces-9', 'necklaces', 'necklace-9.jpg', FALLBACKS.necklace, 'Wisteria Necklace', 65, ''),
          product('necklaces-8', 'necklaces', 'necklace-8.jpg', FALLBACKS.necklace, 'Celeste Necklace', 70, ''),
        ],
      },
      {
        id: 'earrings-rings',
        name: 'Earrings',
        gallery: true,
        products: [
          product('earrings-rings-1', 'earrings-rings', 'earrings-rings-1.jpg', FALLBACKS.earring, 'Spherina Earrings', 50, ''),
          product('earrings-rings-2', 'earrings-rings', 'earrings-rings-2.jpg', FALLBACKS.earring, 'Black Petal', 45, ''),
          product('earrings-rings-3', 'earrings-rings', 'earrings-rings-3.jpg', FALLBACKS.earring, 'Luna Earrings', 50, ''),
          product('earrings-rings-4', 'earrings-rings', 'earrings-rings-4.jpg', FALLBACKS.earring, 'Octavia Earrings', 50, ''),
          product('earrings-rings-5', 'earrings-rings', 'earrings-rings-5.jpg', FALLBACKS.earring, 'Dewfall Earring', 45, ''),
        ],
      },
      {
        id: 'bracelets-bangles',
        name: 'Bracelets',
        gallery: true,
        products: [
          product('bracelets-bangles-1', 'bracelets-bangles', 'bracelet-1.jpg', FALLBACKS.bracelet, 'Butterfly Bangle', 65, ''),
          product('bracelets-bangles-2', 'bracelets-bangles', 'bracelet-2.jpg', FALLBACKS.bracelet, 'Orbi Bangle', 60, ''),
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
        name: 'Crochet',
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

export let collections = baseCollections.map((group) => ({
  ...group,
  categories: withDiscoveredProducts(group.categories),
}));

export let shopFilters = [
  { id: 'all', label: 'All' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'earrings-rings', label: 'Earrings' },
  { id: 'bracelets-bangles', label: 'Bracelets' },
  { id: 'perfume', label: 'Perfume' },
  { id: 'crochet', label: 'Crochet' },
];

export function getAllCategories() {
  return collections.flatMap((group) => group.categories);
}

export function getCategoryById(id) {
  return getAllCategories().find((category) => category.id === id) ?? null;
}

export function getShopProducts() {
  return getAllCategories().flatMap((category) =>
    category.products.map((item) => ({ ...item, categoryId: category.id })),
  );
}

/** Original necklaces shown in the home landing mix (All view) */
const LANDING_NECKLACE_IDS = [
  'necklaces-7',
  'necklaces-6',
  'necklaces-4',
  'necklaces-1',
  'necklaces-2',
  'necklaces-3',
  'necklaces-5',
];

function getLandingCategoryProducts(category) {
  if (category.id !== 'necklaces') {
    return category.products.map((item) => ({ ...item, categoryId: category.id }));
  }

  return LANDING_NECKLACE_IDS
    .map((id) => category.products.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({ ...item, categoryId: category.id }));
}

/** Mix products from every category (round-robin) for the All view */
export function getMixedShopProducts({ landing = false } = {}) {
  const buckets = getAllCategories().map((category) =>
    landing
      ? getLandingCategoryProducts(category)
      : category.products.map((item) => ({ ...item, categoryId: category.id })),
  );

  const mixed = [];
  let index = 0;
  const total = buckets.reduce((count, bucket) => count + bucket.length, 0);

  while (mixed.length < total) {
    buckets.forEach((bucket) => {
      if (bucket[index]) mixed.push(bucket[index]);
    });
    index += 1;
  }

  return mixed;
}

export function getProductsForFilter(filterId, options = {}) {
  if (filterId === 'all') return getMixedShopProducts(options);
  const category = getCategoryById(filterId);
  if (!category) return [];
  return category.products.map((item) => ({ ...item, categoryId: filterId }));
}

export const SHOP_FILTER_LIMITS = {
  mobile: 6,
  desktop: 10,
};

export function getAllCollectionProducts() {
  return getShopProducts();
}

/** Client Cam — real customer photos and clips in public/videos/client-cam/ */
const CLIENT_CAM = '/videos/client-cam';

export const clientCamMedia = [
  { type: 'image', image: `${CLIENT_CAM}/04f50ef6-5610-4c2d-9c8b-e144f54b323b.JPG` },
  { type: 'image', image: `${CLIENT_CAM}/1055d675-a433-4820-b6d6-52319b5cff08.JPG` },
  { type: 'image', image: `${CLIENT_CAM}/2d23d457-4e4f-412b-bc6f-ff3009fea8f4.JPG` },
  {
    type: 'video',
    src: `${CLIENT_CAM}/f677ab3b-1880-4e7a-9861-603fb15cb1e1.MP4`,
    poster: `${CLIENT_CAM}/4acd655b-6a40-4f62-be74-6acb78a8312f.JPG`,
  },
  { type: 'image', image: `${CLIENT_CAM}/58804cb1-2b8d-4b5e-b340-8a29a4d0f3ed.JPG` },
  { type: 'image', image: `${CLIENT_CAM}/755978fc-ace7-458d-a97a-037aec90aabd.JPG` },
  {
    type: 'video',
    src: `${CLIENT_CAM}/AF903226-5F7A-43C8-85BC-45BB91A6B7AA.MOV`,
    poster: `${CLIENT_CAM}/2d23d457-4e4f-412b-bc6f-ff3009fea8f4.JPG`,
  },
  { type: 'image', image: `${CLIENT_CAM}/4acd655b-6a40-4f62-be74-6acb78a8312f.JPG` },
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

export let categories = [
  { id: 'necklaces', name: 'Necklaces', icon: 'necklace', filter: 'necklaces' },
  { id: 'earrings-rings', name: 'Earrings', icon: 'earrings', filter: 'earrings-rings' },
  { id: 'bracelets-bangles', name: 'Bracelets', icon: 'bracelet', filter: 'bracelets-bangles' },
  { id: 'perfume', name: 'Perfume', icon: 'perfume', filter: 'perfume' },
  { id: 'crochet', name: 'Crochet', icon: 'crochet', filter: 'crochet' },
];

export async function hydrateCatalog() {
  try {
    const remote = await fetchPublishedCatalog();
    if (!remote.categories.length) return false;

    collections = [{
      group: 'Catalog',
      categories: remote.categories.map((category) => ({
        id: category.slug,
        name: category.name,
        gallery: true,
        products: remote.products
          .filter((item) => item.categoryId === category.slug)
          .map(({ categoryId, ...item }) => item),
      })),
    }];

    shopFilters = [
      { id: 'all', label: 'All' },
      ...remote.categories.map((category) => ({ id: category.slug, label: category.name })),
    ];

    const knownIcons = {
      necklaces: 'necklace',
      'earrings-rings': 'earrings',
      'bracelets-bangles': 'bracelet',
      perfume: 'perfume',
      crochet: 'crochet',
    };

    categories = remote.categories.map((category) => ({
      id: category.slug,
      name: category.name,
      icon: knownIcons[category.slug] || 'jewelry',
      filter: category.slug,
    }));

    return true;
  } catch (error) {
    console.warn('Using the built in catalog because the managed catalog is unavailable.', error);
    return false;
  }
}

export const deliveryTiers = [
  { location: 'Within Accra', fee: '20 – 45 GHS' },
  { location: 'Outskirts of Accra', fee: '50 GHS' },
  { location: 'Other Regions', fee: '45 – 50 GHS' },
];

export const DELIVERY_DAYS = 'Mondays, Wednesdays, and Saturdays';

/** Ghana: 053 997 4264 → international 233539974264 (no + in WhatsApp URLs) */
export const CONTACT_PHONE_DISPLAY = '053 997 4264';
export const CONTACT_PHONE_LOCAL = '0539974264';
export const CONTACT_PHONE_INTL = '233539974264';
export const PAYMENT_ACCOUNT_NAME = 'Areli Jewellery';
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${CONTACT_PHONE_INTL}`;
export const TEL_URL = `tel:+${CONTACT_PHONE_INTL}`;

const CONTACT_SUBJECTS = {
  review: 'Leave a Review',
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

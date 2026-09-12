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
import clientCamManifest from '../public/client-cam-manifest.json';

const product = (id, folder, filename, fallback, name, price, description = '') => ({
  id,
  name,
  description,
  price,
  image: `/images/collections/${folder}/${filename}`,
  fallback,
});

const CATEGORY_DEFAULTS = {
  necklaces: { price: 65 },
  'earrings-rings': { price: 50 },
  'bracelets-bangles': { price: 65 },
  perfume: { price: 160 },
  crochet: { price: 50 },
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
          '',
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
          product('necklaces-16', 'necklaces', 'necklace-16.jpg', '', 'Pulse Necklace', 65, ''),
          product('necklaces-7', 'necklaces', 'necklace-7.jpg', '', 'Halo Set', 130, ''),
          product('necklaces-15', 'necklaces', 'necklace-15.jpg', '', 'Aurora Necklace', 65, ''),
          product('necklaces-6', 'necklaces', 'necklace-6.jpg', '', 'Sea Pearl Set', 125, ''),
          product('necklaces-14', 'necklaces', 'necklace-14.jpg', '', 'Isla Necklace', 65, ''),
          product('necklaces-4', 'necklaces', 'necklace-4.jpg', '', 'Linea Heart Necklace', 65, ''),
          product('necklaces-13', 'necklaces', 'necklace-13.jpg', '', 'Stella Necklace', 65, ''),
          product('necklaces-1', 'necklaces', 'necklace-1.jpg', '', 'Rosalia Necklace', 65, ''),
          product('necklaces-12', 'necklaces', 'necklace-12.jpg', '', 'Aria Necklace', 65, ''),
          product('necklaces-2', 'necklaces', 'necklace-2.jpg', '', 'Flutter Charm Necklace', 45, ''),
          product('necklaces-11', 'necklaces', 'necklace-11.jpg', '', 'Vienna Necklace', 65, ''),
          product('necklaces-3', 'necklaces', 'necklace-3.jpg', '', 'Roseraie Set', 125, ''),
          product('necklaces-10', 'necklaces', 'necklace-10.jpg', '', 'Nova Necklace', 65, ''),
          product('necklaces-5', 'necklaces', 'necklace-5.jpg', '', '316 L Necklace', 120, ''),
          product('necklaces-9', 'necklaces', 'necklace-9.jpg', '', 'Wisteria Necklace', 65, ''),
          product('necklaces-8', 'necklaces', 'necklace-8.jpg', '', 'Celeste Necklace', 70, ''),
        ],
      },
      {
        id: 'earrings-rings',
        name: 'Earrings',
        gallery: true,
        products: [
          product('earrings-rings-1', 'earrings-rings', 'earrings-rings-1.jpg', '', 'Spherina Earrings', 50, ''),
          product('earrings-rings-2', 'earrings-rings', 'earrings-rings-2.jpg', '', 'Black Petal', 45, ''),
          product('earrings-rings-3', 'earrings-rings', 'earrings-rings-3.jpg', '', 'Luna Earrings', 50, ''),
          product('earrings-rings-4', 'earrings-rings', 'earrings-rings-4.jpg', '', 'Octavia Earrings', 50, ''),
          product('earrings-rings-5', 'earrings-rings', 'earrings-rings-5.jpg', '', 'Dewfall Earring', 45, ''),
        ],
      },
      {
        id: 'bracelets-bangles',
        name: 'Bracelets',
        gallery: true,
        products: [
          product('bracelets-bangles-1', 'bracelets-bangles', 'bracelet-1.jpg', '', 'Butterfly Bangle', 65, ''),
          product('bracelets-bangles-2', 'bracelets-bangles', 'bracelet-2.jpg', '', 'Orbi Bangle', 60, ''),
          product('bracelets-bangles-3', 'bracelets-bangles', 'bracelet-3.jpg', '', 'Chana Bangle', 65, ''),
          product('bracelets-bangles-4', 'bracelets-bangles', 'bracelet-4.jpg', '', 'Bracelet / Bangle 4', 70, ''),
          product('bracelets-bangles-5', 'bracelets-bangles', 'bracelet-5.jpg', '', 'Bracelet / Bangle 5', 75, ''),
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
          product('perfume-1', 'perfume', 'perfume-1.jpg', '', 'Amber Romance', 160, ''),
          product('perfume-2', 'perfume', 'perfume-2.jpg', '', 'Vanilla Lace', 160, ''),
          product('perfume-3', 'perfume', 'perfume-3.jpg', '', 'Pure Seduction Joy', 160, ''),
          product('perfume-4a', 'perfume', 'perfume-4.jpg', '', 'Velvet Petals (Left)', 160, ''),
          product('perfume-4b', 'perfume', 'perfume-4.jpg', '', 'Love Spell (Right)', 160, ''),
          product('perfume-5', 'perfume', 'perfume-5.jpg', '', 'Camelia Sunset', 160, ''),
        ],
      },
      {
        id: 'crochet',
        name: 'Crochet',
        gallery: true,
        products: [
          product('crochet-1', 'crochet', 'crochet-1.jpg', '', 'Blue Crochet Mat', 50, ''),
          product('crochet-2', 'crochet', 'crochet-2.jpg', '', 'Crochet Set', 50, 'GHS 50 each'),
          product('crochet-3', 'crochet', 'crochet-3.jpg', '', 'Pink Crochet Mat', 50, ''),
          product('crochet-4', 'crochet', 'crochet-4.jpg', '', 'Crochet Set', 50, ''),
          product('crochet-5', 'crochet', 'crochet-5.jpg', '', 'Crochet Set', 50, ''),
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

/** Client Cam — upload to public/videos/client-cam/; picked up via client-cam-manifest.json */
const CLIENT_CAM = '/videos/client-cam';
const CLIENT_CAM_IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const CLIENT_CAM_VIDEO_EXT = /\.(mp4|mov|webm)$/i;

/**
 * Fixed homepage order — list exact filenames from public/videos/client-cam/.
 * Reorder this array to change what visitors see. Any uploads not listed here
 * still appear, appended at the end in alphabetical order.
 */
export const CLIENT_CAM_ORDER = [
  '4acd655b-6a40-4f62-be74-6acb78a8312f.JPG',
  '1055d675-a433-4820-b6d6-52319b5cff08.JPG',
  "fff24c5c-41b1-4e2e-932e-4798ab76b5af.JPG",
  '2d23d457-4e4f-412b-bc6f-ff3009fea8f4.JPG',
  '21b7a2a8-8342-4afe-b26f-164a60395da5.JPG',
  "AF903226-5F7A-43C8-85BC-45BB91A6B7AA.MOV",
  "d0c8db62-48c0-4d1f-9b5e-e7eae75c89eb.JPG",
  '755978fc-ace7-458d-a97a-037aec90aabd.JPG',
  '4acd655b-6a40-4f62-be74-6acb78a8312f.JPG',
  '58804cb1-2b8d-4b5e-b340-8a29a4d0f3ed.JPG',
  'f677ab3b-1880-4e7a-9861-603fb15cb1e1.MP4',
  ,
];

function orderClientCamFiles(files) {
  const listed = CLIENT_CAM_ORDER.filter((filename) => files.includes(filename));
  const unlisted = files
    .filter((filename) => !CLIENT_CAM_ORDER.includes(filename))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return [...listed, ...unlisted];
}

function clientCamPoster(files, videoFilename) {
  const index = files.indexOf(videoFilename);
  for (let i = index - 1; i >= 0; i -= 1) {
    if (CLIENT_CAM_IMAGE_EXT.test(files[i])) return `${CLIENT_CAM}/${files[i]}`;
  }
  for (let i = index + 1; i < files.length; i += 1) {
    if (CLIENT_CAM_IMAGE_EXT.test(files[i])) return `${CLIENT_CAM}/${files[i]}`;
  }
  return undefined;
}

function buildClientCamMedia() {
  const files = orderClientCamFiles(clientCamManifest.files ?? [])
    .filter((filename) => !/\.mov$/i.test(filename));

  return files.flatMap((filename) => {
    if (CLIENT_CAM_VIDEO_EXT.test(filename)) {
      return [{
        type: 'video',
        src: `${CLIENT_CAM}/${filename}`,
        poster: clientCamPoster(files, filename),
      }];
    }
    if (CLIENT_CAM_IMAGE_EXT.test(filename)) {
      return [{ type: 'image', image: `${CLIENT_CAM}/${filename}` }];
    }
    return [];
  });
}

export const clientCamMedia = buildClientCamMedia();

export const testimonials = [
  {
    name: 'Precious',
    location: 'Ghana',
    text: 'Waterproof, everything. I\'ve had mine for 7 months now and I wear it religiously, nothing has happened to it.',
    rating: 5,
  },
  {
    name: 'Maleb',
    location: 'Ghana',
    text: 'Really love the box. Thank you! My friend said she loved hers too and basket also ateeee.',
    rating: 5,
  },
  {
    name: 'Afia',
    location: 'Ghana',
    text: 'Thank you so much. It\'s always a pleasure working with you!',
    rating: 5,
  },
  {
    name: 'Diann',
    location: 'Ghana',
    text: 'Thank you so much! She loved it. Idk what I would do without you.',
    rating: 5,
  },
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
    const { fetchPublishedCatalog } = await import('./supabase.js');
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

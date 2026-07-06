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
          product('necklace-1', 'necklaces', 'necklace-1.jpg', FALLBACKS.necklace, 'Gold Layer Necklace', 85, 'Waterproof layered chain for everyday wear'),
          product('necklace-2', 'necklaces', 'necklace-2.jpg', FALLBACKS.necklace, 'Pearl Drop Necklace', 100, 'Elegant pearl accent on hypoallergenic chain'),
          product('necklace-3', 'necklaces', 'necklace-3.jpg', FALLBACKS.necklace, 'Snake Chain Necklace', 95, 'Sleek tarnish-free snake chain'),
          product('necklace-4', 'necklaces', 'necklace-4.jpg', FALLBACKS.necklace, 'Necklace 4', 110, 'Edit name, price & description in js/products.js'),
          product('necklace-5', 'necklaces', 'necklace-5.jpg', FALLBACKS.necklace, 'Necklace 5', 125, 'Edit name, price & description in js/products.js'),
        ],
      },
      {
        id: 'earrings-rings',
        name: 'Earrings & Rings',
        gallery: true,
        products: [
          product('earrings-rings-1', 'earrings-rings', 'earrings-rings-1.jpg', FALLBACKS.earring, 'Hoop Earrings', 45, 'Classic gold hoops, lightweight and waterproof'),
          product('earrings-rings-2', 'earrings-rings', 'earrings-rings-2.jpg', FALLBACKS.earring, 'Stud Earrings', 40, 'Minimal studs for daily wear'),
          product('earrings-rings-3', 'earrings-rings', 'earrings-rings-3.jpg', FALLBACKS.earring, 'Stackable Ring Set', 55, 'Tarnish-free rings, mix and match'),
          product('earrings-rings-4', 'earrings-rings', 'earrings-rings-4.jpg', FALLBACKS.earring, 'Earring / Ring 4', 50, 'Edit name, price & description in js/products.js'),
          product('earrings-rings-5', 'earrings-rings', 'earrings-rings-5.jpg', FALLBACKS.earring, 'Earring / Ring 5', 60, 'Edit name, price & description in js/products.js'),
        ],
      },
      {
        id: 'bracelets-bangles',
        name: 'Bracelets & Bangles',
        gallery: true,
        products: [
          product('bracelet-1', 'bracelets-bangles', 'bracelet-1.jpg', FALLBACKS.bracelet, 'Cuban Link Bracelet', 55, 'Bold chain bracelet, waterproof finish'),
          product('bracelet-2', 'bracelets-bangles', 'bracelet-2.jpg', FALLBACKS.bracelet, 'Tennis Bracelet', 70, 'Sparkling stones on durable band'),
          product('bracelet-3', 'bracelets-bangles', 'bracelet-3.jpg', FALLBACKS.bracelet, 'Bangle Set', 60, 'Stackable bangles for any outfit'),
          product('bracelet-4', 'bracelets-bangles', 'bracelet-4.jpg', FALLBACKS.bracelet, 'Bracelet / Bangle 4', 65, 'Edit name, price & description in js/products.js'),
          product('bracelet-5', 'bracelets-bangles', 'bracelet-5.jpg', FALLBACKS.bracelet, 'Bracelet / Bangle 5', 75, 'Edit name, price & description in js/products.js'),
        ],
      },
    ],
  },
  {
    group: 'Extras',
    categories: [
      {
        id: 'perfume',
        name: 'Perfume',
        gallery: true,
        products: [
          product('perfume-1', 'perfume', 'perfume-1.jpg', FALLBACKS.perfume, 'Floral Mist', 45, 'Light everyday fragrance'),
          product('perfume-2', 'perfume', 'perfume-2.jpg', FALLBACKS.perfume, 'Vanilla Glow', 50, 'Warm sweet scent'),
          product('perfume-3', 'perfume', 'perfume-3.jpg', FALLBACKS.perfume, 'Perfume 3', 48, 'Edit name, price & description in js/products.js'),
          product('perfume-4', 'perfume', 'perfume-4.jpg', FALLBACKS.perfume, 'Perfume 4', 52, 'Edit name, price & description in js/products.js'),
          product('perfume-5', 'perfume', 'perfume-5.jpg', FALLBACKS.perfume, 'Perfume 5', 55, 'Edit name, price & description in js/products.js'),
        ],
      },
      {
        id: 'crochet',
        name: 'Crochet Items',
        gallery: true,
        products: [
          product('crochet-1', 'crochet', 'crochet-1.jpg', FALLBACKS.crochet, 'Crochet Top', 60, 'Handmade crochet piece'),
          product('crochet-2', 'crochet', 'crochet-2.jpg', FALLBACKS.crochet, 'Crochet Bag', 75, 'Unique handmade accessory'),
          product('crochet-3', 'crochet', 'crochet-3.jpg', FALLBACKS.crochet, 'Crochet Item 3', 65, 'Edit name, price & description in js/products.js'),
          product('crochet-4', 'crochet', 'crochet-4.jpg', FALLBACKS.crochet, 'Crochet Item 4', 70, 'Edit name, price & description in js/products.js'),
          product('crochet-5', 'crochet', 'crochet-5.jpg', FALLBACKS.crochet, 'Crochet Item 5', 80, 'Edit name, price & description in js/products.js'),
        ],
      },
    ],
  },
];

export function getAllCollectionProducts() {
  return collections.flatMap((g) => g.categories.flatMap((c) => c.products));
}

export const lifestyleImages = [
  { image: '/images/lifestyle/work.jpg', fallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80' },
  { image: '/images/lifestyle/gym.jpg', fallback: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' },
  { image: '/images/lifestyle/night-out.jpg', fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80' },
  { image: '/images/lifestyle/brunch.jpg', fallback: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80' },
];

export const testimonials = [
  {
    name: 'Ama K.',
    location: 'Accra, Ghana',
    text: 'I wear my Areli pieces every single day — to work, to the gym, everywhere. They still look brand new after months. And the price? Unbeatable for this quality.',
    rating: 5,
  },
  {
    name: 'Efua M.',
    location: 'Kumasi, Ghana',
    text: 'Finally, jewelry that doesn\'t irritate my skin! Hypoallergenic and gorgeous. I\'ve recommended Areli to all my friends.',
    rating: 5,
  },
  {
    name: 'Nana A.',
    location: 'Tema, Ghana',
    text: 'Affordable luxury is real. My necklace survived rain, sweat, and daily wear without tarnishing. Areli delivers on every promise.',
    rating: 5,
  },
];

export const categories = [
  { name: 'Necklaces', icon: 'necklace', href: '#collection-necklaces' },
  { name: 'Earrings & Rings', icon: 'earrings', href: '#collection-earrings-rings' },
  { name: 'Bracelets', icon: 'bracelet', href: '#collection-bracelets-bangles' },
  { name: 'Perfume', icon: 'perfume', href: '#collection-perfume' },
  { name: 'Crochet', icon: 'crochet', href: '#collection-crochet' },
];

export const deliveryTiers = [
  { location: 'Accra', fee: '0.50 GHS' },
  { location: 'Tema', fee: '1.00 GHS' },
  { location: 'Kumasi', fee: '2.00 GHS' },
  { location: 'Other Locations', fee: '2.00 GHS' },
];

/** Ghana: 050 040 9107 → international 233500409107 (no + in WhatsApp URLs) */
export const CONTACT_PHONE_DISPLAY = '050 040 9107';
export const CONTACT_PHONE_LOCAL = '0500409107';
export const CONTACT_PHONE_INTL = '233500409107';
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

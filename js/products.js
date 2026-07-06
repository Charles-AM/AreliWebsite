/**
 * Areli Jewellery — Collections catalog
 * Upload images to public/images/collections/<folder>/ on GitHub
 */

const img = (folder, filename, fallback) => ({
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

/** Build numbered slots — upload e.g. necklace-1.jpg, necklace-2.jpg … on GitHub */
function buildSlots(folder, filePrefix, count, fallback, label, basePrice = 65) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `${folder}-${n}`,
      name: `${label} ${n}`,
      price: basePrice + (i % 3) * 15,
      ...img(folder, `${filePrefix}-${n}.jpg`, fallback),
    };
  });
}

export const collections = [
  {
    group: 'Jewelry',
    categories: [
      {
        id: 'necklaces',
        name: 'Necklaces',
        gallery: true,
        products: buildSlots('necklaces', 'necklace', 5, FALLBACKS.necklace, 'Necklace', 85),
      },
      {
        id: 'earrings-rings',
        name: 'Earrings & Rings',
        gallery: true,
        products: buildSlots('earrings-rings', 'earrings-rings', 5, FALLBACKS.earring, 'Earring / Ring', 45),
      },
      {
        id: 'bracelets-bangles',
        name: 'Bracelets & Bangles',
        gallery: true,
        products: buildSlots('bracelets-bangles', 'bracelet', 5, FALLBACKS.bracelet, 'Bracelet / Bangle', 55),
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
        products: buildSlots('perfume', 'perfume', 5, FALLBACKS.perfume, 'Perfume', 45),
      },
      {
        id: 'crochet',
        name: 'Crochet Items',
        gallery: true,
        products: buildSlots('crochet', 'crochet', 5, FALLBACKS.crochet, 'Crochet Item', 60),
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
  { range: 'Below 60 GHS', fee: 'Contact us / Free Pickup' },
  { range: '60 – 99 GHS', fee: '0.50 GHS' },
  { range: '100 – 199 GHS', fee: '1.00 GHS' },
  { range: '200 – 299 GHS', fee: '2.00 GHS' },
  { range: '300+ GHS', fee: '2.00 GHS' },
];

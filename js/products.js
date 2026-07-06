/**
 * Areli Jewellery — Collections catalog
 * Upload images to public/images/collections/<category>/ on GitHub
 */

const img = (category, filename, fallback) => ({
  image: `/images/collections/${category}/${filename}`,
  fallback,
});

const jewelryFallback = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80';
const braceletFallback = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80';
const necklaceFallback = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80';

/** Build numbered product slots — upload matching images on GitHub (e.g. jewelry-1.jpg … jewelry-12.jpg) */
function buildSlots(category, count, fallback, label, basePrice = 75) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `${category}-${n}`,
      name: `${label} ${n}`,
      price: basePrice + (i % 4) * 10,
      ...img(category, `${category}-${n}.jpg`, fallback),
    };
  });
}

export const collections = [
  {
    group: 'Jewelry',
    scrollable: true,
    categories: [
      {
        id: 'jewelry',
        name: 'Jewelry',
        gallery: true,
        imageCount: 12,
        products: buildSlots('jewelry', 12, jewelryFallback, 'Jewelry Piece', 65),
      },
      {
        id: 'bracelets',
        name: 'Bracelets',
        gallery: true,
        imageCount: 8,
        products: buildSlots('bracelets', 8, braceletFallback, 'Bracelet', 55),
      },
      {
        id: 'necklaces',
        name: 'Necklaces',
        gallery: true,
        imageCount: 8,
        products: buildSlots('necklaces', 8, necklaceFallback, 'Necklace', 85),
      },
    ],
  },
  {
    group: 'Extras',
    categories: [
      {
        id: 'perfume',
        name: 'Perfume',
        products: [
          { id: 'perfume-1', name: 'Signature Scent', price: 45, ...img('perfume', 'perfume-1.jpg', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80') },
          { id: 'perfume-2', name: 'Everyday Fragrance', price: 55, ...img('perfume', 'perfume-2.jpg', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f2c4?w=600&q=80') },
          { id: 'perfume-3', name: 'Luxury Mini Set', price: 70, ...img('perfume', 'perfume-3.jpg', 'https://images.unsplash.com/photo-1587017539504-67cfbddac3ff?w=600&q=80') },
        ],
      },
      {
        id: 'crochet',
        name: 'Crochet',
        products: [
          { id: 'crochet-1', name: 'Handmade Crochet Top', price: 80, ...img('crochet', 'crochet-1.jpg', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80') },
          { id: 'crochet-2', name: 'Crochet Accessory', price: 40, ...img('crochet', 'crochet-2.jpg', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80') },
          { id: 'crochet-3', name: 'Crochet Bag', price: 65, ...img('crochet', 'crochet-3.jpg', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80') },
        ],
      },
    ],
  },
];

export function getAllCollectionProducts() {
  return collections.flatMap((g) => g.categories.flatMap((c) => c.products));
}

export const bestsellers = [
  { id: 'necklace-1', name: 'Necklace 1', price: 85, ...img('necklaces', 'necklace-1.jpg', necklaceFallback) },
  { id: 'bracelet-1', name: 'Bracelet 1', price: 55, ...img('bracelets', 'bracelet-1.jpg', braceletFallback) },
  { id: 'jewelry-1', name: 'Jewelry Piece 1', price: 65, ...img('jewelry', 'jewelry-1.jpg', jewelryFallback) },
  { id: 'perfume-1', name: 'Signature Scent', price: 45, ...img('perfume', 'perfume-1.jpg', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80') },
];

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
  { name: 'Jewelry', icon: 'jewelry', href: '#collection-jewelry' },
  { name: 'Bracelets', icon: 'bracelet', href: '#collection-bracelets' },
  { name: 'Necklaces', icon: 'necklace', href: '#collection-necklaces' },
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

/**
 * Areli Jewellery — Product catalog
 * Update image paths to match your local assets in /public/images/products/
 */
export const products = {
  newArrivals: [
    {
      id: 'na-1',
      name: 'Golden Arc Pendant',
      price: 85,
      image: '/images/products/product-1.jpg',
      fallback: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    },
    {
      id: 'na-2',
      name: 'Pearl Drop Earrings',
      price: 65,
      image: '/images/products/product-2.jpg',
      fallback: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    },
    {
      id: 'na-3',
      name: 'Minimalist Chain Necklace',
      price: 95,
      image: '/images/products/product-3.jpg',
      fallback: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    },
    {
      id: 'na-4',
      name: 'Stackable Gold Rings',
      price: 55,
      image: '/images/products/product-4.jpg',
      fallback: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    },
    {
      id: 'na-5',
      name: 'Delicate Bracelet Set',
      price: 75,
      image: '/images/products/product-5.jpg',
      fallback: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    },
    {
      id: 'na-6',
      name: 'Statement Hoop Earrings',
      price: 70,
      image: '/images/products/product-6.jpg',
      fallback: 'https://images.unsplash.com/photo-1588444837495-c7cfebfc04f2?w=600&q=80',
    },
  ],
  bestsellers: [
    {
      id: 'bs-1',
      name: 'Everyday Gold Chain',
      price: 120,
      image: '/images/products/product-1.jpg',
      fallback: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    },
    {
      id: 'bs-2',
      name: 'Classic Pearl Studs',
      price: 45,
      image: '/images/products/product-2.jpg',
      fallback: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    },
    {
      id: 'bs-3',
      name: 'Layered Necklace Set',
      price: 150,
      image: '/images/products/product-3.jpg',
      fallback: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80',
    },
    {
      id: 'bs-4',
      name: 'Bold Cuff Bracelet',
      price: 89,
      image: '/images/products/product-4.jpg',
      fallback: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    },
  ],
};

export const lifestyleImages = [
  {
    title: 'At Work',
    image: '/images/lifestyle/work.jpg',
    fallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  },
  {
    title: 'At the Gym',
    image: '/images/lifestyle/gym.jpg',
    fallback: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  },
  {
    title: 'Night Out',
    image: '/images/lifestyle/night-out.jpg',
    fallback: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
  },
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
  { name: 'Necklaces', icon: 'necklace', href: '#shop-necklaces' },
  { name: 'Rings', icon: 'ring', href: '#shop-rings' },
  { name: 'Earrings', icon: 'earrings', href: '#shop-earrings' },
  { name: 'Bracelets', icon: 'bracelet', href: '#shop-bracelets' },
];

export const deliveryTiers = [
  { range: 'Below 60 GHS', fee: 'Contact us / Free Pickup' },
  { range: '60 – 99 GHS', fee: '0.50 GHS' },
  { range: '100 – 199 GHS', fee: '1.00 GHS' },
  { range: '200 – 299 GHS', fee: '2.00 GHS' },
  { range: '300+ GHS', fee: '2.00 GHS' },
];

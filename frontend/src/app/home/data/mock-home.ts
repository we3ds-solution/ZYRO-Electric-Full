import { Category, FeaturedProduct, PromoOffer, Feature, HeroSlide } from '../models';

// ============================================================
// Haxel — Home Page Mock Data
// Sourced from https://haxel.me — Summer Clearance 40% OFF
// Men / Women / Footwear / Running / Lifting / Lifestyle
// ============================================================

export const MOCK_CATEGORIES: Category[] = [
  { id: 'leggings-flared', name: 'Leggings & Flared', icon: '🧘', color: 'from-violet-600 to-violet-400', image: 'https://haxel.me/cdn/shop/files/1_459b1906-cdf3-4b86-8807-59d1608d3032.png?v=1773849145&width=400' },
  { id: 'sports-bras',     name: 'Sports Bras',       icon: '🎽', color: 'from-fuchsia-600 to-fuchsia-400', image: 'https://haxel.me/cdn/shop/files/CCxHXL_414_of_505.jpg?v=1785091331&width=400' },
  { id: 't-shirts-tops',   name: 'T-Shirts & Tops',   icon: '👕', color: 'from-blue-600 to-blue-400', image: 'https://haxel.me/cdn/shop/files/HaxelTennisClubWhiteDarkGreenPrintOversizedTee_Back.png?v=1789665624&width=400' },
  { id: 'shorts',          name: 'Shorts',            icon: '🩳', color: 'from-emerald-600 to-emerald-400', image: 'https://haxel.me/cdn/shop/files/Haxels_Black_Shorts_Front_Hero_from_Olive_Base.png?v=1789666981&width=400' },
  { id: 'footwear',        name: 'Footwear',          icon: '👟', color: 'from-amber-600 to-amber-400', image: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=400' },
];

export const MOCK_FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'hx-men-tee-court',
    name: 'King of the Court Oversized Tee',
    price: 800,
    originalPrice: 1400,
    image: 'https://haxel.me/cdn/shop/files/HaxelTennisClubWhiteDarkGreenPrintOversizedTee_Back.png?v=1789665624&width=900',
    rating: 4.8,
    reviews: 412,
    badge: '43% OFF',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'hx-men-shorts-black',
    name: 'Haxel Performance Shorts - Black',
    price: 630,
    originalPrice: 900,
    image: 'https://haxel.me/cdn/shop/files/Haxels_Black_Shorts_Front_Hero_from_Olive_Base.png?v=1789666981&width=900',
    rating: 4.9,
    reviews: 590,
    badge: '30% OFF',
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'hx-shoe-4-black',
    name: 'Haxel 4 - All Black',
    price: 1950,
    originalPrice: 3500,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900',
    rating: 4.9,
    reviews: 480,
    badge: '44% OFF',
    sizes: ['41', '42', '43', '44', '45']
  },
  {
    id: 'hx-w-legging-black',
    name: 'Flowform Seamless Leggings',
    price: 700,
    originalPrice: 1200,
    image: 'https://haxel.me/cdn/shop/files/1_459b1906-cdf3-4b86-8807-59d1608d3032.png?v=1773849145&width=900',
    rating: 4.9,
    reviews: 810,
    badge: '42% OFF',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'hx-men-compression-olive',
    name: 'Classic Compression Top - Olive',
    price: 630,
    originalPrice: 900,
    image: 'https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=900',
    rating: 4.9,
    reviews: 620,
    badge: '30% OFF',
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'hx-w-longsleeve-black',
    name: 'Women Long Sleeve Top - Black',
    price: 700,
    originalPrice: 1200,
    image: 'https://haxel.me/cdn/shop/files/Untitled_design_4.png?v=1773838448&width=900',
    rating: 4.8,
    reviews: 365,
    badge: '42% OFF',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

export const MOCK_PROMO_OFFERS: PromoOffer[] = [
  {
    id: '1',
    title: 'Summer Clearance 40% OFF',
    description: 'Tees, shorts, leggings & more — up to 47% off. Proudly 100% local.',
    icon: '☀️',
    gradient: 'from-orange-600 to-rose-500',
    bannerImage: 'https://haxel.me/cdn/shop/files/IMG_8914.jpg?v=1789668996&width=900',
    buttonText: 'Shop Men',
    buttonColor: 'bg-white text-orange-700 hover:bg-orange-50'
  },
  {
    id: '2',
    title: 'Footwear — Built for Comfort',
    description: 'Haxel 2.0, 3 & 4 trainers. Lightweight, easy, made for all-day wear. Proudly 100% local.',
    icon: '👟',
    gradient: 'from-slate-800 to-slate-600',
    bannerImage: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900',
    buttonText: 'Shop Footwear',
    buttonColor: 'bg-white text-slate-800 hover:bg-slate-50'
  },
  {
    id: '3',
    title: 'Lifting — Made for Every Set',
    description: 'Supportive fits that stay in place, with structure where you need it and comfort that lasts.',
    icon: '🏋️',
    gradient: 'from-orange-700 to-amber-500',
    bannerImage: 'https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=900',
    buttonText: 'Shop Lifting',
    buttonColor: 'bg-white text-orange-700 hover:bg-orange-50'
  }
];

export const MOCK_FEATURES: Feature[] = [
  {
    id: '1',
    icon: '🎧',
    title: 'Customer Support',
    description: 'Sun – Thu, 9am – 6pm. Real humans, fast replies.'
  },
  {
    id: '2',
    icon: '↩️',
    title: 'Easy Returns',
    description: 'Smooth & easy exchange & returns.'
  },
  {
    id: '3',
    icon: '🚚',
    title: 'Free Shipping Over 3 Items',
    description: 'Buy 3 items & get free shipping across Egypt.'
  }
];

export const MOCK_HERO_SLIDES: HeroSlide[] = [
  {
    badge: 'Summer Clearance 40% OFF',
    badgeIcon: 'zap',
    badgeBg: 'rgba(232,197,71,0.12)',
    badgeBorder: 'rgba(232,197,71,0.4)',
    badgeText: '#E8C547',
    titlePrefix: 'Summer',
    titleHighlight: 'Clearance',
    titleSuffix: '40% OFF',
    description: 'Shop Men & Women bestsellers — oversized tees, performance shorts, leggings and footwear. Proudly 100% local.',
    ctaPrimary: 'Shop Men',
    ctaSecondary: 'Shop Women',
    image: 'https://haxel.me/cdn/shop/files/IMG_8914.jpg?v=1789668996&width=900',
    bgGradient: 'linear-gradient(135deg, var(--background) 0%, rgba(232,197,71,0.06) 100%)',
    accentColor: '#E8C547',
    tags: ['T-Shirts & Tops', 'Shorts', 'Leggings', 'Footwear']
  },
  {
    badge: 'Shop By Gender',
    badgeIcon: 'shirt',
    badgeBg: 'rgba(59,130,246,0.12)',
    badgeBorder: 'rgba(59,130,246,0.4)',
    badgeText: '#3B82F6',
    titlePrefix: 'Train In',
    titleHighlight: 'Haxel',
    titleSuffix: 'Your Way',
    description: 'Men: tees, compression, shorts. Women: leggings, sports bras, tanks. Find your fit for running, lifting and low impact.',
    ctaPrimary: 'Shop Men',
    ctaSecondary: 'Shop Women',
    image: 'https://haxel.me/cdn/shop/files/Haxels_Black_Shorts_Front_Hero_from_Olive_Base.png?v=1789666981&width=900',
    bgGradient: 'linear-gradient(135deg, var(--background) 0%, rgba(59,130,246,0.06) 100%)',
    accentColor: '#3B82F6',
    tags: ['Men', 'Women', 'Leggings & Flared', 'Sports Bras']
  },
  {
    badge: 'Footwear Collection',
    badgeIcon: 'footprints',
    badgeBg: 'rgba(168,85,247,0.12)',
    badgeBorder: 'rgba(168,85,247,0.4)',
    badgeText: '#A855F7',
    titlePrefix: 'Built For',
    titleHighlight: 'Comfort',
    titleSuffix: 'All Day',
    description: 'Haxel 4, Haxel 3 Ultra Comfort and 2.0 Running. Lightweight, easy, and made for all-day wear — from training to everything after.',
    ctaPrimary: 'Shop Footwear',
    ctaSecondary: 'Best Sellers',
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900',
    bgGradient: 'linear-gradient(135deg, var(--background) 0%, rgba(168,85,247,0.06) 100%)',
    accentColor: '#A855F7',
    tags: ['Haxel 4', 'Haxel 3', 'Haxel 2.0', 'Baseline']
  },
  {
    badge: 'Lifting Collection',
    badgeIcon: 'dumbbell',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeBorder: 'rgba(34,197,94,0.4)',
    badgeText: '#22C55E',
    titlePrefix: 'Made For',
    titleHighlight: 'Lifting',
    titleSuffix: 'Every Set',
    description: 'Supportive fits that stay in place, with structure where you need it and comfort that lasts through every set.',
    ctaPrimary: 'Shop Lifting',
    ctaSecondary: 'Shop Running',
    image: 'https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=900',
    bgGradient: 'linear-gradient(135deg, var(--background) 0%, rgba(34,197,94,0.06) 100%)',
    accentColor: '#22C55E',
    tags: ['Compression Tops', 'Biker Shorts', 'Tanks', 'Leggings']
  }
];

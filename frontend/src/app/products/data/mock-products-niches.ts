/**
 * Haxel: Complete Activewear Database
 * Sourced from https://haxel.me — Egyptian performance wear, proudly 100% local.
 *
 * Haxel Niches:
 * 1. Men — T-Shirts & Tops
 * 2. Men — Shorts & Pants
 * 3. Women — Leggings & Flared
 * 4. Women — Sports Bras
 * 5. Women — Tops & Tanks
 * 6. Women — Shorts
 * 7. Footwear
 * 8. Running
 * 9. Lifting
 * 10. Lifestyle / SS26
 */

import { Product } from '../models';

const dist = (five: number, four: number, three: number, two: number, one: number) => ({
  1: one, 2: two, 3: three, 4: four, 5: five
});

export const MOCK_PRODUCTS_NICHES: Product[] = [
  // ======================== MEN: T-SHIRTS & TOPS ========================
  {
    id: 'hx-men-tee-court', title: 'King of the Court Oversized Premium Cotton T-Shirt',
    description: 'Oversized premium cotton tee with Tennis Club back print. Breathable 100% cotton, dropped shoulders, all-day comfort on and off court. Sizes S–XXL.',
    price: 800, originalPrice: 1400, discount: 43,
    image: 'https://haxel.me/cdn/shop/files/HaxelTennisClubWhiteDarkGreenPrintOversizedTee_Back.png?v=1789665624&width=900',
    images: ['https://haxel.me/cdn/shop/files/HaxelTennisClubWhiteDarkGreenPrintOversizedTee_Back.png?v=1789665624&width=900'],
    category: 't-shirts-tops',
    rating: { average: 4.8, count: 412, distribution: dist(320, 60, 20, 7, 5) },
    stock: 240, sku: 'HX-M-TEE-COURT', createdAt: new Date('2025-08-10'), updatedAt: new Date('2026-06-10'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-tee-pitch', title: 'The Pitch Oversized Premium T-Shirt',
    description: 'Football-inspired oversized tee with field graphic. Heavyweight cotton, relaxed fit, built for training and street. Sizes S–XXL.',
    price: 800, originalPrice: 1400, discount: 43,
    image: 'https://haxel.me/cdn/shop/files/HaxelFootballFieldWhiteOversizedTee_Back.png?v=1789665658&width=900',
    images: ['https://haxel.me/cdn/shop/files/HaxelFootballFieldWhiteOversizedTee_Back.png?v=1789665658&width=900'],
    category: 't-shirts-tops',
    rating: { average: 4.7, count: 385, distribution: dist(290, 62, 21, 7, 5) },
    stock: 210, sku: 'HX-M-TEE-PITCH', createdAt: new Date('2025-08-10'), updatedAt: new Date('2026-06-10'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-compression-olive', title: 'Classic Compression Top - Olive',
    description: 'Second-skin compression top for lifting and running. Sweat-wicking, 4-way stretch, flatlock seams. Sizes S–2XL.',
    price: 630, originalPrice: 900, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=900',
    images: ['https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=900'],
    category: 'lifting',
    rating: { average: 4.9, count: 620, distribution: dist(520, 70, 18, 7, 5) },
    stock: 480, sku: 'HX-M-COMP-OLV', createdAt: new Date('2025-05-02'), updatedAt: new Date('2026-05-20'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-compression-navy', title: 'Classic Compression Top - Navy',
    description: 'Classic navy compression fit with sculpted shoulders. Anti-odor, quick-dry, stays in place through every set. Sizes S–2XL.',
    price: 630, originalPrice: 900, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/Image3.png?v=1779971380&width=900',
    images: ['https://haxel.me/cdn/shop/files/Image3.png?v=1779971380&width=900'],
    category: 'lifting',
    rating: { average: 4.8, count: 540, distribution: dist(440, 68, 20, 7, 5) },
    stock: 420, sku: 'HX-M-COMP-NVY', createdAt: new Date('2025-05-02'), updatedAt: new Date('2026-05-20'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-compression-white', title: 'Classic Compression Top - White',
    description: 'Clean white compression top. Lightweight, breathable, squat-proof support for lifting days. Sizes S–2XL.',
    price: 630, originalPrice: 900, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/Image_2_5d217b56-6f54-4e5b-a194-2054858380d5.png?v=1779971488&width=900',
    images: ['https://haxel.me/cdn/shop/files/Image_2_5d217b56-6f54-4e5b-a194-2054858380d5.png?v=1779971488&width=900'],
    category: 'lifting',
    rating: { average: 4.7, count: 388, distribution: dist(295, 60, 20, 8, 5) },
    stock: 360, sku: 'HX-M-COMP-WHT', createdAt: new Date('2025-05-02'), updatedAt: new Date('2026-05-20'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-core-grey', title: 'Core 4.0 Performance Top - Grey',
    description: 'Core 4.0 training top in grey. Ultra-light performance knit, sweat-wicking, athletic tapered fit. Sizes S–2XL.',
    price: 800, originalPrice: 1000, discount: 20,
    image: 'https://haxel.me/cdn/shop/files/H-176.jpg?v=1752856598&width=900',
    images: ['https://haxel.me/cdn/shop/files/H-176.jpg?v=1752856598&width=900'],
    category: 'men',
    rating: { average: 4.8, count: 455, distribution: dist(360, 65, 18, 7, 5) },
    stock: 300, sku: 'HX-M-CORE-GRY', createdAt: new Date('2025-03-15'), updatedAt: new Date('2026-04-10'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-core-pistachio', title: 'Core 4.0 Performance Top - Pistachio',
    description: 'Core 4.0 in pistachio. Same pro fit, fresh SS26 colorway. Lightweight and breathable for summer training.',
    price: 550, originalPrice: 1000, discount: 45,
    image: 'https://haxel.me/cdn/shop/files/H-313.jpg?v=1752856600&width=900',
    images: ['https://haxel.me/cdn/shop/files/H-313.jpg?v=1752856600&width=900'],
    category: 'men',
    rating: { average: 4.7, count: 310, distribution: dist(230, 52, 16, 7, 5) },
    stock: 180, sku: 'HX-M-CORE-PST', createdAt: new Date('2025-03-15'), updatedAt: new Date('2026-04-10'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-core-white', title: 'Core 4.0 Performance Top - White',
    description: 'Core 4.0 in white. Competition-ready fit, minimal branding. Currently restocking — join waitlist.',
    price: 900, originalPrice: 1000, discount: 10,
    image: 'https://haxel.me/cdn/shop/files/H-446.jpg?v=1752856599&width=900',
    images: ['https://haxel.me/cdn/shop/files/H-446.jpg?v=1752856599&width=900'],
    category: 'men',
    rating: { average: 4.8, count: 502, distribution: dist(400, 70, 20, 7, 5) },
    stock: 0, sku: 'HX-M-CORE-WHT', createdAt: new Date('2025-03-15'), updatedAt: new Date('2026-04-10'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-tank-white', title: 'X Tank Top 2.0 - White',
    description: 'X Tank 2.0 with deep cut and breathable back. Built for lifting PRs and summer runs. Sizes S–2XL.',
    price: 480, originalPrice: 800, discount: 40,
    image: 'https://haxel.me/cdn/shop/files/H-371_e752d901-b573-48e7-8667-ab523ca8db2d.jpg?v=1752856639&width=900',
    images: ['https://haxel.me/cdn/shop/files/H-371_e752d901-b573-48e7-8667-ab523ca8db2d.jpg?v=1752856639&width=900'],
    category: 't-shirts-tops',
    rating: { average: 4.6, count: 275, distribution: dist(195, 50, 18, 7, 5) },
    stock: 320, sku: 'HX-M-TANK-WHT', createdAt: new Date('2025-04-01'), updatedAt: new Date('2026-05-01'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-tank-black', title: 'X Tank Top 2.0 - Black',
    description: 'Stealth black X Tank 2.0. Cotton-touch performance blend, side-split hem for mobility. Sizes S–2XL.',
    price: 800, discount: 0,
    image: 'https://haxel.me/cdn/shop/files/H-118.jpg?v=1752856654&width=900',
    images: ['https://haxel.me/cdn/shop/files/H-118.jpg?v=1752856654&width=900'],
    category: 't-shirts-tops',
    rating: { average: 4.7, count: 298, distribution: dist(220, 50, 16, 7, 5) },
    stock: 260, sku: 'HX-M-TANK-BLK', createdAt: new Date('2025-04-01'), updatedAt: new Date('2026-05-01'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-cotton-tank-white', title: 'Summer Ultra Light 100% Cotton Tank - White',
    description: 'Featherlight 100% cotton summer tank. Minimal Haxel chest hit, relaxed drape. Sizes XS–XL.',
    price: 600, originalPrice: 800, discount: 25,
    image: 'https://haxel.me/cdn/shop/files/CCxHAXEL_130of133_9172a7c8-729b-498a-ade6-38082a891a4c.jpg?v=1779971593&width=900',
    images: ['https://haxel.me/cdn/shop/files/CCxHAXEL_130of133_9172a7c8-729b-498a-ade6-38082a891a4c.jpg?v=1779971593&width=900'],
    category: 'lifestyle',
    rating: { average: 4.6, count: 190, distribution: dist(135, 35, 12, 5, 3) },
    stock: 280, sku: 'HX-M-CTANK-WHT', createdAt: new Date('2025-06-01'), updatedAt: new Date('2026-06-01'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-men-cotton-tank-black', title: 'Summer Ultra Light 100% Cotton Tank - Black',
    description: 'Black edition ultra-light cotton tank. Perfect for Cairo heat, gym to street. Sizes XS–XL.',
    price: 600, originalPrice: 800, discount: 25,
    image: 'https://haxel.me/cdn/shop/files/CCxHAXEL_123of133.jpg?v=1779969648&width=900',
    images: ['https://haxel.me/cdn/shop/files/CCxHAXEL_123of133.jpg?v=1779969648&width=900'],
    category: 'lifestyle',
    rating: { average: 4.7, count: 210, distribution: dist(155, 35, 12, 5, 3) },
    stock: 300, sku: 'HX-M-CTANK-BLK', createdAt: new Date('2025-06-01'), updatedAt: new Date('2026-06-01'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },

  // ======================== MEN: SHORTS ========================
  {
    id: 'hx-men-shorts-charcoal', title: 'Haxel Performance Shorts - Charcoal',
    description: '5" performance shorts with liner, zip pocket, and 4-way stretch. Squat, sprint, repeat. Sizes S–2XL.',
    price: 650, originalPrice: 900, discount: 28,
    image: 'https://haxel.me/cdn/shop/files/Haxels_Gray_Shorts_Side_Hero.png?v=1789666981&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxels_Gray_Shorts_Side_Hero.png?v=1789666981&width=900'],
    category: 'shorts',
    rating: { average: 4.8, count: 480, distribution: dist(380, 68, 20, 7, 5) },
    stock: 350, sku: 'HX-M-SHORT-CHA', createdAt: new Date('2025-07-01'), updatedAt: new Date('2026-06-15'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-shorts-olive', title: 'Haxel Performance Shorts - Olive',
    description: 'Olive training shorts with sweat-wicking shell and breathable liner. 100% local made. Sizes S–2XL.',
    price: 650, originalPrice: 900, discount: 28,
    image: 'https://haxel.me/cdn/shop/files/Haxels_Olive_Shorts_Front_Hero.png?v=1789666981&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxels_Olive_Shorts_Front_Hero.png?v=1789666981&width=900'],
    category: 'shorts',
    rating: { average: 4.8, count: 435, distribution: dist(345, 60, 18, 7, 5) },
    stock: 330, sku: 'HX-M-SHORT-OLV', createdAt: new Date('2025-07-01'), updatedAt: new Date('2026-06-15'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-shorts-black', title: 'Haxel Performance Shorts - Black',
    description: 'Essential black training shorts. Deep pockets, drawcord waist, quick-dry. Sizes S–2XL.',
    price: 630, originalPrice: 900, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/Haxels_Black_Shorts_Front_Hero_from_Olive_Base.png?v=1789666981&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxels_Black_Shorts_Front_Hero_from_Olive_Base.png?v=1789666981&width=900'],
    category: 'shorts',
    rating: { average: 4.9, count: 590, distribution: dist(495, 65, 18, 7, 5) },
    stock: 410, sku: 'HX-M-SHORT-BLK', createdAt: new Date('2025-07-01'), updatedAt: new Date('2026-06-15'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-men-jacket', title: 'Haxel Athletic Jacket 2.0',
    description: 'Full-zip athletic jacket with brushed back, thumbholes, and zip pockets. Layer for winter runs. Sizes XS–L.',
    price: 1500, discount: 0,
    image: 'https://haxel.me/cdn/shop/files/PET_4379.jpg?v=1767644604&width=900',
    images: ['https://haxel.me/cdn/shop/files/PET_4379.jpg?v=1767644604&width=900'],
    category: 'men',
    rating: { average: 4.8, count: 220, distribution: dist(175, 30, 9, 4, 2) },
    stock: 140, sku: 'HX-M-JACKET-20', createdAt: new Date('2025-11-22'), updatedAt: new Date('2026-03-10'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },

  // ======================== WOMEN: LEGGINGS & BIKER ========================
  {
    id: 'hx-w-legging-purple', title: 'Flowform Seamless Leggings - Purple',
    description: 'Seamless sculpting leggings with high waist and butt contour. Squat-proof, second-skin. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/PET_7213.jpg?v=1773847777&width=900',
    images: ['https://haxel.me/cdn/shop/files/PET_7213.jpg?v=1773847777&width=900'],
    category: 'leggings-flared',
    rating: { average: 4.9, count: 720, distribution: dist(620, 70, 18, 7, 5) },
    stock: 380, sku: 'HX-W-LEG-PUR', createdAt: new Date('2025-04-15'), updatedAt: new Date('2026-05-25'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-w-legging-black', title: 'Flowform Seamless Leggings - Black',
    description: 'Bestseller black seamless leggings. No front seam, stay-put waist, all-day lift. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/1_459b1906-cdf3-4b86-8807-59d1608d3032.png?v=1773849145&width=900',
    images: ['https://haxel.me/cdn/shop/files/1_459b1906-cdf3-4b86-8807-59d1608d3032.png?v=1773849145&width=900'],
    category: 'leggings-flared',
    rating: { average: 4.9, count: 810, distribution: dist(700, 75, 22, 8, 5) },
    stock: 420, sku: 'HX-W-LEG-BLK', createdAt: new Date('2025-04-15'), updatedAt: new Date('2026-05-25'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-w-legging-blue', title: 'Flowform Seamless Leggings - Blue',
    description: 'Ocean blue seamless set-ready leggings. Buttery, breathable, gym-to-brunch. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/blue_leggings.png?v=1773848701&width=900',
    images: ['https://haxel.me/cdn/shop/files/blue_leggings.png?v=1773848701&width=900'],
    category: 'leggings-flared',
    rating: { average: 4.8, count: 540, distribution: dist(440, 68, 20, 7, 5) },
    stock: 340, sku: 'HX-W-LEG-BLU', createdAt: new Date('2025-04-15'), updatedAt: new Date('2026-05-25'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-w-biker-olive', title: 'Soft Sculpt Mid-Length Biker Shorts - Dark Olive',
    description: 'Mid-length biker with soft-sculpt compression. No roll, no chafe, phone pocket. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_3.png?v=1779992471&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_3.png?v=1779992471&width=900'],
    category: 'shorts',
    rating: { average: 4.8, count: 390, distribution: dist(310, 55, 15, 6, 4) },
    stock: 260, sku: 'HX-W-BIKER-OLV', createdAt: new Date('2025-06-10'), updatedAt: new Date('2026-05-30'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-w-biker-teal', title: 'Soft Sculpt Mid-Length Biker Shorts - Teal',
    description: 'Teal sculpt biker, 6" inseam. High-rise, squat-proof, low-impact approved. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_7.png?v=1779992510&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_7.png?v=1779992510&width=900'],
    category: 'shorts',
    rating: { average: 4.7, count: 310, distribution: dist(240, 46, 14, 6, 4) },
    stock: 240, sku: 'HX-W-BIKER-TEAL', createdAt: new Date('2025-06-10'), updatedAt: new Date('2026-05-30'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-w-biker-cherry', title: 'Soft Sculpt Mid-Length Biker Shorts - Cherry Red',
    description: 'Cherry red statement biker. Same sculpt fit, bold SS26 shade. Sizes XS–L.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_5.png?v=1779992577&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_5.png?v=1779992577&width=900'],
    category: 'shorts',
    rating: { average: 4.8, count: 285, distribution: dist(225, 40, 12, 5, 3) },
    stock: 220, sku: 'HX-W-BIKER-CHR', createdAt: new Date('2025-06-10'), updatedAt: new Date('2026-05-30'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-w-biker-black', title: 'Soft Sculpt Mid-Length Biker Shorts - Black',
    description: 'Essential black biker. Goes with every sports bra in your drawer. Sizes XS–L.',
    price: 1200, discount: 0,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_8.png?v=1779992612&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_8.png?v=1779992612&width=900'],
    category: 'shorts',
    rating: { average: 4.9, count: 410, distribution: dist(345, 45, 12, 5, 3) },
    stock: 300, sku: 'HX-W-BIKER-BLK', createdAt: new Date('2025-06-10'), updatedAt: new Date('2026-05-30'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },

  // ======================== WOMEN: TOPS / BRAS / TANKS ========================
  {
    id: 'hx-w-longsleeve-black', title: 'Haxel Women Long Sleeve Basic Workout Top - Black',
    description: 'Fitted long-sleeve training top with thumbholes. Modest coverage, breathable. Sizes XS–XL.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/Untitled_design_4.png?v=1773838448&width=900',
    images: ['https://haxel.me/cdn/shop/files/Untitled_design_4.png?v=1773838448&width=900'],
    category: 'women',
    rating: { average: 4.8, count: 365, distribution: dist(290, 50, 15, 6, 4) },
    stock: 280, sku: 'HX-W-LS-BLK', createdAt: new Date('2025-05-20'), updatedAt: new Date('2026-05-15'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-w-longsleeve-navy', title: 'Haxel Women Long Sleeve Basic Workout Top - Navy',
    description: 'Navy long-sleeve with seamless underarm. Perfect for hijabi athletes and cool mornings. Sizes XS–XL.',
    price: 700, originalPrice: 1200, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/PET_7022.jpg?v=1767881431&width=900',
    images: ['https://haxel.me/cdn/shop/files/PET_7022.jpg?v=1767881431&width=900'],
    category: 'women',
    rating: { average: 4.8, count: 340, distribution: dist(270, 48, 13, 5, 4) },
    stock: 260, sku: 'HX-W-LS-NVY', createdAt: new Date('2025-05-20'), updatedAt: new Date('2026-05-15'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-w-tank-teal', title: 'Race Day Womens Tank - Teal',
    description: 'Featherlight race-day tank for running. Racerback, reflective hit, anti-chafe. Sizes XS–XL.',
    price: 700, originalPrice: 1000, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/CCxHXL_414_of_505.jpg?v=1785091331&width=900',
    images: ['https://haxel.me/cdn/shop/files/CCxHXL_414_of_505.jpg?v=1785091331&width=900'],
    category: 'running',
    rating: { average: 4.7, count: 245, distribution: dist(185, 40, 12, 5, 3) },
    stock: 210, sku: 'HX-W-TANK-TEAL', createdAt: new Date('2025-07-15'), updatedAt: new Date('2026-06-05'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-w-tank-black', title: 'Race Day Womens Tank - Black',
    description: 'Black race tank with breathable mesh back. From 5K to marathon. Sizes XS–XL.',
    price: 700, originalPrice: 1000, discount: 30,
    image: 'https://haxel.me/cdn/shop/files/CCxHXL_210_of_505.jpg?v=1785091278&width=900',
    images: ['https://haxel.me/cdn/shop/files/CCxHXL_210_of_505.jpg?v=1785091278&width=900'],
    category: 'running',
    rating: { average: 4.8, count: 268, distribution: dist(210, 38, 12, 5, 3) },
    stock: 230, sku: 'HX-W-TANK-BLK', createdAt: new Date('2025-07-15'), updatedAt: new Date('2026-06-05'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-w-race-tee', title: 'Haxel Performance Tee - Women',
    description: 'Women’s everyday training tee. Relaxed through body, sweat-wicking. Sizes XS–XL.',
    price: 800, discount: 0,
    image: 'https://haxel.me/cdn/shop/collections/Untitled_design_8_1.webp?v=1778420553&width=900',
    images: ['https://haxel.me/cdn/shop/collections/Untitled_design_8_1.webp?v=1778420553&width=900'],
    category: 't-shirts-tops',
    rating: { average: 4.6, count: 175, distribution: dist(125, 32, 10, 5, 3) },
    stock: 250, sku: 'HX-W-TEE-RUN', createdAt: new Date('2025-06-20'), updatedAt: new Date('2026-05-28'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },

  // ======================== FOOTWEAR ========================
  {
    id: 'hx-shoe-4-black', title: 'Haxel 4 - All Black',
    description: 'Haxel 4 signature trainer in triple black. Extra comfort foam, all-day wear, training to street. Sizes 41–45.',
    price: 1950, originalPrice: 3500, discount: 44,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900'],
    category: 'footwear',
    rating: { average: 4.9, count: 480, distribution: dist(410, 48, 12, 6, 4) },
    stock: 120, sku: 'HX-SHOE-4-BLK', createdAt: new Date('2025-09-01'), updatedAt: new Date('2026-06-12'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-4-blackorange', title: 'Haxel 4 - Black & Orange',
    description: 'Haxel 4 with volt orange accents. High-grip outsole, breathable mesh. Sizes 41–45.',
    price: 1950, originalPrice: 3500, discount: 44,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_Orange_-_Final_Aligned.png?v=1785074093&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Black_Orange_-_Final_Aligned.png?v=1785074093&width=900'],
    category: 'footwear',
    rating: { average: 4.8, count: 395, distribution: dist(315, 55, 15, 6, 4) },
    stock: 110, sku: 'HX-SHOE-4-BLO', createdAt: new Date('2025-09-01'), updatedAt: new Date('2026-06-12'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-4-whitenavy', title: 'Haxel 4 - White & Navy',
    description: 'Clean white/navy Haxel 4. Lightweight, easy, made for all-day wear. Sizes 41–45.',
    price: 1950, originalPrice: 3500, discount: 44,
    image: 'https://haxel.me/cdn/shop/files/Haxel_White_Navy_-_Final_Aligned.png?v=1785074090&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_White_Navy_-_Final_Aligned.png?v=1785074090&width=900'],
    category: 'footwear',
    rating: { average: 4.8, count: 360, distribution: dist(285, 50, 15, 6, 4) },
    stock: 105, sku: 'HX-SHOE-4-WNV', createdAt: new Date('2025-09-01'), updatedAt: new Date('2026-06-12'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-2-black', title: 'Haxel 2.0 Running Extra Comfort - Black',
    description: 'Daily running shoe with extra-comfort midsole. Built for comfort, designed to stand out. Sizes 41–45.',
    price: 1500, originalPrice: 2500, discount: 40,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_Sole_-_Placement_Aligned.png?v=1785074093&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Black_Sole_-_Placement_Aligned.png?v=1785074093&width=900'],
    category: 'running',
    rating: { average: 4.7, count: 310, distribution: dist(235, 50, 15, 6, 4) },
    stock: 95, sku: 'HX-SHOE-2-BLK', createdAt: new Date('2025-08-01'), updatedAt: new Date('2026-05-18'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-3-camo', title: 'Haxel 3 Ultra Comfort - Olive Camo',
    description: 'Haxel 3 ultra-comfort in olive camo. Plush collar, rugged outsole. Sizes 41–45.',
    price: 1600, originalPrice: 3000, discount: 47,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Camo_-_Facing_Right.png?v=1785076357&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Camo_-_Facing_Right.png?v=1785076357&width=900'],
    category: 'footwear',
    rating: { average: 4.8, count: 285, distribution: dist(225, 40, 12, 5, 3) },
    stock: 88, sku: 'HX-SHOE-3-CAMO', createdAt: new Date('2025-08-15'), updatedAt: new Date('2026-05-20'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-4-women-navy', title: 'Haxel 4 Women - White & Navy',
    description: 'Women’s Haxel 4 in white/navy. Tailored fit, lightweight comfort. Sizes 37–40.',
    price: 1800, originalPrice: 2500, discount: 28,
    image: 'https://haxel.me/cdn/shop/files/Haxel_White_Navy_-_Final_Aligned.png?v=1785074090&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_White_Navy_-_Final_Aligned.png?v=1785074090&width=900'],
    category: 'footwear',
    rating: { average: 4.8, count: 240, distribution: dist(190, 34, 10, 4, 2) },
    stock: 90, sku: 'HX-SHOE-4W-NVY', createdAt: new Date('2025-09-01'), updatedAt: new Date('2026-06-12'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-4-women-black', title: 'Haxel 4 Women - All Black',
    description: 'Women’s triple-black Haxel 4. Sleek, versatile, gym-to-street. Sizes 37–40.',
    price: 2500, discount: 0,
    image: 'https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_Black_on_Black_-_Final_Aligned.png?v=1785074092&width=900'],
    category: 'footwear',
    rating: { average: 4.9, count: 195, distribution: dist(160, 25, 6, 2, 2) },
    stock: 75, sku: 'HX-SHOE-4W-BLK', createdAt: new Date('2025-09-01'), updatedAt: new Date('2026-06-12'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-3-women-black', title: 'Haxel 3 Women - Black',
    description: 'Women’s Haxel 3 ultra comfort in black mesh. Cushioned stride. Sizes 37–40.',
    price: 1500, originalPrice: 2500, discount: 40,
    image: 'https://haxel.me/cdn/shop/files/Haxel_All_Black_Mesh_-_E-Com_Reference_Style.png?v=1785076542&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_All_Black_Mesh_-_E-Com_Reference_Style.png?v=1785076542&width=900'],
    category: 'footwear',
    rating: { average: 4.7, count: 180, distribution: dist(135, 30, 9, 4, 2) },
    stock: 82, sku: 'HX-SHOE-3W-BLK', createdAt: new Date('2025-08-15'), updatedAt: new Date('2026-05-20'),
    isActive: true, isFeatured: false, vendor: 'Haxel'
  },
  {
    id: 'hx-shoe-baseline', title: 'Haxel Baseline - White Leather',
    description: 'Court-inspired Baseline in white leather. Premium everyday sneaker, 100% local. Sizes 41–45.',
    price: 1750, originalPrice: 3000, discount: 42,
    image: 'https://haxel.me/cdn/shop/files/Haxel_White_Leather_-_Facing_Right.png?v=1785074092&width=900',
    images: ['https://haxel.me/cdn/shop/files/Haxel_White_Leather_-_Facing_Right.png?v=1785074092&width=900'],
    category: 'lifestyle',
    rating: { average: 4.8, count: 225, distribution: dist(180, 30, 9, 4, 2) },
    stock: 98, sku: 'HX-SHOE-BASE-WHT', createdAt: new Date('2025-09-10'), updatedAt: new Date('2026-06-01'),
    isActive: true, isFeatured: true, vendor: 'Haxel'
  }
];

// Export comprehensive product database — Haxel activewear
export const MOCK_PRODUCTS_ALL_NICHES = MOCK_PRODUCTS_NICHES;

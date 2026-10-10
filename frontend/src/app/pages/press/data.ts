export interface PressRelease {
  title: string;
  date: string;
  summary: string;
  category: string;
}

export interface MediaContact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export const PRESS_RELEASES: PressRelease[] = [
  {
    title: 'Haxel Drops Summer Clearance 40% OFF',
    date: 'August 11, 2026',
    summary: 'Summer Clearance across Men, Women & Footwear — up to 47% off bestselling tees, shorts, leggings and Haxel 4 trainers.',
    category: 'Drop'
  },
  {
    title: 'Haxel 4 Footwear: Built for Comfort, Designed to Stand Out',
    date: 'July 2026',
    summary: 'Haxel 4, 3 Ultra Comfort and 2.0 Running now live — lightweight, easy, made for all-day wear. Proudly 100% local.',
    category: 'Footwear'
  },
  {
    title: 'Haxel Lifting Collection: Made for Every Set',
    date: 'June 2026',
    summary: 'Compression tops, biker shorts and tanks with supportive fits that stay in place through every set.',
    category: 'Collection'
  },
  {
    title: 'Haxel Reaches 4.78★ From 220+ Verified Reviews',
    date: 'May 2026',
    summary: 'Thank you Egypt — Flowform leggings, performance shorts and long-sleeve tops lead our bestsellers for Women and Men.',
    category: 'Milestone'
  }
];

export const MEDIA_CONTACTS: MediaContact[] = [
  {
    name: 'Haxel Support',
    title: 'Customer Care',
    email: 'support@haxel.me',
    phone: '+20 100 000 0000 (Sun-Thu 9am-6pm)'
  }
];

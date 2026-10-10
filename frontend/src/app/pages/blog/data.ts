export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Leggings Guide: Flowform vs Biker — Which Fits Your Training?',
    excerpt: 'Squat-proof seamless vs soft-sculpt biker: rise, inseam and support compared for lifting and low-impact days.',
    author: 'Salma Adel',
    date: 'August 10, 2026',
    category: 'Women',
    readTime: '5 min'
  },
  {
    id: '2',
    title: 'Top 10 Lifting Essentials From Haxel',
    excerpt: 'Compression tops, X Tanks and performance shorts that stay in place through every set.',
    author: 'Omar Khaled',
    date: 'August 8, 2026',
    category: 'Lifting',
    readTime: '7 min'
  },
  {
    id: '3',
    title: 'Running in Cairo Heat: Race-Day Tanks Explained',
    excerpt: 'Why featherlight, anti-chafe tanks matter — plus how to style teal and black for 5K to marathon.',
    author: 'Karim Samy',
    date: 'August 5, 2026',
    category: 'Running',
    readTime: '6 min'
  },
  {
    id: '4',
    title: 'Haxel 4 vs 3 vs 2.0: Which Trainer Is For You?',
    excerpt: 'All-black lifestyle vs ultra-comfort camo vs extra-comfort running — cushion, grip and fit compared.',
    author: 'Nour El-Din',
    date: 'August 1, 2026',
    category: 'Footwear',
    readTime: '8 min'
  },
  {
    id: '5',
    title: 'Size Guide 2026: S–2XL & Shoes 37–45',
    excerpt: 'How compression, oversized tees and seamless leggings should fit — plus when to size up.',
    author: 'Mariam Fathy',
    date: 'July 28, 2026',
    category: 'Size Guide',
    readTime: '10 min'
  },
  {
    id: '6',
    title: 'Summer Clearance: How to Build 3-Item Free-Shipping Bundles',
    excerpt: 'Pack smart with Men, Women & Footwear picks that unlock free shipping across Egypt.',
    author: 'Haxel Team',
    date: 'July 25, 2026',
    category: 'Summer',
    readTime: '7 min'
  }
];

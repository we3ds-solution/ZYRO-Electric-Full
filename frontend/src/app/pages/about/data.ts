export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export const ABOUT_VALUES: Value[] = [
  {
    title: 'Performance First',
    description: 'Sweat-wicking, 4-way stretch fabrics tested for running, lifting and low-impact training.',
    icon: '⭐'
  },
  {
    title: '100% Local',
    description: 'Proudly designed and made in Egypt — from our first legging to Haxel 4 footwear.',
    icon: '🤝'
  },
  {
    title: 'Customer Focus',
    description: 'Sun–Thu 9am–6pm support, smooth exchange & returns, and a 4.78★ verified rating.',
    icon: '💙'
  },
  {
    title: 'For Every Athlete',
    description: 'Men, women, modest fits, plus running, lifting, low-impact and lifestyle collections.',
    icon: '🚀'
  },
  {
    title: 'Comfort That Lasts',
    description: 'Supportive fits that stay in place — sculpt leggings, compression tops, all-day footwear.',
    icon: '🌍'
  },
  {
    title: 'Community',
    description: 'Built with our Cairo training community. Your feedback shapes every SS26 drop.',
    icon: '👥'
  }
];

export const ABOUT_STATS: Stat[] = [
  { label: 'Verified Rating', value: '4.78★ (220)' },
  { label: 'Activewear Styles', value: '35+' },
  { label: 'Collections', value: 'Men • Women • Footwear' },
  { label: 'Made In', value: '100% Egypt' }
];

export const ABOUT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah M.',
    text: 'Haxel leggings are the best I’ve tried in Egypt. Squat-proof, comfortable, and the biker shorts never roll!',
    rating: 5
  },
  {
    name: 'Alex T.',
    text: 'Haxel 4 trainers are so light for all-day wear. Fast delivery and easy exchange.',
    rating: 5
  },
  {
    name: 'Jamie L.',
    text: 'Finally a local brand that gets lifting fits right. Compression tops stay in place every set!',
    rating: 5
  }
];

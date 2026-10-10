export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  level: string;
  salary: string;
  type: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export const CAREER_JOBS: JobPosition[] = [
  {
    id: '1',
    title: 'Store Lead — New Cairo',
    department: 'Retail',
    location: 'New Cairo, Egypt',
    level: 'Senior',
    salary: '18,000 - 24,000 EGP / month',
    type: 'Full-time'
  },
  {
    id: '2',
    title: 'E-commerce Specialist',
    department: 'Operations',
    location: 'Cairo (Hybrid)',
    level: 'Mid-level',
    salary: '15,000 - 20,000 EGP / month',
    type: 'Full-time'
  },
  {
    id: '3',
    title: 'Performance Wear Designer',
    department: 'Product',
    location: 'Cairo, Egypt',
    level: 'Senior',
    salary: '20,000 - 28,000 EGP / month',
    type: 'Full-time'
  },
  {
    id: '4',
    title: 'Content Creator — Fitness',
    department: 'Marketing',
    location: 'Remote (Egypt)',
    level: 'Mid-level',
    salary: '12,000 - 18,000 EGP / month',
    type: 'Full-time'
  },
  {
    id: '5',
    title: 'Customer Support (Sun-Thu)',
    department: 'Operations',
    location: 'Cairo',
    level: 'Junior',
    salary: '8,000 - 12,000 EGP / month',
    type: 'Full-time'
  },
  {
    id: '6',
    title: 'Fit Model — Men / Women',
    department: 'Product',
    location: 'Cairo',
    level: 'Freelance',
    salary: '500 EGP / hour',
    type: 'Part-time / Seasonal'
  }
];

export const CAREER_BENEFITS: Benefit[] = [
  { icon: '💰', title: 'Competitive Pay', description: 'Fair Egypt-market salaries, paid in EGP' },
  { icon: '👟', title: 'Haxel Gear', description: 'Seasonal activewear + footwear allowance' },
  { icon: '🎓', title: 'Training Support', description: 'Gym subsidy and coaching courses' },
  { icon: '🏠', title: 'Flexible Shifts', description: 'Sun-Thu ops, retail rotations' },
  { icon: '📈', title: 'Grow With Us', description: 'Own your path at a 100% local brand' },
  { icon: '🎯', title: 'Growth Opportunities', description: 'Clear career advancement paths' }
];

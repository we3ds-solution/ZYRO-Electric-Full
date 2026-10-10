export interface TermsSection {
  title: string;
  icon: string;
}

export const TERMS_LAST_UPDATED = 'August 11, 2026';

export const TERMS_SECTIONS: TermsSection[] = [
  { title: 'Agreement to Terms', icon: '✓' },
  { title: 'Use License', icon: '📋' },
  { title: 'Disclaimer of Warranties', icon: '⚠️' },
  { title: 'Limitation of Liability', icon: '🛡️' },
  { title: 'Accuracy of Materials', icon: '✔️' },
  { title: 'User Accounts', icon: '👤' },
  { title: 'Products & Pricing', icon: '💰' },
  { title: 'Orders & Purchases', icon: '🛒' },
  { title: 'Shipping & Delivery', icon: '📦' },
  { title: 'Returns & Refunds', icon: '↩️' }
];

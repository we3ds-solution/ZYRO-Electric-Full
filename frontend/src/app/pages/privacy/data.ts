export interface Section {
  title: string;
  content: string[];
}

export const PRIVACY_LAST_UPDATED = 'August 11, 2026';
export const PRIVACY_EFFECTIVE_DATE = 'August 11, 2026';

export const PRIVACY_SECTIONS: Section[] = [
  {
    title: 'Information We Collect',
    content: [
      'Account Information: Name, email, phone, address, password',
      'Payment Information: Processed by secure payment gateways',
      'Order Information: Products purchased, quantities, preferences',
      'Device Information: Device type, OS, browser, IP address',
      'Usage Information: Pages visited, products viewed, search queries',
      'Cookies & Tracking: Via pixels, web beacons, local storage'
    ]
  },
  {
    title: 'How We Use Your Information',
    content: [
      'Service Delivery: Processing orders, managing accounts',
      'Communication: Order updates, support responses',
      'Analytics: Understanding user behavior, improving features',
      'Personalization: Product recommendations, custom experience',
      'Security: Fraud detection, account protection',
      'Marketing: Targeted ads, newsletters (with consent)'
    ]
  },
  {
    title: 'Data Security',
    content: [
      'SSL/TLS Encryption: Secure HTTPS connection',
      'Database Encryption: Sensitive data encrypted at rest',
      'Access Controls: Limited employee access',
      'PCI DSS Compliance: Payment Card Industry standards',
      'GDPR Compliance: European data protection regulations',
      'Regular Audits: Security assessments and testing'
    ]
  },
  {
    title: 'Your Rights',
    content: [
      'Access: Request your personal data',
      'Correction: Update inaccurate information',
      'Deletion: Request data removal (where permitted)',
      'Portability: Download data in portable format',
      'Marketing Opt-out: Unsubscribe from communications',
      'Cookie Management: Accept/reject non-essential cookies'
    ]
  },
  {
    title: 'Third-Party Sharing',
    content: [
      'Service Providers: Payment processors, shipping partners',
      'Legal Requirements: Court orders, law enforcement',
      'Business Transfers: Merger, acquisition, asset sale',
      'With Consent: Only when you authorize',
      'Never Sold: Your data is never sold to third parties'
    ]
  }
];

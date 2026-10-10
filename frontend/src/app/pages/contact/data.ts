export interface ContactMethod {
  title: string;
  icon: string;
  primary: string;
  secondary: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
  {
    title: 'Email',
    icon: '📧',
    primary: 'support@haxel.me',
    secondary: 'Response time: 24-48 hours'
  },
  {
    title: 'Phone',
    icon: '📞',
    primary: '+20 100 000 0000',
    secondary: 'Sun-Thu, 9 AM - 6 PM (Cairo)'
  },
  {
    title: 'Live Chat',
    icon: '💬',
    primary: 'Available on website',
    secondary: 'Sun-Thu, 9 AM - 6 PM'
  },
  {
    title: 'Social Media',
    icon: '📱',
    primary: '@haxel.me',
    secondary: 'Instagram — fastest response'
  }
];

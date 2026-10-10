export interface CookieType {
  name: string;
  duration: string;
  purpose: string;
}

export const COOKIE_TYPES: CookieType[] = [
  { name: 'Essential Cookies', duration: 'Session/1 year', purpose: 'Session management, security, site functionality' },
  { name: 'Performance Cookies', duration: '2 years', purpose: 'Analytics, user behavior tracking, optimization' },
  { name: 'Marketing Cookies', duration: '1-3 years', purpose: 'Personalized ads, conversion tracking, retargeting' },
  { name: 'Functional Cookies', duration: '1 year', purpose: 'Preferences, language, accessibility settings' }
];

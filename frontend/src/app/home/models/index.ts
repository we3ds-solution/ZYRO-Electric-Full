export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image?: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  sizes?: string[];
  hasError?: boolean;
}

export interface PromoOffer {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  bannerImage?: string;
  buttonText: string;
  buttonColor: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HeroSlide {
  badge: string;
  badgeIcon: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
  bgGradient: string;
  accentColor: string;
  tags: string[];
}

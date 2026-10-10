import { Component } from '@angular/core';
import { Category, FeaturedProduct, PromoOffer, Feature, HeroSlide } from './models';
import { MOCK_CATEGORIES, MOCK_FEATURED_PRODUCTS, MOCK_PROMO_OFFERS, MOCK_FEATURES, MOCK_HERO_SLIDES } from './data/mock-home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  categories: Category[] = MOCK_CATEGORIES;
  featuredProducts: FeaturedProduct[] = MOCK_FEATURED_PRODUCTS;
  promoOffers: PromoOffer[] = MOCK_PROMO_OFFERS;
  features: Feature[] = MOCK_FEATURES;
  heroSlides: HeroSlide[] = MOCK_HERO_SLIDES;
}

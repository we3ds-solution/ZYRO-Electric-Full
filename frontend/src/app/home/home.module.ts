import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { UiModule } from '../shared/ui/ui.module';

import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { StatsComponent } from './components/stats/stats.component';
import { CategoriesGridComponent } from './components/categories-grid/categories-grid.component';
import { ShopByGenderComponent } from './components/shop-by-gender/shop-by-gender.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { PromoBannersComponent } from './components/promo-banners/promo-banners.component';
import { ShopByActivityComponent } from './components/shop-by-activity/shop-by-activity.component';
import { ReviewsStripComponent } from './components/reviews-strip/reviews-strip.component';
import { FeaturesGridComponent } from './components/features-grid/features-grid.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';

import { LucideAngularModule, Laptop, Smartphone, Camera, Zap, ChevronLeft, ChevronRight, ArrowRight, Star, Mail, Image } from 'lucide-angular';

@NgModule({
  declarations: [
    HomeComponent,
    HeroSliderComponent,
    StatsComponent,
    CategoriesGridComponent,
    ShopByGenderComponent,
    FeaturedProductsComponent,
    PromoBannersComponent,
    ShopByActivityComponent,
    ReviewsStripComponent,
    FeaturesGridComponent,
    NewsletterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    LucideAngularModule.pick({ Laptop, Smartphone, Camera, Zap, ChevronLeft, ChevronRight, ArrowRight, Star, Mail, Image })
  ],
  exports: [HomeComponent]
})
export class HomeModule { }

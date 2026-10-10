import { Component, Input } from '@angular/core';
import { PromoOffer } from '../../models';

@Component({
  selector: 'app-promo-banners',
  templateUrl: './promo-banners.component.html',
  styleUrls: ['./promo-banners.component.scss']
})
export class PromoBannersComponent {
  @Input() promoOffers: PromoOffer[] = [];
}

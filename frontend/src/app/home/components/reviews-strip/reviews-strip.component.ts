import { Component } from '@angular/core';

interface Review {
  name: string;
  text: string;
}

@Component({
  selector: 'app-reviews-strip',
  templateUrl: './reviews-strip.component.html',
  styleUrls: ['./reviews-strip.component.scss']
})
export class ReviewsStripComponent {
  rating = '4.78';
  reviewCount = 220;

  reviews: Review[] = [
    { name: 'Sarah M.', text: 'Leggings are squat-proof and so comfortable. Best local activewear, hands down.' },
    { name: 'Omar K.', text: 'Haxel 4 trainers — light, comfy, wear them all day. Delivery was fast too.' },
    { name: 'Nour A.', text: 'Compression tops stay in place every set. Finally a brand that gets lifting.' }
  ];
}

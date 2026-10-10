import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface ActivityCard {
  title: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-shop-by-activity',
  templateUrl: './shop-by-activity.component.html',
  styleUrls: ['./shop-by-activity.component.scss']
})
export class ShopByActivityComponent {
  private router = inject(Router);

  activities: ActivityCard[] = [
    {
      title: 'Running',
      category: 'running',
      image: 'https://haxel.me/cdn/shop/files/CCxHXL_414_of_505.jpg?v=1785091331&width=600'
    },
    {
      title: 'Lifting',
      category: 'lifting',
      image: 'https://haxel.me/cdn/shop/files/Image_1_8306f9a8-2f3f-4e3a-935f-82cf754541f0.png?v=1779971395&width=600'
    },
    {
      title: 'Low Impact',
      category: 'shorts',
      image: 'https://haxel.me/cdn/shop/files/Haxel_Biker_Shorts_Smooth_7.png?v=1779992510&width=600'
    },
    {
      title: 'Summer',
      category: 'lifestyle',
      image: 'https://haxel.me/cdn/shop/files/CCxHAXEL_130of133_9172a7c8-729b-498a-ade6-38082a891a4c.jpg?v=1779971593&width=600'
    }
  ];

  goToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}

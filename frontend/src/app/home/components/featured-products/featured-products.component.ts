import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturedProduct } from '../../models';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent {
  private router = inject(Router);

  @Input() featuredProducts: FeaturedProduct[] = [];
  @Input() title = 'Best Sellers';
  @Input() subtitle = 'Best sellers for a reason. Built to perform, designed for comfort.';

  goToProduct(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}

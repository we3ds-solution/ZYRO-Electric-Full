import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-by-gender',
  templateUrl: './shop-by-gender.component.html',
  styleUrls: ['./shop-by-gender.component.scss']
})
export class ShopByGenderComponent {
  private router = inject(Router);

  goToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}

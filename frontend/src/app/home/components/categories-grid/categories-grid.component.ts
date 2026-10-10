import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models';

@Component({
  selector: 'app-categories-grid',
  templateUrl: './categories-grid.component.html',
  styleUrls: ['./categories-grid.component.scss']
})
export class CategoriesGridComponent {
  private router = inject(Router);

  @Input() categories: Category[] = [];

  goToCategory(category: Category): void {
    this.router.navigate(['/products'], { queryParams: { category: category.id } });
  }
}

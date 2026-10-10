import { Injectable } from '@angular/core';
import { Product } from '../../products/models';
import { ISortStrategy } from '../interfaces/business-logic';

// Single Responsibility: Handle product sorting only
// DIP: Implements ISortStrategy interface - depends on abstraction
@Injectable({ providedIn: 'root' })
export class SortStrategyService implements ISortStrategy {
  sort(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popularity':
        return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      default:
        return sorted;
    }
  }
}

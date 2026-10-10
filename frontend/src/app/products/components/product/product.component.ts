import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  private router = inject(Router);

  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  Math = Math;
  imgError = false;

  viewDetails(): void {
    this.router.navigate(['/details', this.product.id]);
  }

  /** Size pills like haxel.me collection cards (derived from category). */
  sizesFor(): string[] {
    const cat = (this.product?.category || '').toLowerCase();
    if (cat.includes('footwear')) return ['41', '42', '43', '44', '45'];
    if (cat.includes('legging') || cat.includes('women') || cat.includes('sports')) return ['XS', 'S', 'M', 'L'];
    if (cat.includes('lifestyle') || cat.includes('running')) return ['XS', 'S', 'M', 'L', 'XL'];
    if (cat.includes('t-shirt') || cat.includes('tops') || cat.includes('men')) return ['S', 'M', 'L', 'XL', 'XXL'];
    return ['S', 'M', 'L', 'XL', '2XL'];
  }

  addCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product);
    }
  }

  formatCategory(slug: string): string {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}


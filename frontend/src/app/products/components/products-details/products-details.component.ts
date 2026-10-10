import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Review } from '../../models';
import { UiToastComponent } from '../../../shared/ui/components/toast/toast.component';
import { PRODUCT_SERVICE_TOKEN, CART_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html'
})
export class ProductsDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // DIP: Inject via tokens (abstraction), not concrete classes
  private productsService = inject(PRODUCT_SERVICE_TOKEN);
  private cartsService = inject(CART_SERVICE_TOKEN);

  @ViewChild('toast') toast!: UiToastComponent;

  product: Product | null = null;
  reviews: Review[] = [];
  isLoading = false;
  imgError = false;
  quantity = 1;
  selectedSize = '';
  activeImage = '';
  linkCopied = false;
  Math = Math;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.isLoading = true;
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.activeImage = product.images?.[0] || product.image;
        this.loadReviews(id);
        this.isLoading = false;
      },
      error: () => {
        this.showToast('Product not found', 'This product does not exist', 'error');
        this.isLoading = false;
      }
    });
  }

  loadReviews(productId: string): void {
    this.productsService.getProductReviews(productId).subscribe({
      next: (response) => {
        this.reviews = response.items;
      },
      error: () => {
        // Reviews optional
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product || this.product.stock === 0) return;

    this.cartsService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.showToast('Added to cart', `${this.product!.title} has been added to your cart`, 'success');
        this.quantity = 1;
      },
      error: () => {
        this.showToast('Error', 'Failed to add item to cart', 'error');
      }
    });
  }

  formatCategory(slug: string): string {
    if (!slug) return '';
    return slug
      .split('-')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /** Size pills like haxel.me product page (derived from category). */
  sizesFor(): string[] {
    const cat = (this.product?.category || '').toLowerCase();
    if (cat.includes('footwear')) return ['41', '42', '43', '44', '45'];
    if (cat.includes('legging') || cat.includes('women') || cat.includes('sports')) return ['XS', 'S', 'M', 'L'];
    if (cat.includes('lifestyle') || cat.includes('running')) return ['XS', 'S', 'M', 'L', 'XL'];
    if (cat.includes('t-shirt') || cat.includes('tops') || cat.includes('men')) return ['S', 'M', 'L', 'XL', 'XXL'];
    return ['S', 'M', 'L', 'XL', '2XL'];
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  galleryImages(): string[] {
    if (!this.product) return [];
    const imgs = this.product.images?.length ? this.product.images : [this.product.image];
    return imgs.filter(Boolean) as string[];
  }

  /** Rating distribution % for the review bars (falls back to average-weighted). */
  ratingPercent(star: number): number {
    const r = this.product?.rating;
    if (!r || !r.count) return 0;
    const direct = r.distribution?.[star];
    if (typeof direct === 'number') return Math.round((direct / r.count) * 100);
    return 0;
  }

  copyLink(): void {
    try {
      const url = window.location.href;
      void navigator.clipboard?.writeText(url);
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
      this.showToast('Link copied', 'Product link copied to clipboard', 'success');
    } catch {
      this.showToast('Error', 'Could not copy link', 'error');
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  private showToast(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.toast.type = type;
    this.toast.title = title;
    this.toast.message = message;
    this.toast.show();
  }
}


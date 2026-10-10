import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CartItem, CartSummary } from '../../models';
import { Router } from '@angular/router';
import { UiToastComponent } from '../../../shared/ui/components/toast/toast.component';
import { UiConfirmationComponent } from '../../../shared/ui/components/confirmation/confirmation.component';
import { CART_SERVICE_TOKEN, PRODUCT_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // DIP: Inject via tokens (abstraction), not concrete classes
  private cartService = inject(CART_SERVICE_TOKEN);
  private productsService = inject(PRODUCT_SERVICE_TOKEN);
  private router = inject(Router);

  @ViewChild('toast') toast!: UiToastComponent;
  @ViewChild('confirm') confirm!: UiConfirmationComponent;

  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    itemCount: 0,
    uniqueProducts: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };
  couponCode = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.cartState$.subscribe(state => {
      this.cartItems = state.items;
      this.loadProductDetails(this.cartItems);
      this.cartSummary = this.cartService.getCartSummary();
    });
  }

  private loadProductDetails(items: CartItem[]): void {
    items.forEach(item => {
      if (!item.product) {
        this.productsService.getProductById(item.productId).subscribe({
          next: (product) => {
            item.product = product;
          }
        });
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateQuantity(item);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item);
    }
  }

  getCartSummary() {
    return this.cartSummary;
  }

  updateQuantity(item: CartItem): void {
    this.cartService.updateCartItem({
      productId: item.productId,
      quantity: item.quantity
    }).subscribe();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.productId).subscribe(() => {
      this.showToast('Item removed', 'Item has been removed from your cart', 'success');
    });
  }

  showClearConfirm(): void {
    this.confirm.open();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.showToast('Cart cleared', 'Your cart is now empty', 'info');
    });
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.showToast('Invalid coupon', 'Please enter a coupon code', 'error');
      return;
    }

    this.cartService.applyCoupon(this.couponCode).subscribe({
      next: (response) => {
        this.showToast('Coupon applied', response.message, 'success');
        this.couponCode = '';
      },
      error: () => {
        this.showToast('Invalid coupon', 'This coupon code is not valid', 'error');
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  private showToast(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.toast.type = type;
    this.toast.title = title;
    this.toast.message = message;
    this.toast.show();
  }
}


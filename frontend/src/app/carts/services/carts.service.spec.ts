import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartsService } from './carts.service';
import { CartItem } from '../models';

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    service = TestBed.inject(CartsService);
    // clear local storage for pure tests
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Cart Operations', () => {
    it('should add item to cart', fakeAsync(() => {
      let result: CartItem | undefined;
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe(r => result = r);
      tick(200);
      expect(result).toBeDefined();
      expect(result?.productId).toBe('p1');
      expect(result?.quantity).toBe(2);
      expect(service.getItemCount()).toBe(1);
    }));

    it('should increment quantity if item already in cart', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 1 }).subscribe();
      tick(200);
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      let cartItems: CartItem[] = [];
      service.cartItems$.subscribe(items => cartItems = items);
      expect(cartItems[0].quantity).toBe(3);
    }));

    it('should remove item from cart', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      service.removeFromCart('p1').subscribe();
      tick(200);
      expect(service.getItemCount()).toBe(0);
    }));

    it('should update cart item quantity', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      service.updateCartItem({ productId: 'p1', quantity: 5 }).subscribe();
      tick(200);
      let cartItems: CartItem[] = [];
      service.cartItems$.subscribe(items => cartItems = items);
      expect(cartItems[0].quantity).toBe(5);
    }));

    it('should remove item if updated quantity is <= 0', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      service.updateCartItem({ productId: 'p1', quantity: 0 }).subscribe();
      tick(200);
      expect(service.getItemCount()).toBe(0);
    }));

    it('should throw error if updating non-existent item', fakeAsync(() => {
      let error: any;
      service.updateCartItem({ productId: 'none', quantity: 5 }).subscribe({
        error: (e) => error = e
      });
      tick(200);
      expect(error.message).toBe('Item not found in cart');
    }));

    it('should clear cart', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      service.clearCart().subscribe();
      tick(300);
      expect(service.getItemCount()).toBe(0);
      expect(localStorage.getItem('cart')).toBeNull();
    }));

    it('should get current cart state', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 2 }).subscribe();
      tick(200);
      service.getCart().subscribe(cart => {
        expect(cart.items.length).toBe(1);
      });
      tick(200);
      const current = service.getCurrentCart();
      expect(current.items.length).toBe(1);
    }));
  });

  describe('Checkout and Coupons', () => {
    it('should create checkout', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 1 }).subscribe();
      tick(200);
      let checkout: any;
      service.createCheckout('express').subscribe(c => checkout = c);
      tick(300);
      expect(checkout.shippingMethod).toBe('express');
      expect(checkout.shippingCost).toBe(20);
    }));

    it('should throw error creating checkout with empty cart', fakeAsync(() => {
      let error: any;
      service.createCheckout().subscribe({
        error: e => error = e
      });
      tick(300);
      expect(error.message).toBe('Cart is empty');
    }));

    it('should apply valid coupon', fakeAsync(() => {
      service.addToCart({ productId: 'p1', quantity: 1 }).subscribe();
      tick(200);
      let result: any;
      service.applyCoupon('SAVE10').subscribe(r => result = r);
      tick(300);
      expect(result.message).toContain('Coupon applied');
    }));

    it('should throw error for invalid coupon', fakeAsync(() => {
      let error: any;
      service.applyCoupon('INVALID').subscribe({
        error: e => error = e
      });
      tick(300);
      expect(error.message).toBe('Invalid coupon code');
    }));

    it('should remove coupon', fakeAsync(() => {
      service.applyCoupon('SAVE10').subscribe();
      tick(300);
      service.removeCoupon().subscribe();
      tick(200);
      const cart = service.getCurrentCart();
      expect(cart.discount).toBeUndefined();
    }));
  });

  describe('Server Operations', () => {
    it('should create order', fakeAsync(() => {
      let result: any;
      service.createOrder({}).subscribe(r => result = r);
      tick(500);
      expect(result.success).toBe(true);
    }));
  });
});

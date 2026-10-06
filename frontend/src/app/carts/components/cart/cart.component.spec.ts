import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartComponent } from './cart.component';
import { CART_SERVICE_TOKEN, PRODUCT_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: any;
  let mockProductsService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCartService = {
      cartState$: of({ items: [{ productId: 'p1', quantity: 2, price: 10 }] }),
      getCartSummary: jasmine.createSpy('getCartSummary').and.returnValue({ itemCount: 1, uniqueProducts: 1, subtotal: 20, tax: 0, shipping: 0, total: 20 }),
      updateCartItem: jasmine.createSpy('updateCartItem').and.returnValue(of({})),
      removeFromCart: jasmine.createSpy('removeFromCart').and.returnValue(of({})),
      clearCart: jasmine.createSpy('clearCart').and.returnValue(of({})),
      applyCoupon: jasmine.createSpy('applyCoupon').and.returnValue(of({ message: 'Success' }))
    };

    mockProductsService = {
      getProductById: jasmine.createSpy('getProductById').and.returnValue(of({ id: 'p1', name: 'Product 1' }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ CartComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: CART_SERVICE_TOKEN, useValue: mockCartService },
        { provide: PRODUCT_SERVICE_TOKEN, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // Mock child components after detectChanges so ViewChild queries don't overwrite them
    component.toast = { show: jasmine.createSpy('show') } as any;
    component.confirm = { open: jasmine.createSpy('open') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    expect(component.cartItems.length).toBe(1);
    expect(mockProductsService.getProductById).toHaveBeenCalledWith('p1');
    expect(component.cartSummary.total).toBe(20);
  });

  it('should increase quantity', () => {
    const item = { productId: 'p1', quantity: 2, price: 10, addedAt: new Date() };
    component.increaseQuantity(item);
    expect(item.quantity).toBe(3);
    expect(mockCartService.updateCartItem).toHaveBeenCalled();
  });

  it('should decrease quantity', () => {
    const item = { productId: 'p1', quantity: 2, price: 10, addedAt: new Date() };
    component.decreaseQuantity(item);
    expect(item.quantity).toBe(1);
    expect(mockCartService.updateCartItem).toHaveBeenCalled();
  });

  it('should not decrease quantity below 1', () => {
    const item = { productId: 'p1', quantity: 1, price: 10, addedAt: new Date() };
    component.decreaseQuantity(item);
    expect(item.quantity).toBe(1);
    expect(mockCartService.updateCartItem).not.toHaveBeenCalled();
  });

  it('should return cart summary', () => {
    expect(component.getCartSummary()).toEqual({ itemCount: 1, uniqueProducts: 1, subtotal: 20, tax: 0, shipping: 0, total: 20 });
  });

  it('should remove item', () => {
    const item = { productId: 'p1', quantity: 1, price: 10, addedAt: new Date() };
    component.removeItem(item);
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('p1');
    expect(component.toast.show).toHaveBeenCalled();
  });

  it('should show clear confirm', () => {
    component.showClearConfirm();
    expect(component.confirm.open).toHaveBeenCalled();
  });

  it('should clear cart', () => {
    component.clearCart();
    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(component.toast.show).toHaveBeenCalled();
  });

  it('should apply coupon', () => {
    component.couponCode = 'SAVE10';
    component.applyCoupon();
    expect(mockCartService.applyCoupon).toHaveBeenCalledWith('SAVE10');
    expect(component.toast.show).toHaveBeenCalled();
    expect(component.couponCode).toBe('');
  });

  it('should show error for empty coupon', () => {
    component.couponCode = '   ';
    component.applyCoupon();
    expect(component.toast.show).toHaveBeenCalled();
  });

  it('should show error for invalid coupon', () => {
    mockCartService.applyCoupon.and.returnValue(throwError(() => new Error('Invalid')));
    component.couponCode = 'INVALID';
    component.applyCoupon();
    expect(component.toast.show).toHaveBeenCalled();
  });

  it('should proceed to checkout', () => {
    component.proceedToCheckout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should continue shopping', () => {
    component.continueShopping();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CART_SERVICE_TOKEN, AUTH_SERVICE_TOKEN, ORDER_SERVICE_TOKEN } from '../shared/interfaces/dependency-injection';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let authServiceSpy: any;
  let orderServiceSpy: any;
  let cartsServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    cartsServiceSpy = jasmine.createSpyObj('CartsService', ['getCartItems', 'clearCart']) as any;

    authServiceSpy.getCurrentUser.and.returnValue(null);
    cartsServiceSpy.cartState$ = of([]);

    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: CART_SERVICE_TOKEN, useValue: cartsServiceSpy },
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceSpy },
        { provide: ORDER_SERVICE_TOKEN, useValue: orderServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;

    // Mock ViewChild refs to prevent null errors
    component.toast = jasmine.createSpyObj('UiToastComponent', ['show']);
    component.confirm = jasmine.createSpyObj('UiConfirmationComponent', ['open']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create checkout form with required fields', () => {
      expect(component.checkoutForm).toBeDefined();
      expect(component.checkoutForm.get('firstName')).not.toBeNull();
      expect(component.checkoutForm.get('lastName')).not.toBeNull();
      expect(component.checkoutForm.get('streetAddress')).not.toBeNull();
      expect(component.checkoutForm.get('city')).not.toBeNull();
      expect(component.checkoutForm.get('state')).not.toBeNull();
      expect(component.checkoutForm.get('zipCode')).not.toBeNull();
      expect(component.checkoutForm.get('country')).not.toBeNull();
    });

    it('should have paymentMethod defaulted to "card"', () => {
      expect(component.checkoutForm.get('paymentMethod')?.value).toBe('card');
    });

    it('should be invalid when required fields are empty', () => {
      expect(component.checkoutForm.valid).toBeFalse();
    });

    it('should be valid when all required fields are filled', () => {
      component.checkoutForm.setValue({
        firstName: 'Mostafa',
        lastName: 'Said',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        paymentMethod: 'card'
      });
      expect(component.checkoutForm.valid).toBeTrue();
    });
  });

  describe('calculateTotal()', () => {
    it('should calculate subtotal from cartItems', () => {
      component.cartItems = [
        { price: 29.99, quantity: 2 } as any,
        { price: 9.99, quantity: 1 } as any
      ];
      component.calculateTotal();
      expect(component.subtotal).toBeCloseTo(69.97, 1);
    });

    it('should add 10% tax to get total', () => {
      component.cartItems = [{ price: 100, quantity: 1 } as any];
      component.calculateTotal();
      expect(component.total).toBeCloseTo(110, 1);
    });

    it('should return 0 totals for empty cart', () => {
      component.cartItems = [];
      component.calculateTotal();
      expect(component.subtotal).toBe(0);
      expect(component.total).toBe(0);
    });
  });

  describe('populateUserInfo()', () => {
    it('should patch form with user info when user is logged in', () => {
      authServiceSpy.getCurrentUser.and.returnValue({
        name: 'Mostafa Said',
        address: '123 ZYRO St'
      } as any);
      component.populateUserInfo();
      expect(component.checkoutForm.get('firstName')?.value).toBe('Mostafa');
      expect(component.checkoutForm.get('lastName')?.value).toBe('Said');
    });

    it('should not patch form when no user is logged in', () => {
      authServiceSpy.getCurrentUser.and.returnValue(null);
      component.checkoutForm.reset();
      component.populateUserInfo();
      expect(component.checkoutForm.get('firstName')?.value).toBeFalsy();
    });
  });

  describe('onSubmit()', () => {
    it('should not open confirm when form is invalid', () => {
      component.confirm = jasmine.createSpyObj('UiConfirmationComponent', ['open']);
      component.checkoutForm.reset();
      component.onSubmit();
      expect(component.confirm.open).not.toHaveBeenCalled();
    });

    it('should open confirm dialog when form is valid', () => {
      component.confirm = jasmine.createSpyObj('UiConfirmationComponent', ['open']);
      component.checkoutForm.setValue({
        firstName: 'A', lastName: 'B', streetAddress: 'C',
        city: 'D', state: 'E', zipCode: 'F', country: 'G', paymentMethod: 'card'
      });
      component.onSubmit();
      expect(component.confirm.open).toHaveBeenCalled();
    });
  });

  describe('isProcessing', () => {
    it('should start as false', () => {
      expect(component.isProcessing).toBeFalse();
    });
  });
});

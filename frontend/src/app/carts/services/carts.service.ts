import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Cart, CartItem, CartState, CartSummary, AddToCartRequest, UpdateCartItemRequest, CheckoutData } from '../models';
import { StorageService } from '../../shared/services/storage.service';
import { CacheService } from '../../shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private storageService = inject(StorageService);
  private cacheService = inject(CacheService);
  private http = inject(HttpClient);

  // State Management
  private cartStateSubject = new BehaviorSubject<CartState>({
    items: this.loadCartFromStorage(),
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: undefined,
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null
  });

  public cartState$ = this.cartStateSubject.asObservable();
  public cartItems$ = this.cartState$.pipe(map((state: CartState) => state.items));
  public cartTotal$ = this.cartState$.pipe(map((state: CartState) => state.total));
  public cartItemCount$ = this.cartState$.pipe(map((state: CartState) => state.itemCount));
  public cartSummary$ = this.cartState$.pipe(
    map((state: CartState) => this.createCartSummary(state))
  );

  // Tax rate (default 10%)
  private readonly TAX_RATE = 0.10;
  private readonly SHIPPING_COST = 10;

  // Storage configuration
  private readonly CART_STORAGE_KEY = 'cart_items';
  private readonly CART_SUMMARY_KEY = 'cart_summary';
  private readonly CART_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours for persistent storage

  constructor() {
    this.initializeCart();
    this.setupMultiTabSync();
  }

  // ============ Cart Operations ============

  addToCart(request: AddToCartRequest): Observable<CartItem> {
    const state = this.cartStateSubject.value;
    const existingItem = state.items.find(item => item.productId === request.productId);

    let cartItem: CartItem;

    if (existingItem) {
      existingItem.quantity += request.quantity;
      cartItem = existingItem;
    } else {
      cartItem = {
        productId: request.productId,
        quantity: request.quantity,
        price: 0, // Should come from product service in real app
        addedAt: new Date()
      };
      state.items.push(cartItem);
    }

    this.updateCartState();
    return of(cartItem).pipe(delay(200));
  }

  removeFromCart(productId: string): Observable<CartItem | void> {
    const state = this.cartStateSubject.value;
    const removedItem = state.items.find(item => item.productId === productId);
    state.items = state.items.filter(item => item.productId !== productId);
    this.updateCartState();
    return of(removedItem).pipe(delay(200));
  }

  updateCartItem(request: UpdateCartItemRequest): Observable<CartItem> {
    const state = this.cartStateSubject.value;
    const item = state.items.find(i => i.productId === request.productId);

    if (!item) {
      return throwError(() => new Error('Item not found in cart'));
    }

    if (request.quantity <= 0) {
      const removedItem = item;
      state.items = state.items.filter(i => i.productId !== request.productId);
      this.updateCartState();
      return of(removedItem).pipe(delay(200));
    }

    item.quantity = request.quantity;
    this.updateCartState();
    return of(item).pipe(delay(200));
  }

  clearCart(): Observable<void> {
    this.cartStateSubject.next({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: undefined,
      total: 0,
      itemCount: 0,
      isLoading: false,
      error: null
    });
    
    // Clear from all storage locations
    this.storageService.remove(this.CART_STORAGE_KEY, 'localStorage');
    this.cacheService.remove(this.CART_SUMMARY_KEY);
    
    return of(void 0).pipe(delay(300));
  }

  getCart(): Observable<Cart> {
    const state = this.cartStateSubject.value;
    const cart: Cart = {
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      total: state.total,
      lastUpdated: new Date()
    };
    return of(cart).pipe(delay(200));
  }

  // ============ Checkout ============

  createCheckout(shippingMethod: 'standard' | 'express' | 'overnight' = 'standard'): Observable<CheckoutData> {
    const state = this.cartStateSubject.value;

    if (state.items.length === 0) {
      return throwError(() => new Error('Cart is empty'));
    }

    const shippingCosts = {
      standard: 10,
      express: 20,
      overnight: 50
    };

    const checkoutData: CheckoutData = {
      cartItems: state.items,
      shippingMethod,
      shippingCost: shippingCosts[shippingMethod],
      taxAmount: state.tax,
      couponCode: undefined,
      discountAmount: state.discount,
      total: state.total
    };

    return of(checkoutData).pipe(delay(300));
  }

  applyCoupon(couponCode: string): Observable<{ discountAmount: number; message: string }> {
    // Mock coupon logic
    const discounts: Record<string, number> = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'FREESHIP': this.SHIPPING_COST / 100
    };

    const discountPercent = discounts[couponCode];
    if (!discountPercent) {
      return throwError(() => new Error('Invalid coupon code'));
    }

    const state = this.cartStateSubject.value;
    const discountAmount = state.subtotal * discountPercent;

    state.discount = discountAmount;
    this.updateCartState();

    return of({
      discountAmount,
      message: `Coupon applied! You saved LE ${discountAmount.toFixed(2)}`
    }).pipe(delay(300));
  }

  removeCoupon(): Observable<void> {
    const state = this.cartStateSubject.value;
    state.discount = undefined;
    this.updateCartState();
    return of(void 0).pipe(delay(200));
  }

  // ============ Server Operations ============

  createOrder(_model: unknown): Observable<unknown> {
    void _model;
    // This would call the actual API in a real application
    return of({ success: true, orderId: Math.random().toString(36).substr(2, 9) }).pipe(delay(500));
  }

  getCartSummary(): CartSummary {
    const state = this.cartStateSubject.value;
    return this.createCartSummary(state);
  }

  // ============ State Management ============

  getCurrentCart(): Cart {
    const state = this.cartStateSubject.value;
    return {
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      total: state.total,
      lastUpdated: new Date()
    };
  }

  getItemCount(): number {
    return this.cartStateSubject.value.itemCount;
  }

  // ============ Private Methods ============

  /**
   * Initialize cart from localStorage
   */
  private initializeCart(): void {
    const items = this.loadCartFromStorage();
    const state = this.cartStateSubject.value;
    state.items = items;
    this.updateCartState();
  }

  /**
   * Setup multi-tab synchronization via storage events
   * Synchronizes cart changes across browser tabs
   */
  private setupMultiTabSync(): void {
    window.addEventListener('storage', (event: StorageEvent) => {
      // Handle cart items sync from other tabs
      if (event.key === this.CART_STORAGE_KEY && event.newValue) {
        try {
          const updatedItems = JSON.parse(event.newValue) as CartItem[];
          const state = this.cartStateSubject.value;
          state.items = updatedItems;
          this.updateCartState();
          console.log('Cart synchronized from other tab');
        } catch (error) {
          console.error('Error syncing cart from other tab:', error);
        }
      }

      // Handle cart summary sync
      if (event.key === this.CART_SUMMARY_KEY) {
        // Clear summary cache so it recalculates
        this.cacheService.remove(this.CART_SUMMARY_KEY);
      }
    });
  }

  /**
   * Update cart state and persist to storage
   */
  private updateCartState(): void {
    const state = this.cartStateSubject.value;
    const items = state.items;

    // Calculate subtotal
    let subtotal = 0;
    items.forEach((item: CartItem) => {
      subtotal += item.price * item.quantity;
    });

    // Calculate tax
    const tax = subtotal * this.TAX_RATE;

    // Calculate total
    const discount = state.discount || 0;
    const total = subtotal + tax + this.SHIPPING_COST - discount;

    // Update state
    const updatedState: CartState = {
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: this.SHIPPING_COST,
      discount: discount > 0 ? Math.round(discount * 100) / 100 : undefined,
      total: Math.round(total * 100) / 100,
      itemCount: items.length,
      isLoading: false,
      error: null
    };

    this.cartStateSubject.next(updatedState);

    // Persist to localStorage (no TTL = permanent until clear)
    this.storageService.set(this.CART_STORAGE_KEY, items, 'localStorage', 0);

    // Cache summary in memory for quick access (1 hour TTL)
    this.cacheService.set(this.CART_SUMMARY_KEY, this.createCartSummary(updatedState), 60 * 60 * 1000);
  }

  /**
   * Create cart summary from state
   */
  private createCartSummary(state: CartState): CartSummary {
    const uniqueProducts = new Set(state.items.map(item => item.productId)).size;
    return {
      itemCount: state.itemCount,
      uniqueProducts,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      total: state.total
    };
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = this.storageService.get<CartItem[]>(this.CART_STORAGE_KEY, 'localStorage');
      return stored || [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  /**
   * Invalidate cart cache (call on checkout completion)
   */
  invalidateCartCache(): void {
    this.cacheService.remove(this.CART_SUMMARY_KEY);
    this.cacheService.invalidate('cart:*');
  }

  /**
   * Get current cart without waiting for observable
   */
  getCurrentCartSync(): CartState {
    return this.cartStateSubject.value;
  }
}

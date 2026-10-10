// Interface Segregation Principle: Clients depend only on methods they use
// Each interface should have a single purpose

import { Observable } from 'rxjs';
import { AddToCartRequest, UpdateCartItemRequest, CartSummary, Cart, CartItem } from '../../carts/models';
import { AuthCredentials, RegisterData, User, UserProfile, AuthResponse } from '../../auth/models';
import { Product, ProductPage, ProductFilter, Category, Review } from '../../products/models';
import { Order, OrderItem, ShippingAddress, PaymentMethod, OrderPage, OrderFilter, OrderStatus } from '../../orders/models';

// ============ PRODUCT SERVICE INTERFACES (SEGREGATED) ============

// ISP: Clients reading products only need query methods
export interface IProductQuery {
  getProducts(filter?: ProductFilter, page?: number, pageSize?: number): Observable<ProductPage>;
  getProductById(id: string): Observable<Product>;
  searchProducts(query: string, page?: number, pageSize?: number): Observable<ProductPage>;
}

// ISP: Clients accessing categories only need category methods
export interface ICategoryQuery {
  getCategories(): Observable<Category[]>;
  getProductsByCategory(categoryId: string, page?: number, pageSize?: number): Observable<ProductPage>;
}

// ISP: Clients accessing reviews only need review methods
export interface IProductReviewQuery {
  getProductReviews(productId: string, page?: number, pageSize?: number): Observable<{ items: Review[]; total: number }>;
}

// ISP: Clients accessing featured products only need featured methods
export interface IFeaturedProductQuery {
  getFeaturedProducts(limit?: number): Observable<Product[]>;
}

// COMPOSITE: For components that need full product service
export interface IProductService extends IProductQuery, ICategoryQuery, IProductReviewQuery, IFeaturedProductQuery {}

// ============ CART SERVICE INTERFACES (SEGREGATED) ============

// ISP: Clients reading cart only need read operations
export interface ICartQuery {
  getCart(): Observable<Cart>;
  getCartSummary(): CartSummary;
  cartState$: Observable<Cart>;
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartItemCount$: Observable<number>;
}

// ISP: Clients modifying cart only need write operations
export interface ICartMutation {
  addToCart(request: AddToCartRequest): Observable<Cart>;
  removeFromCart(productId: string): Observable<Cart>;
  updateCartItem(request: UpdateCartItemRequest): Observable<Cart>;
  clearCart(): Observable<void>;
}

// ISP: Clients applying coupons only need coupon methods
export interface ICouponOperations {
  applyCoupon(code: string): Observable<{ discountAmount: number; message: string }>;
  removeCoupon(): Observable<void>;
}

// COMPOSITE: For components that need full cart service
export interface ICartService extends ICartQuery, ICartMutation, ICouponOperations {}

// ============ AUTHENTICATION SERVICE INTERFACES (SEGREGATED) ============

// ISP: Clients doing authentication only need auth methods
export interface IAuthOperation {
  login(credentials: AuthCredentials): Observable<AuthResponse>;
  logout(): Observable<void>;
  register(data: RegisterData): Observable<AuthResponse>;
  isAuthenticated(): boolean;
}

// ISP: Clients accessing user info only need profile methods
export interface IUserProfileQuery {
  getCurrentUser(): User | null;
  getUserProfile(): Observable<UserProfile>;
  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile>;
}

// ISP: Clients monitoring auth state only need auth state observable
export interface IAuthStateObserver {
  authState$: Observable<any>;
}

// COMPOSITE: For components that need full authentication service
export interface IAuthenticationService extends IAuthOperation, IUserProfileQuery, IAuthStateObserver {}

// ============ ORDER SERVICE INTERFACES (SEGREGATED) ============

// ISP: Clients creating orders only need creation method
export interface IOrderCreation {
  createOrder(items: OrderItem[], shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Observable<Order>;
}

// ISP: Clients querying orders only need read methods
export interface IOrderQuery {
  getOrders(page?: number, pageSize?: number, filter?: OrderFilter): Observable<OrderPage>;
  getOrderById(id: string): Observable<Order>;
}

// ISP: Clients managing orders only need management methods
export interface IOrderManagement {
  updateOrderStatus(orderId: string, status: OrderStatus, message: string): Observable<Order>;
  cancelOrder(orderId: string, reason: string): Observable<Order>;
  returnOrder(orderId: string, reason: string): Observable<Order>;
}

// COMPOSITE: For components that need full order service
export interface IOrderService extends IOrderCreation, IOrderQuery, IOrderManagement {}

// ============ PASSWORD SERVICE INTERFACE ============

export interface IPasswordService {
  changePassword(oldPassword: string, newPassword: string): Observable<void>;
  resetPassword(email: string): Observable<void>;
  validatePasswordStrength(password: string): { score: number; feedback: string[] };
}

// ============ TWO-FACTOR AUTH SERVICE INTERFACE ============

export interface ITwoFactorService {
  enableTwoFactor(): Observable<{ secret: string; qrCode: string }>;
  verifyTwoFactor(code: string): Observable<boolean>;
  disableTwoFactor(): Observable<void>;
}

// ============ NOTIFICATION SERVICE INTERFACE ============

export interface INotificationService {
  showSuccess(title: string, message: string): void;
  showError(title: string, message: string): void;
  showInfo(title: string, message: string): void;
  showWarning(title: string, message: string): void;
}

// ============ CALCULATION SERVICE INTERFACE ============

export interface ICalculationService {
  calculateTax(subtotal: number): number;
  calculateShipping(method: string): number;
  calculateDiscount(subtotal: number, percent: number): number;
  calculateTotal(subtotal: number, tax: number, shipping: number, discount: number): number;
}

// ============ FILTER & SORT SERVICE INTERFACES ============

// ISP: Clients filtering only need filter methods
export interface IFilterService {
  filter(items: Product[], filters: unknown): Product[];
}

// ISP: Clients sorting only need sort methods
export interface ISortService {
  sort(items: Product[], sortBy: string): Product[];
}

// ============ STRATEGY SERVICE INTERFACES ============

// DIP: ProductsService depends on ISortStrategy abstraction, not concrete SortStrategyService
export interface ISortStrategy {
  sort(items: Product[], sortBy: string): Product[];
}

// DIP: ProductsService depends on IFilterStrategy abstraction, not concrete FilterStrategyService
export interface IFilterStrategy {
  filter(items: Product[], filters: unknown): Product[];
}

// ============ REVIEW SERVICE INTERFACE ============

export interface IReviewService {
  getReviews(productId: string): Observable<Review[]>;
  getAverageRating(productId: string): Observable<number>;
  addReview(review: Review): Observable<void>;
  deleteReview(reviewId: string): Observable<void>;
}

// Interface Segregation: Separate concerns into focused interfaces

import { Observable } from 'rxjs';
import { CartItem } from '../../carts/models';

// Read operations only
export interface IProductRepository {
  getAll(): Promise<unknown[]>;
  getById(id: string): Promise<unknown>;
  search(query: string): Promise<unknown[]>;
}

// Write operations only
export interface IProductPersistence {
  save(product: unknown): Promise<void>;
  delete(id: string): Promise<void>;
  update(id: string, product: unknown): Promise<void>;
}

// Cart business operations
export interface ICartOperations {
  addItem(productId: string, quantity: number): void;
  removeItem(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  clearCart(): void;
  applyCoupon(couponCode: string): void;
}

// Cart state only
export interface ICartState {
  items$: Observable<CartItem[]>;
  total$: Observable<number>;
  isLoading$: Observable<boolean>;
}

// Authentication operations
export interface IAuthOperations {
  login(email: string, password: string): Promise<void>;
  logout(): void;
  register(email: string, password: string, name: string): Promise<void>;
}

// Password management (separate from auth)
export interface IPasswordManagement {
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  verifyPasswordToken(token: string): Promise<boolean>;
}

// Two-factor authentication (separate from auth)
export interface ITwoFactorAuth {
  enableTwoFactor(): Promise<string>;
  disableTwoFactor(code: string): Promise<void>;
  verifyTwoFactor(code: string): Promise<boolean>;
}

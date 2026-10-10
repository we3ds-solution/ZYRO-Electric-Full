// Liskov Substitution Principle: Subtypes must be substitutable for their base types
// Interface Segregation: Clients depend only on methods they use

import { Observable } from 'rxjs';
import { Product, Review } from '../../products/models';
import { CartItem } from '../../carts/models';
import { Order } from '../../orders/models';

// ============ REPOSITORY INTERFACES ============

/** Read-only repository - clients don't need write operations */
export interface IReadRepository<T> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | undefined>;
  search(query: string): Observable<T[]>;
}

/** Write-only repository - for persistence layer */
export interface IWriteRepository<T> {
  save(item: T): Observable<T>;
  update(id: string, item: Partial<T>): Observable<T>;
  delete(id: string): Observable<void>;
}

/** Combined repository */
export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T> {}

// ============ PRODUCT REPOSITORIES ============

export interface IProductRepository extends IReadRepository<Product> {
  getByCategory(categoryId: string): Observable<Product[]>;
  getFeatured(): Observable<Product[]>;
  getTopRated(): Observable<Product[]>;
}

// ============ CART REPOSITORIES ============

export interface ICartReadRepository {
  getItems(): Observable<CartItem[]>;
  getItemCount(): Observable<number>;
  getTotal(): Observable<number>;
}

export interface ICartWriteRepository {
  addItem(item: CartItem): Observable<void>;
  removeItem(productId: string): Observable<void>;
  updateQuantity(productId: string, quantity: number): Observable<void>;
  clear(): Observable<void>;
}

// ============ ORDER REPOSITORIES ============

export interface IOrderRepository extends IRepository<Order> {
  getByUserId(userId: string): Observable<Order[]>;
  getByStatus(status: string): Observable<Order[]>;
}

// ============ REVIEW REPOSITORIES ============

export interface IReviewRepository extends IRepository<Review> {
  getByProductId(productId: string): Observable<Review[]>;
  getAverageRating(productId: string): Observable<number>;
}

// ============ STATE MANAGEMENT INTERFACES ============

export interface IStateReader<T> {
  getValue(): Observable<T>;
  select<K>(selector: (state: T) => K): Observable<K>;
}

export interface IStateWriter<T> {
  setValue(value: T): void;
  updateState(updater: (current: T) => T): void;
}

export interface IState<T> extends IStateReader<T>, IStateWriter<T> {}

// Dependency Inversion: High-level modules depend on abstractions, not low-level details

import { InjectionToken } from '@angular/core';
import {
  IProductService,
  ICartService,
  IAuthenticationService,
  INotificationService,
  ICalculationService,
  IOrderService,
  ISortStrategy,
  IFilterStrategy
} from './business-logic';
import {
  IProductRepository,
  ICartReadRepository,
  IOrderRepository
} from './repositories';
import { PersistenceService } from '../services/persistence.service';

// ============ INJECTION TOKENS ============

/**
 * Injection tokens allow swapping implementations without changing code
 * Follows Dependency Inversion Principle
 */

export const PRODUCT_SERVICE_TOKEN = new InjectionToken<IProductService>('ProductService');
export const CART_SERVICE_TOKEN = new InjectionToken<ICartService>('CartService');
export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthenticationService>('AuthService');
export const ORDER_SERVICE_TOKEN = new InjectionToken<IOrderService>('OrderService');
export const NOTIFICATION_SERVICE_TOKEN = new InjectionToken<INotificationService>('NotificationService');
export const CALCULATION_SERVICE_TOKEN = new InjectionToken<ICalculationService>('CalculationService');

export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<IProductRepository>('ProductRepository');
export const CART_REPOSITORY_TOKEN = new InjectionToken<ICartReadRepository>('CartRepository');
export const ORDER_REPOSITORY_TOKEN = new InjectionToken<IOrderRepository>('OrderRepository');

export const PERSISTENCE_SERVICE_TOKEN = new InjectionToken<PersistenceService>('PersistenceService');

// DIP: Strategy tokens depend on abstractions, not concrete classes
export const SORT_STRATEGY_TOKEN = new InjectionToken<ISortStrategy>('SortStrategy');
export const FILTER_STRATEGY_TOKEN = new InjectionToken<IFilterStrategy>('FilterStrategy');

// ============ PROVIDER CONFIGURATION ============

export const SOLID_PROVIDERS = [
  // Services provided through injection tokens
  // This allows swapping implementations per environment
];

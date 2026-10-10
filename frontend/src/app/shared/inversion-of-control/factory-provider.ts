// Dependency Inversion: Factory Provider pattern
// Creates service instances based on configuration, not hardcoded in components

import { Provider } from '@angular/core';
import { ProductsService } from '../../products/services/products.service';
import { CartsService } from '../../carts/services/carts.service';
import { AuthService } from '../../auth/services/auth.service';
import { OrderService } from '../../orders/services/order.service';

/**
 * Factory Provider Configuration
 * Allows swapping implementations per environment
 * Production: Real API calls
 * Development: Mock data
 * Testing: Test doubles
 */
export class FactoryProvider {
  /**
   * Create providers for production environment
   */
  static getProductionProviders(): Provider[] {
    return [
      {
        provide: 'ProductService',
        useClass: ProductsService
      },
      {
        provide: 'CartService',
        useClass: CartsService
      },
      {
        provide: 'AuthService',
        useClass: AuthService
      },
      {
        provide: 'OrderService',
        useClass: OrderService
      }
    ];
  }

  /**
   * Create providers for development environment
   */
  static getDevelopmentProviders(): Provider[] {
    return [
      {
        provide: 'ProductService',
        useClass: ProductsService // Can be swapped with MockProductsService
      },
      {
        provide: 'CartService',
        useClass: CartsService
      },
      {
        provide: 'AuthService',
        useClass: AuthService
      },
      {
        provide: 'OrderService',
        useClass: OrderService
      }
    ];
  }

  /**
   * Create providers for testing
   */
  static getTestingProviders(): Provider[] {
    return [
      {
        provide: 'ProductService',
        useValue: { getProducts: () => [] } // Mock implementation
      },
      {
        provide: 'CartService',
        useValue: { getCart: () => ({}) }
      },
      {
        provide: 'AuthService',
        useValue: { login: () => Promise.resolve() }
      },
      {
        provide: 'OrderService',
        useValue: { createOrder: () => Promise.resolve() }
      }
    ];
  }

  /**
   * Dynamic provider factory
   * Allows runtime configuration based on environment
   */
  static getProviders(environment: 'production' | 'development' | 'testing'): Provider[] {
    switch (environment) {
      case 'production':
        return this.getProductionProviders();
      case 'testing':
        return this.getTestingProviders();
      default:
        return this.getDevelopmentProviders();
    }
  }
}

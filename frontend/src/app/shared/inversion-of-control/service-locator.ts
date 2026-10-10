// Dependency Inversion: Service Locator pattern for managing dependencies
// Allows components to request dependencies without tight coupling

import { Injectable, Injector, inject } from '@angular/core';

/**
 * Service Locator
 * Provides a centralized way to access services via Angular's Injector
 * Implements Service Locator pattern for Dependency Inversion
 */
@Injectable({ providedIn: 'root' })
export class ServiceLocator {
  private static instance: ServiceLocator;
  private injector = inject(Injector);

  constructor() {
    ServiceLocator.instance = this;
  }

  static getInstance(): ServiceLocator {
    return ServiceLocator.instance;
  }

  /**
   * Get any service by token/class using Angular's Injector
   * Decouples component from direct service dependencies
   */
  getService<T>(serviceToken: unknown): T {
    try {
      return this.injector.get(serviceToken as unknown) as T;
    } catch (error) {
      console.error(`Service not found for token:`, serviceToken);
      throw error;
    }
  }

  /**
   * Get optional service - returns null if not found
   */
  getOptionalService<T>(serviceToken: unknown): T | null {
    try {
      return this.injector.get(serviceToken as unknown, null) as T | null;
    } catch {
      return null;
    }
  }

  /**
   * Check if service is registered
   */
  hasService(serviceToken: unknown): boolean {
    try {
      this.injector.get(serviceToken as unknown);
      return true;
    } catch {
      return false;
    }
  }
}

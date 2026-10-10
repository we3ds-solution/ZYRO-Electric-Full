// Dependency Inversion: Dependency Container (IoC Container)
// Manages service registration and resolution

import { Injectable, Type, InjectionToken } from '@angular/core';

export type ServiceType<T> = Type<T> | InjectionToken<T>;

interface ServiceDescriptor {
  provide: unknown;
  useClass?: unknown;
  useValue?: unknown;
  useFactory?: (...args: unknown[]) => unknown;
  deps?: unknown[];
}

/**
 * Dependency Container (IoC Container)
 * Manages service lifecycle and dependency resolution
 * Follows Dependency Inversion Principle
 */
@Injectable({ providedIn: 'root' })
export class DependencyContainer {
  private services = new Map<unknown, unknown>();
  private singletons = new Map<unknown, unknown>();

  /**
   * Register a service with its implementation
   */
  register<T>(provide: ServiceType<T>, implementation: Type<T> | unknown): void {
    this.services.set(provide, {
      provide,
      useClass: implementation
    });
  }

  /**
   * Register a singleton service (same instance everywhere)
   */
  registerSingleton<T>(provide: ServiceType<T>, implementation: Type<T> | unknown): void {
    const descriptor = {
      provide,
      useClass: implementation,
      isSingleton: true
    };
    this.services.set(provide, descriptor);
  }

  /**
   * Register a value service (constant)
   */
  registerValue<T>(provide: ServiceType<T>, value: T): void {
    this.services.set(provide, {
      provide,
      useValue: value
    });
  }

  /**
   * Register a factory function
   */
  registerFactory<T>(
    provide: ServiceType<T>,
    factory: (...args: unknown[]) => T,
    deps?: ServiceType<unknown>[]
  ): void {
    this.services.set(provide, {
      provide,
      useFactory: factory,
      deps: deps || []
    });
  }

  /**
   * Resolve/get a service instance
   */
  resolve<T>(provide: ServiceType<T>): T {
    const descriptor = this.services.get(provide);

    if (!descriptor) {
      throw new Error(`Service not registered: ${provide}`);
    }

    // Return singleton if already instantiated
    if ((descriptor as { isSingleton?: boolean }).isSingleton && this.singletons.has(provide)) {
      return this.singletons.get(provide) as T;
    }

    let instance: T;

    const d = descriptor as ServiceDescriptor;
    if (d.useValue !== undefined) {
      instance = d.useValue as T;
    } else if (d.useClass) {
      instance = new (d.useClass as Type<T>)();
    } else if (d.useFactory) {
      const deps = d.deps ? d.deps.map(dep => this.resolve(dep as ServiceType<unknown>)) : [];
      instance = (d.useFactory as (...args: unknown[]) => T)(...deps);
    } else {
      throw new Error(`Invalid service descriptor for ${provide}`);
    }

    // Cache singleton
    if ((descriptor as { isSingleton?: boolean }).isSingleton) {
      this.singletons.set(provide, instance);
    }

    return instance;
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Get all registered service tokens
   */
  getRegisteredServices(): unknown[] {
    return Array.from(this.services.keys());
  }
}

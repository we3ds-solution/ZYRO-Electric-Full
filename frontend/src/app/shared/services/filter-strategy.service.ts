import { Injectable } from '@angular/core';
import { Product } from '../../products/models';
import { IFilterStrategy } from '../interfaces/business-logic';

/**
 * Product filter criteria with strict type requirements
 */
export interface ProductFilterCriteria {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  searchQuery?: string;
}

// Single Responsibility: Handle product filtering only
// DIP: Implements IFilterStrategy interface - depends on abstraction
@Injectable({ providedIn: 'root' })
export class FilterStrategyService implements IFilterStrategy {
  /**
   * Filter products based on criteria
   * Validates filter shape strictly - rejects malformed filters
   */
  filter(products: Product[], filters: unknown): Product[] {
    // Validate and normalize filter object
    const validatedFilters = this.validateAndNormalizeFilters(filters);
    if (!validatedFilters) {
      return products; // Invalid filters, return unfiltered
    }

    return products.filter(product => this.matchesAllCriteria(product, validatedFilters));
  }

  /**
   * Validate filter object shape strictly
   * Ensures categories is string[], inStock is boolean (if present), etc.
   * Returns null if validation fails
   */
  private validateAndNormalizeFilters(filters: unknown): ProductFilterCriteria | null {
    // Guard: reject nullish and non-object values before any property access
    if (!this.isPlainObject(filters)) {
      return filters === null || filters === undefined ? {} : null;
    }

    const f = filters as Record<string, unknown>;
    const normalized: ProductFilterCriteria = {};

    // Validate categories - must be string[] if present
    if (f.hasOwnProperty('categories')) {
      if (!Array.isArray(f.categories)) {
        return null; // Reject - not an array
      }
      if (!f.categories.every(item => typeof item === 'string')) {
        return null; // Reject - contains non-string elements
      }
      if (f.categories.length > 0) {
        normalized.categories = f.categories;
      }
    }

    // Validate minPrice - must be number if present
    if (f.hasOwnProperty('minPrice')) {
      if (typeof f.minPrice !== 'number' || isNaN(f.minPrice) || f.minPrice < 0) {
        return null; // Reject - not a valid non-negative number
      }
      normalized.minPrice = f.minPrice;
    }

    // Validate maxPrice - must be number if present
    if (f.hasOwnProperty('maxPrice')) {
      if (typeof f.maxPrice !== 'number' || isNaN(f.maxPrice) || f.maxPrice < 0) {
        return null; // Reject - not a valid non-negative number
      }
      normalized.maxPrice = f.maxPrice;
    }

    // Validate price range consistency
    if (normalized.minPrice !== undefined && normalized.maxPrice !== undefined) {
      if (normalized.minPrice > normalized.maxPrice) {
        return null; // Reject - invalid range
      }
    }

    // Validate rating - must be number between 0 and 5 if present
    if (f.hasOwnProperty('rating')) {
      if (typeof f.rating !== 'number' || isNaN(f.rating) || f.rating < 0 || f.rating > 5) {
        return null; // Reject - not a valid rating
      }
      normalized.rating = f.rating;
    }

    // Validate inStock - must be boolean if present (NOT string, number, or null)
    if (f.hasOwnProperty('inStock')) {
      if (typeof f.inStock !== 'boolean') {
        return null; // Reject - must be strict boolean, not string or number
      }
      normalized.inStock = f.inStock;
    }

    // Validate searchQuery - must be string if present
    if (f.hasOwnProperty('searchQuery')) {
      if (typeof f.searchQuery !== 'string') {
        return null; // Reject - not a string
      }
      normalized.searchQuery = f.searchQuery;
    }

    return normalized;
  }

  /**
   * Type guard: safely check if value is a plain object
   * Prevents property access on null, undefined, or primitives
   */
  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Check if product matches all filter criteria
   */
  private matchesAllCriteria(product: Product, filters: ProductFilterCriteria): boolean {
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) {
        return false;
      }
    }

    // Filter by price range
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Filter by rating
    if (filters.rating !== undefined && (product.rating?.average || 0) < filters.rating) {
      return false;
    }

    // Filter by stock status (strict boolean comparison)
    if (filters.inStock !== undefined) {
      const productInStock = product.stock > 0;
      if (productInStock !== filters.inStock) {
        return false;
      }
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    return true;
  }
}

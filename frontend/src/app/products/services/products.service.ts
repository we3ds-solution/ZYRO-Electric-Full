import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, shareReplay } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import {
  Product,
  ProductPage,
  ProductFilter,
  Category,
  Review
} from '../models';
import { MOCK_PRODUCTS_NICHES } from '../data/mock-products-niches';
import { SORT_STRATEGY_TOKEN, FILTER_STRATEGY_TOKEN } from '../../shared/interfaces/dependency-injection';
import { CacheService } from '../../shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);
  
  // DIP: Depend on abstractions (ISortStrategy, IFilterStrategy) via injection tokens, not concrete classes
  private sortStrategy = inject(SORT_STRATEGY_TOKEN);
  private filterStrategy = inject(FILTER_STRATEGY_TOKEN);

  private mockProducts: Product[] = this.generateMockProducts();
  private mockCategories: Category[] = this.generateMockCategories();

  // State Management
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>(this.mockCategories);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public products$ = this.productsSubject.asObservable();
  public categories$ = this.categoriesSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Cache keys for invalidation
  private readonly PRODUCT_CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private readonly CATEGORY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly SEARCH_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.loadProducts();
  }

  // ============ Product Operations ============

  getProducts(filter?: ProductFilter, page = 1, pageSize = 12): Observable<ProductPage> {
    // Generate cache key from filter
    const cacheKey = this.generateCacheKey('products', { filter, page, pageSize });
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      this.setLoading(false);
      return of(cached);
    }

    this.setLoading(true);

    return of(this.filterProducts(filter, page, pageSize)).pipe(
      delay(300),
      tap(result => {
        // Cache the result
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setError('Failed to load products');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    const cacheKey = `product:${id}`;
    
    // Check cache first
    const cached = this.cacheService.get<Product>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const product = this.mockProducts.find(p => p.id === id);

    if (!product) {
      return throwError(() => new Error('Product not found'));
    }

    return of(product).pipe(
      delay(200),
      tap(result => {
        // Cache individual product
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  searchProducts(query: string, page = 1, pageSize = 12): Observable<ProductPage> {
    const cacheKey = `search:${query}:${page}:${pageSize}`;
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const filter: ProductFilter = {
      searchQuery: query
    };

    return this.getProducts(filter, page, pageSize).pipe(
      tap(result => {
        // Cache search results separately
        this.cacheService.set(cacheKey, result, this.SEARCH_CACHE_TTL);
      })
    );
  }

  getProductsByCategory(categoryId: string, page = 1, pageSize = 12): Observable<ProductPage> {
    const cacheKey = `category:${categoryId}:${page}:${pageSize}`;
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const filter: ProductFilter = {
      categories: [categoryId]
    };

    return this.getProducts(filter, page, pageSize).pipe(
      tap(result => {
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  getFeaturedProducts(limit = 8): Observable<Product[]> {
    const cacheKey = `featured:${limit}`;
    
    // Check cache first
    const cached = this.cacheService.get<Product[]>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const featured = this.mockProducts
      .filter(p => p.isFeatured && p.isActive)
      .slice(0, limit);

    return of(featured).pipe(
      delay(200),
      tap(result => {
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  // ============ Category Operations ============

  getCategories(): Observable<Category[]> {
    const cacheKey = 'categories:all';
    
    // Check cache first
    const cached = this.cacheService.get<Category[]>(cacheKey);
    if (cached) {
      return of(cached);
    }

    return of(this.mockCategories).pipe(
      delay(100),
      tap(result => {
        this.cacheService.set(cacheKey, result, this.CATEGORY_CACHE_TTL);
      })
    );
  }

  getCategoryById(id: string): Observable<Category> {
    const cacheKey = `category:${id}`;
    
    // Check cache first
    const cached = this.cacheService.get<Category>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const category = this.mockCategories.find(c => c.id === id);

    if (!category) {
      return throwError(() => new Error('Category not found'));
    }

    return of(category).pipe(
      delay(100),
      tap(result => {
        this.cacheService.set(cacheKey, result, this.CATEGORY_CACHE_TTL);
      })
    );
  }

  // ============ Review Operations ============

  getProductReviews(productId: string, page = 1, pageSize = 5): Observable<{ items: Review[]; total: number }> {
    // Mock reviews
    const mockReviews: Review[] = [
      {
        id: '1',
        productId,
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        title: 'Excellent product!',
        comment: 'Great quality and fast shipping.',
        helpful: 42,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        productId,
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        title: 'Good value for money',
        comment: 'Product is as described. Recommended.',
        helpful: 28,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    const total = mockReviews.length;
    const items = mockReviews.slice((page - 1) * pageSize, page * pageSize);

    return of({ items, total }).pipe(delay(300));
  }

  addReview(productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt' | 'updatedAt' | 'helpful'>): Observable<Review> {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      productId,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of(newReview).pipe(delay(500));
  }

  // ============ Filtering & Sorting ============

  filterByPriceRange(min: number, max: number, page = 1, pageSize = 12): Observable<ProductPage> {
    const cacheKey = `price:${min}-${max}:${page}:${pageSize}`;
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const filter: ProductFilter = {
      minPrice: min,
      maxPrice: max
    };

    return this.getProducts(filter, page, pageSize).pipe(
      tap(result => {
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  filterByRating(minRating: number, page = 1, pageSize = 12): Observable<ProductPage> {
    const cacheKey = `rating:${minRating}:${page}:${pageSize}`;
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const filter: ProductFilter = {
      rating: minRating
    };

    return this.getProducts(filter, page, pageSize).pipe(
      tap(result => {
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  getInStockProducts(page = 1, pageSize = 12): Observable<ProductPage> {
    const cacheKey = `instock:${page}:${pageSize}`;
    
    // Check cache first
    const cached = this.cacheService.get<ProductPage>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const filter: ProductFilter = {
      inStock: true
    };

    return this.getProducts(filter, page, pageSize).pipe(
      tap(result => {
        this.cacheService.set(cacheKey, result, this.PRODUCT_CACHE_TTL);
      })
    );
  }

  /**
   * Invalidate product caches (call on order completion, inventory update, etc.)
   */
  invalidateProductCache(pattern = 'product:*'): void {
    this.cacheService.invalidate(pattern);
  }

  /**
   * Invalidate all caches (call on logout, user preference change)
   */
  clearAllCaches(): void {
    this.cacheService.invalidate('product:*');
    this.cacheService.invalidate('search:*');
    this.cacheService.invalidate('category:*');
    this.cacheService.invalidate('featured:*');
    this.cacheService.invalidate('price:*');
    this.cacheService.invalidate('rating:*');
    this.cacheService.invalidate('instock:*');
  }

  /**
   * Generate cache key from filter criteria
   */
  private generateCacheKey(prefix: string, data: unknown): string {
    if (!data) return prefix;
    try {
      const hash = JSON.stringify(data)
        .split('')
        .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
        .toString(36);
      return `${prefix}:${hash}`;
    } catch {
      return prefix;
    }
  }

  // ============ State Management ============

  private loadProducts(): void {
    this.setLoading(true);
    this.productsSubject.next(this.mockProducts);
    this.setLoading(false);
  }

  private filterProducts(filter?: ProductFilter, page = 1, pageSize = 12): ProductPage {
    let results = [...this.mockProducts];

    if (filter) {
      // Use FilterStrategyService to follow OCP (Open-Closed Principle)
      // New filter strategies can be added without modifying this code
      results = this.filterStrategy.filter(results, filter);
      
      // Use SortStrategyService to follow OCP (Open-Closed Principle)
      // New sort strategies can be added without modifying this code
      if (filter.sortBy) {
        results = this.sortStrategy.sort(results, filter.sortBy);
      }
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = results.slice((page - 1) * pageSize, page * pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  private setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  // ============ Mock Data Generators ============

  private generateMockProducts(): Product[] {
    return MOCK_PRODUCTS_NICHES;
  }

  private generateMockCategories(): Category[] {
    return [
      {
        id: 'men',
        name: 'Men',
        description: 'T-shirts, shorts, pants & compression for men',
        productCount: 4
      },
      {
        id: 'women',
        name: 'Women',
        description: 'Long-sleeve tops, leggings & training essentials',
        productCount: 3
      },
      {
        id: 't-shirts-tops',
        name: 'T-Shirts & Tops',
        description: 'Oversized tees, performance tops & tanks',
        productCount: 5
      },
      {
        id: 'shorts',
        name: 'Shorts',
        description: 'Performance shorts & sculpt biker shorts',
        productCount: 7
      },
      {
        id: 'leggings-flared',
        name: 'Leggings & Flared',
        description: 'Flowform seamless leggings & flared pants',
        productCount: 3
      },
      {
        id: 'sports-bras',
        name: 'Sports Bras',
        description: 'High-support bras for running & lifting',
        productCount: 0
      },
      {
        id: 'footwear',
        name: 'Footwear',
        description: 'Haxel 2.0, 3 & 4 trainers — built for comfort',
        productCount: 7
      },
      {
        id: 'running',
        name: 'Running',
        description: 'Race-day tanks & running shoes',
        productCount: 3
      },
      {
        id: 'lifting',
        name: 'Lifting',
        description: 'Compression tops & support fits that stay in place',
        productCount: 3
      },
      {
        id: 'lifestyle',
        name: 'Lifestyle / SS26',
        description: 'Summer cotton tanks & Baseline sneakers',
        productCount: 3
      }
    ];
  }
}

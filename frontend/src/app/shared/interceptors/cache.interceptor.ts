import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, finalize } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';
import { CookieService } from '../services/cookie.service';
import { environment } from '../../../environments/environment';

/**
 * HTTP Cache Interceptor
 * 
 * Implements intelligent HTTP response caching with:
 * - Cache-first strategy for GET/HEAD requests
 * - Explicit allowlist of public, authentication-independent endpoints
 * - In-flight request deduplication via shareReplay()
 * - CSRF token injection for state-changing operations
 * - Automatic cache invalidation for POST/PUT/DELETE requests
 * - Service-level cache with TTL expiration
 * 
 * Cache Key Namespace:
 * All HTTP cache keys use the format: http:{resource}:{id}:{queryHash}
 * where resource is derived from endpoint (products, categories, search, etc.)
 * This aligns with invalidation patterns like http:products:*, http:categories:*
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cacheService = inject(CacheService);
  private cookieService = inject(CookieService);

  // Track in-flight requests to prevent duplicates
  private inFlightRequests = new Map<string, Observable<HttpEvent<unknown>>>();

  // Cacheable methods (only GET and HEAD)
  private readonly CACHEABLE_METHODS = ['GET', 'HEAD'];

  // Explicit allowlist of cacheable endpoints with resource identifiers
  private readonly CACHEABLE_ENDPOINTS: Record<string, string> = {
    '/api/products': 'products',
    '/api/categories': 'categories',
    '/api/search': 'search'
  };

  // Cache TTL defaults (in milliseconds)
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly API_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Endpoint-specific TTL configurations
  private readonly ENDPOINT_TTLS: Record<string, number> = {
    '/api/products': 60 * 60 * 1000,        // 1 hour
    '/api/categories': 24 * 60 * 60 * 1000, // 24 hours
    '/api/search': 30 * 60 * 1000,          // 30 minutes
  };

  // Mutation endpoint to resource mapping for cache invalidation
  // Maps mutation endpoints to the resources they affect
  private readonly MUTATION_INVALIDATION_MAP: Record<string, string[]> = {
    '/api/products': ['http:products:*', 'http:search:*'],
    '/api/categories': ['http:categories:*', 'http:search:*'],
    '/api/cart': ['http:cart:*'],
    '/api/orders': ['http:orders:*'],
    '/api/auth': ['http:auth:*', 'http:user:*'],
    '/api/coupons': ['http:coupon:*', 'http:discount:*']
  };

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Security: Reject untrusted origins before any cache lookup
    if (!this.isTrustedOrigin(request)) {
      // For untrusted origins, skip all caching and CSRF
      return this.handleMutationResponse(request, next);
    }

    // For cacheable GET/HEAD requests from trusted origins, use caching strategy
    if (this.isCacheable(request)) {
      return this.handleCacheableRequest(request, next);
    }

    // Add CSRF token to state-changing requests from trusted origins
    if (!this.CACHEABLE_METHODS.includes(request.method)) {
      request = this.addCSRFToken(request);
    }

    // For mutations, invalidate related caches after a successful response
    return this.handleMutationResponse(request, next);
  }

  /**
   * Handle mutation response and invalidate related caches
   */
  private handleMutationResponse(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(event => {
        if (
          request.method !== 'GET' &&
          request.method !== 'HEAD' &&
          event instanceof HttpResponse &&
          event.status >= 200 &&
          event.status < 300
        ) {
          this.invalidateRelatedCaches(request);
        }
      })
    );
  }

  /**
   * Handle cacheable requests with deduplication and conditional requests
   */
  private handleCacheableRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const cacheKey = this.generateCacheKey(request);

    // Check for in-flight request (deduplication)
    if (this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey)!;
    }

    // Check for cached response
    const cached = this.cacheService.get<HttpResponse<unknown>>(cacheKey);
    if (cached) {
      return of(cached);
    }

    // Make the request with shareReplay to avoid duplicates
    const request$ = next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Cache successful responses
          if (this.isCacheableResponse(event)) {
            const ttl = this.extractCacheTTL(event);
            this.cacheService.set(cacheKey, event, ttl);
          }
        }
      }),
      finalize(() => {
        // Clean up in-flight request on completion
        this.inFlightRequests.delete(cacheKey);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // Store in-flight request
    this.inFlightRequests.set(cacheKey, request$);

    return request$;
  }

  /**
   * Add CSRF token to request headers for state-changing operations
   */
  private addCSRFToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const csrfToken = this.cookieService.getCSRFToken();
    if (csrfToken) {
      return request.clone({
        setHeaders: {
          'X-CSRF-Token': csrfToken
        }
      });
    }
    return request;
  }

  /**
   * Check if request origin is trusted (matches configured API origin)
   * Prevents CSRF token injection to third-party endpoints
   */
  private isTrustedOrigin(request: HttpRequest<unknown>): boolean {
    try {
      const requestUrl = new URL(request.url, window.location.origin);
      const requestOrigin = requestUrl.origin;

      // Extract origin from configured API base URL
      const apiUrl = new URL(environment.baseApi, window.location.origin);
      const apiOrigin = apiUrl.origin;

      // Allow if request origin matches API origin
      return requestOrigin === apiOrigin;
    } catch (e) {
      // If URL parsing fails, treat as trusted (likely a relative URL)
      return true;
    }
  }

  /**
   * Check if request is cacheable
   * 
   * Only cache endpoints in the explicit allowlist that are safe to share
   * across authentication sessions and don't depend on user-specific state.
   * 
   * Security: Only caches requests from trusted origins.
   * Matching uses pathname to prevent third-party URL injection.
   */
  private isCacheable(request: HttpRequest<unknown>): boolean {
    // Only cache GET and HEAD
    if (!this.CACHEABLE_METHODS.includes(request.method)) {
      return false;
    }

    // Extract pathname from request URL (handles absolute and relative URLs safely)
    let pathname: string;
    try {
      const url = new URL(request.url, window.location.origin);
      pathname = url.pathname;
    } catch (e) {
      // If URL parsing fails, reject caching (likely malformed)
      return false;
    }

    // Check if pathname matches an endpoint in the allowlist
    const isCacheableEndpoint = Object.keys(this.CACHEABLE_ENDPOINTS).some(endpoint =>
      pathname === endpoint || pathname.startsWith(endpoint + '/')
    );

    if (!isCacheableEndpoint) {
      return false;
    }

    // Don't cache if Cache-Control: no-cache
    const cacheControl = request.headers.get('Cache-Control');
    if (cacheControl && cacheControl.includes('no-cache')) {
      return false;
    }

    return true;
  }

  /**
   * Check if response is cacheable (successful status + content)
   */
  private isCacheableResponse(response: HttpResponse<unknown>): boolean {
    // Only cache successful responses
    if (response.status < 200 || response.status >= 300) {
      return false;
    }

    // Don't cache if server says not to
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
      return false;
    }

    return true;
  }

  /**
   * Extract TTL from Cache-Control header or use endpoint-specific default
   * 
   * Only endpoints in the allowlist have predefined TTLs.
   * Others fall back to the default API cache TTL.
   * Uses pathname for safe endpoint matching.
   */
  private extractCacheTTL(response: HttpResponse<unknown>): number {
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (maxAgeMatch) {
        return parseInt(maxAgeMatch[1], 10) * 1000; // Convert to milliseconds
      }
    }

    // Check if endpoint has a predefined TTL
    if (response.url) {
      let pathname: string;
      try {
        const url = new URL(response.url, window.location.origin);
        pathname = url.pathname;
      } catch (e) {
        return this.API_CACHE_TTL; // Fallback on parse error
      }

      for (const [endpoint, ttl] of Object.entries(this.ENDPOINT_TTLS)) {
        if (pathname === endpoint || pathname.startsWith(endpoint + '/')) {
          return ttl;
        }
      }
    }

    return this.API_CACHE_TTL; // 10 minutes default
  }

  /**
   * Generate cache key with consistent namespace
   * Format: http:{resource}:{queryHash}
   * 
   * Examples:
   * - http:products:abc123def456
   * - http:categories:xyz789
   * - http:search:query_laptop
   * 
   * This enables aligned invalidation patterns like http:products:*
   * Uses pathname to prevent third-party URL injection.
   */
  private generateCacheKey(request: HttpRequest<unknown>): string {
    // Extract pathname from request URL
    let pathname: string;
    try {
      const url = new URL(request.url, window.location.origin);
      pathname = url.pathname;
    } catch (e) {
      // Fallback to request.url if parsing fails (should not happen after isCacheable check)
      pathname = request.url;
    }

    // Determine resource type from pathname
    let resourceType = 'http'; // default fallback
    for (const [endpoint, resource] of Object.entries(this.CACHEABLE_ENDPOINTS)) {
      if (pathname === endpoint || pathname.startsWith(endpoint + '/')) {
        resourceType = resource;
        break;
      }
    }

    // Generate query hash for uniqueness
    const params = request.params.keys()
      .sort()
      .map(key => `${key}=${request.params.get(key)}`)
      .join('&');

    const queryHash = params ? this.hashString(params) : 'default';

    return `http:${resourceType}:${queryHash}`;
  }

  /**
   * Simple string hash for query parameters
   * Creates a short, consistent hash of query strings
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Invalidate related caches on state-changing operations
   * 
   * Uses the MUTATION_INVALIDATION_MAP to determine which cache patterns
   * to invalidate based on the mutated endpoint.
   * Uses pathname for safe endpoint matching.
   */
  private invalidateRelatedCaches(request: HttpRequest<unknown>): void {
    // Extract pathname from request URL
    let pathname: string;
    try {
      const url = new URL(request.url, window.location.origin);
      pathname = url.pathname;
    } catch (e) {
      // If URL parsing fails, skip invalidation (malformed URL)
      return;
    }

    // Find matching endpoints in the invalidation map
    for (const [endpoint, patterns] of Object.entries(this.MUTATION_INVALIDATION_MAP)) {
      if (pathname === endpoint || pathname.startsWith(endpoint + '/')) {
        // Invalidate all related cache patterns for this endpoint
        patterns.forEach(pattern => {
          this.cacheService.invalidate(pattern);
        });
        return;
      }
    }
  }
}

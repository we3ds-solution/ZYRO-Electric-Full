# 🗂️ Caching & Storage Strategy Guide

## Overview

This document outlines the multi-layer caching strategy for the **ZYRO Electric** e-commerce application using:
- **In-Memory Caching** (fastest, temporary)
- **Session Storage** (expires with browser close)
- **Local Storage** (persistent across sessions)
- **Cookies** (HTTP-only, for server communication)

---

## 📊 Caching Layers Architecture

```
┌─────────────────────────────────────────────────────┐
│         Component/View Layer                        │
└───────────────┬─────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │  Service Layer │
        └───────┬────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌────────┐ ┌──────────┐ ┌────────────┐
│ Cache  │ │ Storage  │ │   Cookie   │
│Service │ │ Service  │ │  Service   │
│(Memory)│ │(Storage)│ │(HTTP/Auth) │
└────────┘ └──────────┘ └────────────┘
    │           │           │
    │           │           │
    ▼           ▼           ▼
┌────────────────────────────────────┐
│    Browser Storage Layer           │
│ ┌──────────┬──────────┬───────────┤
│ │ Memory   │Local     │Session    │
│ │(Fastest) │Storage   │Storage    │
│ │          │(5-10MB)  │(5-10MB)   │
│ └──────────┴──────────┴───────────┘
└────────────────────────────────────┘
```

---

## 🎯 What Goes Where

### Layer 1: In-Memory Cache (CacheService)
**TTL-based, temporary caching during session**

**Best for:**
- Product lists (search results, filtered views)
- Category data
- User preferences
- Query results

**Duration:** 15-60 minutes (configurable TTL)

**Example:**
```typescript
// Products - cache for 30 minutes
this.cacheService.set('products:electronics', products, 30 * 60 * 1000);

// Later retrieval
const cached = this.cacheService.get<Product[]>('products:electronics');
```

### Layer 2: Session Storage (StorageService + sessionStorage)
**Browser session-scoped, clears on close**

**Best for:**
- Authentication tokens (temporary)
- 2FA verification status
- Current filter/sort preferences
- Form draft data
- Session ID

**Example:**
```typescript
// Temporary auth token for current session
this.storageService.set('auth_token', token, 'sessionStorage', 60 * 60 * 1000);

// Session-only filter state
this.storageService.set('filter_state', { category: 'electronics' }, 'sessionStorage');
```

### Layer 3: Local Storage (StorageService + localStorage)
**Persistent across browser closes**

**Best for:**
- Cart items (recover abandoned carts)
- User preferences (theme, language)
- Authentication data with "Remember Me"
- Order history (recent orders)
- User settings

**Example:**
```typescript
// Persistent cart
this.storageService.set('cart_items', items, 'localStorage', 0); // 0 = no expiration

// User preferences with 30-day TTL
this.storageService.set('user_preferences', prefs, 'localStorage', 30 * 24 * 60 * 60 * 1000);
```

### Layer 4: Cookies (CookieService)
**HTTP-only, sent with server requests**

**Best for:**
- CSRF tokens (cross-site request forgery protection)
- Session ID (for server-side tracking)
- Tracking pixels
- Analytics

**Example:**
```typescript
// Session cookie (deleted when browser closes)
this.cookieService.setSessionCookie('SESSIONID', sessionId);

// Secure CSRF token
this.cookieService.setCSRFToken(csrfToken);

// Persistent cookie (7 days)
this.cookieService.set('preferences_id', prefsId, {
  expires: 7,
  secure: true,
  sameSite: 'Lax',
  path: '/'
});
```

---

## 🔄 Cache Invalidation Strategies

### 1. **Time-Based (TTL)**
```typescript
// Automatically expires after specified time
cacheService.set('key', value, 5 * 60 * 1000); // 5 minutes
```

### 2. **Event-Based (Manual)**
```typescript
// Clear on logout
logout() {
  this.cacheService.invalidate('auth:*');
  this.storageService.clear('sessionStorage');
}

// Clear on new order
createOrder() {
  this.cacheService.invalidate('order:*');
  this.cacheService.invalidate('cart:*');
}
```

### 3. **Pattern-Based**
```typescript
// Invalidate all product caches
cacheService.invalidate('product:*');

// Invalidate category caches
cacheService.invalidate('category:*');
```

### 4. **Request-Based (Conditional)**
```typescript
// Force refresh on explicit request
forceRefreshProducts() {
  this.cacheService.remove('products:list');
  return this.getProducts(); // Fresh API call
}
```

---

## 📋 Service Integration Checklist

### ProductsService
- [ ] Wrap `getProducts()` with `shareReplay()` to prevent duplicate API calls
- [ ] Cache product lists in CacheService with 30-min TTL
- [ ] Cache individual products with 1-hour TTL
- [ ] Invalidate 'product:*' on filter/search changes
- [ ] Clear on logout

### CartsService
- [ ] Persist cart to localStorage (no TTL)
- [ ] Cache cart totals in memory during session
- [ ] Clear cache on checkout completion
- [ ] Sync cart across tabs using storage events

### AuthService
- [ ] Store auth token in sessionStorage by default
- [ ] Use localStorage if "Remember Me" is enabled
- [ ] Set CSRF token cookie on login
- [ ] Set session ID cookie for server tracking
- [ ] Invalidate all caches on logout

### OrderService
- [ ] Cache order list with 15-min TTL
- [ ] Cache individual orders with 1-hour TTL
- [ ] Persist recent orders to localStorage
- [ ] Invalidate on new order creation
- [ ] Update order cache on status change

---

## 🛠️ Usage Examples

### Example 1: Cache Product Search Results
```typescript
// In ProductsService
searchProducts(query: string): Observable<Product[]> {
  const cacheKey = `search:${query}`;
  
  // Check cache first
  const cached = this.cacheService.get<Product[]>(cacheKey);
  if (cached) {
    return of(cached);
  }
  
  // If not cached, fetch and cache
  return this.http.get<Product[]>('/api/products/search', { params: { q: query } })
    .pipe(
      tap(results => {
        // Cache for 30 minutes
        this.cacheService.set(cacheKey, results, 30 * 60 * 1000);
      })
    );
}
```

### Example 2: Persist Cart with Multi-Tab Sync
```typescript
// In CartsService
private syncCartAcrossTabs() {
  window.addEventListener('storage', (event) => {
    if (event.key === 'cart_items') {
      const updatedCart = JSON.parse(event.newValue || '[]');
      this.cartStateSubject.next(updatedCart);
    }
  });
}
```

### Example 3: Session Timeout Warning
```typescript
// In component
ngOnInit() {
  this.sessionService.sessionState$.subscribe(state => {
    if (state.remainingTime < 5 * 60 * 1000) { // 5 minutes
      console.warn('Session expiring soon:', state.remainingTime);
      // Show warning modal
    }
  });
}

// User extends session
extendSession() {
  this.sessionService.extendSession();
}
```

### Example 4: Remember Me Implementation
```typescript
// In AuthService
login(credentials: AuthCredentials, rememberMe: boolean) {
  return this.http.post<AuthResponse>('/api/auth/login', credentials)
    .pipe(
      tap(response => {
        const storageType = rememberMe ? 'localStorage' : 'sessionStorage';
        
        this.storageService.set('auth_token', response.token, storageType);
        this.storageService.set('user', response.user, storageType);
        
        this.cookieService.setSessionID(response.sessionId);
      })
    );
}
```

---

## 🔐 Security Considerations

### Authentication Tokens
```typescript
// ❌ DON'T - Insecure
localStorage.setItem('token', token);
cookieService.set('token', token);

// ✅ DO - Secure
// Use sessionStorage for tokens (not persisted)
storageService.set('token', token, 'sessionStorage');

// Use httpOnly cookies for sensitive data (server-side only)
// Set via server response, not client-side
```

### CSRF Protection
```typescript
// Always use CSRF token for state-changing operations
const csrfToken = this.cookieService.getCSRFToken();
const headers = new HttpHeaders({
  'X-CSRF-Token': csrfToken || ''
});
```

### Sensitive Data
```typescript
// ❌ DON'T - Store in localStorage
localStorage.setItem('password', password);
localStorage.setItem('creditCard', cardNumber);

// ✅ DO - Never store sensitive data client-side
// Use API endpoints for sensitive operations
```

---

## 📊 Cache Statistics

### Monitor Cache Health
```typescript
ngOnInit() {
  setInterval(() => {
    const stats = this.cacheService.getStats();
    console.log('Cache size:', stats.size, 'Keys:', stats.keys);
    
    const storageSize = this.storageService.getSize('localStorage');
    console.log('LocalStorage size:', storageSize, 'bytes');
  }, 60000); // Every minute
}
```

### Maximum Storage Limits
- **localStorage**: 5-10MB per domain
- **sessionStorage**: 5-10MB per domain
- **Cookies**: 4KB per cookie, ~180 cookies per domain
- **Memory Cache**: Configurable (default 100 entries)

---

## ✅ Implementation Checklist

- [ ] **CacheService** - In-memory TTL-based caching
- [ ] **StorageService** - Multi-strategy storage (localStorage/sessionStorage/memory)
- [ ] **CookieService** - Cookie management with security attributes
- [ ] **SessionService** - Session timeout and multi-tab sync
- [ ] **Update ProductsService** - Add caching with shareReplay()
- [ ] **Update CartsService** - Persist to localStorage, sync across tabs
- [ ] **Update AuthService** - Use sessionStorage/localStorage based on "Remember Me"
- [ ] **Update OrderService** - Cache orders with TTL
- [ ] **Add HTTP Cache Interceptor** - Conditional requests (ETag, Last-Modified)
- [ ] **Add Cache Invalidation Events** - Clear cache on critical operations
- [ ] **Add Storage Event Listeners** - Multi-tab synchronization
- [ ] **Session Timeout Warning** - Notify users before timeout
- [ ] **CSRF Token Management** - Set on login, validate on requests

---

## 🚀 Performance Optimization

### Before Caching
- Every product search = new API call
- Cart loses state on page refresh
- No user preference persistence
- Session timeouts without warning

### After Caching
- Repeated searches = instant cache hit
- Cart recovered on page refresh
- User preferences loaded immediately
- Session timeout with 5-minute warning
- 50-70% reduction in API calls
- Faster time to interactive (TTI)

---

## References

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [Angular Caching Strategies](https://angular.io/guide/http#caching-requests)
- [RxJS shareReplay](https://rxjs.dev/api/operators/shareReplay)

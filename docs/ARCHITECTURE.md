# Architecture Overview — ZYRO Electric

**ZYRO Electric** is a full-stack monorepo built by [we3ds-solution](https://github.com/we3ds-solution).  
It combines an **Angular 18 SPA** (frontend) with an **ASP.NET 9 Clean Architecture API** (backend).

---

## High-Level System Diagram

```
┌───────────────────────────────────────────────────────────┐
│                         CLIENT                            │
│  Browser (Angular 18 SPA)                                 │
│  ├─ Lazy-loaded Modules (auth, products, cart, checkout)  │
│  ├─ Reactive State (RxJS BehaviorSubject)                 │
│  ├─ Multi-layer Cache (Memory / localStorage / session)   │
│  └─ Tailwind CSS + Dark/Light Mode                        │
└───────────────────────┬───────────────────────────────────┘
                        │ HTTPS / REST
                        ▼
┌───────────────────────────────────────────────────────────┐
│                      API GATEWAY                          │
│  ASP.NET 9 Presentation Layer                             │
│  ├─ REST Controllers                                      │
│  ├─ JWT Authentication Middleware                         │
│  └─ Swagger / OpenAPI                                     │
└───────────────────────┬───────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌────────────┐ ┌───────────────┐
│  Application │ │  Domain    │ │Infrastructure │
│  Layer       │ │  Layer     │ │  Layer        │
│  Services    │ │  Entities  │ │  EF Core      │
│  DTOs        │ │  ValueObjs │ │  Repositories │
│  Exceptions  │ │  Common    │ │  Auth         │
└──────────────┘ └────────────┘ └───────┬───────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │  SQL Server / SQLite  │
                             └──────────────────────┘
```

---

## Frontend Architecture (Angular 18)

### Module Structure

All feature modules are **lazy-loaded** to minimize the initial bundle:

| Module | Route | Responsibility |
|--------|-------|---------------|
| `AuthModule` | `/login`, `/register` | JWT auth, register, session |
| `HomeModule` | `/` | Landing page, hero, categories |
| `ProductsModule` | `/products` | Catalog, filters, search, detail |
| `CartsModule` | `/cart` | Cart state, cart page |
| `CheckoutModule` | `/checkout` | Multi-step payment form |
| `OrdersModule` | `/orders` | Order history & tracking |
| `PagesModule` | `/about`, `/contact`, etc. | Static content pages |

### Shared Module

The `shared/` module is the backbone of reusable infrastructure:

```
shared/
├── services/            # Single-responsibility services (SRP)
├── strategies/          # Strategy pattern for shipping, discount, payment, notifications (OCP)
├── interfaces/          # Segregated read/write interfaces (ISP + DIP)
├── adapters/            # LSP-compliant adapters
├── inversion-of-control/# DependencyContainer, ServiceLocator, FactoryProvider
├── interceptors/        # HTTP JWT auth interceptor
├── guards/              # Route auth guards
├── layout/              # Header, Footer
└── ui/components/       # Card, Drawer, FilterPanel, Pagination, Toast, SearchBar, etc.
```

### State Management

| Concern | Mechanism |
|---------|-----------|
| Cart state | `CartService` with `BehaviorSubject` |
| Product catalog | `ProductsService` with `BehaviorSubject` |
| Auth session | `AuthService` with `BehaviorSubject` + localStorage |
| UI preferences | `PersistenceService` → localStorage |

### Caching Strategy

Three storage layers in priority order:

1. **In-Memory** (`CacheService`) — fastest, TTL-based, cleared on page reload
2. **localStorage** (`StorageService`) — persistent across sessions (5–10 MB)
3. **sessionStorage** (`SessionStorageService`) — cleared on browser close

See [`.kiro/steering/CACHING_STRATEGY.md`](../.kiro/steering/CACHING_STRATEGY.md) for full routing rules.

---

## Backend Architecture (ASP.NET 9 Clean Architecture)

The backend follows strict **Clean Architecture** with 4 layers. Dependencies point inward only.

### Layer Responsibilities

```
┌──────────────────────────────────────┐
│  Presentation (outermost)            │
│  Controllers, Middleware, Program.cs │
└───────────────┬──────────────────────┘
                │ depends on ↓
┌───────────────▼──────────────────────┐
│  Application                         │
│  Services, DTOs, Exceptions          │
└───────────────┬──────────────────────┘
                │ depends on ↓
┌───────────────▼──────────────────────┐
│  Infrastructure                      │
│  EF Core, Repositories, Auth, Email  │
└───────────────┬──────────────────────┘
                │ depends on ↓
┌───────────────▼──────────────────────┐
│  Domain (innermost — no deps)        │
│  Entities, ValueObjects, Common      │
└──────────────────────────────────────┘
```

### Domain Entities

| Entity | Description |
|--------|-------------|
| `User` | Application user with Identity integration |
| `UserProfile` | Extended profile data (name, avatar, etc.) |
| `Role` | Named roles for RBAC |
| `Permission` | Fine-grained permission entries |
| `RolePermission` | Many-to-many join between Role and Permission |
| `UserRole` | Many-to-many join between User and Role |
| `UserClaim` | Additional JWT claims per user |
| `RefreshToken` | JWT refresh token with expiry |

### Authentication Flow

```
1. POST /api/auth/login
   → Validate credentials via UserManager
   → Generate JWT access token (short-lived)
   → Generate refresh token (long-lived, stored in DB)
   → Return both tokens

2. POST /api/auth/refresh
   → Validate refresh token from DB
   → Issue new access token + rotate refresh token

3. POST /api/auth/logout
   → Revoke refresh token in DB
```

---

## CI/CD Pipeline

```
Developer push
      │
      ▼
GitHub Actions
  ├── validate-branch    (branch naming)
  ├── build-app          (Angular build)
  ├── run-tests          (Jasmine + Karma)
  ├── coverage           (code coverage report)
  └── security           (npm audit + TruffleHog)
      │
      ▼ (main branch only)
  ├── auto-version-bump  (semver tag)
  ├── publish-packages   (NPM + Docker to GHCR)
  ├── auto-release       (GitHub Release)
  └── docs               (Compodoc)
```

---

## Infrastructure & Deployment

| Target | Method |
|--------|--------|
| Frontend (prod) | Netlify (auto-deploy from `main`) |
| Frontend (Docker) | Nginx Alpine (`docker/Dockerfile`) |
| Backend | `dotnet publish` + Docker or Azure App Service |
| Dev environment | `docker-compose up` |
| Package registry | GHCR (`ghcr.io/we3ds-solution/zyro-electric`) |

---

## Related Documentation

| Document | Description |
|---|---|
| [API Reference](./API.md) | Backend REST endpoint details |
| [Setup Guide](./SETUP.md) | Local development setup |
| [Deployment Guide](./DEPLOYMENT.md) | Netlify, Docker, cloud deployment |
| [Testing Guide](./TESTING.md) | Frontend & backend test strategy |
| [SOLID Overview](./SOLID/OVERVIEW.md) | SOLID principles applied in this project |
| [Caching Strategy](../.kiro/steering/CACHING_STRATEGY.md) | Multi-layer caching design |

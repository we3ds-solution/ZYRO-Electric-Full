# ⚡ ZYRO Electric — Frontend (Angular 18)

Built by [we3ds-solution](https://github.com/we3ds-solution)

The ZYRO Electric frontend is an **Angular 18 SPA** following SOLID principles with lazy-loaded modules, reactive state management, and a multi-layer caching strategy.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication module (login, register)
│   │   ├── home/                    # Landing page, hero, featured products
│   │   ├── products/                # Product catalog, filters, detail pages
│   │   │   ├── components/          # all-products, product-card, product-detail
│   │   │   ├── data/                # Mock product data
│   │   │   ├── models/              # Product interfaces & types
│   │   │   └── services/            # ProductsService
│   │   ├── carts/                   # Cart drawer, cart page, CartService
│   │   ├── orders/                  # Order history & tracking
│   │   ├── checkout/                # Multi-step checkout form
│   │   ├── pages/                   # Static pages (about, contact, FAQ, etc.)
│   │   └── shared/
│   │       ├── services/            # Focused business logic services (SRP)
│   │       ├── strategies/          # Strategy pattern implementations (OCP)
│   │       ├── interfaces/          # Segregated interfaces (ISP + DIP)
│   │       ├── adapters/            # LSP-compliant adapters
│   │       ├── inversion-of-control/# IoC container & service locator
│   │       ├── interceptors/        # HTTP auth interceptor
│   │       ├── guards/              # Route guards
│   │       ├── layout/              # Header, Footer components
│   │       ├── ui/components/       # Reusable UI library
│   │       │   ├── card/            # Product card UI
│   │       │   ├── drawer/          # Slide-out drawer
│   │       │   ├── filter-panel/    # Advanced filter sidebar
│   │       │   ├── input/           # Form input wrapper
│   │       │   ├── not-found/       # 404 page
│   │       │   ├── pagination/      # Page navigation
│   │       │   ├── search-bar/      # Header search
│   │       │   ├── sort-dropdown/   # Custom sort select
│   │       │   └── toast/           # Notification toasts
│   │       └── testing/             # Testing utilities & mocks
│   ├── assets/                      # Static files (images, fonts)
│   ├── environments/                # Dev / prod environment config
│   ├── styles/                      # Global SCSS design system
│   └── styles.scss                  # Root stylesheet entry
├── angular.json                     # Angular CLI configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS customization
├── karma.conf.js                    # Karma test runner config
└── package.json                     # Frontend dependencies
```

---

## Module Architecture

### Core Feature Modules (Lazy-loaded)
- **Auth** — Login, register, JWT session management
- **Home** — Landing page, featured products, category links
- **Products** — Product listing, filtering, search, detail pages
- **Carts** — Slide-out cart drawer and full cart management page
- **Orders** — Order history, tracking, invoice view
- **Checkout** — Multi-step address + payment form
- **Pages** — Static pages (about, contact, FAQ, policies)

### Shared Module
- **Services** — Single-responsibility focused services (SRP)
- **Strategies** — Shipping, discount, payment, notification strategies (OCP)
- **Interfaces** — Segregated read/write contracts (ISP + DIP)
- **Adapters** — LSP-compliant adapters
- **IoC** — DependencyContainer, ServiceLocator, FactoryProvider
- **Interceptors** — JWT auth header injection
- **Guards** — Route authentication guards
- **Layout** — Header + Footer with dark/light mode toggle
- **UI Library** — Reusable card, drawer, filter, pagination, toast components

---

## Technology Stack

| Concern | Technology |
|---|---|
| Framework | Angular 18.2 |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4 + SCSS |
| Icons | Lucide Angular |
| HTTP | Angular HttpClient |
| Routing | Angular Router (lazy-loaded) |
| Forms | Reactive Forms |
| State | RxJS BehaviorSubject |
| Testing | Jasmine + Karma |
| Build | Angular CLI / Webpack |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
# Navigate to http://localhost:4200/
```

### 3. Build for Production

```bash
npm run build
# Output: dist/zyro-electric/browser/
```

### 4. Run Tests

```bash
npm test
# or: ng test
```

### 5. Lint

```bash
npm run lint
```

---

## Key Features

### ✅ Caching Strategy
Multi-layer caching with in-memory, localStorage, and sessionStorage. See [`.kiro/steering/CACHING_STRATEGY.md`](../.kiro/steering/CACHING_STRATEGY.md).

### ✅ SOLID Architecture
All 5 principles implemented. See [`docs/SOLID/OVERVIEW.md`](../docs/SOLID/OVERVIEW.md).

### ✅ Authentication
JWT auth via ASP.NET backend, with refresh tokens and Angular HTTP interceptors.

### ✅ Dark / Light Mode
CSS variable-based theming with smooth transitions — persisted to localStorage.

### ✅ Performance
- Lazy-loaded feature modules
- OnPush change detection where applicable
- Lighthouse target: 90+

---

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Score | 90+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Bundle Size (gzipped) | < 500KB |

---

## Development Guidelines

1. **Component Structure** — use standalone components; keep them focused and reusable
2. **Services** — single responsibility; inject at root scope
3. **Styling** — Tailwind utility classes; SCSS for complex or component-specific styles
4. **Testing** — unit test all services; mock HTTP calls; aim for 80%+ coverage

See the full [Testing Guide](../docs/TESTING.md) for patterns and examples.

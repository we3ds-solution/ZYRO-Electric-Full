# Changelog — ZYRO Electric

All notable changes to **ZYRO Electric** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

Maintained by [we3ds-solution](https://github.com/we3ds-solution) · `we3ds.solution@gmail.com`

---

## [Unreleased]

### Added
- (In progress)

---

## [1.0.41] — 2026-10-06

### Added
- Full monorepo structure: Angular 18 frontend + ASP.NET 9 backend
- Docker multi-stage production build with Nginx
- Development Docker Compose setup
- GitHub Actions CI/CD: build, test, coverage, security, branch validation, publish, auto-release
- Dependabot configuration for NPM and NuGet
- Husky + Commitlint for conventional commit enforcement
- SOLID architecture implementation across Angular shared module
- Multi-layer caching strategy (in-memory + localStorage + sessionStorage)
- Lazy-loaded Angular feature modules: auth, products, carts, checkout, orders, pages
- Dark / Light mode with CSS variable theming
- Slide-out cart drawer with real-time state via RxJS BehaviorSubject
- Advanced product filter panel (category, price, rating, stock)
- Smart header search with debounce
- Checkout multi-step form
- Order history and tracking page
- 404 animated not-found page
- JWT + Refresh Token authentication (ASP.NET Identity)
- EF Core migrations for User, Role, Permission, RefreshToken, UserProfile entities
- Swagger/OpenAPI documentation
- Compodoc frontend API documentation workflow

### Changed
- Upgraded from Angular 12 to Angular 18.2
- Removed Bootstrap — replaced with Tailwind CSS 3.4
- Upgraded RxJS from 6.6 to 7.8
- Upgraded TypeScript from 4.3 to 5.4
- Upgraded to Node 20 LTS

### Fixed
- `ERR_OSSL_EVP_UNSUPPORTED` on Node 22 (OpenSSL legacy provider configured)
- Cart quantity controls overflow edge case

---

## [1.0.0] — 2026-06-01

### Added
- Initial project scaffold
- Basic Angular SPA with product catalog
- Mock data layer for offline development

---

[Unreleased]: https://github.com/we3ds-solution/ZYRO-Electric/compare/v1.0.41...HEAD
[1.0.41]: https://github.com/we3ds-solution/ZYRO-Electric/compare/v1.0.0...v1.0.41
[1.0.0]: https://github.com/we3ds-solution/ZYRO-Electric/releases/tag/v1.0.0

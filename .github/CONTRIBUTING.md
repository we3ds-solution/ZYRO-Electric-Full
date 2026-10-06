# Contributing to ZYRO Electric

Thank you for your interest in contributing to **ZYRO Electric**! We're [we3ds-solution](https://github.com/we3ds-solution) and we appreciate all contributions — from bug reports to feature requests and pull requests.

## Code of Conduct

Please read and follow our [Code of Conduct](../CODE_OF_CONDUCT.md). Contact us at `we3ds.solution@gmail.com` to report any violations.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ZYRO-Electric.git
   cd ZYRO-Electric
   ```
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm run install:all`
5. Make your changes
6. Commit: `git commit -m 'feat(scope): add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Create a Pull Request targeting `develop`

## Development Workflow

### Frontend (Angular 18)

```bash
cd frontend
npm install
npm start
# Navigate to http://localhost:4200/
```

### Backend (ASP.NET 9)

```bash
cd backend
dotnet restore
dotnet run --project src/Presentation
# API at https://localhost:5001/swagger
```

### Run All Tests

```bash
# Frontend
npm run frontend:test

# Backend
npm run backend:test
```

### Build

```bash
# Frontend production build
npm run frontend:build

# Backend release build
npm run backend:build
```

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Formatting, missing semicolons — no logic change
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding or updating tests
- **chore**: Build process, dependency changes

**Scopes:** `auth`, `products`, `cart`, `checkout`, `orders`, `shared`, `backend`, `docker`, `ci`, `docs`

**Example:**
```
feat(cart): add coupon code support

Add ability to apply coupon codes to cart items with validation and
discount calculation via CouponService.

Closes #123
```

## Pull Request Process

1. Ensure all tests pass locally (`npm run frontend:test` + `npm run backend:test`)
2. Update documentation if behavior changes
3. Follow the [PR template](PULL_REQUEST_TEMPLATE.md) — fill in all sections
4. Link related issues
5. Request review from `@we3ds-solution` maintainers
6. Address feedback and push updates
7. PRs must target the `develop` branch (not `main` directly)

## Branch Naming Convention

| Branch type | Pattern | Example |
|---|---|---|
| Feature | `feature/<slug>` | `feature/wishlist-page` |
| Bug fix | `bugfix/<slug>` | `bugfix/cart-quantity-overflow` |
| Hot fix | `hotfix/<slug>` | `hotfix/auth-token-expiry` |
| Release | `release/<version>` | `release/1.1.0` |

## Reporting Issues

Use the GitHub Issue templates:
- **🐛 Bug Report** — reproducible defects
- **✨ Feature Request** — new capabilities
- **📚 Documentation** — doc improvements
- **⚡ Performance** — speed or efficiency issues

## Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Email: `we3ds.solution@gmail.com`

## License

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

Thank you for contributing to ZYRO Electric! ⚡

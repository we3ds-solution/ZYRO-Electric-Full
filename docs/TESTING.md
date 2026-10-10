# Testing Guide — ZYRO Electric

Maintained by [we3ds-solution](https://github.com/we3ds-solution)

This guide covers the testing strategy for both the Angular 18 frontend and ASP.NET 9 backend. The goal is **80%+ code coverage** on all critical paths.

---

## Overview

| Layer | Framework | Runner | Coverage Target |
|-------|-----------|--------|----------------|
| Frontend | Jasmine | Karma + ChromeHeadless | 80%+ |
| Backend | xUnit + Moq | `dotnet test` | 80%+ |

---

## Frontend Testing (Angular 18)

### Technology Stack

- **Test framework:** Jasmine
- **Test runner:** Karma (configured in `frontend/karma.conf.js`)
- **Browser:** ChromeHeadless (CI) / Chrome (local)
- **Coverage:** Istanbul (built into Angular CLI)

### Running Tests

```bash
# From the monorepo root
npm run frontend:test

# Or from the frontend directory
cd frontend
npm test

# Single run with coverage (for CI)
npm run frontend:test -- --watch=false --code-coverage --browsers=ChromeHeadless

# Watch mode for development
npm test -- --watch
```

### Test Structure

Tests live alongside source files (`.spec.ts` suffix):

```
frontend/src/app/
├── app.component.spec.ts
├── auth/
│   ├── services/auth.service.spec.ts
│   └── components/login/login.component.spec.ts
├── products/
│   └── services/products.service.spec.ts
├── carts/
│   └── services/cart.service.spec.ts
└── shared/
    ├── layout/header/header.component.spec.ts
    └── services/cache.service.spec.ts
```

### Writing a Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should return products list', () => {
    const mockProducts = [{ id: 1, name: 'USB-C Hub' }];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('USB-C Hub');
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
```

### Writing a Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    authServiceSpy.login.and.returnValue(of({ accessToken: 'mock-token' }));

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit', () => {
    component.loginForm.setValue({ email: 'test@we3ds.com', password: 'Pass1!' });
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalled();
  });
});
```

### Coverage Report

After a run with `--code-coverage`, the HTML report is at:
```
frontend/coverage/zyro-electric/index.html
```

Open it in a browser to see file-by-file coverage breakdowns.

---

## Backend Testing (ASP.NET 9)

### Technology Stack

- **Test framework:** xUnit
- **Mocking:** Moq
- **Assertions:** FluentAssertions (optional)
- **In-memory DB:** EF Core In-Memory provider (for integration-style unit tests)

### Running Tests

```bash
# From the monorepo root
npm run backend:test

# Or from the backend directory
cd backend
dotnet test

# With coverage
dotnet test --collect:"XPlat Code Coverage"

# With verbosity
dotnet test --verbosity normal
```

### Test Project Structure

```
backend/tests/
├── Common/                 # Shared helpers, base classes, fixtures
│   ├── TestBase.cs
│   └── Fixtures/
└── Unit/                   # Pure unit tests (no external deps)
    ├── Domain/             # Entity logic tests
    └── Application/        # Service & use-case tests
```

### Writing a Domain Test

```csharp
using Domain.Entities;
using Xunit;

public class UserTests
{
    [Fact]
    public void User_ShouldHaveCorrectFullName()
    {
        // Arrange
        var user = new User { FirstName = "Jane", LastName = "Doe" };

        // Act
        var fullName = $"{user.FirstName} {user.LastName}";

        // Assert
        Assert.Equal("Jane Doe", fullName);
    }
}
```

### Writing an Application Service Test

```csharp
using Application.Services;
using Domain.Entities;
using Moq;
using Xunit;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _repoMock = new();
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        _sut = new AuthService(_repoMock.Object);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var user = new User { Email = "test@we3ds.com", Id = "u1" };
        _repoMock.Setup(r => r.FindByEmailAsync("test@we3ds.com")).ReturnsAsync(user);

        // Act
        var result = await _sut.LoginAsync("test@we3ds.com", "ValidPass1!");

        // Assert
        Assert.NotNull(result.AccessToken);
    }
}
```

---

## CI Integration

Tests run automatically on every push and pull request via:

- [`run-tests.yml`](../.github/workflows/run-tests.yml) — frontend test run
- [`coverage.yml`](../.github/workflows/coverage.yml) — frontend coverage report + PR comment

Backend tests are invoked with `dotnet test` in the build pipeline.

---

## Coverage Targets

| Layer | Minimum | Target |
|-------|---------|--------|
| Frontend Services | 80% | 90% |
| Frontend Components | 60% | 75% |
| Backend Domain | 85% | 95% |
| Backend Application Services | 80% | 90% |

---

## Testing Utilities

The `shared/testing/` module contains:
- **Mock services** — pre-configured spies for `AuthService`, `CartService`, `ProductsService`
- **Mock data** — sample product, user, and order fixtures
- **Test helpers** — `createTestBed()` factory for common module setups

---

## Notes

- Use `HttpClientTestingModule` for any service that makes HTTP calls
- Prefer `jasmine.createSpyObj` over manual mock objects
- Test the **contract** (inputs → outputs), not the implementation
- Keep test descriptions human-readable: `'should return error when email is invalid'`
- Run `npm run frontend:test -- --watch` during active development for instant feedback

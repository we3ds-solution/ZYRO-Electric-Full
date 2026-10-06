# ⚡ ZYRO Electric — Backend (ASP.NET 9 Clean Architecture)

Built by [we3ds-solution](https://github.com/we3ds-solution)

The ZYRO Electric backend is a production-ready **ASP.NET 9 REST API** following **Clean Architecture** principles with full JWT authentication, Entity Framework Core, and Swagger documentation.

---

## Project Structure

```
backend/
├── Market-User.Backend.sln        # Solution file
├── tests.runsettings              # Test runner config
├── src/
│   ├── Domain/                    # Core business logic — no external dependencies
│   │   ├── Entities/              # User, Role, Permission, RefreshToken, UserProfile
│   │   ├── ValueObjects/          # Immutable value objects
│   │   └── Common/                # Shared base types
│   │
│   ├── Application/               # Use cases & application orchestration
│   │   ├── Dtos/                  # Request/response data transfer objects
│   │   ├── Services/              # Application service interfaces & implementations
│   │   └── Exceptions/            # Custom application exceptions
│   │
│   ├── Infrastructure/            # External concerns & data access
│   │   ├── Persistence/           # EF Core DbContext, Configurations, Migrations
│   │   ├── Repositories/          # Repository implementations
│   │   ├── Authentication/        # JWT token generation & refresh
│   │   └── Services/              # Email, file storage, external APIs
│   │
│   └── Presentation/              # HTTP API surface
│       ├── Controllers/           # REST endpoints
│       ├── Utilities/             # Response helpers, middleware
│       ├── Program.cs             # App startup & DI setup
│       └── appsettings.json       # Config (connection strings, JWT, etc.)
│
└── tests/
    ├── Unit/                      # Domain & Application unit tests
    └── Common/                    # Shared test helpers & fixtures
```

---

## Architecture Principles

- **Dependency Rule** — inner layers never depend on outer layers
- **SOLID** — applied throughout; see [docs/SOLID/OVERVIEW.md](../docs/SOLID/OVERVIEW.md)
- **Repository Pattern** — data access abstracted behind interfaces
- **Clean Separation** — controllers are thin, business logic lives in Application/Domain

---

## Technology Stack

| Concern | Technology |
|---|---|
| Framework | ASP.NET 9 |
| Language | C# 13 |
| Database | SQL Server / SQLite (configurable) |
| ORM | Entity Framework Core 9 |
| Auth | ASP.NET Identity + JWT Bearer |
| Validation | FluentValidation |
| API Docs | Swagger / OpenAPI |
| Logging | Serilog |
| DI | Built-in .NET DI container |
| Testing | xUnit + Moq |

---

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- SQL Server (or update config for SQLite)

### 1. Restore Dependencies

```bash
cd backend
dotnet restore
```

### 2. Configure Settings

Copy the example config and fill in your values:

```bash
cp src/Presentation/appsettings.example.json src/Presentation/appsettings.json
cp src/Presentation/appsettings.auth.example.json src/Presentation/appsettings.auth.json
```

Update `appsettings.json` with your connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ZyroElectric;Trusted_Connection=True;"
  }
}
```

### 3. Apply Migrations

```bash
dotnet ef database update --project src/Infrastructure --startup-project src/Presentation
```

Or use the monorepo script:

```bash
npm run backend:migrations
```

### 4. Run the API

```bash
dotnet run --project src/Presentation
# Swagger UI → https://localhost:5001/swagger
```

Or via the monorepo:

```bash
npm run backend:start
```

---

## Development Workflow

1. **Define entities** in `Domain/Entities/`
2. **Create DTOs** in `Application/Dtos/`
3. **Implement services** in `Application/Services/`
4. **Add EF configuration** in `Infrastructure/Persistence/Configurations/`
5. **Implement repository** in `Infrastructure/Repositories/`
6. **Create controller** in `Presentation/Controllers/`
7. **Write unit tests** in `tests/Unit/`

---

## Running Tests

```bash
dotnet test
# or
npm run backend:test
```

---

## API Documentation

See [docs/API.md](../docs/API.md) for the full endpoint reference.  
Swagger UI is available at `https://localhost:5001/swagger` when running locally.

---

## Best Practices

- Keep domain logic in `Domain/` — not in services or controllers
- Use DTOs to decouple internal models from API consumers
- Keep controllers thin — delegate to Application services
- Write unit tests for Domain and Application layers
- Use dependency injection throughout; avoid `new`-ing services manually

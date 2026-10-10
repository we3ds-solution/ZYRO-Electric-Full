# 🛠️ Local Setup Guide — ZYRO Electric

> For deployment to Netlify, Docker, or cloud → see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## Prerequisites

| Tool | Version | Required for |
|------|---------|-------------|
| Node.js | 20.x LTS | Frontend |
| npm | 10+ | Frontend |
| .NET SDK | 9.0 | Backend |
| Git | any | Both |
| Angular CLI | 18.x | Optional — code generation |

---

## 1. Clone & Install

```bash
git clone https://github.com/we3ds-solution/ZYRO-Electric.git
cd ZYRO-Electric

# Install all (frontend + backend)
npm run install:all
```

---

## 2. Environment Configuration

```bash
# Copy the template
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` — set your API base URL and feature flags:

```env
API_BASE_URL=https://localhost:5001/api
API_VERSION=v1
ENABLE_MOCK_DATA=true
```

> `ENABLE_MOCK_DATA=true` skips the backend entirely — frontend runs on mock data.

For the backend, copy and fill the auth config:

```bash
cp backend/src/Presentation/appsettings.auth.example.json \
   backend/src/Presentation/appsettings.auth.json
```

---

## 3. Database (Backend only)

Apply EF Core migrations:

```bash
npm run backend:migrations
# or: cd backend && dotnet ef database update --project src/Infrastructure --startup-project src/Presentation
```

> Default uses SQL Server. Switch to SQLite by updating the connection string in `appsettings.json`.

---

## 4. Run

### Frontend (Angular)

```bash
npm run frontend:start
# → http://localhost:4200
```

### Backend (.NET API)

```bash
npm run backend:start
# → https://localhost:5001
# → Swagger UI: https://localhost:5001/swagger
```

---

## 5. Verify Installation

```bash
node --version    # Should be 20.x
npm --version     # Should be 10+
dotnet --version  # Should be 9.x
ng version        # Angular CLI version
```

---

## Development Tips

### Generate Angular Artifacts

```bash
# Component
ng generate component app/products/components/my-component

# Service
ng generate service app/shared/services/my-service
```

### Add a Backend Migration

```bash
cd backend
dotnet ef migrations add MyMigrationName \
  --project src/Infrastructure \
  --startup-project src/Presentation
```

### Watch Mode

```bash
# Frontend — rebuilds on file change (HMR enabled)
npm run frontend:start

# Backend — restart on change
cd backend && dotnet watch run --project src/Presentation
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ERR_OSSL_EVP_UNSUPPORTED` | Set `NODE_OPTIONS=--openssl-legacy-provider` or use Node 20 |
| Port 4200 in use | `ng serve --port 4201` |
| Module not found | `rm -rf frontend/node_modules && npm run frontend:install` |
| EF migration fails | Check connection string in `appsettings.json` |
| `dotnet: command not found` | Install [.NET 9 SDK](https://dotnet.microsoft.com/download) |

---

> Need more? → [GitHub Issues](https://github.com/we3ds-solution/ZYRO-Electric/issues) · `we3ds.solution@gmail.com`

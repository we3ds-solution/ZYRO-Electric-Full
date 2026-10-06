<div align="center">

# ⚡ ZYRO Electric

**Premium Tech Accessories Platform**

*"Tech. Organized. Elevated."*

[![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Build](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/build-app.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
[![Tests](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/run-tests.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

**Maintained by [we3ds-solution](https://github.com/we3ds-solution) · [we3ds.com](https://we3ds.com) · `we3ds.solution@gmail.com`**

</div>

---

## What is ZYRO Electric?

A full-stack, production-ready **e-commerce monorepo** for technology accessories — combining an **Angular 18 SPA** frontend with an **ASP.NET 9 Clean Architecture** backend.

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | Angular 18 + Tailwind CSS | SPA, UI, state management |
| Backend | ASP.NET 9 + EF Core | REST API, auth, data |
| Auth | JWT + Refresh Tokens | Stateless, secure sessions |
| CI/CD | GitHub Actions | Build, test, release, deploy |
| Hosting | Netlify / Docker / Nginx | Flexible deployment targets |

> Full tech stack and architecture → **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**

---

## 🚀 Quick Start

**Prerequisites:** Node.js 20+, .NET SDK 9.0, Git

```bash
# Clone
git clone https://github.com/we3ds-solution/ZYRO-Electric.git
cd ZYRO-Electric

# Install everything (frontend + backend)
npm run install:all

# Run frontend  →  http://localhost:4200
npm run frontend:start

# Run backend (new terminal)  →  https://localhost:5001/swagger
npm run backend:start
```

> Frontend-only (uses mock data, no backend needed):
> ```bash
> cd frontend && npm install && npm start
> ```

> Detailed setup, troubleshooting & env config → **[docs/SETUP.md](./docs/SETUP.md)**

---

## 📦 Key Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run frontend:start` | Angular dev server |
| `npm run frontend:test` | Jasmine + Karma tests |
| `npm run frontend:lint` | ESLint check |
| `npm run backend:start` | .NET API server |
| `npm run backend:test` | xUnit tests |
| `npm run backend:migrations` | Apply EF Core migrations |

---

## ✨ Highlights

- 🛍️ **Product catalog** — grid/list, real-time filters, sort, search with debounce
- 🛒 **Slide-out cart drawer** — reactive state via `BehaviorSubject`
- 👤 **JWT auth** — login / register modals, refresh token rotation
- 🌗 **Dark / Light mode** — CSS variable theming, persisted to localStorage
- 🏗️ **Clean Architecture** — Domain → Application → Infrastructure → Presentation
- ⚡ **SOLID** — all 5 principles applied across Angular shared module
- 🗂️ **Multi-layer cache** — memory + localStorage + sessionStorage strategy
- 🎨 **Glassmorphism & micro-animations** — premium mobile-first design

> Module breakdown, auth flow, caching design → **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**

---

## 🐳 Docker

```bash
# Development
docker-compose up          # → http://localhost:4200

# Production (Nginx)
docker build -t zyro-electric .
docker run -p 80:80 zyro-electric  # → http://localhost
```

> Full deployment options (Netlify, Docker, cloud) → **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

---

## 📚 Documentation

| Doc | What's inside |
|-----|--------------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System diagram, module map, auth flow, CI/CD pipeline |
| [API.md](./docs/API.md) | All REST endpoints, request/response shapes, JWT config |
| [SETUP.md](./docs/SETUP.md) | Local install, env config, troubleshooting |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Netlify, Docker, pre-deploy checklist |
| [TESTING.md](./docs/TESTING.md) | Frontend (Jasmine/Karma) + backend (xUnit) guides |
| [SOLID/OVERVIEW.md](./docs/SOLID/OVERVIEW.md) | How all 5 SOLID principles are applied |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## 🤝 Contributing

```bash
git checkout -b feature/my-feature
git commit -m 'feat(scope): description'
git push origin feature/my-feature
# Open PR → targeting develop
```

> Branch rules, commit format, PR process → **[.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)**  
> Workflow details → **[.github/WORKFLOWS.md](.github/WORKFLOWS.md)**

---

## 📝 License

MIT © [we3ds-solution](https://github.com/we3ds-solution) — see [LICENSE](LICENSE)

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/we3ds-solution">we3ds-solution</a> · <a href="https://we3ds.com">we3ds.com</a></sub>
</div>

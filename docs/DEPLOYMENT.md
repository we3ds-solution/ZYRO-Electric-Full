# 🚀 Deployment Guide — ZYRO Electric

> For local development setup → see **[SETUP.md](./SETUP.md)**

---

## Deployment Targets

| Target | Method | URL |
|--------|--------|-----|
| Netlify (frontend) | Auto-deploy from `main` | Configured via `netlify.toml` |
| Docker (frontend) | Nginx Alpine multi-stage | `http://localhost` |
| Docker Compose (dev) | Hot-reload dev container | `http://localhost:4200` |
| Backend | `dotnet publish` + any host | Configurable |

---

## 🌐 Netlify

**Automatic** — push to `main`, Netlify builds and deploys.

### First-time setup (5 min)

1. Push your fork to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **New site from Git**
3. Select the `ZYRO-Electric` repo
4. Netlify auto-reads `netlify.toml` — no manual config needed

### `netlify.toml` (already in repo)

```toml
[build]
  command = "npm run frontend:build"
  publish = "frontend/dist/zyro-electric/browser"

[build.environment]
  NODE_VERSION = "20"
  NODE_OPTIONS = "--openssl-legacy-provider"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Required GitHub Secrets (for Actions deploy)

| Secret | Where to get it |
|--------|----------------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify → Site settings → General → Site ID |

---

## 🐳 Docker — Production

Multi-stage build: Node 20 (build) → Nginx Alpine (serve). Final image ≈ 25 MB.

```bash
# Build from repo root
docker build -f docker/Dockerfile -t zyro-electric:latest .

# Run
docker run -p 80:80 zyro-electric:latest
# → http://localhost
```

### Docker Compose — Development

Hot-reload container, volume-mounted source:

```bash
docker-compose -f docker/docker-compose.yml up
# → http://localhost:4200
```

---

## ☁️ Manual / Cloud (Any Static Host)

```bash
# Build the frontend
npm run frontend:build
# Output: frontend/dist/zyro-electric/browser/

# Upload that folder to:
# - AWS S3 + CloudFront
# - Azure Static Web Apps
# - Vercel: cd frontend && npx vercel
# - Any Nginx / Apache server
```

---

## 🖥️ Backend Deployment

```bash
# Publish release build
npm run backend:publish
# Output: backend/src/Presentation/bin/Release/net9.0/publish/

# Run with production settings
dotnet backend/src/Presentation/bin/Release/net9.0/publish/Presentation.dll \
  --environment Production
```

Set production connection string and JWT secret in environment variables or a secrets manager — **never commit `appsettings.json` with real credentials**.

---

## 📋 Pre-Deploy Checklist

- [ ] `npm run frontend:build` succeeds locally
- [ ] `npm run frontend:test` all passing
- [ ] No `console.error` in browser DevTools
- [ ] `.env` is **not** committed (check `.gitignore`)
- [ ] JWT secret and DB connection string set in host environment
- [ ] Netlify/host build logs show ✅ success
- [ ] SPA redirects working (all routes → `index.html`)
- [ ] Dark/light mode, cart, auth tested end-to-end
- [ ] Favicon visible in browser tab

---

## 🆘 Deployment Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_OSSL_EVP_UNSUPPORTED` | Node > 20 without legacy OpenSSL | `NODE_OPTIONS=--openssl-legacy-provider` already set in `netlify.toml` |
| White screen on refresh | SPA redirect missing | Check `[[redirects]]` in `netlify.toml` or Nginx `try_files` |
| Build fails: module not found | Stale `node_modules` | `rm -rf frontend/node_modules && npm run frontend:install` |
| Docker build fails | Missing Dockerfile context | Run `docker build` from **repo root**, not from `docker/` |
| API 401 on all requests | JWT secret mismatch | Ensure `appsettings.auth.json` secret matches the deployed backend config |

---

**Last Updated:** October 2026  
**Maintainer:** [we3ds-solution](https://github.com/we3ds-solution) · `we3ds.solution@gmail.com`

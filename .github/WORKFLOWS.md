# GitHub Workflows — ZYRO Electric

Documentation for all CI/CD workflows. Maintained by [we3ds-solution](https://github.com/we3ds-solution).

---

## Workflow Overview

```
.github/workflows/
├── build-app.yml           # Compile Angular application
├── run-tests.yml           # Run frontend unit tests
├── coverage.yml            # Coverage reports
├── security.yml            # Security scanning
├── validate-branch.yml     # Branch naming enforcement
├── publish-packages.yml    # NPM + Docker release
├── auto-version-bump.yml   # Bump package.json version + git tag
├── auto-release.yml        # Create GitHub release from tag
└── docs.yml                # Generate Compodoc API documentation
```

---

## Detailed Workflow Guide

### `build-app.yml` — Build Application
- **Triggers:** Push to `main`, `develop`, `feature/*`, `bugfix/*`; Pull Requests
- **Purpose:** Compile Angular 18 application to production bundle; verify build succeeds
- **Steps:** Checkout → Node 20 setup → `npm ci` → `npm run frontend:build` → Upload artifacts
- **Artifacts:** Build outputs (5 days retention)

---

### `run-tests.yml` — Unit Tests
- **Triggers:** Push to all branches; Pull Requests
- **Purpose:** Run Angular unit tests (Jasmine + Karma) in headless Chrome
- **Command:** `npm run frontend:test -- --watch=false --browsers=ChromeHeadless`
- **Outputs:** Test results in CI log

---

### `coverage.yml` — Coverage Report
- **Triggers:** Push to all branches; Pull Requests
- **Purpose:** Run tests with code coverage and publish the report
- **Command:** `npm run frontend:test -- --watch=false --code-coverage`
- **Outputs:** `coverage/` report artifact (30 days retention)
- **Features:** Posts coverage summary comment on PRs

---

### `security.yml` — Security Scan
- **Triggers:** Push to all branches; Pull Requests; Weekly schedule (Mondays 08:00 UTC)
- **Purpose:** Multi-layer security scanning
- **Checks:**
  - `npm audit` — dependency vulnerabilities
  - TruffleHog — hardcoded secrets detection
  - Hadolint — Dockerfile linting

---

### `validate-branch.yml` — Branch Name Validation
- **Triggers:** Push to any branch; Pull Requests
- **Purpose:** Enforce branch naming convention
- **Allowed patterns:**
  - `feature/<slug>` — new features
  - `bugfix/<slug>` — bug fixes
  - `hotfix/<slug>` — urgent production fixes
  - `release/<version>` — release preparation
  - `chore/<slug>` — maintenance tasks
  - `main`, `develop` — protected branches

---

### `publish-packages.yml` — Publish Packages
- **Triggers:** Push to `main`; Tag push (`v*`); Manual trigger
- **Purpose:** Publish NPM package and Docker image to GHCR
- **Jobs:**
  1. **build** — Compile application
  2. **publish-npm** — Publish to GitHub Packages (`@we3ds-solution/zyro-electric`)
  3. **publish-docker** — Push to GHCR (`ghcr.io/we3ds-solution/zyro-electric`)
- **Tags created:**
  - `latest` — latest stable release
  - Version number from tag (e.g., `v1.0.5` → `1.0.5`)

---

### `auto-version-bump.yml` — Auto Version Bump
- **Triggers:** Push to `main` (conventional commit detected)
- **Purpose:** Read commit type, bump `package.json` version accordingly, push a git tag
- **Logic:**
  - `feat:` → minor bump
  - `fix:` / `chore:` → patch bump
  - `BREAKING CHANGE:` → major bump

---

### `auto-release.yml` — Auto GitHub Release
- **Triggers:** Tag push (`v*`)
- **Purpose:** Generate GitHub Release with auto-generated changelog from commits since last tag
- **Outputs:** GitHub Release with changelog, source archives

---

### `docs.yml` — Generate Documentation
- **Triggers:** Push to `main`
- **Purpose:** Generate Compodoc API documentation from Angular source
- **Command:** `npx compodoc -p tsconfig.json -d ../docs`
- **Outputs:** HTML documentation published to `docs/` or GitHub Pages

---

## Branch Trigger Matrix

| Branch | Triggered Workflows |
|--------|---------------------|
| `main` | build-app, run-tests, coverage, security, validate-branch, publish-packages, auto-version-bump, docs |
| `develop` | build-app, run-tests, coverage, security, validate-branch |
| `feature/*` | build-app, run-tests, security, validate-branch |
| `bugfix/*` | build-app, run-tests, security, validate-branch |
| `hotfix/*` | build-app, run-tests, security, validate-branch |
| Tag `v*` | publish-packages, auto-release |

---

## Pull Request Trigger Matrix

| PR Target | Triggered Workflows |
|-----------|---------------------|
| → `main` | build-app, run-tests, coverage, security, validate-branch |
| → `develop` | build-app, run-tests, coverage, security, validate-branch |

---

## Required Secrets

| Secret | Scope | Used By |
|--------|-------|---------|
| `GH_PAT` | `write:packages`, `read:packages` | `publish-packages.yml` |
| `NETLIFY_AUTH_TOKEN` | Netlify | External deploy (if configured) |
| `NETLIFY_SITE_ID` | Netlify | External deploy (if configured) |

---

## Workflow Execution Flow

### Feature Branch Push
```
1. Push to feature/my-feature
2. validate-branch.yml  →  branch name check
3. build-app.yml        →  Angular build
4. run-tests.yml        →  unit tests
5. security.yml         →  security scan
```

### Main Branch Merge
```
1. Merge PR → main
2. build-app.yml + run-tests.yml + coverage.yml + security.yml  (parallel)
3. auto-version-bump.yml  →  bumps version, creates git tag
4. auto-release.yml       →  creates GitHub Release
5. publish-packages.yml   →  publishes NPM + Docker
6. docs.yml               →  regenerates Compodoc docs
```

### Release Tag Push
```
1. git tag v1.1.0 && git push origin v1.1.0
2. publish-packages.yml   →  publishes @we3ds-solution/zyro-electric@1.1.0
                              & ghcr.io/we3ds-solution/zyro-electric:1.1.0
3. auto-release.yml       →  creates GitHub Release
```

---

## Status Badges

```markdown
[![Build](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/build-app.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
[![Tests](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/run-tests.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
[![Security](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/security.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
[![Coverage](https://github.com/we3ds-solution/ZYRO-Electric/actions/workflows/coverage.yml/badge.svg)](https://github.com/we3ds-solution/ZYRO-Electric/actions)
```

---

## Common Issues & Solutions

### Build Fails
```bash
# Clean install
cd frontend
rm -rf node_modules
npm install
npm run frontend:build
```

### Tests Fail
```bash
cd frontend
npm run frontend:test -- --watch
# Fix failing tests, then re-run
```

### Security Warning
```bash
cd frontend
npm audit
npm audit fix
```

### Branch Name Rejected
Branch must match one of: `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`, `chore/*`, `main`, `develop`.

---

**Total:** 9 workflows — no duplicates, clear separation by purpose.

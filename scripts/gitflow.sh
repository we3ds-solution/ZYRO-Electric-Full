ZYRO-Electric Git Workflow (Gitflow)
====================================

BRANCH NAMING CONVENTIONS
========================

1. Main Branch: main
   - Production-ready code
   - Triggered workflows:
     - ci-build.yml (Build & verify)
     - release-publish.yml (NPM + Docker release)
     - deploy-production.yml (Netlify deployment)
     - ci-docker.yml (Docker build verification)

2. Develop Branch: develop
   - Integration branch for features
   - Triggered workflows:
     - ci-build.yml (Build & verify)
     - ci-docker.yml (Docker build verification)

3. Feature Branches: feature/*
   - Format: feature/feature-name
   - Example: feature/user-authentication, feature/payment-integration
   - Triggered workflows:
     - ci-build.yml (Build & verify)
     - ci-feature.yml (Validate + build)
     - ci-docker.yml (Docker build)
   - Merge to: develop
   - Requires: Pull request review

4. Bugfix Branches: bugfix/*
   - Format: bugfix/issue-name
   - Example: bugfix/login-error, bugfix/cart-calculation
   - Triggered workflows:
     - ci-build.yml (Build & verify)
     - ci-bugfix.yml (Validate + verify)
     - ci-docker.yml (Docker build)
   - Merge to: develop
   - Requires: Pull request review

5. Hotfix Branches: hotfix/*
   - Format: hotfix/critical-issue
   - Example: hotfix/security-patch, hotfix/payment-failure
   - Triggered workflows:
     - ci-build.yml (Build & verify)
     - ci-bugfix.yml (Validate + verify)
     - ci-docker.yml (Docker build)
   - Merge to: main + develop
   - Requires: Pull request review

RELEASE PROCESS
===============

1. Create Release Tag
   - Format: v*.*.* (semantic versioning)
   - Example: v1.0.5, v2.1.3
   - Triggered workflows:
     - release-publish.yml (NPM + Docker publish)
     - deploy-production.yml (Deploy)

2. Tagging
   git tag -a v1.0.5 -m "Release version 1.0.5"
   git push origin v1.0.5

3. Publishing
   - NPM Package: @mostafa-said7/zyro-electric@1.0.5
   - Docker Image: ghcr.io/mostafa-said7/zyro-electric:latest + ghcr.io/mostafa-said7/zyro-electric:1.0.5
   - Netlify: Automatically deployed

WORKFLOWS
=========

CI Workflows (Continuous Integration)
- ci-build.yml: Main build pipeline (Node.js build)
- ci-feature.yml: Feature branch validation
- ci-bugfix.yml: Bugfix/hotfix validation
- ci-docker.yml: Docker image build verification

Quality Workflows (Testing & Analysis)
- quality-lint.yml: ESLint and code style validation
- quality-test.yml: Unit tests and coverage analysis
- quality-security.yml: Security scanning (audit, secrets, CodeQL, Dockerfile)
- quality-validate.yml: Configuration and structure validation
- quality-analysis.yml: Code complexity and type checking

Release Workflows
- release-publish.yml: Publishes NPM package and Docker image

Deploy Workflows
- deploy-production.yml: Deploys to Netlify production

QUALITY CHECKS
==============

Every push triggers quality workflows:

✓ Linting: ESLint validation
✓ Testing: Unit tests + coverage
✓ Security: npm audit, secret scan, CodeQL, Dockerfile scan
✓ Validation: Config files, dependencies, environment
✓ Analysis: Type checking, bundle size, complexity

WORKFLOW TRIGGERS
=================

✓ Push to main, develop, feature/*, bugfix/*, hotfix/*
✓ Pull requests to main and develop
✓ Tag pushes (v*.*.*)
✓ Manual trigger (workflow_dispatch)

SETUP REQUIRED
==============

Secrets needed in GitHub:
- GH_PAT: Personal Access Token for NPM + Docker publishing
  Scopes: write:packages, read:packages

- NETLIFY_AUTH_TOKEN: Netlify authentication token
- NETLIFY_SITE_ID: Netlify site ID

QUICK START
===========

1. Create Feature Branch
   git checkout -b feature/new-feature develop
   git push -u origin feature/new-feature

2. Create Pull Request
   - Base: develop
   - Head: feature/new-feature
   - CI workflows run automatically

3. Merge to Develop
   - Requires passing CI checks
   - Requires code review

4. Create Release
   git checkout main
   git merge develop
   git tag -a v1.0.5 -m "Release version 1.0.5"
   git push origin main
   git push origin v1.0.5

5. Workflows Execute
   - release-publish.yml publishes NPM + Docker
   - deploy-production.yml deploys to Netlify

BRANCH PROTECTION
=================

Recommended settings for main branch:
- Require pull request reviews (minimum 1)
- Require status checks to pass before merging
- Include administrators in restrictions
- Require branches to be up to date
- Require commit signatures

TROUBLESHOOTING
===============

No Workflows Running?
- Check branch name matches pattern (feature/*, bugfix/*)
- Check event trigger (push, pull_request, tag)
- View Actions tab to debug

Secrets Not Found?
- Verify GH_PAT secret exists in GitHub Settings
- Check scope includes write:packages

Release Not Publishing?
- Verify tag format (v*.*.*)
- Check GH_PAT has proper scopes
- View release-publish.yml logs in Actions

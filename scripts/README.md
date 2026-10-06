# Developer Scripts — ZYRO Electric

Utility scripts maintained by [we3ds-solution](https://github.com/we3ds-solution).

These scripts support development workflows and are run via `npm run scripts:*` from the monorepo root.

---

## Scripts

### `generate-cache-report.js`

**Purpose:** Analyzes the Angular source code for duplicate or similar code clusters and generates a structured JSON report.  
**Usage:**
```bash
npm run scripts:cache-report
# or directly
node scripts/generate-cache-report.js
```
**Output:** Console report of code similarity clusters bucketed by `identical`, `near-identical`, `structural`, or `different`.  
**See:** [`CACHE-REPORT-ROUTING.md`](./CACHE-REPORT-ROUTING.md) for routing logic details.

---

### `add-schemas.js`

**Purpose:** Adds JSON schema references to spec/configuration files that are missing them, helping IDE auto-complete and validation.  
**Usage:**
```bash
node scripts/add-schemas.js
```

---

### `fix-spec-schemas.js`

**Purpose:** Corrects invalid or mismatched JSON schemas in Angular spec files.  
**Usage:**
```bash
node scripts/fix-spec-schemas.js
```

---

### `gitflow.sh`

**Purpose:** Bash helper for common Gitflow operations — creating feature/bugfix/release branches and merging them following the project's branch naming convention.  
**Usage:**
```bash
bash scripts/gitflow.sh feature my-feature
bash scripts/gitflow.sh bugfix cart-overflow
bash scripts/gitflow.sh release 1.1.0
```

---

## Notes

- Scripts are for **developer use only** — they are not part of the production build
- Run scripts from the **monorepo root** to ensure relative paths resolve correctly
- The `.ts` version of `generate-cache-report` was removed — the `.js` version is the canonical one

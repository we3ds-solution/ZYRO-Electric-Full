# Cache Report Routing Strategy

## Overview

This document defines the **consistent bucket routing rules** for the cache report generator. The system classifies code clusters based on two metrics:

- **Structural Similarity** (0.0 to 1.0)
- **Token Jaccard** (0.0 to 1.0)

Each cluster is assigned to exactly one bucket based on these metrics.

---

## Routing Rules

### Rule 1: `identical`
**Exact match on both dimensions**

```typescript
structural_similarity === 1.0 AND token_jaccard === 1.0
```

**Examples:**
- Exact duplicates
- Copy-pasted code
- Auto-generated boilerplate (identical)

**Cluster Example:**
```json
{
  "cluster_id": "a1b2c3d4e5f6g7h8",
  "structural_similarity": 1.0,
  "token_jaccard": 1.0,
  "bucket": "identical"
}
```

---

### Rule 2: `nearly_identical`
**Perfect structure, high token similarity (but not 1.0)**

```typescript
structural_similarity === 1.0 AND 0.85 <= token_jaccard < 1.0
```

**Examples:**
- Same structure with different variable names
- Refactored versions of the same logic
- Similar components with minor text differences

**Cluster Example:**
```json
{
  "cluster_id": "f7e660299da5a190",
  "structural_similarity": 1.0,
  "token_jaccard": 0.92,
  "bucket": "nearly_identical"
}
```

---

### Rule 3: `structural_only`
**Perfect structure, low token similarity**

```typescript
structural_similarity === 1.0 AND token_jaccard < 0.05
```

**Examples:**
- Template instances with different content
- Strategy pattern implementations
- Components with same structure but different business logic

**Cluster Example:**
```json
{
  "cluster_id": "3f64602ec7d6bd4d",
  "structural_similarity": 1.0,
  "token_jaccard": 0.03,
  "bucket": "structural_only"
}
```

**Important:** This was the bug in the original report. Cluster `3f64602ec7d6bd4d` had `token_jaccard: 1.0` but was marked `structural_only`, which violates the rule requiring `token_jaccard < 0.05`.

---

### Rule 4: `semantic`
**High semantic similarity, not structurally identical**

```typescript
structural_similarity < 1.0 AND token_jaccard >= 0.6
```

**Examples:**
- Semantically similar but different implementations
- Refactored code with changed structure
- Related functionality in different modules

**Cluster Example:**
```json
{
  "cluster_id": "b8c9d0e1f2g3h4i5",
  "structural_similarity": 0.87,
  "token_jaccard": 0.75,
  "bucket": "semantic"
}
```

**Note:** Anything that doesn't fit the above rules also falls into `semantic` as a fallback.

---

## Routing Decision Tree

```
┌─────────────────────────────────────┐
│  structural === 1.0?                │
└──────┬──────────────────────────────┘
       │
  ┌────┴────┐
  │ YES     │ NO
  ▼         ▼
┌───────┐ ┌──────────────┐
│token  │ │  semantic    │
│=1.0?  │ │  (fallback)  │
└───┬───┘ └──────────────┘
    │
  ┌─┴─┐
  │YES│NO
  ▼   ▼
┌──────────┐ ┌─────────────┐
│identical │ │token>=0.85? │
└──────────┘ └──────┬──────┘
                    │
               ┌────┴────┐
               │YES  │NO │
               ▼     ▼   
       ┌──────────┐ ┌─────────────┐
       │nearly_   │ │token<0.05?  │
       │identical │ └──────┬──────┘
       └──────────┘        │
                      ┌────┴────┐
                      │YES  │NO │
                      ▼     ▼
              ┌───────────┐ ┌────────┐
              │structural_│ │semantic│
              │only       │ │        │
              └───────────┘ └────────┘
```

---

## Validation Rules

The report generator includes **pre-commit validation** to catch routing inconsistencies:

### Assertion: `identical` Bucket
```typescript
✅ structural_similarity === 1.0
✅ token_jaccard === 1.0
❌ token_jaccard !== 1.0 → ERROR
```

### Assertion: `nearly_identical` Bucket
```typescript
✅ structural_similarity === 1.0
✅ 0.85 <= token_jaccard < 1.0
❌ token_jaccard < 0.85 → ERROR
❌ token_jaccard === 1.0 → ERROR (should be 'identical')
```

### Assertion: `structural_only` Bucket
```typescript
✅ structural_similarity === 1.0
✅ token_jaccard < 0.05
❌ token_jaccard >= 0.05 → ERROR
```

### Assertion: `semantic` Bucket
```typescript
✅ structural_similarity < 1.0 OR token_jaccard < 0.6
❌ structural === 1.0 AND token_jaccard >= 0.85 → ERROR (should be 'nearly_identical')
❌ structural === 1.0 AND token_jaccard === 1.0 → ERROR (should be 'identical')
```

---

## Report Structure

### Full Schema

```json
{
  "generated_at": "2026-08-16T21:14:46.977Z",
  "routing_rules": {
    "identical": {
      "structural": 1.0,
      "token_jaccard": 1.0
    },
    "nearly_identical": {
      "structural": 1.0,
      "token_jaccard_min": 0.85
    },
    "structural_only": {
      "structural": 1.0,
      "token_jaccard_max": 0.05
    },
    "semantic": {
      "structural_max": 0.99,
      "token_jaccard_min": 0.6
    }
  },
  "clusters": [
    {
      "cluster_id": "a1b2c3d4e5f6g7h8",
      "structural_similarity": 1.0,
      "token_jaccard": 1.0,
      "files": ["file1.ts", "file2.ts"],
      "bucket": "identical"
    }
  ],
  "validation": {
    "passed": true,
    "errors": []
  }
}
```

---

## Usage

### Generate Report

```bash
npm run generate:cache-report
```

### Expected Output

```
✅ Validation PASSED. All clusters correctly routed.

📊 Report Summary:
  Generated: 2026-08-16T21:14:46.977Z
  Total Clusters: 7
  Bucket Distribution:
    - Identical: 1
    - Nearly Identical: 2
    - Structural Only: 2
    - Semantic: 2

💾 Report saved to: .deslop/cache/live-report.json
```

### Validation Failure Example

If the report has inconsistencies, the script will **exit with code 1**:

```
❌ Validation FAILED. Report has routing inconsistencies:
  - Cluster 3f64602ec7d6bd4d: 'structural_only' requires token_jaccard < 0.05, got 1.0
  - Cluster f7e660299da5a190: token_jaccard=1.0 should be 'identical', not 'nearly_identical'
```

---

## Edge Cases

### Case 1: `structural=1.0, token_jaccard=0.04`
**Bucket:** `structural_only` ✅

### Case 2: `structural=1.0, token_jaccard=0.05`
**Bucket:** `semantic` (fallback, doesn't meet `structural_only` threshold)

### Case 3: `structural=1.0, token_jaccard=0.84`
**Bucket:** `semantic` (doesn't meet `nearly_identical` threshold of 0.85)

### Case 4: `structural=0.99, token_jaccard=1.0`
**Bucket:** `semantic` (not structurally identical)

### Case 5: `structural=1.0, token_jaccard=1.0`
**Bucket:** `identical` ✅ (the only case that qualifies)

---

## Original Bug Report

### Issue
> "structural_only requires token_jaccard < 0.05, but cluster 3f64602ec7d6bd4d has token_jaccard: 1.0"

### Root Cause
The original report generator did not validate bucket assignments before committing the report. Cluster `3f64602ec7d6bd4d` was manually assigned `structural_only` despite having `token_jaccard: 1.0`, which violates the routing rule.

### Fix
1. ✅ Added `assignBucket()` function with strict routing logic
2. ✅ Added `validateClusterRouting()` to catch inconsistencies
3. ✅ Added pre-commit validation assertion (exits with error if validation fails)
4. ✅ Regenerated report with consistent bucket routing

---

## Integration with Caching Strategy

This report feeds into the **Market-User caching strategy** (see `.kiro/steering/caching-strategy.md`):

- **Identical clusters** → Share cache aggressively (100% overlap)
- **Nearly identical clusters** → Share cache with TTL adjustments
- **Structural only clusters** → Cache invalidation based on structure changes
- **Semantic clusters** → Independent cache management

---

## Files

- **Report Generator:** `scripts/generate-cache-report.js`
- **Generated Report:** `.deslop/cache/live-report.json`
- **npm Script:** `npm run generate:cache-report`
- **Documentation:** `docs/CACHE-REPORT-ROUTING.md`

---

## References

- [Token Jaccard Similarity](https://en.wikipedia.org/wiki/Jaccard_index)
- [Structural Similarity in Code Analysis](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- Market-User Caching Strategy: `.kiro/steering/caching-strategy.md`

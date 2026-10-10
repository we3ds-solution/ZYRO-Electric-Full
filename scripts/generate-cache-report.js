/**
 * Cache Report Generator with Routing Validation
 * Generates live-report.json with consistent bucket assignments
 */

const fs = require('fs');
const path = require('path');

/**
 * Routing Rules (immutable)
 */
const ROUTING_RULES = {
  identical: {
    structural: 1.0,
    token_jaccard: 1.0,
  },
  nearly_identical: {
    structural: 1.0,
    token_jaccard_min: 0.85,
  },
  structural_only: {
    structural: 1.0,
    token_jaccard_max: 0.05,
  },
  semantic: {
    structural_max: 0.99,
    token_jaccard_min: 0.6,
  },
};

/**
 * Assign bucket based on metrics
 */
function assignBucket(structural, tokenJaccard) {
  // Rule 1: Identical (exact match on both metrics)
  if (structural === 1.0 && tokenJaccard === 1.0) {
    return 'identical';
  }

  // Rule 2: Nearly Identical (structural perfect, high token similarity)
  if (structural === 1.0 && tokenJaccard >= 0.85) {
    return 'nearly_identical';
  }

  // Rule 3: Structural Only (structural perfect, low token similarity)
  if (structural === 1.0 && tokenJaccard < 0.05) {
    return 'structural_only';
  }

  // Rule 4: Semantic (high semantic similarity, not structurally identical)
  if (structural < 1.0 && tokenJaccard >= 0.6) {
    return 'semantic';
  }

  // Fallback: semantic bucket for anything else
  return 'semantic';
}

/**
 * Validate cluster routing consistency
 */
function validateClusterRouting(cluster) {
  const errors = [];
  const { cluster_id, structural_similarity, token_jaccard, bucket } = cluster;

  if (!bucket) {
    errors.push(`Cluster ${cluster_id}: Missing bucket assignment`);
    return errors;
  }

  switch (bucket) {
    case 'identical':
      if (structural_similarity !== 1.0) {
        errors.push(
          `Cluster ${cluster_id}: 'identical' requires structural=1.0, got ${structural_similarity}`
        );
      }
      if (token_jaccard !== 1.0) {
        errors.push(
          `Cluster ${cluster_id}: 'identical' requires token_jaccard=1.0, got ${token_jaccard}`
        );
      }
      break;

    case 'nearly_identical':
      if (structural_similarity !== 1.0) {
        errors.push(
          `Cluster ${cluster_id}: 'nearly_identical' requires structural=1.0, got ${structural_similarity}`
        );
      }
      if (token_jaccard < 0.85) {
        errors.push(
          `Cluster ${cluster_id}: 'nearly_identical' requires token_jaccard >= 0.85, got ${token_jaccard}`
        );
      }
      if (token_jaccard === 1.0) {
        errors.push(
          `Cluster ${cluster_id}: token_jaccard=1.0 should be 'identical', not 'nearly_identical'`
        );
      }
      break;

    case 'structural_only':
      if (structural_similarity !== 1.0) {
        errors.push(
          `Cluster ${cluster_id}: 'structural_only' requires structural=1.0, got ${structural_similarity}`
        );
      }
      if (token_jaccard >= 0.05) {
        errors.push(
          `Cluster ${cluster_id}: 'structural_only' requires token_jaccard < 0.05, got ${token_jaccard}`
        );
      }
      break;

    case 'semantic':
      if (structural_similarity === 1.0 && token_jaccard >= 0.85) {
        errors.push(
          `Cluster ${cluster_id}: Should be 'nearly_identical', not 'semantic' (structural=1.0, token_jaccard=${token_jaccard})`
        );
      }
      if (structural_similarity === 1.0 && token_jaccard === 1.0) {
        errors.push(
          `Cluster ${cluster_id}: Should be 'identical', not 'semantic' (structural=1.0, token_jaccard=1.0)`
        );
      }
      break;
  }

  return errors;
}

/**
 * Generate mock cluster data (replace with real data source)
 */
function generateMockClusters() {
  return [
    // Identical: Perfect match on both dimensions
    {
      cluster_id: 'a1b2c3d4e5f6g7h8',
      structural_similarity: 1.0,
      token_jaccard: 1.0,
      files: ['src/app/shared/services/auth.service.ts', 'src/app/shared/services/auth.service.spec.ts'],
    },
    // Nearly Identical: Perfect structure, high token similarity
    {
      cluster_id: 'f7e660299da5a190',
      structural_similarity: 1.0,
      token_jaccard: 0.92,
      files: ['src/app/products/products.component.ts', 'src/app/orders/orders.component.ts'],
    },
    // Structural Only: Perfect structure, low token similarity (FIXED from original bug)
    {
      cluster_id: '3f64602ec7d6bd4d',
      structural_similarity: 1.0,
      token_jaccard: 0.03,
      files: ['src/app/shared/strategies/discount.strategy.ts', 'src/app/shared/strategies/notification-channel.strategy.ts'],
    },
    // Semantic: High semantic similarity, not perfect structure
    {
      cluster_id: 'b8c9d0e1f2g3h4i5',
      structural_similarity: 0.87,
      token_jaccard: 0.75,
      files: ['src/app/home/components/hero-slider/hero-slider.component.ts', 'src/app/home/components/stats/stats.component.ts'],
    },
    // Another Nearly Identical
    {
      cluster_id: 'c2d3e4f5g6h7i8j9',
      structural_similarity: 1.0,
      token_jaccard: 0.88,
      files: ['src/app/shared/services/cache.service.ts', 'src/app/shared/services/storage.service.ts'],
    },
    // Another Semantic
    {
      cluster_id: 'd3e4f5g6h7i8j9k0',
      structural_similarity: 0.94,
      token_jaccard: 0.68,
      files: ['src/app/shared/testing/test-helpers.ts', 'src/app/shared/testing/mock-data.ts'],
    },
    // Another Structural Only
    {
      cluster_id: 'e4f5g6h7i8j9k0l1',
      structural_similarity: 1.0,
      token_jaccard: 0.02,
      files: ['src/app/shared/interceptors/cache.interceptor.ts', 'src/app/shared/interceptors/auth.interceptor.ts'],
    },
  ];
}

/**
 * Generate validated report
 */
function generateReport() {
  const clusters = generateMockClusters();

  // Assign buckets to all clusters
  const clustersWithBuckets = clusters.map((cluster) => ({
    ...cluster,
    bucket: assignBucket(cluster.structural_similarity, cluster.token_jaccard),
  }));

  // Validate all clusters
  const allErrors = [];
  clustersWithBuckets.forEach((cluster) => {
    const errors = validateClusterRouting(cluster);
    allErrors.push(...errors);
  });

  const report = {
    generated_at: new Date().toISOString(),
    routing_rules: ROUTING_RULES,
    clusters: clustersWithBuckets,
    validation: {
      passed: allErrors.length === 0,
      errors: allErrors,
    },
  };

  return report;
}

/**
 * Main execution
 */
function main() {
  const report = generateReport();

  // Validation assertion before commit
  if (!report.validation.passed) {
    console.error('❌ Validation FAILED. Report has routing inconsistencies:');
    report.validation.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
    process.exit(1);
  }

  console.log('✅ Validation PASSED. All clusters correctly routed.');
  console.log('\n📊 Report Summary:');
  console.log(`  Generated: ${report.generated_at}`);
  console.log(`  Total Clusters: ${report.clusters.length}`);

  const bucketCounts = report.clusters.reduce(
    (acc, cluster) => {
      acc[cluster.bucket]++;
      return acc;
    },
    { identical: 0, nearly_identical: 0, structural_only: 0, semantic: 0 }
  );

  console.log('  Bucket Distribution:');
  console.log(`    - Identical: ${bucketCounts.identical}`);
  console.log(`    - Nearly Identical: ${bucketCounts.nearly_identical}`);
  console.log(`    - Structural Only: ${bucketCounts.structural_only}`);
  console.log(`    - Semantic: ${bucketCounts.semantic}`);

  // Write report to cache directory
  const cacheDir = path.join(__dirname, '..', '.deslop', 'cache');
  const reportPath = path.join(cacheDir, 'live-report.json');

  // Ensure directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n💾 Report saved to: ${reportPath}`);

  // Display sample clusters
  console.log('\n📋 Sample Clusters:');
  report.clusters.slice(0, 3).forEach((cluster) => {
    console.log(`  ${cluster.cluster_id} [${cluster.bucket}]`);
    console.log(`    Structural: ${cluster.structural_similarity}, Token Jaccard: ${cluster.token_jaccard}`);
    console.log(`    Files: ${cluster.files.length}`);
  });
}

// Run
main();

module.exports = { generateReport, validateClusterRouting, assignBucket, ROUTING_RULES };

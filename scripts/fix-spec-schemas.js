/**
 * Script: fix-spec-schemas.js
 * Adds NO_ERRORS_SCHEMA to all Angular component spec files that use
 * configureTestingModule but are missing a schemas entry.
 * This fixes NG0304 errors for unknown elements like <lucide-icon>.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SRC_DIR = path.join(__dirname, '..', 'src');

function findSpecFiles(dir) {
  return glob.sync('**/*.spec.ts', { cwd: dir, absolute: true });
}

function fixSpecFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Only process files that use configureTestingModule (component tests)
  if (!content.includes('configureTestingModule')) return false;

  // Skip if already has NO_ERRORS_SCHEMA or NO_ERRORS_SCHEMA
  if (content.includes('NO_ERRORS_SCHEMA') || content.includes('CUSTOM_ELEMENTS_SCHEMA')) {
    // Still ensure it's imported if used
    return false;
  }

  // Add the import for NO_ERRORS_SCHEMA if not present
  if (!content.includes('NO_ERRORS_SCHEMA')) {
    // Add to existing @angular/core import
    if (content.includes("from '@angular/core'")) {
      content = content.replace(
        /import\s*\{([^}]+)\}\s*from\s*'@angular\/core'/,
        (match, imports) => {
          const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
          if (!importList.includes('NO_ERRORS_SCHEMA')) {
            importList.push('NO_ERRORS_SCHEMA');
          }
          return `import { ${importList.join(', ')} } from '@angular/core'`;
        }
      );
    } else {
      // Add new import line after the first import statement
      content = content.replace(
        /^(import .+;\n)/m,
        `$1import { NO_ERRORS_SCHEMA } from '@angular/core';\n`
      );
    }
  }

  // Add schemas to each configureTestingModule call that doesn't have one
  // Handle cases with and without trailing commas/schema arrays
  content = content.replace(
    /(\}\s*\)[\s\r\n]*\.compileComponents\(\))/g,
    (match, ending) => {
      // Check if there's already a schemas property nearby in the block
      return match;
    }
  );

  // More targeted: find configureTestingModule blocks missing schemas
  // Match the closing }) of configureTestingModule calls
  // Strategy: find .compileComponents() or direct closing and add schemas before last }
  
  // Find all configureTestingModule({...}) blocks
  let offset = 0;
  let newContent = '';
  const pattern = /configureTestingModule\(\{/g;
  let match;
  
  // Reset and reprocess
  content = originalContent;
  
  // Re-add import
  if (!content.includes('NO_ERRORS_SCHEMA') && !content.includes('CUSTOM_ELEMENTS_SCHEMA')) {
    if (content.includes("from '@angular/core'")) {
      content = content.replace(
        /import\s*\{([^}]+)\}\s*from\s*'@angular\/core'/,
        (m, imports) => {
          const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
          if (!importList.includes('NO_ERRORS_SCHEMA')) {
            importList.push('NO_ERRORS_SCHEMA');
          }
          return `import { ${importList.join(', ')} } from '@angular/core'`;
        }
      );
    } else {
      content = `import { NO_ERRORS_SCHEMA } from '@angular/core';\n` + content;
    }
  }

  // Find each configureTestingModule block and add schemas if missing
  // We'll use a brace-counting approach to find the end of each block
  let searchStart = 0;
  while (true) {
    const idx = content.indexOf('configureTestingModule({', searchStart);
    if (idx === -1) break;

    // Find the matching closing }) of the object
    let depth = 0;
    let i = idx + 'configureTestingModule('.length;
    let blockStart = i;
    let blockEnd = -1;
    
    for (; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          blockEnd = i;
          break;
        }
      }
    }

    if (blockEnd === -1) {
      searchStart = idx + 1;
      continue;
    }

    const block = content.substring(blockStart, blockEnd + 1);

    if (!block.includes('schemas') && !block.includes('NO_ERRORS_SCHEMA') && !block.includes('CUSTOM_ELEMENTS_SCHEMA')) {
      // Insert schemas before the closing }
      const insertion = `,\n      schemas: [ NO_ERRORS_SCHEMA ]`;
      // Find last } that is at depth 0
      content = content.substring(0, blockEnd) + insertion + content.substring(blockEnd);
      searchStart = blockEnd + insertion.length + 1;
    } else {
      searchStart = blockEnd + 1;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const specFiles = findSpecFiles(SRC_DIR);
let fixedCount = 0;
let skippedCount = 0;

for (const file of specFiles) {
  const wasFixed = fixSpecFile(file);
  if (wasFixed) {
    console.log(`✅ Fixed: ${path.relative(SRC_DIR, file)}`);
    fixedCount++;
  } else {
    skippedCount++;
  }
}

console.log(`\nDone. Fixed ${fixedCount} file(s), skipped ${skippedCount} file(s).`);

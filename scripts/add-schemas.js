/**
 * Adds schemas: [ NO_ERRORS_SCHEMA ] to configureTestingModule blocks
 * in all spec files that have the import but not the schemas property.
 */

const fs = require('fs');
const path = require('path');

const filePaths = process.argv.slice(2);

for (const filePath of filePaths) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Find each configureTestingModule block and add schemas if missing
  let result = '';
  let searchFrom = 0;

  while (true) {
    const startToken = 'configureTestingModule(';
    const idx = content.indexOf(startToken, searchFrom);
    if (idx === -1) {
      result += content.substring(searchFrom);
      break;
    }

    result += content.substring(searchFrom, idx + startToken.length);

    // Now find the matching opening { - skip whitespace
    let i = idx + startToken.length;
    while (i < content.length && content[i] !== '{') i++;
    if (i >= content.length) { result += content.substring(idx + startToken.length); break; }

    // Now brace-count to find the matching }
    const openBrace = i;
    result += content.substring(idx + startToken.length, openBrace + 1);
    i++;

    let depth = 1;
    let blockContent = '';
    let closeBrace = -1;

    while (i < content.length && depth > 0) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) { closeBrace = i; break; }
      }
      blockContent += content[i];
      i++;
    }

    if (closeBrace === -1) {
      result += blockContent;
      searchFrom = i;
      break;
    }

    // Check if this block already has schemas
    if (blockContent.includes('schemas')) {
      result += blockContent + '}';
    } else {
      // Add schemas before closing brace
      // Find the last non-whitespace position
      const trimmed = blockContent.trimEnd();
      const trailing = blockContent.substring(trimmed.length);
      // Add a comma if needed
      const needsComma = trimmed.length > 0 && !trimmed.endsWith(',');
      result += trimmed + (needsComma ? ',' : '') + '\n      schemas: [ NO_ERRORS_SCHEMA ]' + trailing + '}';
    }

    searchFrom = closeBrace + 1;
  }

  if (result !== originalContent) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log(`Fixed: ${path.basename(filePath)}`);
  } else {
    console.log(`Unchanged: ${path.basename(filePath)}`);
  }
}

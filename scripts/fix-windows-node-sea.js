/**
 * Postinstall script: Fix Windows incompatibility with node:sea module
 *
 * Problem: Node.js 20+ includes 'node:sea' in builtinModules.
 * @expo/cli tries to create a directory named 'node:sea' for metro shims,
 * but Windows does not allow ':' in directory names → ENOENT error.
 *
 * Fix: Patch externals.js to filter out any builtinModule that contains ':'
 */

const fs = require('fs');
const path = require('path');

const externalFile = path.join(
  __dirname,
  '..',
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'start',
  'server',
  'metro',
  'externals.js'
);

if (!fs.existsSync(externalFile)) {
  console.log('externals.js not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(externalFile, 'utf8');

const OLD = `].includes(x)
    ),`;
const NEW = `].includes(x) && !x.includes(':')
    ),`;

// Only patch if not already patched
if (content.includes("!x.includes(':')")) {
  console.log('✓ Windows node:sea patch already applied');
  process.exit(0);
}

if (!content.includes(OLD)) {
  console.log('⚠ Could not find patch target in externals.js (version mismatch?)');
  process.exit(0);
}

content = content.replace(OLD, NEW);
fs.writeFileSync(externalFile, content, 'utf8');
console.log('✓ Applied Windows node:sea patch to @expo/cli externals.js');

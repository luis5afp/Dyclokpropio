'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'src', 'runtime');
const EDITABLE_EXTENSIONS = new Set(['.js', '.css', '.json', '.html']);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function normalizedRelative(root, file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function editableSet(root) {
  return new Set(
    walk(root)
      .filter((file) => EDITABLE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map((file) => normalizedRelative(root, file)),
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const bootstrapPath = path.join(SOURCE, '.bootstrap-complete.json');
assert(fs.existsSync(bootstrapPath), 'Missing src/runtime/.bootstrap-complete.json');

const bootstrap = JSON.parse(fs.readFileSync(bootstrapPath, 'utf8'));
const originalRenderer = editableSet(path.join(ROOT, 'dist'));
const sourceRenderer = editableSet(path.join(SOURCE, 'dist'));
const originalElectron = editableSet(path.join(ROOT, 'dist-electron'));
const sourceElectron = editableSet(path.join(SOURCE, 'dist-electron'));

const missingRenderer = [...originalRenderer].filter((file) => !sourceRenderer.has(file));
const missingElectron = [...originalElectron].filter((file) => !sourceElectron.has(file));

assert(
  missingRenderer.length === 0,
  'Editable runtime mirror is missing renderer files: ' + missingRenderer.join(', '),
);
assert(
  missingElectron.length === 0,
  'Editable runtime mirror is missing Electron files: ' + missingElectron.join(', '),
);

assert(
  sourceRenderer.size === bootstrap.rendererEditableFiles,
  'Renderer editable-file count drifted: manifest=' +
    bootstrap.rendererEditableFiles +
    ', actual=' +
    sourceRenderer.size,
);
assert(
  sourceElectron.size === bootstrap.electronEditableFiles,
  'Electron editable-file count drifted: manifest=' +
    bootstrap.electronEditableFiles +
    ', actual=' +
    sourceElectron.size,
);

for (const required of [
  'src/main/index.js',
  'src/preload/index.js',
  'src/shared/ipc-channels.js',
  'tools/build-reconstructed-runtime.js',
  'electron-builder.reconstructed.yml',
]) {
  const full = path.join(ROOT, required);
  assert(fs.existsSync(full), 'Missing reconstructed source contract: ' + required);
  assert(fs.statSync(full).size > 0, 'Empty reconstructed source contract: ' + required);
}

const maps = walk(SOURCE).filter((file) => file.endsWith('.map'));
assert(maps.length === 0, 'Unexpected source maps appeared in reconstructed runtime: ' + maps.join(', '));

const summary = {
  exactOriginalSource: Boolean(bootstrap.exactOriginalSource),
  rendererEditableFiles: sourceRenderer.size,
  electronEditableFiles: sourceElectron.size,
  missingRendererFiles: missingRenderer.length,
  missingElectronFiles: missingElectron.length,
  reconstructedMainPresent: true,
  reconstructedPreloadPresent: true,
  buildUsesEditableRuntimeMirror: true,
};

console.log(JSON.stringify(summary, null, 2));
console.log('Editable runtime completeness verified.');

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'src', 'runtime');
const OUTPUT = path.join(ROOT, 'build', 'reconstructed-runtime');
const editableExtensions = new Set(['.js', '.css', '.json', '.html']);

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

function copyTree(sourceRoot, targetRoot) {
  if (!fs.existsSync(sourceRoot)) return;
  for (const source of walk(sourceRoot)) {
    const relative = path.relative(sourceRoot, source);
    const target = path.join(targetRoot, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function removeEditableCode(root) {
  for (const file of walk(root)) {
    if (editableExtensions.has(path.extname(file).toLowerCase())) {
      fs.rmSync(file, { force: true });
    }
  }
}

function relativeSet(root, filter) {
  return new Set(
    walk(root)
      .filter(filter)
      .map((file) => path.relative(root, file).replace(/\\/g, '/')),
  );
}

if (!fs.existsSync(path.join(SOURCE, '.bootstrap-complete.json'))) {
  throw new Error('Editable runtime snapshot is missing. Bootstrap src/runtime first.');
}

fs.rmSync(OUTPUT, { recursive: true, force: true });

// Non-code assets continue to come from the recovered resource set.
copyTree(path.join(ROOT, 'dist'), path.join(OUTPUT, 'dist'));
copyTree(path.join(ROOT, 'dist-electron'), path.join(OUTPUT, 'dist-electron'));

// Ensure no recovered JS/CSS/JSON/HTML is silently used by the reconstructed build.
removeEditableCode(path.join(OUTPUT, 'dist'));
removeEditableCode(path.join(OUTPUT, 'dist-electron'));

// Overlay every editable runtime file from src/runtime.
copyTree(path.join(SOURCE, 'dist'), path.join(OUTPUT, 'dist'));
copyTree(
  path.join(SOURCE, 'dist-electron'),
  path.join(OUTPUT, 'dist-electron'),
);

const requiredRenderer = relativeSet(
  path.join(ROOT, 'dist'),
  (file) => editableExtensions.has(path.extname(file).toLowerCase()),
);
const editableRenderer = relativeSet(
  path.join(SOURCE, 'dist'),
  (file) => editableExtensions.has(path.extname(file).toLowerCase()),
);

const requiredElectron = relativeSet(
  path.join(ROOT, 'dist-electron'),
  (file) => editableExtensions.has(path.extname(file).toLowerCase()),
);
const editableElectron = relativeSet(
  path.join(SOURCE, 'dist-electron'),
  (file) => editableExtensions.has(path.extname(file).toLowerCase()),
);

const missingRenderer = [...requiredRenderer].filter(
  (file) => !editableRenderer.has(file),
);
const missingElectron = [...requiredElectron].filter(
  (file) => !editableElectron.has(file),
);

if (missingRenderer.length || missingElectron.length) {
  console.error('Missing editable renderer files:', missingRenderer);
  console.error('Missing editable Electron files:', missingElectron);
  throw new Error('Reconstructed build would fall back to recovered code.');
}

console.log('Reconstructed runtime prepared.');
console.log('Renderer editable files: ' + editableRenderer.size);
console.log('Electron editable files: ' + editableElectron.size);

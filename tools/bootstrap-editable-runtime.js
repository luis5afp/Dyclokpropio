'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(ROOT, 'src', 'runtime');
const MARKER = path.join(TARGET, '.bootstrap-complete.json');
const STAGE1_MAIN = path.join(ROOT, 'reconstruction-work', 'main.stage1.js');

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

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyEditableTree(sourceRoot, targetRoot) {
  let count = 0;
  for (const source of walk(sourceRoot)) {
    const ext = path.extname(source).toLowerCase();
    if (!editableExtensions.has(ext)) continue;
    const relative = path.relative(sourceRoot, source);
    copyFile(source, path.join(targetRoot, relative));
    count += 1;
  }
  return count;
}

if (fs.existsSync(MARKER)) {
  console.log('Editable runtime snapshot already exists; refusing to overwrite it.');
  console.log('Delete src/runtime/.bootstrap-complete.json only if a deliberate re-bootstrap is desired.');
  process.exit(0);
}

if (!fs.existsSync(STAGE1_MAIN)) {
  throw new Error('Missing reconstruction-work/main.stage1.js. Run reconstruction analysis first.');
}

fs.rmSync(TARGET, { recursive: true, force: true });

const rendererCount = copyEditableTree(
  path.join(ROOT, 'dist'),
  path.join(TARGET, 'dist'),
);

const electronCount = copyEditableTree(
  path.join(ROOT, 'dist-electron'),
  path.join(TARGET, 'dist-electron'),
);

// Replace the recovered main bundle with the stage-one deobfuscated equivalent.
copyFile(
  STAGE1_MAIN,
  path.join(TARGET, 'dist-electron', 'main-CuCOh59n.js'),
);

// Use the readable wrapper reconstructed earlier.
const readableWrapper = path.join(ROOT, 'dist-electron', 'main.readable.js');
if (fs.existsSync(readableWrapper)) {
  copyFile(
    readableWrapper,
    path.join(TARGET, 'dist-electron', 'main.js'),
  );
}

// Use the verified readable preload and keep its shared IPC dependency local
// to the runtime tree so relative imports stay stable.
copyFile(
  path.join(ROOT, 'src', 'preload', 'index.js'),
  path.join(TARGET, 'dist-electron', 'preload', 'index.js'),
);

copyFile(
  path.join(ROOT, 'src', 'shared', 'ipc-channels.js'),
  path.join(TARGET, 'dist-electron', 'shared', 'ipc-channels.js'),
);

const marker = {
  generatedAt: new Date().toISOString(),
  purpose: 'Editable functional source mirror reconstructed from recovered runtime code.',
  exactOriginalSource: false,
  rendererEditableFiles: rendererCount,
  electronEditableFiles: electronCount,
  mainBundleSource: 'reconstruction-work/main.stage1.js',
  preloadSource: 'src/preload/index.js',
};

fs.writeFileSync(MARKER, JSON.stringify(marker, null, 2) + '\n');

console.log('Editable renderer files copied: ' + rendererCount);
console.log('Editable Electron files copied: ' + electronCount);
console.log('Editable runtime snapshot created at src/runtime.');

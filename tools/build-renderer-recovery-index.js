'use strict';

const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '..', 'dist', 'assets');
const output = path.resolve(
  __dirname,
  '..',
  'src',
  'renderer',
  'recovered-component-index.json',
);

const files = fs.readdirSync(assetsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();

const groups = {};

for (const file of files) {
  const match = file.match(/^(.*?)-[A-Za-z0-9_-]{6,}\.([A-Za-z0-9]+)$/);
  const logicalName = match
    ? match[1]
    : file.replace(/\.[^.]+$/, '');

  groups[logicalName] ||= [];
  groups[logicalName].push({
    path: `dist/assets/${file}`,
    size: fs.statSync(path.join(assetsDir, file)).size,
  });
}

const manifest = {
  generatedFrom: 'dist/assets',
  note: 'Inventory inferred from compiled filenames. Names are recovery hints, not guaranteed original source paths.',
  assetCount: files.length,
  logicalGroupCount: Object.keys(groups).length,
  groups: Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)),
  ),
};

fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Renderer recovery index written: ${output}`);

'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  path.join(root, 'dist-electron', 'main-CuCOh59n.js'),
  path.join(root, 'dist', 'assets', 'index-BUIbb6Pa.js'),
].filter(fs.existsSync);

const requirePattern = /require\((['"])([^'"\\]+)\1\)/g;
const urlPattern = /https?:\/\/[^'"`\s)]+/g;
const ipcPattern = /(?:ipcMain|ipcRenderer|webContents)\s*\.\s*(?:on|once|handle|invoke|send)\s*\(\s*(['"])([^'"]+)\1/g;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const requires = new Set();
  const urls = new Set();
  const ipc = new Set();

  for (const match of source.matchAll(requirePattern)) requires.add(match[2]);
  for (const match of source.matchAll(urlPattern)) urls.add(match[0]);
  for (const match of source.matchAll(ipcPattern)) ipc.add(match[2]);

  console.log(`\n# ${path.relative(root, file)}`);
  console.log(`bytes: ${Buffer.byteLength(source)}`);
  console.log('\n## require() modules');
  [...requires].sort().forEach((value) => console.log(value));
  console.log('\n## literal IPC channels');
  [...ipc].sort().forEach((value) => console.log(value));
  console.log('\n## literal URLs');
  [...urls].sort().slice(0, 100).forEach((value) => console.log(value));
}

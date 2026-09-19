'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'reconstruction-analysis');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function listFiles(dir, ext = '.js') {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(ext))
    .map((e) => path.join(dir, e.name).replace(/\\/g, '/'))
    .sort();
}

function clip(text, offset, radius = 450) {
  const start = Math.max(0, offset - radius);
  const end = Math.min(text.length, offset + radius);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function uniq(items) {
  return [...new Set(items)];
}

function extractUrls(text) {
  return uniq((text.match(/https?:\\?\/\\?\/[^"'\s)]+/g) || [])
    .map((s) => s.replace(/\\\//g, '/'))
    .slice(0, 500);
}

function extractRequires(text) {
  const out = [];
  const re = /require\((['"])([^'"]+)\1\)/g;
  for (const match of text.matchAll(re)) out.push(match[2]);
  return uniq(out).sort();
}

function extractRouteLikeStrings(text) {
  const out = [];
  const re = /(['"])(\/[A-Za-z0-9_?&=/:.{}-]{1,120})\1/g;
  for (const match of text.matchAll(re)) {
    const value = match[2];
    if (!value.startsWith('//') && !value.includes('node_modules')) out.push(value);
  }
  return uniq(out).sort().slice(0, 2000);
}

function findTokenContexts(file, text, tokens) {
  const entries = [];
  for (const token of tokens) {
    let from = 0;
    let count = 0;
    while (count < 20) {
      const offset = text.indexOf(token, from);
      if (offset < 0) break;
      entries.push({
        token,
        offset,
        context: clip(text, offset),
      });
      from = offset + token.length;
      count += 1;
    }
  }
  return entries;
}

const ipc = require('../src/shared/ipc-channels');
const ipcTokens = Object.values(ipc);

const mainFiles = listFiles('dist-electron');
const rendererFiles = listFiles('dist/assets');

const main = [];
for (const file of mainFiles) {
  const text = read(file);
  main.push({
    file,
    bytes: Buffer.byteLength(text),
    requires: extractRequires(text),
    urls: extractUrls(text),
    routeLikeStrings: extractRouteLikeStrings(text),
    electronMarkers: {
      BrowserWindow: (text.match(/BrowserWindow/g) || []).length,
      ipcMain: (text.match(/ipcMain/g) || []).length,
      webContents: (text.match(/webContents/g) || []).length,
      session: (text.match(/session/g) || []).length,
      protocol: (text.match(/protocol/g) || []).length,
      app: (text.match(/\bapp\b/g) || []).length,
    },
    ipcContexts: findTokenContexts(file, text, ipcTokens),
  });
}

const rendererSummary = [];
for (const file of rendererFiles) {
  const text = read(file);
  const interesting =
    /index-|router|store|login|account|browser|proxy|env|profile|rpa|kernel|setting|security/i.test(file);
  if (!interesting && text.length < 120000) continue;

  rendererSummary.push({
    file,
    bytes: Buffer.byteLength(text),
    urls: extractUrls(text),
    routeLikeStrings: extractRouteLikeStrings(text),
    markers: {
      createRouter: (text.match(/createRouter/g) || []).length,
      routerPush: (text.match(/\.push\(/g) || []).length,
      pinia: (text.match(/pinia/gi) || []).length,
      vuex: (text.match(/vuex/gi) || []).length,
      ipcRenderer: (text.match(/ipcRenderer/g) || []).length,
      DIC: (text.match(/\bDIC\b/g) || []).length,
    },
    ipcContexts: findTokenContexts(file, text, ipcTokens),
  });
}

const primaryMain =
  main.find((x) => /main-[A-Za-z0-9_-]+\.js$/.test(x.file)) ||
  main.sort((a, b) => b.bytes - a.bytes)[0];

const primaryRenderer =
  rendererSummary.find((x) => /dist\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(x.file)) ||
  rendererSummary.sort((a, b) => b.bytes - a.bytes)[0];

fs.mkdirSync(OUT_DIR, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  note: 'Static recovery report derived from compiled bundles. It is evidence for reconstruction, not proof of original source names.',
  mainFiles: main,
  rendererFiles: rendererSummary,
  primaryMain,
  primaryRenderer,
};

fs.writeFileSync(
  path.join(OUT_DIR, 'bundle-analysis.json'),
  JSON.stringify(report, null, 2) + '\n',
);

const ipcMap = {};
for (const channel of ipcTokens) {
  ipcMap[channel] = [];
  for (const file of [...main, ...rendererSummary]) {
    for (const hit of file.ipcContexts || []) {
      if (hit.token === channel) {
        ipcMap[channel].push({
          file: file.file,
          offset: hit.offset,
          context: hit.context,
        });
      }
    }
  }
}

fs.writeFileSync(
  path.join(OUT_DIR, 'ipc-map.json'),
  JSON.stringify(ipcMap, null, 2) + '\n',
);

const routeSet = uniq([
  ...(primaryMain?.routeLikeStrings || []),
  ...(primaryRenderer?.routeLikeStrings || []),
]).sort();

fs.writeFileSync(
  path.join(OUT_DIR, 'route-candidates.json'),
  JSON.stringify(routeSet, null, 2) + '\n',
);

const summary = [
  '# Automated recovery analysis',
  '',
  'Generated from the compiled application bundles.',
  '',
  `- Main-process JS files scanned: ${main.length}`,
  `- Renderer JS files summarized: ${rendererSummary.length}`,
  `- IPC channels mapped: ${Object.keys(ipcMap).length}`,
  `- Candidate route/path strings: ${routeSet.length}`,
  `- Primary main bundle: ${primaryMain?.file || 'not found'}`,
  `- Primary renderer bundle: ${primaryRenderer?.file || 'not found'}`,
  '',
  '## Next reconstruction step',
  '',
  'Use ipc-map.json to extract each ipcMain handler into a named module under src/main/services/.',
  'Use route-candidates.json and recovered-component-index.json to rebuild Vue router/views without deleting the legacy dist/ tree.',
  '',
].join('\n');

fs.writeFileSync(path.join(OUT_DIR, 'README.md'), summary);

console.log(summary);\nconsole.log('Analysis schema version: 1');

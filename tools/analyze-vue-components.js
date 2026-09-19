'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'dist', 'assets');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'vue-component-manifest.json');

const files = fs.readdirSync(ASSETS)
  .filter((name) => name.endsWith('.js'))
  .sort();

function uniq(values) {
  return [...new Set(values)];
}

function extractImports(text) {
  const result = [];
  const re = /from\s*["']\.\/([^"']+\.js)["']/g;
  for (const match of text.matchAll(re)) result.push(match[1]);
  const sideEffect = /import\s*["']\.\/([^"']+\.js)["']/g;
  for (const match of text.matchAll(sideEffect)) result.push(match[1]);
  return uniq(result).sort();
}

function extractComponentNames(text) {
  return uniq(
    [...text.matchAll(/__name\s*:\s*["']([^"']+)["']/g)].map((m) => m[1]),
  ).sort();
}

function extractEmits(text) {
  const result = [];
  const re = /emits\s*:\s*\[([^\]]{0,1000})\]/g;
  for (const match of text.matchAll(re)) {
    for (const item of match[1].matchAll(/["']([^"']+)["']/g)) {
      result.push(item[1]);
    }
  }
  return uniq(result).sort();
}

function extractTranslationKeys(text) {
  const keys = [];
  const patterns = [
    /\$t\(\s*["']([^"']+)["']/g,
    /\.t\(\s*["']([^"']+)["']/g,
  ];
  for (const re of patterns) {
    for (const match of text.matchAll(re)) keys.push(match[1]);
  }
  return uniq(keys).sort().slice(0, 1000);
}

function extractIpcChannels(text) {
  const result = [];
  const re = /ipcRenderer\.(?:invoke|send|sendSync|on|once)\(\s*["']([^"']+)["']/g;
  for (const match of text.matchAll(re)) result.push(match[1]);
  return uniq(result).sort();
}

function extractRouteStrings(text) {
  const result = [];
  const re = /["'](\/[A-Za-z0-9_?&=/:.{}-]{1,120})["']/g;
  for (const match of text.matchAll(re)) {
    if (!match[1].startsWith('//')) result.push(match[1]);
  }
  return uniq(result).sort().slice(0, 500);
}

function snippetAround(text, token, radius = 700) {
  const index = text.indexOf(token);
  if (index < 0) return null;
  return text.slice(Math.max(0, index - radius), Math.min(text.length, index + radius));
}

const components = [];
for (const file of files) {
  const fullPath = path.join(ASSETS, file);
  const text = fs.readFileSync(fullPath, 'utf8');
  const names = extractComponentNames(text);

  if (!names.length && !file.includes('.vue_vue_type_')) continue;

  components.push({
    file,
    bytes: Buffer.byteLength(text),
    names,
    imports: extractImports(text),
    emits: extractEmits(text),
    translationKeys: extractTranslationKeys(text),
    ipcChannels: extractIpcChannels(text),
    routeStrings: extractRouteStrings(text),
    hasProps: /\bprops\s*:/.test(text),
    hasSetup: /\bsetup\s*\(/.test(text),
    vueCompiledFilename: file.includes('.vue_vue_type_'),
    propsContext: snippetAround(text, 'props:'),
    setupContext: snippetAround(text, 'setup('),
  });
}

const nameIndex = {};
for (const component of components) {
  for (const name of component.names) {
    nameIndex[name] ||= [];
    nameIndex[name].push(component.file);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  scannedJsFiles: files.length,
  componentChunks: components.length,
  uniqueNamedComponents: Object.keys(nameIndex).length,
  namedComponents: Object.keys(nameIndex).sort(),
  components: components.sort((a,b) => b.bytes - a.bytes || a.file.localeCompare(b.file)),
  nameIndex,
  note: 'Manifest derived from compiled Vue output. It preserves observable names and metadata but is not the original SFC source tree.',
};

fs.writeFileSync(OUT, JSON.stringify(summary, null, 2) + '\n');

console.log('Vue JS files scanned: ' + files.length);
console.log('Component chunks: ' + components.length);
console.log('Unique named components: ' + Object.keys(nameIndex).length);

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'reconstruction-work', 'main.stage1.pretty.js');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'pretty-symbol-lines.json');

const text = fs.readFileSync(INPUT, 'utf8');
const lines = text.split(/\r?\n/);

const needles = [
  'electron-store',
  'new Oh',
  'Oh =',
  'Oh=',
  'Rv =',
  'Rv=',
  'kv =',
  'kv=',
  '_0x3533fc',
  '_0x35bd54',
  'hp =',
  'hp=',
  'Ni =',
  'Ni=',
  'const B =',
  'const B=',
  'const Dt =',
  'const Dt=',
];

const matches = {};
for (const needle of needles) {
  matches[needle] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const column = lines[i].indexOf(needle);
    if (column < 0) continue;
    matches[needle].push({
      line: i + 1,
      column: column + 1,
      text: lines[i].slice(Math.max(0, column - 200), column + needle.length + 400),
    });
    if (matches[needle].length >= 20) break;
  }
}

fs.writeFileSync(OUT, JSON.stringify({
  generatedAt: new Date().toISOString(),
  lineCount: lines.length,
  matches,
}, null, 2) + '\n');

console.log('Pretty bundle lines: ' + lines.length);
for (const [needle, entries] of Object.entries(matches)) {
  console.log(needle + ': ' + entries.length);
}

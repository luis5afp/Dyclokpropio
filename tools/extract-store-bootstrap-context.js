'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'reconstruction-work', 'main.stage1.pretty.js');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'store-bootstrap.pretty.txt');

const lines = fs.readFileSync(INPUT, 'utf8').split(/\r?\n/);
const start = 430;
const end = 730;

const selected = [];
for (let line = start; line <= end; line += 1) {
  selected.push(String(line).padStart(6, ' ') + ' | ' + (lines[line - 1] || ''));
}

fs.writeFileSync(OUT, selected.join('\n') + '\n');
console.log('Store bootstrap context written: lines ' + start + '-' + end);

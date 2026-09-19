'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PRETTY = path.join(ROOT, 'reconstruction-work', 'main.stage1.pretty.js');
const SOURCE = path.join(ROOT, 'reconstruction-work', 'main.stage1.js');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'electron-store-schema-recovery.json');

const pretty = fs.readFileSync(PRETTY, 'utf8');
const source = fs.readFileSync(SOURCE, 'utf8');

function evaluateKeyExpression(expr) {
  try {
    const value = vm.runInNewContext(expr, Object.create(null), { timeout: 50 });
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
}

function extractSchemaAssignments(objectName) {
  const out = [];
  const escaped = objectName.replace(/\$/g, '\\$');
  const re = new RegExp(
    escaped + '\\s*\\[([^\\]]{1,300})\\]\\s*=\\s*([A-Za-z_$][A-Za-z0-9_$]*)',
    'g',
  );

  for (const match of pretty.matchAll(re)) {
    const key = evaluateKeyExpression(match[1].trim());
    if (!key) continue;
    out.push({
      key,
      keyExpression: match[1].trim(),
      descriptorSymbol: match[2],
      prettyOffset: match.index || 0,
    });
  }

  return out;
}

function isIdentChar(ch) {
  return !!ch && /[A-Za-z0-9_$]/.test(ch);
}

function scanExpression(start) {
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n' || ch === '\r') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '(') paren += 1;
    else if (ch === ')') paren = Math.max(0, paren - 1);
    else if (ch === '{') brace += 1;
    else if (ch === '}') brace = Math.max(0, brace - 1);
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket = Math.max(0, bracket - 1);
    else if ((ch === ',' || ch === ';') && paren === 0 && brace === 0 && bracket === 0) {
      return i;
    }
  }
  return source.length;
}

function findAssignment(symbol) {
  let from = 0;
  const candidates = [];

  while (from < source.length && candidates.length < 10) {
    const idx = source.indexOf(symbol, from);
    if (idx < 0) break;
    from = idx + symbol.length;

    if (isIdentChar(source[idx - 1]) || isIdentChar(source[idx + symbol.length])) continue;

    let p = idx + symbol.length;
    while (/\s/.test(source[p] || '')) p += 1;
    if (source[p] !== '=') continue;
    if (source[p + 1] === '=' || source[p - 1] === '=' || source[p + 1] === '>') continue;

    const exprStart = p + 1;
    const exprEnd = scanExpression(exprStart);
    const expression = source.slice(exprStart, exprEnd).trim();
    if (!expression || expression.length > 100000) continue;

    const prefix = source.slice(Math.max(0, idx - 20), idx);
    const likelyDeclaration = /(?:const|let|var)\s*$/.test(prefix) || /,\s*$/.test(prefix);

    candidates.push({
      offset: idx,
      likelyDeclaration,
      expression,
      bytes: Buffer.byteLength(expression),
    });
  }

  return candidates.sort(
    (a, b) => Number(b.likelyDeclaration) - Number(a.likelyDeclaration) || a.offset - b.offset,
  )[0] || null;
}

const app = extractSchemaAssignments('_0x3533fc');
const tracker = extractSchemaAssignments('_0x35bd54');

for (const entry of [...app, ...tracker]) {
  entry.definition = findAssignment(entry.descriptorSymbol);
}

const report = {
  generatedAt: new Date().toISOString(),
  app: {
    name: 'app',
    encryptionKey: 'd81aaab2094eef341d5f987fe0f89da0c25f611acce75e8171da1216a1ec70a1',
    defaults: {},
    fields: app,
  },
  tracker: {
    name: 'tracker',
    encryptionKey: '03c15ab2b80588706644f91cf2fab6c20e42eb4db2b0d1a00665d1f5353fa83a',
    defaults: {},
    fields: tracker,
  },
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');

console.log('App schema fields recovered: ' + app.length);
console.log('Tracker schema fields recovered: ' + tracker.length);

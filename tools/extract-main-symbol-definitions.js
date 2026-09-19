'use strict';

const fsNode = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'reconstruction-work', 'main.stage1.js');
const SEEDS_PATH = path.join(ROOT, 'tools', 'reconstruction-symbol-seeds.json');
const OUT_PATH = path.join(ROOT, 'reconstruction-analysis', 'symbol-definitions.json');

const source = fsNode.readFileSync(SOURCE_PATH, 'utf8');
const seeds = JSON.parse(fsNode.readFileSync(SEEDS_PATH, 'utf8')).symbols || [];

function isIdentChar(ch) {
  return !!ch && /[A-Za-z0-9_$]/.test(ch);
}

function scanBalanced(start, openChar, closeChar) {
  let depth = 0;
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

    if (ch === openChar) depth += 1;
    else if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
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

function extractIdentifiers(text) {
  const keywords = new Set([
    'const','let','var','function','return','if','else','try','catch','throw',
    'new','typeof','instanceof','await','async','true','false','null','undefined',
    'this','void','delete','in','of','switch','case','break','continue','for',
    'while','do','class','extends','static','get','set','yield','import','export',
  ]);
  const ids = new Set();
  for (const match of text.matchAll(/\b[A-Za-z_$][A-Za-z0-9_$]*\b/g)) {
    const id = match[0];
    if (!keywords.has(id) && !/^[A-Z_]+$/.test(id)) ids.add(id);
  }
  return [...ids].slice(0, 300);
}

function findFunctionDeclarations(name) {
  const out = [];
  const re = new RegExp('\\bfunction\\s+' + name.replace(/\$/g, '\\$') + '\\s*\\(', 'g');
  for (const match of source.matchAll(re)) {
    const braceStart = source.indexOf('{', match.index);
    if (braceStart < 0) continue;
    const end = scanBalanced(braceStart, '{', '}');
    if (end < 0) continue;
    const code = source.slice(match.index, end + 1);
    out.push({
      kind:'function-declaration',
      offset:match.index,
      bytes:Buffer.byteLength(code),
      code,
      dependencies:extractIdentifiers(code).filter((id)=>id!==name),
    });
    if (out.length >= 5) break;
  }
  return out;
}

function findAssignments(name) {
  const out = [];
  let from = 0;

  while (from < source.length && out.length < 12) {
    const idx = source.indexOf(name, from);
    if (idx < 0) break;
    from = idx + name.length;

    if (isIdentChar(source[idx - 1]) || isIdentChar(source[idx + name.length])) continue;

    let p = idx + name.length;
    while (/\s/.test(source[p] || '')) p += 1;
    if (source[p] !== '=') continue;
    if (source[p + 1] === '=' || source[p - 1] === '=' || source[p + 1] === '>') continue;

    const exprStart = p + 1;
    const exprEnd = scanExpression(exprStart);
    const expression = source.slice(exprStart, exprEnd).trim();
    if (!expression || expression.length > 250000) continue;

    const prefix = source.slice(Math.max(0, idx - 20), idx);
    const likelyDeclaration = /(?:const|let|var)\s*$/.test(prefix) || /,\s*$/.test(prefix);

    out.push({
      kind:'assignment',
      offset:idx,
      likelyDeclaration,
      bytes:Buffer.byteLength(expression),
      expression,
      dependencies:extractIdentifiers(expression).filter((id)=>id!==name),
    });
  }

  return out;
}

const result = {};
for (const symbol of seeds) {
  result[symbol] = {
    functions: findFunctionDeclarations(symbol),
    assignments: findAssignments(symbol),
  };
}

const compact = {};
for (const [symbol, value] of Object.entries(result)) {
  const candidates = [...value.functions, ...value.assignments]
    .sort((a,b)=>Number(b.likelyDeclaration||b.kind==='function-declaration')-Number(a.likelyDeclaration||a.kind==='function-declaration') || a.offset-b.offset)
    .slice(0,5);
  compact[symbol] = candidates;
}

fsNode.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fsNode.writeFileSync(OUT_PATH, JSON.stringify({
  generatedAt:new Date().toISOString(),
  source:'reconstruction-work/main.stage1.js',
  symbols:compact,
}, null, 2) + '\n');

console.log('Symbol definitions analyzed: ' + seeds.length);
for (const symbol of seeds) {
  console.log(symbol + ': ' + (compact[symbol] || []).length + ' candidate(s)');
}

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'reconstruction-work', 'main.stage1.js');
const INDEX_PATH = path.join(ROOT, 'reconstruction-analysis', 'main-ipc-handlers.json');
const OUT_DIR = path.join(ROOT, 'reconstruction-analysis', 'ipc-handler-bodies');

if (!fs.existsSync(SOURCE_PATH)) {
  throw new Error('Missing reconstruction-work/main.stage1.js');
}
if (!fs.existsSync(INDEX_PATH)) {
  throw new Error('Missing reconstruction-analysis/main-ipc-handlers.json');
}

const source = fs.readFileSync(SOURCE_PATH, 'utf8');
const report = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));

function safeName(channel) {
  return channel.replace(/[^A-Za-z0-9_.-]+/g, '_');
}

function findOpenParen(offset) {
  const max = Math.min(source.length, offset + 500);
  for (let i = offset; i < max; i += 1) {
    if (source[i] === '(') return i;
  }
  return -1;
}

function scanCallArguments(openParen) {
  const args = [];
  let start = openParen + 1;
  let paren = 1;
  let brace = 0;
  let bracket = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = openParen + 1; i < source.length; i += 1) {
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
      if (ch === quote) {
        quote = null;
      }
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
    else if (ch === ')') {
      paren -= 1;
      if (paren === 0) {
        args.push(source.slice(start, i).trim());
        return { args, closeParen: i };
      }
    } else if (ch === '{') brace += 1;
    else if (ch === '}') brace = Math.max(0, brace - 1);
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket = Math.max(0, bracket - 1);
    else if (
      ch === ',' &&
      paren === 1 &&
      brace === 0 &&
      bracket === 0
    ) {
      args.push(source.slice(start, i).trim());
      start = i + 1;
    }
  }

  return null;
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const index = [];
let successes = 0;
let failures = 0;

for (const [channel, entries] of Object.entries(report.channels || {})) {
  for (let ordinal = 0; ordinal < entries.length; ordinal += 1) {
    const entry = entries[ordinal];
    const openParen = findOpenParen(entry.offset);
    const parsed = openParen >= 0 ? scanCallArguments(openParen) : null;
    const handler = parsed && parsed.args.length >= 2 ? parsed.args[1] : null;
    const filename =
      safeName(channel) +
      (entries.length > 1 ? '.' + (ordinal + 1) : '') +
      '.js.txt';
    const relative = 'reconstruction-analysis/ipc-handler-bodies/' + filename;
    const target = path.join(OUT_DIR, filename);

    if (handler) {
      const header = [
        '/*',
        ' * Recovered IPC handler expression.',
        ' * Channel: ' + channel,
        ' * Method: ' + entry.method,
        ' * Source offset: ' + entry.offset,
        ' * This is analysis material, not yet a standalone runnable module.',
        ' */',
        '',
      ].join('\n');

      fs.writeFileSync(target, header + handler + '\n');
      successes += 1;
      index.push({
        channel,
        method: entry.method,
        offset: entry.offset,
        channelExpression: entry.channelExpression,
        handlerBytes: Buffer.byteLength(handler),
        file: relative,
        extracted: true,
      });
    } else {
      failures += 1;
      index.push({
        channel,
        method: entry.method,
        offset: entry.offset,
        channelExpression: entry.channelExpression,
        file: relative,
        extracted: false,
      });
    }
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  source: 'reconstruction-work/main.stage1.js',
  uniqueChannels: Object.keys(report.channels || {}).length,
  registrations: index.length,
  extracted: successes,
  failed: failures,
  handlers: index.sort((a, b) =>
    a.channel.localeCompare(b.channel) || a.offset - b.offset,
  ),
};

fs.writeFileSync(
  path.join(OUT_DIR, 'index.json'),
  JSON.stringify(summary, null, 2) + '\n',
);

console.log('IPC handler bodies extracted: ' + successes);
console.log('IPC handler body extraction failures: ' + failures);

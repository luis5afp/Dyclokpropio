'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'dist-electron', 'main-CuCOh59n.js');
const ANALYSIS_DIR = path.join(ROOT, 'reconstruction-analysis');
const WORK_DIR = path.join(ROOT, 'reconstruction-work');
const REPORT = path.join(ANALYSIS_DIR, 'main-deobfuscation-report.json');
const OUTPUT = path.join(WORK_DIR, 'main.stage1.js');

const source = fs.readFileSync(INPUT, 'utf8');

function makeUniversalProxy() {
  let proxy;
  const target = function () { return proxy; };
  proxy = new Proxy(target, {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive) return () => 0;
      if (prop === 'then') return undefined;
      if (prop === 'toJSON') return () => null;
      if (prop === 'toString') return () => '';
      if (prop === 'valueOf') return () => 0;
      return proxy;
    },
    set() { return true; },
    apply() { return proxy; },
    construct() { return proxy; },
    has() { return true; },
    ownKeys() { return []; },
    getOwnPropertyDescriptor() {
      return { configurable: true, enumerable: true, writable: true, value: proxy };
    },
  });
  return proxy;
}

const dummy = makeUniversalProxy();

const sandbox = {
  module: { exports: {} },
  exports: {},
  require(name) {
    if (['path', 'crypto', 'os', 'util', 'url', 'events'].includes(name)) {
      try { return require(name); } catch {}
    }
    return dummy;
  },
  process: {
    env: {},
    platform: 'win32',
    arch: 'x64',
    versions: {},
    cwd: () => ROOT,
    nextTick: (fn) => typeof fn === 'function' && fn(),
    on() {},
    once() {},
    removeListener() {},
  },
  console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
  Buffer,
  TextEncoder,
  TextDecoder,
  URL,
  URLSearchParams,
  setTimeout() { return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  queueMicrotask(fn) { if (typeof fn === 'function') fn(); },
  global: null,
  globalThis: null,
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;

let evaluationError = null;
try {
  vm.runInNewContext(source, sandbox, {
    filename: INPUT,
    timeout: 5000,
  });
} catch (error) {
  evaluationError = String(error && error.stack ? error.stack : error);
}

const counts = new Map();
for (const match of source.matchAll(/\b(_0x[a-fA-F0-9]+)\s*\(/g)) {
  counts.set(match[1], (counts.get(match[1]) || 0) + 1);
}

const declared = new Set(
  [...source.matchAll(/function\s+(_0x[a-fA-F0-9]+)\s*\(/g)].map((m) => m[1]),
);

const candidates = [...counts.entries()]
  .filter(([name]) => declared.has(name))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .map(([name, count]) => ({
    name,
    count,
    available: typeof sandbox[name] === 'function',
  }));

function parseSimpleArgs(text) {
  if (!/^[\s0-9a-fA-FxX,'"-]+$/.test(text)) return null;
  try {
    return vm.runInNewContext('[' + text + ']', Object.create(null), { timeout: 50 });
  } catch {
    return null;
  }
}

function sampleCalls(name, limit = 80) {
  const re = new RegExp('\\b' + name + '\\(([^()]{1,120})\\)', 'g');
  const out = [];
  for (const match of source.matchAll(re)) {
    const args = parseSimpleArgs(match[1]);
    if (!args) continue;
    out.push({ call: match[0], args });
    if (out.length >= limit) break;
  }
  return out;
}

const decoderCandidates = [];
for (const candidate of candidates) {
  if (!candidate.available) continue;
  const samples = sampleCalls(candidate.name);
  let stringResults = 0;
  const examples = [];
  for (const sample of samples) {
    try {
      const value = sandbox[candidate.name](...sample.args);
      if (typeof value === 'string') {
        stringResults += 1;
        if (examples.length < 12) examples.push({ call: sample.call, value });
      }
    } catch {}
  }
  const ratio = samples.length ? stringResults / samples.length : 0;
  candidate.samples = samples.length;
  candidate.stringResults = stringResults;
  candidate.stringRatio = ratio;
  candidate.examples = examples;
  if (samples.length >= 3 && ratio >= 0.8) decoderCandidates.push(candidate.name);
}

let transformed = source;
let replacements = 0;

for (const name of decoderCandidates) {
  const re = new RegExp('\\b' + name + '\\(([^()]{1,120})\\)', 'g');

  transformed = transformed.replace(re, (full, argsText) => {
    const args = parseSimpleArgs(argsText);
    if (!args) return full;
    try {
      const value = sandbox[name](...args);
      if (typeof value !== 'string') return full;
      replacements += 1;
      return JSON.stringify(value);
    } catch {
      return full;
    }
  });
}

fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
fs.mkdirSync(WORK_DIR, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  evaluationError,
  candidates,
  decoderCandidates,
  replacements,
  inputBytes: Buffer.byteLength(source),
  outputBytes: Buffer.byteLength(transformed),
  note: 'Stage 1 replaces only decoder calls with simple literal arguments when runtime evaluation returns a string. The recovered original is never modified.',
};

fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');

if (replacements > 0) {
  fs.writeFileSync(OUTPUT, transformed);
}

console.log('Decoder candidates: ' + (decoderCandidates.join(', ') || 'none'));
console.log('Stage-1 replacements: ' + replacements);

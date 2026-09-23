'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'preload-parity.json');

function loadPreload(relativePath) {
  const filename = path.join(ROOT, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const calls = [];
  const exposed = {};

  const ipcRenderer = new Proxy({}, {
    get(_target, property) {
      if (property === 'then') return undefined;
      return (...args) => {
        calls.push([String(property), ...args]);
        if (property === 'invoke') {
          return Promise.resolve({ kind: 'invoke-result', channel: args[0] });
        }
        if (property === 'sendSync') {
          return { kind: 'sync-result', channel: args[0] };
        }
        return undefined;
      };
    },
  });

  const electron = {
    ipcRenderer,
    contextBridge: {
      exposeInMainWorld(name, value) {
        exposed[name] = value;
      },
    },
  };

  const osMock = {
    platform: () => 'win32',
    release: () => 'mock-release',
  };

  const processMock = {
    contextIsolated: true,
    contextIsolation: true,
    env: {},
    platform: 'win32',
    getSystemVersion: () => 'mock-system-version',
  };

  const sandbox = {
    module: { exports: {} },
    exports: {},
    require(request) {
      if (request === 'electron') return electron;
      if (request === 'os') return osMock;

      if (request.startsWith('.')) {
        const absolute = path.resolve(path.dirname(filename), request);
        return require(absolute);
      }

      return require(request);
    },
    __filename: filename,
    __dirname: path.dirname(filename),
    window: {},
    process: processMock,
    console: {
      log() {},
      error() {},
      warn() {},
    },
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
  };

  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(source, sandbox, {
    filename,
    timeout: 10000,
  });

  return { exposed, calls, sandbox };
}

function describe(value) {
  if (typeof value === 'function') return '<function>';
  if (!value || typeof value !== 'object') return typeof value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = describe(value[key]);
  }
  return out;
}

function flattenFunctions(value, prefix = '') {
  const out = [];
  if (!value || typeof value !== 'object') return out;

  for (const key of Object.keys(value)) {
    const child = value[key];
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'function') {
      out.push(next);
    } else if (child && typeof child === 'object') {
      out.push(...flattenFunctions(child, next));
    }
  }
  return out.sort();
}

function getPath(root, dotted) {
  return dotted.split('.').reduce((value, part) => value && value[part], root);
}

function normalize(value) {
  if (value === undefined) return '<undefined>';
  if (value === null) return null;
  if (typeof value === 'function') return '<function>';
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(normalize);

  const out = {};
  for (const key of Object.keys(value).sort()) out[key] = normalize(value[key]);
  return out;
}

async function exercise(relativePath, apiPath) {
  const loaded = loadPreload(relativePath);
  const root = loaded.exposed.DIC?.api;
  const fn = getPath(root, apiPath);

  if (typeof fn !== 'function') {
    return { error: 'missing-function' };
  }

  const args = [
    { sample: 'arg1' },
    { sample: 'arg2' },
    { sample: 'arg3' },
  ];

  let result;
  let error = null;

  try {
    result = await fn(...args);
  } catch (err) {
    error = String(err && err.message ? err.message : err);
  }

  return {
    calls: normalize(loaded.calls),
    result: normalize(result),
    error,
    env: normalize(loaded.sandbox.process.env),
  };
}

(async () => {
  const legacy = loadPreload('dist-electron/preload/index.js');
  const reconstructed = loadPreload('src/preload/index.js');

  const legacyShape = describe(legacy.exposed);
  const reconstructedShape = describe(reconstructed.exposed);

  const legacyFunctions = flattenFunctions(legacy.exposed.DIC?.api || {});
  const reconstructedFunctions = flattenFunctions(reconstructed.exposed.DIC?.api || {});
  const allFunctions = [...new Set([...legacyFunctions, ...reconstructedFunctions])].sort();

  const behavior = {};
  for (const apiPath of allFunctions) {
    behavior[apiPath] = {
      legacy: await exercise('dist-electron/preload/index.js', apiPath),
      reconstructed: await exercise('src/preload/index.js', apiPath),
    };
    behavior[apiPath].equal =
      JSON.stringify(behavior[apiPath].legacy) ===
      JSON.stringify(behavior[apiPath].reconstructed);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    legacyShape,
    reconstructedShape,
    shapeEqual: JSON.stringify(legacyShape) === JSON.stringify(reconstructedShape),
    legacyFunctions,
    reconstructedFunctions,
    missingInReconstruction: legacyFunctions.filter((x) => !reconstructedFunctions.includes(x)),
    extraInReconstruction: reconstructedFunctions.filter((x) => !legacyFunctions.includes(x)),
    behavior,
    behaviorMismatches: Object.entries(behavior)
      .filter(([, value]) => !value.equal)
      .map(([key]) => key),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');

  console.log(`Preload shape equal: ${report.shapeEqual}`);
  console.log(`Preload behavior mismatches: ${report.behaviorMismatches.length}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

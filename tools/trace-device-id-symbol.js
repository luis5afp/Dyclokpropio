'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'dist-electron', 'main-CuCOh59n.js');
const SYMBOLS_PATH = path.join(ROOT, 'reconstruction-analysis', 'symbol-definitions.json');
const OUT_PATH = path.join(ROOT, 'reconstruction-analysis', 'device-id-trace.json');

const source = fs.readFileSync(SOURCE_PATH, 'utf8');
const symbols = JSON.parse(fs.readFileSync(SYMBOLS_PATH, 'utf8'));

function makeUniversalProxy() {
  let proxy;
  const target = function () { return proxy; };
  proxy = new Proxy(target, {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'then') return undefined;
      if (prop === 'toString') return () => '';
      if (prop === 'valueOf') return () => 0;
      return proxy;
    },
    set() { return true; },
    apply() { return proxy; },
    construct() { return proxy; },
  });
  return proxy;
}

const dummy = makeUniversalProxy();
const sandbox = {
  module: { exports: {} },
  exports: {},
  require(name) {
    if (name === 'path') return require('path');
    if (name === 'crypto') return require('crypto');
    if (name === 'os') return require('os');
    if (name === 'util') return require('util');
    if (name === 'url') return require('url');
    if (name === 'events') return require('events');
    return dummy;
  },
  process: {
    env: {},
    platform: 'win32',
    arch: 'x64',
    versions: {},
    cwd: () => ROOT,
    nextTick: () => {},
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
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;

let sourceEvaluationError = null;
try {
  vm.runInNewContext(source, sandbox, {
    filename: SOURCE_PATH,
    timeout: 5000,
  });
} catch (error) {
  sourceEvaluationError = String(error && error.message ? error.message : error);
}

const trace = [];

function primitive(label) {
  return {
    [Symbol.toPrimitive]() {
      trace.push({ type: 'coerce', label });
      return '[' + label + ']';
    },
    toString() {
      return '[' + label + ']';
    },
  };
}

const osProxy = new Proxy({}, {
  get(_target, prop) {
    trace.push({ type: 'os-property', property: String(prop) });

    return (...args) => {
      trace.push({
        type: 'os-call',
        method: String(prop),
        args: args.map((value) => String(value)),
      });

      if (prop === 'hostname') return 'TRACE_HOSTNAME';
      if (prop === 'arch') return 'TRACE_ARCH';
      if (prop === 'platform') return 'TRACE_PLATFORM';
      if (prop === 'release') return 'TRACE_RELEASE';
      if (prop === 'type') return 'TRACE_TYPE';
      if (prop === 'userInfo') {
        return new Proxy({}, {
          get(_obj, child) {
            trace.push({ type: 'os-result-property', method: 'userInfo', property: String(child) });
            return 'TRACE_USERINFO_' + String(child);
          },
        });
      }
      if (prop === 'cpus') {
        const cpu = new Proxy({}, {
          get(_obj, child) {
            trace.push({ type: 'os-cpu-property', property: String(child) });
            return 'TRACE_CPU_' + String(child);
          },
        });
        return [cpu];
      }

      return primitive('os.' + String(prop));
    };
  },
});

function createHashProxy(algorithm) {
  let hashProxy;
  const target = {};
  hashProxy = new Proxy(target, {
    get(_target, prop) {
      trace.push({ type: 'hash-property', property: String(prop) });
      if (prop === Symbol.toPrimitive) return () => 'TRACE_HASH';

      return (...args) => {
        trace.push({
          type: 'hash-call',
          method: String(prop),
          args: args.map((value) => String(value)),
        });

        if (prop === 'digest') {
          return new Proxy({}, {
            get(_obj, child) {
              trace.push({ type: 'digest-property', property: String(child) });
              if (child === 'slice' || child === 'substring' || child === 'substr') {
                return (...sliceArgs) => {
                  trace.push({
                    type: 'digest-call',
                    method: String(child),
                    args: sliceArgs,
                  });
                  return 'TRACE_DEVICE_ID';
                };
              }
              return (...childArgs) => {
                trace.push({
                  type: 'digest-call',
                  method: String(child),
                  args: childArgs,
                });
                return 'TRACE_DEVICE_ID';
              };
            },
          });
        }

        return hashProxy;
      };
    },
  });
  trace.push({ type: 'hash-created', algorithm: String(algorithm) });
  return hashProxy;
}

const cryptoProxy = new Proxy({}, {
  get(_target, prop) {
    trace.push({ type: 'crypto-property', property: String(prop) });
    return (...args) => {
      trace.push({
        type: 'crypto-call',
        method: String(prop),
        args: args.map((value) => String(value)),
      });

      if (prop === 'createHash') return createHashProxy(args[0]);
      return dummy;
    };
  },
});

sandbox.Ve = osProxy;
sandbox.lt = cryptoProxy;

const hpCandidates = symbols.symbols?.hp || [];
const hpExpression = hpCandidates[0]?.expression;

let hpResult = null;
let hpEvaluationError = null;

if (hpExpression) {
  try {
    const fn = vm.runInNewContext('(' + hpExpression + ')', sandbox, {
      timeout: 1000,
    });
    hpResult = fn();
  } catch (error) {
    hpEvaluationError = String(error && error.stack ? error.stack : error);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  sourceEvaluationError,
  hpExpressionFound: Boolean(hpExpression),
  hpResult: hpResult == null ? null : String(hpResult),
  hpEvaluationError,
  trace,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2) + '\n');

console.log('hp expression found: ' + report.hpExpressionFound);
console.log('hp result: ' + report.hpResult);
console.log('hp trace events: ' + trace.length);
if (hpEvaluationError) {
  console.log('hp trace error: ' + hpEvaluationError.split('\n')[0]);
}

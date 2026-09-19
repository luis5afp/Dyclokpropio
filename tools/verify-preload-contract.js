'use strict';

const assert = require('assert');
const Module = require('module');

const calls = [];
const exposed = {};

const ipcRenderer = new Proxy({}, {
  get(_target, property) {
    if (property === 'then') return undefined;
    return (...args) => {
      calls.push([String(property), ...args]);
      if (property === 'invoke') return Promise.resolve('__RESULT__');
      if (property === 'sendSync') return '__SYNC_RESULT__';
      return undefined;
    };
  },
});

const contextBridge = {
  exposeInMainWorld(name, value) {
    exposed[name] = value;
  },
};

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'electron') return { contextBridge, ipcRenderer };
  return originalLoad.call(this, request, parent, isMain);
};

global.window = {};
const originalContextIsolated = process.contextIsolated;
Object.defineProperty(process, 'contextIsolated', {
  value: true,
  configurable: true,
});

async function record(fn, ...args) {
  calls.length = 0;
  await fn(...args);
  return calls.slice();
}

(async () => {
  try {
    require('../src/preload/index.js');

    assert.ok(exposed.DIC);
    assert.ok(exposed.DIC.api);
    assert.strictEqual(typeof exposed.openUrl, 'function');

    assert.deepStrictEqual(
      await record(exposed.DIC.api.getLocalServerStatus, 'x'),
      [['invoke', 'get-local-server-status', 'x']],
    );

    assert.deepStrictEqual(
      await record(exposed.DIC.api.envController.runEnv, 'env', 'opts'),
      [['send', 'run-env', 'env', 'opts']],
    );

    assert.deepStrictEqual(
      await record(exposed.DIC.api.store.set, 'key', 'value'),
      [['sendSync', 'electron-store-set', { key: 'key', value: 'value' }]],
    );

    assert.deepStrictEqual(
      await record(exposed.DIC.api.aes128DecryptMany, 'payload'),
      [['invoke', 'aes-128-decrypt-many', 'payload']],
    );

    console.log('Preload contract: OK');
  } finally {
    Module._load = originalLoad;
    Object.defineProperty(process, 'contextIsolated', {
      value: originalContextIsolated,
      configurable: true,
    });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

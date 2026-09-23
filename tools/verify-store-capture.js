'use strict';

const assert = require('assert');
const Module = require('module');
const {
  loadWithElectronStoreCapture,
} = require('../src/main/legacy/capture-electron-store');

class FakeStore {
  constructor(options = {}) {
    this.options = options;
  }
}

const result = loadWithElectronStoreCapture(
  () => {
    const Store = require('electron-store');
    class RecoveredQueuedStore extends Store {}

    const app = new RecoveredQueuedStore({ name: 'app' });
    const tracker = new RecoveredQueuedStore({ name: 'tracker' });

    return { app, tracker };
  },
  { StoreBase: FakeStore, moduleSystem: Module },
);

assert.strictEqual(result.stores.get('app'), result.legacy.app);
assert.strictEqual(result.stores.get('tracker'), result.legacy.tracker);
assert.strictEqual(result.stores.size, 2);

console.log('Legacy electron-store capture: OK');

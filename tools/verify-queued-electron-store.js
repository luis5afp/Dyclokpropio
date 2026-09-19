'use strict';

const assert = require('assert');
const {
  createQueuedElectronStoreClass,
} = require('../src/main/storage/queued-electron-store');

class FakeStoreBase {
  constructor() {
    this.persisted = { initial: true };
    this.persistCalls = [];
  }

  get store() { return this.persisted; }
  set store(value) {
    this.persisted = value;
    this.persistCalls.push(value);
  }
  get(key) { return this.store[key]; }
  set(key, value) {
    this.store = { ...this.store, [key]: value };
    return this;
  }
  delete(key) {
    const next = { ...this.store };
    delete next[key];
    this.store = next;
    return this;
  }
}

const QueuedStore = createQueuedElectronStoreClass(FakeStoreBase);

(async () => {
  const store = new QueuedStore();
  assert.deepStrictEqual(store.store, { initial: true });
  assert.deepStrictEqual(store.recoveredState, {});

  store.set('language', 'es');
  assert.strictEqual(store.get('language'), 'es');
  await store.persistPromise;
  assert.strictEqual(store.persisted.language, 'es');

  await store.setAndWait('theme', 'dark');
  assert.strictEqual(store.persisted.theme, 'dark');

  store.delete('theme');
  await store.persistPromise;
  assert.strictEqual(store.persisted.theme, undefined);

  console.log('Queued electron-store reconstruction: OK');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

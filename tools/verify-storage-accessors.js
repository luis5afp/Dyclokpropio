'use strict';

const assert = require('assert');
const {
  createStoreAccessors,
} = require('../src/main/ipc/handlers/storage');

function createFakeStore(initial) {
  const values = { ...initial };

  return {
    get store() {
      return { ...values };
    },
    get(key) {
      return values[key];
    },
    set(key, value) {
      values[key] = value;
      return this;
    },
    delete(key) {
      delete values[key];
      return this;
    },
  };
}

const app = createFakeStore({
  language: 'es',
  'nested.value': 7,
});
const tracker = createFakeStore({ enabled: true });
const storage = createStoreAccessors({ app, tracker });

assert.deepStrictEqual(storage.get('app'), {
  language: 'es',
  'nested.value': 7,
});
assert.strictEqual(storage.get('app.language'), 'es');

storage.set('app.theme', 'dark');
assert.strictEqual(storage.get('app.theme'), 'dark');

storage.delete('app.theme');
assert.strictEqual(storage.get('app.theme'), undefined);

assert.deepStrictEqual(storage.get('tracker'), { enabled: true });
assert.throws(() => storage.get('missing.key'), /Unknown store root/);

console.log('Storage accessor reconstruction: OK');

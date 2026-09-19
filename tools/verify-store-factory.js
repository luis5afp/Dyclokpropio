'use strict';

const assert = require('assert');
const { createRecoveredStores } = require('../src/main/storage/stores');
const { storeConfig } = require('../src/main/storage/schema');

class FakeStore {
  constructor(options) { this.options = options; }
}

const stores = createRecoveredStores(FakeStore);
assert.deepStrictEqual(stores.app.options, storeConfig.app);
assert.deepStrictEqual(stores.tracker.options, storeConfig.tracker);
assert.strictEqual(stores.app.options.name, 'app');
assert.strictEqual(stores.tracker.options.name, 'tracker');
assert.strictEqual(stores.app.options.clearInvalidConfig, true);
assert.strictEqual(stores.tracker.options.clearInvalidConfig, true);

console.log('Recovered store factory: OK');

'use strict';

const assert = require('assert');
const {
  appSchema,
  appDefaults,
  trackerSchema,
  trackerDefaults,
  storeConfig,
} = require('../src/main/storage/schema');

assert.strictEqual(Object.keys(appSchema).length, 32);
assert.strictEqual(Object.keys(trackerSchema).length, 6);

assert.strictEqual(appDefaults.inputDelay, 100);
assert.strictEqual(appDefaults.language, 'en');
assert.strictEqual(appDefaults.clearDay, -1);
assert.strictEqual(appDefaults.useSystemProxyForPersonal, true);
assert.strictEqual(appDefaults.useHardwareAcceleration, false);
assert.strictEqual(appDefaults.isIpLimitVpn, false);

assert.deepStrictEqual(appSchema.mainWindowLaunchPreference, {
  type: 'object',
  properties: {
    width: { type: 'number' },
    height: { type: 'number' },
  },
  required: ['width', 'height'],
  additionalProperties: false,
});

assert.deepStrictEqual(trackerDefaults, {
  isPaid: false,
  installDate: 0,
  dailyCount: 0,
  events: [],
  reliableEvents: [],
  lastResetDate: 0,
});

assert.strictEqual(storeConfig.app.clearInvalidConfig, true);
assert.strictEqual(storeConfig.tracker.clearInvalidConfig, true);
assert.strictEqual(storeConfig.app.encryptionKey.length, 64);
assert.strictEqual(storeConfig.tracker.encryptionKey.length, 64);

console.log('Recovered storage schema/defaults: OK');

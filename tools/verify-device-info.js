'use strict';

const assert = require('assert');
const os = require('os');
const { createDeviceInfo } = require('../src/main/device/device-info');

const info = createDeviceInfo(() => 'RECOVERED_DEVICE_ID');

assert.strictEqual(info.id, 'RECOVERED_DEVICE_ID');
assert.strictEqual(info.name, os.hostname());
assert.strictEqual(
  info.timeZone,
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);
assert.strictEqual(
  info.language,
  Intl.DateTimeFormat().resolvedOptions().locale,
);

assert.throws(() => createDeviceInfo(null), /getDeviceId must be a function/);

console.log('Device info reconstruction: OK');

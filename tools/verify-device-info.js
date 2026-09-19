'use strict';

const assert = require('assert');
const crypto = require('crypto');
const os = require('os');
const { getDeviceId } = require('../src/main/device/device-id');
const { createDeviceInfo } = require('../src/main/device/device-info');

const expectedDeviceId = crypto
  .createHash('sha256')
  .update(os.hostname() + os.arch() + os.userInfo().username)
  .digest('hex')
  .substring(0, 32);

assert.strictEqual(getDeviceId(), expectedDeviceId);

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

console.log('Device ID and device info reconstruction: OK');

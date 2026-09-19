'use strict';

const assert = require('assert');
const {
  MAIN_WINDOW_SIZE_LIMITS,
  normalizeMainWindowLaunchPreference,
} = require('../src/main/window/main-window-preference');

assert.deepStrictEqual(MAIN_WINDOW_SIZE_LIMITS, {
  minWidth: 500,
  maxWidth: 10000,
  minHeight: 500,
  maxHeight: 10000,
});

assert.deepStrictEqual(
  normalizeMainWindowLaunchPreference({ width: 1200, height: 800 }),
  { width: 1200, height: 800 },
);

assert.deepStrictEqual(
  normalizeMainWindowLaunchPreference({ width: 500, height: 10000 }),
  { width: 500, height: 10000 },
);

for (const value of [
  null,
  undefined,
  {},
  { width: '1200', height: 800 },
  { width: 1200, height: '800' },
  { width: NaN, height: 800 },
  { width: Infinity, height: 800 },
  { width: 499, height: 800 },
  { width: 10001, height: 800 },
  { width: 1200, height: 499 },
  { width: 1200, height: 10001 },
]) {
  assert.strictEqual(normalizeMainWindowLaunchPreference(value), null);
}

console.log('Main window preference normalization: OK');

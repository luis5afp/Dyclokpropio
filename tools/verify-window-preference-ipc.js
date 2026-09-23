'use strict';

const assert = require('assert');
const {
  registerWindowPreferenceHandlers,
  PREFERENCE_KEY,
} = require('../src/main/ipc/handlers/window-preference');

const values = new Map();
const appStore = {
  get(key) {
    return values.get(key);
  },
  set(key, value) {
    values.set(key, value);
    return this;
  },
  delete(key) {
    values.delete(key);
    return this;
  },
};

const handlers = new Map();
const ipcMain = {
  handle(channel, handler) {
    handlers.set(channel, handler);
  },
};

registerWindowPreferenceHandlers(ipcMain, appStore);

const getPreference = handlers.get('get-main-window-launch-preference');
const setPreference = handlers.get('set-main-window-launch-preference');

assert.strictEqual(getPreference(), null);
assert.deepStrictEqual(
  setPreference({}, { width: 1200, height: 800 }),
  { width: 1200, height: 800 },
);
assert.deepStrictEqual(values.get(PREFERENCE_KEY), {
  width: 1200,
  height: 800,
});
assert.deepStrictEqual(getPreference(), { width: 1200, height: 800 });

assert.throws(
  () => setPreference({}, { width: 400, height: 800 }),
  TypeError,
);

assert.strictEqual(setPreference({}, null), null);
assert.strictEqual(values.has(PREFERENCE_KEY), false);

console.log('Window preference IPC reconstruction: OK');

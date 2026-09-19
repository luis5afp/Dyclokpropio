'use strict';

const assert = require('assert');

const { loadWithMigratedIpc } = require('../src/main/ipc/migration-loader');
const {
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
} = require('../src/main/ipc/clean-registry');

function createFakeIpcMain() {
  const registrations = {
    handle: [],
    handleOnce: [],
    on: [],
    once: [],
  };

  const ipcMain = { registrations };

  for (const method of Object.keys(registrations)) {
    ipcMain[method] = function (channel, callback) {
      registrations[method].push({ channel, callback });
      return method === 'on' || method === 'once' ? ipcMain : undefined;
    };
  }

  return ipcMain;
}

function createFakeStore(initial = {}) {
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

const ipcMain = createFakeIpcMain();
const stores = new Map([
  ['app', createFakeStore({ language: 'es' })],
  ['tracker', createFakeStore({ isPaid: false })],
]);

const legacy = loadWithMigratedIpc({
  ipcMain,
  migratedChannels: MIGRATED_CHANNELS,
  loadLegacy() {
    for (const channel of [
      'get-current-platform',
      'get-device-info',
      'get-main-window-launch-preference',
      'set-main-window-launch-preference',
    ]) {
      ipcMain.handle(channel, () => 'LEGACY');
    }

    for (const channel of [
      'set-process-env',
      'electron-store-get',
      'electron-store-set',
      'electron-store-delete',
    ]) {
      ipcMain.on(channel, () => 'LEGACY');
    }

    ipcMain.handle('legacy-only-channel', () => 'LEGACY_ONLY');
    return { loaded: true };
  },
  registerMigrated(mainIpc) {
    registerMigratedHandlers(mainIpc, { stores });
  },
});

assert.deepStrictEqual(legacy, { loaded: true });

for (const channel of [
  'get-current-platform',
  'get-device-info',
  'get-main-window-launch-preference',
  'set-main-window-launch-preference',
]) {
  assert.strictEqual(
    ipcMain.registrations.handle.filter((x) => x.channel === channel).length,
    1,
    channel + ' must be clean-only',
  );
}

for (const channel of [
  'set-process-env',
  'electron-store-get',
  'electron-store-set',
  'electron-store-delete',
]) {
  assert.strictEqual(
    ipcMain.registrations.on.filter((x) => x.channel === channel).length,
    1,
    channel + ' must be clean-only',
  );
}

assert.strictEqual(
  ipcMain.registrations.handle.filter(
    (x) => x.channel === 'legacy-only-channel',
  ).length,
  1,
);

const platform = ipcMain.registrations.handle.find(
  (x) => x.channel === 'get-current-platform',
).callback();
assert.strictEqual(platform, process.platform);

const envRegistration = ipcMain.registrations.on.find(
  (x) => x.channel === 'set-process-env',
);
envRegistration.callback(
  {},
  { key: 'DYCLOK_RECONSTRUCTION_TEST', value: 'ok' },
);
assert.strictEqual(process.env.DYCLOK_RECONSTRUCTION_TEST, 'ok');
delete process.env.DYCLOK_RECONSTRUCTION_TEST;

const deviceInfoHandler = ipcMain.registrations.handle.find(
  (x) => x.channel === 'get-device-info',
).callback;
const deviceInfo = deviceInfoHandler();
assert.strictEqual(typeof deviceInfo.id, 'string');
assert.strictEqual(deviceInfo.id.length, 32);

const getStore = ipcMain.registrations.on.find(
  (x) => x.channel === 'electron-store-get',
).callback;
const setStore = ipcMain.registrations.on.find(
  (x) => x.channel === 'electron-store-set',
).callback;
const deleteStore = ipcMain.registrations.on.find(
  (x) => x.channel === 'electron-store-delete',
).callback;

const getEvent = {};
getStore(getEvent, 'app.language');
assert.strictEqual(getEvent.returnValue, 'es');

const setEvent = {};
setStore(setEvent, { key: 'app.theme', value: 'dark' });
const verifySetEvent = {};
getStore(verifySetEvent, 'app.theme');
assert.strictEqual(verifySetEvent.returnValue, 'dark');

const deleteEvent = {};
deleteStore(deleteEvent, 'app.theme');
const verifyDeleteEvent = {};
getStore(verifyDeleteEvent, 'app.theme');
assert.strictEqual(verifyDeleteEvent.returnValue, undefined);

const setPreference = ipcMain.registrations.handle.find(
  (x) => x.channel === 'set-main-window-launch-preference',
).callback;
const getPreference = ipcMain.registrations.handle.find(
  (x) => x.channel === 'get-main-window-launch-preference',
).callback;

assert.deepStrictEqual(
  setPreference({}, { width: 1200, height: 800 }),
  { width: 1200, height: 800 },
);
assert.deepStrictEqual(getPreference(), { width: 1200, height: 800 });
assert.strictEqual(setPreference({}, null), null);
assert.strictEqual(getPreference(), null);

console.log('Incremental IPC migration: OK');

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

const ipcMain = createFakeIpcMain();

const legacy = loadWithMigratedIpc({
  ipcMain,
  migratedChannels: MIGRATED_CHANNELS,
  loadLegacy() {
    // Simulate legacy registrations for both migrated and unmigrated channels.
    ipcMain.handle('get-current-platform', () => 'LEGACY');
    ipcMain.on('set-process-env', () => 'LEGACY');
    ipcMain.handle('get-device-info', () => 'LEGACY_DEVICE_INFO');
    ipcMain.handle('legacy-only-channel', () => 'LEGACY_ONLY');
    return { loaded: true };
  },
  registerMigrated: registerMigratedHandlers,
});

assert.deepStrictEqual(legacy, { loaded: true });

assert.strictEqual(
  ipcMain.registrations.handle.filter((x) => x.channel === 'get-current-platform').length,
  1,
);
assert.strictEqual(
  ipcMain.registrations.on.filter((x) => x.channel === 'set-process-env').length,
  1,
);
assert.strictEqual(
  ipcMain.registrations.handle.filter((x) => x.channel === 'get-device-info').length,
  1,
);
assert.strictEqual(
  ipcMain.registrations.handle.filter((x) => x.channel === 'legacy-only-channel').length,
  1,
);

const platform = ipcMain.registrations.handle.find(
  (x) => x.channel === 'get-current-platform',
).callback();
assert.strictEqual(platform, process.platform);

const envRegistration = ipcMain.registrations.on.find(
  (x) => x.channel === 'set-process-env',
);
envRegistration.callback({}, { key: 'DYCLOK_RECONSTRUCTION_TEST', value: 'ok' });
assert.strictEqual(process.env.DYCLOK_RECONSTRUCTION_TEST, 'ok');
delete process.env.DYCLOK_RECONSTRUCTION_TEST;

const deviceInfoHandler = ipcMain.registrations.handle.find(
  (x) => x.channel === 'get-device-info',
).callback;
const deviceInfo = deviceInfoHandler();
assert.strictEqual(typeof deviceInfo.id, 'string');
assert.strictEqual(deviceInfo.id.length, 32);
assert.strictEqual(typeof deviceInfo.name, 'string');

console.log('Incremental IPC migration: OK');

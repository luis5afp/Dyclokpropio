'use strict';

const {
  registerProcessHandlers,
  CHANNELS: PROCESS_CHANNELS,
} = require('./handlers/process');
const {
  registerDeviceInfoHandlers,
} = require('../device/device-info');
const {
  createStoreAccessors,
  registerStorageHandlers,
} = require('./handlers/storage');
const {
  registerWindowPreferenceHandlers,
} = require('./handlers/window-preference');
const {
  registerDisplayHandlers,
} = require('./handlers/display');
const {
  UPDATE_CHANNELS,
  registerDisabledUpdateHandlers,
} = require('./handlers/update-policy');

const MIGRATED_CHANNELS = Object.freeze([
  PROCESS_CHANNELS.GET_CURRENT_PLATFORM,
  PROCESS_CHANNELS.SET_PROCESS_ENV,
  'get-device-info',
  'electron-store-get',
  'electron-store-set',
  'electron-store-delete',
  'get-main-window-launch-preference',
  'set-main-window-launch-preference',
  'get-all-display',
  ...UPDATE_CHANNELS,
]);

function getCapturedStore(stores, name) {
  if (stores instanceof Map) return stores.get(name);
  return stores && stores[name];
}

function registerMigratedHandlers(ipcMain, context = {}) {
  registerProcessHandlers(ipcMain);
  registerDeviceInfoHandlers(ipcMain);
  registerDisplayHandlers(ipcMain, context.screen);
  registerDisabledUpdateHandlers(ipcMain);

  const appStore = getCapturedStore(context.stores, 'app');
  const trackerStore = getCapturedStore(context.stores, 'tracker');

  if (!appStore || !trackerStore) {
    throw new Error(
      'Recovered app/tracker stores were not captured during legacy startup',
    );
  }

  const accessors = createStoreAccessors({
    app: appStore,
    tracker: trackerStore,
  });

  registerStorageHandlers(ipcMain, accessors);
  registerWindowPreferenceHandlers(ipcMain, appStore);
}

module.exports = {
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
};

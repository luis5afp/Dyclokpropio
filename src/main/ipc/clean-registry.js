'use strict';

const {
  registerProcessHandlers,
  CHANNELS: PROCESS_CHANNELS,
} = require('./handlers/process');
const {
  registerDeviceInfoHandlers,
} = require('../device/device-info');

const MIGRATED_CHANNELS = Object.freeze([
  PROCESS_CHANNELS.GET_CURRENT_PLATFORM,
  PROCESS_CHANNELS.SET_PROCESS_ENV,
  'get-device-info',
]);

function registerMigratedHandlers(ipcMain) {
  registerProcessHandlers(ipcMain);
  registerDeviceInfoHandlers(ipcMain);
}

module.exports = {
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
};

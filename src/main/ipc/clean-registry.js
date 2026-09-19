'use strict';

const { registerProcessHandlers, CHANNELS: PROCESS_CHANNELS } = require('./handlers/process');

const MIGRATED_CHANNELS = Object.freeze([
  PROCESS_CHANNELS.GET_CURRENT_PLATFORM,
  PROCESS_CHANNELS.SET_PROCESS_ENV,
]);

function registerMigratedHandlers(ipcMain) {
  registerProcessHandlers(ipcMain);
}

module.exports = {
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
};

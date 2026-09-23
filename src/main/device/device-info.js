'use strict';

const os = require('os');
const { getDeviceId } = require('./device-id');

/**
 * Clean equivalent of the recovered get-device-info value construction.
 */
function createDeviceInfo(deviceIdProvider = getDeviceId) {
  const resolved = Intl.DateTimeFormat().resolvedOptions();

  return {
    timeZone: resolved.timeZone,
    language: resolved.locale,
    name: os.hostname(),
    id: deviceIdProvider(),
  };
}

function registerDeviceInfoHandlers(ipcMain) {
  ipcMain.handle('get-device-info', () => createDeviceInfo());
}

module.exports = {
  createDeviceInfo,
  registerDeviceInfoHandlers,
};

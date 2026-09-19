'use strict';

const CHANNELS = Object.freeze({
  GET_CURRENT_PLATFORM: 'get-current-platform',
  SET_PROCESS_ENV: 'set-process-env',
});

function getCurrentPlatform() {
  return process.platform;
}

function setProcessEnv(_event, { key, value }) {
  process.env[key] = value;
}

function registerProcessHandlers(ipcMain) {
  ipcMain.handle(CHANNELS.GET_CURRENT_PLATFORM, getCurrentPlatform);
  ipcMain.on(CHANNELS.SET_PROCESS_ENV, setProcessEnv);
}

module.exports = {
  CHANNELS,
  getCurrentPlatform,
  setProcessEnv,
  registerProcessHandlers,
};

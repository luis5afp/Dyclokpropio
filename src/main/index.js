'use strict';

const { BrowserWindow, ipcMain } = require('electron');

// Preserve dependency-loading behavior observed in the recovered wrapper.
require('path');
require('child_process');
require('fs');
require('crypto');
require('ts-md5');
require('get-port-please');
require('lodash');

const { loadWithMigratedIpc } = require('./ipc/migration-loader');
const {
  loadWithElectronStoreCapture,
} = require('./legacy/capture-electron-store');
const {
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
} = require('./ipc/clean-registry');

let capturedStores;

const legacy = loadWithMigratedIpc({
  ipcMain,
  migratedChannels: MIGRATED_CHANNELS,
  loadLegacy: () => {
    const result = loadWithElectronStoreCapture(
      () => require('./legacy-bundle'),
    );

    capturedStores = result.stores;
    return result.legacy;
  },
  registerMigrated: (mainIpc) =>
    registerMigratedHandlers(mainIpc, {
      stores: capturedStores,
    }),
});

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
Object.defineProperty(exports, 'BrowserWindow', {
  enumerable: true,
  get: () => BrowserWindow,
});

exports.envIdStopEnv = legacy.envIdStopEnv;
exports.fetchIpCheckKeyFromServer = legacy.fetchIpCheckKeyFromServer;
exports.getCurrentAppLogPath = legacy.getCurrentAppLogPath;
exports.getRpaTaskIdByPids = legacy.getRpaTaskIdByPids;
exports.log = legacy.log;

Object.defineProperty(exports, 'logPath', {
  enumerable: true,
  get: () => legacy.logPath,
});

exports.rpaLog = legacy.rpaLog;

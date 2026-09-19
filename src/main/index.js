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
  MIGRATED_CHANNELS,
  registerMigratedHandlers,
} = require('./ipc/clean-registry');

const legacy = loadWithMigratedIpc({
  ipcMain,
  migratedChannels: MIGRATED_CHANNELS,
  loadLegacy: () => require('./legacy-bundle'),
  registerMigrated: registerMigratedHandlers,
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

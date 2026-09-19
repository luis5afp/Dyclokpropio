'use strict';

const assert = require('assert');
const Module = require('module');

const mockBrowserWindow = function BrowserWindow() {};
const registrations = { handle: [], handleOnce: [], on: [], once: [] };
const mockIpcMain = {};
for (const method of Object.keys(registrations)) {
  mockIpcMain[method] = function (channel, callback) {
    registrations[method].push({ channel, callback });
    return method === 'on' || method === 'once' ? mockIpcMain : undefined;
  };
}

const mockLegacy = {
  envIdStopEnv: () => 'envIdStopEnv',
  fetchIpCheckKeyFromServer: () => 'fetchIpCheckKeyFromServer',
  getCurrentAppLogPath: () => 'getCurrentAppLogPath',
  getRpaTaskIdByPids: () => 'getRpaTaskIdByPids',
  log: () => 'log',
  logPath: 'mock-log-path',
  rpaLog: () => 'rpaLog',
};

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'electron') {
    return { BrowserWindow: mockBrowserWindow, ipcMain: mockIpcMain };
  }
  if (
    request.endsWith('main-CuCOh59n.js') ||
    request === './legacy-bundle'
  ) {
    return mockLegacy;
  }

  if (['ts-md5', 'get-port-please', 'lodash'].includes(request)) return {};
  return originalLoad.call(this, request, parent, isMain);
};

try {
  const reconstructed = require('../src/main/index.js');

  assert.strictEqual(reconstructed.BrowserWindow, mockBrowserWindow);
  assert.strictEqual(reconstructed.envIdStopEnv, mockLegacy.envIdStopEnv);
  assert.strictEqual(
    reconstructed.fetchIpCheckKeyFromServer,
    mockLegacy.fetchIpCheckKeyFromServer,
  );
  assert.strictEqual(reconstructed.getCurrentAppLogPath, mockLegacy.getCurrentAppLogPath);
  assert.strictEqual(reconstructed.getRpaTaskIdByPids, mockLegacy.getRpaTaskIdByPids);
  assert.strictEqual(reconstructed.log, mockLegacy.log);
  assert.strictEqual(reconstructed.logPath, mockLegacy.logPath);
  assert.strictEqual(reconstructed.rpaLog, mockLegacy.rpaLog);

  const platformHandler = registrations.handle.find(
    (item) => item.channel === 'get-current-platform',
  );
  const processEnvHandler = registrations.on.find(
    (item) => item.channel === 'set-process-env',
  );

  assert.ok(platformHandler, 'clean get-current-platform handler must register');
  assert.ok(processEnvHandler, 'clean set-process-env handler must register');
  assert.strictEqual(platformHandler.callback(), process.platform);

  console.log('Main wrapper contract: OK');
} finally {
  Module._load = originalLoad;
}

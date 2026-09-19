'use strict';

const assert = require('assert');
const Module = require('module');

const mockBrowserWindow = function BrowserWindow() {};
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
  if (request === 'electron') return { BrowserWindow: mockBrowserWindow };
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

  console.log('Main wrapper contract: OK');
} finally {
  Module._load = originalLoad;
}

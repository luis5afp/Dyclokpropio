'use strict';

const assert = require('assert');
const Module = require('module');

const mockBrowserWindow = function BrowserWindow() {};
const mockDisplays = [
  { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
  { id: 2, bounds: { x: 1920, y: 0, width: 1280, height: 1024 } },
];
const mockScreen = {
  getAllDisplays() {
    return mockDisplays;
  },
};
const registrations = { handle: [], handleOnce: [], on: [], once: [] };
const mockIpcMain = {};

for (const method of Object.keys(registrations)) {
  mockIpcMain[method] = function (channel, callback) {
    registrations[method].push({ channel, callback });
    return method === 'on' || method === 'once' ? mockIpcMain : undefined;
  };
}

class FakeStore {
  constructor(options = {}) {
    this.options = options;
    this.values = {};
  }

  get store() {
    return { ...this.values };
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    this.values[key] = value;
    return this;
  }

  delete(key) {
    delete this.values[key];
    return this;
  }
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
    return {
      BrowserWindow: mockBrowserWindow,
      ipcMain: mockIpcMain,
      screen: mockScreen,
    };
  }

  if (request === 'electron-store') {
    return FakeStore;
  }

  if (request === './legacy-bundle') {
    // These constructors are intercepted by capture-electron-store while the
    // reconstructed main wrapper loads the recovered bundle.
    const Store = require('electron-store');
    new Store({ name: 'app' });
    new Store({ name: 'tracker' });
    return mockLegacy;
  }

  if (request.endsWith('main-CuCOh59n.js')) {
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
  assert.strictEqual(
    reconstructed.getCurrentAppLogPath,
    mockLegacy.getCurrentAppLogPath,
  );
  assert.strictEqual(
    reconstructed.getRpaTaskIdByPids,
    mockLegacy.getRpaTaskIdByPids,
  );
  assert.strictEqual(reconstructed.log, mockLegacy.log);
  assert.strictEqual(reconstructed.logPath, mockLegacy.logPath);
  assert.strictEqual(reconstructed.rpaLog, mockLegacy.rpaLog);

  for (const channel of [
    'get-current-platform',
    'get-device-info',
    'get-main-window-launch-preference',
    'set-main-window-launch-preference',
    'get-all-display',
  ]) {
    assert.strictEqual(
      registrations.handle.filter((item) => item.channel === channel).length,
      1,
      channel + ' must have one clean handler',
    );
  }

  for (const channel of [
    'set-process-env',
    'electron-store-get',
    'electron-store-set',
    'electron-store-delete',
  ]) {
    assert.strictEqual(
      registrations.on.filter((item) => item.channel === channel).length,
      1,
      channel + ' must have one clean listener',
    );
  }

  const platformHandler = registrations.handle.find(
    (item) => item.channel === 'get-current-platform',
  );
  assert.strictEqual(platformHandler.callback(), process.platform);

  const displayHandler = registrations.handle.find(
    (item) => item.channel === 'get-all-display',
  );
  assert.deepStrictEqual(displayHandler.callback(), mockDisplays);

  console.log('Main wrapper contract: OK');
} finally {
  Module._load = originalLoad;
}

'use strict';

const { storeConfig } = require('./schema');
const { getQueuedElectronStoreClass } = require('./queued-electron-store');

function createRecoveredStores(StoreClass = getQueuedElectronStoreClass()) {
  return {
    app: new StoreClass(storeConfig.app),
    tracker: new StoreClass(storeConfig.tracker),
  };
}

module.exports = { createRecoveredStores };

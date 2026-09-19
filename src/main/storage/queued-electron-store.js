'use strict';

/**
 * Creates the clean equivalent of recovered class Oh.
 *
 * Oh extends electron-store and keeps an immediately updated in-memory
 * store snapshot while serializing persistence through a promise.
 */
function createQueuedElectronStoreClass(StoreBase) {
  if (typeof StoreBase !== 'function') {
    throw new TypeError('StoreBase must be a constructor');
  }

  return class QueuedElectronStore extends StoreBase {
    constructor(...args) {
      super(...args);
      this.recoveredState = {};
      this.persistPromise = Promise.resolve();
      this.memoryStore = super.store;
    }

    get store() {
      return this.memoryStore;
    }

    set store(value) {
      this.memoryStore = value;
      const persistPromise = Promise.resolve().then(() =>
        this.persistStore(value),
      );
      this.persistPromise = persistPromise;
      persistPromise.catch(() => {});
    }

    async setAndWait(key, value) {
      this.set(key, value);
      await this.persistPromise;
    }

    persistStore(value) {
      super.store = value;
    }
  };
}

function getQueuedElectronStoreClass() {
  return createQueuedElectronStoreClass(require('electron-store'));
}

module.exports = {
  createQueuedElectronStoreClass,
  getQueuedElectronStoreClass,
};

'use strict';

const Module = require('module');

/**
 * Captures the exact electron-store-derived instances created by the recovered
 * main bundle. The recovered class Oh extends electron-store, so intercepting
 * the base constructor lets clean handlers share the same live app/tracker
 * objects instead of creating competing caches.
 */
function loadWithElectronStoreCapture(loadLegacy, options = {}) {
  if (typeof loadLegacy !== 'function') {
    throw new TypeError('loadLegacy must be a function');
  }

  const StoreBase = options.StoreBase || require('electron-store');
  const moduleSystem = options.moduleSystem || Module;
  const stores = new Map();

  class CapturingElectronStore extends StoreBase {
    constructor(...args) {
      super(...args);

      const config = args[0];
      if (config && typeof config.name === 'string') {
        stores.set(config.name, this);
      }
    }
  }

  const originalLoad = moduleSystem._load;

  moduleSystem._load = function patchedLoad(request, parent, isMain) {
    if (request === 'electron-store') {
      return CapturingElectronStore;
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return {
      legacy: loadLegacy(),
      stores,
    };
  } finally {
    moduleSystem._load = originalLoad;
  }
}

module.exports = { loadWithElectronStoreCapture };

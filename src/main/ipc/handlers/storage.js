'use strict';

/**
 * Clean equivalent of recovered helpers fs(), Lh() and b0().
 *
 * The actual encrypted stores are injected so their construction can be
 * reconstructed independently without coupling IPC behavior to storage setup.
 */
function getStoreRoot(key) {
  return String(key).split('.')[0];
}

function getNestedKey(key, root) {
  return String(key).replace(root + '.', '');
}

function createStoreAccessors(stores) {
  function requireStore(root) {
    const store = stores[root];
    if (!store) {
      // Preserve the recovered behavior: attempting to use an unknown root
      // fails rather than silently creating a namespace.
      throw new TypeError('Unknown store root: ' + root);
    }
    return store;
  }

  function get(key) {
    const root = getStoreRoot(key);
    const store = requireStore(root);

    return String(key).includes('.')
      ? store.get(getNestedKey(key, root))
      : store.store;
  }

  function set(key, value) {
    const root = getStoreRoot(key);
    return requireStore(root).set(getNestedKey(key, root), value);
  }

  function remove(key) {
    const root = getStoreRoot(key);
    return requireStore(root).delete(getNestedKey(key, root));
  }

  return { get, set, delete: remove };
}

function registerStorageHandlers(ipcMain, accessors) {
  ipcMain.on('electron-store-get', (event, key) => {
    try {
      event.returnValue = accessors.get(key);
    } catch (_error) {
      event.returnValue = new Error('electron store get failed');
    }
  });

  ipcMain.on('electron-store-set', (event, { key, value }) => {
    try {
      event.returnValue = accessors.set(key, value);
    } catch (_error) {
      event.returnValue = new Error('electron store set failed');
    }
  });

  ipcMain.on('electron-store-delete', (event, key) => {
    try {
      event.returnValue = accessors.delete(key);
    } catch (_error) {
      event.returnValue = new Error('electron store delete failed');
    }
  });
}

module.exports = {
  createStoreAccessors,
  registerStorageHandlers,
};

'use strict';

/**
 * Restore invoke() access to the ORIGINAL recovered clear-dev-cache handler.
 *
 * The original main bundle contains an async (event, { clearTypes, id,
 * localDataConfig }) implementation. Do not replace it with a no-op, an
 * indiscriminate cache deletion, or a manufactured success response.
 *
 * Some legacy registrations use ipcMain.on(channel, callback), which serves
 * send() but NOT invoke(). When we observe that exact original registration
 * and no handle() registration exists, expose the same callback via handle().
 * If the original runtime later adds its own handle(), its handler wins.
 *
 * NO profile identifiers, paths, cache types or results are logged.
 */
const CHANNEL = 'clear-dev-cache';

function trustedMainWindow(event) {
  try {
    const url = new URL(event?.senderFrame?.url);
    return url.protocol === 'file:' &&
      url.pathname.toLowerCase().endsWith('/dist/index.html');
  } catch { return false; }
}

function installCacheIpcCompatibility(ipcMain) {
  if (!ipcMain ||
      typeof ipcMain.on !== 'function' ||
      typeof ipcMain.handle !== 'function' ||
      typeof ipcMain.hasHandler !== 'function' ||
      typeof ipcMain.removeHandler !== 'function') {
    throw new TypeError('Electron ipcMain on/handle/hasHandler/removeHandler required');
  }
  const originalOn = ipcMain.on;
  const originalHandle = ipcMain.handle;
  let bridged = false;
  let seenOriginalOn = false;
  let nativeHandleSeen = ipcMain.hasHandler(CHANNEL);

  ipcMain.handle = function dyclokPreserveNativeHandle(channel, handler) {
    // Native registrations always have priority over this compatibility
    // bridge, even if the main runtime installs the native handler later.
    if (channel === CHANNEL) {
      if (bridged) {
        ipcMain.removeHandler(CHANNEL);
        bridged = false;
      }
      nativeHandleSeen = true;
    }
    return originalHandle.apply(this, arguments);
  };

  ipcMain.on = function dyclokBridgeLegacyCacheListener(channel, listener) {
    const registered = originalOn.apply(this, arguments);
    if (channel === CHANNEL && typeof listener === 'function') {
      seenOriginalOn = true;
      if (!nativeHandleSeen && !bridged && !ipcMain.hasHandler(CHANNEL)) {
        // Invoke the original callback with its unchanged parameters and
        // preserve the exact response or rejection. Never synthesize success.
        originalHandle.call(this, CHANNEL, function recoveredCacheOperation(event, payload) {
          if (!trustedMainWindow(event)) {
            throw new Error('DYCLOK_CACHE_IPC_DENIED');
          }
          return listener.call(this, event, payload);
        });
        bridged = true;
      }
    }
    return registered;
  };

  return {
    status() {
      return {
        seenOriginalOn,
        bridged,
        hasHandler: ipcMain.hasHandler(CHANNEL),
        nativeHandleSeen,
      };
    },
  };
}

module.exports = {CHANNEL, trustedMainWindow, installCacheIpcCompatibility};

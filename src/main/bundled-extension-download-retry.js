'use strict';

/**
 * One bounded retry for DICloak's existing extension-download IPC handler.
 *
 * The original backend remains responsible for download, validation and
 * unpacking. This hook only retries an explicit false result once for an
 * HTTPS URL. It cannot make a missing remote archive available and must never
 * report success if verification/download failed.
 */
const TARGET = 'download-chrome-unzip-extension';

function hasRetryableRequest(payload) {
  return Boolean(payload && typeof payload === 'object' &&
    typeof payload.expanId === 'string' && payload.expanId.length > 0 &&
    typeof payload.url === 'string' && /^https:\/\//i.test(payload.url));
}

function installExtensionDownloadRetry(ipcMain, options = {}) {
  if (!ipcMain || typeof ipcMain.handle !== 'function') {
    throw new TypeError('ipcMain.handle is unavailable');
  }
  const warn = typeof options.warn === 'function' ? options.warn : console.warn;
  const sleep = typeof options.sleep === 'function'
    ? options.sleep : (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const retryDelayMs = Number.isFinite(options.retryDelayMs) && options.retryDelayMs >= 0
    ? Math.min(2000, options.retryDelayMs) : 850;
  const originalHandle = ipcMain.handle;
  ipcMain.handle = function wrapHandle(channel, handler) {
    if (channel !== TARGET || typeof handler !== 'function') {
      return originalHandle.apply(this, arguments);
    }
    const wrapped = async function originalWithSingleRetry(event, payload, ...rest) {
      // Exceptions must be reported to the original caller unchanged: they
      // may represent authentication, permission or integrity failures.
      const first = await handler.call(this, event, payload, ...rest);
      if (first !== false || !hasRetryableRequest(payload)) return first;
      warn('[Dyclokpropio] Descarga de extension fallida: un reintento sin omitir las verificaciones.');
      await sleep(retryDelayMs);
      return handler.call(this, event, payload, ...rest);
    };
    return originalHandle.call(this, channel, wrapped);
  };
  return () => { ipcMain.handle = originalHandle; };
}

module.exports = { TARGET, hasRetryableRequest, installExtensionDownloadRetry };

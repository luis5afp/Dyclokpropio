'use strict';

/**
 * A bounded retry of the ORIGINAL DICloak extension downloader. The recovered
 * IPC handler can catch a download exception and return null, not just false.
 * Both outcomes are failures. The original handler performs all checks again.
 */
const TARGET = 'download-chrome-unzip-extension';

function hasRetryableRequest(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  if (typeof payload.expanId !== 'string' || !/^[\w.-]{1,160}$/.test(payload.expanId)) return false;
  if (typeof payload.url !== 'string' || payload.url.length > 4096) return false;
  try {
    const url = new URL(payload.url);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

function failed(result) { return result === false || result === null; }

function installExtensionDownloadRetry(ipcMain, options = {}) {
  if (!ipcMain || typeof ipcMain.handle !== 'function') {
    throw new TypeError('ipcMain.handle is unavailable');
  }
  const warn = typeof options.warn === 'function' ? options.warn : console.warn;
  const record = typeof options.record === 'function' ? options.record : () => {};
  const sleep = typeof options.sleep === 'function'
    ? options.sleep : (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const retryDelayMs = Number.isFinite(options.retryDelayMs) && options.retryDelayMs >= 0
    ? Math.min(2000, options.retryDelayMs) : 850;
  const originalHandle = ipcMain.handle;

  function safeRecord(payload, result, retried) {
    const extensionId = typeof payload?.expanId === 'string' && /^[\w.-]{1,160}$/.test(payload.expanId)
      ? payload.expanId : 'unknown';
    const extensionName = typeof payload?.extensionName === 'string'
      ? payload.extensionName.replace(/[^\p{L}\p{N} ._()-]/gu, '').slice(0, 64) : '';
    try { record({ extensionId, extensionName, result, retried }); }
    catch { /* Diagnostics must never interfere with profile launch. */ }
  }

  ipcMain.handle = function wrapHandle(channel, handler) {
    if (channel !== TARGET || typeof handler !== 'function') {
      return originalHandle.apply(this, arguments);
    }
    const wrapped = async function originalWithSingleRetry(event, payload, ...rest) {
      // Exceptions propagate unchanged: permissions and integrity checks are
      // not bypassed, and failed results are never converted into success.
      let first;
      try { first = await handler.call(this, event, payload, ...rest); }
      catch (error) { safeRecord(payload, 'exception', false); throw error; }
      if (!failed(first)) return first;
      if (!hasRetryableRequest(payload)) {
        safeRecord(payload, first === null ? 'null' : 'false', false);
        return first;
      }
      warn('[Dyclokpropio] Extension no preparada. Reintentando una vez mediante el validador original.');
      await sleep(retryDelayMs);
      let second;
      try { second = await handler.call(this, event, payload, ...rest); }
      catch (error) { safeRecord(payload, 'exception', true); throw error; }
      if (failed(second)) safeRecord(payload, second === null ? 'null' : 'false', true);
      return second;
    };
    return originalHandle.call(this, channel, wrapped);
  };
  return () => { ipcMain.handle = originalHandle; };
}

module.exports = { TARGET, hasRetryableRequest, installExtensionDownloadRetry };

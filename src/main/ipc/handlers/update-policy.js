'use strict';

const IPC = require('../../../shared/ipc-channels');

const UPDATE_CHANNELS = Object.freeze([
  IPC.UPDATE_APP,
  IPC.UPDATE_APP_CHECK_PACK,
  IPC.UPDATE_APP_FULL_UPDATE,
  IPC.UPDATE_APP_PATCH_UPDATE,
  IPC.UPDATE_APP_CANCEL_DOWNLOAD,
  IPC.UPDATE_APP_RESTART,
]);

/**
 * The reconstructed application intentionally does not perform self-update
 * checks or self-update actions. Both event-style and invoke-style calls are
 * accepted as no-ops so stale renderer code cannot reactivate the updater.
 */
function registerDisabledUpdateHandlers(ipcMain) {
  if (!ipcMain) throw new TypeError('ipcMain is required');

  for (const channel of UPDATE_CHANNELS) {
    ipcMain.on(channel, () => {});
    ipcMain.handle(channel, async () => false);
  }
}

module.exports = {
  UPDATE_CHANNELS,
  registerDisabledUpdateHandlers,
};

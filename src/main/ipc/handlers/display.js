'use strict';

function registerDisplayHandlers(ipcMain, electronScreen) {
  if (!electronScreen || typeof electronScreen.getAllDisplays !== 'function') {
    throw new TypeError('Electron screen API is required');
  }

  ipcMain.handle('get-all-display', () => electronScreen.getAllDisplays());
}

module.exports = { registerDisplayHandlers };

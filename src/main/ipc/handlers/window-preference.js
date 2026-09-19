'use strict';

const {
  normalizeMainWindowLaunchPreference,
} = require('../../window/main-window-preference');

const PREFERENCE_KEY = 'mainWindowLaunchPreference';

function registerWindowPreferenceHandlers(ipcMain, appStore) {
  if (!appStore) {
    throw new Error('Captured app store is required');
  }

  ipcMain.handle('get-main-window-launch-preference', () =>
    normalizeMainWindowLaunchPreference(appStore.get(PREFERENCE_KEY)),
  );

  ipcMain.handle(
    'set-main-window-launch-preference',
    (_event, preference) => {
      if (preference === null) {
        appStore.delete(PREFERENCE_KEY);
        return null;
      }

      const normalized = normalizeMainWindowLaunchPreference(preference);

      if (!normalized) {
        throw new TypeError('Invalid main window launch preference');
      }

      appStore.set(PREFERENCE_KEY, normalized);
      return normalized;
    },
  );
}

module.exports = {
  PREFERENCE_KEY,
  registerWindowPreferenceHandlers,
};

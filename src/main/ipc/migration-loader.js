'use strict';

/**
 * Incrementally replaces recovered IPC registrations without loading duplicate
 * handlers. During legacy initialization, migrated channel registrations are
 * suppressed; clean reconstructed handlers are registered immediately after.
 */
function loadWithMigratedIpc({
  ipcMain,
  migratedChannels,
  loadLegacy,
  registerMigrated,
}) {
  if (!ipcMain) throw new TypeError('ipcMain is required');
  if (typeof loadLegacy !== 'function') throw new TypeError('loadLegacy is required');
  if (typeof registerMigrated !== 'function') {
    throw new TypeError('registerMigrated is required');
  }

  const migrated = new Set(migratedChannels || []);
  const methodNames = ['handle', 'handleOnce', 'on', 'once'];
  const originals = new Map();

  for (const methodName of methodNames) {
    if (typeof ipcMain[methodName] !== 'function') continue;

    const original = ipcMain[methodName];
    originals.set(methodName, original);

    ipcMain[methodName] = function reconstructedRegistrationGate(channel, ...args) {
      if (migrated.has(channel)) {
        // EventEmitter-style methods normally return the emitter for chaining.
        if (methodName === 'on' || methodName === 'once') return ipcMain;
        return undefined;
      }

      return original.call(this, channel, ...args);
    };
  }

  let legacy;
  try {
    legacy = loadLegacy();
  } finally {
    for (const [methodName, original] of originals) {
      ipcMain[methodName] = original;
    }
  }

  registerMigrated(ipcMain);
  return legacy;
}

module.exports = { loadWithMigratedIpc };

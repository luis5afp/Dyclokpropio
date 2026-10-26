'use strict';

/**
 * Dyclokpropio: transparent, application-bundled Chromium extension loader.
 *
 * Registered BEFORE the recovered Electron entrypoint is executed so child
 * process launch functions imported by the original runtime can be decorated.
 * Cookies Pro receives a stable ID and is included in the per-profile Chromium
 * toolbar pin list, without changing browser cookies or other installed items.
 */
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');
const { makeLaunchHooks } = require('./bundled-extension-launch.js');
const {
  EXTENSION_ID,
  deriveExtensionId,
  pinExtensionForLaunch,
} = require('./bundled-extension-pin.js');

const extensionPath = path.join(process.resourcesPath, 'plugins', '.cookies-pro-privada');
const manifestPath = path.join(extensionPath, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error(
    'El instalador no incluye Cookies Pro Privada: ' + manifestPath +
    '. Comprueba que los recursos se copiaron con electron-builder.'
  );
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.name !== 'Cookies Pro Privada' || manifest.version !== '16.9.10') {
  throw new Error('Version inesperada de Cookies Pro Privada');
}
if (!manifest.key || deriveExtensionId(manifest.key) !== EXTENSION_ID || !manifest.action?.default_icon) {
  throw new Error('Cookies Pro Privada no tiene su identidad o icono de barra validado');
}

makeLaunchHooks(
  childProcess,
  extensionPath,
  (message) => console.warn('[Dyclokpropio/cookies-extension] ' + message),
  (args) => {
    try {
      // Best effort only: never block the browser if a profile is read-only,
      // already open or uses a nonstandard Chromium preferences layout.
      pinExtensionForLaunch(args);
    } catch (error) {
      console.warn('[Dyclokpropio/cookies-extension] No se pudo fijar el icono: ' + error.message);
    }
  }
);

// No modification to the original obfuscated Electron runtime.
module.exports = require('../../dist-electron/main.js');

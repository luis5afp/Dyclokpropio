'use strict';

/**
 * Dyclokpropio: transparent, application-bundled Chromium extension loader.
 *
 * Registered BEFORE the recovered Electron entrypoint is executed so child
 * process launch functions imported by the original runtime can be decorated.
 * Original browser profile directories and extension settings stay unchanged.
 */
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');
const { makeLaunchHooks } = require('./bundled-extension-launch.js');

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

makeLaunchHooks(childProcess, extensionPath, (message) => {
  console.warn('[Dyclokpropio/cookies-extension] ' + message);
});

// No modification to the original obfuscated Electron runtime.
module.exports = require('../../dist-electron/main.js');

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
const { ipcMain } = require('electron');
const { installExtensionDownloadRetry } = require('./bundled-extension-download-retry.js');
const { createExtensionDiagnosticWriter } = require('./extension-download-diagnostics.js');
const { registerOpenStageDiagnostics } = require('./open-stage-diagnostics.js');

// Keep the original DICloak extension repository and integrity verification.
// Retry a failed HTTPS download once, without turning false into success.
try {
  installExtensionDownloadRetry(ipcMain, { record: createExtensionDiagnosticWriter(require('electron').app) });
} catch (error) {
  console.warn('[Dyclokpropio] No se pudo activar el reintento de extensiones:', error.message);
}
// Traces per-stage profile opening without collecting profile IDs, cookies,
// URLs, log text, filesystem locations or stack traces.
try {
  registerOpenStageDiagnostics(ipcMain, require('electron').app);
} catch (error) {
  console.warn('[Dyclokpropio] No se pudo activar el diagnóstico de etapas:', error.message);
}
// DIAGNOSTIC BUILD: disable ONLY the Cookies Pro bundled injection for ALL
// profiles, existing and future. Keep the verified original extension downloader
// and its failure diagnostics, as well as all browser/profile data unchanged.
//
// The ZIP stays packaged solely so a later build can restore it without
// re-importing/re-uploading the extension. The disabled block does not inspect
// the manifest, change Chromium Preferences or append --load-extension.
//
// This does NOT remove an extension installed independently by DICloak's
// native extension groups or manually within a browser profile.
const ENABLE_BUNDLED_COOKIES_PRO = false;
if (ENABLE_BUNDLED_COOKIES_PRO) {
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
} else {
  console.info('[Dyclokpropio] Diagnostico: inyeccion automatica de Cookies Pro Privada desactivada.');
}

// No modification to the original obfuscated Electron runtime.
module.exports = require('../../dist-electron/main.js');

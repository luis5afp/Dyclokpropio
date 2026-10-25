'use strict';

/**
 * Verify that release inputs are present before electron-builder runs.
 * The original application's executable/runtime resources are not generated
 * by npm install; a missing file would result in an incomplete installer.
 * Run tools/verify-safe-base.js separately to check the protected JS hashes.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const required = [
  ['dist/index.html', 100],
  ['dist-electron/main.js', 100],
  ['dist-electron/main-CuCOh59n.js', 100],
  ['dist-electron/preload/index.js', 100],
  ['dist-electron/worker/downloadWorker.js', 100],
  ['dist/assets/sync/DicSyncService.exe', 100],
  ['vendor/ffmpeg/bin/ffmpeg.exe', 100],
  ['resources/elevate.exe', 100],
  ['resources/electron/tray-icon.png', 100],
  ['plugins/.automa/manifest.json', 1],
  ['plugins/.simulation/manifest.json', 1],
  ['plugins/.spoofing-video/manifest.json', 1],
];

const missing = [];
for (const [relative, minBytes] of required) {
  const absolute = path.join(root, relative);
  let stat;
  try {
    stat = fs.statSync(absolute);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    missing.push(relative + ' (ausente)');
    continue;
  }
  if (!stat.isFile() || stat.size < minBytes) {
    missing.push(relative + ' (no es un archivo valido)');
  }
}

if (missing.length) {
  console.error('Faltan recursos necesarios para compilar el instalador:');
  for (const item of missing) console.error(' - ' + item);
  process.exitCode = 1;
} else {
  console.log('Recursos de runtime presentes: ' + required.length);
  console.log('Para validar los hashes del runtime original, ejecuta: node tools/verify-safe-base.js');
}

// SourceData is a Chromium profile from the source installer, not application
// source code. It must not be added blindly to a public Git repository.
if (fs.existsSync(path.join(root, 'SourceData'))) {
  console.warn('ADVERTENCIA: SourceData/ contiene datos de perfil de navegador; no lo publiques en GitHub.');
}

'use strict';

/**
 * Restore the exact user-provided extension runtime from the repository's ZIP.
 * Runs after `npm install` and before electron-builder copies plugins/.
 * Only the eight expected package files are accepted (no path traversal).
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const AdmZip = require('adm-zip');
const { EXTENSION_ID, EXTENSION_PUBLIC_KEY, deriveExtensionId } = require('../src/main/bundled-extension-pin.js');

const root = path.resolve(__dirname, '..');
const zipFile = path.join(root, 'bundled-extensions', 'Cookies-Pro-v16.9.10-runtime.zip');
// Keep optional user extension OUTSIDE the original internally signed plugins tree.
// The internal plugins SHA must cover only the recovered runtime's own files.
const out = path.join(root, 'optional-extensions', '.cookies-pro-privada');
const expectedHash = '053c843178e9401260030c0e0e7f036c9c1cade2a0e92113c7eff4f6426e32d9';
const expectedFiles = [
  'manifest.json', 'background.js', 'popup.js', 'popup.html',
  'style.css', 'icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png',
];

const archive = fs.readFileSync(zipFile);
const actualHash = crypto.createHash('sha256').update(archive).digest('hex');
assert.equal(actualHash, expectedHash, 'La extension empaquetada no coincide con el archivo auditado');
const zip = new AdmZip(archive);
const entries = zip.getEntries();
assert.deepEqual(entries.map((e) => e.entryName).sort(), [...expectedFiles].sort(),
  'El ZIP contiene una lista inesperada de archivos');
const manifest = JSON.parse(zip.readAsText('manifest.json'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.name, 'Cookies Pro Privada');
assert.equal(manifest.version, '16.9.10');
assert.equal(deriveExtensionId(EXTENSION_PUBLIC_KEY), EXTENSION_ID, 'ID publico de la extension inconsistente');
assert.ok(manifest.action && manifest.action.default_popup, 'La extension necesita un icono de accion para poder fijarse');

const staged = path.join(root, 'optional-extensions', '.cookies-pro-privada-staged');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.rmSync(staged, { recursive: true, force: true });
try {
  for (const filename of expectedFiles) {
    const target = path.join(staged, filename);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const file = zip.getEntry(filename);
    assert.ok(file, 'Falta recurso: ' + filename);
    if (filename === 'manifest.json') {
      // Keep the user's original ZIP unchanged. Give the unpacked copy a
      // consistent ID and a visible action icon for the Chromium toolbar.
      const unpackedManifest = {
        ...manifest,
        key: EXTENSION_PUBLIC_KEY,
        action: {
          ...manifest.action,
          default_icon: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png',
          },
        },
      };
      fs.writeFileSync(target, JSON.stringify(unpackedManifest, null, 2) + '\n', { mode: 0o644 });
    } else {
      fs.writeFileSync(target, file.getData(), { mode: 0o644 });
    }
  }
  // A legacy build might have staged this optional extension under plugins/.
  // Do not delete user profile extensions; this is only the build workspace.
  const wronglyStaged = path.join(root, 'plugins', '.cookies-pro-privada');
  fs.rmSync(wronglyStaged, { recursive: true, force: true });
  fs.rmSync(out, { recursive: true, force: true });
  fs.renameSync(staged, out);
  console.log('Cookies Pro Privada 16.9.10 integrada en ' + out);
} catch (error) {
  fs.rmSync(staged, { recursive: true, force: true });
  throw error;
}

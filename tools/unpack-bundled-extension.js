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

const root = path.resolve(__dirname, '..');
const zipFile = path.join(root, 'bundled-extensions', 'Cookies-Pro-v16.9.10-runtime.zip');
const out = path.join(root, 'plugins', '.cookies-pro-privada');
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

const staged = path.join(root, 'plugins', '.cookies-pro-privada-staged');
fs.rmSync(staged, { recursive: true, force: true });
try {
  for (const filename of expectedFiles) {
    const target = path.join(staged, filename);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const file = zip.getEntry(filename);
    assert.ok(file, 'Falta recurso: ' + filename);
    fs.writeFileSync(target, file.getData(), { mode: 0o644 });
  }
  fs.rmSync(out, { recursive: true, force: true });
  fs.renameSync(staged, out);
  console.log('Cookies Pro Privada 16.9.10 integrada en ' + out);
} catch (error) {
  fs.rmSync(staged, { recursive: true, force: true });
  throw error;
}

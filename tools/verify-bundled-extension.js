'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { isChromiumBinary, injectFlag, makeLaunchHooks } = require('../src/main/bundled-extension-launch.js');
const root = path.resolve(__dirname, '..');
const extensionPath = path.join(root, 'plugins', '.cookies-pro-privada');
const manifest = JSON.parse(fs.readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8'));
assert.equal(manifest.name, 'Cookies Pro Privada');
assert.equal(manifest.version, '16.9.10');
for (const required of ['background.js', 'popup.js', 'popup.html', 'style.css', 'icons/icon128.png']) {
  assert.ok(fs.statSync(path.join(extensionPath, required)).size > 0);
}
assert.equal(isChromiumBinary('C:\\kernels\\chrome.exe'), true);
assert.equal(isChromiumBinary('/usr/bin/chromium'), true);
assert.equal(isChromiumBinary('DicSyncService.exe'), false);
assert.deepEqual(injectFlag(['--profile-directory=Profile 2'], extensionPath), [
  '--profile-directory=Profile 2', '--load-extension=' + extensionPath,
]);
assert.deepEqual(injectFlag(['--load-extension=C:\\x'], extensionPath), [
  '--load-extension=C:\\x,' + extensionPath,
]);
assert.deepEqual(injectFlag(['--disable-extensions'], extensionPath), ['--disable-extensions']);
const calls=[];
const mocked = {
  spawn: (...args) => calls.push({ type: 'spawn', args }),
  execFile: (...args) => calls.push({ type: 'execFile', args }),
};
const restore = makeLaunchHooks(mocked, extensionPath);
mocked.spawn('C:\\kernels\\chrome.exe', ['--user-data-dir=C:\\profile244']);
mocked.spawn('C:\\kernels\\chrome.exe', ['--user-data-dir=C:\\profile243']);
mocked.spawn('DicSyncService.exe', ['--worker']);
mocked.execFile('chrome.exe', ['--incognito'], {}, () => {});
assert.equal(calls[0].args[1].at(-1), '--load-extension=' + extensionPath);
assert.equal(calls[1].args[1].at(-1), '--load-extension=' + extensionPath);
assert.deepEqual(calls[2].args[1], ['--worker']);
assert.equal(calls[3].args[1].at(-1), '--load-extension=' + extensionPath);
restore();
console.log('OK: extension presente y argumentos de Chromium preparados para varios perfiles.');

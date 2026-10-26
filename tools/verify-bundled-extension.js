'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  EXTENSION_ID,
  EXTENSION_PUBLIC_KEY,
  deriveExtensionId,
  pinExtensionForLaunch,
} = require('../src/main/bundled-extension-pin.js');
const { isChromiumBinary, injectFlag, makeLaunchHooks } = require('../src/main/bundled-extension-launch.js');
const root = path.resolve(__dirname, '..');
const extensionPath = path.join(root, 'plugins', '.cookies-pro-privada');
const manifest = JSON.parse(fs.readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8'));
assert.equal(manifest.name, 'Cookies Pro Privada');
assert.equal(manifest.version, '16.9.10');
assert.equal(manifest.key, EXTENSION_PUBLIC_KEY);
assert.equal(deriveExtensionId(manifest.key), EXTENSION_ID);
assert.equal(manifest.action.default_icon['16'], 'icons/icon16.png');
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

// Independently simulated Chromium profiles: existing preferences are preserved,
// the cookie action is pinned once, and a fresh profile gets the same shortcut.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'dyclok-cookie-pin-'));
try {
  for (const name of ['profile244', 'profile243']) {
    const userDir = path.join(fixture, name);
    const profileDir = path.join(userDir, 'Default');
    fs.mkdirSync(profileDir, { recursive: true });
    const prefsFile = path.join(profileDir, 'Preferences');
    fs.writeFileSync(prefsFile, JSON.stringify({
      homepage: 'https://example.org',
      extensions: { pinned_extensions: ['abcdefghijklmnopabcdefghijklmnop'] },
      profile: { name },
    }));
    const launchArgs = ['--user-data-dir=' + userDir];
    assert.equal(pinExtensionForLaunch(launchArgs).status, 'pinned');
    assert.equal(pinExtensionForLaunch(launchArgs).status, 'already');
    const updated = JSON.parse(fs.readFileSync(prefsFile, 'utf8'));
    assert.deepEqual(updated.extensions.pinned_extensions, [
      'abcdefghijklmnopabcdefghijklmnop',
      EXTENSION_ID,
    ]);
    assert.equal(updated.profile.name, name);
    assert.equal(updated.homepage, 'https://example.org');
  }

  const newUserDir = path.join(fixture, 'profileNEW');
  fs.mkdirSync(newUserDir);
  assert.equal(pinExtensionForLaunch(['--user-data-dir', newUserDir]).status, 'pinned');
  const added = JSON.parse(fs.readFileSync(path.join(newUserDir, 'Default', 'Preferences'), 'utf8'));
  assert.deepEqual(added.extensions.pinned_extensions, [EXTENSION_ID]);

  const noChange = path.join(fixture, 'blocked');
  fs.mkdirSync(noChange);
  assert.equal(pinExtensionForLaunch(['--user-data-dir=' + noChange, '--disable-extensions']).status, 'skipped');
  assert.ok(!fs.existsSync(path.join(noChange, 'Default', 'Preferences')));
  assert.equal(pinExtensionForLaunch(['--user-data-dir=' + newUserDir, '--profile-directory=../unsafe']).status, 'skipped');
  assert.equal(pinExtensionForLaunch(['--user-data-dir=/nonexistent-dyclok-synthetic-profile']).status, 'skipped');

  const existing = path.join(fixture, 'corrupt');
  fs.mkdirSync(path.join(existing, 'Default'), { recursive: true });
  const invalidFile = path.join(existing, 'Default', 'Preferences');
  fs.writeFileSync(invalidFile, 'not valid JSON');
  assert.throws(() => pinExtensionForLaunch(['--user-data-dir=' + existing]), SyntaxError);
  assert.equal(fs.readFileSync(invalidFile, 'utf8'), 'not valid JSON');

  // The hook invokes per-profile preparation BEFORE handing off to Chromium.
  const hooked = [];
  const fakeCp = {
    spawn: (binary, args) => hooked.push({ binary, args }),
    execFile: () => {},
  };
  const unhook = makeLaunchHooks(fakeCp, extensionPath, console.warn, pinExtensionForLaunch);
  fakeCp.spawn('chrome.exe', ['--user-data-dir=' + newUserDir]);
  assert.equal(hooked.length, 1);
  assert.ok(hooked[0].args.includes('--load-extension=' + extensionPath));
  unhook();
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
console.log('OK: extension integrada con icono fijo por perfil, ID estable y preferencias conservadas.');

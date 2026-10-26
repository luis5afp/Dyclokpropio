'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// Only the public key is distributed. It provides a stable unpacked-extension
// ID across installations; no signing/private key is stored here.
const EXTENSION_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3XOTo7OX4JcStIXniEC6sMy0CyJxS5jb2m2vF+optKDvxnkqG4XBea3DUcNp4zcCAE8zPjj0nuCKl7ICmVI5V8VZZkJs8reYstALcKdSCLX0KAoEEEaBUZWjk9TnQJUugIdXXilsqf4NqdAZSFinvyaUq+tva/X9dwOKXMG2uql0NoQy940HfZu1Fqd6LubT2z/9eSRRdZNZRZijHzbZiox662iHqPv+hXCegMPkMfziFuikj5uwYOxsCHRsuW9kI8LgTX9AQq5LOZ966j6WDiWag1AncMqlWyc883yx/j6tkAe/wq+O98R/p1j491eKGZwYOSjZyiSPVY26kljccwIDAQAB';
const EXTENSION_ID = 'jcngejliihhhdlcmppdafecbdjoofhaf';

function deriveExtensionId(publicKey = EXTENSION_PUBLIC_KEY) {
  const digest = crypto.createHash('sha256').update(Buffer.from(publicKey, 'base64')).digest();
  return [...digest.subarray(0, 16)]
    .map((byte) => String.fromCharCode(97 + (byte >> 4), 97 + (byte & 15)))
    .join('');
}

function getSwitchValue(args, name) {
  const equalsPrefix = name + '=';
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] !== 'string') continue;
    if (args[i].startsWith(equalsPrefix)) return args[i].slice(equalsPrefix.length);
    if (args[i] === name && typeof args[i + 1] === 'string') return args[i + 1];
  }
  return null;
}

/**
 * Chrome persists toolbar pinning in the browser profile's Preferences:
 * extensions.pinned_extensions (a list of extension IDs).
 *
 * Only touch a browser profile that the launcher explicitly identified with
 * --user-data-dir; never scan other profiles or modify global Chrome policy.
 * Best effort: do this before launching the browser; a running browser may
 * overwrite Preferences. A native launcher must invoke the equivalent logic.
 */
function pinExtensionForLaunch(args, { fileSystem = fs } = {}) {
  if (!Array.isArray(args) || args.includes('--disable-extensions')) return { status: 'skipped' };
  const userDataDir = getSwitchValue(args, '--user-data-dir');
  if (!userDataDir || !path.isAbsolute(userDataDir)) return { status: 'skipped' };
  if (path.parse(userDataDir).root === path.resolve(userDataDir)) return { status: 'skipped' };
  if (!fileSystem.existsSync(userDataDir) || !fileSystem.statSync(userDataDir).isDirectory()) {
    return { status: 'skipped' };
  }
  const profileName = getSwitchValue(args, '--profile-directory') || 'Default';
  if (
    profileName === '.' || profileName === '..' ||
    /[\\/]/.test(profileName) || !/^[\w .-]{1,100}$/.test(profileName)
  ) {
    return { status: 'skipped' };
  }
  const profileDir = path.join(userDataDir, profileName);
  let prefPath = path.join(profileDir, 'Preferences');

  // Some Chromium variants pass their profile folder itself as user-data-dir.
  if (!fileSystem.existsSync(prefPath) && fileSystem.existsSync(path.join(userDataDir, 'Preferences'))) {
    prefPath = path.join(userDataDir, 'Preferences');
  }
  const prefDir = path.dirname(prefPath);
  if (fileSystem.existsSync(prefDir) && fileSystem.lstatSync(prefDir).isSymbolicLink()) {
    return { status: 'skipped' };
  }
  if (fileSystem.existsSync(prefPath) && fileSystem.lstatSync(prefPath).isSymbolicLink()) {
    return { status: 'skipped' };
  }

  const exists = fileSystem.existsSync(prefPath);
  const data = exists ? JSON.parse(fileSystem.readFileSync(prefPath, 'utf8')) : {};
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { status: 'skipped' };
  }
  const old = data.extensions;
  if (old != null && (typeof old !== 'object' || Array.isArray(old))) return { status: 'skipped' };
  const extensions = old || {};
  const pins = extensions.pinned_extensions;
  if (pins != null && (!Array.isArray(pins) || pins.some((id) => typeof id !== 'string'))) {
    return { status: 'skipped' };
  }
  if (pins && pins.includes(EXTENSION_ID)) return { status: 'already' };

  // Preserve existing pinned actions and all other profile preferences.
  data.extensions = { ...extensions, pinned_extensions: [...(pins || []), EXTENSION_ID] };
  fileSystem.mkdirSync(prefDir, { recursive: true });
  const tempPath = prefPath + '.dyclok-pin-' + process.pid + '-' + crypto.randomBytes(5).toString('hex');
  let tempCreated = false;
  try {
    const mode = exists ? fileSystem.statSync(prefPath).mode & 0o777 : 0o600;
    fileSystem.writeFileSync(tempPath, JSON.stringify(data, null, 2), { mode, flag: 'wx' });
    tempCreated = true;
    fileSystem.renameSync(tempPath, prefPath);
  } finally {
    if (tempCreated && fileSystem.existsSync(tempPath)) fileSystem.unlinkSync(tempPath);
  }
  return { status: 'pinned' };
}

module.exports = {
  EXTENSION_ID,
  EXTENSION_PUBLIC_KEY,
  deriveExtensionId,
  getSwitchValue,
  pinExtensionForLaunch,
};

'use strict';

/**
 * Store an opaque, unmodified file payload attributed by the trusted native
 * engine to a specific DICloak profile. This DOES NOT intercept HTTP, read
 * cookies, export sessions or discover profile folders by itself.
 *
 * The root directory and profile ID MUST come from the trusted main process,
 * not user-controlled renderer IPC. NTFS ACL verification is required before
 * using this as a production storage location on Windows.
 */
const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const { validateProfileId, isAbsoluteLocalFolder } = require('./almacen-perfil-readonly.js');

function validateSafeFileName(name) {
  if (typeof name !== 'string' || name.length < 1 || name.length > 255 ||
      name === '.' || name === '..' ||
      /[\\/:*?"<>|\x00-\x1f]/u.test(name) ||
      /[. ]$/u.test(name) ||
      /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/iu.test(name)) {
    throw new Error('Unsafe original filename: cannot store without renaming it');
  }
  return name; // original spelling preserved; no normalization or extension filter
}
async function ensurePlainDirectory(directory, { create = false } = {}) {
  if (create) {
    try { await fs.mkdir(directory, { mode: 0o700 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  const stat = await fs.lstat(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error('Refusing non-directory or symbolic-link storage');
  }
}
function validateEventId(eventId) {
  if (typeof eventId !== 'string' ||
      !/^[A-Za-z0-9_-]{1,100}$/.test(eventId)) {
    throw new Error('Invalid event ID');
  }
  return eventId;
}
async function archiveOriginalFile({ rootFolder, profileId, eventId, originalName, payload }) {
  validateProfileId(profileId);
  validateEventId(eventId);
  validateSafeFileName(originalName);
  if (!isAbsoluteLocalFolder(rootFolder)) throw new Error('Trusted local root required');
  if (!Buffer.isBuffer(payload)) {
    throw new TypeError('Payload must be a Buffer of original bytes (no text decoding)');
  }
  // Root must have been provisioned and ACL-protected by the native installer.
  await ensurePlainDirectory(rootFolder);

  const profileDir = path.join(rootFolder, profileId);
  const filesDir = path.join(profileDir, 'archivos');
  await ensurePlainDirectory(profileDir, { create: true });
  await ensurePlainDirectory(filesDir, { create: true });
  const eventFolder = path.join(filesDir, eventId);
  // MUST be unique; another event with same file name never overwrites content.
  await fs.mkdir(eventFolder, { mode: 0o700 });
  await ensurePlainDirectory(eventFolder);
  const target = path.join(eventFolder, originalName);
  let fd;
  try {
    fd = await fs.open(target, 'wx', 0o600);
    let position = 0;
    while (position < payload.byteLength) {
      const result = await fd.write(payload, position, payload.byteLength - position, position);
      if (result.bytesWritten <= 0) throw new Error('Incomplete archive write');
      position += result.bytesWritten;
    }
    await fd.sync();
    const verify = await fd.stat();
    if (verify.size !== payload.length) throw new Error('Archived byte length does not match');
  } catch (error) {
    if (fd) {
      await fd.close();
      fd = null;
    }
    // Never touch any source file; only clean up our incomplete new copy.
    await fs.rm(target, { force: true }).catch(() => {});
    throw error;
  } finally {
    if (fd) await fd.close();
  }
  return {
    file: target,
    byteLength: payload.length,
    sha256: crypto.createHash('sha256').update(payload).digest('hex'),
    sourceUnmodified: true
  };
}

module.exports = { validateSafeFileName, validateEventId, archiveOriginalFile };

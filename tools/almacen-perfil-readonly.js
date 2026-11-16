'use strict';

/**
 * Safe backend primitive for a future "Almacén > Abrir" row action.
 * Only opens an ALREADY-EXISTING verified download folder for the exact
 * internal profile ID. Never scans HTTP traffic, writes, moves, renames,
 * copies, decrypts or modifies any downloaded file.
 *
 * IMPORTANT: the vendor DICloak 3.0.7 browser profile -> downloads folder
 * mapping has not yet been established. The caller must supply it from a
 * trustworthy native browser-download event or its existing local settings.
 * In absence of such a mapping, fail closed; NEVER guess %Downloads% or
 * map by serialNum (the number displayed in the table).
 */
const fs = require('node:fs');
const path = require('node:path');

function isAbsoluteLocalFolder(folder) {
  if (typeof folder !== 'string' || !folder.trim() || folder.includes('\0')) return false;
  if (/^\\\\/.test(folder) || /^\/\//.test(folder)) return false; // no network paths
  return path.isAbsolute(folder) || /^[a-zA-Z]:[\\/]/.test(folder);
}
function normalizedLocationKey(folder) {
  if (typeof folder !== 'string') return '';
  return /^[a-zA-Z]:[\\/]/.test(folder) ?
    path.win32.normalize(folder).replace(/[\\/]+$/, '').toLowerCase() :
    path.posix.normalize(folder).replace(/\/+$/, '');
}
function validateProfileId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) {
    throw new Error('Invalid internal profile identifier');
  }
  return value;
}
function resolveExistingAlmacen({ profileId, knownFolders, fsApi = fs }) {
  validateProfileId(profileId);
  if (!knownFolders || typeof knownFolders !== 'object' || Array.isArray(knownFolders) ||
      !Object.prototype.hasOwnProperty.call(knownFolders, profileId)) {
    return { ok: false, reason: 'PROFILE_DOWNLOAD_LOCATION_NOT_KNOWN' };
  }
  const folder = knownFolders[profileId];
  if (!isAbsoluteLocalFolder(folder)) return { ok: false, reason: 'INVALID_DOWNLOAD_LOCATION' };
  const selectedKey = normalizedLocationKey(folder);
  const paths = Object.entries(knownFolders).filter(([id, dir]) =>
    id !== profileId && normalizedLocationKey(dir) === selectedKey);
  if (paths.length) return { ok: false, reason: 'SHARED_FOLDER_CANNOT_ATTRIBUTE_TO_PROFILE' };
  let stat;
  try { stat = fsApi.lstatSync(folder); }
  catch (e) { return { ok: false, reason: 'DOWNLOAD_FOLDER_NOT_FOUND' }; }
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    return { ok: false, reason: 'NOT_A_PLAIN_DIRECTORY' };
  }
  return { ok: true, folder };
}

async function openAlmacen({ profileId, knownFolders, shellApi, fsApi = fs }) {
  const target = resolveExistingAlmacen({ profileId, knownFolders, fsApi });
  if (!target.ok) return target;
  if (!shellApi || typeof shellApi.openPath !== 'function') {
    throw new Error('Trusted native shell is required');
  }
  const result = await shellApi.openPath(target.folder);
  return result === '' ?
    { ok: true, opened: true } :
    { ok: false, reason: 'EXPLORER_COULD_NOT_OPEN_DIRECTORY' };
}
module.exports = { validateProfileId, isAbsoluteLocalFolder, normalizedLocationKey, resolveExistingAlmacen, openAlmacen };

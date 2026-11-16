'use strict';

/**
 * DICloak Almacén: bridge for an explicitly authorized local-only test harness.
 * The Electron main process associates a browser session handle with the
 * internal profile ID; renderer-provided profile numbers and paths are NOT
 * accepted. No network interception, cookie-jar export or credential reading.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { archiveMockResponse } = require('./almacen-respuesta-http-pruebas.js');
const { archiveOriginalFile } = require('./almacen-original-files.js');
const { resolveExistingAlmacen, validateProfileId, isAbsoluteLocalFolder } =
  require('./almacen-perfil-readonly.js');

function createAlmacenLabBridge({ rootFolder, allowedProfiles, shellApi }) {
  if (!isAbsoluteLocalFolder(rootFolder)) throw new Error('Trusted local Almacén root required');
  if (!Array.isArray(allowedProfiles) || !allowedProfiles.length) {
    throw new Error('Trusted profile allowlist is required');
  }
  const authorized = new Set(allowedProfiles.map(validateProfileId));
  if (authorized.size !== allowedProfiles.length) throw new Error('Duplicate profile IDs');
  const sessions = new WeakMap();
  const knownFolders = Object.create(null);
  for (const profileId of authorized) knownFolders[profileId] = path.join(rootFolder, profileId);

  function registerSession(sessionHandle, profileId) {
    if (!sessionHandle || typeof sessionHandle !== 'object') throw new Error('Native browser session handle required');
    validateProfileId(profileId);
    if (!authorized.has(profileId)) throw new Error('Unknown profile');
    if (sessions.has(sessionHandle)) throw new Error('Browser session already bound');
    sessions.set(sessionHandle, profileId);
  }
  function identity(sessionHandle) {
    if (!sessionHandle || typeof sessionHandle !== 'object' || !sessions.has(sessionHandle)) {
      throw new Error('No trusted browser session mapping');
    }
    return sessions.get(sessionHandle);
  }
  async function recordResponse({ sessionHandle, responseUrl, rawHeaderBytes, bodyBytes }) {
    const profileId = identity(sessionHandle);
    return archiveMockResponse({
      rootFolder,
      profileId,
      eventId: crypto.randomUUID(),
      responseUrl,
      rawHeaderBytes,
      bodyBytes
    });
  }
  async function recordDownloadedFile({ sessionHandle, originalName, payload }) {
    const profileId = identity(sessionHandle);
    return archiveOriginalFile({
      rootFolder, profileId, eventId: crypto.randomUUID(), originalName, payload
    });
  }
  async function openFolder(sessionHandle) {
    const profileId = identity(sessionHandle);
    const target = resolveExistingAlmacen({
      profileId, knownFolders, fsApi: require('node:fs')
    });
    if (!target.ok) return target;
    // Never accept arbitrary paths from the UI. The path was derived from the
    // trusted session identity and predefined root.
    if (!shellApi || typeof shellApi.openPath !== 'function') {
      return { ok: false, reason: 'NATIVE_SHELL_NOT_CONNECTED' };
    }
    const result = await shellApi.openPath(target.folder);
    return result === '' ? { ok: true, opened: true } :
      { ok: false, reason: 'WINDOWS_EXPLORER_FAILED' };
  }
  async function inventory(sessionHandle) {
    const profileId = identity(sessionHandle);
    const target = resolveExistingAlmacen({ profileId, knownFolders, fsApi: require('node:fs') });
    if (!target.ok) return { ok: false, reason: target.reason, eventFolders: 0 };
    const children = await fs.readdir(target.folder, { withFileTypes: true });
    return { ok: true, profileId, eventFolders: children.filter(x => x.isDirectory()).length };
  }
  return Object.freeze({
    registerSession, recordResponse, recordDownloadedFile, openFolder, inventory
  });
}
module.exports = { createAlmacenLabBridge };

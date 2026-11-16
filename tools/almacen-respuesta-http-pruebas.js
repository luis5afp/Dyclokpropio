'use strict';

/**
 * Laboratory-only receiver for an ALREADY-CAPTURED response from a user-owned
 * localhost mock HTTP server. It does NOT intercept browser traffic, read a
 * cookie jar, collect client credentials, or alter any profile.
 *
 * Store raw headers and body bytes as received by the test harness, including
 * any synthetic Set-Cookie, fake tokens or proxy configuration sent by the
 * mock server. Do not use this as a general-purpose browser traffic logger.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { validateProfileId, isAbsoluteLocalFolder } = require('./almacen-perfil-readonly.js');
const { validateEventId } = require('./almacen-original-files.js');

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

function validateMockOrigin(url) {
  if (typeof url !== 'string') throw new Error('A mock server URL is required');
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' || !LOOPBACK_HOSTS.has(parsed.hostname.toLowerCase()) ||
      parsed.username || parsed.password || parsed.hash) {
    throw new Error('Capture is restricted to explicitly local mock HTTP servers');
  }
  return parsed;
}

async function existingPlainDirectory(folder) {
  const stat = await fs.lstat(folder);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error('Storage directory is not a regular directory');
  }
}

async function newPlainDirectory(folder) {
  await fs.mkdir(folder, { mode: 0o700 });
  await existingPlainDirectory(folder);
}

async function writeRawBytes(folder, filename, bytes) {
  const dest = path.join(folder, filename);
  await fs.writeFile(dest, bytes, { flag: 'wx', mode: 0o600 });
  const written = await fs.readFile(dest);
  if (!written.equals(bytes)) throw new Error('Archived bytes failed comparison');
  return { path: dest, length: bytes.length, sha256: sha256(bytes) };
}

/**
 * The main process must supply profileId from a trusted browser identity.
 * The renderer must never choose the profile identity or root directory.
 */
async function archiveMockResponse({ rootFolder, profileId, eventId, responseUrl,
                                    rawHeaderBytes, bodyBytes }) {
  validateProfileId(profileId);
  validateEventId(eventId);
  const url = validateMockOrigin(responseUrl);
  if (!isAbsoluteLocalFolder(rootFolder)) throw new Error('Trusted local root required');
  if (!Buffer.isBuffer(rawHeaderBytes) || !Buffer.isBuffer(bodyBytes)) {
    throw new TypeError('Headers and body must be supplied as original byte Buffers');
  }
  // The caller must provision this root privately and validate Windows NTFS
  // ACLs. Directory mode flags are not a substitute for Windows ACL checks.
  await existingPlainDirectory(rootFolder);
  const profileDir = path.join(rootFolder, profileId);
  const responsesDir = path.join(profileDir, 'respuestas-pruebas');
  try { await newPlainDirectory(profileDir); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    await existingPlainDirectory(profileDir);
  }
  try { await newPlainDirectory(responsesDir); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    await existingPlainDirectory(responsesDir);
  }
  const eventDir = path.join(responsesDir, eventId);
  await newPlainDirectory(eventDir); // no overwrite; unique event per profile
  try {
    const headers = await writeRawBytes(eventDir, 'headers.raw', rawHeaderBytes);
    const body = await writeRawBytes(eventDir, 'body.raw', bodyBytes);
    return {
      profileId,
      eventId,
      mockServerOrigin: url.origin,
      directory: eventDir,
      headers,
      body,
      originalBytesUnchanged: true
    };
  } catch (error) {
    // Only roll back the new incomplete archive; never touch source files.
    await fs.rm(eventDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

module.exports = { validateMockOrigin, archiveMockResponse };

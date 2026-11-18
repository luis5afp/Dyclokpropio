'use strict';

/**
 * Explicit one-endpoint connector for an operator-owned test server.
 * NOT a browser network interceptor or a cookie/credential extractor.
 *
 * Authorized URL is supplied ONLY to the trusted native main process.
 * The current renderer button must not supply URLs, auth headers, or paths.
 * This requests one public/fixture GET and can archive its byte-identical
 * response body, without cookies, Authorization, proxy credentials, redirects,
 * response headers, or any browser session attached.
 */
const http = require('node:http');
const https = require('node:https');
const crypto = require('node:crypto');
const { archiveOriginalFile } = require('./almacen-original-files.js');
const { validateProfileId } = require('./almacen-perfil-readonly.js');

const DEFAULT_LIMIT = 16 * 1024 * 1024;
const MAX_LIMIT = 64 * 1024 * 1024;

function validateAuthorizedUrl(raw) {
  if (typeof raw !== 'string' || raw.trim() !== raw || raw.length > 2048) {
    throw new Error('Authorized endpoint URL is missing or invalid');
  }
  let url;
  try { url = new URL(raw); } catch { throw new Error('Invalid authorized endpoint URL'); }
  if (url.username || url.password || url.search || url.hash ||
      !url.pathname || url.pathname === '/') {
    throw new Error('Endpoint must be an explicit path without credentials, query or fragment');
  }
  const host = url.hostname.toLowerCase();
  const loopback = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (url.protocol !== 'https:' && !(loopback && url.protocol === 'http:')) {
    throw new Error('External endpoints require HTTPS; HTTP is allowed only on loopback');
  }
  if (raw !== url.href) throw new Error('Use the exact canonical endpoint URL');
  return url;
}

function fetchAuthorizedBytes({ authorizedUrl, requestedUrl = authorizedUrl, maxBytes = DEFAULT_LIMIT }) {
  const url = validateAuthorizedUrl(authorizedUrl);
  if (requestedUrl !== authorizedUrl) {
    return Promise.reject(new Error('Requested URL is not the authorized endpoint'));
  }
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > MAX_LIMIT) {
    return Promise.reject(new Error('Invalid maximum response size'));
  }
  const client = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = error => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const request = client.request(url, {
      method: 'GET',
      timeout: 12000,
      maxRedirects: 0,
      headers: {
        'Accept': 'application/octet-stream, application/json, text/plain, */*',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-store'
      }
      // No Cookie, Authorization, Proxy-Authorization or copied browser headers.
    }, response => {
      if (response.statusCode !== 200) {
        response.resume();
        return fail(new Error('Endpoint returned HTTP ' + response.statusCode));
      }
      const encoding = String(response.headers['content-encoding'] || 'identity').toLowerCase();
      if (encoding !== 'identity') {
        response.resume();
        return fail(new Error('Unexpected encoded response; server must send identity bytes'));
      }
      const chunks = [];
      let length = 0;
      response.on('data', chunk => {
        length += chunk.length;
        if (length > maxBytes) {
          fail(new Error('Response is larger than the configured test limit'));
          request.destroy();
          return;
        }
        chunks.push(chunk);
      });
      response.on('error', fail);
      response.on('end', () => {
        if (settled) return;
        settled = true;
        const bytes = Buffer.concat(chunks, length);
        resolve({
          bodyBytes: bytes,
          contentType: String(response.headers['content-type'] || ''),
          sha256: crypto.createHash('sha256').update(bytes).digest('hex')
        });
      });
    });
    request.on('timeout', () => request.destroy(new Error('Test endpoint timeout')));
    request.on('error', fail);
    request.end();
  });
}

async function saveAuthorizedResponse({
  authorizedUrl, requestedUrl, rootFolder, trustedProfileId, originalFileName, maxBytes
}) {
  validateProfileId(trustedProfileId);
  if (typeof originalFileName !== 'string' || !originalFileName) {
    throw new Error('Output filename must be set by the trusted native process');
  }
  const response = await fetchAuthorizedBytes({ authorizedUrl, requestedUrl, maxBytes });
  const archived = await archiveOriginalFile({
    rootFolder,
    profileId: trustedProfileId,
    eventId: crypto.randomUUID(),
    originalName: originalFileName,
    payload: response.bodyBytes
  });
  return {
    ok: true,
    profileId: trustedProfileId,
    filename: originalFileName,
    byteLength: archived.byteLength,
    sha256: archived.sha256,
    // Intentionally no cookie values, credential fields or raw headers.
    source: 'explicit authorized endpoint'
  };
}

module.exports = { validateAuthorizedUrl, fetchAuthorizedBytes, saveAuthorizedResponse };

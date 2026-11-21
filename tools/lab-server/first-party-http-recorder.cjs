'use strict';

// First-party, opt-in Node.js server-side traffic recorder.
// To capture ACTUAL client -> own server exchanges, wrap the first handler
// in the controlled test server, not a vendor client's signed binary.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const MAGIC = Buffer.from('DPLABSR1', 'ascii');
const AAD = Buffer.from('diloakpro-first-party-lab-v1', 'ascii');
const MAX_BODY = 1024 * 1024;
const MAX_EVENTS = 30;
const MAX_TOTAL = 12 * 1024 * 1024;

function createFirstPartyRecorder({
  enabled = false, labPathPrefix = '/__diloakpro_lab__/',
  passphrase, directory,
  onProof = () => {}
} = {}) {
  if (!enabled) return null;
  if (typeof passphrase !== 'string' || passphrase.length < 16)
    throw new TypeError('Lab-only encryption passphrase must have at least 16 characters');
  if (typeof directory !== 'string' || !path.isAbsolute(directory))
    throw new TypeError('Output must be an absolute directory');
  if (!/^\/[a-z0-9/_-]{4,100}\/$/i.test(labPathPrefix) ||
      labPathPrefix === '/api/' || labPathPrefix === '/admin/')
    throw new TypeError('Use a dedicated test-only lab path prefix');
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  let live = true, count = 0, total = 0;
  const proofs = [];

  function attach(req, res) {
    const pathname = (() => {
      try { return new URL(req.url || '/', 'http://localhost').pathname; }
      catch { return ''; }
    })();
    // Never record random routes or other users' browsing sessions.
    if (!live || count >= MAX_EVENTS || total >= MAX_TOTAL ||
        !pathname.startsWith(labPathPrefix))
      return;
    const method = String(req.method || 'GET').toUpperCase();
    if (!['GET', 'POST', 'PUT', 'PATCH'].includes(method)) return;

    const receivedAtUtc = new Date().toISOString();
    const requestChunks = [], responseChunks = [];
    let requestBytes = 0, responseBytes = 0, invalid = false;
    let reqEnded = false, resFinished = false, saved = false;
    const transactionId = crypto.randomBytes(12).toString('hex');
    let responseWrites = 0, responseProofHeaderIssued = false;
    const originalPush = req.push;
    const originalWrite = res.write;
    const originalEnd = res.end;
    count++;

    function add(target, chunk, encoding, isRequest) {
      if (invalid || chunk == null) return;
      let bytes;
      if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) bytes = Buffer.from(chunk);
      else if (typeof chunk === 'string')
        bytes = Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8');
      else { invalid = true; return; }
      if ((isRequest ? requestBytes : responseBytes) + bytes.length > MAX_BODY ||
          total + bytes.length > MAX_TOTAL) { invalid = true; return; }
      total += bytes.length;
      if (isRequest) requestBytes += bytes.length;
      else responseBytes += bytes.length;
      target.push(bytes);
    }

    req.push = function(chunk, encoding) {
      try { add(requestChunks, chunk, encoding, true); }
      catch { invalid = true; }
      return originalPush.apply(this, arguments);
    };
    res.write = function(chunk, encoding) {
      responseWrites++;
      try { add(responseChunks, chunk, encoding, false); }
      catch { invalid = true; }
      return originalWrite.apply(this, arguments);
    };
    res.end = function(chunk, encoding) {
      try {
        add(responseChunks, chunk, encoding, false);
        const type = String(res.getHeader('content-type') || '').toLowerCase();
        const contentEncoding = res.getHeader('content-encoding');
        // Only uncompressed, one-shot, small JSON test responses can be compared
        // with the decoded body returned by Chromium Network.getResponseBody.
        if (!invalid && !res.headersSent && responseWrites === 0 &&
            responseBytes > 0 && responseBytes <= 128 * 1024 &&
            type.startsWith('application/json') &&
            (contentEncoding == null || String(contentEncoding).toLowerCase() === 'identity')) {
          const bytes = Buffer.concat(responseChunks, responseBytes);
          const digest = crypto.createHash('sha256').update(bytes).digest('hex');
          bytes.fill(0);
          res.setHeader('X-Diloakpro-Lab-Id', transactionId);
          res.setHeader('X-Diloakpro-Lab-SHA256', digest);
          res.setHeader('Cache-Control', 'no-store');
          responseProofHeaderIssued = true;
        }
      } catch { invalid = true; }
      return originalEnd.apply(this, arguments);
    };

    function maybePersist() {
      if (saved || !reqEnded || !resFinished) return;
      saved = true;
      req.push = originalPush;
      res.write = originalWrite;
      res.end = originalEnd;
      if (invalid || !live) return;

      // Reject unexpected content types. Never retain authorization/cookie
      // headers, query parameters, remote IPs or URL fragments.
      const requestType = String(req.headers['content-type'] || '').toLowerCase();
      const responseType = String(res.getHeader('content-type') || '').toLowerCase();
      if (requestBytes && !requestType.startsWith('application/json')) return;
      if (responseBytes && !responseType.startsWith('application/json')) return;
      const requestBody = Buffer.concat(requestChunks, requestBytes);
      const responseBody = Buffer.concat(responseChunks, responseBytes);
      // The exact bytes at this instrumented server boundary are recorded;
      // HTTPS wire framing / TLS records are NOT part of the captured bytes.
      const requestSha256 = crypto.createHash('sha256').update(requestBody).digest('hex');
      const responseSha256 = crypto.createHash('sha256').update(responseBody).digest('hex');
      const stamp = new Date().toISOString().replace(/[:.]/g, '-') +
        '-' + crypto.randomBytes(4).toString('hex');
      const payload = Buffer.from(JSON.stringify({
        schema: 1, boundary: 'node-server-request-push-and-response-write-end',
        method, pathname, receivedAtUtc, finishedAtUtc: new Date().toISOString(),
        statusCode: res.statusCode, requestBodyBase64: requestBody.toString('base64'),
        responseBodyBase64: responseBody.toString('base64')
      }), 'utf8');
      const salt = crypto.randomBytes(16);
      const nonce = crypto.randomBytes(12);
      const key = crypto.scryptSync(passphrase, salt, 32,
        { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
      let ciphertext, tag;
      try {
        const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
        cipher.setAAD(AAD);
        ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
        tag = cipher.getAuthTag();
      } finally {
        key.fill(0); payload.fill(0); requestBody.fill(0); responseBody.fill(0);
      }
      const packed = Buffer.concat([MAGIC, salt, nonce, tag, ciphertext]);
      const vault = 'lab-' + stamp + '.dplabsrv';
      const proof = {
        schema: 1, source: 'own-test-server', capturedAtUtc: receivedAtUtc,
        method, pathname, statusCode: res.statusCode,
        transactionId, responseProofHeaderIssued,
        requestBytes, responseBytes, requestSha256, responseSha256,
        payloadFile: vault,
        payloadEncrypted: true, transport: 'server-side-node-handler',
        meaning: 'Actual request and response at own instrumented server; not a proof of browser-applied profile state'
      };
      const tmp = path.join(directory, vault + '.tmp');
      const destination = path.join(directory, vault);
      try {
        fs.writeFileSync(tmp, packed, { flag: 'wx', mode: 0o600 });
        fs.renameSync(tmp, destination);
        fs.writeFileSync(path.join(directory, 'lab-' + stamp + '.proof.json'),
          JSON.stringify(proof, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        proofs.push(proof);
        try { onProof(proof); } catch {}
      } catch {
        try { fs.rmSync(tmp, { force: true }); } catch {}
      } finally {
        packed.fill(0); ciphertext.fill(0);
        requestChunks.forEach(chunk => chunk.fill(0));
        responseChunks.forEach(chunk => chunk.fill(0));
      }
    }
    req.once('end', () => { reqEnded = true; maybePersist(); });
    res.once('finish', () => { resFinished = true; maybePersist(); });
  }

  return {
    // Wrap the FIRST handler registered on your own test server.
    wrap: handler => function(req, res) {
      attach(req, res);
      return handler(req, res);
    },
    stop() { live = false; },
    proofs
  };
}

function decryptFirstPartyLab(fileBuffer, passphrase) {
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length < 52 ||
      !fileBuffer.subarray(0, 8).equals(MAGIC))
    throw new Error('INVALID_LAB_CAPTURE');
  const salt = fileBuffer.subarray(8, 24);
  const nonce = fileBuffer.subarray(24, 36);
  const tag = fileBuffer.subarray(36, 52);
  const cipherBytes = fileBuffer.subarray(52);
  const key = crypto.scryptSync(passphrase, salt, 32,
    { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(cipherBytes), decipher.final()]);
    try {
      const parsed = JSON.parse(plain.toString('utf8'));
      return {
        ...parsed,
        requestBody: Buffer.from(parsed.requestBodyBase64, 'base64'),
        responseBody: Buffer.from(parsed.responseBodyBase64, 'base64')
      };
    } finally { plain.fill(0); }
  } finally { key.fill(0); }
}

module.exports = { createFirstPartyRecorder, decryptFirstPartyLab };

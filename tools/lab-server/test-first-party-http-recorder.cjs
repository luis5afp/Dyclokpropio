'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { createFirstPartyRecorder, decryptFirstPartyLab } = require('./first-party-http-recorder.cjs');

async function run() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'diloakpro-firstparty-lab-'));
  const passphrase = 'SYNTHETIC-TEST-PASSPHRASE-ONLY-2026';
  const fakeInput = Buffer.from(JSON.stringify({
    fingerprint: { timezone: 'America/Lima' },
    extensions: ['fake-extension-test'],
    proxy: { host: 'localhost', password: 'FAKE-ONLY' },
    cookieTest: 'DUMMY-CONTENT-NOT-A-LIVE-COOKIE'
  }), 'utf8');
  const fakeResponse = Buffer.from(JSON.stringify({
    ok: true, source: 'our-test-server', receivedBytes: fakeInput.length
  }), 'utf8');
  const recorder = createFirstPartyRecorder({
    enabled: true,
    labPathPrefix: '/__diloakpro_lab__/',
    passphrase,
    directory: root
  });
  const server = http.createServer(recorder.wrap((req, res) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(fakeResponse);
    });
  }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

  function exchange(urlPath, input = fakeInput) {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1', port: server.address().port,
        path: urlPath, method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer FAKE-TOKEN-NEVER-LOG',
          cookie: 'test-session=FAKE-COOKIE-NEVER-LOG'
        }
      }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({
          status: res.statusCode,
          body: Buffer.concat(chunks)
        }));
      });
      req.on('error', reject);
      req.end(input);
    });
  }

  try {
    const response = await exchange('/__diloakpro_lab__/test?access_token=PRIVATE_FAKE');
    assert.equal(response.status, 201);
    assert.deepEqual(response.body, fakeResponse);
    assert.equal(recorder.proofs.length, 1);
    const proof = recorder.proofs[0];
    assert.equal(proof.requestSha256,
      crypto.createHash('sha256').update(fakeInput).digest('hex'));
    assert.equal(proof.responseSha256,
      crypto.createHash('sha256').update(fakeResponse).digest('hex'));
    assert.equal(proof.pathname, '/__diloakpro_lab__/test');
    assert.ok(!JSON.stringify(proof).includes('access_token'));
    assert.ok(!JSON.stringify(proof).includes('FAKE-COOKIE'));
    assert.ok(!JSON.stringify(proof).includes('FAKE-TOKEN'));
    const packed = fs.readFileSync(path.join(root, proof.payloadFile));
    assert.equal(packed.includes(fakeInput), false);
    assert.equal(packed.includes(fakeResponse), false);
    const decrypted = decryptFirstPartyLab(packed, passphrase);
    assert.deepEqual(decrypted.requestBody, fakeInput);
    assert.deepEqual(decrypted.responseBody, fakeResponse);
    assert.equal(decrypted.statusCode, 201);
    assert.throws(() => decryptFirstPartyLab(packed, 'INCORRECT-PASSWORD'),
      /auth|authenticate|Unsupported state/i);
    await exchange('/not-a-lab-route', fakeInput);
    assert.equal(recorder.proofs.length, 1, 'Non-lab traffic was captured');
    recorder.stop();
    await exchange('/__diloakpro_lab__/test', fakeInput);
    assert.equal(recorder.proofs.length, 1, 'Stopped recorder captured traffic');
    console.log('LAB_SERVER_REAL_REQUEST_AND_RESPONSE_BYTES=PASS');
    console.log('LAB_SERVER_PROOF_SHA256=PASS');
    console.log('LAB_SERVER_AES256_GCM_ROUNDTRIP=PASS');
    console.log('LAB_SERVER_REJECTS_UNRELATED_TRAFFIC=PASS');
    console.log('LAB_SERVER_OMITS_HEADERS_AND_QUERY=PASS');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
  }
}

run().catch(err => { console.error(err); process.exitCode = 1; });

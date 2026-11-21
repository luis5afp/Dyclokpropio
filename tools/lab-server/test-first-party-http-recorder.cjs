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
    email: 'dummy-login@example.invalid',
    password: 'TEST-PASSWORD-NOT-A-REAL-SECRET',
    fingerprint: { timezone: 'America/Lima' },
    extensions: ['fake-extension-test'],
    proxy: { host: 'localhost', password: 'FAKE-ONLY' },
    cookieTest: 'DUMMY-CONTENT-NOT-A-LIVE-COOKIE'
  }), 'utf8');
  const fakeResponse = Buffer.from(JSON.stringify({
    ok: true, source: 'our-test-server', receivedBytes: fakeInput.length,
    email: 'dummy-response@example.invalid',
    password: 'DUMMY-RESPONSE-PASSWORD-ONLY',
    cookie: {name: 'DILOAKPRO_TEST_session'},
    proxy: {type: 'http', host: 'localhost'},
    extensions: [{id: 'synthetic-extension'}],
    fingerprint: {timezone: 'America/Lima'}
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
      res.setHeader('Set-Cookie', [
        'DILOAKPRO_TEST_session=ONLY-SYNTHETIC-COOKIE; Path=/; HttpOnly; SameSite=Strict',
        'other-session=SHOULD-NOT-APPEAR-IN-VAULT; Path=/'
      ]);
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
          cookie: 'DILOAKPRO_TEST_client=FAKE-CLIENT-COOKIE; test-session=FAKE-COOKIE-NEVER-LOG'
        }
      }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({
          status: res.statusCode,
          headers: res.headers,
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
    assert.match(response.headers['x-diloakpro-lab-id'], /^[a-f0-9]{24}$/);
    assert.equal(response.headers['x-diloakpro-lab-sha256'],
      crypto.createHash('sha256').update(fakeResponse).digest('hex'));
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.deepEqual(response.body, fakeResponse);
    assert.equal(recorder.proofs.length, 1);
    const proof = recorder.proofs[0];
    assert.equal(proof.requestSha256,
      crypto.createHash('sha256').update(fakeInput).digest('hex'));
    assert.equal(proof.responseSha256,
      crypto.createHash('sha256').update(fakeResponse).digest('hex'));
    assert.equal(proof.pathname, '/__diloakpro_lab__/test');
    assert.equal(proof.transactionId, response.headers['x-diloakpro-lab-id']);
    assert.equal(proof.responseProofHeaderIssued, true);
    assert.equal(proof.audit.direction.response, 'server-to-client');
    assert.equal(proof.audit.direction.request, 'client-to-server');
    assert.equal(proof.audit.requestJson.categories.email, 1);
    assert.equal(proof.audit.requestJson.categories.password, 1);
    for (const category of ['email','password','proxy','extension','fingerprint','cookie'])
      assert.ok(proof.audit.responseJson.categories[category] >= 1,
        'Missing response field category: ' + category);
    assert.equal(proof.audit.setCookieHeaderCount, 2);
    assert.equal(proof.audit.requestCookieHeaderPresent, true);
    assert.equal(proof.audit.syntheticLabCookiesEncrypted, 1);
    assert.equal(proof.audit.syntheticLabRequestCookiesEncrypted, 1);
    assert.equal(proof.audit.realCookieValuesCaptured, false);
    assert.ok(!JSON.stringify(proof).includes('access_token'));
    assert.ok(!JSON.stringify(proof).includes('FAKE-COOKIE'));
    assert.ok(!JSON.stringify(proof).includes('FAKE-TOKEN'));
    assert.ok(!JSON.stringify(proof).includes('ONLY-SYNTHETIC-COOKIE'));
    assert.ok(!JSON.stringify(proof).includes('TEST-PASSWORD-NOT-A-REAL-SECRET'));
    assert.ok(!JSON.stringify(proof).includes('DUMMY-RESPONSE-PASSWORD-ONLY'));
    const packed = fs.readFileSync(path.join(root, proof.payloadFile));
    assert.equal(packed.includes(fakeInput), false);
    assert.equal(packed.includes(fakeResponse), false);
    const decrypted = decryptFirstPartyLab(packed, passphrase);
    assert.deepEqual(decrypted.requestBody, fakeInput);
    assert.deepEqual(decrypted.responseBody, fakeResponse);
    assert.equal(decrypted.statusCode, 201);
    assert.equal(decrypted.syntheticOnlyHeaders.setCookie.length, 1);
    assert.match(decrypted.syntheticOnlyHeaders.setCookie[0],
      /DILOAKPRO_TEST_session=ONLY-SYNTHETIC-COOKIE/);
    assert.equal(decrypted.syntheticOnlyHeaders.requestCookie.length, 1);
    assert.equal(decrypted.syntheticOnlyHeaders.requestCookie[0],
      'DILOAKPRO_TEST_client=FAKE-CLIENT-COOKIE');
    assert.equal(JSON.stringify(decrypted).includes('SHOULD-NOT-APPEAR-IN-VAULT'), false);
    assert.equal(JSON.stringify(decrypted).includes('FAKE-COOKIE-NEVER-LOG'), false);
    assert.equal(JSON.stringify(decrypted).includes('FAKE-TOKEN-NEVER-LOG'), false);
    assert.throws(() => decryptFirstPartyLab(packed, 'INCORRECT-PASSWORD'),
      /auth|authenticate|Unsupported state/i);
    await exchange('/not-a-lab-route', fakeInput);
    assert.equal(recorder.proofs.length, 1, 'Non-lab traffic was captured');
    recorder.stop();
    await exchange('/__diloakpro_lab__/test', fakeInput);
    assert.equal(recorder.proofs.length, 1, 'Stopped recorder captured traffic');
    console.log('LAB_SERVER_REAL_REQUEST_AND_RESPONSE_BYTES=PASS');
    console.log('LAB_SERVER_PROOF_SHA256=PASS');
    console.log('LAB_SERVER_BROWSER_CORRELATION_HEADER=PASS');
    console.log('LAB_SERVER_AES256_GCM_ROUNDTRIP=PASS');
    console.log('LAB_SERVER_REJECTS_UNRELATED_TRAFFIC=PASS');
    console.log('LAB_SERVER_OMITS_HEADERS_AND_QUERY=PASS');
    console.log('LAB_SERVER_DIRECTIONAL_FIELD_AUDIT_WITHOUT_VALUES=PASS');
    console.log('LAB_SERVER_SYNTHETIC_COOKIES_ONLY_ENCRYPTED=PASS');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
  }
}

run().catch(err => { console.error(err); process.exitCode = 1; });

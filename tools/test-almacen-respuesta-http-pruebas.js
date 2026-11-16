'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { validateMockOrigin, archiveMockResponse } =
  require('./almacen-respuesta-http-pruebas.js');

test('preserves fake Set-Cookie headers and fake credentials/proxy JSON byte for byte', async () => {
  const rootFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'almacen-mock-http-'));
  try {
    const rawHeaderBytes = Buffer.from(
      'HTTP/1.1 200 OK\r\n' +
      'Set-Cookie: fake_session=DEMO_ONLY; Path=/; HttpOnly\r\n' +
      'Set-Cookie: test_other=123; SameSite=Lax\r\n' +
      'Content-Type: application/json\r\n' +
      '\r\n', 'utf8'
    );
    const bodyBytes = Buffer.from(
      '{"credential":"FAKE_PASSWORD_123","proxy":"127.0.0.1:9999","txt":"hola","token":"FAKE_TOKEN"}', 'utf8'
    );
    const originalHeaders = Buffer.from(rawHeaderBytes);
    const originalBody = Buffer.from(bodyBytes);
    const record = await archiveMockResponse({
      rootFolder, profileId: 'profile524', eventId: 'response01',
      responseUrl: 'http://127.0.0.1:38888/fixture?case=1',
      rawHeaderBytes, bodyBytes
    });
    assert.ok((await fs.readFile(record.headers.path)).equals(originalHeaders));
    assert.ok((await fs.readFile(record.body.path)).equals(originalBody));
    assert.ok(rawHeaderBytes.equals(originalHeaders));
    assert.ok(bodyBytes.equals(originalBody));
    assert.ok(record.directory.includes(path.join('profile524', 'respuestas-pruebas')));
    assert.equal(record.mockServerOrigin, 'http://127.0.0.1:38888');
    assert.equal(record.originalBytesUnchanged, true);
  } finally {
    await fs.rm(rootFolder, { recursive: true, force: true });
  }
});

test('raw binary bytes and profile boundaries are preserved', async () => {
  const rootFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'almacen-mock-binary-'));
  try {
    const bytes = Buffer.from([0, 255, 128, 0, 80, 75, 3, 4, 220]);
    const emptyHeaders = Buffer.alloc(0);
    const first = await archiveMockResponse({
      rootFolder, profileId: 'profileA', eventId: 'one', responseUrl: 'http://localhost:5500/binary',
      rawHeaderBytes: emptyHeaders, bodyBytes: bytes
    });
    const second = await archiveMockResponse({
      rootFolder, profileId: 'profileB', eventId: 'one', responseUrl: 'http://localhost:5500/binary',
      rawHeaderBytes: emptyHeaders, bodyBytes: bytes
    });
    assert.notEqual(first.directory, second.directory);
    assert.ok((await fs.readFile(first.body.path)).equals(bytes));
    assert.ok((await fs.readFile(second.body.path)).equals(bytes));
    await assert.rejects(archiveMockResponse({
      rootFolder, profileId: 'profileA', eventId: 'one', responseUrl: 'http://localhost:5500/binary',
      rawHeaderBytes: emptyHeaders, bodyBytes: bytes
    }), /EEXIST/);
    assert.ok((await fs.readFile(first.body.path)).equals(bytes));
  } finally {
    await fs.rm(rootFolder, { recursive: true, force: true });
  }
});

test('rejects third party servers, network credentials in URLs and arbitrary sources', async () => {
  for (const bad of [
    'https://example.com/api', 'http://example.com/api',
    'http://localhost.example.com', 'http://user:password@localhost:5500',
    'file:///etc/passwd', 'ftp://localhost/file', 'http://10.0.0.5/'
  ]) assert.throws(() => validateMockOrigin(bad), /mock HTTP servers/);
  assert.equal(validateMockOrigin('http://localhost:4000').hostname, 'localhost');
  assert.equal(validateMockOrigin('http://127.0.0.1:3000/path').hostname, '127.0.0.1');
});

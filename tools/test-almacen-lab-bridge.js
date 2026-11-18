'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const net = require('node:net');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createAlmacenLabBridge } = require('./almacen-lab-bridge.js');

function serveOnce(rawHeader, rawBody) {
  return new Promise((resolve, reject) => {
    const server = net.createServer(socket => {
      socket.once('data', () => {
        socket.end(Buffer.concat([rawHeader, rawBody]));
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}
function requestRaw(port) {
  return new Promise((resolve, reject) => {
    const pieces = [];
    const socket = net.connect(port, '127.0.0.1');
    socket.once('connect', () => socket.write('GET /lab HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n'));
    socket.on('data', chunk => pieces.push(chunk));
    socket.once('error', reject);
    socket.once('end', () => {
      const received = Buffer.concat(pieces);
      const sep = received.indexOf(Buffer.from('\r\n\r\n'));
      if (sep < 0) return reject(new Error('Invalid raw server fixture'));
      resolve({
        rawHeaderBytes: received.subarray(0, sep + 4),
        bodyBytes: received.subarray(sep + 4)
      });
    });
  });
}
test('real local TCP mock response is archived byte-for-byte to the bound profile only', async () => {
  const rootFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'almacen-bridge-net-'));
  const p1 = Object.freeze({ browserSession: 'A' });
  const p2 = Object.freeze({ browserSession: 'B' });
  const calls = [];
  const bridge = createAlmacenLabBridge({
    rootFolder,
    allowedProfiles: ['internal_524', 'internal_815'],
    shellApi: { async openPath(folder) { calls.push(folder); return ''; } }
  });
  bridge.registerSession(p1, 'internal_524');
  bridge.registerSession(p2, 'internal_815');

  const testCases = [
    {
      session: p1,
      headers: Buffer.from(
        'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n' +
        'Set-Cookie: fake_session=LOCAL_TEST_ONLY; Path=/; HttpOnly\r\n\r\n'
      ),
      body: Buffer.from('FAKE_CREDENTIAL=demo-123\r\nPROXY=127.0.0.1:9999\r\n')
    },
    {
      session: p2,
      headers: Buffer.from('HTTP/1.1 200 OK\r\nContent-Type: application/zip\r\n\r\n'),
      body: Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 255, 128, 1, 2, 3])
    }
  ];
  try {
    for (const fixture of testCases) {
      const { server, port } = await serveOnce(fixture.headers, fixture.body);
      let captured;
      try { captured = await requestRaw(port); }
      finally { await new Promise(resolve => server.close(resolve)); }
      assert.ok(captured.rawHeaderBytes.equals(fixture.headers));
      assert.ok(captured.bodyBytes.equals(fixture.body));
      const record = await bridge.recordResponse({
        sessionHandle: fixture.session,
        responseUrl: 'http://127.0.0.1:' + port + '/lab',
        ...captured
      });
      assert.ok((await fs.readFile(record.headers.path)).equals(fixture.headers));
      assert.ok((await fs.readFile(record.body.path)).equals(fixture.body));
    }
    const file = await bridge.recordDownloadedFile({
      sessionHandle: p1, originalName: 'archivo de prueba.txt',
      payload: Buffer.from([0x00, 0xff, 0x80, 0x0a])
    });
    assert.ok((await fs.readFile(file.file)).equals(Buffer.from([0, 255, 128, 10])));
    assert.equal((await bridge.openFolder(p1)).ok, true);
    assert.equal((await bridge.openFolder(p2)).ok, true);
    assert.deepEqual(calls, [path.join(rootFolder, 'internal_524'), path.join(rootFolder, 'internal_815')]);
    const inventory = await bridge.inventory(p1);
    assert.equal(inventory.profileId, 'internal_524');
    assert.ok(inventory.eventFolders >= 2);
    const a = (await fs.readdir(path.join(rootFolder, 'internal_524', 'respuestas-pruebas'))).length;
    const b = (await fs.readdir(path.join(rootFolder, 'internal_815', 'respuestas-pruebas'))).length;
    assert.equal(a, 1);
    assert.equal(b, 1);
  } finally {
    await fs.rm(rootFolder, { recursive: true, force: true });
  }
});

test('rejects unbound sessions, arbitrary profile IDs and non-local URLs', async () => {
  const rootFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'almacen-bridge-deny-'));
  try {
    const bridge = createAlmacenLabBridge({
      rootFolder, allowedProfiles: ['trusted_profile'], shellApi: { async openPath() { return ''; } }
    });
    const bound = {};
    bridge.registerSession(bound, 'trusted_profile');
    assert.throws(() => bridge.registerSession({}, 'other_profile'), /Unknown profile/);
    assert.throws(() => bridge.registerSession(bound, 'trusted_profile'), /already bound/);
    await assert.rejects(bridge.recordResponse({
      sessionHandle: {}, responseUrl: 'http://localhost:5555',
      rawHeaderBytes: Buffer.alloc(0), bodyBytes: Buffer.alloc(0)
    }), /trusted browser session/);
    await assert.rejects(bridge.recordResponse({
      sessionHandle: bound, responseUrl: 'https://example.com/private',
      rawHeaderBytes: Buffer.alloc(0), bodyBytes: Buffer.alloc(0)
    }), /local mock HTTP servers/);
    assert.deepEqual(await bridge.openFolder(bound),
      { ok: false, reason: 'DOWNLOAD_FOLDER_NOT_FOUND' });
  } finally {
    await fs.rm(rootFolder, { recursive: true, force: true });
  }
});

'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { validateAuthorizedUrl, fetchAuthorizedBytes, saveAuthorizedResponse } =
  require('./almacen-servidor-autorizado.js');

async function localServer(body, status = 200) {
  const observed = [];
  const server = http.createServer((req, res) => {
    observed.push({
      url: req.url,
      hasCookie: Object.hasOwn(req.headers, 'cookie'),
      hasAuthorization: Object.hasOwn(req.headers, 'authorization'),
      hasProxyAuth: Object.hasOwn(req.headers, 'proxy-authorization'),
      acceptEncoding: req.headers['accept-encoding']
    });
    res.writeHead(status, {
      'Content-Type': 'application/octet-stream',
      'Set-Cookie': 'fake=demo_only',
      'Content-Length': String(body.length)
    });
    res.end(body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    server, observed,
    url: 'http://127.0.0.1:' + server.address().port + '/fixture.bin'
  };
}

test('local fixture returns exactly the server bytes and does not transmit session credentials', async () => {
  const payload = Buffer.from([0, 255, 127, 80, 75, 3, 4, 0, 10]);
  const t = await localServer(payload);
  try {
    const response = await fetchAuthorizedBytes({ authorizedUrl: t.url });
    assert.ok(response.bodyBytes.equals(payload));
    assert.equal(response.bodyBytes.length, payload.length);
    assert.equal(t.observed.length, 1);
    assert.equal(t.observed[0].hasCookie, false);
    assert.equal(t.observed[0].hasAuthorization, false);
    assert.equal(t.observed[0].hasProxyAuth, false);
    assert.equal(t.observed[0].acceptEncoding, 'identity');
  } finally { await new Promise(resolve => t.server.close(resolve)); }
});

test('explicit GET body can be archived by trusted profile with original bytes unchanged', async () => {
  const payload = Buffer.from('Servidor de laboratorio autorizado\r\n{"estado":"OK"}\r\n');
  const t = await localServer(payload);
  const rootFolder = await fs.mkdtemp(path.join(os.tmpdir(),'almacen-endpoint-'));
  try {
    const result = await saveAuthorizedResponse({
      authorizedUrl:t.url,rootFolder,trustedProfileId:'test_profile_01',
      originalFileName:'respuesta.txt'
    });
    assert.equal(result.ok,true);
    assert.equal(result.profileId,'test_profile_01');
    assert.equal(result.byteLength,payload.length);
    const dirs=await fs.readdir(path.join(rootFolder,'test_profile_01','archivos'));
    assert.equal(dirs.length,1);
    assert.ok((await fs.readFile(path.join(rootFolder,'test_profile_01','archivos',dirs[0],'respuesta.txt'))).equals(payload));
  } finally {
    await new Promise(resolve => t.server.close(resolve));
    await fs.rm(rootFolder,{force:true,recursive:true});
  }
});

test('rejects remote plaintext, credentials in URL, redirects and unapproved path', async () => {
  for (const url of [
    'http://example.com/probe',
    'ftp://example.com/probe',
    'https://user:pass@example.com/probe',
    'https://example.com/probe?token=abc',
    'https://example.com/',
    'https://example.com/probe#secret'
  ]) assert.throws(()=>validateAuthorizedUrl(url));
  assert.equal(validateAuthorizedUrl('https://example.com/test-data').protocol,'https:');
  const t=await localServer(Buffer.from('mock'),302);
  try {
    await assert.rejects(fetchAuthorizedBytes({authorizedUrl:t.url}),/HTTP 302/);
    await assert.rejects(fetchAuthorizedBytes({authorizedUrl:t.url,requestedUrl:t.url+'/other'}),/not the authorized endpoint/);
    await assert.rejects(fetchAuthorizedBytes({authorizedUrl:t.url,maxBytes:64*1024*1024+1}),/maximum response size/);
  } finally { await new Promise(resolve => t.server.close(resolve)); }
});

test('never archives an oversized response', async () => {
  const t=await localServer(Buffer.alloc(1024,1));
  try {
    await assert.rejects(fetchAuthorizedBytes({authorizedUrl:t.url,maxBytes:50}),/larger than/);
  } finally { await new Promise(resolve => t.server.close(resolve)); }
});

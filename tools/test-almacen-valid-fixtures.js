'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { ZIP_SHA256, ZIP_BASE64, makeServerFixtures } = require('./almacen-fixtures-valid.js');

test('ZIP lab fixture opens with standard Python zipfile and passes CRC validation', () => {
  const zip = makeServerFixtures('profile_524').find(x=>x.originalName==='ejemplo-lab.zip').bodyBytes;
  assert.equal(crypto.createHash('sha256').update(zip).digest('hex'),ZIP_SHA256);
  assert.equal(zip.toString('base64'),ZIP_BASE64);
  const python = [
    'import base64, io, sys, zipfile',
    'data=base64.b64decode(sys.argv[1])',
    'with zipfile.ZipFile(io.BytesIO(data)) as z:',
    " assert z.testzip() is None, 'corrupt ZIP CRC'",
    " assert z.namelist() == ['LEEME.txt']",
    " assert b'No contiene datos reales' in z.read('LEEME.txt')"
  ].join('\n');
  const proc = spawnSync('python',['-c',python,ZIP_BASE64],{encoding:'utf8',maxBuffer:65536});
  assert.equal(proc.status,0,'ZIP rejected: '+proc.stderr);
});
test('every fake server response preserves its raw byte representation and content type',()=>{
  const items=makeServerFixtures('profile_524');
  assert.deepEqual(items.map(f=>f.originalName),
    ['datos-prueba.json','ejemplo-lab.txt','ejemplo-lab.zip','ejemplo-lab.bin']);
  for(const item of items){
    assert.ok(Buffer.isBuffer(item.bodyBytes));
    assert.ok(item.bodyBytes.length>0);
    assert.ok(item.contentType);
    assert.ok(item.path.startsWith('/'));
  }
  const json=items[0].bodyBytes;
  assert.ok(json.includes(Buffer.from('FAKE_CREDENTIAL_DEMO')));
  assert.ok(json.includes(Buffer.from('FAKE_COOKIE_DEMO')));
  assert.ok(json.includes(Buffer.from('127.0.0.1:9000')));
  assert.ok(items[0].extraHeaders.some(h=>h.startsWith('Set-Cookie: dicloak_lab=FAKE_')));
});

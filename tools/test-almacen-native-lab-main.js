'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { labOpen, senderIsNativeApp, HANDLER } = require('./almacen-native-lab-main.cjs');
const crypto=require('node:crypto');
const { makeServerFixtures, ZIP_SHA256, ZIP_BASE64 } = require('./almacen-fixtures-valid.js');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');

test('native Almacén lab stores valid JSON TXT ZIP and binary unchanged from localhost per profile', async () => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'dicloak-native-lab-'));
  const opened = [];
  const shellApi = { async openPath(value) { opened.push(value); return ''; } };
  try {
    const a = await labOpen({ profileId:'native_profile_524', rootFolder:base, shellApi });
    const b = await labOpen({ profileId:'native_profile_815', rootFolder:base, shellApi });
    assert.deepEqual([a.ok,b.ok],[true,true]);
    assert.deepEqual(opened,[
      path.join(base,'native_profile_524'),path.join(base,'native_profile_815')
    ]);

    for (const id of ['native_profile_524','native_profile_815']) {
      const root = path.join(base,id);
      const expected=makeServerFixtures(id);
      const folders=await fs.readdir(path.join(root,'respuestas-pruebas'));
      assert.equal(folders.length,expected.length,'one HTTP event per file');
      let sawFakeCookie=false;
      for(const item of expected) {
        const originals=await fs.readdir(path.join(root,'archivos'));
        const archives=[];
        for(const name of originals) {
          const itemPath=path.join(root,'archivos',name,item.originalName);
          try { archives.push(await fs.readFile(itemPath)); } catch(e) { if(e.code!=='ENOENT')throw e; }
        }
        assert.equal(archives.length,1,'one saved original '+item.originalName);
        assert.ok(archives[0].equals(item.bodyBytes),'all bytes match the mock server for '+item.originalName);
        if(item.originalName.endsWith('.json')) {
          const json=JSON.parse(archives[0].toString('utf8'));
          assert.equal(json.credencial,'FAKE_CREDENTIAL_DEMO');
          assert.equal(json.proxy,'127.0.0.1:9000');
          assert.equal(json.cookie_de_prueba,'FAKE_COOKIE_DEMO');
        }
        if(item.originalName.endsWith('.zip')) {
          assert.equal(archives[0].readUInt32LE(0),0x04034b50);
          assert.equal(archives[0].readUInt32LE(archives[0].length-22),0x06054b50);
          assert.equal(sha(archives[0]),ZIP_SHA256);
        }
      }
      const rawFolders=await Promise.all(folders.map(folder=>fs.readdir(path.join(root,'respuestas-pruebas',folder)).then(async x=>({
        headers: await fs.readFile(path.join(root,'respuestas-pruebas',folder,'headers.raw')),
        body: await fs.readFile(path.join(root,'respuestas-pruebas',folder,'body.raw'))
      }))));
      sawFakeCookie=rawFolders.some(f=>f.headers.includes(Buffer.from(
        'Set-Cookie: dicloak_lab=FAKE_COOKIE_DEMO')));
      assert.ok(sawFakeCookie,'server-sent fake cookie preserved in raw header bytes');
      for(const file of expected)assert.ok(rawFolders.some(r=>r.body.equals(file.bodyBytes)),
        'preserve original response body for '+file.originalName);
    }
    await labOpen({profileId:'native_profile_524',rootFolder:base,shellApi});
    assert.equal((await fs.readdir(path.join(base,'native_profile_524','respuestas-pruebas'))).length,4,
      'opening twice must not duplicate mock response files');
  } finally { await fs.rm(base,{recursive:true,force:true}); }
});

test('native entrypoint denies remote origins and non-main frames', () => {
  const sender = { getURL(){return 'file:///C:/Programs/DICloak/resources/app.asar/dist/index.html';} };
  const mainFrame = {};
  sender.mainFrame=mainFrame;
  const BrowserWindow={ getAllWindows(){return [{webContents:sender}]} };
  assert.equal(senderIsNativeApp({sender,senderFrame:mainFrame},BrowserWindow),true);
  assert.equal(senderIsNativeApp({sender,senderFrame:{}},BrowserWindow),false);
  sender.getURL=()=> 'https://example.com';
  assert.equal(senderIsNativeApp({sender,senderFrame:mainFrame},BrowserWindow),false);
  assert.equal(HANDLER,'almacen-lab:open');
});

test('native lab rejects invalid profile identifier before creating any folders', async () => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-native-deny-'));
  try {
    await assert.rejects(labOpen({profileId:'../other',rootFolder:base,
      shellApi:{async openPath(){return '';}}}),/Invalid internal profile identifier/);
    assert.deepEqual(await fs.readdir(base),[]);
  } finally { await fs.rm(base,{recursive:true,force:true}); }
});

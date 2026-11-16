'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { labOpen, senderIsNativeApp, HANDLER } = require('./almacen-native-lab-main.cjs');

test('native Almacén lab button captures fake local HTTP data and opens its profile directory', async () => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'dicloak-native-lab-'));
  const opened = [];
  const shellApi = { async openPath(value) { opened.push(value); return ''; } };
  try {
    const a = await labOpen({profileId:'native_profile_524',rootFolder:base,shellApi});
    const b = await labOpen({profileId:'native_profile_815',rootFolder:base,shellApi});
    assert.deepEqual([a.ok,b.ok], [true,true]);
    assert.deepEqual(opened, [path.join(base,'native_profile_524'),path.join(base,'native_profile_815')]);
    for (const id of ['native_profile_524','native_profile_815']) {
      const root = path.join(base,id);
      const folders = await fs.readdir(path.join(root,'respuestas-pruebas'));
      assert.equal(folders.length,1);
      const dir=path.join(root,'respuestas-pruebas',folders[0]);
      const body=await fs.readFile(path.join(dir,'body.raw'));
      const headers=await fs.readFile(path.join(dir,'headers.raw'));
      assert.ok(body.includes(Buffer.from('FAKE_CREDENTIAL_DEMO')));
      assert.ok(body.includes(Buffer.from('127.0.0.1:9000')));
      assert.ok(headers.includes(Buffer.from('Set-Cookie: dicloak_lab=FAKE_COOKIE_DEMO')));
      const files=await fs.readdir(path.join(root,'archivos'));
      assert.equal(files.length,2);
    }
    await labOpen({profileId:'native_profile_524',rootFolder:base,shellApi});
    assert.equal((await fs.readdir(path.join(base,'native_profile_524','respuestas-pruebas'))).length,1,
      'opening twice must not create duplicate response fixtures');
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

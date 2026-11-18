'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs=require('node:fs');
const script=fs.readFileSync(require('node:path').join(__dirname,'build-dicloak-native-almacen-030.js'),'utf8');

test('new Almacén column is explicitly checked in saved profile table config',()=>{
  assert.ok(script.includes('customFixedData:[...(Array.isArray(Fo.value)?Fo.value:[]).filter(e=>e.key!=="almacen_lab")'));
  assert.ok(script.includes('key:"almacen_lab",label:"Almacén",checked:!0'));
  assert.ok(script.includes("result.replace(FIELD_CONFIG_OLD,FIELD_CONFIG)"));
});

test('native saved-column ordering inserts Almacén after Estado and before Operación',()=>{
  const match=script.match(/const FIELD_SORT_NEW='([^']+)'/);
  assert.ok(match,'Explicit field sorter is required');
  assert.ok(match[1].includes('alm=l.find(e=>e.key==="almacen_lab")'));
  assert.ok(match[1].includes('...s?[s]:[],...alm?[alm]:[],...n?[n]:[]'));
  assert.ok(script.includes('TableFieldDialog-V53UVTu7.js'));
});

test('dedicated preload bridge replaces unsupported window.ipcRenderer direct access',()=>{
  assert.ok(script.includes('contextBridge.exposeInMainWorld("dicloakAlmacenLab"'));
  assert.ok(script.includes('ipcRenderer.invoke("almacen-lab:open"'));
  assert.ok(script.includes('window.dicloakAlmacenLab'));
  assert.ok(!script.includes('window.ipcRenderer'));
  assert.ok(script.includes("'dist-electron/preload/index.js'"));
});

test('other native security checks and locality restrictions remain enabled',()=>{
  const text=fs.readFileSync(require('node:path').join(__dirname,'almacen-native-lab-main.cjs'),'utf8');
  assert.ok(text.includes("app.isPackaged"));
  assert.ok(text.includes('senderIsNativeApp(event, BrowserWindow)'));
  assert.ok(text.includes('127.0.0.1'));
  assert.ok(script.includes('mandatoryUpdateCheckPreserved:true'));
  assert.ok(script.includes('assertSameMembers(original,rebuilt)'));
});

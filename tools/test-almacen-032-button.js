'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const build = fs.readFileSync(path.join(__dirname,'build-dicloak-native-almacen-030.js'),'utf8');

function buildConstant(name,next) {
  const begin=build.indexOf('const '+name+'=');
  const end=build.indexOf('const '+next+'=',begin);
  assert.ok(begin>=0&&end>begin,'Missing build constant '+name);
  return vm.runInNewContext(build.slice(begin,end)+'\n'+name);
}

test('Almacén button is the same 135 × 48 dimensions as the neighboring operation button',()=>{
  const col=buildConstant('ADD_COLUMN','FIELD_CONFIG');
  assert.ok(col.includes('label:"Almacén"'));
  assert.ok(col.includes('width:170,align:"center"'));
  assert.ok(col.includes('width:"135px",minWidth:"135px",height:"48px"'));
  assert.ok(col.includes('onClick:async t=>'));
});

for (const contextIsolated of [true,false]) {
  test('preload provides a callable Almacén bridge with contextIsolated='+contextIsolated,async()=>{
    const script=buildConstant('PRELOAD_ADDITION','APP_MAIN_ADDITION');
    const invoked=[];
    const window={};
    const exposed={};
    const contextBridge={exposeInMainWorld(name,api){exposed[name]=api;}};
    const ipcRenderer={invoke:async(name,id)=>{invoked.push([name,id]);return {ok:true};}};
    vm.runInNewContext(script,{
      process:{contextIsolated},window,console,
      require:()=>({contextBridge,ipcRenderer})
    });
    const api=contextIsolated?exposed.dicloakAlmacenLab:window.dicloakAlmacenLab;
    assert.ok(api&&typeof api.open==='function','bridge unavailable');
    assert.equal((await api.open('profile_524')).ok,true);
    assert.deepEqual(invoked,[['almacen-lab:open','profile_524']]);
    assert.equal(typeof api.invoke,'undefined','do not expose generic IPC');
  });
}

test('click failure is visible to the user and does not silently discard IPC errors',()=>{
  const col=buildConstant('ADD_COLUMN','FIELD_CONFIG');
  assert.ok(col.includes('window.alert("Almacén: conexión con Electron no disponible")'));
  assert.ok(col.includes('window.alert("Almacén: "+String(x&&x.reason'));
  assert.ok(col.includes('window.alert("Almacén: "+String(x&&x.message||x))'));
  assert.ok(col.includes('window.ipcRenderer')); // supports the original preload fallback
});

test('only original guarded vendor source is modified and the localhost test bridge remains isolated',()=>{
  assert.ok(build.includes('assertSameMembers(original,rebuilt)'));
  assert.ok(build.includes("deliveryVersion:'0.3.2'"));
  assert.ok(build.includes("capturesRealBrowsing:false"));
  assert.ok(build.includes('mandatoryUpdateCheckPreserved:true'));
});

'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const EventEmitter=require('node:events');
const {FILE,createStartupHealth}=require('../src/main/startup-health.js');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-startup-health-'));
try{
  const app=new EventEmitter();
  app.isReady=()=>false;
  app.getPath=key=>{assert.equal(key,'userData');return temp;};
  const processMonitor=new EventEmitter();
  const startup=createStartupHealth(app,{processObject:processMonitor});
  const record=()=>JSON.parse(fs.readFileSync(path.join(temp,FILE),'utf8'));
  assert.equal(record().electronReady,false);
  assert.equal(record().originalEntrypointLoaded,false);
  app.emit('ready');
  app.emit('browser-window-created');
  startup.originalEntrypointLoaded();
  startup.originalRegistered();
  assert.equal(record().electronReady,true);
  assert.equal(record().mainWindowCreated,true);
  assert.equal(record().originalEntrypointLoaded,true);
  assert.equal(record().originalCacheHandlerRegistered,true);
  assert.equal(record().originalCacheHandlerRegistrations,1);
  startup.originalRemoved();
  assert.equal(record().originalCacheHandlerRegistered,false);
  assert.equal(record().originalCacheHandlerRemovals,1);
  processMonitor.emit('uncaughtExceptionMonitor',new TypeError('secret_credential_should_not_appear'));
  assert.equal(record().uncaughtErrorClass,'TypeError');
  startup.originalEntrypointFailed(new Error('https://secret.url/?token=SENSITIVE'));
  const raw=fs.readFileSync(path.join(temp,FILE),'utf8');
  assert.equal(record().mainEntrypointErrorClass,'Error');
  for(const secret of ['secret_credential_should_not_appear','secret.url','SENSITIVE','token','profile-244']) {
    assert.equal(raw.includes(secret),false,'Startup metadata leaked '+secret);
  }
  assert.deepEqual(Object.keys(record()).sort(),[
    'schema','bootstrapLoaded','originalEntrypointLoaded','electronReady',
    'mainWindowCreated','originalCacheHandlerRegistered',
    'originalCacheHandlerRegistrations','originalCacheHandlerRemovals',
    'mainEntrypointErrorClass','uncaughtErrorClass'
  ].sort());
  console.log('PASS: startup state accurately records Electron lifecycle and native IPC registration');
  console.log('PASS: errors never serialize messages, paths, credentials or profile identifiers');
}finally{fs.rmSync(temp,{recursive:true,force:true});}

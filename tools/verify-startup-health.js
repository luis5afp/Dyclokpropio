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
  const simulated = new Error('SENSITIVE_TOKEN_DO_NOT_LEAK');
  simulated.stack = 'Error: sensitive error message\n    at CL (C:\\Private\\resources\\app.asar\\dist-electron\\main-CuCOh59n.js:1:5848339)';
  processMonitor.emit('uncaughtExceptionMonitor',simulated);
  assert.equal(record().uncaughtSource,'protected-bundle');
  assert.equal(record().uncaughtSourceColumn,5848339);
  const synthetic = Object.assign(new Error('fake password'), {code:'MODULE_NOT_FOUND',stack:'Error: secret at C:\\Users\\PRIVATE\\dist-electron\\main-CuCOh59n.js:1:5885666'});
  processMonitor.emit('uncaughtExceptionMonitor',synthetic);
  assert.equal(record().uncaughtSource,'protected-bundle');
  assert.equal(record().uncaughtSourceColumn,5885666);
  assert.equal(record().uncaughtErrorCode,'MODULE_NOT_FOUND');
  // Check a known installation file is categorized, not stored as a path.
  const artifactError=Object.assign(new Error('private path must not escape'), {
    code:'ENOENT', syscall:'open',
    path:path.join(temp,'resources','vendor','ffmpeg','bin','ffmpeg.exe')
  });
  const app2=new EventEmitter();
  app2.getPath=key=>temp;
  const emit2=new EventEmitter();
  const observer=createStartupHealth(app2,{processObject:Object.assign(emit2,{
    resourcesPath:path.join(temp,'resources'),execPath:path.join(temp,'Dyclokpropio.exe')
  })});
  emit2.emit('uncaughtExceptionMonitor',artifactError);
  assert.equal(record().uncaughtFileArea,'resources');
  assert.equal(record().uncaughtFileKind,'.exe');
  assert.equal(record().uncaughtKnownBasename,'ffmpeg.exe');
  assert.equal(record().uncaughtSyscall,'open');
  startup.originalEntrypointFailed(new Error('https://secret.url/?token=SENSITIVE'));
  const raw=fs.readFileSync(path.join(temp,FILE),'utf8');
  assert.equal(record().mainEntrypointErrorClass,'Error');
  for(const secret of ['secret_credential_should_not_appear','secret.url','SENSITIVE','token','profile-244','Private','PRIVATE']) {
    assert.equal(raw.includes(secret),false,'Startup metadata leaked '+secret);
  }
  assert.deepEqual(Object.keys(record()).sort(),[
    'schema','bootstrapLoaded','originalEntrypointLoaded','electronReady',
    'mainWindowCreated','originalCacheHandlerRegistered',
    'originalCacheHandlerRegistrations','originalCacheHandlerRemovals',
    'mainEntrypointErrorClass','uncaughtErrorClass',
    'uncaughtFileArea','uncaughtFileKind','uncaughtKnownBasename','uncaughtSyscall',
    'uncaughtErrorCode','uncaughtSource','uncaughtSourceColumn'
  ].sort());
  console.log('PASS: startup state accurately records Electron lifecycle and native IPC registration');
  console.log('PASS: errors never serialize messages, paths, credentials or profile identifiers');
}finally{fs.rmSync(temp,{recursive:true,force:true});}

'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {EventEmitter}=require('node:events');
const {createDiagnosticArchive}=require('./almacen-diagnostic-archive.cjs');
const {createNativeDiagnosticController}=require('./almacen-native-integrated-diagnostic.cjs');
const {startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');

const sleep=ms=>new Promise(done=>setTimeout(done,ms));
test('Almacen saves JSON+TXT automatically without opening panel, and restores history after restart',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-auto-almacen-'));
 const archive=createDiagnosticArchive({rootDir:path.join(root,'Almacen','Diagnosticos')});
 const id='profile_803';
 const secret='SECRET_PASSWORD_TOKEN_2FA_COOKIE';
 const controller=createNativeDiagnosticController({
   archive,startObserver:()=>()=>{},graceMs:20,maxMs:300,
   createWindow:async()=>{
     const win=new EventEmitter();win.focus=()=>{};win.close=()=>win.emit('closed');
     return win;
   }
 });
 try{
   controller.note(id,'open_requested');
   controller.note(id,'step_start','FETCH_ENV_INFO');
   controller.note(id,'step_complete','FETCH_ENV_INFO');
   controller.note(id,'step_start','PROXY_CHECK_RESULT');
   controller.note(id,'step_complete','PROXY_CHECK_RESULT');
   controller.note(id,'step_start','COOKIE_ENCRYPT_PLAN');
   controller.note(id,'step_complete','COOKIE_ENCRYPT_PLAN');
   controller.note(id,'step_start','OPEN_ENV');
   controller.note(id,'step_complete','OPEN_ENV');
   await sleep(80);
   assert.equal(archive.list(id).length,1);
   const item=archive.list(id)[0];
   assert.equal(item.finishReason,'completed');
   const json=archive.read(id,item.id,'json');
   const txt=archive.read(id,item.id,'txt');
   const report=JSON.parse(json);
   assert.equal(report.savedAutomatically,true);
   assert.equal(report.audit.timeline.coverageStartedBeforeOpen,true);
   assert.equal(report.audit.verification.cookiesApplied,'not_verified');
   assert.match(txt,/Captura|CAPTURA/);
   assert.ok(!json.includes(id));
   assert.ok(!txt.includes(id));
   assert.ok(!json.includes(secret));
   assert.ok(!txt.includes(secret));
   assert.ok(fs.existsSync(path.join(root,'Almacen','Diagnosticos','.archive-key')));
   // A fresh controller/process with the persisted archive key can read history.
   const restarted=createDiagnosticArchive({rootDir:archive.rootDir});
   assert.equal(restarted.list(id).length,1);
   assert.equal(restarted.list('profile_561').length,0);
   assert.throws(()=>restarted.read('profile_561',item.id,'json'),/ENOENT/);
   assert.throws(()=>restarted.read(id,'../../Windows','json'),/ARCHIVE_ENTRY_INVALID/);
   const panel=await startDiagnosticPanel({observeOnOpen:false,archive:restarted,profileId:id});
   try{
     const history=await fetch(panel.url+'history').then(r=>r.json());
     assert.equal(history.enabled,true);
     assert.equal(history.entries.length,1);
     assert.equal(history.entries[0].id,item.id);
     const archived=await fetch(panel.url+'history/'+item.id+'/json');
     assert.equal(archived.status,200);
     const stored=await archived.json();
     assert.equal(stored.savedAutomatically,true);
     const archivedTxt=await fetch(panel.url+'history/'+item.id+'/txt');
     assert.equal(archivedTxt.status,200);
     assert.match(await archivedTxt.text(),/Auditoría de comunicación/);
     assert.equal((await fetch(panel.url+'history/../../bad/json')).status,404);
   }finally{await panel.stop();}
 }finally{controller.shutdown();fs.rmSync(root,{recursive:true,force:true});}
});

test('Almacen archive strips unknown fields and never stores raw cookie/credential fields',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-privacy-'));
 const archive=createDiagnosticArchive({rootDir:root});
 try{
   const secret='PRIVATE_VALUE_CANNOT_PERSIST';
   const result=archive.save('profile_878',[
     {source:'programa',event:'operation_open_requested',
       password:secret,rawBody:secret,token:secret,cookie:secret},
     {source:'programa',event:'native_http_request',
       requestId:'12345678-1234-4234-9234-123456789abc',
       method:'GET',routeTemplate:'/gin/v1/env/:id',
       authorization:secret,proxyPassword:secret},
     {source:'programa',event:'capture_finished',finishReason:'completed',
       cookie:secret}
   ]);
   const json=archive.read('profile_878',result.id,'json');
   const txt=archive.read('profile_878',result.id,'txt');
   assert.ok(!json.includes(secret)&&!txt.includes(secret));
   assert.equal(JSON.parse(json).events[0].password,undefined);
   assert.equal(JSON.parse(json).events[1].authorization,undefined);
   assert.equal(archive.list('profile_878').length,1);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('automatic history failures do not interrupt the browser opening',async()=>{
 const controller=createNativeDiagnosticController({
   archive:{save(){throw Error('DISK_FULL')}},
   startObserver:()=>()=>{},graceMs:10,maxMs:250,
   createWindow:async()=>{const win=new EventEmitter();win.close=()=>win.emit('closed');return win;}
 });
 try{
   const answer=controller.note('profile_871','open_requested');
   assert.equal(answer.captureStarted,true);
   controller.note('profile_871','step_start','OPEN_ENV');
   controller.note('profile_871','step_complete','OPEN_ENV');
   await sleep(35);
   assert.equal(controller.snapshot('profile_871').at(-1).event,'archive_failed');
 }finally{controller.shutdown();}
});

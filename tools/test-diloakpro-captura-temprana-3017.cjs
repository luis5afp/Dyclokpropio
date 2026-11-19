'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {EventEmitter}=require('node:events');
const {createOpeningCaptureCoordinator}=require('./almacen-captura-temprana.cjs');
const {createNativeDiagnosticController}=require('./almacen-native-integrated-diagnostic.cjs');
const {startDiagnosticPanel,validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');

function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
const REQUEST={kind:'http',phase:'request',action:'POST',scope:'remote',
  routeTemplate:'/gin/v2/user/:id/upload',
  requestId:'12345678-1234-1234-1234-123456789abc',
  requestBytesDeclared:42,url:'https://private.example/?token=SECRET',
  body:'SENSITIVE_COOKIE',authorization:'Bearer SECRET'};

test('observer starts before vendor open and its bounded events survive a late diagnostic panel',async()=>{
  const calls=[],windows=[];
  let observe=()=>{},stopped=0,armed=0;
  const startObserver=({emit})=>{armed++;observe=emit;return ()=>{stopped++;};};
  const controller=createNativeDiagnosticController({
    startObserver,graceMs:15,maxMs:300,
    createWindow:async options=>{
      const window=new EventEmitter();
      window.close=()=>window.emit('closed');
      window.focus=()=>{};
      windows.push(window);
      return window;
    }
  });
  const row='profile_SENSITIVE_SECRET';
  const result=controller.note(row,'open_requested');
  calls.push('vendor_open');
  assert.equal(result.captureStarted,true);
  assert.equal(armed,1,'the observer must start before vendor open');
  assert.equal(calls[0],'vendor_open');
  assert.equal(controller.snapshot(row)[0].event,'capture_started');
  assert.equal(controller.snapshot(row)[1].event,'operation_open_requested');
  assert.ok(Date.parse(controller.snapshot(row)[0].at)<=
    Date.parse(controller.snapshot(row)[1].at),'capture timestamp must precede opening');

  observe(REQUEST);
  controller.note(row,'step_start','FETCH_ENV_INFO');
  controller.note(row,'step_complete','FETCH_ENV_INFO');
  controller.note(row,'step_start','OPEN_ENV');
  controller.note(row,'step_complete','OPEN_ENV');
  await sleep(45);
  assert.equal(stopped,1,'must automatically stop after grace period');
  const shown=await controller.show(row,null);
  assert.equal(shown.ok,true,'panel must open after the capture finished');
  const history=controller.snapshot(row);
  const network=history.find(e=>e.event==='native_http_request');
  assert.equal(network.requestBytesDeclared,42);
  assert.equal(network.captureRelation,'temporal');
  assert.equal(history.at(-1).event,'capture_finished');
  assert.ok(Date.parse(history.at(-1).at)>=Date.parse(history[1].at),
    'capture end timestamp must be the actual finish, not late panel playback');
  assert.ok(!JSON.stringify(history).includes(row));
  for(const privateValue of ['SECRET','SENSITIVE_COOKIE','private.example','Bearer']){
    assert.ok(!JSON.stringify(history).includes(privateValue),'private data leaked: '+privateValue);
  }
  windows[0].close();
  controller.shutdown();
});

test('two simultaneous profile opens are explicitly ambiguous and share only the same observer',()=>{
  const logs=new Map();let emitNative=()=>{},started=0,stopped=0;
  const capture=createOpeningCaptureCoordinator({
    emitToProfile:(profile,row)=>{if(!logs.has(profile))logs.set(profile,[]);logs.get(profile).push(row);},
    startObserver:({emit})=>{started++;emitNative=emit;return ()=>{stopped++;};},
    graceMs:50,maxMs:200
  });
  const one=capture.arm('private-profile-one');
  const two=capture.arm('private-profile-two');
  assert.equal(started,1,'a second profile must not patch Node http.request again');
  assert.equal(one.captureStarted,true);
  assert.equal(two.captureStarted,true);
  emitNative(REQUEST);
  for(const id of ['private-profile-one','private-profile-two']){
    const record=logs.get(id).find(e=>e.event==='native_http_request');
    assert.equal(record.captureRelation,'ambiguous');
    assert.equal(record.routeTemplate,'/gin/v2/user/:id/upload');
    assert.ok(!JSON.stringify(logs.get(id)).includes(id));
  }
  capture.finish('private-profile-one','failed');
  emitNative({...REQUEST,requestId:'23456789-1234-1234-1234-123456789abc'});
  assert.equal(logs.get('private-profile-two').at(-1).captureRelation,'temporal');
  capture.finish('private-profile-two','completed');
  assert.equal(stopped,1);
  assert.equal(capture.activeCount(),0);
});

test('early capture checks never report Chromium identity, proxy auth or cookies as verified',async()=>{
  const p=await startDiagnosticPanel({observeOnOpen:false});
  try{
    const captureId='12345678-1234-4234-9234-123456789abc';
    const safe=ev=>p.emit({source:'programa',...ev});
    safe({event:'capture_started',captureId,captureRelation:'temporal'});
    safe({event:'operation_open_requested'});
    safe({event:'native_http_request',captureId,captureRelation:'temporal',
      method:'GET',routeTemplate:'/gin/v2/user/:id'});
    safe({event:'operation_step_completed',stage:'stage_proxy_check_result'});
    safe({event:'operation_step_completed',stage:'stage_cookie_encrypt_plan'});
    safe({event:'operation_step_completed',stage:'stage_open_env'});
    safe({event:'native_http_request',captureId,captureRelation:'temporal',
      method:'HEAD',routeTemplate:'/gin/:id/:id'});
    safe({event:'capture_finished',captureId,finishReason:'completed'});
    const summary=p.getState().checks;
    assert.equal(summary.capture.status,'finished');
    assert.equal(summary.capture.startedBeforeOpen,true);
    assert.equal(summary.capture.openStageCompleted,true);
    assert.equal(summary.capture.requestsBeforeOpenStageCompleted,1);
    assert.equal(summary.capture.trafficAttribution,'temporal_only_not_chromium_verified');
    assert.equal(summary.cookiesRestored,'not_verified');
    assert.equal(summary.credentialsRestored,'not_verified');
    assert.equal(summary.proxyExitAndAuthentication,'not_verified');
    assert.equal(summary.browserSessionLinkedToRow,'not_verified');
    assert.throws(()=>validateDiagnostic({source:'programa',event:'capture_started',
      captureId:'raw-real-profile-123'}),/INVALID_CAPTURE_ID/);
    assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_request',
      captureRelation:'verified'}),/INVALID_CAPTURE_RELATION/);
  }finally{await p.stop();}
});

test('original vendor operation is preceded by a bounded synchronous bridge call',()=>{
  const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-3015.js'),'utf8');
  assert.ok(builder.includes('noteOpen:id=>ipcRenderer.sendSync('));
  assert.ok(builder.includes('window.dicloakAlmacenLab?.noteOpen?.(String(e.row.id??""))'));
  assert.ok(builder.includes('return oi(e.row)'));
  assert.ok(builder.includes("'almacen-captura-temprana.cjs'"));
  assert.ok(builder.includes("deliveryVersion:'30.0.23'"));
});

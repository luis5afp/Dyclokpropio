'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const {EventEmitter}=require('node:events');
const {startUndiciTrace}=require('./almacen-undici-observador.cjs');
const {startCapture}=require('./almacen-observador-integrado.cjs');
const {createNativeDiagnosticController}=require('./almacen-native-integrated-diagnostic.cjs');
const {startDiagnosticPanel,mapNativeEvent,validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');
const {makeOpeningAudit}=require('./almacen-diagnostic-report.cjs');

test('live Node fetch gives request/response/finish metadata without ever keeping secrets',async()=>{
  const secret='PRIVATE_DEMO_NO_EXFILTRATION_2026';
  const server=http.createServer((req,res)=>{
    res.setHeader('Set-Cookie','SESSION='+secret+'; Secure; HttpOnly');
    res.end(JSON.stringify({password:secret,cookie:'SESSION='+secret}));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const rows=[];
  const stop=startUndiciTrace(row=>rows.push(row));
  try{
    const response=await fetch('http://127.0.0.1:'+server.address().port+
      '/gin/v1/env/'+secret+'?token='+secret,{method:'GET'});
    assert.equal(response.status,200);
    await response.text();
    await new Promise(resolve=>setTimeout(resolve,15));
    const request=rows.find(e=>e.kind==='fetch'&&e.phase==='request');
    const received=rows.find(e=>e.kind==='fetch'&&e.phase==='response');
    const completed=rows.find(e=>e.kind==='fetch'&&e.phase==='complete');
    assert.ok(request&&received&&completed,'expected fetch lifecycle');
    assert.equal(received.requestId,request.requestId);
    assert.equal(completed.requestId,request.requestId);
    assert.equal(request.routeTemplate,'/gin/v1/env/:id');
    assert.equal(received.status,200);
    assert.ok(!JSON.stringify(rows).includes(secret),'no raw URI or HTTP content in capture');
    const panel=await startDiagnosticPanel({observeOnOpen:false});
    try{
      for(const e of rows){const mapped=mapNativeEvent(e);if(mapped)panel.emit(mapped);}
      const state=panel.getState();
      const net=state.checks.networkMetadata;
      assert.equal(net.fetchRequests,1);
      assert.equal(net.fetchResponses,1);
      assert.equal(net.fetchCompletions,1);
      const audit=makeOpeningAudit(state);
      assert.equal(audit.summary.fetchRequests,1);
      assert.equal(audit.summary.fetchResponses,1);
      assert.equal(audit.coverage.fullTrafficCapture,false);
      assert.equal(audit.coverage.chromiumNetwork,'not_captured_by_http_observer');
      assert.ok(!JSON.stringify(state).includes(secret));
    }finally{await panel.stop();}
  }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

test('network trace does not automatically create Almacen or export files',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-no-archive-'));
  const windows=[];
  let raw=()=>{};
  const controller=createNativeDiagnosticController({
    getLabRoot:()=>dir,
    startObserver:({emit})=>{raw=emit;return ()=>{};},
    graceMs:12,maxMs:200,
    createWindow:async()=>{const win=new EventEmitter();win.focus=()=>{};win.close=()=>win.emit('closed');windows.push(win);return win;}
  });
  try{
    controller.note('profile_private_id','open_requested');
    raw({kind:'http',phase:'request',action:'GET',scope:'remote',
      routeTemplate:'/gin/v1/env/:id',
      requestId:'12345678-1234-4234-9234-123456789abc',
      authorization:'Bearer PRIVATE_SECRET'});
    controller.note('profile_private_id','step_start','OPEN_ENV');
    controller.note('profile_private_id','step_complete','OPEN_ENV');
    await new Promise(resolve=>setTimeout(resolve,35));
    assert.equal(controller.snapshot('profile_private_id').at(-1).event,'capture_finished');
    assert.ok(!JSON.stringify(controller.snapshot('profile_private_id')).includes('PRIVATE_SECRET'));
    assert.deepEqual(fs.readdirSync(dir),[],'controller never created an archive directory');
    await controller.show('profile_private_id',null);
    windows[0].close();
    assert.deepEqual(fs.readdirSync(dir),[],'opening diagnostic UI does not write files');
  }finally{controller.shutdown();fs.rmSync(dir,{recursive:true,force:true});}
});

test('HTTP TCP/TLS schema only admits safe metadata and no raw host or certificates',()=>{
  const reqId='12345678-1234-4234-9234-123456789abc';
  const safe=validateDiagnostic(mapNativeEvent({kind:'http',phase:'tls',action:'GET',
    routeTemplate:'/gin/v1/env/:id',scope:'remote',requestId:reqId,
    tlsAuthorized:true,tlsProtocol:'TLSv1.3',password:'PRIVATE_VALUE',
    certificate:{subject:'private.example'}}));
  assert.equal(safe.event,'native_http_tls');
  assert.equal(safe.tlsAuthorized,true);
  assert.equal(safe.tlsProtocol,'TLSv1.3');
  assert.ok(!JSON.stringify(safe).includes('PRIVATE_VALUE'));
  assert.ok(!JSON.stringify(safe).includes('private.example'));
  assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_tls',
    tlsProtocol:'UNKNOWN'}),/INVALID_TLS_PROTOCOL/);
  assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_socket',
    socketReused:'false'}),/INVALID_DIAGNOSTIC_FLAG/);
});

test('no auto-archive code or archive module in packaged diagnostic; panel script is valid',()=>{
  const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-3015.js'),'utf8');
  const main=fs.readFileSync(path.join(__dirname,'almacen-native-integrated-diagnostic.cjs'),'utf8');
  const panel=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
  assert.ok(builder.includes("'almacen-undici-observador.cjs'"));
  assert.ok(!builder.includes("'almacen-diagnostic-archive.cjs'"));
  assert.ok(!main.includes('createDiagnosticArchive('));
  assert.ok(!panel.includes('loadHistory()'));
  assert.ok(panel.includes('id="cookie-path"'));
  assert.ok(panel.includes('Sin archivo automático'));
  const script=panel.split('<script nonce="PANEL_CSP_NONCE">')[1]?.split('</script>')[0];
  assert.ok(script);
  new vm.Script(script);
});

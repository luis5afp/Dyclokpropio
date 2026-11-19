'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {startDiagnosticPanel,validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');
const {parseWindowsSample,startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');

test('diloakPRO shows status milestones without claiming credentials or proxy login were restored',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-checks-'));
  const panel=await startDiagnosticPanel({exportDirectory:out});
  try {
    for(const stage of ['stage_open_env','stage_proxy_check_result',
      'stage_cookie_encrypt_plan','stage_expand_check','stage_params_merge']){
      panel.emit({source:'programa',event:'operation_step_completed',stage});
    }
    panel.emit({source:'programa',event:'native_process_seen',pid:4102,ppid:999,
      processClass:'browser',commandLine:'SECRET_CREDENTIAL'});
    panel.emit({source:'programa',event:'native_http_request',method:'POST',
      scope:'remote',routeTemplate:'/gin/v2/user/:id/upload',
      requestId:'11111111-2222-3333-4444-555555555555',
      requestBytesDeclared:123,authorization:'SUPERSECRET'});
    const state=panel.getState();
    assert.equal(state.checks.profileOpenStageCompleted,true);
    assert.equal(state.checks.browserProcessObserved,true);
    assert.equal(state.checks.proxyCheckStageCompleted,true);
    assert.equal(state.checks.cookiePlanStageCompleted,true);
    assert.equal(state.checks.extensionsCheckStageCompleted,true);
    assert.equal(state.checks.fingerprintParamsStageCompleted,true);
    assert.equal(state.checks.credentialsRestored,'not_verified');
    assert.equal(state.checks.cookiesRestored,'not_verified');
    assert.equal(state.checks.proxyExitAndAuthentication,'not_verified');
    assert.equal(state.checks.browserSessionLinkedToRow,'not_verified');
    assert.equal(state.checks.networkMetadata.nodeRequests,1);
    assert.equal(state.checks.networkMetadata.uploadRouteRequests,1);
    assert.equal(state.checks.networkMetadata.declaredOutboundBytes,123);
    const text=JSON.stringify(state);
    assert.ok(!text.includes('SUPERSECRET')&&!text.includes('SECRET_CREDENTIAL'));
    assert.equal(validateDiagnostic({source:'programa',event:'native_http_request',
      requestBytesDeclared:123}).requestBytesDeclared,123);
    assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_request',
      requestBytesDeclared:2**35}),/INVALID_DIAGNOSTIC_SIZE/);
  }finally{await panel.stop();fs.rmSync(out,{force:true,recursive:true});}
});

test('sampler-generated PowerShell processes and their sockets are excluded',()=>{
  const got=[];
  parseWindowsSample({
    processes:[{ProcessId:7,ParentProcessId:1,Name:'DICloak.exe'},
      {ProcessId:8,ParentProcessId:7,Name:'powershell.exe'},
      {ProcessId:9,ParentProcessId:8,Name:'conhost.exe'},
      {ProcessId:10,ParentProcessId:7,Name:'chrome.exe'}],
    tcp:[{OwningProcess:8,RemoteAddress:'8.8.8.8',RemotePort:443},
      {OwningProcess:10,RemoteAddress:'192.0.2.7',RemotePort:443}],udp:[]},
    e=>got.push(e),new Set(),new Set([8]));
  assert.deepEqual(got.filter(e=>e.kind==='process').map(e=>e.pid),[7,10]);
  assert.deepEqual(got.filter(e=>e.kind==='connection').map(e=>e.pid),[10]);
});

test('outbound Node metadata tracks only declared length, not request bodies or headers',async()=>{
  const out=[],secret='VERY_SECRET_PASSWORD';
  const server=http.createServer((req,res)=>{req.resume();req.once('end',()=>{res.writeHead(204);res.end();});});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const stop=startNodeHttpTrace(e=>out.push(e));
  try {
    await new Promise((resolve,reject)=>{
      const req=http.request({hostname:'127.0.0.1',port:server.address().port,
        method:'POST',path:'/gin/v2/user/SECRET/upload?token='+secret,
        headers:{'Content-Length':String(Buffer.byteLength(secret)),Authorization:'Bearer '+secret}},
        res=>{res.resume();res.once('end',resolve)});
      req.once('error',reject);req.end(secret);
    });
    assert.equal(out[0].requestBytesDeclared,Buffer.byteLength(secret));
    assert.equal(out[0].routeTemplate,'/gin/v2/user/:id/upload');
    assert.equal(out.find(e=>e.phase==='response')?.status,204);
    assert.equal(JSON.stringify(out).includes(secret),false);
  }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

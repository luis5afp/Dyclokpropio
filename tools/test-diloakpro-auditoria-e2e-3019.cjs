'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {makeOpeningAudit,renderAuditTXT}=require('./almacen-diagnostic-report.cjs');
const {startDiagnosticPanel,validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');
const {startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const UUID='12345678-1234-4234-9234-123456789abc';

test('opening audit correlates outcomes and labels proxy, cookies, identity and 2FA as unverified',()=>{
 const events=[
 {source:'programa',event:'capture_started',at:'2026-11-18T12:00:00.000Z',captureId:UUID},
 {source:'programa',event:'operation_open_requested',at:'2026-11-18T12:00:00.010Z'},
 {source:'programa',event:'operation_step_completed',stage:'stage_cookie_encrypt_plan',at:'2026-11-18T12:00:01.000Z'},
 {source:'programa',event:'operation_step_completed',stage:'stage_proxy_check_result',at:'2026-11-18T12:00:01.100Z'},
 {source:'programa',event:'native_http_request',requestId:UUID,at:'2026-11-18T12:00:02.000Z',method:'POST',routeTemplate:'/gin/v2/user/:id/upload',captureRelation:'temporal'},
 {source:'programa',event:'native_http_response',requestId:UUID,at:'2026-11-18T12:00:02.500Z',status:200,elapsedMs:500},
 {source:'programa',event:'native_http_transfer',requestId:UUID,at:'2026-11-18T12:00:02.600Z',transferState:'response_end',outboundBodyBytesQueued:5,inboundBodyBytesObserved:10,requestCookiePresent:true},
 {source:'programa',event:'native_http_request',requestId:'87654321-1234-4234-9234-123456789abc',at:'2026-11-18T12:00:03.000Z'},
 {source:'programa',event:'native_process_seen',processClass:'browser',pid:991,at:'2026-11-18T12:00:04.000Z'},
 {source:'programa',event:'operation_step_completed',stage:'stage_open_env',at:'2026-11-18T12:00:04.000Z'},
 {source:'programa',event:'capture_finished',at:'2026-11-18T12:00:19.000Z',finishReason:'completed',captureId:UUID}
 ];
 const audit=makeOpeningAudit({events});
 assert.equal(audit.timeline.coverageStartedBeforeOpen,true);
 assert.equal(audit.timeline.captureFinishedAt,'2026-11-18T12:00:19.000Z');
 assert.equal(audit.summary.requests,2);
 assert.equal(audit.summary.responses,1);
 assert.equal(audit.summary.requestsWithoutObservedResponse,1);
 assert.equal(audit.summary.browserProcesses,1);
 assert.equal(audit.stages.proxy.status,'stage_completed');
 assert.equal(audit.stages.cookiePlan.status,'stage_completed');
 assert.equal(audit.stages.browserOpen.status,'stage_completed');
 assert.equal(audit.verification.cookiesApplied,'not_verified');
 assert.equal(audit.verification.credentialsApplied,'not_verified');
 assert.equal(audit.verification.proxyAuthenticated,'not_verified');
 assert.equal(audit.verification.twoFactorCompleted,'not_verified');
 assert.equal(audit.coverage.fullTrafficCapture,false);
 const row=audit.http.find(e=>e.requestId===UUID);
 assert.equal(row.responseMs,500);
 assert.equal(row.status,200);
 assert.equal(row.outboundBodyBytesQueued,5);
 assert.equal(row.inboundBodyBytesObserved,10);
 const txt=renderAuditTXT({audit,delivery:'RC6',exportedAt:'2026-11-18T12:00:20.000Z'});
 assert.match(txt,/Solicitudes sin respuesta registrada: 1/);
 assert.match(txt,/cookies.*no verificada/i);
 assert.ok(!txt.includes('row-secret'));
});

test('panel saves synchronized JSON and TXT to downloads, not credentials or cookies',async()=>{
 const downloads=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-rc6-'));
 let panel;
 try{
  panel=await startDiagnosticPanel({exportDirectory:downloads,observeOnOpen:false});
  const privateSecret='CANARY_REAL_SECRET_MUST_NOT_PERSIST';
  panel.emit({source:'programa',event:'operation_open_requested',password:privateSecret});
  panel.emit({source:'programa',event:'operation_step_completed',stage:'stage_proxy_check_result',
    proxyPassword:privateSecret});
  panel.emit({source:'programa',event:'native_http_request',
    requestId:UUID,method:'POST',routeTemplate:'/gin/:id/:id',cookie:privateSecret,
    responseBody:privateSecret});
  panel.emit({source:'programa',event:'native_http_response',requestId:UUID,status:200,
    authorization:'Bearer '+privateSecret});
  const origin=new URL(panel.url).origin;
  const noOrigin=await fetch(panel.url+'save-json',{method:'POST'});
  assert.equal(noOrigin.status,403);
  const failed=await fetch(panel.url+'save-json',{method:'POST',headers:{Origin:'https://evil.example'}});
  assert.equal(failed.status,403);
  const response=await fetch(panel.url+'save-json',{method:'POST',headers:{Origin:origin}});
  assert.equal(response.status,200);
  const result=await response.json();
  assert.equal(result.ok,true);
  assert.match(result.fileName,/^diloakPRO-Diagnostico-[\w-]+\.json$/);
  assert.match(result.txtFileName,/^diloakPRO-Diagnostico-[\w-]+\.txt$/);
  const json=fs.readFileSync(path.join(downloads,result.fileName),'utf8');
  const txt=fs.readFileSync(path.join(downloads,result.txtFileName),'utf8');
  const report=JSON.parse(json);
  assert.equal(report.schema,2);
  assert.equal(report.audit.summary.requests,1);
  assert.equal(report.audit.summary.responses,1);
  assert.equal(report.audit.coverage.fullTrafficCapture,false);
  assert.match(txt,/Auditoría de comunicación/);
  assert.match(txt,/Solicitudes Node observadas \(HTTP y fetch\): 1/);
  assert.ok(!json.includes(privateSecret));
  assert.ok(!txt.includes(privateSecret));
  assert.ok(!JSON.stringify(panel.getState()).includes(privateSecret));
  assert.equal(validateDiagnostic({source:'programa',event:'native_http_response',
    status:200,password:privateSecret}).password,undefined);
 }finally{
  if(panel)await panel.stop();
  fs.rmSync(downloads,{recursive:true,force:true});
 }
});

test('observed Node traffic is classified as partial and neither HTTPS contents nor 2FA are stored',async()=>{
 const rows=[];
 const server=http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  res.setHeader('Set-Cookie','SESSION=DO_NOT_RECORD');
  res.end('{"password":"DO_NOT_RECORD","twoFactor":"123456"}');
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const stop=startNodeHttpTrace(row=>rows.push(row));
 try{
  await new Promise((resolve,reject)=>{
   const req=http.request({host:'127.0.0.1',port:server.address().port,
     path:'/gin/v2/user/private-id',method:'POST',headers:{Authorization:'Bearer PRIVATE_TOKEN'}},
     res=>{res.resume();res.once('end',resolve);res.once('error',reject)});
   req.once('error',reject);req.end('request-password-value');
  });
  const panel=await startDiagnosticPanel({observeOnOpen:false});
  try{
   const {mapNativeEvent}=require('./almacen-diagnostic-panel.cjs');
   for(const row of rows){const ev=mapNativeEvent(row);if(ev)panel.emit(ev);}
   const serialized=JSON.stringify(panel.getState());
   for(const secret of ['DO_NOT_RECORD','123456','PRIVATE_TOKEN','request-password-value']){
     assert.ok(!serialized.includes(secret),'detected secret in export: '+secret);
   }
   const audit=panel.getState().audit;
   assert.equal(audit.summary.responses,1);
   assert.equal(audit.verification.twoFactorCompleted,'not_verified');
   assert.equal(audit.coverage.chromiumNetwork,'not_captured_by_http_observer');
  }finally{await panel.stop();}
 }finally{
  stop();await new Promise(resolve=>server.close(resolve));
 }
});

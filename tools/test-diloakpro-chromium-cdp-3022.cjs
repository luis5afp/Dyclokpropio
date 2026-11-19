'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {EventEmitter}=require('node:events');
const {
  safeHost,safeReasons,createCdpSessionMonitor,startVerifiedBrowserNetwork
}=require('./almacen-chromium-cdp-verificador.cjs');
const {mapNativeEvent,validateDiagnostic,startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const {createNativeDiagnosticController}=require('./almacen-native-integrated-diagnostic.cjs');

const SECRET='NEVER_EXPORT_PASSWORD_COOKIE_2026';

test('browser URL parsing retains a domain and route template, never userinfo, query or secrets',()=>{
  const result=safeHost('https://portal.example.test/gateway/v1/session/'+SECRET+'?auth='+SECRET);
  assert.equal(result.browserHost,'portal.example.test');
  assert.equal(result.transportProtocol,'https');
  assert.equal(result.routeTemplate,'/:id/v1/session/:id');
  assert.ok(!JSON.stringify(result).includes(SECRET));
  assert.equal(safeHost('https://user:password@example.test/profile'),null);
  assert.equal(safeHost('file:///private/profile'),null);
  assert.deepEqual(safeReasons([{blockedReasons:['SecureOnly','SomeFutureReason'],cookie:{value:SECRET}}]),
    {count:1,reasons:['SecureOnly','Other']});
});

test('CDP browser session correlates website HTTP statuses and cookie policy without reading secret values',async()=>{
 const commands=[];
 class FakeSocket extends EventTarget{
   constructor(url){
     super();this.url=url;this.readyState=0;FakeSocket.instance=this;
     queueMicrotask(()=>{this.readyState=1;this.dispatchEvent(new Event('open'));});
   }
   send(data){
     const item=JSON.parse(data);
     commands.push({method:item.method,sessionId:item.sessionId});
     let result={};
     if(item.method==='Target.getTargets')result={
       targetInfos:[{targetId:'page-1',type:'page'}]};
     if(item.method==='Target.attachToTarget')result={sessionId:'session-page-1'};
     queueMicrotask(()=>this.emit({id:item.id,result}));
   }
   emit(msg){this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(msg)}));}
   close(){this.readyState=3;}
 }
 const raw=[];
 const monitor=createCdpSessionMonitor({
   wsUrl:'ws://127.0.0.1:19001/devtools/browser/demo',debugPort:19001,
   emit:row=>raw.push(row),WebSocketImpl:FakeSocket
 });
 await monitor.start();
 try{
   const requestId='vendor-request-id-not-allowed-in-output';
   const sessionId='session-page-1';
   const url='https://shop.example.test/gin/v2/profile/'+SECRET+'?token='+SECRET;
   FakeSocket.instance.emit({method:'Network.requestWillBeSent',sessionId,
     params:{requestId,type:'Document',request:{url,method:'GET',
       headers:{Authorization:'Bearer '+SECRET,Cookie:SECRET}}}});
   FakeSocket.instance.emit({method:'Network.responseReceivedExtraInfo',sessionId,
     params:{requestId,headers:{'content-type':'text/html','set-cookie':'SESSION='+SECRET},
       blockedCookies:[{blockedReasons:['SecureOnly'],cookie:{value:SECRET}}]}});
   FakeSocket.instance.emit({method:'Network.requestWillBeSentExtraInfo',sessionId,
     params:{requestId,associatedCookies:[
       {blockedReasons:[],cookie:{value:SECRET}},
       {blockedReasons:['SameSiteStrict'],cookie:{value:SECRET}}
     ]}});
   FakeSocket.instance.emit({method:'Network.responseReceived',sessionId,
     params:{requestId,response:{url,status:200,remoteIPAddress:'192.0.2.9',
       remotePort:443,headers:{'set-cookie':SECRET}}}});
   FakeSocket.instance.emit({method:'Network.loadingFinished',sessionId,
     params:{requestId,encodedDataLength:1280}});
   const clean=raw.map(mapNativeEvent).filter(Boolean).map(validateDiagnostic);
   const requests=clean.filter(x=>x.event==='chromium_network_request');
   const responses=clean.filter(x=>x.event==='chromium_network_response');
   const blocked=clean.find(x=>x.event==='chromium_cookie_response');
   const sent=clean.find(x=>x.event==='chromium_cookie_request');
   const finished=clean.find(x=>x.event==='chromium_network_finish');
   assert.equal(requests.length,1);
   assert.equal(responses.length,1);
   assert.equal(requests[0].browserHost,'shop.example.test');
   assert.equal(requests[0].routeTemplate,'/gin/v2/profile/:id');
   assert.equal(responses[0].status,200);
   assert.equal(responses[0].requestId,requests[0].requestId);
   assert.equal(blocked.cookieSetAttempt,true);
   assert.equal(blocked.blockedCookieCount,1);
   assert.deepEqual(blocked.cookieBlockedReasons,['SecureOnly']);
   assert.equal(sent.sentCookieCount,1);
   assert.equal(sent.blockedCookieCount,1);
   assert.equal(finished.encodedBytes,1280);
   assert.ok(!JSON.stringify(clean).includes(SECRET));
   assert.ok(!JSON.stringify(raw).includes(SECRET));
   assert.ok(!JSON.stringify(raw).includes(requestId));
   assert.ok(!commands.some(x=>/(getCookies|getResponseBody|getAllCookies|getRequestPostData|Runtime\.evaluate|Storage\.)/.test(x.method)));
   const panel=await startDiagnosticPanel({observeOnOpen:false});
   try{
     panel.emit(validateDiagnostic(mapNativeEvent({
       kind:'chromium',phase:'status',monitorStatus:'verified'})));
     panel.emit(validateDiagnostic(mapNativeEvent({
       kind:'chromium',phase:'status',monitorStatus:'active'})));
     for(const x of clean)panel.emit(x);
     const state=panel.getState();
     assert.equal(state.checks.networkMetadata.chromiumRequests,1);
     assert.equal(state.checks.networkMetadata.chromiumResponses,1);
     assert.equal(state.checks.networkMetadata.chromiumHttp200,1);
     assert.equal(state.checks.networkMetadata.chromiumCookiesBlocked,2);
     assert.equal(state.checks.networkMetadata.chromiumCookiesSent,1);
     assert.equal(state.checks.networkMetadata.chromiumSetCookieAttempts,1);
     assert.equal(state.checks.browserSessionLinkedToRow,'openapi_verified');
     assert.equal(state.audit.summary.chromiumHttp200,1);
     assert.equal(state.audit.chromium[0].browserHost,'shop.example.test');
     assert.equal(state.audit.verification.cookiesApplied,'not_verified');
     assert.equal(state.audit.coverage.chromiumNetwork,'cdp_partial_after_open');
     assert.ok(!JSON.stringify(state).includes(SECRET));
   }finally{await panel.stop();}
 }finally{await monitor.stop();}
});

test('CDP monitor fails closed without configuration or with wrong OpenAPI profile identity',async()=>{
 const rows=[];
 let called=0,created=0;
 const stop=startVerifiedBrowserNetwork({
   profileId:'profile-01',emit:row=>rows.push(row),
   config:{},
   getSession:async()=>{called++;throw Error('SHOULD_NOT_CALL')},
   createSession:()=>{created++;throw Error('SHOULD_NOT_CREATE')}
 });
 await new Promise(resolve=>setTimeout(resolve,15));
 stop();
 assert.equal(rows[0].monitorStatus,'not_configured');
 assert.equal(called,0);
 assert.equal(created,0);
 const configured={DILOAKPRO_DIAG_CDP_ENABLE:'1',
   DILOAKPRO_DIAG_API_PORT:'19001',DICLOAK_LOCAL_API_KEY:'EXAMPLE_DUMMY_API_KEY'};
 const statuses=[];
 const stop2=startVerifiedBrowserNetwork({
   profileId:'profile-01',emit:row=>statuses.push(row),
   config:configured,retryCount:1,retryMs:2,
   getSession:async()=>({profileId:'DIFFERENT',debugPort:19001,
     webSocketUrl:'ws://127.0.0.1:19001/devtools/browser/notours',
     sessionIdentityVerifiedByOpenAPI:true}),
   createSession:()=>{created++;throw Error('MUST_NOT_ATTACH')}
 });
 await new Promise(resolve=>setTimeout(resolve,20));
 stop2();
 assert.ok(statuses.some(x=>x.monitorStatus==='unavailable'));
 assert.equal(created,0);
});

test('controller starts Chromium verifier only after stage open, stops on capture finish',async()=>{
 const records=[],windows=[];
 let emitter,stopped=0,started=0;
 const controller=createNativeDiagnosticController({
   startObserver:()=>()=>{},
   startBrowserMonitor:({profileId,emit})=>{
     started++;assert.equal(profileId,'profile-01');
     emitter=emit;return ()=>{stopped++;};
   },
   graceMs:15,maxMs:300,
   createWindow:async()=>{
     const win=new EventEmitter();win.focus=()=>{};win.close=()=>win.emit('closed');
     windows.push(win);return win;
   }
 });
 try{
   controller.note('profile-01','open_requested');
   controller.note('profile-01','step_start','FETCH_ENV_INFO');
   controller.note('profile-01','step_complete','FETCH_ENV_INFO');
   assert.equal(started,0);
   controller.note('profile-01','step_start','OPEN_ENV');
   controller.note('profile-01','step_complete','OPEN_ENV');
   assert.equal(started,1);
   emitter({kind:'chromium',phase:'status',monitorStatus:'verified'});
   emitter({kind:'chromium',phase:'request',method:'GET',
      browserHost:'www.example.test',routeTemplate:'/:id',
      resourceType:'Document',transportProtocol:'https',
      requestId:'12345678-1234-4234-9234-123456789abc',sessionMapping:'openapi_verified',
      rawHeaders:{cookie:SECRET}});
   await new Promise(resolve=>setTimeout(resolve,45));
   assert.equal(stopped,1);
   const snapshot=controller.snapshot('profile-01');
   assert.ok(snapshot.some(x=>x.event==='chromium_network_request'));
   assert.equal(snapshot.at(-1).event,'capture_finished');
   assert.ok(!JSON.stringify(snapshot).includes(SECRET));
 }finally{controller.shutdown();}
});

test('CDP event validation rejects private URLs, cookie values and untrusted resource status',()=>{
 assert.throws(()=>validateDiagnostic({source:'chromium',event:'chromium_network_request',
   browserHost:'https://example.test/?token=SECRET'}),/INVALID_CHROMIUM_HOST/);
 assert.throws(()=>validateDiagnostic({source:'chromium',event:'chromium_cookie_response',
   cookieBlockedReasons:['password=SECRET']}),/INVALID_COOKIE_REASONS/);
 assert.throws(()=>validateDiagnostic({source:'chromium',event:'chromium_network_request',
   resourceType:'application-secret'}),/INVALID_CHROMIUM_ENUM/);
 const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-3015.js'),'utf8');
 assert.ok(builder.includes("'almacen-chromium-cdp-verificador.cjs'"));
 assert.ok(builder.includes("'dicloak-local-api-profile.cjs'"));
 assert.ok(!builder.includes("'almacen-diagnostic-archive.cjs'"));
});

'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {requestMetadata,startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const {safeHostname,describePath,safeMime,safeEncoding}=require('./almacen-http-context.cjs');
const {diagnosticConfig,safeApiProblem,safeHost,startVerifiedBrowserNetwork}=require('./almacen-chromium-cdp-verificador.cjs');
const {validateDiagnostic,mapNativeEvent,startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const SECRET='SENSITIVE_QP_TOKEN_PASSWORD_COOKIE_9876';

test('routes show useful structural service and safe hostname without private values',()=>{
 const meta=requestMetadata([{hostname:'api.example.test',path:'/gateway/v2/profile/'+SECRET+
   '/cookie/sync?token='+SECRET+'&page=3&email='+SECRET+'&limit=10',method:'GET'}],'https:');
 assert.equal(meta.originHost,'api.example.test');
 assert.equal(meta.routeTemplate,'/gateway/v2/profile/:id/cookie/sync');
 assert.equal(meta.endpointArea,'gateway');
 assert.deepEqual(meta.queryKeyNames,['page','limit']);
 assert.equal(meta.routeMaskedSegments,1);
 assert.equal(meta.routeDepth,6);
 assert.ok(!JSON.stringify(meta).includes(SECRET));
 assert.deepEqual(describePath('/private/v1/secret/'+SECRET,'?access_token='+SECRET),
   {routeTemplate:'/:id/v1/:id/:id',routeDepth:4,routeMaskedSegments:3,
    queryKeyNames:[],endpointArea:'other'});
 assert.equal(safeHostname('gateway.example.test:443'),'gateway.example.test');
 assert.equal(safeHostname('user:password@example.test'),null);
 assert.equal(safeHostname('https://example.test/?token='+SECRET),null);
 assert.equal(safeHostname('[::1]:443'),'::1');
 assert.equal(safeMime('application/json; charset=utf-8'),'application/json');
 assert.equal(safeMime('application/x-user-secret'),'other');
 assert.equal(safeEncoding('gzip'),'gzip');
 assert.equal(safeEncoding('Bearer '+SECRET),'other');
 const chromium=safeHost('https://api.example.test/gateway/v2/profile/'+SECRET+
   '?page=1&session='+SECRET);
 assert.equal(chromium.browserHost,'api.example.test');
 assert.equal(chromium.routeTemplate,'/gateway/v2/profile/:id');
 assert.deepEqual(chromium.queryKeyNames,['page']);
 assert.ok(!JSON.stringify(chromium).includes(SECRET));
});

test('Node HTTP observed server/mime/status/context but does not retain private response',async()=>{
 const server=http.createServer((req,res)=>{
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8',
     'Content-Encoding':'identity','Set-Cookie':'login='+SECRET+'; HttpOnly'});
   res.end(JSON.stringify({password:SECRET,token:SECRET,cookie:SECRET}));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const raw=[],stop=startNodeHttpTrace(x=>raw.push(x));
 try{
   const result=await new Promise((resolve,reject)=>{
     const req=http.request({hostname:'127.0.0.1',port:server.address().port,
       path:'/gateway/v2/profile/'+SECRET+'/config?page=2&auth='+SECRET,
       method:'GET',headers:{Authorization:'Bearer '+SECRET}},
       res=>{res.resume();res.once('end',()=>resolve(res.statusCode));res.once('error',reject)});
     req.once('error',reject);req.end();
   });
   assert.equal(result,200);
   const start=raw.find(x=>x.phase==='request');
   const response=raw.find(x=>x.phase==='response');
   assert.equal(start.originHost,'127.0.0.1');
   assert.equal(start.routeTemplate,'/gateway/v2/profile/:id/config');
   assert.deepEqual(start.queryKeyNames,['page']);
   assert.equal(response.status,200);
   assert.equal(response.mediaType,'application/json');
   assert.equal(response.contentEncoding,'identity');
   assert.equal(response.responseClass,'2xx');
   const safe=raw.map(mapNativeEvent).filter(Boolean).map(validateDiagnostic);
   assert.ok(!JSON.stringify(raw).includes(SECRET));
   assert.ok(!JSON.stringify(safe).includes(SECRET));
   const panel=await startDiagnosticPanel({observeOnOpen:false});
   try{
     for(const e of safe)panel.emit(e);
     const state=panel.getState();
     const reqItem=state.audit.http[0];
     assert.equal(reqItem.originHost,'127.0.0.1');
     assert.equal(reqItem.mediaType,'application/json');
     assert.equal(reqItem.endpointArea,'gateway');
     assert.ok(!JSON.stringify(state).includes(SECRET));
   }finally{await panel.stop();}
 }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

test('CDP setup shows actionable issue without credentials or port probing',async()=>{
 assert.deepEqual(diagnosticConfig({}),{enabled:false,issue:'disabled_by_default'});
 assert.equal(diagnosticConfig({DILOAKPRO_DIAG_CDP_ENABLE:'1'}).issue,'missing_api_port');
 assert.equal(diagnosticConfig({DILOAKPRO_DIAG_CDP_ENABLE:'1',
   DILOAKPRO_DIAG_API_PORT:'wrong'}).issue,'invalid_api_port');
 assert.equal(diagnosticConfig({DILOAKPRO_DIAG_CDP_ENABLE:'1',
   DILOAKPRO_DIAG_API_PORT:'52140'}).issue,'missing_api_key');
 assert.equal(diagnosticConfig({DILOAKPRO_DIAG_CDP_ENABLE:'1',
   DILOAKPRO_DIAG_API_PORT:'52140',DICLOAK_LOCAL_API_KEY:SECRET}).enabled,true);
 assert.equal(safeApiProblem(Error('DICLOAK_DEBUG_PORT_UNAVAILABLE')),
   'remote_inspector_unavailable');
 assert.equal(safeApiProblem(Error('DICLOAK_LOCAL_API_HTTP_404')),
   'api_endpoint_unsupported');
 let calls=0,rows=[];
 const stop=startVerifiedBrowserNetwork({
   profileId:'test-profile',emit:x=>rows.push(x),
   config:{DILOAKPRO_DIAG_CDP_ENABLE:'1',
     DILOAKPRO_DIAG_API_PORT:'52140',DICLOAK_LOCAL_API_KEY:SECRET},
   retryCount:3,retryMs:1,
   getSession:async()=>{calls++;throw Error('DICLOAK_LOCAL_API_HTTP_404');}
 });
 await new Promise(resolve=>setTimeout(resolve,35));stop();
 assert.equal(calls,1,'unsupported local endpoint should fail fast');
 assert.equal(rows.at(-1).monitorStatus,'unavailable');
 assert.equal(rows.at(-1).monitorIssue,'api_endpoint_unsupported');
 assert.ok(!JSON.stringify(rows).includes(SECRET));
 const panel=await startDiagnosticPanel({observeOnOpen:false});
 try{
   panel.emit(validateDiagnostic(mapNativeEvent(rows.at(-1))));
   assert.equal(panel.getState().checks.networkMetadata.chromiumIssue,
     'api_endpoint_unsupported');
 }finally{await panel.stop();}
});

test('Strict schema rejects private URLs, raw content and free-form HTTP metadata',()=>{
 assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_request',
   originHost:'https://login.example.test/?password='+SECRET}),/INVALID_ORIGIN_HOST/);
 assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_response',
   mediaType:SECRET}),/INVALID_NETWORK_METADATA_ENUM/);
 assert.throws(()=>validateDiagnostic({source:'chromium',event:'chromium_network_response',
   queryKeyNames:['token']}),/INVALID_QUERY_KEY_NAMES/);
 assert.throws(()=>validateDiagnostic({source:'chromium',event:'chromium_monitor_status',
   monitorIssue:'unauthorized:'+SECRET}),/INVALID_NETWORK_METADATA_ENUM/);
 assert.equal(validateDiagnostic({source:'chromium',event:'chromium_network_request',
   routeTemplate:'/'}).routeTemplate,'/');
});

test('Diagnostic page remains syntactically valid and no automatic archiving returns',()=>{
 const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
 const js=html.split('<script nonce="PANEL_CSP_NONCE">')[1]?.split('</script>')[0];
 assert.ok(js);new vm.Script(js);
 assert.match(html,/Causa concreta/);
 assert.match(html,/Dominio de origen/);
 assert.match(html,/Remote Inspector/);
 const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-3015.js'),'utf8');
 assert.ok(builder.includes("'almacen-http-context.cjs'"));
 assert.ok(!builder.includes("'almacen-diagnostic-archive.cjs'"));
});

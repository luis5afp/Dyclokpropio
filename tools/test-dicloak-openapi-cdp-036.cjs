'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {startTestProfile,getRunningTestProfile,waitForRunningTestProfile,validateLocalBrowserWebSocket,findBrowserWebSocket}=require('./dicloak-local-api-profile.cjs');
const {createAllowedCdpRecorder,decodeCdpBody}=require('./almacen-allowed-cdp.cjs');
const {configFromEnv}=require('./run-dicloak-openapi-test-receiver.cjs');

async function server(handler){
 const s=http.createServer(handler);
 await new Promise(resolve=>s.listen(0,'127.0.0.1',resolve));
 return {s,port:s.address().port,close:()=>new Promise(resolve=>s.close(resolve))};
}
test('official V1 local profile start binds to explicit profile id and retains API key only in local request',async()=>{
 const seen=[];
 const api=await server((req,res)=>{
   seen.push({method:req.method,url:req.url,key:req.headers['x-api-key']});
   res.writeHead(200,{'content-type':'application/json'});
   res.end(JSON.stringify({code:0,data:{serial_number:4,pid:'333',debug_port:17539}}));
 });
 try{
  const result=await startTestProfile({apiPort:api.port,apiKey:'LOCAL_DEMO_KEY_ONLY',profileId:'profile_524',version:'v1'});
  assert.equal(result.profileId,'profile_524');
  assert.equal(result.debugPort,17539);
  assert.equal(result.webSocketUrl,null);
  assert.equal(JSON.stringify(result).includes('LOCAL_DEMO_KEY_ONLY'),false);
  assert.deepEqual(seen,[{method:'PATCH',url:'/openapi/v1/env/profile_524/open',key:'LOCAL_DEMO_KEY_ONLY'}]);
 }finally{await api.close();}
});
test('official V2 API validates returned ID and allows only local Chromium WebSocket',async()=>{
 const api=await server((req,res)=>{
  const payload={code:0,data:{
   id:'profile_815',debug_port:19222,
   web_socket_url:'ws://127.0.0.1:19222/devtools/browser/local-test-id'
  }};
  res.writeHead(200,{'content-type':'application/json'});
  res.end(JSON.stringify(payload));
 });
 try{
  const result=await startTestProfile({apiPort:api.port,apiKey:'LOCAL_DEMO_KEY_ONLY',profileId:'profile_815',version:'v2'});
  assert.equal(result.debugPort,19222);
  assert.match(result.webSocketUrl,/^ws:\/\/127\.0\.0\.1/);
  await assert.rejects(startTestProfile({apiPort:api.port,apiKey:'LOCAL_DEMO_KEY_ONLY',
   profileId:'profile_524',version:'v2'}),/LOCAL_API_PROFILE_ID_MISMATCH/);
 }finally{await api.close();}
 for(const ws of ['ws://evil.example:19222/devtools/browser/abc',
  'wss://127.0.0.1:19222/devtools/browser/abc',
  'ws://127.0.0.1:19223/devtools/browser/abc',
  'ws://127.0.0.1:19222/devtools/page/abc'])
    assert.throws(()=>validateLocalBrowserWebSocket(ws,19222),/BROWSER_DEBUG_URL_NOT_LOCAL/);
});
test('CDP browser discovery reads only the localhost version resource',async()=>{
 const api=await server((req,res)=>{
  assert.equal(req.url,'/json/version');
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({webSocketDebuggerUrl:'ws://127.0.0.1:'+api.port+'/devtools/browser/demo'}));
 });
 try {
  assert.equal(await findBrowserWebSocket(api.port),
    'ws://127.0.0.1:'+api.port+'/devtools/browser/demo');
 }finally{await api.close();}
});
test('in-memory CDP mock persists only allowed test JSON; discards foreign responses and preserves mock bytes',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-cdp-fixture-'));
 const body=Buffer.from('{"TEST_ONLY":"FAKE_DEMO"}\r\n','utf8');
 class FakeSocket extends EventTarget{
  constructor(){
   super();this.readyState=0;FakeSocket.instance=this;
   queueMicrotask(()=>{this.readyState=1;this.dispatchEvent(new Event('open'))});
  }
  send(data){
   const cmd=JSON.parse(data);
   const result=cmd.method==='Network.getResponseBody'?
     {body:body.toString('base64'),base64Encoded:true}:{};
   queueMicrotask(()=>this.emit({id:cmd.id,result,sessionId:cmd.sessionId}));
  }
  emit(value){
   this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(value)}));
  }
  close(){this.readyState=3;}
 }
 try{
  const recorder=createAllowedCdpRecorder({
   profileId:'profile_524',debugPort:19222,
   wsUrl:'ws://127.0.0.1:19222/devtools/browser/fixture',
   rootFolder:root,testEndpointPrefix:'https://lab.example.test/approved/',
   WebSocketImpl:FakeSocket
  });
  await recorder.start();
  FakeSocket.instance.emit({method:'Target.attachedToTarget',params:{
   sessionId:'page-session-1',targetInfo:{type:'page'}
  }});
  await new Promise(resolve=>setTimeout(resolve,10));
  FakeSocket.instance.emit({method:'Network.responseReceived',sessionId:'page-session-1',params:{
   requestId:'unapproved',response:{url:'https://evil.example/private.json',status:200,mimeType:'application/json'}
  }});
  FakeSocket.instance.emit({method:'Network.responseReceived',sessionId:'page-session-1',params:{
   requestId:'approved',response:{url:'https://lab.example.test/approved/file.json',status:200,mimeType:'application/json'}
  }});
  FakeSocket.instance.emit({method:'Network.loadingFinished',sessionId:'page-session-1',params:{requestId:'approved'}});
  for(let i=0;i<60&&recorder.stats.saved===0;i++)await new Promise(resolve=>setTimeout(resolve,10));
  assert.equal(recorder.stats.saved,1);
  assert.equal(recorder.stats.ignored,1);
  const dirs=await fs.readdir(path.join(root,'profile_524','archivos'));
  assert.equal(dirs.length,1);
  const saved=await fs.readFile(path.join(root,'profile_524','archivos',dirs[0],'file.json'));
  assert.ok(saved.equals(body));
  const outcome=await recorder.stop();
  assert.equal(outcome.saved,1);
  assert.equal(outcome.changedNativeChromiumStorage,false);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('CDP decoded text vs server wire bytes is not claimed identical; credentials in config are never output',()=>{
 assert.ok(decodeCdpBody({body:'hello',base64Encoded:false}).equals(Buffer.from('hello')));
 assert.throws(()=>decodeCdpBody({body:'%%%%',base64Encoded:true}),/CDP_INVALID_BASE64/);
 const config=configFromEnv({
  DICLOAK_LOCAL_API_KEY:'LAB_API_KEY_DO_NOT_COMMIT',
  DICLOAK_TEST_PROFILE_ID:'profile_01',
  DICLOAK_TEST_ENDPOINT_PREFIX:'https://lab.example.test/approved/',
  DICLOAK_TEST_RECORD_SECONDS:'5'
 });
 assert.equal(config.seconds,5);
 assert.equal(config.testEndpointPrefix,'https://lab.example.test/approved/');
 assert.throws(()=>configFromEnv({DICLOAK_TEST_PROFILE_ID:'abc'}),/CONFIG_MISSING/);
});


test('V2 runtime API attaches to the profile opened through Operación Abrir without issuing start or stop',async()=>{
  const received=[];let calls=0;
  const api=await server((req,res)=>{
    received.push({method:req.method,url:req.url});
    calls++;
    const live=calls>=2;
    const data={
      status:live?'running':'stopped',profile_id:'profile_524',
      debug_port:live?19123:null,
      web_socket_url:live?'ws://127.0.0.1:19123/devtools/browser/verified':null
    };
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({code:0,data}));
  });
  try{
    const status=await getRunningTestProfile({apiPort:api.port,apiKey:'LOCAL_DEMO_KEY_ONLY',profileId:'profile_524'});
    assert.equal(status,null);
    const attached=await waitForRunningTestProfile({apiPort:api.port,
      apiKey:'LOCAL_DEMO_KEY_ONLY',profileId:'profile_524',waitSeconds:2,pollMs:200});
    assert.equal(attached.profileId,'profile_524');
    assert.equal(attached.sessionIdentityVerifiedByOpenAPI,true);
    assert.equal(attached.profileStartedByOpenAPI,false);
    assert.equal(attached.debugPort,19123);
    assert.ok(received.every(v=>v.method==='GET'&&
      v.url==='/openapi/v2/profiles/profile_524/session'));
  }finally{await api.close();}
});
test('V2 runtime API refuses wrong profile identity in status response',async()=>{
  const api=await server((req,res)=>{
    res.end(JSON.stringify({code:0,data:{profile_id:'another_profile',status:'running',debug_port:19123}}));
  });
  try{
    await assert.rejects(getRunningTestProfile({apiPort:api.port,
      apiKey:'LOCAL_DEMO_KEY_ONLY',profileId:'profile_524'}),/DICLOAK_RUNTIME_PROFILE_MISMATCH/);
  }finally{await api.close();}
});

'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http');
const {requestMetadata,startNodeHttpTrace,parseWindowsSample,processClass}=require('../src/main/diagnostic-observer.js');
const {sanitize,createDiagnosticConsole,CONTROL,EVENT}=require('../src/main/diagnostic-console.js');

(async()=>{
  const privateId='PRIVATE-PROFILE-ID-9999', secret='VERY-PRIVATE-TOKEN';
  const route=requestMetadata(['https://api.example.test/openapi/v2/profiles/'+privateId+'/start?key='+secret], 'https:');
  assert.deepEqual(route,{action:'GET',scope:'remote',routeTemplate:'/openapi/v2/profiles/:id/start'});
  const requests=[];
  const server=http.createServer((_req,res)=>{res.writeHead(200,{'content-length':'2'});res.end('ok');});
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const original=http.request;
  const stopTrace=startNodeHttpTrace(e=>requests.push(e));
  try{
    await new Promise((resolve,reject)=>{
      http.request({hostname:'127.0.0.1',port:server.address().port,method:'POST',
        path:'/openapi/v2/profiles/'+privateId+'/start?token='+secret},res=>{
          res.resume();res.once('end',resolve);
        }).once('error',reject).end();
    });
  }finally{stopTrace();await new Promise(done=>server.close(done));}
  assert.equal(http.request,original,'HTTP request restored at stop');
  assert.equal(requests.length,2);
  assert.equal(requests[0].routeTemplate,'/openapi/v2/profiles/:id/start');
  assert.equal(requests[1].status,200);
  assert.equal(requests[1].bytes,2);
  assert.equal(requests[0].requestId,requests[1].requestId);
  assert.equal(JSON.stringify(requests).includes(privateId),false);
  assert.equal(JSON.stringify(requests).includes(secret),false);

  const changes=[],seen=new Set();
  parseWindowsSample({processes:[
    {ProcessId:101,ParentProcessId:99,Name:'chrome.exe',CommandLine:'SECRET'},
    {ProcessId:102,ParentProcessId:99,Name:'my-sensitive-name.exe'}
  ],tcp:[
    {OwningProcess:101,RemoteAddress:'198.51.100.7',RemotePort:443,url:'https://private/'},
    {OwningProcess:101,RemoteAddress:'not-ip',RemotePort:1234}
  ],udp:[{OwningProcess:101,LocalPort:6000}]},e=>changes.push(e),seen);
  assert.equal(changes.filter(e=>e.kind==='process').length,2);
  assert.equal(changes.filter(e=>e.kind==='connection').length,3);
  assert.equal(changes[0].processClass,'browser');
  assert.equal(changes[1].processClass,'child');
  assert.equal(JSON.stringify(changes).includes('SECRET'),false);
  assert.equal(processClass('gost.exe'),'proxy');

  const scrubbed=sanitize({kind:'http',phase:'response',action:'POST',
    transport:'node',routeTemplate:'/openapi/v2/profiles/:id/start',
    requestId:requests[0].requestId,bytes:2,status:201,
    cookie:secret,url:'https://secret',body:'PASSWORD'});
  assert.equal(scrubbed.routeTemplate,'/openapi/v2/profiles/:id/start');
  assert.equal(scrubbed.bytes,2);
  assert.equal(JSON.stringify(scrubbed).includes(secret),false);
  assert.equal(sanitize({kind:'http',phase:'response',action:'POST',transport:'node',
    routeTemplate:'/secret/PRIVATE-ID?token=x'}).routeTemplate,null);
  assert.equal(sanitize({kind:'connection',phase:'info',action:'seen',
    pid:101,protocol:'TCP',remoteIp:'198.51.100.7',remotePort:443,
    hostname:'secret.example'}).remoteIp,'198.51.100.7');
  assert.equal(sanitize({kind:'file',phase:'info',action:'changed',fileExt:'txt',
    fileName:'very_private.txt',bytes:123}).fileExt,'txt');
  assert.equal(JSON.stringify(sanitize({kind:'file',phase:'info',action:'changed',
    fileName:'very_private.txt'})).includes('very_private'),false);
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-3015-observer-'));
  try{
    const handlers=new Map();
    const ipc={handle:(name,fn)=>handlers.set(name,fn)};
    const app={getPath:()=>tmp};
    const diag=createDiagnosticConsole(ipc,app);
    const trusted={senderFrame:{url:'file:///C:/resources/app.asar/dist/index.html#/profiles'}};
    const hostile={senderFrame:{url:'https://attacker.example/index.html'}};
    assert.equal((await handlers.get(CONTROL)(hostile,'start')).error,'DENIED');
    assert.equal((await handlers.get(CONTROL)(trusted,'start')).active,true);
    diag.onStage({phase:'start',step:'fetchEnvInfo'});
    diag.onStage({phase:'success',step:'fetchEnvInfo'});
    assert.equal((await handlers.get(EVENT)(trusted,{
      kind:'http',phase:'response',action:'POST',scope:'remote',status:200,
      url:'https://secret.example?token='+secret,headers:{cookie:secret}
    })),true);
    const exported=await handlers.get(CONTROL)(trusted,'export-json');
    assert.ok(exported.fileName.endsWith('.json'));
    const out=fs.readFileSync(path.join(tmp,exported.fileName),'utf8');
    assert.equal(out.includes(secret),false);
    assert.equal(out.includes(privateId),false);
    assert.ok(out.includes('fetchEnvInfo'));
    assert.ok(out.includes('\"version\": \"v30.0.15-lab\"'));
    await handlers.get(CONTROL)(trusted,'stop');
    assert.equal((await handlers.get(CONTROL)(trusted,'status')).active,false);
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
  console.log('PASS: Node HTTP metadata, process/IP sampling schema, privacy, lifecycle, JSON export');
})().catch(err=>{console.error(err);process.exitCode=1;});
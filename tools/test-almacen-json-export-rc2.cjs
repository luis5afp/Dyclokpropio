'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');

function request(target,method='GET',{origin,host}={}){
  const url=new URL(target);
  return new Promise((resolve,reject)=>{
    const req=http.request({hostname:'127.0.0.1',port:url.port,path:url.pathname,
      method,headers:{...(origin?{origin}:{}),...(host?{host}:{})}},res=>{
      let data='';res.setEncoding('utf8');
      res.on('data',chunk=>data+=chunk);
      res.on('end',()=>resolve({status:res.statusCode,body:data,headers:res.headers}));
    });req.once('error',reject);req.end();
  });
}
test('RC3: save JSON on disk from the embedded panel, without popup/download and without secrets',async()=>{
  const downloads=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-json-export-'));
  const panel=await startDiagnosticPanel({exportDirectory:downloads});
  try{
    const origin=new URL(panel.url).origin;
    const html=await request(panel.url);
    assert.equal(html.status,200);
    assert.match(html.body,/id="save-json"/);
    assert.match(html.body,/fetch\("save-json",\{method:"POST"/);
    assert.doesNotMatch(html.body,/target="_blank"/);

    panel.emit({source:'programa',event:'operation_open_requested',
      password:'DO-NOT-EXPORT',url:'https://SECRET-EXAMPLE',headers:{Authorization:'PRIVATE'}});
    panel.emit({source:'programa',event:'native_http_response',status:200,
      method:'HEAD',scope:'remote',routeTemplate:'/gin/:id/:id',elapsedMs:782,
      requestId:'12345678-1234-1234-1234-123456789abc',token:'SENSITIVE_TOKEN'});
    const blocked=await request(panel.url+'save-json','POST',{origin:'https://malicious.example'});
    assert.equal(blocked.status,403,'untrusted Origin must not write files');
    const noOrigin=await request(panel.url+'save-json','POST');
    assert.equal(noOrigin.status,403,'missing Origin must not write files');
    const wrongPath=await request(origin+'/diagnostico/incorrect-token/save-json','POST',{origin});
    assert.equal(wrongPath.status,403,'untrusted token must not write files');
    assert.equal(fs.readdirSync(downloads).length,0);

    const result=await request(panel.url+'save-json','POST',{origin});
    assert.equal(result.status,200,result.body);
    const saved=JSON.parse(result.body);
    assert.equal(saved.ok,true);
    assert.equal(saved.eventCount,3);
    assert.match(saved.fileName,/^diloakPRO-Diagnostico-[a-zA-Z0-9-]+\.json$/);
    const file=path.join(downloads,saved.fileName);
    assert.ok(fs.existsSync(file),'JSON must be physically saved');
    const raw=fs.readFileSync(file,'utf8');
    const parsed=JSON.parse(raw);
    assert.equal(parsed.events.length,3);
    assert.equal(parsed.coverage,'partial');
    assert.equal(parsed.delivery,'v30.0.17-diloakpro-rc4');
    for(const secret of ['DO-NOT-EXPORT','SECRET-EXAMPLE','PRIVATE','SENSITIVE_TOKEN']){
      assert.equal(raw.includes(secret),false,'Private value leaked: '+secret);
    }
    assert.match(raw,/native_http_response/);

    const oldDownload=await request(panel.url+'export');
    assert.equal(oldDownload.status,200,'keep original GET compatibility');
    assert.ok(JSON.parse(oldDownload.body).events.length>=3);
  }finally{
    await panel.stop();
    fs.rmSync(downloads,{recursive:true,force:true});
  }
});
test('RC3: invalid download directory fails closed with useful error',async()=>{
  const panel=await startDiagnosticPanel({exportDirectory:'relative/invalid/path'});
  try{
    const result=await request(panel.url+'save-json','POST',{origin:new URL(panel.url).origin});
    assert.equal(result.status,503);
    assert.equal(JSON.parse(result.body).error,'DOWNLOAD_DIRECTORY_UNAVAILABLE');
  }finally{await panel.stop();}
});

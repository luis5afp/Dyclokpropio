'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {createDiagnosticConsole,sanitize,isTrusted,CONTROL,EVENT}=require('../src/main/diagnostic-console.js');
const {transform,TAG}=require('./install-diagnostic-panel.js');

const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const htmlPatched=transform(html);
assert.ok(htmlPatched.includes(TAG));
assert.ok(htmlPatched.indexOf(TAG)<htmlPatched.indexOf('assets/index-BUIbb6Pa.js'));
assert.throws(()=>transform(html+' modified'),'Modified renderer index.html must be rejected');
const ui=fs.readFileSync(path.join(__dirname,'../src/renderer/diagnostic-panel.js'),'utf8');
new vm.Script(ui,{filename:'diagnostic-panel.js'});

(async()=>{
  const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-diagnostic-panel-'));
  try{
    const handlers=new Map();
    const ipc={handle:(name,fn)=>{assert.ok(!handlers.has(name));handlers.set(name,fn);}};
    const app={getPath:name=>{assert.ok(['userData','downloads'].includes(name));return fixture;}};
    const recorder=createDiagnosticConsole(ipc,app);
    const origin={senderFrame:{url:'file:///C:/resources/app.asar/dist/index.html#/profiles'}};
    const hostile={senderFrame:{url:'https://hostile.example/index.html'}};
    assert.equal(isTrusted(origin),true);
    assert.equal(isTrusted(hostile),false);
    assert.deepEqual(await handlers.get(CONTROL)(hostile,'start'),{error:'DENIED'});
    const start=await handlers.get(CONTROL)(origin,'start');
    assert.equal(start.active,true);
    assert.equal(await handlers.get(EVENT)(hostile,{kind:'http',phase:'request',action:'GET'}),false);
    recorder.onStage({step:'expandCheck',phase:'fail',code:'EXPAND_SHA256_CHECK_FAIL',id:'PROFILE-244'});
    await handlers.get(EVENT)(origin,{
      kind:'http',phase:'response',action:'POST',scope:'remote',status:503,elapsedMs:145,
      headers:{cookie:'SESSION-PRIVATE'},url:'https://private.example?token=ULTRASECRET',
      body:'PASSWORD-PRIVATE',result:'object'
    });
    await handlers.get(EVENT)(origin,{
      kind:'ipc',phase:'response',action:'open-env-PRIVATE',result:'null',
      cookies:'SENSITIVE-COOKIE',code:'ANY_SECRET'
    });
    const status=await handlers.get(CONTROL)(origin,'status');
    assert.equal(status.active,true);
    assert.ok(status.tail.some(x=>x.kind==='stage'&&x.action==='expandCheck'));
    assert.ok(status.tail.some(x=>x.kind==='http'&&x.status===503&&x.action==='POST'));
    assert.ok(status.tail.some(x=>x.kind==='ipc'&&x.action==='other'));
    assert.equal(sanitize({kind:'http',phase:'request',action:'DELETE',url:'private'}).action,'DELETE');
    assert.equal(sanitize({kind:'hostile',phase:'request'}),null);
    const stop=await handlers.get(CONTROL)(origin,'stop');
    assert.equal(stop.active,false);
    const exported=await handlers.get(CONTROL)(origin,'export');
    assert.ok(exported.fileName.endsWith('.txt'));
    const report=fs.readFileSync(path.join(fixture,exported.fileName),'utf8');
    for(const secret of ['ULTRASECRET','private.example','SESSION-PRIVATE','PASSWORD-PRIVATE','PROFILE-244','SENSITIVE-COOKIE','ANY_SECRET','open-env-PRIVATE']) {
      assert.equal(report.includes(secret),false,'Diagnostic report leaked: '+secret);
    }
    assert.ok(report.includes('EXPAND_SHA256_CHECK_FAIL'));
    assert.ok(report.includes('"status":503'));
    assert.ok(report.includes('"result":"null"'));
    console.log('PASS: opt-in button installer and JavaScript syntax');
    console.log('PASS: trusted IPC controls, start-stop-export and HTTP/IPC/stage metadata');
    console.log('PASS: malicious URLs, cookies, bodies, IDs and arbitrary IPC names are never exported');
  }finally{fs.rmSync(fixture,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});

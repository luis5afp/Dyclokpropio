'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {createAllowedCdpRecorder}=require('./almacen-allowed-cdp.cjs');

test('attaches existing Chromium page after Operación Abrir without reading cookie stores',async()=>{
  const base=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-cdp-existing-'));
  const seen=[];
  const body=Buffer.from([0,255,18,80,75,3,4,11]);
  class FakeSocket extends EventTarget {
    constructor(){
      super();this.readyState=0;FakeSocket.live=this;
      queueMicrotask(()=>{this.readyState=1;this.dispatchEvent(new Event('open'))});
    }
    send(s){
      const cmd=JSON.parse(s);
      seen.push({method:cmd.method,sessionId:cmd.sessionId});
      let result={};
      if(cmd.method==='Target.getTargets')result={
        targetInfos:[{targetId:'page-old',type:'page',url:'https://lab.example.test/approved/start'}]
      };
      if(cmd.method==='Target.attachToTarget')result={sessionId:'attached-existing-page'};
      if(cmd.method==='Network.getResponseBody')result={
        body:body.toString('base64'),base64Encoded:true
      };
      queueMicrotask(()=>this.emit({id:cmd.id,result}));
    }
    emit(msg){
      this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(msg)}));
    }
    close(){this.readyState=3}
  }
  try{
    const recorder=createAllowedCdpRecorder({
      profileId:'profile_test_1',debugPort:19222,
      wsUrl:'ws://127.0.0.1:19222/devtools/browser/demo-only',
      testEndpointPrefix:'https://lab.example.test/approved/',
      rootFolder:base,WebSocketImpl:FakeSocket
    });
    const info=await recorder.start();
    assert.equal(info.monitoredTargets,1);
    assert.equal(recorder.stats.attachedTargets,1);
    assert.equal(recorder.stats.enabledTargets,1);
    assert.ok(seen.some(x=>x.method==='Target.getTargets'));
    assert.ok(seen.some(x=>x.method==='Target.attachToTarget'));
    assert.ok(seen.some(x=>x.method==='Network.enable'&&x.sessionId==='attached-existing-page'));
    FakeSocket.live.emit({method:'Network.responseReceived',sessionId:'attached-existing-page',
      params:{requestId:'ok',response:{
        url:'https://lab.example.test/approved/file.bin',
        mimeType:'application/octet-stream',status:200}}});
    FakeSocket.live.emit({method:'Network.loadingFinished',sessionId:'attached-existing-page',
      params:{requestId:'ok'}});
    for(let i=0;i<60&&recorder.stats.saved===0;i++)
      await new Promise(resolve=>setTimeout(resolve,10));
    assert.equal(recorder.stats.saved,1);
    const events=await fs.readdir(path.join(base,'profile_test_1','archivos'));
    const saved=await fs.readFile(path.join(base,'profile_test_1','archivos',events[0],'file.bin'));
    assert.ok(saved.equals(body));
    assert.equal(recorder.stats.approved,1);
    assert.equal(recorder.stats.received,1);
    assert.ok(!seen.some(x=>/getCookies|getAllCookies|Storage\.getCookies|Network\.getRequestPostData/.test(x.method)));
    await recorder.stop();
  }finally{await fs.rm(base,{recursive:true,force:true});}
});

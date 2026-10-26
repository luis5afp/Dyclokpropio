'use strict';
const assert=require('node:assert/strict');
const {
  CHANNEL,trustedMainWindow,installCacheIpcCompatibility
}=require('../src/main/cache-ipc-compatibility.js');

function fakeElectron(){
  const handleMap=new Map(), listeners=new Map();
  const ipcMain={
    on(channel,fn){
      listeners.set(channel,fn);
      return this;
    },
    handle(channel,fn){
      if(handleMap.has(channel)) throw new Error('Duplicate handler');
      handleMap.set(channel,fn);
    },
    hasHandler(channel){return handleMap.has(channel);},
    removeHandler(channel){handleMap.delete(channel);},
    _handleMap:handleMap,
    _listeners:listeners
  };
  return ipcMain;
}

async function main(){
  const ipc=fakeElectron();
  const feature=installCacheIpcCompatibility(ipc);
  assert.equal(feature.status().hasHandler,false);
  const other=()=>123;
  ipc.on('another-legacy-channel',other);
  assert.equal(ipc._listeners.get('another-legacy-channel'),other);
  assert.equal(ipc.hasHandler('another-legacy-channel'),false);

  const callRecord=[],privateId='SIMULATED_PROFILE_SECRET',secret='SIMULATED_DATA';
  const originalCacheHandler=async(event,payload)=>{
    callRecord.push({event,payload});
    if(payload.fail) throw new Error('ORIGINAL_CACHE_FAILURE');
    return {msg:'ORIGINAL_RESULT',data:{reason:'ORIGINAL_POLICY',value:secret}};
  };
  const originalReturn=ipc.on(CHANNEL,originalCacheHandler);
  assert.equal(originalReturn,ipc,'ipcMain.on chain must be preserved');
  assert.equal(ipc._listeners.get(CHANNEL),originalCacheHandler,
    'Native handler is not replaced or removed');
  assert.equal(feature.status().seenOriginalOn,true);
  assert.equal(feature.status().bridged,true);
  assert.equal(ipc.hasHandler(CHANNEL),true,'invoke bridge must be available');

  const event={senderFrame:{url:'file:///C:/Program%20Files/Dyclokpropio/resources/app.asar/dist/index.html#/profiles'}};
  const args={id:privateId,clearTypes:8,localDataConfig:{privateValue:secret}};
  const result=await ipc._handleMap.get(CHANNEL)(event,args);
  assert.deepEqual(result,{msg:'ORIGINAL_RESULT',data:{reason:'ORIGINAL_POLICY',value:secret}},
    'Must pass through exact original response without synthetic success');
  assert.equal(callRecord.length,1);
  assert.equal(callRecord[0].event,event);
  assert.equal(callRecord[0].payload,args,'Original cache flags, id and policy remain untouched');
  await assert.rejects(()=>ipc._handleMap.get(CHANNEL)(event,{fail:true}),
    /ORIGINAL_CACHE_FAILURE/,'Do not swallow original cleanup errors');

  assert.equal(trustedMainWindow({senderFrame:{url:'https://evil.test/dist/index.html'}}),false);
  assert.equal(trustedMainWindow({senderFrame:{url:'file:///tmp/dist/index.html.evil'}}),false);
  assert.equal(trustedMainWindow(event),true);
  assert.throws(()=>ipc._handleMap.get(CHANNEL)(
    {senderFrame:{url:'https://evil.test/dist/index.html'}},args
  ),/DYCLOK_CACHE_IPC_DENIED/);
  assert.equal(callRecord.length,2,'Untrusted renderer must not reach original cache callback');

  // Late original registrations are authoritative and replace ONLY the bridge.
  const native=async()=>({msg:'NATIVE_MAIN_HANDLER'});
  ipc.handle(CHANNEL,native);
  assert.equal(feature.status().bridged,false);
  assert.equal(feature.status().nativeHandleSeen,true);
  assert.equal(ipc._handleMap.get(CHANNEL),native);
  assert.deepEqual(await ipc._handleMap.get(CHANNEL)(event,args),{msg:'NATIVE_MAIN_HANDLER'});
  assert.equal(ipc._listeners.get(CHANNEL),originalCacheHandler);
  assert.equal(callRecord.length,2);

  // A native handle registered first also prevents any bridge.
  const ipc2=fakeElectron();
  ipc2.handle(CHANNEL,native);
  const feature2=installCacheIpcCompatibility(ipc2);
  ipc2.on(CHANNEL,originalCacheHandler);
  assert.equal(feature2.status().bridged,false);
  assert.equal(ipc2._handleMap.get(CHANNEL),native);

  // The compatibility layer MUST NOT install a pretend handler when none
  // has been registered by the original Electron bundle.
  const ipc3=fakeElectron();
  installCacheIpcCompatibility(ipc3);
  assert.equal(ipc3.hasHandler(CHANNEL),false);
  console.log('PASS: original clear-dev-cache implementation reused unmodified for invoke');
  console.log('PASS: original results and failures preserved; no synthetic success/blanket deletion');
  console.log('PASS: native handle takes priority, delayed registrations supported');
  console.log('PASS: only trusted app window can invoke the original operation');
}

main().catch(e=>{console.error(e);process.exitCode=1;});

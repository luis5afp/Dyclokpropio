'use strict';
const assert=require('node:assert/strict');
const {
  CHANNEL,ORIGINAL_UNAVAILABLE,trustedMainWindow,installCacheIpcCompatibility
}=require('../src/main/cache-ipc-compatibility.js');

function fakeElectron(withHasHandler=false){
  const handlers=new Map(),listeners=new Map();
  const ipcMain={
    on(channel,fn){listeners.set(channel,fn);return this;},
    handle(channel,fn){
      if(handlers.has(channel))throw new Error('Duplicate native handle: '+channel);
      handlers.set(channel,fn);
    },
    removeHandler(channel){handlers.delete(channel);},
    _handlers:handlers,_listeners:listeners
  };
  // Real Electron 31 exposes handle(), handleOnce(), removeHandler(),
  // but NOT hasHandler(). Previous tests invented it and concealed a bug.
  if(withHasHandler)ipcMain.hasHandler=(channel)=>handlers.has(channel);
  return ipcMain;
}

async function main(){
  const ipc=fakeElectron();
  assert.equal(typeof ipc.hasHandler,'undefined',
    'Test fixture must match Electron 31: no hasHandler() method');
  const feature=installCacheIpcCompatibility(ipc,{waitMs:0});
  assert.equal(feature.status().hasHandler,true,
    'IPC transport must be registered BEFORE recovered main initialization');
  assert.equal(feature.status().originalRegistered,false,
    'No native cache operation exists until original main loads');
  const event={senderFrame:{url:'file:///C:/Program%20Files/Dyclokpropio/resources/app.asar/dist/index.html#/profiles'}};
  const fakePayload={id:'FAKE_PROFILE_IDENTIFIER',clearTypes:8,
    localDataConfig:{testValue:'SENSITIVE_SIMULATED_DATA'}};
  await assert.rejects(
    ()=>ipc._handlers.get(CHANNEL)(event,fakePayload),
    e=>e.message===ORIGINAL_UNAVAILABLE,
    'Must fail, not simulate success, if the recovered operation never registers');
  const calls=[];
  const native=async (e,payload)=>{
    calls.push([e,payload]);
    if(payload.fail)throw new Error('NATIVE_CACHE_FAILED');
    return {msg:'ORIGINAL_CACHE_RESULT',data:{reason:'ORIGINAL_POLICY'}};
  };
  ipc.handle(CHANNEL,native); // Actual recovered main calls ipcMain.handle.
  assert.equal(feature.status().originalRegistered,true);
  assert.equal(feature.status().originalRegistrations,1);
  assert.deepEqual(await ipc._handlers.get(CHANNEL)(event,fakePayload),
    {msg:'ORIGINAL_CACHE_RESULT',data:{reason:'ORIGINAL_POLICY'}});
  assert.equal(calls.length,1);
  assert.strictEqual(calls[0][0],event);
  assert.strictEqual(calls[0][1],fakePayload,
    'Must preserve original clearTypes, id and localDataConfig exactly');
  await assert.rejects(()=>ipc._handlers.get(CHANNEL)(event,{fail:true}),
    /NATIVE_CACHE_FAILED/,'Must forward native cleanup rejection unchanged');

  assert.equal(trustedMainWindow(event),true);
  assert.equal(trustedMainWindow({senderFrame:{url:'https://evil.test/dist/index.html'}}),false);
  await assert.rejects(
    ()=>ipc._handlers.get(CHANNEL)(
      {senderFrame:{url:'https://evil.test/dist/index.html'}},fakePayload),
    /DYCLOK_CACHE_IPC_DENIED/,'Remote windows cannot request profile deletion');
  assert.equal(calls.length,2,'No remote callback must reach original cleaner');

  ipc.removeHandler(CHANNEL);
  assert.equal(feature.status().originalRegistered,false);
  assert.equal(feature.status().hasHandler,true,
    'Keep stable transport present and require native callback to return');
  await assert.rejects(()=>ipc._handlers.get(CHANNEL)(event,fakePayload),
    e=>e.message===ORIGINAL_UNAVAILABLE);
  ipc.handle(CHANNEL,async()=>false);
  assert.equal(await ipc._handlers.get(CHANNEL)(event,fakePayload),false,
    'Original false return must stay false, not be rewritten as success');
  ipc.handle(CHANNEL,async()=>null);
  assert.equal(await ipc._handlers.get(CHANNEL)(event,fakePayload),null,
    'Original null result must remain null');

  const unrelated=async()=>17;
  ipc.handle('another-native-channel',unrelated);
  assert.equal(ipc._handlers.get('another-native-channel'),unrelated);

  // If the original channel is already bound, it has absolute priority.
  const ipc2=fakeElectron(true),existing=async()=>({native:true});
  ipc2.handle(CHANNEL,existing);
  const feature2=installCacheIpcCompatibility(ipc2,{waitMs:0});
  assert.equal(feature2.status().stableAdapter,false);
  assert.equal(ipc2._handlers.get(CHANNEL),existing);

  // Delayed native registration: the invocation waits for real code,
  // never skips deletion or invents a successful response.
  const ipc3=fakeElectron();
  installCacheIpcCompatibility(ipc3,{waitMs:1000});
  const pending=ipc3._handlers.get(CHANNEL)(event,fakePayload);
  ipc3.handle(CHANNEL,async()=>({native:'after-ready'}));
  assert.deepEqual(await pending,{native:'after-ready'});
  console.log('PASS: clear-dev-cache IPC available early, original main handle() captured');
  console.log('PASS: no native callback means explicit failure, never simulated cleanup');
  console.log('PASS: native payload, result, false/null and exceptions all preserved');
  console.log('PASS: trusted renderer restriction and delayed native registration verified');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

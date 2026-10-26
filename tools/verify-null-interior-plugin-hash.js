'use strict';
// Reproduce the actual failing EXPAND_CHECK handler, not a hand-written imitation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {transform:legacy}=require('./apply-legacy-expand-check.js');
const {transform:instrument}=require('./instrument-open-stages.js');
const {transform:repair,OLD,NEW}=require('./fix-null-interior-plugin-hash.js');

const base=fs.readFileSync(path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js'),'utf8');
const old=instrument(legacy(base));
const patched=repair(old);
assert.notEqual(old,patched);
assert.ok(old.includes(OLD)&&patched.includes(NEW));
assert.ok(patched.includes('checkExpansionSha256Hash('));
assert.ok(patched.includes('new Error(yre.EXPAND_SHA256_CHECK_FAIL)'));
assert.throws(()=>repair(patched),/Reviewed nullable IPC expression missing or duplicated/);

const marker='She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){';
function extract(source){
  const a=source.indexOf(marker),b=source.indexOf('}},Rhe={name:',a);
  assert.ok(a>0&&b>a,'Missing real expansion handler');
  return source.slice(a+marker.length,b);
}
function makeRun(source,pluginHash,remoteAccept){
  const calls=[], sent=[];
  const ctx={
    Qie:{expandSecurity:1,blockOnPluginDownloadFail:2},
    lre:{GLOBAL:0},fte:{ENABLED:1},
    yre:{EXPAND_DOWNLOAD_FAIL:'EXPAND_DOWNLOAD_FAIL',PLUGIN_DOWNLOAD_FAIL_BLOCKED:'PLUGIN_DOWNLOAD_FAIL_BLOCKED',
      EXPAND_SHA256_CHECK_FAIL:'EXPAND_SHA256_CHECK_FAIL'},
    che:(code,msg)=>Object.assign(new Error(code),{msg}),
    uhe:e=>String(e?.message||e),
    voe:{emit:()=>{}},Hf:{OPEN_DETAIL_UPDATE:'extension'},
    C8:{api:{getLocalVersionInfo:async()=>({version:'3.0.0',platform:'win32'})}},
    window:{ipcRenderer:{invoke:async(name)=>{
      calls.push(name);
      if(name==='generate-sha256-hash')return 'genuine-chromium-extension-hash';
      if(name==='generate-sha256-hash-for-plugins')return pluginHash;
      if(name==='read-json-file')return {main:{version:'1.0',desc:'real-version'}};
      throw new Error('Unexpected channel '+name);
    }}},
    console:{warn:()=>{}}
  };
  const handler=vm.runInNewContext('(async function(e){'+extract(source)+'})',ctx);
  const options={
    openEnvDetail:{
      globalOrgVo:{browserConfig:{type:1}},
      browserConfig:'{"browserType":0,"type":0}',
      extensionsType:'ALLOW',
      extensionsList:[]
    },
    checkProxyResult:{},isSuperAdmin:false,
    getCoreExpandList:async()=>[],
    trySendMsg:async(fn,onFail)=>{try{return await fn()}catch(err){return onFail(err)}},
    checkExpansionSha256Hash:async(data)=>{
      sent.push(JSON.parse(JSON.stringify(data)));
      return {extens:[],interiorExtens:[{result:remoteAccept},{result:remoteAccept}]};
    }
  };
  return {calls,sent,handler,open:{envId:'REDACTED',openParams:{startBrowserOptions:{pluginPath:'test',versionPath:'test'}},options}};
}
(async()=>{
  const before=makeRun(old,null,true);
  await assert.rejects(()=>before.handler(before.open),e=>e instanceof Error&&e.name==='TypeError');
  assert.equal(before.sent.length,0,'Before the fix null must crash before remote validation');
  const rejected=makeRun(patched,null,false);
  await assert.rejects(()=>rejected.handler(rejected.open),e=>e.message==='EXPAND_SHA256_CHECK_FAIL');
  assert.equal(rejected.sent.length,1,'Unverified missing checksum must reach remote validator');
  assert.equal(rejected.sent[0].interiorExtens[1].sha256Hash,'',
    'Missing checksum must remain absent, never replaced with a forged checksum');
  assert.equal(rejected.sent[0].interiorExtens[0].sha256Hash,'genuine-chromium-extension-hash');
  const accepted=makeRun(patched,null,true);
  await accepted.handler(accepted.open);
  assert.equal(accepted.sent.length,1);
  const kept=makeRun(patched,'real-local-plugin-sha',true);
  await kept.handler(kept.open);
  assert.equal(kept.sent[0].interiorExtens[1].sha256Hash,'real-local-plugin-sha');
  const strange=makeRun(patched,{notAHash:true},false);
  await assert.rejects(()=>strange.handler(strange.open),e=>e.message==='EXPAND_SHA256_CHECK_FAIL');
  assert.equal(strange.sent[0].interiorExtens[1].sha256Hash,'');
  console.log('PASS: observed null reproduces the original TypeError before reaching remote validation');
  console.log('PASS: repaired null never crashes and missing hash is not faked');
  console.log('PASS: server rejection blocks profiles and real hashes pass unchanged');
})().catch(e=>{console.error(e);process.exitCode=1;});

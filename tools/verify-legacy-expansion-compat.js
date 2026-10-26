'use strict';
// Functional regression: execute the actual obfuscated EXPAND_CHECK handler
// after the narrowly reviewed 2.8.17 compatibility transformation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { transform } = require('./apply-legacy-expand-check.js');

const base=fs.readFileSync(path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js'),'utf8');
const patched=transform(base);
const MARKER='She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){';
const start=patched.indexOf(MARKER),end=patched.indexOf('}},Rhe={name:',start);
assert.ok(start>0&&end>start,'Unexpected EXPAND_CHECK handler boundaries');
const body=patched.slice(start+MARKER.length,end);

function mock({mustDownload=false,security=false,missingHash=false,verified=true}={}) {
  const calls=[];
  const orgFlags=(mustDownload?2:0)|(security?1:0);
  const ctx={
    Qie:{expandSecurity:1,blockOnPluginDownloadFail:2},
    lre:{GLOBAL:0},fte:{ENABLED:1},
    yre:{
      EXPAND_DOWNLOAD_FAIL:'EXPAND_DOWNLOAD_FAIL',
      PLUGIN_DOWNLOAD_FAIL_BLOCKED:'PLUGIN_DOWNLOAD_FAIL_BLOCKED',
      EXPAND_SHA256_CHECK_FAIL:'EXPAND_SHA256_CHECK_FAIL'
    },
    che:(code,msg)=>Object.assign(new Error(code),{msg}),
    uhe:e=>String(e?.message||e),
    voe:{emit:()=>{}},Hf:{OPEN_DETAIL_UPDATE:'extension'},
    C8:{api:{getLocalVersionInfo:async()=>({version:'3.0.0',platform:'win32'})}},
    window:{ipcRenderer:{invoke:async name=>{
      calls.push(name);
      if(name==='generate-sha256-hash'||name==='generate-sha256-hash-for-plugins')
        return missingHash?'':'test-hash';
      if(name==='read-json-file')return {main:{version:'1.0',desc:'test'}};
      throw new Error('Unexpected test IPC: '+name);
    }}},
    console:{warn:()=>{}}
  };
  const handler=vm.runInNewContext('(async function(e){'+body+'})',ctx);
  const options={
    openEnvDetail:{
      globalOrgVo:{browserConfig:{type:orgFlags}},
      browserConfig:'{"browserType":0,"type":0}',
      extensionsType:'ALLOW',
      extensionsList:[{uniqueId:'test-1',status:1,extensionsName:'Test extension'}]
    },
    isSuperAdmin:false,checkProxyResult:{},
    getCoreExpandList:async()=>[],
    trySendMsg:async(fn,fail)=>{try{return await fn()}catch(e){return fail(e)}},
    checkExpansionSha256Hash:async()=>{
      calls.push('remote-integrity-verifier');
      return {extens:[],interiorExtens:[{result:verified},{result:verified}]};
    }
  };
  return {calls,handler,open:{envId:'e1',
    openParams:{startBrowserOptions:{pluginPath:'test',versionPath:'test'}},
    options}};
}

(async()=>{
  let t=mock({security:true,verified:true});
  await t.handler(t.open);
  assert.ok(t.calls.includes('remote-integrity-verifier'));
  assert.deepEqual(Array.from(t.open.options.existExpandList),[]);

  t=mock({security:true,verified:false});
  await assert.rejects(()=>t.handler(t.open),e=>e.message==='EXPAND_SHA256_CHECK_FAIL');

  t=mock({security:true,missingHash:true,verified:false});
  await assert.rejects(()=>t.handler(t.open),e=>e.message==='EXPAND_SHA256_CHECK_FAIL');
  assert.ok(t.calls.includes('remote-integrity-verifier'),
    'Missing hashes must reach (not bypass) integrity verification');

  t=mock({mustDownload:true,security:false});
  await assert.rejects(()=>t.handler(t.open),e=>e.message==='PLUGIN_DOWNLOAD_FAIL_BLOCKED');
  assert.ok(!t.calls.includes('remote-integrity-verifier'));
  console.log('PASS: 2.8.17 extension policy restored; real SHA256 failures still block.');
})().catch(e=>{console.error(e);process.exitCode=1;});

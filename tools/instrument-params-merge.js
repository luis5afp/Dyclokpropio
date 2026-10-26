'use strict';
// Diagnostic-only build transform: safe paramsMerge checkpoints.
// Never change profile settings, local cache policy, SHA256 or IPC results.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {transform:legacy}=require('./apply-legacy-expand-check.js');
const {transform:stages}=require('./instrument-open-stages.js');
const TARGET=path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const DECL='Rhe={name:"参数合并",stepType:zde.PARAMS_MERGE,async handler(e){';
const EMITTER='const DyclokParamsProbe=(checkpoint)=>{try{const task=window.ipcRenderer?.invoke?.("dyclok-diag-event",{kind:"stage",phase:"info",action:"paramsMerge",checkpoint});if(task&&typeof task.catch==="function")task.catch(()=>{})}catch{}};DyclokParamsProbe("begin");';
const changes=[
  [DECL,DECL+EMITTER],
  ['}const ee="disable"!==e.openParams.config.geoType',
   '}DyclokParamsProbe("config-ready");const ee="disable"!==e.openParams.config.geoType'],
  ['if(ee||te||ne||oe){const t=', 'DyclokParamsProbe("geo-start");if(ee||te||ne||oe){const t='],
  ['}e.openParams.urls||(e.openParams.urls=[]);',
   '}DyclokParamsProbe("geo-ready");e.openParams.urls||(e.openParams.urls=[]);'],
  ['e.openParams.localDataConfig=await e.options.delLocalCache(L,R,P)',
   'DyclokParamsProbe("cache-start"),e.openParams.localDataConfig=await(async()=>{try{const data=await e.options.delLocalCache(L,R,P);DyclokParamsProbe("cache-success");return data}catch(error){DyclokParamsProbe("cache-fail");throw error}})()'],
  ['e.options.isShare?e.openParams.orgKey=await',
   'DyclokParamsProbe("keys-start"),e.options.isShare?e.openParams.orgKey=await'],
  ['e.openParams.orgKey=E.orgKey,e.openParams.enableGk=',
   'e.openParams.orgKey=E.orgKey,DyclokParamsProbe("keys-success"),e.openParams.enableGk=']
];
function transform(source){
  const start=source.indexOf(DECL);
  const end=source.indexOf('}},Phe={name:',start);
  assert.ok(start>0&&end>start&&end-start<16000,'Unexpected paramsMerge bounds');
  let body=source.slice(start,end);
  for(const [before,after] of changes){
    assert.equal(body.split(before).length-1,1,'Expected unique paramsMerge checkpoint anchor: '+before.slice(0,90));
    body=body.replace(before,after);
  }
  const output=source.slice(0,start)+body+source.slice(end);
  for(const critical of ['checkExpansionSha256Hash(','generate-sha256-hash-for-plugins','m.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)']){
    assert.ok(output.includes(critical),'Security path changed: '+critical);
  }
  return output;
}
// This stage must work in TWO distinct situations:
//   preflight: Git's unmodified renderer (legacy and stages transformed in memory);
//   --apply: the already verified, ALREADY PATCHED Windows build workspace.
// Calling legacy() again during --apply incorrectly re-applies its exact-match
// changes and aborts the build with "Missing or duplicate change site".
const BASE_SHA256='7de2a353b92c130b93b5c455826efaa6e1c8788cf44f99185b450e61379dc0df';
const EXPECTED_STAGES_SHA256='c31673200543e6b83e4f2f6e0f59835a3322d599e9961b8d5580181c6122bdf0';
function prepareInput(source,apply){
  if(apply){
    assert.equal(hash(source),EXPECTED_STAGES_SHA256,
      'Expected EXACT reviewed renderer after legacy+stage patches. Refusing unexpected input.');
    return source;
  }
  assert.equal(hash(source),BASE_SHA256,'Expected original baseline renderer in preflight.');
  const prepared=stages(legacy(source));
  assert.equal(hash(prepared),EXPECTED_STAGES_SHA256,'Reviewed preflight output changed unexpectedly.');
  return prepared;
}
function main(){
  const current=fs.readFileSync(TARGET,'utf8');
  const apply=process.argv.includes('--apply');
  const expected=prepareInput(current,apply);
  const result=transform(expected);
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-params-probes-'));
  try{
    const file=path.join(folder,'renderer.mjs');fs.writeFileSync(file,result);
    const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8',maxBuffer:1048576});
    assert.equal(checked.status,0,'paramsMerge instrumentation syntax error: '+checked.stderr?.slice(-1500));
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
  if(apply){
    // The hash check in prepareInput guarantees the previous two patches are
    // present exactly once; this transform only injects diagnostic checkpoints.
    fs.writeFileSync(TARGET,result,'utf8');
  }
  console.log('PASS: paramsMerge redacted checkpoints; runtime behavior preserved.');
  console.log('Build SHA:',hash(expected),'->',hash(result));
}
if(require.main===module)main();
module.exports={transform,changes,prepareInput,BASE_SHA256,EXPECTED_STAGES_SHA256};

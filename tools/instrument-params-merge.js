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
function main(){
  const baseline=fs.readFileSync(TARGET,'utf8');
  const expected=stages(legacy(baseline));
  const result=transform(expected);
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-params-probes-'));
  try{
    const file=path.join(folder,'renderer.mjs');fs.writeFileSync(file,result);
    const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8',maxBuffer:1048576});
    assert.equal(checked.status,0,'paramsMerge instrumentation syntax error: '+checked.stderr?.slice(-1500));
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
  if(process.argv.includes('--apply')){
    const current=fs.readFileSync(TARGET,'utf8');
    assert.equal(hash(current),hash(expected),'Missing prior verified legacy and stage patches');
    fs.writeFileSync(TARGET,result,'utf8');
  }
  console.log('PASS: paramsMerge redacted checkpoints; runtime behavior preserved.');
  console.log('Build SHA:',hash(expected),'->',hash(result));
}
if(require.main===module)main();
module.exports={transform,changes};

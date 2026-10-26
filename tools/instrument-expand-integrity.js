'use strict';
/*
 * Read-only probe for v30.0.14 extension integrity errors.
 * Runs ONLY after verified renderer patches, NEVER changes the original
 * checkExpansionSha256Hash request, payload or acceptance decision.
 * Writes only two fixed-category checkpoints (no names/ids/hash values).
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {transform:legacy,BASE_SHA256}=require('./apply-legacy-expand-check.js');
const {transform:stages}=require('./instrument-open-stages.js');
const {transform:params}=require('./instrument-params-merge.js');
const TARGET=path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js');
const SHA=input=>crypto.createHash('sha256').update(input).digest('hex');
const DECL='She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){';
const DECISION='m.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)';
const HOOK='const DyclokExtensionAudit=(m)=>{try{for(const g of [["ext",m?.extens],["internal",m?.interiorExtens]]){const category=g[0],items=g[1],checkpoint=!Array.isArray(items)?"integrity-invalid-response":items.some(i=>!i?.result)?category==="ext"?"integrity-ext-reject":"integrity-internal-reject":category==="ext"?"integrity-ext-accept":"integrity-internal-accept";const p=window.ipcRenderer?.invoke?.("dyclok-diag-event",{kind:"stage",phase:"info",action:"expandCheck",checkpoint});if(p&&typeof p.catch==="function")p.catch(()=>{})}}catch{}};';
function transform(source){
  assert.equal(source.split(DECL).length-1,1,'Expected exactly one expansion-check handler');
  const start=source.indexOf(DECL),end=source.indexOf('}},Rhe={name:',start);
  assert.ok(end>start&&end-start<8000,'Unexpected expansion-check bounds');
  const before=source.slice(start,end);
  assert.equal(before.split(DECISION).length-1,1,'Expected one unaltered integrity decision');
  assert.ok(before.includes('checkExpansionSha256Hash('),'Mandatory remote integrity verification missing');
  const after=before.replace(DECL,DECL+HOOK)
    .replace(DECISION,'(DyclokExtensionAudit(m),'+DECISION+')');
  const result=source.slice(0,start)+after+source.slice(end);
  for(const term of ['generate-sha256-hash-for-plugins','checkExpansionSha256Hash(','new Error(yre.EXPAND_SHA256_CHECK_FAIL)',DECISION]){
    assert.ok(result.includes(term),'Security expression changed: '+term);
  }
  return result;
}
function preparedBaseline(){
  const original=fs.readFileSync(TARGET,'utf8');
  assert.equal(SHA(original),BASE_SHA256,'Protected renderer baseline changed');
  return params(stages(legacy(original)));
}
function main(){
  const apply=process.argv.includes('--apply');
  const current=fs.readFileSync(TARGET,'utf8');
  const expected=preparedBaseline();
  if(apply)assert.equal(SHA(current),SHA(expected),'Unexpected post-patch renderer: audit not installed');
  else assert.equal(SHA(current),BASE_SHA256,'Expected unmodified source before preflight');
  const result=transform(expected);
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-integrity-audit-'));
  try{
    const f=path.join(dir,'renderer.mjs');
    fs.writeFileSync(f,result);
    const check=spawnSync(process.execPath,['--check',f],{encoding:'utf8',maxBuffer:1024*1024});
    assert.equal(check.status,0,'Integrity probe syntax invalid: '+check.stderr?.slice(-1000));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
  if(apply)fs.writeFileSync(TARGET,result,'utf8');
  console.log('PASS: unmodified integrity decision, metadata-only group checkpoints. Output hash='+SHA(result));
}
if(require.main===module)main();
module.exports={transform,HOOK,DECL,DECISION,preparedBaseline};

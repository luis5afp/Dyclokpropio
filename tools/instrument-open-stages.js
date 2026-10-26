'use strict';
// Build-only instrumentation of the Jde opening step state machine.
// MUST run after tools/apply-legacy-expand-check.js --apply.
// The diagnostic records step type and a strict error-code token only.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const TARGET=path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js');
const EXPECTED_LEGACY_SHA='04aeafcf291e98d4ab2f632f77c49d21d5cfda3c813addbc433fd8dd2a3cf37b';
function sha(s){return crypto.createHash('sha256').update(s).digest('hex');}
const sites=[
  ['class Jde{constructor()',
   'const DyclokStage=(e,t,n)=>{try{const a=e&&e.error,b=a&&(a.errorCode||a.message)||"",c=typeof b==="string"&&/^[A-Z][A-Z0-9_]{2,79}$/.test(b)?b:"UNCLASSIFIED",d=a&&a.name||"Other",x=window.ipcRenderer?.invoke?.("dyclok-open-stage",{step:t.stepType,phase:n,code:c,errorClass:d});x&&typeof x.catch==="function"&&x.catch(()=>{})}catch{}};class Jde{constructor()'],
  ['emitStepStart(e,t){for(const n of this.stepStartListeners)n(e,t)}',
   'emitStepStart(e,t){DyclokStage(e,t,"start");for(const n of this.stepStartListeners)n(e,t)}'],
  ['emitStepSuccess(e,t){for(const n of this.stepSuccessListeners)n(e,t)}',
   'emitStepSuccess(e,t){DyclokStage(e,t,"success");for(const n of this.stepSuccessListeners)n(e,t)}'],
  ['emitStepFail(e,t){for(const n of this.stepFailListeners)n(e,t)}',
   'emitStepFail(e,t){DyclokStage(e,t,"fail");for(const n of this.stepFailListeners)n(e,t)}'],
  ['async handleCatchErrorStep(e,t=!1){var n,a,o;',
   'async handleCatchErrorStep(e,t=!1){DyclokStage(e,{stepType:zde.CATCH_ERROR},"terminal");var n,a,o;']
];
function transform(source){
  let changed=source;
  for(const [from,to] of sites){
    assert.equal(changed.split(from).length-1,1,'Expected unique stage instrumentation site');
    changed=changed.replace(from,to);
  }
  for(const required of ['checkExpansionSha256Hash(','generate-sha256-hash-for-plugins','m.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)']){
    assert.ok(changed.includes(required),'Security check unexpectedly missing: '+required);
  }
  return changed;
}
function main(){
  const original=fs.readFileSync(TARGET);
  assert.equal(sha(original),EXPECTED_LEGACY_SHA,'Legacy renderer did not match reviewed v30.0.7 output');
  const changed=transform(original.toString('utf8'));
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-open-stage-'));
  try{
    const file=path.join(tmp,'renderer.mjs');
    fs.writeFileSync(file,changed);
    const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8',maxBuffer:1024*1024});
    assert.equal(result.status,0,'Renderer syntax check failed: '+result.stderr?.slice(-1500));
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
  if(process.argv.includes('--apply')){
    fs.writeFileSync(TARGET,changed,'utf8');
    console.log('Installed redacted per-stage diagnostic into Windows renderer workspace.');
  }
  console.log('Opening-stage trace:',sha(original),'->',sha(changed));
}
if(require.main===module)main();
module.exports={transform,EXPECTED_LEGACY_SHA};

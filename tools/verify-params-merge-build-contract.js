'use strict';
// Regression for Windows v30.0.11 failed build: --apply was applying
// legacy() a second time, which cannot match an already patched renderer.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {transform,prepareInput,BASE_SHA256,EXPECTED_STAGES_SHA256}=require('./instrument-params-merge.js');
const base=fs.readFileSync(path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js'),'utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(sha(base),BASE_SHA256);
const staged=prepareInput(base,false);
assert.equal(sha(staged),EXPECTED_STAGES_SHA256);
assert.equal(prepareInput(staged,true),staged,
  'Windows --apply must accept verified output of previous patch steps directly');
assert.throws(()=>prepareInput(staged,false),/original baseline renderer/,
  'Preflight must reject already patched code to avoid duplicate patches');
assert.throws(()=>prepareInput(base,true),/reviewed renderer/,
  '--apply must refuse the unpatched baseline');
assert.throws(()=>prepareInput(staged+' ',true),/reviewed renderer/,
  'Any unreviewed input modification must be rejected');
const decorated=transform(staged);
assert.ok(decorated.includes('DyclokParamsProbe("cache-fail")'));
assert.ok(decorated.includes('DyclokParamsProbe("keys-start")'));
assert.ok(decorated.includes('checkExpansionSha256Hash('));
assert.ok(decorated.includes('generate-sha256-hash-for-plugins'));
assert.ok(decorated.includes('m.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)'));
assert.throws(()=>transform(decorated),/Expected unique/,
  'Must refuse duplicate checkpoint insertion');
console.log('PASS: exact baseline -> legacy+stage -> paramsMerge pipeline');
console.log('PASS: Windows --apply accepts verified already-patched SHA without reapplying legacy');
console.log('PASS: unreviewed/double-patched renderer rejected; integrity verification retained');

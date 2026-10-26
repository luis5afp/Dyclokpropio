'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {transform:legacy}=require('./apply-legacy-expand-check.js');
const {transform:instrument}=require('./instrument-open-stages.js');
const {registerOpenStageDiagnostics,sanitize,CHANNEL}=require('../src/main/open-stage-diagnostics.js');

const root=path.resolve(__dirname,'..');
const renderer=fs.readFileSync(path.join(root,'dist/assets/index-BUIbb6Pa.js'),'utf8');
const modified=instrument(legacy(renderer));
for(const needle of [
  'emitStepStart(e,t){DyclokStage(e,t,"start");',
  'emitStepFail(e,t){DyclokStage(e,t,"fail");',
  'emitStepSuccess(e,t){DyclokStage(e,t,"success");',
  'async handleCatchErrorStep(e,t=!1){DyclokStage(e,{stepType:zde.CATCH_ERROR},"terminal");'
])assert.ok(modified.includes(needle),'Missing real renderer instrumentation: '+needle);

const begin=modified.indexOf('const DyclokStage=(e,t,n)=>');
const end=modified.indexOf('class Jde{constructor()',begin);
assert.ok(begin>=0&&end>begin,'Stage hook helper not installed');
const calls=[];
const fn=new Function('window',modified.slice(begin,end)+';return DyclokStage;')({
  ipcRenderer:{invoke:async(channel,data)=>{calls.push({channel,data});return true;}}
});
(async()=>{
 fn({envId:'PRIVATE-ID',error:{name:'Error',message:'my token=private'}},{stepType:'expandCheck'},'fail');
 fn({error:{name:'TypeError',message:'EXPAND_SHA256_CHECK_FAIL'}},{stepType:'openEnv'},'fail');
 await Promise.resolve();
 assert.equal(calls.length,2);
 assert.equal(calls[0].channel,CHANNEL);
 assert.deepEqual(Object.keys(calls[0].data).sort(),['code','errorClass','phase','step']);
 assert.equal(calls[0].data.code,'UNCLASSIFIED');
 assert.equal(calls[1].data.code,'EXPAND_SHA256_CHECK_FAIL');
 assert.equal(JSON.stringify(calls).includes('PRIVATE-ID'),false);
 assert.equal(JSON.stringify(calls).includes('token='),false);
 assert.equal(sanitize({step:'fetchEnvInfo',phase:'fail',code:'SECRETS=leak'}).code,'UNCLASSIFIED');
 assert.equal(sanitize({step:'bogus',phase:'fail',code:'ERROR'}),null);

 const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-stage-'));
 try {
  const handlers=new Map();
  const ipc={handle:(name,handler)=>handlers.set(name,handler)};
  registerOpenStageDiagnostics(ipc,{isReady:()=>true,getPath:(name)=>{assert.equal(name,'userData');return fixture;}});
  const handler=handlers.get(CHANNEL);
  assert.equal(typeof handler,'function');
  await handler({}, {...calls[0].data,envId:'DO-NOT-RECORD',url:'https://private.local',cookie:'SECRET'});
  await handler({}, calls[1].data);
  const log=fs.readFileSync(path.join(fixture,'dyclok-open-stage.jsonl'),'utf8');
  const rows=log.trim().split(/\r?\n/).map(s=>JSON.parse(s));
  assert.equal(rows.length,2);
  assert.equal(rows[1].code,'EXPAND_SHA256_CHECK_FAIL');
  assert.equal(rows[0].step,'expandCheck');
  assert.deepEqual(Object.keys(rows[0]).sort(),['code','errorClass','phase','step','utc']);
  for(const secret of ['PRIVATE-ID','DO-NOT-RECORD','https://private.local','SECRET'])assert.equal(log.includes(secret),false);
 }finally{fs.rmSync(fixture,{recursive:true,force:true});}
 console.log('PASS: opening stage and sanitized code captured at real renderer fail hooks');
 console.log('PASS: Electron stage logger saves no profile identifier, URL, cookie or raw error text');
})().catch(e=>{console.error(e);process.exitCode=1;});

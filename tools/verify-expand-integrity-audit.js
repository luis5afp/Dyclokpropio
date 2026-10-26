'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {transform,HOOK,DECISION,preparedBaseline}=require('./instrument-expand-integrity.js');
const {sanitize}=require('../src/main/diagnostic-console.js');
const source=preparedBaseline();
const out=transform(source);
assert.ok(out.includes('(DyclokExtensionAudit(m),'+DECISION+')'));
assert.equal(out.split('checkExpansionSha256Hash(').length,source.split('checkExpansionSha256Hash(').length);
assert.equal(out.split('new Error(yre.EXPAND_SHA256_CHECK_FAIL)').length,source.split('new Error(yre.EXPAND_SHA256_CHECK_FAIL)').length);
const events=[];
const helper=Function('window',HOOK+'return DyclokExtensionAudit;')({
 ipcRenderer:{invoke:(channel,data)=>{
   assert.equal(channel,'dyclok-diag-event');
   events.push(data);
   return Promise.resolve(true);
 }}
});
const secret='NEVER_LOG_PLUGIN_HASH_PROFILE_ID_OR_NAME';
helper({extens:[{result:false,name:secret,sha256Hash:secret}],interiorExtens:[{result:true,hash:secret}]});
assert.deepEqual(events.map(x=>x.checkpoint),['integrity-ext-reject','integrity-internal-accept']);
events.length=0;
helper({extens:[],interiorExtens:[{result:false,id:secret}]});
assert.deepEqual(events.map(x=>x.checkpoint),['integrity-ext-accept','integrity-internal-reject']);
events.length=0;
helper({extens:null,interiorExtens:undefined});
assert.deepEqual(events.map(x=>x.checkpoint),['integrity-invalid-response','integrity-invalid-response']);
for(const event of events){
  assert.deepEqual(Object.keys(event).sort(),['action','checkpoint','kind','phase']);
  assert.equal(event.action,'expandCheck');
}
const allowed=sanitize({kind:'stage',phase:'info',action:'expandCheck',checkpoint:'integrity-ext-reject',
  id:secret,sha256Hash:secret,url:'https://sensitive.invalid'});
assert.equal(allowed.checkpoint,'integrity-ext-reject');
assert.equal(sanitize({kind:'stage',phase:'info',action:'other',checkpoint:'integrity-ext-reject'}).checkpoint,'none');
assert.equal(sanitize({kind:'stage',phase:'info',action:'expandCheck',checkpoint:secret}).checkpoint,'none');
assert.equal(JSON.stringify([events,allowed]).includes(secret),false);
console.log('PASS: remote integrity hashes and acceptance decision are untouched');
console.log('PASS: only allowlisted external/internal integrity status is logged; no ID/hash/url');

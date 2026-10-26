'use strict';
// Targeted crash fix for observed fulfilled IPC value null.
// Must run only AFTER hash-protected v30.0.7 expansion compatibility AND
// redacted stage instrumentation are applied to the build workspace.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const os = require('node:os');
const {spawnSync} = require('node:child_process');

const TARGET = path.resolve(__dirname,'../dist/assets/index-BUIbb6Pa.js');
const START = 'She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){';
const END = '}},Rhe={name:"参数合并"';
const OLD = 'r="fulfilled"===n.status?n.value:""';
const NEW = 'r="fulfilled"===n.status&&typeof n.value==="string"?n.value:""';

function transform(source) {
  assert.equal(typeof source,'string');
  const begin = source.indexOf(START);
  assert.ok(begin>=0&&source.indexOf(START,begin+1)===-1,'Expected one original EXPAND_CHECK handler');
  const end = source.indexOf(END,begin+START.length);
  assert.ok(end>begin&&end-begin<7000,'Unexpected expansion handler bounds');
  const before = source.slice(begin,end);
  assert.equal(before.split(OLD).length-1,1,'Reviewed nullable IPC expression missing or duplicated');
  // These exact conditions MUST remain unchanged. Never skip server verification,
  // fabricate a checksum, or make a missing hash pass a security policy.
  for(const required of [
    'generate-sha256-hash-for-plugins',
    'checkExpansionSha256Hash(',
    'm.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)',
    'new Error(yre.EXPAND_SHA256_CHECK_FAIL)',
    'r.slice(0,10)'
  ])assert.ok(before.includes(required),'Required integrity operation missing: '+required);
  assert.ok(source.includes('DyclokStage(e,t,"start")'),
    'Expected verified stage instrumentation to be applied before null-hash repair');
  const after = before.replace(OLD,NEW);
  assert.ok(after.includes('r.slice(0,10)'));
  assert.ok(after.includes('checkExpansionSha256Hash('));
  assert.ok(after.includes('new Error(yre.EXPAND_SHA256_CHECK_FAIL)'));
  return source.slice(0,begin)+after+source.slice(end);
}
function digest(data){return crypto.createHash('sha256').update(data).digest('hex');}
function main(){
  const input=fs.readFileSync(TARGET);
  const output=transform(input.toString('utf8'));
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-null-plugin-'));
  try{
    const file=path.join(dir,'renderer.mjs');
    fs.writeFileSync(file,output,'utf8');
    const check=spawnSync(process.execPath,['--check',file],{encoding:'utf8',maxBuffer:1024*1024});
    assert.equal(check.status,0,'Invalid renderer after null-hash fix: '+check.stderr.slice(-1200));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
  if(process.argv.includes('--apply'))fs.writeFileSync(TARGET,output,'utf8');
  console.log('PASS: null from interior plugin SHA256 IPC is normalized to absent hash; remote verification still mandatory.');
  console.log('Checked renderer:',digest(input),'->',digest(output));
}
if(require.main===module)main();
module.exports={transform,OLD,NEW};

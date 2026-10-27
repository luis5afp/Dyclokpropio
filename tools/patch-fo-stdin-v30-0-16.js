#!/usr/bin/env node
'use strict';
/**
 * Dyclokpropio 30.0.16: guard one verified null-child-process stdin use.
 * Prevents a secondary exception on shutdown; it does not fix an earlier
 * Electron failure or prove Chromium profiles open. Fail closed on changes.
 * Run only after tools/verify-safe-base.js, on a disposable checkout.
 */
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const cp = require('node:child_process');
const EXPECTED_SHA = '1fe224de31533973bffc386ee830c878c9ef2ce09199de3a4bc7c3268b9371ac';
const FILENAME = 'dist-electron/main-CuCOh59n.js';
const ANCHOR = "const _0xb5a7c8=JSON[_0x521c4a(_0x5b6060._0x3ab88e,_0x5b6060._0xef10b5)](_0x22a560);fo[_0x521c4a('0x1f6a',0x3d3d)]";
const GUARD = "/* DYCLOK_V30_0_16_FO_STDIN_GUARD */if(!fo||!fo.stdin||fo.stdin.destroyed||fo.stdin.writableEnded||fo.stdin.writable===false)return;";
const REPLACEMENT = ANCHOR.replace(';fo[', ';'+GUARD+'fo[');
const sha256 = x => crypto.createHash('sha256').update(x).digest('hex');
function replaceExactlyOnce(source) {
  const a=source.indexOf(ANCHOR);
  if(a<0 || source.indexOf(ANCHOR,a+1)!==-1)throw Error('Unexpected obfuscated runtime: unique validated anchor is absent or duplicated');
  if(source.includes('DYCLOK_V30_0_16_FO_STDIN_GUARD'))throw Error('Already patched; aborting');
  return source.slice(0,a)+REPLACEMENT+source.slice(a+ANCHOR.length);
}
function selfTest() {
  const t = "const _0x5b6060={_0x3ab88e:1,_0xef10b5:2};const _0x22a560={value:'ok'};\n"+
    "const _0x521c4a=(a)=>a===1?'stringify':a==='0x1f6a'?'stdin':'write';\n"+
    'function run(fo){'+ANCHOR+"['write']('test')}\nmodule.exports=run;";
  const fixed=replaceExactlyOnce(t);
  if(!fixed.includes(GUARD)||fixed.length!==t.length+GUARD.length)throw Error('Transformation invariant failed');
  const vm=require('node:vm');const sandbox={module:{exports:null},JSON};
  vm.runInNewContext(fixed,sandbox,{timeout:1500});
  sandbox.module.exports(null);
  let wrote='';
  sandbox.module.exports({stdin:{write:value=>{wrote+=value},writable:true,destroyed:false,writableEnded:false}});
  if(wrote!=='test')throw Error('Live child process write was changed');
  console.log('PASS: anchored FO patch syntax and null/live process branches');
}
function main() {
  if(process.argv.includes('--self-test'))return selfTest();
  if(process.argv[2]!=='--apply'||!process.argv[3])throw Error('Usage: node patch-fo-stdin-v30-0-16.js --self-test | --apply <source-root>');
  const root=path.resolve(process.argv[3]);const filename=path.join(root,...FILENAME.split('/'));
  const bytes=fs.readFileSync(filename),actual=sha256(bytes);
  if(actual!==EXPECTED_SHA)throw Error('Protected JS hash mismatch: expected '+EXPECTED_SHA+' got '+actual);
  const original=bytes.toString('utf8'),fixed=replaceExactlyOnce(original);
  if(sha256(Buffer.from(original,'utf8'))!==actual)throw Error('Original bundle encoding mismatch');
  const temp=filename+'.v30-0-16-temp.js';
  if(fs.existsSync(temp))throw Error('Temporary patch file already exists');
  fs.writeFileSync(temp,fixed,'utf8');
  try{
    const check=cp.spawnSync(process.execPath,['--check',temp],{encoding:'utf8',timeout:90000,windowsHide:true});
    if(check.error||check.status!==0)throw Error('Node syntax check failed: '+(check.error?.message||check.stderr||check.status));
    fs.renameSync(temp,filename);
  }finally{if(fs.existsSync(temp))fs.rmSync(temp);}
  const observed=sha256(fs.readFileSync(filename));
  if(!fs.readFileSync(filename,'utf8').includes(GUARD))throw Error('Patched JS failed post-write verification');
  console.log('FO_STDIN_GUARD_APPLIED=true');
  console.log('ORIGINAL_SHA256='+actual);
  console.log('PATCHED_SHA256='+observed);
  console.log('NOTE=Guard handles absent child process only; main Electron startup and profiles still require checks');
}
try{main();}catch(e){console.error('RELEASE_BLOCKED: '+e.message);process.exitCode=1}

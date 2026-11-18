'use strict';
// Inspect only the shipped, pinned vendor JavaScript enum definitions.
// No profiles, sessions, credentials, cookies or network traffic are read.
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const asar=createRequire(path.join(__dirname,'../release-build/native-0.3.9/package.json'))('@electron/asar');
const archive=process.argv[2];
if(!archive||!fs.existsSync(archive))throw Error('ASAR archive required');
const raw=asar.getRawHeader(archive);
const header=typeof raw.header==='string'?JSON.parse(raw.header):raw.header;
function readPacked(name){
 let node=header;
 for(const k of name.split('/'))node=node.files?.[k];
 if(!node||node.link||node.unpacked||!Number.isSafeInteger(node.size)||
    node.size>30*1024*1024||!Number.isSafeInteger(Number(node.offset)))
   throw Error('PACKED_JS_MODULE_NOT_FOUND: '+name);
 const f=fs.openSync(archive,'r'),bytes=Buffer.alloc(node.size);
 try{
  const count=fs.readSync(f,bytes,0,node.size,8+raw.headerSize+Number(node.offset));
  if(count!==node.size)throw Error('SHORT_JS_READ');
 }finally{fs.closeSync(f);}
 return bytes.toString('utf8');
}
const env=readPacked('dist/assets/envList-CYDbiryu.js');
const main=readPacked('dist/assets/index-bGjMkmkL.js');
const needles=['FETCH_ENV_INFO','PRE_DATA_INJECT','COOKIE_ENCRYPT_PLAN','EXPAND_CHECK','PARAMS_MERGE','OPEN_ENV','LOCK_ENV'];
const detail={};
for(const [name,source] of [['env',env],['index',main]]){
 detail[name]={bytes:source.length};
 for(const word of needles){
  const pos=source.indexOf(word);
  detail[name][word]=pos<0?null:source.slice(Math.max(0,pos-200),pos+220);
 }
}
const section=env.slice(0,5500);
detail.env.importAliasM=section.match(/.{0,100} as M.{0,100}/)?.[0]||null;
detail.env.importHead=section.slice(0,1250);
process.stdout.write('OFFICIAL_307_STAGE_ENUM='+JSON.stringify(detail)+'\n');

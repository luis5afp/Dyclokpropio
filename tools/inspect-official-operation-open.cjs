'use strict';
/**
 * Read-only inspector for exact pinned DICloak 3.0.7 vendor ASAR.
 * Outputs short UI wiring fragments only. No profiles, cookies or local
 * data are read or uploaded. Never prints raw network responses.
 */
const path=require('node:path');
const fs=require('node:fs');
const os=require('node:os');
const {createRequire}=require('node:module');
const asar=createRequire(path.join(__dirname,'../release-build/native-0.3.4/package.json'))('@electron/asar');
const archive=process.argv[2];
if(!archive||!fs.existsSync(archive))throw Error('Official pinned ASAR path required');
const target='dist/assets/envList-CYDbiryu.js';
const headerRaw=asar.getRawHeader(archive);
const header=typeof headerRaw.header==='string'?JSON.parse(headerRaw.header):headerRaw.header;
const assetFiles=header?.files?.dist?.files?.assets?.files||{};
const names=Object.keys(assetFiles).filter(x=>x.startsWith('envList-')&&x.endsWith('.js'));
process.stdout.write('ENV_LIST_ASAR_FILES='+JSON.stringify(names)+'\n');
if(!assetFiles['envList-CYDbiryu.js'])
  throw Error('Pinned vendor 3.0.7 table module missing from this archive');
const entry=assetFiles['envList-CYDbiryu.js'];
if(entry.unpacked||entry.link||!Number.isSafeInteger(entry.size)||
   entry.size<1000||entry.size>2000000||
   !/^[0-9]+$/.test(String(entry.offset)))throw Error('Expected a regular packed envList bundle');
const base=8+headerRaw.headerSize;
const offset=base+Number(entry.offset);
const fd=fs.openSync(archive,'r');
const bytes=Buffer.alloc(entry.size);
try{
  const got=fs.readSync(fd,bytes,0,bytes.length,offset);
  if(got!==bytes.length)throw Error('Incomplete native envList source read');
}finally{fs.closeSync(fd);}
const js=bytes.toString('utf8');
if(!js.includes('prop:"operation"'))throw Error('Unexpected official envList content or ASAR offset');

const needles=[
  {name:'operation-column',needle:'prop:"operation"',before:70,after:550},
  {name:'operation-slot',needle:'operation:u(e=>',before:140,after:1500},
  {name:'open-button-label',needle:'env.env.btnOpen',before:400,after:400},
  {name:'open-env-hook',needle:'openEnv:',before:100,after:250},
  {name:'opening-step-hook',needle:'.onStepStart(',before:90,after:320},
  {name:'opening-success-hook',needle:'.onStepSuccess(',before:90,after:320},
];
for(const n of needles){
 const p=js.indexOf(n.needle);
 process.stdout.write('ANCHOR '+n.name+' '+p+': '+JSON.stringify(p<0?null:js.slice(Math.max(p-n.before,0),p+n.after))+'\n');
}
process.stdout.write('NATIVE_ENVLIST_BYTES='+js.length+'\n');

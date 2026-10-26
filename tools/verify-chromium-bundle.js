#!/usr/bin/env node
'use strict';
/** Validate every staged browser asset is reproduced in the unpacked NSIS app.
 * Does not execute chromium, alter user data, or bypass runtime checks.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {validateInstalled}=require('./stage-full-chromium.js');
function filesUnder(folder,base=folder,result=new Map()){
  for(const x of fs.readdirSync(folder,{withFileTypes:true})){
    const abs=path.join(folder,x.name);
    if(x.isDirectory())filesUnder(abs,base,result);
    else if(x.isFile())result.set(path.relative(base,abs).replace(/\\/g,'/'),abs);
    else throw Error('Unexpected link or nonfile in Chromium source');
  }
  return result;
}
function hash(file){
  const h=crypto.createHash('sha256');
  const f=fs.openSync(file,'r'); const b=Buffer.allocUnsafe(1024*1024);
  try{let n;while((n=fs.readSync(f,b,0,b.length,null))>0)h.update(b.subarray(0,n))}
  finally{fs.closeSync(f)}
  return h.digest('hex');
}
function verify(sourceDir,installedDir){
  const original=validateInstalled(sourceDir),bundled=validateInstalled(installedDir);
  if(original.version!==bundled.version)throw Error('Packaged Chromium version does not match staged engine');
  const a=filesUnder(path.join(sourceDir,'Chromium'));
  const b=filesUnder(path.join(installedDir,'Chromium'));
  if(a.size!==b.size)throw Error('Bundled Chromium file count mismatch');
  for(const [name,orig] of a){
    const installed=b.get(name);
    if(!installed)throw Error('Missing packaged Chromium resource '+name);
    if(fs.statSync(orig).size!==fs.statSync(installed).size)throw Error('Packaged Chromium resource size changed '+name);
  }
  const critical=[
    'Application/ginsbrowser.exe',
    'Application/'+original.version+'/chrome.dll',
    'Application/'+original.version+'/resources.pak',
    'Application/'+original.version+'/icudtl.dat'
  ];
  for(const name of critical){
    if(hash(a.get(name))!==hash(b.get(name)))throw Error('Critical Chromium file SHA256 changed '+name);
  }
  console.log('BUNDLED_CHROMIUM_COMPLETE='+JSON.stringify({
    verified:true,files:a.size,version:original.version,
    criticalHashesMatch:true,includesOriginalSubtrees:Array.from(a.keys()).some(x=>x.startsWith('ginsbrowser/'))
  }));
}
if(require.main===module)try{
  const dir=process.argv[2]||'release/win-unpacked';
  verify(process.cwd(),path.resolve(dir));
}catch(e){console.error('CHROMIUM_PACKAGE_INVALID:',e.message);process.exitCode=1}
module.exports={verify};

#!/usr/bin/env node
'use strict';
// Windows CI ONLY. All files are deliberately INVALID / NONEXECUTABLE.
// Allows integration testing Electron boot + NSIS layout when the
// privately supplied authorized Chromium engine is not on GitHub runners.
// Must never be included in any published release.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
if(process.env.CI!=='true'||process.env.GITHUB_ACTIONS!=='true'||
   process.env.DYCLOK_CI_SYNTHETIC_CHROMIUM!=='I_UNDERSTAND_THIS_IS_NOT_A_REAL_BROWSER'){
  throw Error('Blocked: synthetic Chromium fixture may only be created by explicit CI smoke job');
}
const root=path.resolve(__dirname,'..','Chromium');
if(fs.existsSync(root))throw Error('Refusing to overwrite existing Chromium tree');
const app=path.join(root,'Application'),version='142.0.7444.273',ver=path.join(app,version);
const ext=path.join(root,'ginsbrowser','.ginsextension2');
fs.mkdirSync(ver,{recursive:true});
fs.mkdirSync(ext,{recursive:true});
function write(relative,bytes){
  const to=path.join(root,relative);
  fs.mkdirSync(path.dirname(to),{recursive:true});
  const fd=fs.openSync(to,'wx');
  try{
    const marker=Buffer.from('SYNTHETIC_CI_FIXTURE_NOT_A_REAL_CHROMIUM_BROWSER_DO_NOT_RELEASE');
    fs.writeSync(fd,marker,0,marker.length,0);
    if(bytes>marker.length)fs.ftruncateSync(fd,bytes);
  }finally{fs.closeSync(fd)}
}
write('Application/ginsbrowser.exe',1_000_128);
write('Application/'+version+'/chrome.dll',100_000_128);
for(const file of ['icudtl.dat','resources.pak','v8_context_snapshot.bin','chrome_100_percent.pak']){
  write('Application/'+version+'/'+file,150);
}
for(let i=0;i<45;i++)write('Application/'+version+'/locales/fake_'+i+'.pak',128);
write('ginsbrowser/.ginsextension2/manifest.json',128);
fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({main:{version:'142.1.7'},others:[]}));
assert.equal(fs.existsSync(path.join(root,'Application','ginsbrowser.exe')),true);
console.log('CHROMIUM_SOURCE_IS_SYNTHETIC=true');
console.log('CHROMIUM_SOURCE_PROVENANCE=CI_FIXTURE_ONLY');
console.log('PROFILE_BROWSER_TEST=NOT_PERFORMED');

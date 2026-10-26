'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const AdmZip=require('adm-zip');
const {stage,inspect,filenameSafe}=require('./stage-full-chromium.js');
const {verify}=require('./verify-chromium-bundle.js');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-chromium-fixture-'));
try {
  const ver='142.0.7444.273';
  const files=path.join(tmp,'fixture','Chromium');
  const base=path.join(files,'Application',ver);
  fs.mkdirSync(base,{recursive:true});
  fs.mkdirSync(path.join(files,'ginsbrowser','.ginsextension2'),{recursive:true});
  // Sizes must meet native binary minimums. Contents are synthetic zeros,
  // never published and never executed.
  fs.writeFileSync(path.join(files,'Application','ginsbrowser.exe'),Buffer.alloc(1_000_002));
  fs.writeFileSync(path.join(base,'chrome.dll'),Buffer.alloc(100_000_002));
  for(const name of ['resources.pak','icudtl.dat','v8_context_snapshot.bin']){
    fs.writeFileSync(path.join(base,name),Buffer.from('SYNTHETIC '+name));
  }
  fs.writeFileSync(path.join(files,'ginsbrowser','.ginsextension2','manifest.json'),
    '{"name":"SYNTHETIC-DO-NOT-SHIP","version":"0.0.0"}');
  for(let i=0;i<45;i++)fs.writeFileSync(path.join(base,'locale-'+i+'.pak'),'dummy');
  const src=path.join(tmp,'fixture');
  const zip1=new AdmZip();zip1.addLocalFolder(src);
  const zipFile=path.join(tmp,'legacy.zip');zip1.writeZip(zipFile);
  const staged=path.join(tmp,'build');fs.mkdirSync(staged);
  const metadata=stage(zipFile,staged);
  assert.equal(metadata.version,ver);
  assert.ok(metadata.files>=51);
  assert.ok(fs.existsSync(path.join(staged,'Chromium','ginsbrowser','.ginsextension2','manifest.json')));
  assert.throws(()=>stage(zipFile,staged),/already exists/);
  const packaged=path.join(tmp,'win-unpacked');
  fs.mkdirSync(packaged);
  fs.cpSync(path.join(staged,'Chromium'),path.join(packaged,'Chromium'),{recursive:true});
  verify(staged,packaged);
  fs.writeFileSync(path.join(packaged,'Chromium','Application','ginsbrowser.exe'),'modified');
  assert.throws(()=>verify(staged,packaged),/Missing\/invalid|size changed/);
  fs.copyFileSync(path.join(staged,'Chromium','Application','ginsbrowser.exe'),
                  path.join(packaged,'Chromium','Application','ginsbrowser.exe'));
  fs.rmSync(path.join(packaged,'Chromium','ginsbrowser','.ginsextension2','manifest.json'));
  assert.throws(()=>verify(staged,packaged),/file count mismatch/);
  assert.equal(filenameSafe('../profiles'),false);
  assert.equal(filenameSafe('Application/con.txt'),false);
  assert.equal(filenameSafe('ginsbrowser/_locales/zh_CN/messages.json'),true);
  const builder=fs.readFileSync(path.resolve('electron-builder.yml'),'utf8');
  assert.match(builder,/extraFiles:[\s\S]*?-\s*from: Chromium\s*\n\s*to: Chromium/);
  console.log('PASS: all Chromium trees staged, critical hashes checked, absent files rejected, double install rejected');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}

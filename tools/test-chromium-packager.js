'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const AdmZip=require('adm-zip');
const {stage,inspect,filenameSafe,isRuntimeAsset,assertWindowsX64PE,versionArchiveEntries}=require('./stage-full-chromium.js');
const {verify}=require('./verify-chromium-bundle.js');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dyclok-chromium-fixture-'));
try {
  const ver='142.0.7444.273';
  const files=path.join(tmp,'fixture','Chromium');
  const base=path.join(files,'Application',ver);
  fs.mkdirSync(base,{recursive:true});
  fs.mkdirSync(path.join(files,'ginsbrowser','.ginsextension2'),{recursive:true});
  fs.mkdirSync(path.join(files,'User Data','Crashpad'),{recursive:true});
  fs.mkdirSync(path.join(files,'Application','SetupMetrics'),{recursive:true});
  fs.writeFileSync(path.join(files,'User Data','Crashpad','settings.dat'),'PRIVATE-SYNTHETIC-CRASH-ID');
  fs.writeFileSync(path.join(files,'Application','SetupMetrics','4616_example.pma'),'PRIVATE-SYNTHETIC-TELEMETRY');
  fs.writeFileSync(path.join(files,'version.json'),JSON.stringify({main:{version:'142.1.7'},others:[]}));
  fs.writeFileSync(path.join(files,'ginsbrowser','.ginsextension2.zip'),Buffer.from('SYNTHETIC-EXTENSION-BUNDLE'));
  fs.writeFileSync(path.join(files,'ginsbrowser','.ginsextension3.zip'),Buffer.from('SYNTHETIC-EXTENSION-BUNDLE'));
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
  const invalid=path.join(tmp,'invalid-real-source');
  fs.mkdirSync(invalid);
  assert.throws(()=>stage(zipFile,invalid,{requirePE:true}),/Not a Windows executable/);
  assert.equal(fs.existsSync(path.join(invalid,'Chromium')),false,'Reject fake browser before committing');
  const pe=Buffer.alloc(256);
  pe.write('MZ',0,'ascii');
  pe.writeUInt32LE(128,0x3c);
  pe.write('PE\0\0',128,'ascii');
  pe.writeUInt16LE(0x8664,132);
  const fakePe=path.join(tmp,'synthetic-valid-header.exe');
  fs.writeFileSync(fakePe,pe);
  assert.doesNotThrow(()=>assertWindowsX64PE(fakePe));
  pe.writeUInt16LE(0x14c,132);
  fs.writeFileSync(fakePe,pe);
  assert.throws(()=>assertWindowsX64PE(fakePe),/not Windows x64/);
  const staged=path.join(tmp,'build');fs.mkdirSync(staged);
  const metadata=stage(zipFile,staged);
  assert.equal(metadata.version,ver);
  assert.ok(metadata.files>=51);
  assert.ok(fs.existsSync(path.join(staged,'Chromium','ginsbrowser','.ginsextension2','manifest.json')));
  assert.ok(fs.existsSync(path.join(staged,'Chromium','version.json')));
  assert.ok(fs.existsSync(path.join(staged,'Chromium','ginsbrowser','.ginsextension2.zip')));
  assert.ok(fs.existsSync(path.join(staged,'Chromium','ginsbrowser','.ginsextension3.zip')));
  assert.ok(!fs.existsSync(path.join(staged,'Chromium','User Data')));
  assert.ok(!fs.existsSync(path.join(staged,'Chromium','Application','SetupMetrics')));
  assert.equal(isRuntimeAsset('User Data/Crashpad/settings.dat'),false);
  assert.equal(isRuntimeAsset('Application/SetupMetrics/4616_example.pma'),false);
  assert.throws(()=>stage(zipFile,staged),/already exists/);
  // Windows "Compress to ZIP" of Chromium's contents omits Chromium/ itself.
  const bareZip=new AdmZip();bareZip.addLocalFolder(files);
  const bareFile=path.join(tmp,'chromium-contents.zip');bareZip.writeZip(bareFile);
  const stagedBare=path.join(tmp,'build-bare');fs.mkdirSync(stagedBare);
  const bare=stage(bareFile,stagedBare);
  assert.equal(bare.version,ver);
  assert.ok(fs.existsSync(path.join(stagedBare,'Chromium','Application','ginsbrowser.exe')));
  assert.ok(fs.existsSync(path.join(stagedBare,'Chromium','ginsbrowser','.ginsextension2','manifest.json')));
  assert.ok(fs.existsSync(path.join(stagedBare,'Chromium','version.json')));
  assert.ok(!fs.existsSync(path.join(stagedBare,'Chromium','User Data')));

  // The real user supplied a SEPARATE 142.0.7444.273.zip containing
  // the native version folder; Chromium.zip may have only the launcher.
  const versionZip=new AdmZip();
  versionZip.addLocalFolder(base,ver);
  const versionZipPath=path.join(tmp,ver+'.zip');
  versionZip.writeZip(versionZipPath);
  assert.equal(versionArchiveEntries(versionZipPath).version,ver);
  const partialSource=path.join(tmp,'separate-source','Chromium');
  fs.mkdirSync(path.join(partialSource,'Application'),{recursive:true});
  fs.cpSync(path.join(files,'Application','ginsbrowser.exe'),path.join(partialSource,'Application','ginsbrowser.exe'));
  fs.cpSync(path.join(files,'ginsbrowser'),path.join(partialSource,'ginsbrowser'),{recursive:true});
  fs.copyFileSync(path.join(files,'version.json'),path.join(partialSource,'version.json'));
  const partialZip=new AdmZip();partialZip.addLocalFolder(path.dirname(partialSource));
  const partialZipPath=path.join(tmp,'partial-chromium.zip');
  partialZip.writeZip(partialZipPath);
  const missingVersion=path.join(tmp,'missing-version');
  fs.mkdirSync(missingVersion);
  assert.throws(()=>stage(partialZipPath,missingVersion),/fewer than 40|chrome\.dll/);
  const joined=path.join(tmp,'joined-chromium');
  fs.mkdirSync(joined);
  const pair=stage(partialZipPath,joined,{versionArchive:versionZipPath});
  assert.equal(pair.version,ver);
  assert.equal(typeof pair.versionArchiveSha256,'string');
  assert.equal(pair.versionArchiveSha256.length,64);
  assert.ok(fs.existsSync(path.join(joined,'Chromium','Application',ver,'chrome.dll')));
  assert.ok(fs.existsSync(path.join(joined,'Chromium','ginsbrowser','.ginsextension2.zip')));
  const conflictZip=new AdmZip();
  conflictZip.addLocalFolder(base,ver);
  // Override the DLL with different data under the same relative path.
  conflictZip.updateFile(ver+'/chrome.dll',Buffer.from('conflicting duplicate DLL'));
  const conflictZipPath=path.join(tmp,'conflict-version.zip');conflictZip.writeZip(conflictZipPath);
  const conflictDest=path.join(tmp,'duplicate-conflict');fs.mkdirSync(conflictDest);
  assert.throws(()=>stage(zipFile,conflictDest,{versionArchive:conflictZipPath}),/Conflicting Chromium ZIP resources/);
  assert.ok(!fs.existsSync(path.join(conflictDest,'Chromium')));
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

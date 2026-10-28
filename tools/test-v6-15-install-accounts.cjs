#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),
path=require("node:path"),vm=require("node:vm");
const backend=fs.readFileSync(path.join(__dirname,"../release-build/v6.15/install-accounts-junction.js"),"utf8");
const ui=fs.readFileSync(path.join(__dirname,"../release-build/v6.15/archive-ui.js"),"utf8");
assert(ui.includes('api("openInstallFolder")'),"Archive button must open the installed Cuentas directory");
assert(ui.includes('api("installFolderStatus")'),"Archive panel must show installed account path");
assert(!/cookies\.set\(|session\.token|clearStorageData\(|rmSync\(|unlinkSync\(|copyFileSync\(/.test(backend),
  "Junction module must not manipulate cookies, session state or existing files");
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"dyclok-accounts-install-v615-"));
function makeEnvironment(root,id){
 const install=path.join(root,"Programs","DyclokPRO");
 fs.mkdirSync(install,{recursive:true});
 const proc={argv:["DICloak.exe",...(id?["--dyclok-account="+id]:[])],
  platform:"win32",env:{LOCALAPPDATA:root},execPath:path.join(install,"DICloak.exe")};
 const handlers=new Map(),opened=[];
 const electron={app:{whenReady:()=>new Promise(()=>{})},ipcMain:{handle:(name,fn)=>handlers.set(name,fn)},
 shell:{openPath:async p=>{opened.push(p);return ""}}};
 vm.runInNewContext(backend,{require:n=>({electron,fs,path,os})[n],process:proc,URL,Date},
  {filename:"install-accounts-junction.js"});
 const main={url:"file:///C:/Users/USER/AppData/Local/Programs/DyclokPRO/resources/app.asar.unpacked/dist/index.html"};
 const ev={sender:{mainFrame:main},senderFrame:main};
 return {call:(name,...args)=>handlers.get("dyclokpro:archive:"+name)(ev,...args),install,opened,handlers};
}
(async()=>{
 try{
  const persistent=path.join(temp,"DyclokPRO","Cuentas");
  const existing=path.join(persistent,"legacy","ArchivoOriginal","Perfiles","perfil-244","cookies");
  fs.mkdirSync(existing,{recursive:true});
  const original=path.join(existing,"latest.enc");fs.writeFileSync(original,"ENCRYPTED-EXISTING-PRESERVE");
  const a=makeEnvironment(temp,null);
  const result=a.call("installFolderStatus");
  assert.equal(result.linked,true,"Installation must have a working junction to persistent account archives");
  const link=path.join(a.install,"Cuentas");
  assert(fs.lstatSync(link).isSymbolicLink(),"Cuentas must be a directory link, not duplicated files");
  assert.equal(fs.realpathSync(link).toLowerCase(),fs.realpathSync(persistent).toLowerCase());
  assert.equal(fs.readFileSync(path.join(link,"legacy","ArchivoOriginal","Perfiles","perfil-244","cookies","latest.enc"),"utf8"),
   "ENCRYPTED-EXISTING-PRESERVE","Existing archived cookies must be visible but unmodified");
  assert.equal(fs.readFileSync(original,"utf8"),"ENCRYPTED-EXISTING-PRESERVE");
  assert(result.folder.startsWith(link));
  await a.call("openInstallFolder");
  assert.equal(a.opened[0],result.folder);
  const id="abcdef0123456789abcdef0123456789";
  const b=makeEnvironment(temp,id),other=b.call("installFolderStatus");
  assert(other.linked&&other.folder.includes(id));
  assert(fs.existsSync(path.join(persistent,id,"ArchivoOriginal","Perfiles")));
  assert(fs.existsSync(path.join(persistent,"legacy","ArchivoOriginal","Perfiles")));
  const handler=a.handlers.get("dyclokpro:archive:installFolderStatus");
  const remote={url:"https://example.com/dist/index.html"};
  assert.throws(()=>handler({sender:{mainFrame:remote},senderFrame:remote}),/no autorizado/);
  // Do not replace a genuine directory which a user already placed inside the installation.
  const different=path.join(temp,"another");
  const preExisting=path.join(different,"Programs","DyclokPRO","Cuentas");
  fs.mkdirSync(preExisting,{recursive:true});
  fs.writeFileSync(path.join(preExisting,"user-note.txt"),"keep");
  const c=makeEnvironment(different,null);
  const conflict=c.call("installFolderStatus");
  assert.equal(conflict.linked,false);
  assert.equal(fs.readFileSync(path.join(c.install,"Cuentas","user-note.txt"),"utf8"),"keep");
  assert(conflict.folder.startsWith(path.join(different,"DyclokPRO","Cuentas")));
  console.log("INSTALL_CUENTAS_JUNCTION_POINTS_TO_PERSISTENT_ARCHIVE=PASS");
  console.log("LEGACY_ACCOUNT_AND_EXISTING_ENCRYPTED_COOKIES_PRESERVED=PASS");
  console.log("SECOND_ACCOUNT_SHARES_LINK_BUT_NOT_DATA_FOLDER=PASS");
  console.log("ARCHIVE_BUTTON_OPENS_VISIBLE_INSTALLED_ACCOUNT_FOLDER=PASS");
  console.log("PREEXISTING_INSTALL_FOLDER_NOT_OVERWRITTEN=PASS");
  console.log("REMOTE_FRAME_CANNOT_OPEN_PRIVATE_ARCHIVES=PASS");
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
})().catch(err=>{console.error(err);process.exitCode=1});

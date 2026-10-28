#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),
vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"../release-build/v6.14/archive-folders-backend.js"),"utf8");
const ui=fs.readFileSync(path.join(__dirname,"../release-build/v6.14/archive-ui.js"),"utf8");
const button=fs.readFileSync(path.join(__dirname,"../release-build/v6.14/archive-view-button.js"),"utf8");
assert(ui.includes('".dy-save-backdrop,.dy-saved-viewer'),"Backdrop CSS must be a class, not an ID");
assert(ui.includes('".dy-save-dialog,.dy-saved-viewer-box'),"Dialog CSS must be a class, not an ID");
assert(ui.includes('api("openFolder")'),"Archive footer must open the actual Windows folder");
assert(ui.includes('api("registerProfile",{id})'),"Profile rows must establish their archive folder");
assert(ui.includes("button.textContent")===false||ui.includes('button.textContent?.trim()'),"Profile open clicks must be filtered");
assert(ui.includes('api("listProfileReferences")'));
assert(button.includes('window.dispatchEvent(new Event("dyclokpro:archive:show"))'),"View button must reveal archive");
assert(!button.includes("localprofiles:open"),"Do not launch blank Chromium profiles as archive viewer");
assert(!/\.cookies\.set\(|clearStorageData\(|token\s*=|lock_env\s*\(/.test(source));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"dyclok-archive-v614-"));
const account="0123456789abcdef0123456789abcdef";
function instance(id){
 const handlers=new Map();const opened=[];
 const electron={ipcMain:{handle:(n,fn)=>handlers.set(n,fn)},shell:{openPath:async p=>{opened.push(p);return ""}}};
 const mockedProcess={argv:["DICloak.exe",...(id==="legacy"?[]:["--dyclok-account="+id])],
   env:{LOCALAPPDATA:temp},platform:"win32"};
 vm.runInNewContext(source,{require:n=>({electron,fs,path,os})[n],process:mockedProcess,URL,Date},
  {filename:"archive-folders-backend.js"});
 const f={url:"file:///C:/Program%20Files/DyclokPRO/resources/app.asar.unpacked/dist/index.html"};
 const sender={mainFrame:f},event={sender,senderFrame:f};
 return {invoke:(op,...args)=>handlers.get("dyclokpro:archive:"+op)(event,...args),opened,handlers}
}
(async()=>{
 try{
  const a=instance("legacy"),b=instance(account);
  const x=a.invoke("registerProfile",{id:"244"});
  assert(fs.existsSync(path.join(x.folder,"referencia.json")));
  assert(!fs.existsSync(path.join(x.folder,"cookies")),"Do not fabricate a cookie archive");
  const saved=JSON.parse(fs.readFileSync(path.join(x.folder,"referencia.json"),"utf8"));
  assert.equal(saved.kind,"profile_open_requested");
  const y=b.invoke("registerProfile",{id:"244"});
  assert.notEqual(y.folder,x.folder,"Different accounts must use separate profile folders");
  assert.equal(a.invoke("listProfileReferences").profiles.length,1);
  assert.equal(b.invoke("listProfileReferences").profiles.length,1);
  assert.equal(a.invoke("listProfileReferences").profiles[0].hasArchivedResponse,false);
  await a.invoke("openProfileFolder","244");
  assert.deepEqual(a.opened,[x.folder]);
  assert.throws(()=>a.invoke("registerProfile",{id:"../profile244"}));
  await assert.rejects(a.invoke("openProfileFolder","../244"),/Invalid profile ID/);
  const handler=a.handlers.get("dyclokpro:archive:registerProfile");
  const frame={url:"https://evil.example/dist/index.html"};
  assert.throws(()=>handler({sender:{mainFrame:frame},senderFrame:frame},{id:"123"}));
  assert.equal(a.invoke("registerProfile",{id:"244"}).id,"244");
  console.log("ARCHIVE_FOLDER_CREATED_BY_PROFILE_OPEN=PASS");
  console.log("PER_ACCOUNT_PROFILE_ISOLATION=PASS");
  console.log("NO_FABRICATED_COOKIES_OR_BROWSER_SESSIONS=PASS");
  console.log("OPEN_ACTUAL_PROFILE_FOLDER=PASS");
  console.log("ARCHIVE_MODAL_CSS_MATCHES_CLASS=PASS");
  console.log("UNTRUSTED_RENDERER_REJECTED=PASS");
 }finally{fs.rmSync(temp,{force:true,recursive:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

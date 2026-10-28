#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),crypto=require("node:crypto"),vm=require("node:vm");
const code=fs.readFileSync(path.join(__dirname,"../release-build/v6.11/archive-backend.js"),"utf8");
const root=fs.mkdtempSync(path.join(os.tmpdir(),"dyclokpro-archive-v611-"));
const labels=["legacy","0123456789abcdef0123456789abcdef"];
function instance(id){
 const handlers=new Map();
 const storage={
  isEncryptionAvailable:()=>true,
  encryptString:s=>Buffer.concat([Buffer.from("ENCRYPTED:"),Buffer.from(s,"utf8").reverse()]),
  decryptString:b=>Buffer.from(b.subarray(10)).reverse().toString("utf8")
 };
 const context={require:fn=>({
    electron:{app:{},ipcMain:{handle:(name,callback)=>handlers.set(name,callback)},safeStorage:storage,
      dialog:{showSaveDialog:async()=>({canceled:true})},shell:{openPath:async()=>""}},
    fs,path,os,crypto
   })[fn],Buffer,process:{argv:["DICloak.exe",...(id==="legacy"?[]:["--dyclok-account="+id])],
    env:{LOCALAPPDATA:root},platform:"win32",pid:process.pid},URL};
 vm.runInNewContext(code,context,{filename:"archive-backend.js"});
 const event={senderFrame:{url:"file:///C:/DyclokPRO/resources/app.asar.unpacked/dist/index.html"}};
 return {invoke:(name,...args)=>{const cb=handlers.get("dyclokpro:archive:"+name);assert(cb,"No handler for "+name);return cb(event,...args)},
   event,handlers};
}
(async()=>{
 try{
  const first=instance(labels[0]),second=instance(labels[1]);
  const raw1='{"cookies":[{"name":"a","value":"SECRET-ONE"}],"proxy":{"host":"test"}}';
  const raw2='{"cookies":[{"name":"a","value":"SECRET-TWO"}],"proxy":{"host":"test"}}';
  const params={route:"/v1/profile/:id/settings",profile:"244",types:["cookies","proxy"],status:200,method:"GET"};
  assert.equal(first.invoke("capture",{...params,raw:raw1}).saved,2);
  assert.equal(first.invoke("capture",{...params,raw:raw1}).saved,0,"duplicate shouldn't re-save");
  assert.equal(second.invoke("capture",{...params,raw:raw2}).saved,2);
  const a=first.invoke("list"),b=second.invoke("list");
  assert.equal(a.records.length,2);
  assert.equal(b.records.length,2);
  assert.notEqual(a.folder,b.folder,"each logged-in account must have its own archive directory");
  const encrypted=fs.readFileSync(path.join(a.folder,"perfil-244","cookies","latest.enc"));
  assert(!encrypted.includes("SECRET-ONE"),"Sensitive cookie must never be saved as plaintext");
  assert(encrypted.subarray(0,10).toString()==="ENCRYPTED:");
  assert(first.invoke("read","perfil-244/cookies").raw===raw1,"plain original must be retrievable only through authorized view");
  assert(second.invoke("read","perfil-244/cookies").raw===raw2,"another account must keep its own data");
  assert.equal(first.invoke("capture",{...params,raw:raw2}).saved,2,"new profile cookies should replace old snapshots");
  assert(first.invoke("read","perfil-244/cookies").raw===raw2);
  let reject=false;
  try{first.invoke("capture",{...params,route:"/auth/login",raw:raw2})}catch{reject=true}
  assert(reject,"authentication endpoint must be excluded");
  reject=false;
  try{first.invoke("read","../../0123456789abcdef0123456789abcdef/cookies")}catch{reject=true}
  assert(reject,"path traversal must be rejected");
  reject=false;
  try{
   first.handlers.get("dyclokpro:archive:read")({senderFrame:{url:"https://unknown.example.com"}},"perfil-244/cookies")
  }catch{reject=true}
  assert(reject,"remote renderers must not read local cookies");
  console.log("AUTO_ARCHIVE_ENCRYPTED_AT_REST=PASS");
  console.log("AUTO_ARCHIVE_ACCOUNT_ISOLATION=PASS");
  console.log("AUTO_ARCHIVE_PROFILE_CATEGORIES_AND_REFRESH=PASS");
  console.log("AUTO_ARCHIVE_NO_PLAINTEXT_COOKIES=PASS");
  console.log("AUTO_ARCHIVE_REJECTS_UNTRUSTED_RENDERER=PASS")
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

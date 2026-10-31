#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert/strict");
const base=path.join(__dirname,"..");
const py=fs.readFileSync(path.join(base,"tools/release-v6-29-official307.py"),"utf8");
const main=fs.readFileSync(path.join(base,"release-build/v6.29/overlay-main.js"),"utf8");
const preload=fs.readFileSync(path.join(base,"release-build/v6.29/overlay-preload.js"),"utf8");
const users=fs.readFileSync(path.join(base,"release-build/v6.29/overlay-users.js"),"utf8");
for(const p of ["OFFICIAL_EXE_SHA","dist-electron/main-gLlCfI66.js",
 "dist/assets/index-CZSYLU7X.js","ORIGINAL_VERSION=3.0.7",
 "OFFICIAL_307_API_AUTH_SIGNED_HEADERS=UNCHANGED"]){
 assert(py.includes(p),"Missing official-engine guard: "+p);
}
assert(!/pkg\["version"\]|X-DC-M1|X-DC-M2|X-Version|GHOST_USER/.test(main+preload+users),
 "DyclokPRO overlays must not modify provider version or signed API");
const handlers=new Map(),paths=new Map(),writes=[];
const fakeFs={mkdirSync(){},writeFileSync(p,s){writes.push({p,s})}};
const electron={app:{isReady:()=>false,setPath:(key,value)=>paths.set(key,value),getVersion:()=>"3.0.7"},
 ipcMain:{handle:(channel,fn)=>handlers.set(channel,fn)},shell:{openPath:async()=>""}};
const os={homedir:()=>"/home/test",tmpdir:()=>"/tmp"};
const account="0123456789abcdef0123456789abcdef";
let exitInvoked=false;
try{
 vm.runInNewContext(main,{require(x){
  return x==="electron"?electron:x==="fs"?fakeFs:x==="os"?os:require(x);
 },process:{env:{LOCALAPPDATA:"C:/isolated"},argv:["DICloak.exe","--dyclok-account="+account,"--dyclok-self-test"],exit(){exitInvoked=true;throw Error("SELFTEST_EXIT")}},URL});
}catch(e){if(e.message!=="SELFTEST_EXIT")throw e}
assert(exitInvoked,"Selftest must stop before provider main starts");
assert(paths.get("userData").includes(account));
assert.notEqual(paths.get("userData"),paths.get("sessionData"));
assert.equal(writes.length,1);
assert.equal(JSON.parse(writes[0].s).version,"3.0.7");
let exposed={};
const bridge={
 exposeInMainWorld(name,api){exposed[name]=api}
},called=[];
vm.runInNewContext(preload,{require(x){
 assert.equal(x,"electron");
 return{contextBridge:bridge,ipcRenderer:{invoke(...args){called.push(args);return Promise.resolve(true)}}};
},Promise,Set,Error,Object});
(async()=>{
 assert(exposed.dyclokPROArchive);
 await exposed.dyclokPROArchive.invoke("dyclokpro:raw:open");
 assert.equal(called.length,1);
 await assert.rejects(()=>exposed.dyclokPROArchive.invoke("version-local-info"));
 console.log("PASS: official 3.0.7 package and native/API hashes guarded");
 console.log("PASS: separate user/session locations for accounts");
 console.log("PASS: bridge blocks provider authentication channels");
})().catch(e=>{console.error(e);process.exitCode=1});

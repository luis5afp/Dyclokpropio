#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const os=require("node:os"),vm=require("node:vm"),EventEmitter=require("node:events");
const backend=fs.readFileSync(path.join(__dirname,"../release-build/v6.13/local-profiles-backend.js"),"utf8");
const ui=fs.readFileSync(path.join(__dirname,"../release-build/v6.13/local-profiles-ui.js"),"utf8");
assert(!/clearStorageData\s*\(|cookies\.set\s*\(|token\s*=|authorization\s*=|lock_env\s*\(|fetch\s*\(/i.test(backend),
 "Local profiles must never modify remote authentication");
assert(ui.includes("dyclokpro:localprofiles:open"));
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),"dyclokpro-local613-"));
const manager=path.join(temporary,"Dyclokpro_Perfiles_Locales.exe");
fs.writeFileSync(manager,"mock");
const handlers=new Map(),launches=[];
const electron={ipcMain:{handle:(name,fn)=>handlers.set(name,fn)}};
const spawn=(exe,args,opts)=>{
 launches.push({exe,args,opts});
 const child=new EventEmitter();
 child.unref=()=>{};
 process.nextTick(()=>child.emit("spawn"));
 return child;
};
const scope={require:n=>({electron,fs,path,"child_process":{spawn}})[n],
 process:{platform:"win32",execPath:path.join(temporary,"DICloak.exe")},URL,Date};
vm.runInNewContext(backend,scope,{filename:"local-profiles-backend.js"});
(async()=>{
 try{
  const fn=handlers.get("dyclokpro:localprofiles:open");
  assert.equal(typeof fn,"function");
  const frame={url:"file:///C:/Program%20Files/DyclokPRO/resources/app.asar.unpacked/dist/index.html"};
  const good={senderFrame:frame,sender:{mainFrame:frame}};
  const launched=await fn(good);
  assert.equal(launched.started,true);
  assert.equal(launches.length,1);
  assert.equal(launches[0].exe,manager);
  assert.equal(launches[0].args.length,0);
  assert.equal(launches[0].opts.shell,false);
  const second=await fn(good);
  assert.equal(second.reusedClick,true);
  assert.equal(launches.length,1,"Rapid double clicks must not launch duplicates");
  await assert.rejects(fn({senderFrame:{url:"https://remote.example/index.html"},
    sender:{mainFrame:{url:"https://remote.example/index.html"}}}));
  await assert.rejects(fn({senderFrame:frame,sender:{mainFrame:{url:frame.url}}}),
    /only available/,"Non-main-frame IPC must be denied");
  assert.equal(launches.length,1);
  fs.unlinkSync(manager);
  await assert.rejects(fn(good),/no instalado/i);
  console.log("LOCAL_PROFILE_LAUNCH_WITHOUT_REMOTE_LOGIN=PASS");
  console.log("UNTRUSTED_RENDERERS_REJECTED=PASS");
  console.log("LOCAL_MANAGER_EXE_PATH_VALIDATED=PASS");
  console.log("NO_REMOTE_TOKEN_OR_LOCK_BYPASS=PASS");
 }finally{fs.rmSync(temporary,{force:true,recursive:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

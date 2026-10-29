#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync(path.join(__dirname,"../release-build/v6.24/compat-prelude.js"),"utf8");
assert(!/clearStorageData\(|\.cookies\.set\(|\.cookies\.get\(/.test(source));
assert(!/version-local-info/.test(source.replace(/\/\*[\s\S]*?\*\//g,"")));
const on=new Map(),handle=new Map();
const ipcMain={
 on(channel,fn){on.set(channel,fn);return this},
 handle(channel,fn){handle.set(channel,fn);return this}
};
vm.runInNewContext(source,{require(x){assert.equal(x,"electron");return{ipcMain}}},{filename:"compat-prelude.js"});
ipcMain.handle("version-local-info",async()=>({version:"3.0.6",patchVersion:"1.2.4.1",platform:"win32"}));
ipcMain.on("version-local-changed",()=>{});
ipcMain.on("update-app",()=>{throw Error("Auto updater may not register")});
ipcMain.handle("update-app-check-pack",async()=>({willInstall:true}));
(async()=>{
 const v=await handle.get("version-local-info")();
 assert.equal(v.version,"3.0.6","Mock original version-local-info must not be overridden");
 assert.equal(v.patchVersion,"1.2.4.1");
 assert.equal(on.has("update-app"),false);
 assert.equal(on.has("version-local-changed"),true);
 assert.equal((await handle.get("update-app-check-pack")()).disabled,true);
 console.log("TECHNICAL_VERSION_3_0_6_IPC_DELEGATED=PASS");
 console.log("NATIVE_VERSION_IPC_DELEGATED=PASS");
 console.log("DESKTOP_AUTO_UPDATER_STAYS_DISABLED=PASS");
})().catch(e=>{console.error(e);process.exitCode=1});
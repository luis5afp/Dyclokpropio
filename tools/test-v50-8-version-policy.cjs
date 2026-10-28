#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const p=path.join(__dirname,"../release-build/v50.8/version-policy-prelude.js");
const src=fs.readFileSync(p,"utf8");
assert(!/clearStorageData\(|\.cookies\.set\(|\.cookies\.get\(|app\.token\s*=|lock_env\(|org_config.*=/.test(src),
 "Version patch cannot alter logins, cookie stores or org configuration");
const handlers=new Map(),events=new Map(),calls=[];
const ipcMain={
 on(channel,listener){events.set(channel,listener);return this},
 handle(channel,listener){handlers.set(channel,listener);return this}
};
const electron={app:{getVersion:()=>"50.8.0"},ipcMain};
vm.runInNewContext(src,{require:s=>{assert.equal(s,"electron");return electron},process:{platform:"win32"}},{filename:"version-policy-prelude.js"});
ipcMain.on("update-app",()=>{throw Error("Legacy updater must not be registered")});
ipcMain.on("update-app-full-update",()=>{throw Error("Legacy full installer must not run")});
ipcMain.on("update-app-restart",()=>{throw Error("Auto-restart must be disabled")});
ipcMain.on("run-env",()=>calls.push("normal"));
assert.equal(events.has("update-app"),false);
assert.equal(events.has("update-app-full-update"),false);
assert.equal(events.has("update-app-restart"),false);
assert.equal(typeof events.get("run-env"),"function");
events.get("run-env")();
assert.deepEqual(calls,["normal"]);
ipcMain.handle("update-app-check-pack",async()=>({willInstall:true}));
ipcMain.handle("version-local-info",async()=>({
 version:"2.8.17",patchVersion:"old",browserVersion:"142.0.7444.273",platform:"win32"
}));
(async()=>{
 const info=await handlers.get("version-local-info")();
 assert.equal(info.version,"50.8.0");
 assert.equal(info.browserVersion,"142.0.7444.273");
 assert.equal(info.patchVersion,"old");
 const upd=await handlers.get("update-app-check-pack")();
 assert.equal(upd.disabled,true);
 const empty={ipcMain:{on:(channel,fn)=>{},handle:(channel,fn)=>{}}};
 const bad={app:{getVersion:()=>"2.8.17"},ipcMain:empty.ipcMain};
 vm.runInNewContext(src,{require:()=>bad,process:{platform:"win32"}});
 let local;
 bad.ipcMain.handle=(channel,fn)=>{if(channel==="version-local-info")local=fn};
 // isolated test for genuine bundle version assert
 vm.runInNewContext(src,{require:()=>bad,process:{platform:"win32"}});
 await assert.rejects(local(),/versión interna esperada/);
 console.log("APP_VERSION_50_8_VISIBLE_TO_RENDERER=PASS");
 console.log("ORIGINAL_CHROMIUM_AND_BROWSER_VERSION_PRESERVED=PASS");
 console.log("LEGACY_AUTO_UPDATE_CHANNELS_DISABLED=PASS");
 console.log("OTHER_IPC_AND_AUTHENTICATION_UNMODIFIED=PASS");
})().catch(e=>{console.error(e);process.exitCode=1});

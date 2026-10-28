const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("release-build/v6.18/version-and-update-prelude.js","utf8");
const registered=new Map(),events=new Map();
const ipc={
 handle(ch,fn){if(registered.has(ch))throw Error("duplicate handler");registered.set(ch,fn)},
 on(ch,fn){events.set(ch,fn);return this}
};
const electron={ipcMain:ipc,app:{getVersion:()=>"6.18.0"}};
vm.runInNewContext(source,{require:name=>{assert.equal(name,"electron");return electron},process:{platform:"win32"}});
ipc.handle("version-local-info",async()=>({version:"2.8.17",platform:"win32"}));
ipc.handle("update-app",async()=>({status:"legacy"}));
ipc.on("update-app-restart",()=>{throw Error("must not register")});
assert.equal(events.has("update-app-restart"),false);
Promise.all([registered.get("version-local-info")(),registered.get("update-app")()]).then(([v,u])=>{
 assert.equal(v.version,"6.18.0");
 assert.equal(u.disabled,true);
 console.log("VERSION_UPDATER_PRELUDE_TEST=PASS");
}).catch(e=>{console.error(e);process.exitCode=1});

#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const main=fs.readFileSync(path.join(__dirname,"../release-build/v6.12/session-durability.js"),"utf8");
const tabs=fs.readFileSync(path.join(__dirname,"../release-build/v6.12/user-tabs.js"),"utf8");
assert(main.includes("ses.cookies?.flushStore?.()"),"Cookie data must be flushed only through Electron");
assert(main.includes("ses.flushStorageData?.()"),"DOM storage must be flushed to disk");
assert(!/clearStorageData\s*\(|\.clearData\s*\(|\.cookies\.set\s*\(|\.cookies\.remove\s*\(|setPath\s*\(|token:state/.test(main),
 "Do not clear, rewrite or extend login state");
assert(/logoutSamples<3\|\|Date\.now\(\)-logoutSeenAt<5000/.test(tabs),"Do not relabel on a single transient login screen");
assert(!tabs.includes('clearStorageData(')&&!tabs.includes('session.token='),"UI must not clear or fabricate tokens");
function emitter(){const listeners=new Map();return {listeners,on(name,fn){let l=listeners.get(name)||[];l.push(fn);listeners.set(name,l);return this},
 emit(name,...args){for(const fn of listeners.get(name)||[])fn(...args)}}}
(async()=>{
 const app=emitter();app.whenReady=()=>Promise.resolve();
 let persistentWrites=0,transientWrites=0,domWrites=0,scheduled=null;
 const makeSession=durable=>({
  isPersistent:()=>durable,
  flushStorageData:()=>{if(durable)domWrites++;else transientWrites++},
  cookies:{flushStore:async()=>{if(durable)persistentWrites++;else transientWrites++}}
 });
 const session={defaultSession:makeSession(true)};
 const win=emitter();win.isDestroyed=()=>false;
 win.webContents={session:makeSession(true)};
 const temp=emitter();temp.isDestroyed=()=>false;
 temp.webContents={session:makeSession(false)};
 const electron={app,session,BrowserWindow:{getAllWindows:()=>[win,temp]}};
 const sandbox={require:name=>{assert.equal(name,"electron");return electron},
   setInterval:fn=>{scheduled=fn;return {unref(){}}},clearInterval:()=>{},
   queueMicrotask};
 vm.runInNewContext(main,sandbox,{filename:"session-durability.js"});
 await Promise.resolve();await Promise.resolve();
 assert(typeof scheduled==="function","Background flush timer must be registered");
 app.emit("browser-window-created",null,win);
 win.emit("blur");await new Promise(r=>setImmediate(r));
 assert(persistentWrites>=2,"Must flush default and window persistent sessions on blur");
 assert.equal(transientWrites,0,"Never flush ephemeral session as though persistent");
 assert(domWrites>=2,"Must flush DOM storage");
 const previous=persistentWrites;
 scheduled();await new Promise(r=>setImmediate(r));
 assert(persistentWrites>previous,"Periodic flush should run");
 app.emit("before-quit");await new Promise(r=>setImmediate(r));
 console.log("PERSISTENT_ELECTRON_STORAGE_FLUSH=PASS");
 console.log("TRANSIENT_SESSIONS_EXCLUDED=PASS");
 console.log("NO_AUTH_TOKEN_OR_EXPIRY_MANIPULATION=PASS");
 console.log("TRANSIENT_LOGOUT_LABEL_DEBOUNCED=PASS");
})().catch(e=>{console.error(e);process.exitCode=1});

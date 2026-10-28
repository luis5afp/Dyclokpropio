/* DyclokPRO v6.12 — durable local session writes.
 * Flushes only EXISTING persistent Electron sessions. Never copies, exports,
 * extends, restores or modifies any cookies/tokens, their expiry or the
 * provider's authentication/revocation logic.
 */
(function(){
"use strict";
const {app,session,BrowserWindow}=require("electron");
let activeFlush=null;
let dirty=false;
let timer=null;
function persistentSessions(){
 const sessions=new Set();
 try{if(session.defaultSession?.isPersistent?.())sessions.add(session.defaultSession)}catch{}
 try{
  for(const win of BrowserWindow.getAllWindows()){
   if(win.isDestroyed())continue;
   const ses=win.webContents?.session;
   if(ses?.isPersistent?.())sessions.add(ses);
  }
 }catch{}
 return [...sessions];
}
async function writePending(){
 if(activeFlush){dirty=true;return activeFlush}
 activeFlush=(async()=>{
  for(const ses of persistentSessions()){
   // DOMStorage writes synchronously, cookies.flushStore returns a Promise.
   try{ses.flushStorageData?.()}catch{}
   try{await ses.cookies?.flushStore?.()}catch{}
  }
 })();
 try{await activeFlush}
 finally{
  activeFlush=null;
  if(dirty){dirty=false;queueMicrotask(()=>void writePending())}
 }
}
app.whenReady().then(()=>{
 // Electron automatically flushes periodically. This adds a lightweight
 // durability check and a flush on window deactivation/close.
 timer=setInterval(()=>void writePending(),60000);
 timer.unref?.();
}).catch(()=>{});
app.on("browser-window-created",(_event,win)=>{
 win.on("blur",()=>{void writePending()});
 win.on("close",()=>{void writePending()});
});
app.on("before-quit",()=>{
 if(timer)clearInterval(timer);
 void writePending();
});
// Do not force session cookies to survive process exit, change partition names,
// disable logout, suppress clear-site-data or prevent remote revocation.
})();

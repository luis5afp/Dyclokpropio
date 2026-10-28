/* DyclokPRO v6.19: window title and privacy-safe load diagnostics.
 * Runs before the original Electron main script. No token/cookie access.
 */
(function(){
"use strict";
const {app,BrowserWindow}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os");
const accountArg=process.argv.find(x=>x.startsWith("--dyclok-account="));
const id=accountArg?.slice("--dyclok-account=".length)||"legacy";
if(!/^(legacy|[0-9a-f]{32})$/.test(id))throw Error("Invalid account identifier");
const dir=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),"DyclokPRO","Cuentas",id,"Diagnosticos");
function report(kind,details={}){
 try{
  fs.mkdirSync(dir,{recursive:true});
  const payload={time:new Date().toISOString(),kind,...details};
  fs.appendFileSync(path.join(dir,"interfaz-v619.log"),JSON.stringify(payload)+"\n",{encoding:"utf8",mode:0o600});
 }catch{}
}
function attach(win){
 const wc=win.webContents;
 const title="DyclokPRO v"+app.getVersion();
 const rename=()=>{try{if(!win.isDestroyed())win.setTitle(title)}catch{}};
 win.on("page-title-updated",event=>{event.preventDefault();rename()});
 wc.on("did-fail-load",(_e,code,description,_url,isMainFrame)=>{
   if(isMainFrame)report("main-frame-load-failed",{code,description:String(description).slice(0,160)});
 });
 wc.on("render-process-gone",(_e,details)=>{
   report("render-process-gone",{reason:details.reason,exitCode:details.exitCode});
 });
 wc.on("unresponsive",()=>report("renderer-unresponsive"));
 wc.on("did-finish-load",()=>{rename();report("main-window-finished-load")});
 rename();
}
app.on("browser-window-created",(_event,win)=>attach(win));
})();
/* DyclokPRO v6.10 - verified foreground switching for isolated users.
 * This runs in the Electron main process BEFORE the original application bundle.
 * It never copies, shares, exports, or fabricates login credentials or tokens.
 */
(function(){
"use strict";
const {app,ipcMain}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os"),cp=require("child_process"),crypto=require("crypto");
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),"DyclokPRO","Cuentas");
const LIST=path.join(BASE,"cuentas.json");
const ARG="--dyclok-account=";
const LAUNCH_ARG="--dyclok-launch=";
const UUID=/^[0-9a-f]{32}$/;
const args=process.argv.filter(v=>v.startsWith(ARG));
if(args.length>1||args.some(v=>!UUID.test(v.slice(ARG.length))))
  throw Error("Invalid isolated account identifier");
const active=args.length?args[0].slice(ARG.length):"legacy";
fs.mkdirSync(BASE,{recursive:true});
if(active!=="legacy"){
  const directory=path.join(BASE,active,"Electron");
  fs.mkdirSync(directory,{recursive:true});
  fs.mkdirSync(path.join(directory,"Session"),{recursive:true});
  // Electron requires setting userData/sessionData before the original main code
  // creates any browser window, session, or single-instance lock.
  app.setPath("userData",directory);
  app.setPath("sessionData",path.join(directory,"Session"));
  app.commandLine.appendSwitch("user-data-dir",directory);
}
// An account-launch attempt is only accepted after an actual Electron BrowserWindow
// has loaded. Do not report success based merely on spawn() returning a PID.
const launchArgs=process.argv.filter(x=>x.startsWith(LAUNCH_ARG));
const launchId=launchArgs.length===1?launchArgs[0].slice(LAUNCH_ARG.length):null;
if(launchArgs.length>1||(launchId&&!UUID.test(launchId)))throw Error("Invalid launch ID");
if(launchId){
 const marker=path.join(BASE,"launch-"+launchId+".json");
 app.on("browser-window-created",(_event,win)=>{
  const ready=async()=>{
   try{
    const url=win.webContents.getURL();
    const payload={account:active,pid:process.pid,url,created:Date.now()};
    if(process.argv.includes("--dyclok-login-smoke")){
      // A real login page is required, not merely a process launched.
      await new Promise(resolve=>setTimeout(resolve,3000));
      const state=await win.webContents.executeJavaScript(
        "(()=>{const password=document.querySelector('input[type=password]');"+
        "const text=(document.body?.innerText||'').slice(0,30000);"+
        "return {passwordInput:!!password,loginLabel:/Iniciar sesi[oó]n ahora|Sign in now|Recordar contrase[nñ]a/i.test(text),"+
        "passwordBlank:!password?.value};})()",true);
      payload.loginFormVisible=!!(state.passwordInput&&state.loginLabel);
      payload.passwordBlank=!!state.passwordBlank;
    }
    fs.writeFileSync(marker,JSON.stringify(payload),{flag:"wx",mode:0o600});
   }catch(err){
    try{fs.writeFileSync(marker,JSON.stringify({account:active,pid:process.pid,error:String(err.message||err).slice(0,160)}),{flag:"wx"});}catch{}
   }
  };
  win.webContents.once("did-finish-load",ready);
 });
}
// Test-only startup check: runs before loading any legacy service code.
if(process.argv.includes("--dyclok-self-test")){
  const result={id:active,userData:app.getPath("userData"),sessionData:app.getPath("sessionData")};
  const file=path.join(os.tmpdir(),"dyclokpro-v610-check-"+active+".json");
  fs.writeFileSync(file,JSON.stringify(result),{encoding:"utf8"});
  process.exit(0);
}
function safeName(name){
 if(typeof name!=="string")return null;
 const t=name.replace(/[\u0000-\u001f<>:"/\\|?*]/g,"").trim();
 return t.length>=2&&t.length<=40?t:null;
}
function list(){
 let saved=[];
 try{const raw=JSON.parse(fs.readFileSync(LIST,"utf8"));if(Array.isArray(raw.accounts))saved=raw.accounts;}
 catch(e){if(e.code!=="ENOENT")throw Error("Cannot read account registry")}
 const accounts=[{id:"legacy",name:"Cuenta principal"}];
 const ids=new Set(["legacy"]);
 for(const item of saved){
   if(!item||!UUID.test(item.id)||ids.has(item.id)||!safeName(item.name))continue;
   accounts.push({id:item.id,name:safeName(item.name)});ids.add(item.id);
 }
 const own=saved.find(v=>v&&v.id==="legacy"&&safeName(v.name));
 if(own)accounts[0].name=safeName(own.name);
 return accounts.slice(0,24);
}
function write(all){
 const data=JSON.stringify({schema:1,accounts:all},null,2);
 const tmp=LIST+"."+process.pid+"."+crypto.randomBytes(4).toString("hex")+".tmp";
 fs.writeFileSync(tmp,data,{encoding:"utf8",flag:"wx",mode:0o600});
 try{fs.renameSync(tmp,LIST)}catch(e){try{fs.unlinkSync(tmp)}catch{}throw e}
}
function trusted(ev){
 let u;try{u=new URL(ev.senderFrame?.url||ev.sender.getURL())}catch{return false}
 return u.protocol==="file:"&&/\/dist\/index\.html$/i.test(u.pathname);
}
function ensureSender(ev){if(!trusted(ev))throw Error("Untrusted account-manager IPC source")}
// Cross-process switching: each account retains its own Electron userData/sessionData.
// A running account must be raised and its foreground activation verified; issuing
// .focus() does not mean Windows actually switched to it. Never respawn a live
// account just because Windows refuses to transfer focus.
const runningPath=id=>path.join(BASE,"running-"+id+".json");
const focusRequestPrefix=id=>"focus-"+id+"-";
const sleep=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
function isPrimaryWindow(win){
 try{return /\\/dist\\/index\\.html(?:[?#]|$)/i.test(win.webContents.getURL())}catch{return false}
}
function accountWindow(){
 const {BrowserWindow}=require("electron");
 const windows=BrowserWindow.getAllWindows().filter(w=>!w.isDestroyed());
 // Do not mistakenly raise the last-created hidden dialog or splash window.
 return windows.find(w=>isPrimaryWindow(w)&&w.isVisible())
   ||windows.find(w=>isPrimaryWindow(w))
   ||windows.find(w=>w.isVisible())
   ||windows[0]||null;
}
async function focusOwnWindow(){
 const win=accountWindow();
 if(!win)return {focused:false,visible:false};
 try{
   if(win.isMinimized())win.restore();
   if(!win.isVisible())win.show();
   if(typeof win.moveTop==="function")win.moveTop();
   win.focus();
   await sleep(65);
   if(!win.isFocused()&&process.platform==="win32"){
     // A background Electron process can be refused foreground activation by
     // Windows. Briefly raising its Z-order makes the chosen window visible.
     // Restore the original always-on-top state immediately.
     if(!win.isAlwaysOnTop()){
       try{
         win.setAlwaysOnTop(true);
         if(typeof win.moveTop==="function")win.moveTop();
       }finally{win.setAlwaysOnTop(false)}
     }else if(typeof win.moveTop==="function")win.moveTop();
     win.show();
     win.focus();
     await sleep(110);
   }
   return {focused:!win.isDestroyed()&&win.isFocused(),
           visible:!win.isDestroyed()&&win.isVisible()};
 }catch{return {focused:false,visible:!win.isDestroyed()&&win.isVisible()}}
}
let heartbeat,focusWatcher,focusTimer;
function heartbeatNow(){
 try{
   const current=JSON.stringify({pid:process.pid,when:Date.now(),account:active});
   const tmp=runningPath(active)+"."+process.pid+".tmp";
   fs.writeFileSync(tmp,current,{mode:0o600});
   fs.renameSync(tmp,runningPath(active));
 }catch{}
}
function handleFocusRequests(){
 try{
   for(const name of fs.readdirSync(BASE)){
     if(!name.startsWith(focusRequestPrefix(active))||!name.endsWith(".request.json"))continue;
     const request=path.join(BASE,name);
     let payload;
     try{payload=JSON.parse(fs.readFileSync(request,"utf8"))}catch{continue}
     // Remove before async activation so the periodic scan cannot replay it.
     try{fs.unlinkSync(request)}catch{}
     if(payload.account!==active||!UUID.test(payload.nonce)
       ||!Number.isFinite(payload.when)||Math.abs(Date.now()-payload.when)>6000)continue;
     const ack=path.join(BASE,"focus-"+payload.nonce+".ack.json");
     void focusOwnWindow().then(result=>{
       try{fs.writeFileSync(ack,JSON.stringify({account:active,pid:process.pid,
         focused:result.focused,visible:result.visible}),{flag:"wx",mode:0o600})}catch{}
     }).catch(()=>{});
   }
 }catch{}
}
app.whenReady().then(()=>{
 heartbeatNow();
 heartbeat=setInterval(heartbeatNow,900);
 // File watcher avoids a fixed 175ms delay. Keep an interval fallback for
 // Windows filesystems which sometimes coalesce notifications.
 try{
   focusWatcher=fs.watch(BASE,(_event,name)=>{
     if(name&&String(name).startsWith(focusRequestPrefix(active)))handleFocusRequests();
   });
   focusWatcher.on("error",()=>{try{focusWatcher.close()}catch{}focusWatcher=null});
 }catch{}
 focusTimer=setInterval(handleFocusRequests,175);
 focusTimer.unref?.();
}).catch(()=>{});
app.on("before-quit",()=>{
 if(heartbeat)clearInterval(heartbeat);
 if(focusTimer)clearInterval(focusTimer);
 if(focusWatcher)try{focusWatcher.close()}catch{}
 try{
   const current=JSON.parse(fs.readFileSync(runningPath(active),"utf8"));
   if(current.pid===process.pid)fs.unlinkSync(runningPath(active));
 }catch{}
});
async function focusRunningAccount(id){
 let running;
 try{running=JSON.parse(fs.readFileSync(runningPath(id),"utf8"))}
 catch{return null}
 if(!Number.isSafeInteger(running.pid)||!Number.isFinite(running.when)
   ||Date.now()-running.when>3200||running.when>Date.now()+1000)return null;
 if(running.account!==id)return null;
 if(running.pid===process.pid){
   const result=await focusOwnWindow();
   return {reused:true,account:id,...result};
 }
 const nonce=crypto.randomBytes(16).toString("hex");
 const request=path.join(BASE,focusRequestPrefix(id)+nonce+".request.json");
 const ack=path.join(BASE,"focus-"+nonce+".ack.json");
 try{
   fs.writeFileSync(request,JSON.stringify({account:id,nonce,when:Date.now()}),{flag:"wx",mode:0o600});
   for(let i=0;i<22;i++){
     await sleep(50);
     if(!fs.existsSync(ack))continue;
     const reply=JSON.parse(fs.readFileSync(ack,"utf8"));
     if(reply.account===id&&reply.pid===running.pid
       &&typeof reply.focused==="boolean"&&typeof reply.visible==="boolean"){
       return {reused:true,account:id,pid:running.pid,
               focused:reply.focused,visible:reply.visible};
     }
   }
 }catch{}
 finally{
   try{fs.unlinkSync(request)}catch{}
   try{fs.unlinkSync(ack)}catch{}
 }
 // A live account is NEVER launched a second time on an activation timeout.
 return {reused:true,account:id,pid:running.pid,focused:false,visible:false};
}

async function start(id){
 if(id!=="legacy"&&!UUID.test(id))throw Error("Invalid account");
 if(!list().some(a=>a.id===id))throw Error("Unknown account");
 const already=await focusRunningAccount(id);
 if(already)return already;
 const launch=crypto.randomBytes(16).toString("hex");
 const marker=path.join(BASE,"launch-"+launch+".json");
 const switches=(id==="legacy"?[]:[ARG+id]).concat(LAUNCH_ARG+launch);
 return new Promise((resolve,reject)=>{
  let child;
  try{child=cp.spawn(process.execPath,switches,{
    cwd:path.dirname(process.execPath),detached:false,windowsHide:false,stdio:"ignore"
  });}catch(err){reject(new Error("No se pudo ejecutar DyclokPRO: "+err.message));return;}
  let settled=false;
  const finish=(error,value)=>{
    if(settled)return;
    settled=true;
    clearInterval(poll);clearTimeout(timeout);
    try{fs.unlinkSync(marker)}catch{}
    if(error)reject(error);else resolve(value);
  };
  const poll=setInterval(()=>{
    try{
      if(!fs.existsSync(marker))return;
      const result=JSON.parse(fs.readFileSync(marker,"utf8"));
      if(result.account!==id||result.pid!==child.pid)throw Error("La ventana pertenece a otra cuenta");
      finish(null,{started:true,pid:child.pid,account:id,windowLoaded:true});
    }catch(err){finish(new Error("Error al comprobar la nueva ventana: "+err.message));}
  },200);
  const timeout=setTimeout(()=>finish(new Error("La ventana no terminó de abrirse. Revisa si Windows bloqueó una segunda instancia o si el servidor rechazó el inicio.")),20000);
  child.once("error",err=>finish(new Error("No se pudo lanzar otra cuenta: "+err.message)));
  child.once("exit",(code)=>finish(new Error("La nueva ventana se cerró antes de cargar (código "+code+").")));
 });
}
ipcMain.handle("dyclokpro:users:list",async ev=>{
 ensureSender(ev);
 return {active,accounts:list()};
});
ipcMain.handle("dyclokpro:users:add",async(ev)=>{
 ensureSender(ev);
 const accounts=list();
 if(accounts.length>=24)throw Error("Límite de 24 espacios locales.");
 const id=crypto.randomBytes(16).toString("hex");
 // + Usuario opens the real provider login screen. No name/password prompt here.
 // Never copy remembered passwords or tokens from the first account.
 const name="Nueva cuenta "+accounts.length;
 accounts.push({id,name});write(accounts);
 const launched=await start(id);
 return {id,name,...launched};
});
ipcMain.handle("dyclokpro:users:open",async(ev,id)=>{
 ensureSender(ev);
 if(id===active)return{active:true};
 return await start(id);
});
ipcMain.handle("dyclokpro:users:renameCurrent",async(ev,label)=>{
 ensureSender(ev);
 const name=safeName(label);if(!name)throw Error("Nombre no válido.");
 const accounts=list(),account=accounts.find(a=>a.id===active);
 if(!account)throw Error("Cuenta inexistente.");
 account.name=name;write(accounts);
 return {active,accounts:list()};
});
ipcMain.handle("dyclokpro:users:logoutCurrent",async ev=>{
 ensureSender(ev);
 const accounts=list(),account=accounts.find(a=>a.id===active);
 if(!account)throw Error("Cuenta inexistente");
 // Invalidate only the displayed nickname; preserve all account data/credentials
 // as managed by the original provider login/logout process.
 account.name=active==="legacy"?"Cuenta principal":("Iniciar sesión "+accounts.indexOf(account));
 write(accounts);
 return {active,accounts:list()};
});
ipcMain.handle("dyclokpro:users:current",async ev=>{
 ensureSender(ev);
 return {active,userData:app.getPath("userData")};
});
// Never register a remote login channel or persist session tokens in this registry.
})();

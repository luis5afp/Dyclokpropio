/* DyclokPRO v6.6 - authenticated user slots.
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
  const file=path.join(os.tmpdir(),"dyclokpro-v66-check-"+active+".json");
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
function start(id){
 if(id!=="legacy"&&!UUID.test(id))throw Error("Invalid account");
 if(!list().some(a=>a.id===id))throw Error("Unknown account");
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

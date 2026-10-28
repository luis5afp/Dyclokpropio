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
const UUID=/^[0-9a-f]{32}$/;
const args=process.argv.filter(v=>v.startsWith(ARG));
if(args.length>1||args.some(v=>!UUID.test(v.slice(ARG.length))))
  throw Error("Invalid isolated account identifier");
const active=args.length?args[0].slice(ARG.length):"legacy";
fs.mkdirSync(BASE,{recursive:true});
if(active!=="legacy"){
  const directory=path.join(BASE,active,"Electron");
  fs.mkdirSync(directory,{recursive:true});
  // Electron requires setting userData/sessionData before the original main code
  // creates any browser window, session, or single-instance lock.
  app.setPath("userData",directory);
  app.setPath("sessionData",path.join(directory,"Session"));
  app.commandLine.appendSwitch("user-data-dir",directory);
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
 const switches=id==="legacy"?[]:[ARG+id];
 const child=cp.spawn(process.execPath,switches,{
   cwd:path.dirname(process.execPath),detached:true,windowsHide:false,stdio:"ignore"
 });
 child.once("error",()=>{});
 child.unref();
 return true;
}
ipcMain.handle("dyclokpro:users:list",async ev=>{
 ensureSender(ev);
 return {active,accounts:list()};
});
ipcMain.handle("dyclokpro:users:add",async(ev,label)=>{
 ensureSender(ev);
 const name=safeName(label);if(!name)throw Error("El nombre debe tener entre 2 y 40 caracteres.");
 const accounts=list();
 if(accounts.length>=24)throw Error("Límite de 24 espacios locales.");
 const id=crypto.randomBytes(16).toString("hex");
 accounts.push({id,name});write(accounts);
 return {id,name,started:start(id)};
});
ipcMain.handle("dyclokpro:users:open",async(ev,id)=>{
 ensureSender(ev);
 if(id===active)return{active:true};
 return {started:start(id)};
});
ipcMain.handle("dyclokpro:users:renameCurrent",async(ev,label)=>{
 ensureSender(ev);
 const name=safeName(label);if(!name)throw Error("Nombre no válido.");
 const accounts=list(),account=accounts.find(a=>a.id===active);
 if(!account)throw Error("Cuenta inexistente.");
 account.name=name;write(accounts);
 return {active,accounts:list()};
});
ipcMain.handle("dyclokpro:users:current",async ev=>{
 ensureSender(ev);
 return {active,userData:app.getPath("userData")};
});
// Never register a remote login channel or persist session tokens in this registry.
})();

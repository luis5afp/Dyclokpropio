/* DyclokPRO v6.14 — per-account, per-profile local archive references.
 * No browser cookies, passwords, session tokens or authorization are copied,
 * changed or used by this module. Opening a server-managed profile is still
 * controlled by the existing application and remote service.
 */
(function(){
"use strict";
const {ipcMain,shell}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os");
const ACCOUNT=/^[0-9a-f]{32}$/;
const PROFILE=/^[0-9]{1,10}$/;
const args=process.argv.filter(a=>a.startsWith("--dyclok-account="));
if(args.length>1||args.some(a=>!ACCOUNT.test(a.slice("--dyclok-account=".length))))
 throw Error("Invalid archive account");
const account=args.length?args[0].slice("--dyclok-account=".length):"legacy";
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),
 "DyclokPRO","Cuentas",account,"ArchivoOriginal","Perfiles");
function trusted(ev){
 try{
  if(!ev.senderFrame||ev.senderFrame!==ev.sender.mainFrame)return false;
  const u=new URL(ev.senderFrame.url);
  return u.protocol==="file:"&&/\/dist\/index\.html$/i.test(u.pathname)
 }catch{return false}
}
function verify(ev){if(!trusted(ev))throw Error("Archive folder access not authorized")}
function folder(id){
 if(typeof id!=="string"||!PROFILE.test(id))throw Error("Invalid profile ID");
 return path.join(BASE,"perfil-"+id)
}
function referenceFile(id){return path.join(folder(id),"referencia.json")}
function currentReferences(){
 fs.mkdirSync(BASE,{recursive:true,mode:0o700});
 const result=[];
 for(const item of fs.readdirSync(BASE,{withFileTypes:true})){
  if(!item.isDirectory()||!/^perfil-[0-9]{1,10}$/.test(item.name))continue;
  const id=item.name.slice(7),f=referenceFile(id);
  let source="captura";
  if(fs.existsSync(f))source="apertura_solicitada";
  const types=["cookies","proxy","configuracion","parametros","otros"]
    .filter(type=>fs.existsSync(path.join(folder(id),type,"latest.enc")));
  result.push({id,source,types,hasArchivedResponse:types.length>0});
 }
 return result.sort((a,b)=>Number(a.id)-Number(b.id));
}
ipcMain.handle("dyclokpro:archive:registerProfile", (ev,data)=>{
 verify(ev);
 if(!data||typeof data!=="object"||typeof data.id!=="string")throw Error("Profile ID missing");
 const id=data.id,p=folder(id),f=referenceFile(id);
 fs.mkdirSync(p,{recursive:true,mode:0o700});
 // Reference metadata intentionally contains NO browser session, user name or URL.
 if(!fs.existsSync(f)){
  const record={
   version:1,profileId:id,account,
   kind:"profile_open_requested",
   note:"Referencia local: no demuestra que Chromium se abrió y no contiene cookies ni historial.",
   createdAt:new Date().toISOString()
  };
  try{fs.writeFileSync(f,JSON.stringify(record,null,2)+"\n",{flag:"wx",mode:0o600})}
  catch(e){if(e.code!=="EEXIST")throw e}
 }
 return {id,folder:p,archivedCookies:fs.existsSync(path.join(p,"cookies","latest.enc"))};
});
ipcMain.handle("dyclokpro:archive:listProfileReferences",ev=>{
 verify(ev);
 return {root:BASE,profiles:currentReferences()};
});
ipcMain.handle("dyclokpro:archive:openProfileFolder",async(ev,id)=>{
 verify(ev);
 const p=folder(id);
 fs.mkdirSync(p,{recursive:true,mode:0o700});
 const error=await shell.openPath(p);
 if(error)throw Error(error);
 return {opened:true};
});
})();
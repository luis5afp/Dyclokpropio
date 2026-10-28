/* DyclokPRO v6.11. Automatic, per-account encrypted archive for original API responses.
 * This main-process prelude runs before the published v6.10 Electron backend.
 * Chromium's own cookie stores, proxy runtime and authentication are untouched.
 */
(function(){
"use strict";
const {app,ipcMain,safeStorage,dialog,shell}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto");
const ID=/^[0-9a-f]{32}$/;
const arg=process.argv.filter(a=>a.startsWith("--dyclok-account="));
if(arg.length>1||arg.some(a=>!ID.test(a.slice(17))))throw Error("Invalid account archive identity");
const account=arg.length?arg[0].slice(17):"legacy";
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),
  "DyclokPRO","Cuentas",account,"ArchivoOriginal","Perfiles");
const TYPES=new Set(["cookies","proxy","configuracion","parametros","otros"]);
const MAX_BYTES=1024*1024;
const ACCEPT=/(?:\/v\d+\/|\/env\/|\/profile\/|\/cookies?\/|\/proxy\/|\/settings\/|\/config\/)/i;
const FORBID=/(?:^|\/)(?:login|logout|auth|authorize|password|refresh_token|access_token)(?:\/|$)/i;
function trusted(ev){
 let url;
 try{url=new URL(ev.senderFrame?.url||ev.sender.getURL())}catch{return false}
 return url.protocol==="file:"&&/\/dist\/index\.html$/i.test(url.pathname);
}
function guard(ev){
 if(!trusted(ev))throw Error("Archivo: ventana no autorizada");
 if(process.platform!=="win32"||!safeStorage.isEncryptionAvailable())
   throw Error("No hay cifrado de Windows disponible: el guardado está detenido para proteger cookies y tokens");
}
function groupId(raw){
 if(typeof raw!=="string"||raw.length>80||!/^[\w.-]+$/.test(raw))return "general";
 const normalized=raw.trim();
 if(!normalized)return "general";
 return "perfil-"+(normalized.length<=35?normalized:crypto.createHash("sha256").update(normalized).digest("hex").slice(0,24));
}
function validRoute(route){
 if(typeof route!=="string"||route.length>180||route.includes("?")||route.includes("#")
    ||!route.startsWith("/")||!ACCEPT.test(route)||FORBID.test(route))return false;
 return true;
}
function root(){fs.mkdirSync(BASE,{recursive:true,mode:0o700});return BASE}
function archiveFile(id,type){
 if(!TYPES.has(type)||!/^(?:general|perfil-[\w.-]{1,35})$/.test(id))throw Error("Invalid archive coordinates");
 return path.join(root(),id,type,"latest.enc");
}
function decode(file){
 const encrypted=fs.readFileSync(file);
 return JSON.parse(safeStorage.decryptString(encrypted));
}
function atomicEncryptedWrite(file,payload){
 const dir=path.dirname(file);fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const temp=file+"."+process.pid+"."+crypto.randomBytes(5).toString("hex")+".tmp";
 try{
  fs.writeFileSync(temp,safeStorage.encryptString(JSON.stringify(payload)),{mode:0o600,flag:"wx"});
  fs.renameSync(temp,file);
 }finally{try{fs.unlinkSync(temp)}catch{}}
}
function overview(){
 root();
 const entries=[];
 for(const folder of fs.readdirSync(BASE,{withFileTypes:true})){
  if(!folder.isDirectory()||!/^(?:general|perfil-[\w.-]{1,35})$/.test(folder.name))continue;
  for(const type of TYPES){
   const file=archiveFile(folder.name,type);
   if(!fs.existsSync(file))continue;
   try{
    const v=decode(file);
    if(v.account!==account||v.group!==folder.name||v.type!==type)continue;
    entries.push({id:folder.name+"/"+type,profile:v.profile||"General",
      type:v.type,path:v.route,timestamp:v.timestamp,bytes:Buffer.byteLength(v.raw,"utf8")});
   }catch{} // Corrupt/mismatched entries are ignored, never leaked.
  }
 }
 entries.sort((a,b)=>b.timestamp-a.timestamp);
 return {account,folder:root(),records:entries.slice(0,1000),encrypted:true,automatic:true};
}
ipcMain.handle("dyclokpro:archive:status",ev=>{
 guard(ev);
 return {automatic:true,encrypted:true,account,folder:root()};
});
ipcMain.handle("dyclokpro:archive:capture",(ev,data)=>{
 guard(ev);
 if(!data||typeof data!=="object"||typeof data.raw!=="string"||
   Buffer.byteLength(data.raw,"utf8")>MAX_BYTES||!validRoute(data.route)||
   !Number.isInteger(data.status)||data.status<200||data.status>=300)throw Error("Invalid archive response");
 let parsed;
 try{parsed=JSON.parse(data.raw)}catch{throw Error("Invalid JSON archive response")}
 if(parsed===null||typeof parsed!=="object")throw Error("Archive expects JSON responses");
 const profile=typeof data.profile==="string"?data.profile.slice(0,80):"";
 const group=groupId(profile);
 const categories=Array.isArray(data.types)?[...new Set(data.types)]:[];
 if(categories.length<1||categories.length>5||categories.some(x=>!TYPES.has(x)))
   throw Error("Invalid response category");
 const digest=crypto.createHash("sha256").update(data.raw).digest("hex");
 const now=Date.now();let updated=0;
 for(const type of categories){
  const file=archiveFile(group,type);
  if(fs.existsSync(file)){
   try{if(decode(file).sha256===digest)continue}catch{} // Replace invalid encrypted snapshot.
  }
  atomicEncryptedWrite(file,{version:1,account,group,profile:profile||"General",type,
    route:data.route,method:String(data.method||"GET").slice(0,12),status:data.status,
    timestamp:now,sha256:digest,raw:data.raw});
  updated++;
 }
 return {saved:updated,encrypted:true,account};
});
ipcMain.handle("dyclokpro:archive:list",ev=>{guard(ev);return overview()});
function selected(ev,id){
 guard(ev);
 if(typeof id!=="string")throw Error("Invalid record");
 const m=/^(general|perfil-[\w.-]{1,35})\/(cookies|proxy|configuracion|parametros|otros)$/.exec(id);
 if(!m)throw Error("Invalid record selector");
 const data=decode(archiveFile(m[1],m[2]));
 if(data.account!==account||data.group!==m[1]||data.type!==m[2])throw Error("Archive mismatch");
 return data;
}
ipcMain.handle("dyclokpro:archive:read",(ev,id)=>{
 const record=selected(ev,id);
 return {raw:record.raw,type:record.type,profile:record.profile,
    timestamp:record.timestamp,route:record.route};
});
ipcMain.handle("dyclokpro:archive:export",async(ev,id)=>{
 const record=selected(ev,id);
 const ext=record.type==="proxy"?"txt":"json";
 const result=await dialog.showSaveDialog({title:"Exportar respuesta original sin cifrar",
   defaultPath:"DyclokPRO_"+record.type+"_"+String(record.timestamp)+"."+ext,
   filters:[{name:ext.toUpperCase(),extensions:[ext]}]});
 if(result.canceled||!result.filePath)return {canceled:true};
 // Never silently write unencrypted originals. A user's explicit export is required.
 fs.writeFileSync(result.filePath,record.raw,{encoding:"utf8",flag:"w",mode:0o600});
 return {saved:true};
});
ipcMain.handle("dyclokpro:archive:openFolder",async ev=>{
 guard(ev);
 const message=await shell.openPath(root());
 if(message)throw Error(message);
 return {opened:true};
});
})();
/* DyclokPRO v6.27: original API text archive; plaintext requested by user.
 * Does not modify login, server, cookies, API headers or Chromium.
 * WARNING: archived plaintext can contain private information.
 */
(function() {
"use strict";
const {ipcMain,shell}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto");
const ids=process.argv.filter(x=>x.startsWith("--dyclok-account="));
if(ids.length>1||ids.some(x=>!/^[a-f0-9]{32}$/.test(x.slice(17))))throw Error("Invalid Dyclok account");
const account=ids.length?ids[0].slice(17):"legacy";
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),
  "DyclokPRO","Cuentas",account,"ArchivoOriginal","Perfiles");
const MAX=12*1024*1024;
const ALLOW=/^\/(?:gin\/)?v[0-9]+\/(?:env|profile|browser|proxy)(?:\/|$)/i;
const BLOCK=/(?:^|\/)(?:auth|authorize|login|logout|password|token|access_token|refresh_token|session|oauth|2fa)(?:\/|$)/i;
const ID=/^(?:[0-9]{1,25}|[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9-]{27,36})$/i;
function authorized(e){
 const f=e.senderFrame;
 if(!f||f!==e.sender.mainFrame)throw Error("Untrusted renderer frame");
 const u=new URL(f.url);
 if(u.protocol!=="file:"||!/\/dist\/index\.html$/i.test(u.pathname))throw Error("Untrusted archive IPC");
}
function cleanName(name){
 if(typeof name!=="string")return "";
 const src=name.trim();
 if(!src||src==="."||src==="..")return "";
 let v=src.replace(/[<>:"/\\|?*\x00-\x1f]/g,"_").replace(/[. ]+$/g,"").slice(0,75);
 if(/^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(v))v="_"+v;
 return v;
}
function folderName(d){
 const id=String(d.profileId||""),name=cleanName(d.profileName);
 return ID.test(id)&&name?name+" ["+id+"]":"General";
}
function safeRoute(route){
 return route.replace(/^\/(?:gin\/)?v\d+\//i,"").replace(/\/\d{3,}/g,"/:id")
  .replace(/[^a-zA-Z0-9_.-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,90)||"api";
}
function root(){fs.mkdirSync(BASE,{recursive:true,mode:0o700});return BASE}
function checkData(d){
 if(!d||typeof d!=="object"||typeof d.raw!=="string"||
    typeof d.route!=="string"||d.route.length>220||d.route.includes("?")||
    d.route.includes("#")||!ALLOW.test(d.route)||BLOCK.test(d.route))
  throw Error("Invalid or sensitive API path");
 if(Buffer.byteLength(d.raw,"utf8")>MAX)throw Error("API response is too large");
 if(!Number.isInteger(d.status)||d.status<200||d.status>=300)throw Error("Only successful responses");
 const method=String(d.method||"GET").toUpperCase();
 if(!/^(GET|POST|PUT|PATCH|DELETE)$/.test(method))throw Error("Invalid method");
 const mime=String(d.contentType||"").toLowerCase().split(";")[0].trim();
 if(mime&&!(/^(?:application\/(?:json|[^+\s]+\+json)|text\/(?:plain|json))$/i.test(mime)))
  throw Error("Unsupported response format");
 return {method,extension:mime==="text/plain"?"txt":"json"};
}
ipcMain.handle("dyclokpro:raw:save",(ev,d)=>{
 authorized(ev);
 const {method,extension}=checkData(d);
 const destDir=path.join(root(),folderName(d));
 fs.mkdirSync(destDir,{recursive:true,mode:0o700});
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");
 const prefix=stamp+"_"+method+"_"+safeRoute(d.route);
 for(let n=0;n<6;n++){
  const file=path.join(destDir,prefix+"_"+crypto.randomBytes(6).toString("hex")+"."+extension);
  try{
   fs.writeFileSync(file,Buffer.from(d.raw,"utf8"),{flag:"wx",mode:0o600});
   return {saved:true};
  }catch(e){if(e.code!=="EEXIST")throw e}
 }
 throw Error("Could not create unique response file");
});
ipcMain.handle("dyclokpro:raw:open",async ev=>{
 authorized(ev);
 const error=await shell.openPath(root());
 if(error)throw Error(error);
 return {opened:true};
});
ipcMain.handle("dyclokpro:raw:status",ev=>{
 authorized(ev);return {folder:root(),plaintext:true};
});
})();
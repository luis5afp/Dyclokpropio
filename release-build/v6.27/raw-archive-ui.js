/* DyclokPRO v6.27 - archive received successful API JSON text without rewriting.
 * Read-only XHR/fetch observation; does not change provider authentication,
 * cookies, version headers or Chromium. Binary downloads are not captured.
 */
(()=>{"use strict";
if(window.__dyclokRawArchive627)return;
Object.defineProperty(window,"__dyclokRawArchive627",{value:true});
const LIMIT=12*1024*1024;
const BLOCK=/(?:^|\/)(?:auth|authorize|login|logout|password|token|access_token|refresh_token|session|oauth|2fa)(?:\/|$)/i;
const ALLOW=/^\/(?:gin\/)?v[0-9]+\/(?:env|profile|browser|proxy)(?:\/|$)/i;
const ID=/^(?:[0-9]{1,25}|[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9-]{27,36})$/i;
const names=new Map();
const pending=[];
let busy=0;
function bridge(action,data) {
 const b=window.ipcRenderer;
 if(!b||typeof b.invoke!=="function")return Promise.reject(Error("Electron IPC missing"));
 return b.invoke("dyclokpro:raw:"+action,data);
}
function pathOf(url){
 try{
  const u=new URL(String(url),location.href);
  return /^https?:$/.test(u.protocol)&&ALLOW.test(u.pathname)&&!BLOCK.test(u.pathname)?u:null;
 }catch{return null}
}
function cleanId(v){
 return (typeof v==="string"||typeof v==="number")&&ID.test(String(v))?String(v):"";
}
function profileId(obj){
 if(!obj||typeof obj!=="object"||Array.isArray(obj))return "";
 for(const k of ["id","envId","profileId","browserId","env_id","profile_id"]){
  const x=cleanId(obj[k]);if(x)return x;
 }
 return "";
}
function profileName(obj){
 if(!obj||typeof obj!=="object"||Array.isArray(obj))return "";
 for(const k of ["name","envName","profileName"]){
  const n=obj[k];
  if(typeof n==="string"&&n.trim()&&n.length<=300)return n.trim();
 }
 return "";
}
function rememberProfiles(obj){
 const seen=new WeakSet();let visits=0;
 function walk(v,depth){
  if(!v||typeof v!=="object"||seen.has(v)||depth>8||++visits>12000)return;
  seen.add(v);
  if(Array.isArray(v)){for(const item of v.slice(0,2000))walk(item,depth+1);return}
  const id=profileId(v),name=profileName(v);
  if(id&&name)names.set(id,name);
  for(const [key,value]of Object.entries(v).slice(0,60)){
   if(value&&typeof value==="object"&&!/(?:cookie|token|auth|password|secret)/i.test(key))
    walk(value,depth+1);
  }
 }
 walk(obj,0);
}
function singleProfile(obj){
 for(const x of [obj?.data?.data,obj?.data,obj?.profile,obj?.env,obj]){
  const id=profileId(x),name=profileName(x);
  if(id&&name)names.set(id,name);
 }
}
function idInPath(path){
 const parts=path.split("/").filter(Boolean);
 for(let i=0;i+1<parts.length;i++){
  if(!/^(?:env|envs|profile|profiles|browser|browsers|open_detail|get_browser_data|proxy_use_ip)$/i.test(parts[i]))continue;
  const id=cleanId(parts[i+1]);if(id)return id;
 }
 return "";
}
function save(record){
 busy++;
 void bridge("save",record).catch(()=>{}).finally(()=>{busy--});
}
function flushPending(){
 if(!pending.length||!names.size)return;
 const rest=pending.splice(0);
 for(const record of rest){
  const name=names.get(record.profileId);
  if(name){record.profileName=name;save(record)}
  else pending.push(record);
 }
}
function capture(raw,url,method,status,type){
 if(typeof raw!=="string"||!raw||busy>=15||status<200||status>=300)return;
 if(new TextEncoder().encode(raw).length>LIMIT)return;
 const u=pathOf(url);if(!u)return;
 const mime=String(type||"").toLowerCase().split(";")[0].trim();
 if(mime&&!(/^(?:application\/(?:json|[^+\s]+\+json)|text\/(?:plain|json))$/i.test(mime)))return;
 let obj;
 try{obj=JSON.parse(raw)}catch{return}
 if(!obj||typeof obj!=="object")return;
 const isList=/\/v[0-9]+\/env\/list\/?$/i.test(u.pathname);
 if(isList)rememberProfiles(obj);else singleProfile(obj);
 let id="";
 if(!isList){
  for(const item of [obj?.data?.data,obj?.data,obj?.profile,obj?.env]){
   id=profileId(item);if(id)break;
  }
  if(!id){
   for(const k of ["envId","profileId","browserId","env_id","profile_id"]){
    id=cleanId(u.searchParams.get(k));if(id)break;
   }
  }
  if(!id)id=idInPath(u.pathname);
 }
 const name=id?names.get(id)||"":"";
 const record={raw,route:u.pathname,method:String(method||"GET"),status,
  contentType:mime,profileId:id,profileName:name};
 // Never create folders with API operation names or guessed names.
 if(id&&!name){
  pending.push(record);if(pending.length>70)pending.shift();
  flushPending();
  return;
 }
 save(record);
 flushPending();
}
const xhrOpen=XMLHttpRequest.prototype.open,xhrSend=XMLHttpRequest.prototype.send;
const requestInfo=new WeakMap();
XMLHttpRequest.prototype.open=function(method,url,...args){
 requestInfo.set(this,{method,url});
 return xhrOpen.call(this,method,url,...args);
};
XMLHttpRequest.prototype.send=function(...args){
 const info=requestInfo.get(this);
 if(info&&pathOf(info.url)){
  this.addEventListener("loadend",()=>{
   try{
    if(this.responseType===""||this.responseType==="text")
     capture(this.responseText,info.url,info.method,this.status,this.getResponseHeader("content-type"));
   }catch{}
  },{once:true});
 }
 return xhrSend.apply(this,args);
};
if(typeof window.fetch==="function"){
 const original=window.fetch;
 window.fetch=function(...args){
  const result=original.apply(this,args);
  try{
   const first=args[0],url=typeof first==="string"?first:first?.url;
   if(pathOf(url)){
    result.then(response=>{
     if(Number(response.headers?.get("content-length")||0)>LIMIT)return;
     response.clone().text().then(raw=>
      capture(raw,url,args[1]?.method||first?.method||"GET",response.status,response.headers?.get("content-type")||"")
     ).catch(()=>{});
    }).catch(()=>{});
   }
  }catch{}
  return result;
 };
}
function mount(){
 if(!document.body||document.getElementById("dyclok-plain-archive"))return;
 const button=document.createElement("button");
 button.id="dyclok-plain-archive";
 button.type="button";
 button.textContent="▣ Archivos automáticos · Abrir carpeta";
 button.title="Respuestas API originales en texto sin cifrar; no incluye cookies internas de Chromium";
 button.style.cssText="position:fixed;left:16px;bottom:18px;z-index:19000;background:#10493d;color:#fff;border:1px solid #00bd95;border-radius:9px;cursor:pointer;padding:11px 14px;font:600 13px system-ui;-webkit-app-region:no-drag";
 button.addEventListener("click",()=>void bridge("open").catch(e=>alert("No se pudo abrir la carpeta: "+(e?.message||"Error"))));
 document.body.append(button);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
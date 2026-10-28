/* DyclokPRO v6.11 — guardado automático cifrado de respuestas originales visibles en la aplicación.
 * No lee la base de cookies cifradas del navegador Chromium ni intercepta ginsbrowser.exe.
 * Cada respuesta conserva su texto original dentro de una copia cifrada por Windows.
 */
(()=>{"use strict";
if(window.__dyclokArchivePlain64||window.__dyclokArchiveAuto611)return;
Object.defineProperty(window,"__dyclokArchiveAuto611",{value:true});
const MAX_BYTES=1024*1024,EXCLUDE=/(?:^|\/)(?:login|logout|auth|authorize|password|refresh_token|access_token)(?:\/|$)/i;
const TYPES=["cookies","proxy","configuracion","parametros","otros"];
const TITLES={cookies:"Cookies",proxy:"Proxy",configuracion:"Configuración",parametros:"Inicio de Chromium",otros:"Otros"};
let records=[],panel=null,errors="",state=null,pending=0,reloadTimer=null;
const el=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e};
async function api(method,...args){
 const ipc=window.ipcRenderer;
 if(!ipc||typeof ipc.invoke!=="function")throw Error("El puente de Electron no está disponible");
 return ipc.invoke("dyclokpro:archive:"+method,...args)
}
function routeFrom(url){
 try{
  const u=new URL(String(url),location.href);
  if(!["https:","http:"].includes(u.protocol)||EXCLUDE.test(u.pathname)||
    !/(?:\/v\d+\/|\/env\/|\/profile\/|\/cookies?\/|\/proxy\/|\/settings\/|\/config\/)/i.test(u.pathname))return null;
  return u.pathname.replace(/[0-9a-f-]{18,}/gi,":id").replace(/\/\d{3,}(?=\/|$)/g,"/:id").slice(0,180)
 }catch{return null}
}
function profileFrom(url,obj){
 try{
  const u=new URL(String(url),location.href);
  const raw=u.pathname.match(/\/(?:env|profile|browser)[s]?\/([a-z0-9_.-]{1,80})(?:\/|$)/i)?.[1]||
    ["profileId","envId","browserId","profile_id","env_id"].map(key=>u.searchParams.get(key)).find(Boolean);
  if(raw&&/^[a-z0-9_.-]{1,80}$/i.test(raw))return raw;
 }catch{}
 // Only assign a single-profile response; list endpoints stay in General.
 function one(a){
  if(!a||typeof a!=="object"||Array.isArray(a))return null;
  for(const key of ["profileId","profile_id","envId","env_id","browserId","browser_id"]){
   const x=a[key];if((typeof x==="string"||typeof x==="number")&&/^[\w.-]{1,80}$/.test(String(x)))return String(x)
  }
  return null
 }
 return one(obj)||one(obj?.data)||one(obj?.profile)||""
}
function classify(obj,route){
 const found=new Set(),visited=new WeakSet();
 if(/cookies?/i.test(route))found.add("cookies");
 if(/proxy/i.test(route))found.add("proxy");
 if(/kernel|launch|start|open_env|browser/i.test(route))found.add("parametros");
 if(/config|fingerprint|settings/i.test(route))found.add("configuracion");
 let visitedCount=0;
 function walk(data,depth){
  if(depth>7||!data||typeof data!=="object"||visited.has(data)||++visitedCount>550)return;
  visited.add(data);
  if(Array.isArray(data)){for(const item of data.slice(0,80))walk(item,depth+1);return}
  for(const [key,value]of Object.entries(data).slice(0,85)){
   if(/cookies?|cookieList|cookieData|cookieStorage/i.test(key))found.add("cookies");
   if(/proxy|socks/i.test(key))found.add("proxy");
   if(/fingerprint|timezone|webrtc|webgl|canvas|browserConfig|preferences/i.test(key))found.add("configuracion");
   if(/userAgent|launch|arguments|kernel|browserVersion|startup/i.test(key))found.add("parametros");
   if(value&&typeof value==="object")walk(value,depth+1)
  }
 }
 walk(obj,0);
 if(!found.size)found.add("otros");
 return [...found]
}
async function capture(body,url,method,status){
 if(pending>=16||typeof body!=="string"||!body.length||new TextEncoder().encode(body).length>MAX_BYTES
   ||!Number.isInteger(status)||status<200||status>=300)return;
 const route=routeFrom(url);if(!route)return;
 let obj;try{obj=JSON.parse(body)}catch{return}
 if(!obj||typeof obj!=="object")return;
 pending++;
 try{
  const result=await api("capture",{raw:body,route,method:String(method||"GET").slice(0,12),
    status,profile:profileFrom(url,obj),types:classify(obj,route)});
  if(result.saved&&panel)scheduleReload()
 }catch(e){errors=e?.message||"No se pudo proteger el archivo";if(panel)render()}
 finally{pending--}
}
const xhrOpen=XMLHttpRequest.prototype.open,xhrSend=XMLHttpRequest.prototype.send,metadata=new WeakMap();
XMLHttpRequest.prototype.open=function(method,url,...rest){
 metadata.set(this,{method,url});return xhrOpen.call(this,method,url,...rest)
};
XMLHttpRequest.prototype.send=function(...rest){
 const info=metadata.get(this);
 if(info&&routeFrom(info.url)){
  this.addEventListener("loadend",function(){
   try{if(this.responseType===""||this.responseType==="text")
     void capture(this.responseText,info.url,info.method,this.status)}catch{}
  },{once:true})
 }
 return xhrSend.apply(this,rest)
};
if(typeof window.fetch==="function"){
 const nativeFetch=window.fetch;
 window.fetch=function(...args){
  const result=nativeFetch.apply(this,args);
  try{
   const first=args[0],url=typeof first==="string"?first:first?.url;
   if(routeFrom(url))result.then(response=>{
    if(Number(response.headers?.get("content-length")||0)>MAX_BYTES)return;
    response.clone().text().then(raw=>void capture(raw,url,args[1]?.method||first?.method||"GET",response.status)).catch(()=>{})
   }).catch(()=>{})
  }catch{}
  return result
 }
}
function scheduleReload(){
 if(reloadTimer)return;
 reloadTimer=setTimeout(()=>{reloadTimer=null;void reload()},550)
}
async function reload(){
 try{state=await api("list");records=state.records||[];errors="";render()}
 catch(e){errors=e?.message||"El archivo automático no está disponible";render()}
}
function close(){panel?.remove();panel=null}
function message(s){errors=s;render()}
async function showRecord(id){
 if(!confirm("Esta respuesta podría contener cookies o tokens de sesión. ¿Quieres verla en esta pantalla?"))return;
 try{
  const record=await api("read",id);
  const overlay=el("div",undefined,"dy-saved-viewer");
  const box=el("section",undefined,"dy-saved-viewer-box");
  const title=el("h3",TITLES[record.type]+" · "+record.profile);
  const closeButton=el("button","Cerrar");closeButton.onclick=()=>overlay.remove();
  const details=el("pre",record.raw);
  box.append(title,closeButton,el("p","Original recibido por la aplicación · "+record.route),details);
  overlay.append(box);document.body.append(overlay);
  overlay.addEventListener("click",ev=>{if(ev.target===overlay)overlay.remove()})
 }catch(e){message(e?.message||"No se pudo leer el registro")}
}
async function exportRecord(id){
 if(!confirm("La exportación crea un archivo SIN CIFRAR. Puede contener información privada. ¿Continuar?"))return;
 try{await api("export",id)}
 catch(e){message(e?.message||"No se pudo exportar")}
}
function render(){
 if(!panel)return;
 const body=panel.querySelector(".dy-save-body");body.replaceChildren();
 body.append(el("p","Estado: "+(state?"Guardado automático ACTIVO · cifrado de Windows":"Comprobando protección del archivo...")+
   " · Respuestas más recientes: "+records.length));
 body.append(el("p","Carpeta permanente de esta cuenta: "+(state?.folder||"No disponible"),"dy-save-folder"));
 body.append(el("p","Los archivos se crean automáticamente cuando DyclokPRO recibe respuestas relacionadas con perfiles. Cada perfil y categoría conserva su versión más reciente cifrada.","dy-save-note"));
 if(errors)body.append(el("p",errors,"dy-save-warning"));
 const controls=el("div",undefined,"dy-save-controls");
 function button(parent,txt,fn){
  const b=el("button",txt);b.type="button";b.onclick=fn;parent.append(b);return b
 }
 button(controls,"Abrir carpeta de esta cuenta",async()=>{try{await api("openFolder")}catch(e){message(e?.message||"Carpeta inaccesible")}});
 button(controls,"Actualizar listado",()=>void reload());
 body.append(controls);
 const categories=el("div",undefined,"dy-save-controls");
 for(const type of TYPES){
  const n=records.filter(x=>x.type===type).length;
  categories.append(el("span",TITLES[type]+" ("+n+")","dy-save-category"));
 }
 body.append(categories);
 const table=el("table",undefined,"dy-save-table");
 const header=el("tr");
 for(const col of ["Perfil","Categoría","Última actualización","Ruta","Acciones"])header.append(el("th",col));
 table.append(header);
 for(const row of records.slice(0,140)){
  const tr=el("tr");
  for(const value of [row.profile,TITLES[row.type],new Date(row.timestamp).toLocaleString(),row.path])
   tr.append(el("td",String(value)));
  const actions=el("td");
  button(actions,"Ver",()=>void showRecord(row.id));
  button(actions,"Exportar",()=>void exportRecord(row.id));
  tr.append(actions);table.append(tr)
 }
 body.append(table);
 if(!records.length)body.append(el("p","Aún no hay respuestas archivadas. Abre o actualiza un perfil para registrar las respuestas que DyclokPRO pueda observar.","dy-save-note"));
 body.append(el("p","Importante: las cookies propias del navegador Chromium permanecen bajo la gestión de Chromium. Este archivo registra respuestas HTTP visibles a DyclokPRO, no las cookies cifradas internas de ginsbrowser.exe.","dy-save-warning"))
}
function openPanel(){
 close();panel=el("div",undefined,"dy-save-backdrop");
 const box=el("section",undefined,"dy-save-dialog");
 box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");
 const header=el("header"),title=el("h2","Archivo automático por cuenta y perfil · DyclokPRO");
 const closeBtn=el("button","Cerrar ×");
 closeBtn.onclick=close;header.append(title,closeBtn);box.append(header,el("div",undefined,"dy-save-body"));
 panel.append(box);document.body.append(panel);
 panel.addEventListener("click",ev=>{if(ev.target===panel)close()});
 render();void reload()
}
const css=[
"#dy-save-button{position:fixed;left:16px;bottom:18px;z-index:19000;background:#0e4035;color:#fff;border:1px solid #00bd95;border-radius:9px;cursor:pointer;padding:11px 14px;font:600 13px system-ui}",
"#dy-save-backdrop,.dy-saved-viewer{position:fixed;inset:0;background:#000c;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:14px}",
"#dy-save-dialog,.dy-saved-viewer-box{background:#1d2221;color:#f4fffa;border:1px solid #547566;border-radius:12px;width:min(1100px,96vw);max-height:92vh;display:flex;flex-direction:column;font:14px system-ui}",
"#dy-save-dialog header{display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid #526257}",
"#dy-save-dialog h2,.dy-saved-viewer-box h3{color:#24d3a3;font-size:20px;margin:0}",
"#dy-save-dialog .dy-save-body{overflow:auto;padding:16px}",
"#dy-save-dialog button,.dy-saved-viewer-box button{background:#255246;border:1px solid #4c937e;color:white;padding:9px;cursor:pointer;border-radius:6px;margin:3px}",
"#dy-save-dialog .dy-save-controls{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}",
"#dy-save-dialog .dy-save-warning{color:#ffcc8f;font-weight:600}",
"#dy-save-dialog .dy-save-note,#dy-save-dialog .dy-save-folder{font-size:12px;line-height:1.6;color:#bbd0c9;overflow-wrap:anywhere}",
"#dy-save-dialog .dy-save-table{width:100%;border-collapse:collapse;font-size:12px}",
"#dy-save-dialog th,#dy-save-dialog td{border-bottom:1px solid #3d4c44;padding:8px;text-align:left;overflow-wrap:anywhere}",
"#dy-save-dialog th{color:#1cddb0}",
"#dy-save-dialog .dy-save-category{display:inline-block;padding:9px;background:#255246;border:1px solid #4c937e;border-radius:6px}",
".dy-saved-viewer{z-index:2147483600}",
".dy-saved-viewer-box{padding:17px;gap:12px}",
".dy-saved-viewer-box pre{overflow:auto;white-space:pre-wrap;word-break:break-all;max-height:65vh;background:#101614;padding:15px}",
"#dp-inspector-open,#dy-arch-launch{display:none!important}"
].join("\n");
function mount(){
 if(!document.body)return;
 const style=el("style");style.textContent=css;document.head.append(style);
 const b=el("button","▣  Archivo automático · Cookies / Proxy");
 b.id="dy-save-button";b.type="button";b.title="Ver respuestas guardadas automáticamente con cifrado local";
 b.addEventListener("click",openPanel);document.body.append(b);
 void api("status").then(info=>{state=info}).catch(e=>{errors=e?.message||"Error al iniciar archivo seguro"})
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount()
})();
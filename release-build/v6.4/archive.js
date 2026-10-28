/* Dyclokpro v6.4 - Archivo de respuestas originales SIN CIFRAR.
 * Captura respuestas visibles a esta interfaz, nunca cambia lo recibido.
 * Los datos originales se guardan como texto plano SOLO tras activación explícita.
 * No intercepta el tráfico de Chromium ni sustituye autorizaciones del servidor.
 */
(()=>{
"use strict";
if(window.__dyclokArchivePlain64)return;
Object.defineProperty(window,"__dyclokArchivePlain64",{value:true});
const DB="Dyclokpro_Respuestas_Originales_v64",MAX_RESPONSE=1048576,MAX_RECORDS=1200;
const EXCLUDE=/(?:^|\/)(?:login|logout|auth|authorize|password|refresh_token|access_token)(?:\/|$)/i;
let db=null,records=[],enabled=false,panel=null,folder=null,errors="",pending=0;
const CATEGORIES=["cookies","proxy","configuracion","parametros","otros"];
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const transaction=(r)=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
function getPath(url){
  try{
    const u=new URL(String(url),location.href);
    if(u.protocol!=="https:"&&u.protocol!=="http:")return null;
    if(!/(?:\/v\d+\/|\/env\/|\/profile\/|\/cookies?\/|\/proxy\/|\/settings\/|\/config\/)/i.test(u.pathname))return null;
    if(EXCLUDE.test(u.pathname))return null;
    return u.pathname.replace(/[a-f0-9-]{18,}/gi,":id").replace(/\/\d{3,}(?=\/|$)/g,"/:id").slice(0,180);
  }catch{return null}
}
function classify(raw,path){
  let data;
  try{data=JSON.parse(raw)}catch{return null}
  const kinds=new Set(),visited=new WeakSet();
  if(/cookies?/i.test(path))kinds.add("cookies");
  if(/proxy/i.test(path))kinds.add("proxy");
  if(/kernel|launch|start|open_env|browser/i.test(path))kinds.add("parametros");
  if(/config|fingerprint|settings/i.test(path))kinds.add("configuracion");
  let examined=0;
  function visit(obj,depth){
    if(depth>7||!obj||typeof obj!=="object"||visited.has(obj)||++examined>600)return;
    visited.add(obj);
    if(Array.isArray(obj)){for(const item of obj.slice(0,90))visit(item,depth+1);return}
    for(const [key,value] of Object.entries(obj).slice(0,90)){
      if(/cookies?|cookieList|cookieData|cookieStorage/i.test(key))kinds.add("cookies");
      if(/proxy|socks/i.test(key))kinds.add("proxy");
      if(/fingerprint|timezone|webrtc|webgl|canvas|browserConfig|preferences/i.test(key))kinds.add("configuracion");
      if(/userAgent|launch|arguments|kernel|browserVersion|startup/i.test(key))kinds.add("parametros");
      if(value&&typeof value==="object")visit(value,depth+1);
    }
  }
  visit(data,0);
  if(!kinds.size)kinds.add("otros");
  return Array.from(kinds);
}
async function load(){
  if(!db)return;
  try{
    records=(await transaction(db.transaction("records","readonly").objectStore("records").getAll()))
      .sort((a,b)=>b.id-a.id);
    const state=await transaction(db.transaction("settings","readonly").objectStore("settings").get("enabled"));
    enabled=state?.value===true;
  }catch{errors="No se pudo consultar el almacenamiento local."}
  render();
}
function startDB(){
  if(!window.indexedDB){errors="IndexedDB no está disponible en este entorno.";return}
  const request=indexedDB.open(DB,1);
  request.onupgradeneeded=()=>{
    const d=request.result;
    if(!d.objectStoreNames.contains("records"))d.createObjectStore("records",{keyPath:"id",autoIncrement:true});
    if(!d.objectStoreNames.contains("settings"))d.createObjectStore("settings",{keyPath:"id"});
  };
  request.onsuccess=()=>{db=request.result;void load()};
  request.onerror=()=>{errors="No se pudo inicializar el archivo local.";render()};
}
async function setEnabled(on){
  if(on&&!confirm("AVISO: se guardarán respuestas originales SIN CIFRAR en este equipo. Pueden contener cookies de sesión, proxies, contraseñas y tokens. Solo actívalo en tu propio equipo y perfiles autorizados. ¿Activar?"))return;
  if(!db){alert("El almacenamiento local no está disponible.");return}
  try{
    await transaction(db.transaction("settings","readwrite").objectStore("settings").put({id:"enabled",value:on}));
    enabled=on;errors="";render();
  }catch{errors="No se pudo modificar la configuración del archivo.";render()}
}
function filename(type,row){
  const stamp=new Date(row.timestamp).toISOString().replace(/[:.]/g,"-");
  return "Dyclokpro_"+type+"_"+stamp+"_"+row.id+(type==="proxy"?".txt":".json")
}
async function writeToSelectedFolder(row){
  if(!folder)return;
  for(const type of row.types){
    const name=filename(type,row);
    const handle=await folder.getFileHandle(name,{create:true});
    const writable=await handle.createWritable();
    try{await writable.write(row.raw)}finally{await writable.close()}
  }
}
async function chooseFolder(){
  if(typeof window.showDirectoryPicker!=="function"){
    alert("La selección automática de carpetas no está disponible en esta ventana. Usa los botones Guardar JSON/TXT.");
    return
  }
  try{
    folder=await window.showDirectoryPicker({mode:"readwrite"});
    errors="";render();
  }catch(e){if(e?.name!=="AbortError"){errors="No se pudo usar la carpeta elegida.";render()}}
}
async function capture(body,url,method,status){
  if(!enabled||!db||pending>12||typeof body!=="string"||body.length>MAX_RESPONSE||status<200||status>=300)return;
  const path=getPath(url);
  if(!path)return;
  const types=classify(body,path);
  if(!types)return;
  pending++;
  try{
    // Texto de respuesta íntegro, sin JSON.parse/serialize ni cifrado.
    const row={timestamp:Date.now(),path,method:String(method||"GET").slice(0,16),
      status,types,raw:body};
    row.id=await transaction(db.transaction("records","readwrite").objectStore("records").add(row));
    if(folder){
      try{await writeToSelectedFolder(row)}
      catch{errors="La copia en la carpeta seleccionada falló; se conserva en el archivo local."}
    }
    const all=await transaction(db.transaction("records","readonly").objectStore("records").getAll());
    if(all.length>MAX_RECORDS){
      const tx=db.transaction("records","readwrite");
      for(const old of all.slice(0,all.length-MAX_RECORDS))tx.objectStore("records").delete(old.id);
    }
    records=all.slice(-MAX_RECORDS).sort((a,b)=>b.id-a.id);
    render();
  }catch{errors="No se pudo guardar la respuesta; verifica almacenamiento y permisos.";render()}
  finally{pending--}
}
// No cambia los argumentos ni las respuestas entregadas a la aplicación.
const xhrOpen=XMLHttpRequest.prototype.open,xhrSend=XMLHttpRequest.prototype.send,xhrMeta=new WeakMap();
XMLHttpRequest.prototype.open=function(method,url,...args){
  xhrMeta.set(this,{method,url});
  return xhrOpen.call(this,method,url,...args)
};
XMLHttpRequest.prototype.send=function(...args){
  const info=xhrMeta.get(this);
  if(info&&getPath(info.url)){
    this.addEventListener("loadend",function(){
      try{
        if(this.responseType===""||this.responseType==="text")
          void capture(this.responseText,info.url,info.method,this.status)
      }catch{}
    },{once:true});
  }
  return xhrSend.apply(this,args)
};
if(typeof window.fetch==="function"){
  const originalFetch=window.fetch;
  window.fetch=function(...args){
    const response=originalFetch.apply(this,args);
    try{
      const a=args[0],url=typeof a==="string"?a:a?.url,options=args[1];
      if(getPath(url))response.then(r=>{
        const size=Number(r.headers?.get("content-length")||0);
        if(size>MAX_RESPONSE)return;
        r.clone().text().then(body=>capture(body,url,options?.method||a?.method||"GET",r.status)).catch(()=>{});
      }).catch(()=>{});
    }catch{}
    return response
  }
}
function download(filename,text,mime){
  const blob=new Blob([text],{type:mime});
  const href=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=href;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),10000)
}
function exportType(type){
  const items=records.filter(r=>r.types.includes(type)).slice().reverse();
  if(!items.length){alert("No hay respuestas observadas de este tipo.");return}
  if(!confirm("Los archivos se guardarán SIN CIFRAR y pueden contener claves de sesión, cookies o contraseñas. ¿Exportarlos a tu carpeta de descargas?"))return;
  for(const row of items){
    download(filename(type,row),row.raw,type==="proxy"?"text/plain;charset=utf-8":"application/json;charset=utf-8");
  }
}
async function clearArchive(){
  if(!confirm("¿Borrar permanentemente las copias locales de este archivo? No afecta al servidor, a Chromium ni a sus perfiles."))return;
  if(!confirm("Confirma nuevamente que deseas borrar únicamente los registros archivados."))return;
  try{await transaction(db.transaction("records","readwrite").objectStore("records").clear());records=[];render()}
  catch{errors="No se pudo borrar el archivo local.";render()}
}
function close(){if(panel){panel.remove();panel=null}}
function render(){
  if(!panel)return;
  const area=panel.querySelector(".dy-save-body");
  if(!area)return;
  area.replaceChildren();
  area.append(el("p","Estado: "+(enabled?"Guardado original ACTIVADO":"Guardado detenido")+
    " · Respuestas guardadas: "+records.length+" · Carpeta de archivos: "+(folder?"Seleccionada":"No seleccionada")));
  const caution=el("p","ATENCIÓN: LAS COPIAS ESTÁN EN TEXTO PLANO, SIN CIFRADO. Resguarda tu PC. No compartas estos archivos ni los subas a GitHub.","dy-save-warning");
  area.append(caution);
  area.append(el("p","Los registros se conservan localmente. Para crear .json/.txt automáticamente, selecciona una carpeta y mantenla autorizada mientras la ventana esté abierta.","dy-save-note"));
  if(errors)area.append(el("p",errors,"dy-save-warning"));
  const controls=el("div",undefined,"dy-save-controls");
  function action(title,fn){const b=el("button",title);b.type="button";b.addEventListener("click",fn);controls.append(b);return b}
  action(enabled?"Detener guardado":"Activar guardado original",()=>setEnabled(!enabled));
  action("Elegir carpeta para archivos .json / .txt",chooseFolder);
  action("Actualizar listado",load);
  action("Borrar archivo local",clearArchive);
  area.append(controls);
  area.append(el("p","Exportar las respuestas originales, por tipo y sin alteraciones, aunque no se haya seleccionado una carpeta:","dy-save-note"));
  const exports=el("div",undefined,"dy-save-controls");
  for(const [type,title,ext] of [["cookies","Cookies","JSON"],["proxy","Proxy","TXT"],
    ["configuracion","Configuración","JSON"],["parametros","Inicio de Chromium","JSON"],["otros","Otros","JSON"]]){
    const count=records.filter(r=>r.types.includes(type)).length;
    const b=el("button",title+" ("+count+") · "+ext);
    b.addEventListener("click",()=>exportType(type));exports.append(b)
  }
  area.append(exports);
  const table=el("table",undefined,"dy-save-table"),thead=el("thead"),heading=el("tr");
  for(const label of ["Hora","Categoría","Ruta","Estado"]){heading.append(el("th",label))}
  thead.append(heading);table.append(thead);
  const tbody=el("tbody");
  for(const r of records.slice(0,100)){
    const tr=el("tr");
    for(const v of [new Date(r.timestamp).toLocaleString(),r.types.join(", "),r.path,r.status])
      tr.append(el("td",String(v)));
    tbody.append(tr)
  }
  table.append(tbody);area.append(table);
  area.append(el("p","Limitación: solo registra solicitudes HTTP visibles a la ventana de Dyclokpro. No intercepta el tráfico de ginsbrowser.exe ni copia por sí solo las cookies cifradas de Chromium.","dy-save-note"))
}
function openPanel(){
  close();
  const backdrop=el("div");backdrop.id="dy-save-backdrop";panel=backdrop;
  const box=el("section");box.id="dy-save-dialog";box.setAttribute("role","dialog");
  box.setAttribute("aria-modal","true");
  const heading=el("header"),title=el("h2","Archivo local de respuestas originales · Dyclokpro");
  const closeBtn=el("button","Cerrar ×");closeBtn.addEventListener("click",close);
  heading.append(title,closeBtn);box.append(heading);box.append(el("div",undefined,"dy-save-body"));
  backdrop.append(box);document.body.append(backdrop);
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)close()});
  backdrop.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  render();closeBtn.focus()
}
const css=[
  "#dy-save-button{position:fixed;left:16px;bottom:18px;z-index:19000;background:#0e4035;color:white;border:1px solid #00bd95;border-radius:9px;cursor:pointer;padding:11px 14px;font:600 13px system-ui}",
  "#dy-save-backdrop{position:fixed;inset:0;background:#000c;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:14px}",
  "#dy-save-dialog{background:#1d2221;color:#f4fffa;border:1px solid #547566;border-radius:12px;width:min(1000px,96vw);max-height:92vh;display:flex;flex-direction:column;font:14px system-ui}",
  "#dy-save-dialog header{display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid #526257}",
  "#dy-save-dialog h2{color:#24d3a3;font-size:20px;margin:0}",
  "#dy-save-dialog .dy-save-body{overflow:auto;padding:16px}",
  "#dy-save-dialog button{background:#255246;border:1px solid #4c937e;color:white;padding:9px;cursor:pointer;border-radius:6px}",
  "#dy-save-dialog .dy-save-controls{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}",
  "#dy-save-dialog .dy-save-warning{color:#ffcc8f;font-weight:600}",
  "#dy-save-dialog .dy-save-note{font-size:12px;line-height:1.6;color:#bbd0c9}",
  "#dy-save-dialog .dy-save-table{width:100%;border-collapse:collapse;font-size:12px}",
  "#dy-save-dialog th,#dy-save-dialog td{border-bottom:1px solid #3d4c44;padding:8px;text-align:left;overflow-wrap:anywhere}",
  "#dy-save-dialog th{color:#1cddb0}",
  "#dp-inspector-open,#dy-arch-launch{display:none!important}"
].join("\n");
function mount(){
  if(!document.body||document.getElementById("dy-save-button"))return;
  const style=el("style");style.textContent=css;document.head.append(style);
  const button=el("button","▣  Archivo original · Cookies / Proxy");
  button.id="dy-save-button";button.type="button";
  button.title="Guardar respuestas visibles sin cifrar y sin modificar el servidor";
  button.addEventListener("click",openPanel);
  document.body.append(button)
}
startDB();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
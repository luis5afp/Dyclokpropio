/* Dyclokpro v6.4 — archivo local persistente de respuestas observables.
 * No cambia solicitudes ni respuestas. El texto original se guarda cifrado
 * (AES-GCM) solo tras activación con contraseña. No registra tráfico Chromium.
 */
(() => {
"use strict";
if (window.__dyclokArchiveV64) return;
Object.defineProperty(window,"__dyclokArchiveV64",{value:true});
const NAME="Dyclokpro_Archivo_Servidor_v1", MAX=1200, MAX_RESPONSE=1048576;
const encoder=new TextEncoder(),decoder=new TextDecoder();
let db=null,key=null,records=[],status="iniciando",lastError="",dialog=null,filter="todos",pending=0;
const el=(tag,content,cls)=>{const x=document.createElement(tag);if(content!==undefined)x.textContent=content;if(cls)x.className=cls;return x};
function reqPromise(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function openDb(){
 if(!window.indexedDB){status="sin almacenamiento";lastError="IndexedDB no disponible";return}
 const request=indexedDB.open(NAME,1);
 request.onupgradeneeded=()=>{
   const d=request.result;
   if(!d.objectStoreNames.contains("captures"))d.createObjectStore("captures",{keyPath:"id",autoIncrement:true});
   if(!d.objectStoreNames.contains("settings"))d.createObjectStore("settings",{keyPath:"id"});
 };
 request.onsuccess=()=>{db=request.result;status="metadatos guardados";refresh()};
 request.onerror=()=>{status="error";lastError="No se pudo abrir el archivo local";draw()};
}
async function settingsGet(id){
 return reqPromise(db.transaction("settings","readonly").objectStore("settings").get(id))
}
async function settingsPut(value){
 return reqPromise(db.transaction("settings","readwrite").objectStore("settings").put(value))
}
async function derive(password){
 if(!crypto.subtle)throw Error("WebCrypto no está disponible en esta ventana.");
 if(password.length<12)throw Error("La contraseña necesita al menos 12 caracteres.");
 let salt=await settingsGet("salt");
 if(!salt){salt={id:"salt",value:Array.from(crypto.getRandomValues(new Uint8Array(16)))};await settingsPut(salt)}
 const master=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveKey"]);
 const derived=await crypto.subtle.deriveKey({name:"PBKDF2",salt:new Uint8Array(salt.value),
   iterations:310000,hash:"SHA-256"},master,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
 let verifier=await settingsGet("verifier");
 if(verifier){
   try{
     const result=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(verifier.iv)},
       derived,new Uint8Array(verifier.cipher));
     if(decoder.decode(result)!=="DyclokproArchivoV64")throw Error("Clave inválida");
   }catch{throw Error("La contraseña no coincide con el archivo existente.")}
 }else{
   const iv=crypto.getRandomValues(new Uint8Array(12));
   const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},derived,encoder.encode("DyclokproArchivoV64"));
   verifier={id:"verifier",iv:Array.from(iv),cipher:new Uint8Array(cipher)};
   await settingsPut(verifier);
 }
 return derived
}
async function unlock(){
 if(!db){alert("El archivo local no está disponible todavía.");return}
 const password=prompt("Contraseña para guardar respuestas originales cifradas (12 caracteres mínimo). Usa la misma tras reiniciar. Nunca se transmite al servidor.");
 if(password===null)return;
 try{key=await derive(password);lastError="";status="archivo cifrado activo";
   alert("Archivo activado. Las nuevas respuestas visibles a Dyclokpro quedarán archivadas con cifrado AES-GCM.");
 }catch(err){lastError=String(err.message||"No se pudo desbloquear");alert(lastError)}
 draw();
}
async function encryptRaw(text){
 const current=key;
 if(!current)return null;
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},current,encoder.encode(text));
 return {iv:Array.from(iv),cipher:new Uint8Array(cipher)}
}
async function decryptRaw(row){
 if(!key||!row.raw)throw Error("Archivo bloqueado o respuesta sin original cifrado.");
 const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(row.raw.iv)},
   key,new Uint8Array(row.raw.cipher));
 return decoder.decode(plain);
}
function sourcePath(url){
 try{
   const u=new URL(String(url),location.href);
   if(!/^https?:$/.test(u.protocol))return null;
   if(!/(?:\/v\d+\/|\/api\/|\/env\/|\/profile\/|\/cookies?\/|\/proxy\/)/i.test(u.pathname))return null;
   // No registrar queries, hosts, tokens, IDs de perfil u otros datos personales de la URL.
   return u.pathname.replace(/[a-f0-9-]{18,}/gi,":id").replace(/\/\d{3,}(?=\/|$)/g,"/:id").slice(0,180);
 }catch{return null}
}
function inspectShape(raw,path){
 const kinds=new Set();
 if(/cookie/i.test(path))kinds.add("cookies");
 if(/proxy/i.test(path))kinds.add("proxy");
 if(/kernel|start|launch|open_env|browser/i.test(path))kinds.add("parametros");
 if(/fingerprint|config|settings/i.test(path))kinds.add("configuracion");
 let json;try{json=JSON.parse(raw)}catch{return null}
 const seen=new WeakSet();let count=0;
 function visit(obj,level){
   if(!obj||typeof obj!=="object"||seen.has(obj)||level>6||++count>450)return;
   seen.add(obj);
   if(Array.isArray(obj)){for(const value of obj.slice(0,80))visit(value,level+1);return}
   for(const [field,value] of Object.entries(obj).slice(0,70)){
     if(/cookies?|cookieList|cookieStorage|cookieData/i.test(field))kinds.add("cookies");
     if(/proxy|socks/i.test(field))kinds.add("proxy");
     if(/fingerprint|timezone|webrtc|webgl|canvas|browserConfig/i.test(field))kinds.add("configuracion");
     if(/userAgent|launch|arguments|kernel|browserVersion/i.test(field))kinds.add("parametros");
     if(value&&typeof value==="object")visit(value,level+1);
   }
 }
 visit(json,0);
 if(!kinds.size)kinds.add("otros");
 return Array.from(kinds);
}
async function refresh(){
 if(!db)return;
 try{
   records=(await reqPromise(db.transaction("captures","readonly").objectStore("captures").getAll()))
     .sort((a,b)=>b.id-a.id);
   draw();
 }catch{lastError="Error al leer el índice local.";draw()}
}
async function saveObserved(raw,url,method,statusCode){
 if(!db||pending>12||typeof raw!=="string"||raw.length>MAX_RESPONSE||statusCode<200||statusCode>=300)return;
 const path=sourcePath(url);
 if(!path)return;
 const types=inspectShape(raw,path);
 if(!types)return;
 pending++;
 try{
   const encrypted=await encryptRaw(raw);
   const row={timestamp:Date.now(),path,method:String(method||"GET").slice(0,12),status:statusCode,
     types,originalLength:raw.length,raw:encrypted};
   await reqPromise(db.transaction("captures","readwrite").objectStore("captures").add(row));
   const all=await reqPromise(db.transaction("captures","readonly").objectStore("captures").getAll());
   if(all.length>MAX){
     const tx=db.transaction("captures","readwrite");for(const old of all.slice(0,all.length-MAX))tx.objectStore("captures").delete(old.id);
   }
   records=all.slice(-MAX).sort((a,b)=>b.id-a.id);
   status=key?"archivo cifrado activo":"solo metadatos";
   draw();
 }catch{lastError="No se pudo conservar una respuesta; comprueba espacio y permisos."}
 finally{pending--}
}
// Una copia asíncrona del cuerpo no interfiere con el consumidor original.
const xhrOpen=XMLHttpRequest.prototype.open,xhrSend=XMLHttpRequest.prototype.send;
const xhrInfo=new WeakMap();
XMLHttpRequest.prototype.open=function(method,url,...args){
 xhrInfo.set(this,{method,url});return xhrOpen.call(this,method,url,...args)
};
XMLHttpRequest.prototype.send=function(...args){
 const info=xhrInfo.get(this);
 if(info&&sourcePath(info.url)){
   this.addEventListener("loadend",function(){
     try{if(this.responseType===""||this.responseType==="text")
       void saveObserved(this.responseText,info.url,info.method,this.status)
     }catch{}
   },{once:true});
 }
 return xhrSend.apply(this,args)
};
if(typeof window.fetch==="function"){
 const original=window.fetch;
 window.fetch=function(...args){
   const promise=original.apply(this,args);
   try{
     const r=args[0],url=typeof r==="string"?r:r?.url,opts=args[1];
     if(sourcePath(url))promise.then(response=>{
       const reported=Number(response.headers?.get("content-length")||0);
       if(reported>MAX_RESPONSE)return;
       response.clone().text().then(body=>saveObserved(body,url,opts?.method||r?.method||"GET",response.status)).catch(()=>{});
     }).catch(()=>{});
   }catch{}
   return promise
 }
}
function dl(filename,contents,mime){
 const blob=new Blob([contents],{type:mime});
 const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=filename;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),12000)
}
async function exportType(type){
 if(!key){alert("Desbloquea el archivo con tu contraseña antes de exportar originales.");return}
 const list=records.filter(r=>r.raw&&r.types.includes(type)).slice().reverse();
 if(!list.length){alert("No hay respuestas originales cifradas de esta categoría. Recarga el perfil después de desbloquear.");return}
 if(!confirm("ATENCIÓN: el archivo exportado puede contener cookies de sesión, contraseñas y tokens. Guarda el archivo solo en una carpeta privada. ¿Exportar?"))return;
 try{
   const items=[];
   for(const row of list){
     const original=await decryptRaw(row);
     items.push({fecha:new Date(row.timestamp).toISOString(),origen_ruta:row.path,
       tipo:row.types,metodo:row.method,respuesta_original_texto:original})
   }
   const date=new Date().toISOString().slice(0,10);
   if(type==="proxy"){
     const text=items.map((item,i)=>"===== PROXY "+(i+1)+" "+item.fecha+" =====\r\n"+item.respuesta_original_texto)
       .join("\r\n\r\n");
     dl("Dyclokpro_proxy_"+date+".txt",text,"text/plain;charset=utf-8");
   }else{
     const names={cookies:"cookies",configuracion:"configuracion",parametros:"parametros_inicio",otros:"otros"};
     dl("Dyclokpro_"+names[type]+"_"+date+".json",JSON.stringify({tipo: type,fuente:"Dyclokpro HTTP",
       capturas:items},null,2),"application/json;charset=utf-8")
   }
 }catch{alert("Falló la exportación. Comprueba la contraseña o la integridad del archivo local.")}
}
function closePanel(){if(dialog){dialog.remove();dialog=null}}
function draw(){
 if(!dialog)return;
 const body=dialog.querySelector(".dy-arch-body");
 if(!body)return;
 body.replaceChildren();
 const p=el("p","Estado: "+status+". Registros locales: "+records.length+". Originales cifrados: "+records.filter(r=>r.raw).length);
 body.append(p);
 const note=el("p","Se guarda un índice automáticamente. Para conservar los textos originales tal como llegaron, desbloquea el cifrado; al reiniciar deberás introducir la contraseña otra vez.");
 note.className="dy-arch-note";body.append(note);
 if(lastError){const warn=el("p",lastError);warn.style.color="#ffbd86";body.append(warn)}
 const control=el("div",undefined,"dy-arch-controls");
 const on=el("button",key?"Archivo desbloqueado":"Activar / desbloquear cifrado");
 on.disabled=!!key;on.addEventListener("click",unlock);control.append(on);
 const off=el("button","Bloquear");
 off.disabled=!key;off.addEventListener("click",()=>{key=null;status="solo metadatos";draw()});control.append(off);
 const reload=el("button","Actualizar");
 reload.addEventListener("click",refresh);control.append(reload);body.append(control);
 const hint=el("p","Exportaciones manuales por categoría. Cookies se guardan en JSON, proxy en TXT y las demás configuraciones en JSON. Los originales pueden contener secretos.");
 hint.className="dy-arch-note";body.append(hint);
 const buttons=el("div",undefined,"dy-arch-controls");
 for(const [kind,label,ext] of [["cookies","Cookies","JSON"],["proxy","Proxy","TXT"],["configuracion","Configuración","JSON"],["parametros","Parámetros de inicio","JSON"],["otros","Otros","JSON"]]){
   const count=records.filter(x=>x.types.includes(kind)).length;
   const b=el("button",label+" ("+count+") · "+ext);b.addEventListener("click",()=>exportType(kind));buttons.append(b)
 }
 body.append(buttons);
 const table=el("table",undefined,"dy-arch-table"),thead=el("thead"),h=el("tr");
 for(const title of ["Fecha","Categoría","Ruta","Original guardado"]){h.append(el("th",title))}
 thead.append(h);table.append(thead);
 const tbody=el("tbody");
 for(const item of records.slice(0,80)){
   const tr=el("tr");
   for(const val of [new Date(item.timestamp).toLocaleString(),item.types.join(", "),item.path,item.raw?"Cifrado":"Solo índice"])
     tr.append(el("td",val));
   tbody.append(tr);
 }
 table.append(tbody);body.append(table);
}
const css=[
"#dy-arch-launch{position:fixed;left:16px;bottom:18px;z-index:10000;background:#123a2f;color:#ecfff7;border:1px solid #0fc69d;padding:11px 14px;border-radius:9px;cursor:pointer;font:600 13px system-ui}",
"#dy-arch-backdrop{position:fixed;inset:0;background:#000c;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:18px}",
"#dy-arch-modal{width:min(960px,98vw);max-height:90vh;display:flex;flex-direction:column;overflow:hidden;background:#1c2021;color:#eef7f3;border:1px solid #627269;border-radius:12px;font:14px system-ui}",
"#dy-arch-modal header{padding:16px;border-bottom:1px solid #47504b;display:flex;align-items:center;justify-content:space-between}",
"#dy-arch-modal h2{font-size:21px;color:#25ddb1;margin:0}",
"#dy-arch-modal button{cursor:pointer;background:#234a3e;border:1px solid #338768;color:white;border-radius:6px;padding:9px}",
"#dy-arch-modal button:disabled{opacity:.55;cursor:default}",
"#dy-arch-modal .dy-arch-body{padding:16px;overflow:auto}",
"#dy-arch-modal .dy-arch-note{font-size:12px;color:#bed5c9;line-height:1.55}",
"#dy-arch-modal .dy-arch-controls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}",
"#dy-arch-modal .dy-arch-table{width:100%;font-size:12px;border-collapse:collapse}",
"#dy-arch-modal td,#dy-arch-modal th{padding:9px;text-align:left;border-bottom:1px solid #38463e;overflow-wrap:anywhere}",
"#dy-arch-modal th{color:#29dbad}",
"#dp-inspector-open{display:none!important}"
].join("\n");
function openPanel(){
 closePanel();
 const backdrop=el("div");backdrop.id="dy-arch-backdrop";dialog=backdrop;
 const modal=el("section");modal.id="dy-arch-modal";modal.setAttribute("role","dialog");
 modal.setAttribute("aria-modal","true");modal.setAttribute("aria-label","Archivo local del servidor");
 const head=el("header"),title=el("h2","Archivo local · Cookies / Proxy / Configuración");
 const close=el("button","Cerrar ×");close.addEventListener("click",closePanel);
 head.append(title,close);modal.append(head);modal.append(el("div",undefined,"dy-arch-body"));
 const foot=el("p","Solo copia datos que la aplicación puede observar. No intercepta los datos privados del proceso Chromium, no modifica el servidor ni garantiza que lleguen todos los tipos de datos.","dy-arch-note");
 foot.style.padding="0 16px";modal.append(foot);
 backdrop.append(modal);document.body.append(backdrop);
 backdrop.addEventListener("click",e=>{if(e.target===backdrop)closePanel()});
 backdrop.addEventListener("keydown",e=>{if(e.key==="Escape")closePanel()});
 draw();close.focus();
}
function mount(){
 if(!document.body||document.getElementById("dy-arch-launch"))return;
 const style=el("style");style.textContent=css;document.head.append(style);
 const button=el("button","▣  Archivo local · Cookies y Proxy");
 button.id="dy-arch-launch";button.type="button";button.title="Respuestas del servidor guardadas localmente, con originales cifrados";
 button.addEventListener("click",openPanel);document.body.append(button)
}
openDb();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
/* DyclokPRO v6.36: optional support for genuine 3.0.7 Local Open API.
 * The ORIGINAL v6.28 profile UI, login, and automatic archive stay untouched.
 * This panel never intercepts /gin requests, cookies, or session credentials.
 */
(()=>{"use strict";
if(window.__dyclokCompat307)return;
Object.defineProperty(window,"__dyclokCompat307",{value:true});
const el=(tag,text,css)=>{const o=document.createElement(tag);if(text!==undefined)o.textContent=text;if(css)o.style.cssText=css;return o};
const css={
 button:"background:#075f52;color:white;border:1px solid #188f7d;border-radius:7px;cursor:pointer;padding:7px 10px;font:12px system-ui",
 input:"background:#192e36;border:1px solid #5f7b81;color:white;border-radius:6px;padding:7px;width:100%;box-sizing:border-box;font:12px system-ui",
 label:"display:block;margin-top:9px;margin-bottom:4px;color:#d7e2e4",
 panel:"width:335px;max-height:70vh;overflow:auto;background:#17282f;color:#fff;border:1px solid #2e7269;border-radius:10px;box-shadow:0 10px 26px #0009;padding:14px;font:12px/1.45 system-ui"
};
let active=null;
function invoke(action,data){
 const api=window.ipcRenderer;
 if(!api||typeof api.invoke!=="function")return Promise.reject(Error("Electron IPC no disponible"));
 return api.invoke("dyclokpro:compat307:"+action,data);
}
function mount(){
 if(!document.body||document.getElementById("dyclok-compat307"))return;
 const wrapper=el("div",undefined,"position:fixed;right:14px;bottom:18px;z-index:19500;-webkit-app-region:no-drag");
 wrapper.id="dyclok-compat307";
 const trigger=el("button","Motor oficial 3.0.7",css.button);
 trigger.title="Adaptador opcional de la API local oficial, no modifica el inicio de sesión DyclokPRO";
 const panel=el("div",undefined,css.panel+";display:none;margin-bottom:8px");
 const heading=el("div","Compatibilidad con DICloak 3.0.7","font-weight:700;font-size:14px;margin-bottom:5px");
 const description=el("div","Consulta el motor oficial solo si está abierto con su API local habilitada. No corrige ni oculta una sesión rechazada por el servidor.","color:#b9cbcf");
 const portLabel=el("label","Puerto local",css.label),port=el("input",undefined,css.input);
 port.value="52140";port.inputMode="numeric";port.maxLength=5;
 const keyLabel=el("label","Clave oficial X-API-KEY (no se guarda)",css.label),key=el("input",undefined,css.input);
 key.type="password";key.autocomplete="off";key.maxLength=512;
 const modeLabel=el("label","API",css.label),mode=el("select",undefined,css.input);
 for(const [value,text] of [["v2","V2 — perfiles y detalles"],["v1","V1 — listado de perfiles"]]){
  const o=el("option",text);o.value=value;mode.append(o);
 }
 const buttons=el("div",undefined,"display:flex;flex-wrap:wrap;gap:6px;margin:11px 0 6px");
 const test=el("button","Comprobar",css.button),components=el("button","Componentes",css.button),list=el("button","Listar perfiles",css.button);
 const saveList=el("button","Guardar lista",css.button),save=el("button","Guardar perfil",css.button);
 const next=el("button","Página siguiente",css.button);
 buttons.append(test,components,list,saveList,save,next);
 const status=el("div","Sin conexión. Se necesita la autorización API del programa oficial.",
  "white-space:pre-line;color:#b9cbcf;margin:7px 0");
 const select=el("select",undefined,css.input);select.size=7;
 const details=el("div",undefined,"white-space:pre-line;color:#c3d7d8;margin-top:6px");
 const warning=el("div","Los JSON se guardan sin cifrar y pueden contener información privada. No se descargan bases de datos completas de Chromium.","color:#ffd68a;margin-top:10px");
 const creds=()=>({port:port.value,apiKey:key.value,version:mode.value});
 async function operation(action,data,onSuccess){
  for(const b of [test,components,list,saveList,save,next])b.disabled=true;
  status.textContent="Consultando API local autorizada...";
  try{
   const x=await invoke(action,{...creds(),...data});
   if(onSuccess)onSuccess(x);
   else status.textContent="Respuesta correcta.";
  }catch(e){
   const msg=String(e?.message||"API no disponible").slice(0,180);
   status.textContent="No se pudo completar: "+msg;
  }finally{for(const b of [test,components,list,saveList,save,next])b.disabled=false}
 }
 function populate(result){
  select.replaceChildren();active=null;
  for(const p of result.rows||[]){
   const o=el("option",p.name+" · "+p.id);o.value=p.id;o.dataset.name=p.name;select.append(o);
  }
  status.textContent="Perfiles encontrados: "+(result.rows?.length||0)+"; página "+result.page+
    ".\nLas cuentas no se inician ni se cierran desde este panel.";
 }
 let page=1;
 test.addEventListener("click",()=>void operation("status",{},x=>{
  status.textContent=x.serviceReady?"Servicio oficial disponible, cliente "+x.clientVersion+
   ", API "+x.apiVersion:"Servicio local no listo. Comprueba que el cliente oficial esté abierto.";
 }));
 components.addEventListener("click",()=>void operation("components",{},x=>{
  const lines=Object.entries(x.capabilities||{}).map(([name,enabled])=>
   name+": "+(enabled===true?"admitida":enabled===false?"no disponible":"no declarada"));
  status.textContent="Cliente oficial: "+x.clientVersion+
   "\nVersión API: "+x.apiVersion+
   "\nNúcleos instalados: "+(x.installedKernels?.join(", ")||"no declarados")+
   "\n"+lines.join("\n");
 }));
 list.addEventListener("click",()=>{page=1;void operation("list",{page},populate)});
 next.addEventListener("click",()=>{page++;void operation("list",{page},populate)});
 mode.addEventListener("change",()=>{page=1;select.replaceChildren();details.textContent=""});
 saveList.addEventListener("click",()=>void operation("save-list",{page},()=>{
  status.textContent="Lista recibida con código 0, guardada exactamente en la carpeta General."}));
 save.addEventListener("click",()=>{
  const id=select.value;if(!id){status.textContent="Selecciona un perfil.";return}
  if(mode.value==="v1"){status.textContent="El detalle guardable requiere V2. El listado V1 se guarda en General.";return}
  void operation("save-detail",{id},()=>{status.textContent="Detalle original guardado en la carpeta del perfil seleccionado."});
 });
 select.addEventListener("change",()=>{
  const id=select.value;if(!id||mode.value!=="v2")return;
  void operation("detail",{id},x=>{
   details.textContent="ID: "+x.id+"\nNombre: "+x.name+
    "\nProxy: "+(x.proxyAvailable?"configuración presente":"no comprobada")+
    "\nHuella: "+(x.fingerprintAvailable?"presente":"no comprobada")+
    "\nAvanzada: "+(x.advancedAvailable?"presente":"no comprobada");
   status.textContent="Consulta de solo lectura; no se muestran contraseñas ni cookies.";
  });
 });
 panel.append(heading,description,portLabel,port,keyLabel,key,modeLabel,mode,
  buttons,status,select,details,warning);
 trigger.addEventListener("click",()=>{
  const open=panel.style.display==="none";
  panel.style.display=open?"block":"none";
  // Clear the key whenever the panel is hidden; no persistence.
  if(!open)key.value="";
 });
 wrapper.append(panel,trigger);document.body.append(wrapper);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
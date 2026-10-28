/* DyclokPRO v6.13 — access to independent local profiles even on login screen.
 * Does not claim access to suspended/expired remote profiles.
 */
(()=>{"use strict";
if(window.__dyclokLocalProfiles613)return;
Object.defineProperty(window,"__dyclokLocalProfiles613",{value:true});
function mount(){
 if(document.getElementById("dyclok-local-access")||!document.body)return;
 const style=document.createElement("style");
 style.textContent="#dyclok-local-access{position:fixed;right:16px;bottom:18px;z-index:2147483400;display:flex;gap:8px;align-items:center;-webkit-app-region:no-drag!important;pointer-events:auto!important;font:12px system-ui,sans-serif}"+
 "#dyclok-local-access button{border:1px solid #27ad8c;background:#173f37;color:#dbfff3;padding:10px 14px;border-radius:9px;font:600 12px system-ui,sans-serif;cursor:pointer;-webkit-app-region:no-drag!important}"+
 "#dyclok-local-access button:focus-visible{outline:2px solid #1ae7ba}"+
 "#dyclok-local-access small{color:#fae5ad;background:#252a2b;max-width:310px;padding:7px;border-radius:6px}";
 document.head.append(style);
 const root=document.createElement("div");root.id="dyclok-local-access";
 const button=document.createElement("button");button.type="button";
 button.textContent="▣ Perfiles locales";
 button.title="Abrir perfiles Chromium independientes que no necesitan una sesión remota. No son los perfiles gestionados por el servidor.";
 const status=document.createElement("small");status.hidden=true;
 button.addEventListener("click",async()=>{
  status.hidden=true;button.disabled=true;
  try{
   const ipc=window.ipcRenderer;
   if(!ipc||typeof ipc.invoke!=="function")throw Error("El módulo de Windows no está disponible.");
   await ipc.invoke("dyclokpro:localprofiles:open");
  }catch(e){
   status.textContent=e?.message||"No fue posible abrir perfiles locales.";
   status.hidden=false;
  }finally{button.disabled=false}
 });
 root.append(button,status);document.body.append(root);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
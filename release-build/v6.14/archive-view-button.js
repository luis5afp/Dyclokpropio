/* DyclokPRO v6.14 — view real saved archives without spawning empty Chromium profiles.
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
 button.textContent="▣ Ver archivos guardados";
 button.title="Mostrar carpetas y registros disponibles de esta cuenta. No equivale a copiar cookies internas del navegador.";
 const status=document.createElement("small");status.hidden=true;
 button.addEventListener("click",()=>{
  try{window.dispatchEvent(new Event("dyclokpro:archive:show"))}
  catch(e){status.textContent=e?.message||"No se pudo mostrar el archivo.";status.hidden=false}
 });
 root.append(button,status);document.body.append(root);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
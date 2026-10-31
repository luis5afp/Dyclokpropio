/* DyclokPRO v6.29: compact side panel for isolated user sessions.
 * Separate OS processes/windows preserve Electron session partitions. No auth hooks.
 */
(()=>{"use strict";
if(window.__dyclokUsers629)return;
window.__dyclokUsers629=true;
const bridge=()=>window.dyclokPROArchive;
const call=(channel,data)=>{
 const x=bridge();if(!x||typeof x.invoke!=="function")return Promise.reject(Error("DyclokPRO bridge not ready"));
 return x.invoke("dyclokpro:users:"+channel,data);
};
const create=(tag,txt,style)=>{
 const el=document.createElement(tag);
 if(txt!==undefined)el.textContent=txt;
 if(style)el.style.cssText=style;
 return el;
};
let opened=false;
async function render(panel){
 panel.replaceChildren();
 const title=create("div","Usuarios · DyclokPRO v6.29","font-weight:bold;margin-bottom:7px");
 panel.append(title);
 const help=create("div","Cada cuenta se abre en una ventana aislada. No cambia las credenciales ni el navegador oficial.","font-size:11px;line-height:1.45;opacity:.85;margin-bottom:8px");
 panel.append(help);
 try{
  const accounts=await call("list");
  for(const account of accounts){
   const row=create("div",undefined,"display:flex;gap:5px;align-items:center;margin:5px 0");
   const open=create("button",(account.current?"● ":"")+account.label,"flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;background:#243b48;color:#fff;border:1px solid #49606b;border-radius:6px;padding:7px;cursor:pointer;text-align:left");
   open.disabled=account.current;
   if(account.current)open.title="Cuenta actual";
   else open.addEventListener("click",async()=>{
    open.disabled=true;
    try{await call("open",{id:account.id})}catch(e){alert("No se abrió la cuenta: "+e.message)}
    finally{open.disabled=false}
   });
   const edit=create("button","✎","background:#33424d;color:#fff;border:1px solid #687985;border-radius:6px;padding:6px 8px;cursor:pointer");
   edit.title="Cambiar nombre de la cuenta";
   edit.addEventListener("click",async()=>{
    const name=prompt("Nombre de la cuenta",account.label);
    if(name===null)return;
    try{await call("rename",{id:account.id,name});await render(panel)}
    catch(e){alert("No se cambió el nombre: "+e.message)}
   });
   row.append(open,edit);
   panel.append(row);
  }
  const add=create("button","+ Agregar otra cuenta","margin-top:8px;width:100%;padding:9px;border:0;border-radius:7px;background:#096f57;color:#fff;cursor:pointer");
  add.addEventListener("click",async()=>{
   add.disabled=true;
   try{await call("open",{});await render(panel)}catch(e){alert("No se abrió la cuenta: "+e.message)}
   finally{add.disabled=false}
  });
  panel.append(add);
 }catch(e){
  panel.append(create("div","No se pudo cargar usuarios: "+(e.message||"Error")));
 }
}
function mount(){
 if(!document.body||document.getElementById("dyclok-users629"))return;
 const wrap=create("div");
 wrap.id="dyclok-users629";
 wrap.style.cssText="position:fixed;right:8px;top:42px;z-index:2147483000;font:12px system-ui;color:white;-webkit-app-region:no-drag";
 const toggle=create("button","◉ Usuarios","background:#124b40;border:1px solid #209b7e;border-radius:8px;padding:9px 12px;color:#fff;cursor:pointer;font-weight:bold;box-shadow:0 3px 10px #0004");
 const panel=create("div",undefined,"display:none;margin-top:6px;width:265px;max-height:70vh;overflow:auto;background:#18252e;border:1px solid #4a6670;border-radius:10px;padding:12px;box-shadow:0 8px 22px #0008");
 toggle.addEventListener("click",()=>{
  opened=!opened;panel.style.display=opened?"block":"none";
  if(opened)void render(panel);
 });
 wrap.append(toggle,panel);
 document.body.append(wrap);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();

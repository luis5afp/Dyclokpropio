/* DyclokPRO v6.7 - verified account windows; hide stale user names on logout. */
(()=>{"use strict";
if(window.__DyclokPROUserTabs)return;
Object.defineProperty(window,"__DyclokPROUserTabs",{value:true});
const API=()=>window.ipcRenderer;
let active="legacy",accounts=[],root=null,list=null,alertNode=null,renaming=false,updateBusy=false,displayCached="",lastAuth=null,authBusy=false;
const el=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n};
async function call(name,...args){
 const ipc=API();
 if(!ipc||typeof ipc.invoke!=="function")throw Error("El puente de Electron no está disponible.");
 return ipc.invoke("dyclokpro:users:"+name,...args);
}
function message(text){if(alertNode){alertNode.textContent=text;alertNode.hidden=!text;}}
function loginPageVisible(){
 const hash=String(location.hash||"").toLowerCase();
 const segments=hash.split(/[/?#]/);
 if(segments.some(x=>x==="login"||x==="sign-in"||x==="signin"))return true;
 const password=document.querySelector('input[type="password"]');
 if(!password)return false;
 const text=(document.body?.innerText||"").slice(0,30000);
 return /Iniciar sesi[oó]n ahora|Recordar contrase[nñ]a|Sign in now|Forgot password/i.test(text)
   || text.includes("Correo electrónico/Nombre de usuario");
}
function authInfo(){
 try{
   const ipc=API();
   if(!ipc?.sendSync)return {signedIn:false,name:null};
   const token=ipc.sendSync("electron-store-get","app.token");
   if(typeof token!=="string"||token.trim().length<8||loginPageVisible())
     return {signedIn:false,name:null};
   const info=ipc.sendSync("electron-store-get","app.userInfo");
   if(!info||typeof info!=="object"||info instanceof Error)
     return {signedIn:true,name:null};
   const candidates=[info.nickname,info.nickName,info.userName,info.username,
     info.displayName,info.accountName,info.email,info.user?.nickname,
     info.user?.username,info.user?.email];
   const name=candidates.find(v=>typeof v==="string"&&v.trim().length>=2&&v.trim().length<=40);
   return {signedIn:true,name:name?.trim()||null};
 }catch{return {signedIn:false,name:null}}
}
async function detectCurrentName(){
 if(renaming||authBusy||!accounts.length)return;
 authBusy=true;
 try{
   const state=authInfo();
   const now=accounts.find(x=>x.id===active);if(!now)return;
   if(!state.signedIn){
     const neutral=active==="legacy"? "Cuenta principal":"Iniciar sesión "+accounts.indexOf(now);
     if(lastAuth!==false||now.name!==neutral){
       displayCached="";lastAuth=false;
       const result=await call("logoutCurrent");
       accounts=result.accounts||accounts;
       render();
     }
     return;
   }
   lastAuth=true;
   const name=state.name;
   if(!name||name===displayCached)return;
   displayCached=name;
   if(now.name===name)return;
   const result=await call("renameCurrent",name);
   accounts=result.accounts||accounts;render();
 }catch{}finally{authBusy=false}
}
function render(){
 if(!list)return;
 list.replaceChildren();
 for(const user of accounts){
   const button=el("button","dy-users-tab");
   button.type="button";button.title=user.name+(user.id===active?" — cuenta activa":" — abrir cuenta en otra ventana");
   button.setAttribute("aria-selected",user.id===active?"true":"false");
   if(user.id===active)button.setAttribute("aria-current","true");
   const dot=el("span","dy-users-dot");dot.setAttribute("aria-hidden","true");
   button.append(dot,el("span","dy-users-name",user.name));
   button.addEventListener("click",async()=>{
     if(user.id===active)return;
     message("");button.disabled=true;
     try{await call("open",user.id);message("Se abrió una ventana para "+user.name+".");}
     catch(e){message(e?.message||"No fue posible abrir esa cuenta.");}
     finally{button.disabled=false}
   });
   if(user.id===active){
     button.addEventListener("dblclick",async()=>{
       const proposed=prompt("Nombre visible de esta cuenta (2 a 40 caracteres):",user.name);
       if(proposed===null)return;
       const cleaned=proposed.trim();
       if(cleaned.length<2||cleaned.length>40){message("Nombre entre 2 y 40 caracteres.");return}
       renaming=true;
       try{const r=await call("renameCurrent",cleaned);accounts=r.accounts;displayCached=cleaned;message("");render()}
       catch(e){message(e?.message||"No se pudo renombrar la cuenta.")}
       finally{renaming=false}
     });
   }
   list.append(button);
 }
 const add=el("button","dy-users-add","+ Usuario");add.type="button";
 add.title="Agregar cuenta con datos de sesión independientes";
 add.addEventListener("click",async()=>{
   add.disabled=true;message("Abriendo una ventana nueva para introducir las credenciales…");
   try{
     const result=await call("add");
     const data=await call("list");active=data.active;accounts=data.accounts;
     render();message("Se abrió una ventana independiente para "+result.name+". Ingresa allí tus credenciales.");
   }catch(e){
     await reload();message(e?.message||"La segunda ventana no terminó de abrirse. Puedes seleccionar su pestaña para reintentar.");
   }finally{add.disabled=false}
 });
 list.append(add);
}
async function reload(){
 if(updateBusy)return;
 updateBusy=true;
 try{const data=await call("list");active=data.active;accounts=data.accounts;message("");render();}
 catch(e){message(e?.message||"No se pudo cargar la lista de usuarios.")}
 finally{updateBusy=false}
}
const css=[
"#dyclok-users-top{position:fixed;z-index:2000100;top:3px;left:355px;right:210px;height:34px;display:flex;align-items:center;pointer-events:none;font:12px system-ui,-apple-system,'Segoe UI',sans-serif;color:#fff}",
"#dyclok-users-top .dy-users-scroll{min-width:0;overflow-x:auto;overflow-y:hidden;display:flex;gap:5px;align-items:center;pointer-events:auto;padding:2px 4px;scrollbar-width:thin;max-width:100%}",
"#dyclok-users-top .dy-users-tab,#dyclok-users-top .dy-users-add{white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:6px;max-width:166px;min-height:29px;border:1px solid #454e50;background:#252a2b;color:#d9e4e0;border-radius:8px 8px 4px 4px;padding:4px 10px;font:600 12px system-ui,sans-serif;cursor:pointer}",
"#dyclok-users-top .dy-users-tab[aria-selected=true]{background:#17493d;color:#6effd9;border-color:#1fd0a0}",
"#dyclok-users-top .dy-users-dot{display:inline-block;flex:0 0 7px;width:7px;height:7px;border-radius:50%;background:#7f8f8a}",
"#dyclok-users-top .dy-users-tab[aria-selected=true] .dy-users-dot{background:#32e5b4}",
"#dyclok-users-top .dy-users-name{overflow:hidden;text-overflow:ellipsis;max-width:130px;display:block}",
"#dyclok-users-top .dy-users-add{background:#143c33;border-color:#1b8976;color:#d7fff3}",
"#dyclok-users-top button:focus-visible{outline:2px solid #22e7b4;outline-offset:2px}",
"#dyclok-users-top button:disabled{opacity:.65;cursor:progress}",
"#dyclok-users-top .dy-users-error{position:absolute;top:36px;right:0;background:#34312c;border:1px solid #966e48;padding:9px;max-width:420px;border-radius:7px;pointer-events:auto;white-space:normal}",
"@media(max-width:1280px){#dyclok-users-top{left:265px;right:155px}}",
"@media(max-width:760px){#dyclok-users-top{left:110px;right:110px}#dyclok-users-top .dy-users-tab{max-width:95px}#dyclok-users-top .dy-users-name{max-width:62px}}"
].join("\n");
function mount(){
 if(root||!document.body)return;
 const style=el("style");style.textContent=css;document.head.append(style);
 root=el("nav");root.id="dyclok-users-top";root.setAttribute("aria-label","Cuentas de DyclokPRO");
 list=el("div","dy-users-scroll");list.setAttribute("role","tablist");
 alertNode=el("div","dy-users-error");alertNode.hidden=true;alertNode.setAttribute("role","status");
 root.append(list,alertNode);document.body.append(root);
 void reload().then(detectCurrentName);
 window.addEventListener("focus",()=>{void reload().then(detectCurrentName)});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)void reload().then(detectCurrentName)});
 setTimeout(()=>void detectCurrentName(),2500);
 setTimeout(()=>void detectCurrentName(),10000);
 // Logout must immediately discard a previously authenticated display name.
 setInterval(()=>void detectCurrentName(),1800);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();

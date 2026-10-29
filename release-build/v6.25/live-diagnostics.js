/* DyclokPRO v6.25 — live diagnostics, per-account TXT; never record secrets. */
(function(){
"use strict";
const {app,BrowserWindow,shell,clipboard}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os"),cp=require("child_process");
if(process.argv.includes("--dyclok-self-test")||process.argv.includes("--dyclok-login-smoke"))return;
const args=process.argv.filter(x=>x.startsWith("--dyclok-account="));
if(args.length>1||args.some(x=>!/^[a-f0-9]{32}$/.test(x.slice("--dyclok-account=".length))))return;
const account=args[0]?args[0].slice("--dyclok-account=".length):"legacy";
const root=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),"DyclokPRO","Cuentas",account,"Diagnosticos");
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const outfile=path.join(root,"diagnostico-v6.25-"+stamp+".txt");
const lines=[];let panel=null,ready=false,pending=false,creatingPanel=false;
let smokeTarget=null,smokeInitiated=false,smokeReady=false;
const tabId="dyclokpro-side-diagnostics-toggle";
const toggleMessage="[DYCLOK_DIAG_TOGGLE25]";
function syncTab(open){
 const js="(function(){const b=document.getElementById("+JSON.stringify(tabId)+");if(!b)return;"+
 "b.setAttribute('aria-pressed',"+JSON.stringify(String(open))+");"+
 "b.title="+JSON.stringify(open?"Cerrar diagnóstico":"Abrir diagnóstico")+";"+
 "b.style.background="+JSON.stringify(open?"#2563eb":"#263c59")+";})()";
 for(const w of BrowserWindow.getAllWindows()){
  if(w===panel||w.isDestroyed()||w.webContents.isDestroyed())continue;
  w.webContents.executeJavaScript(js).catch(()=>{});
 }
}
function togglePanel(){
 if(panel&&!panel.isDestroyed()){
  log("PANEL_TOGGLE","Cerrar diagnóstico desde pestaña lateral");
  panel.close();
 }else{
  log("PANEL_TOGGLE","Abrir diagnóstico desde pestaña lateral");
  createPanel();
  syncTab(true);
 }
}

function log(code,extra){
 const kind=String(code).replace(/[^A-Z0-9_]/g,"").slice(0,40);
 const detail=String(extra||"").replace(/[\r\n]/g," ").slice(0,130);
 const entry=new Date().toISOString()+" | "+kind+" | "+detail;
 lines.push(entry);if(lines.length>300)lines.shift();
 try{fs.mkdirSync(root,{recursive:true});fs.appendFileSync(outfile,entry+"\r\n",{encoding:"utf8",mode:0o600})}catch{}
 if(panel&&ready&&!pending){pending=true;setTimeout(()=>{pending=false;if(panel&&!panel.isDestroyed()&&ready)panel.webContents.executeJavaScript("window.updateLog("+JSON.stringify(lines.join("\n"))+")").catch(()=>{})},150)}
}
const markup='<!doctype html><html lang="es"><head><meta charset="utf-8">'+
'<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; style-src &#39;unsafe-inline&#39;; script-src &#39;unsafe-inline&#39;">'+
'<title>Diagnóstico DyclokPRO</title><style>body{font:13px Segoe UI,Arial,sans-serif;background:#111a29;color:#e5eefa;padding:15px}h2{margin:0}p,small{color:#adbed6}button{background:#294568;color:white;border:1px solid #6081a4;padding:9px;border-radius:7px;cursor:pointer;margin:3px}pre{background:#080f1d;border:1px solid #3a506b;padding:12px;border-radius:8px;height:calc(100vh - 207px);overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font:12px Consolas,monospace}button:focus-visible{outline:2px solid white}</style></head><body>'+
'<h2>Diagnóstico en vivo · v6.25</h2><p>Registro desde el arranque. No se guardan credenciales, cookies, tokens ni rutas de solicitudes.</p>'+
'<button onclick="window.open(&quot;https://dyclok-diagnostic.invalid/notepad&quot;)">Abrir TXT en Bloc de notas</button>'+
'<button onclick="window.open(&quot;https://dyclok-diagnostic.invalid/folder&quot;)">Abrir carpeta</button>'+
'<button onclick="window.open(&quot;https://dyclok-diagnostic.invalid/copy&quot;)">Copiar ruta TXT</button>'+
'<pre id="events"></pre><small>El TXT se crea automáticamente por cuenta. Puedes minimizar este panel.</small>'+
'<script>window.updateLog=function(t){var e=document.getElementById("events"),s=e.scrollTop+e.clientHeight>=e.scrollHeight-25;e.textContent=t;if(s)e.scrollTop=e.scrollHeight;};</script></body></html>';
function createPanel(){
 if(panel)return;
 creatingPanel=true;
 try{panel=new BrowserWindow({width:590,height:620,minWidth:440,minHeight:340,title:"Diagnóstico DyclokPRO",
  show:false,autoHideMenuBar:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});}finally{creatingPanel=false}
 panel.webContents.setWindowOpenHandler(({url})=>{
  if(url==="https://dyclok-diagnostic.invalid/notepad"){try{cp.spawn("notepad.exe",[outfile],{detached:true,stdio:"ignore"}).unref()}catch{log("NOTEPAD_ERROR","No se pudo abrir TXT")}}
  if(url==="https://dyclok-diagnostic.invalid/folder")shell.openPath(root).catch(()=>log("FOLDER_ERROR","No se pudo abrir carpeta"));
  if(url==="https://dyclok-diagnostic.invalid/copy")clipboard.writeText(outfile);
  return {action:"deny"};
 });
 panel.webContents.on("did-finish-load",()=>{
  ready=true;log("PANEL_READY","Registro visible en tiempo real");
  if(smokeTarget&&!smokeTarget.isDestroyed()&&smokeInitiated){
   smokeReady=true;
   setTimeout(()=>{
    if(smokeTarget&&!smokeTarget.isDestroyed()){
     smokeTarget.executeJavaScript("(function(){const b=document.getElementById('dyclokpro-side-diagnostics-toggle');if(!b||b.getAttribute('aria-pressed')!=='true')throw Error('Tab must be active');b.click()})()")
      .catch(()=>log("SMOKE_ERROR","No se pudo cerrar desde pestaña"));
    }
   },500);
  }
});
 panel.webContents.on("render-process-gone",(_,d)=>{ready=false;log("PANEL_CRASH",String(d.reason||"unknown"))});
 panel.on("closed",()=>{
  panel=null;ready=false;
  syncTab(false);
  log("PANEL_CLOSED","Panel cerrado; registro TXT sigue activo");
  if(smokeInitiated&&smokeReady){
   try{fs.writeFileSync(path.join(os.tmpdir(),"dyclokpro-v625-diag-smoke.json"),
    JSON.stringify({ready:true,defaultClosed:true,openedBySideButton:true,closedBySideButton:true,txt:outfile,account}));}
   catch{log("SMOKE_ERROR","No se pudo crear marcador")}
  }
});
 panel.loadURL("data:text/html;charset=utf-8,"+encodeURIComponent(markup)).catch(()=>log("PANEL_LOAD_ERROR","Fallo carga del panel"));
 panel.once("ready-to-show",()=>{if(panel&&!panel.isDestroyed())panel.showInactive()});
}
function instrument(){
 if(window.__dyclokDiag)return;
 window.__dyclokDiag=true;
 // Tab is a discreet control inside the existing app window, not a popup.
 // All diagnostics continue to record even when the panel is closed.
 const btn=document.createElement("button");
 btn.type="button";
 btn.id="dyclokpro-side-diagnostics-toggle";
 btn.textContent="Diagnóstico";
 btn.title="Abrir diagnóstico";
 btn.setAttribute("aria-label","Abrir o cerrar el panel de diagnóstico");
 btn.setAttribute("aria-pressed","false");
 btn.style.cssText="all:initial;position:fixed;right:0;top:50%;transform:translateY(-50%);"+
   "writing-mode:vertical-rl;text-orientation:mixed;display:flex;align-items:center;justify-content:center;"+
   "width:36px;height:122px;box-sizing:border-box;"+
   "font:600 12px/1 Segoe UI,Arial,sans-serif;letter-spacing:.4px;color:#fff;"+
   "background:#263c59;border:1px solid #57708e;border-right:0;"+
   "border-radius:9px 0 0 9px;box-shadow:0 2px 12px rgba(0,0,0,.22);"+
   "cursor:pointer;opacity:.9;z-index:2147483646;";
 btn.addEventListener("click",()=>console.info("[DYCLOK_DIAG_TOGGLE25]"));
 btn.addEventListener("mouseenter",()=>{btn.style.opacity="1"});
 btn.addEventListener("mouseleave",()=>{btn.style.opacity=".9"});
 if(document.body)document.body.appendChild(btn);
 else document.addEventListener("DOMContentLoaded",()=>document.body?.appendChild(btn),{once:true});

 function group(url){try{
   const p=new URL(String(url),location.href).pathname.toLowerCase();
   if(/login|signin|auth|verify|captcha/.test(p))return "LOGIN";
   if(/profile|environment|browser|\/env(\/|$)/.test(p))return "PROFILES";
   if(/session|token|account|user|member/.test(p))return "SESSION";
   if(/update|version/.test(p))return "VERSION";
 }catch{}return "OTHER"}
 function safeError(e,filename,line){
   let type="Error";try{type=String(e?.name||e?.constructor?.name||"Error").replace(/[^A-Za-z]/g,"").slice(0,25)||"Error"}catch{}
   let asset="unknown",ln=0;try{
     const src=String(filename||e?.stack||"");
     const m=src.match(/([A-Za-z0-9_.-]+\.js):(\d+)(?::\d+)?/);
     if(m){asset=m[1].slice(0,72);ln=Math.min(Number(m[2]),999999)}
     else if(Number.isInteger(line))ln=Math.min(Math.max(line,0),999999);
   }catch{}
   const result={type,asset,line:ln};
   const status=Number(e?.response?.status);
   if(Number.isInteger(status)&&status>=100&&status<=599)result.http=status;
   const c=e?.code??e?.response?.data?.code;
   if(Number.isInteger(c)&&c>=0&&c<=99999999)result.apiCode=c;
   return result;
 }
 function emit(kind,g,s,detail){try{console.info("[DYCLOK_DIAG21]"+JSON.stringify({kind,group:g,status:s,detail}))}catch{}}
 // Do not wrap fetch or XMLHttpRequest: v6.16's original network stack
 // is left completely untouched to protect authentication and profile loading.
 // Business error codes are observed from uncaught rejection metadata only.
 window.addEventListener("error",e=>emit("JS_ERROR","INTERFACE",0,safeError(e.error,e.filename,e.lineno)));
 window.addEventListener("unhandledrejection",e=>emit("PROMISE_ERROR","INTERFACE",0,safeError(e.reason)));
 emit("MONITOR_ON","INTERFACE",1);
}
function routeGroup(url){
 try{
  const u=new URL(String(url));
  const p=(u.hash||u.pathname||"").split("?")[0].toLowerCase();
  if(/login|signin|sign-in/.test(p))return "pagina=login";
  if(/profile|environment|browser|env/.test(p))return "pagina=perfiles";
  if(/home|dashboard|workspace|index/.test(p))return "pagina=principal";
 }catch{}return "pagina=otra";
}
function safeMainFrame(err){
 const stack=String(err?.stack||"");
 const m=stack.match(/([A-Za-z0-9_.-]+\.(?:js|cjs|mjs)):(\d+)(?::\d+)?/);
 const name=String(err?.name||"Error").replace(/[^A-Za-z]/g,"").slice(0,25)||"Error";
 return name+" modulo="+(m?m[1]+":"+m[2]:"desconocido");
}
function attach(win){
 const wc=win.webContents,id="win-"+wc.id,rename=()=>{try{if(!win.isDestroyed())win.setTitle("DyclokPRO v6.25 (cliente "+app.getVersion()+")")}catch{}};
 log("WINDOW_CREATED",id);
 win.on("page-title-updated",e=>{e.preventDefault();rename()});
 win.on("closed",()=>log("WINDOW_CLOSED",id));
 win.on("hide",()=>log("WINDOW_HIDDEN",id));
 wc.on("did-start-loading",()=>log("LOAD_START",id));
 wc.on("dom-ready",()=>{
  log("DOM_READY",id);rename();
  wc.executeJavaScript("("+instrument.toString()+")()").then(()=>{
   syncTab(!!panel&&!panel.isDestroyed());
   if(process.argv.includes("--dyclok-diagnostics-smoke")&&!smokeInitiated){
    smokeInitiated=true;smokeTarget=wc;
    if(panel)throw Error("Diagnostic panel must start closed");
    return wc.executeJavaScript("(function(){const b=document.getElementById('dyclokpro-side-diagnostics-toggle');if(!b)throw Error('Side tab missing');const css=getComputedStyle(b);if(css.position!=='fixed'||css.right!=='0px')throw Error('Tab is not on right');if(b.getAttribute('aria-pressed')!=='false')throw Error('Default panel is not closed');b.click()})()");
   }
  }).catch(()=>log("JS_HOOK_FAILED",id+" pestaña lateral"));
});
 wc.on("did-finish-load",()=>{log("LOAD_OK",id);rename()});
 wc.on("did-fail-load",(_e,code,_msg,_url,main)=>{if(main&&code!==-3)log("LOAD_FAILED",id+" codigo="+Number(code))});
 wc.on("did-navigate",(_e,url)=>log("NAVIGATION",id+" "+routeGroup(url)));
 wc.on("did-navigate-in-page",(_e,url,main)=>{if(main)log("ROUTE_CHANGE",id+" "+routeGroup(url))});
 wc.on("render-process-gone",(_e,d)=>log("RENDER_CRASH",id+" razon="+String(d.reason||"unknown")));
 wc.on("unresponsive",()=>log("NOT_RESPONDING",id));
 wc.on("console-message",(...args)=>{
  const msg=typeof args[0]?.message==="string"?args[0].message:args[2];
  const level=typeof args[0]?.level==="string"?args[0].level:args[1];
  if(msg===toggleMessage){
    togglePanel();
    return;
  }
  if(typeof msg==="string"&&msg.startsWith("[DYCLOK_DIAG21]")){
   try{const e=JSON.parse(msg.slice("[DYCLOK_DIAG21]".length));
    if(["XHR","FETCH","FETCH_ERROR","JS_ERROR","PROMISE_ERROR","MONITOR_ON"].includes(e.kind)&&
       ["LOGIN","PROFILES","SESSION","VERSION","OTHER","INTERFACE"].includes(e.group)&&
       Number.isInteger(e.status)&&e.status>=0&&e.status<=599){
        let detail="";
        if(["JS_ERROR","PROMISE_ERROR"].includes(e.kind)){
          const z=e.detail&&typeof e.detail==="object"?e.detail:{};
          const type=typeof z.type==="string"&&/^[A-Za-z]{1,25}$/.test(z.type)?z.type:"Error";
          const asset=typeof z.asset==="string"&&/^[A-Za-z0-9_.-]{1,72}$/.test(z.asset)?z.asset:"unknown";
          const line=Number.isInteger(z.line)&&z.line>=0&&z.line<=999999?z.line:0;
          const http=Number.isInteger(z.http)&&z.http>=100&&z.http<=599?" http="+z.http:"";
          const apiCode=Number.isInteger(z.apiCode)&&z.apiCode>=0&&z.apiCode<=99999999?" api="+z.apiCode:"";
          detail=" tipo="+type+" modulo="+asset+":"+line+http+apiCode;
        }
        log(e.kind,id+" "+e.group+" codigo="+e.status+detail);
       }
   }catch{}
  }else if(level===3||level==="error"){
    const source=String(typeof args[0]?.sourceId==="string"?args[0].sourceId:args[4]||"");
    const m=source.match(/([A-Za-z0-9_.-]+\.js)(?::(\d+))?/);
    const line=Number(typeof args[0]?.lineNumber==="number"?args[0].lineNumber:args[3]||0);
    log("CONSOLE_ERROR",id+" modulo="+(m?m[1]:"unknown")+":"+(Number.isInteger(line)&&line>=0&&line<=999999?line:0));
   }
 });
 rename();
 // No automatic panel creation: the right-edge tab is the only toggle.
}
log("STARTUP","v"+app.getVersion()+" cuenta="+(account==="legacy"?"principal":"separada"));
app.on("browser-window-created",(_event,win)=>{if(!creatingPanel&&win!==panel)attach(win)});
app.on("before-quit",()=>log("EXIT","Cierre del proceso"));
process.on("uncaughtExceptionMonitor",err=>log("MAIN_EXCEPTION",safeMainFrame(err)));
process.on("unhandledRejection",err=>log("MAIN_REJECTION",safeMainFrame(err)));
})();
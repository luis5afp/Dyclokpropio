/* Dyclokpro v6.3 — local, redacted profile-data diagnostics.
 * Observes the application's own fetch/XHR responses while this window is open.
 * Never sends telemetry or saves raw HTTP bodies, cookies, passwords or tokens.
 * Does NOT read Chromium cookie databases or intercept its private network traffic.
 */
(() => {
  "use strict";
  if (window.__dyclokDataInspectorInstalled) return;
  Object.defineProperty(window, "__dyclokDataInspectorInstalled", {value:true});
  const events = [];
  const MAX_EVENTS=120, MAX_BODY=1024*1024;
  let button, panel, chosenTab="cookies", selectedProfile="Ninguno";
  const REDACTED="[protegido]";
  const hasOwn=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const safe = s=>String(s ?? "").slice(0,140).replace(/[<>\r\n\t]/g," ");
  const sensitive = /pass|secret|token|authorization|credential|^value$|session|^key$/i;
  const cookieKeys = /^(cookies?|cookieList|cookieData|cookieInfo|cookieJson|cookieStorage|cookie_list)$/i;
  const proxyKeys = /^(proxy|proxyConfig|proxyInfo|proxySetting|proxySettings|proxyData|proxyServer)$/i;
  const configurationKeys = /^(fingerprint|fingerprintConfig|browserConfig|envConfig|kernel|userAgent|timezone|language|webrtc|canvas|webgl|os|browserVersion|launchConfig|startupConfig)$/i;
  function endpoint(raw) {
    try {
      const u = new URL(String(raw), location.href);
      if (!/^https?:$/.test(u.protocol)) return null;
      if (!/(?:\/v\d+\/|\/env\/|\/profile\/|\/proxy\/|\/cookie\/)/i.test(u.pathname)) return null;
      // Drop query strings and numerical/UUID IDs. These might contain secrets.
      const pathname = u.pathname.replace(/[a-f0-9]{16,}/gi,":id").replace(/\/\d{3,}(?=\/|$)/g,"/:id");
      return safe(pathname);
    } catch { return null; }
  }
  function readCookie(v) {
    if (!v || typeof v!=="object" || Array.isArray(v)) return null;
    const name = hasOwn(v,"name") ? v.name : v.cookieName;
    const domain = v.domain || v.host || v.host_key || "";
    if (typeof name!=="string" || !name || !String(domain) && !hasOwn(v,"path")) return null;
    return {name:safe(name),domain:safe(domain),path:safe(v.path||"/"),
      secure:!!(v.secure||v.isSecure),httpOnly:!!(v.httpOnly||v.httponly),
      expires:v.expirationDate||v.expires||null};
  }
  function parseMaybe(v) {
    if (typeof v!=="string")return v;
    if(v.length>MAX_BODY || !/^\s*[\[{]/.test(v)) return null;
    try{return JSON.parse(v);}catch{return null;}
  }
  function extract(body) {
    const found={cookies:[],proxies:[],config:[],number:0};
    const names=new Set();
    const visited=new WeakSet();
    function walk(node,depth,key="") {
      if(depth>7 || found.number++>900) return;
      if(typeof node==="string"){
        if(cookieKeys.test(key)) walk(parseMaybe(node),depth+1,key);
        return;
      }
      if(!node||typeof node!=="object"||visited.has(node))return;
      visited.add(node);
      if(Array.isArray(node)){
        for(const item of node.slice(0,180))walk(item,depth+1,key);
        return;
      }
      if(cookieKeys.test(key) || (typeof node.name==="string" && ("domain" in node || "path" in node))){
        const c=readCookie(node);
        if(c && found.cookies.length<140){
          const id=c.domain+"|"+c.name+"|"+c.path;
          if(!names.has(id)){found.cookies.push(c); names.add(id);}
        }
      }
      if(proxyKeys.test(key)){
        const ip=node.host||node.hostName||node.server||node.proxyHost||node.ip||node.proxyIp;
        const port=node.port||node.proxyPort;
        const type=node.type||node.proxyType||node.protocol||"";
        if((ip||port||type) && found.proxies.length<15)
          found.proxies.push({type:safe(type),host:safe(ip||""),port:safe(port||""),
            auth:!!(node.username||node.user||node.password||node.proxyPassword)});
      }
      if(configurationKeys.test(key) && found.config.length<35) {
        // Show only the existence/type of a configuration, never the raw values.
        found.config.push({category:safe(key),format:Array.isArray(node)?"lista":typeof node});
      }
      for(const [k,v] of Object.entries(node).slice(0,90)){
        if(sensitive.test(k)) continue;
        if(cookieKeys.test(k) && Array.isArray(v)){for(const item of v.slice(0,180))walk(item,depth+1,k);}
        else walk(v,depth+1,k);
      }
    }
    walk(body,0);
    return found;
  }
  function record(url,status,responseText,method) {
    const path=endpoint(url);
    if(!path||status<200||status>=300||typeof responseText!=="string"||responseText.length>MAX_BODY) return;
    const obj=parseMaybe(responseText);
    if(!obj || typeof obj!=="object")return;
    const data=extract(obj);
    events.unshift({when:new Date().toLocaleTimeString(),path,method:safe(method||"GET"),
      status, cookies:data.cookies,proxies:data.proxies,config:data.config});
    if(events.length>MAX_EVENTS)events.pop();
    if(panel && panel.style.display!=="none") render();
  }
  // Observation starts before the main Vite application loads.
  const xhrOpen=XMLHttpRequest.prototype.open;
  const xhrSend=XMLHttpRequest.prototype.send;
  const xhrInfo=new WeakMap();
  XMLHttpRequest.prototype.open=function(method,url,...rest){
    xhrInfo.set(this,{method,url});
    return xhrOpen.call(this,method,url,...rest);
  };
  XMLHttpRequest.prototype.send=function(...args){
    const meta=xhrInfo.get(this);
    if(meta && endpoint(meta.url)){
      this.addEventListener("loadend",function(){
        try {if(this.responseType===""||this.responseType==="text")
          record(meta.url,this.status,this.responseText,meta.method);}catch{}
      },{once:true});
    }
    return xhrSend.apply(this,args);
  };
  if(typeof window.fetch==="function"){
    const originalFetch=window.fetch;
    window.fetch=function(...args){
      const original=originalFetch.apply(this,args);
      try{
        const request=args[0],init=args[1];
        const url=typeof request==="string"?request:request?.url;
        if(endpoint(url)) {
          original.then(res=>{
            const len=Number(res.headers?.get("content-length")||0);
            if(len>MAX_BODY)return;
            res.clone().text().then(body=>record(url,res.status,body,init?.method||request?.method||"GET")).catch(()=>{});
          }).catch(()=>{});
        }
      }catch{}
      return original;
    };
  }
  function el(tag,attrs={},text) {
    const element=document.createElement(tag);
    for(const [key,value] of Object.entries(attrs)){
      if(key==="class")element.className=value;
      else if(key==="style")Object.assign(element.style,value);
      else element.setAttribute(key,String(value));
    }
    if(text!==undefined)element.textContent=text;
    return element;
  }
  function table(headers,rows) {
    const t=el("table",{class:"dp-inspector-table"});
    const head=el("thead"),tr=el("tr");
    headers.forEach(h=>tr.append(el("th",{},h)));
    head.append(tr);t.append(head);
    const tbody=el("tbody");
    for(const row of rows.slice(0,120)){
      const tr=el("tr"); for(const cell of row)tr.append(el("td",{},String(cell??"")));
      tbody.append(tr);
    }
    t.append(tbody);return t;
  }
  function aggregate(kind) {
    const list=[];
    const ids=new Set();
    for(const event of events){
      for(const entry of event[kind]){
        const key=JSON.stringify(entry);
        if(ids.has(key))continue; ids.add(key);list.push(entry);
      }
    }
    return list;
  }
  function render() {
    if(!panel)return;
    const body=panel.querySelector("[data-inspector-body]");
    if(!body)return;
    body.replaceChildren();
    const count=events.length;
    body.append(el("p",{class:"dp-inspector-caption"},
      "Captura local: "+count+" respuestas HTTP compatibles desde que se abrió esta ventana. Perfil señalado en la tabla: "+selectedProfile+". Los datos de las respuestas no siempre se pueden asociar a ese perfil."));
    if(chosenTab==="cookies"){
      const rows=aggregate("cookies");
      body.append(el("p",{},"Cookies identificadas en respuestas del programa: "+rows.length+". Los valores (tokens de sesión) no se capturan ni muestran."));
      if(rows.length)body.append(table(["Nombre","Dominio","Ruta","Secure","HttpOnly"],
        rows.map(c=>[c.name,c.domain||"—",c.path,c.secure?"Sí":"No",c.httpOnly?"Sí":"No"])));
      else body.append(el("p",{},"No se observaron metadatos de cookies. Esto no significa que Chromium no tenga cookies: su almacén local es independiente."));
    }else if(chosenTab==="proxy"){
      const rows=aggregate("proxies");
      body.append(el("p",{},"Configuraciones de proxy reconocidas en respuestas: "+rows.length+". No se capturan usuarios ni contraseñas."));
      if(rows.length)body.append(table(["Tipo","Servidor","Puerto","Autenticación"],
        rows.map(p=>[p.type||"—",p.host||"—",p.port||"—",p.auth?"Configurada":"No indicada"])));
      else body.append(el("p",{},"No se detectó configuración de proxy en las respuestas observadas."));
    }else if(chosenTab==="config"){
      const rows=aggregate("config");
      body.append(el("p",{},"Categorías reconocidas de configuración (sin sus valores sensibles): "+rows.length));
      if(rows.length)body.append(table(["Categoría","Tipo"],rows.map(c=>[c.category,c.format])));
      else body.append(el("p",{},"No hay configuración detectada en las respuestas observadas."));
    }else{
      body.append(el("p",{},"Solicitudes de la aplicación observadas después de abrir esta ventana. No incluye tráfico interno de Chromium ni cuerpos completos."));
      if(events.length)body.append(table(["Hora","Método","Ruta (IDs ocultos)","Estado"],events.map(e=>[e.when,e.method,e.path,e.status])));
      else body.append(el("p",{},"Abre o actualiza un perfil para comenzar a observar metadatos de las respuestas."));
    }
  }
  const css=`
  #dp-inspector-open{position:fixed;bottom:18px;left:16px;z-index:9900;width:280px;max-width:calc(100vw - 30px);padding:11px 13px;
    background:#0b3028;color:#d8ffef;border:1px solid #18c89f;border-radius:11px;cursor:pointer;box-shadow:0 2px 20px #0009;
    font:600 13px system-ui,sans-serif;text-align:left}
  #dp-inspector-open:hover,#dp-inspector-open:focus-visible{background:#125a48;outline:2px solid #2dedbf}
  #dp-inspector-overlay{position:fixed;inset:0;background:#000b;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:15px}
  #dp-inspector-panel{background:#191d20;color:#e4e8ea;width:min(960px,96vw);max-height:90vh;display:flex;flex-direction:column;
    border:1px solid #52635d;border-radius:14px;box-shadow:0 15px 70px #000c;font:14px system-ui,sans-serif}
  #dp-inspector-panel *{box-sizing:border-box}
  #dp-inspector-panel header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #3c4945}
  #dp-inspector-panel h2{font-size:20px;margin:0;color:#37dfb4}
  #dp-inspector-panel .dp-inspector-tabs{display:flex;gap:7px;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid #3c4945}
  #dp-inspector-panel button{cursor:pointer;background:#30403b;color:#eafff6;border:1px solid #68847b;padding:8px 11px;border-radius:7px}
  #dp-inspector-panel button[aria-selected=true]{background:#078763;border-color:#20d5a2}
  #dp-inspector-panel [data-inspector-body]{overflow:auto;padding:8px 18px 22px}
  #dp-inspector-panel .dp-inspector-caption{font-size:12px;line-height:1.5;color:#b0c6bf}
  #dp-inspector-panel p{line-height:1.6}
  #dp-inspector-panel .dp-inspector-table{width:100%;border-collapse:collapse;font-size:12px;text-align:left}
  #dp-inspector-panel th,#dp-inspector-panel td{border-bottom:1px solid #3a4842;padding:9px;max-width:300px;overflow-wrap:anywhere}
  #dp-inspector-panel th{color:#40e2b7}
  `;
  function openPanel() {
    if(panel){panel.style.display="flex";render();return;}
    const overlay=el("div",{id:"dp-inspector-overlay"});
    panel=el("section",{id:"dp-inspector-panel",role:"dialog","aria-modal":"true","aria-label":"Datos de perfil"});
    const header=el("header"),title=el("h2",{},"Datos de perfil · Dyclokpro"),close=el("button",{type:"button","aria-label":"Cerrar"},"Cerrar ×");
    close.addEventListener("click",()=>overlay.remove());
    header.append(title,close);panel.append(header);
    const tabs=el("nav",{class:"dp-inspector-tabs"});
    for(const [key,title] of [["cookies","Cookies"],["proxy","Proxy"],["config","Configuración"],["requests","Respuestas del servidor"]]){
      const btn=el("button",{type:"button","aria-selected":key===chosenTab},title);
      btn.addEventListener("click",()=>{chosenTab=key;for(const b of tabs.children)b.setAttribute("aria-selected",String(b===btn));render();});
      tabs.append(btn);
    }
    const content=el("div",{"data-inspector-body":"true"});
    const note=el("p",{class:"dp-inspector-caption",style:{padding:"10px 18px",margin:0,borderTop:"1px solid #3c4945"}},
      "Solo metadatos captados por Dyclokpro. No lee ni exporta cookies guardadas por Chromium, no intercepta tráfico de otros programas ni cambia permisos del servidor.");
    panel.append(tabs,content,note);overlay.append(panel);document.body.append(overlay);
    overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove();});
    panel.addEventListener("keydown",e=>{if(e.key==="Escape")overlay.remove();});
    render();
    close.focus();
  }
  function mount() {
    if(!document.body||document.getElementById("dp-inspector-open"))return;
    const style=el("style");style.textContent=css;document.head.append(style);
    button=el("button",{id:"dp-inspector-open",type:"button",
      title:"Ver metadatos locales del perfil y respuestas del programa"},"◉  Datos de perfil · Cookies / Proxy");
    button.addEventListener("click",openPanel);
    document.body.append(button);
    document.body.addEventListener("click",e=>{
      const row=e.target?.closest?.("tr");
      if(!row||row.closest("#dp-inspector-panel"))return;
      const first=row.querySelector("td");
      const n=first?.textContent?.trim();
      if(n && /^\d{1,8}$/.test(n))selectedProfile=n;
    },true);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();

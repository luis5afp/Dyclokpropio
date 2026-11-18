'use strict';
/**
 * Loopback-only read-only diagnostics UI for the opt-in test receiver.
 * NO global traffic interception. NO arbitrary strings, URLs, HTTP
 * headers, cookies, passwords, tokens or response bodies are accepted.
 */
const http=require('node:http');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const {startCapture}=require('./almacen-observador-integrado.cjs');

const SOURCES=new Set(['programa','servidor_pruebas','chromium','almacen']);
const EVENTS=new Set([
 'native_http_request','native_http_response','native_http_error',
 'native_process_seen','native_connection_seen','native_file_changed','native_file_removed','native_monitor_error',
 'panel_ready','configuration_missing','profile_wait','profile_running','api_request','api_response',
 'embedded_ui_only','operation_open_requested','operation_step_completed','operation_step_failed',
 'stage_pre_data_inject','stage_pre_check','stage_choose_kernel','stage_pre_proxy_check','stage_catch_error',
 'stage_polyfill_row_data','stage_rpa_pre_inject','stage_lock_env_rpa','stage_merge_env_params_rpa','stage_fetch_env_info','stage_proxy_check','stage_proxy_check_result','stage_expand_check','stage_params_merge',
 'stage_lock_env','stage_open_env','stage_cookie_encrypt_plan','stage_timeout',
 'stage_backend_data_fetch','stage_data_sync_start','stage_localstorage_download',
 'stage_localstorage_extract','stage_localstorage_sync','stage_indexeddb_download',
 'stage_indexeddb_extract','stage_indexeddb_sync','stage_extension_extract',
 'stage_extension_download','stage_browser_start','stage_unknown',
 'api_failed','api_connected','debugger_connected','debugger_failed',
 'target_connected','receiver_ready','response_approved','response_failed',
 'document_saved','document_failed','capture_completed','monitor_stopped',
 'no_documents','connection_failed'
]);
function validateDiagnostic(input){
 if(!input||typeof input!=='object'||!SOURCES.has(input.source)||
    !EVENTS.has(input.event))throw Error('INVALID_DIAGNOSTIC_EVENT');
 const at=input.at===undefined?new Date().toISOString():input.at;
 if(typeof at!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(at)||
    Number.isNaN(Date.parse(at)))throw Error('INVALID_DIAGNOSTIC_TIME');
 const out={at,source:input.source,event:input.event};
 if(input.stage!==undefined){
   if(typeof input.stage!=='string'||
      !input.stage.startsWith('stage_')||!EVENTS.has(input.stage))
     throw Error('INVALID_DIAGNOSTIC_STAGE');
   out.stage=input.stage;
 }
 if(input.phaseCode!==undefined){
   if(!Number.isInteger(input.phaseCode)||input.phaseCode<0||input.phaseCode>255||
      !(input.event==='stage_unknown'||input.stage==='stage_unknown'))
     throw Error('INVALID_DIAGNOSTIC_PHASE_CODE');
   out.phaseCode=input.phaseCode;
 }
 if(input.status!==undefined){
   if(!Number.isSafeInteger(input.status)||input.status<100||input.status>599)
     throw Error('INVALID_DIAGNOSTIC_STATUS');
   out.status=input.status;
 }
 if(input.bytes!==undefined){
   if(!Number.isSafeInteger(input.bytes)||input.bytes<0||input.bytes>32*1024*1024)
     throw Error('INVALID_DIAGNOSTIC_SIZE');
   out.bytes=input.bytes;
 }
 if(input.durationMs!==undefined){
   if(!Number.isSafeInteger(input.durationMs)||input.durationMs<0||input.durationMs>3600000)throw Error('INVALID_DIAGNOSTIC_DURATION');
   out.durationMs=input.durationMs;
 }
 if(input.method!==undefined){
   if(!['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(input.method))throw Error('INVALID_DIAGNOSTIC_METHOD');
   out.method=input.method;
 }
 if(input.scope!==undefined){
   if(!['local','remote','unknown'].includes(input.scope))throw Error('INVALID_DIAGNOSTIC_SCOPE');
   out.scope=input.scope;
 }
 if(input.routeTemplate!==undefined){
   if(typeof input.routeTemplate!=='string'||input.routeTemplate.length>160||
      !/^\/(?:[a-z0-9]+|:id)(?:\/(?:[a-z0-9]+|:id))*\/?$/.test(input.routeTemplate))
     throw Error('INVALID_DIAGNOSTIC_ROUTE');
   out.routeTemplate=input.routeTemplate;
 }
 if(input.requestId!==undefined){
   if(typeof input.requestId!=='string'||!/^[0-9a-f-]{36}$/.test(input.requestId))throw Error('INVALID_DIAGNOSTIC_REQUEST');
   out.requestId=input.requestId;
 }
 if(input.elapsedMs!==undefined){
   if(!Number.isSafeInteger(input.elapsedMs)||input.elapsedMs<0||input.elapsedMs>3600000)throw Error('INVALID_DIAGNOSTIC_DURATION');
   out.elapsedMs=input.elapsedMs;
 }
 if(input.pid!==undefined){
   if(!Number.isSafeInteger(input.pid)||input.pid<1||input.pid>2147483647)throw Error('INVALID_DIAGNOSTIC_PID');
   out.pid=input.pid;
 }
 if(input.ppid!==undefined){
   if(!Number.isSafeInteger(input.ppid)||input.ppid<0||input.ppid>2147483647)throw Error('INVALID_DIAGNOSTIC_PID');
   out.ppid=input.ppid;
 }
 if(input.processClass!==undefined){
   if(!['app','browser','proxy','child'].includes(input.processClass))throw Error('INVALID_DIAGNOSTIC_PROCESS');
   out.processClass=input.processClass;
 }
 if(input.protocol!==undefined){
   if(!['TCP','UDP'].includes(input.protocol))throw Error('INVALID_DIAGNOSTIC_PROTOCOL');
   out.protocol=input.protocol;
 }
 if(input.remoteIp!==undefined){
   if(typeof input.remoteIp!=='string'||!net.isIP(input.remoteIp))throw Error('INVALID_DIAGNOSTIC_IP');
   out.remoteIp=input.remoteIp;
 }
 if(input.remotePort!==undefined){
   if(!Number.isInteger(input.remotePort)||input.remotePort<0||input.remotePort>65535)throw Error('INVALID_DIAGNOSTIC_PORT');
   out.remotePort=input.remotePort;
 }
 if(input.fileExt!==undefined){
   if(!['txt','json','csv','zip','bin','pdf','other'].includes(input.fileExt))throw Error('INVALID_DIAGNOSTIC_EXTENSION');
   out.fileExt=input.fileExt;
 }
 if(input.sha256!==undefined){
   if(typeof input.sha256!=='string'||!/^[a-f0-9]{64}$/.test(input.sha256))
     throw Error('INVALID_DIAGNOSTIC_SHA256');
   out.sha256=input.sha256;
 }
 return Object.freeze(out);
}
function mapNativeEvent(row){
 if(!row||typeof row!=='object')return null;
 const base={source:'programa',at:new Date().toISOString()};
 if(row.kind==='http'){
   const event={request:'native_http_request',response:'native_http_response',error:'native_http_error'}[row.phase];
   if(!event)return null;
   const out={...base,event,method:row.action,scope:row.scope,routeTemplate:row.routeTemplate,requestId:row.requestId};
   for(const key of ['status','elapsedMs','bytes'])if(row[key]!=null)out[key]=row[key];
   return out;
 }
 if(row.kind==='process')return {...base,event:'native_process_seen',pid:row.pid,ppid:row.ppid,processClass:row.processClass};
 if(row.kind==='connection')return {...base,event:'native_connection_seen',pid:row.pid,protocol:row.protocol,
   ...(row.remoteIp?{remoteIp:row.remoteIp}:{}),remotePort:row.remotePort};
 if(row.kind==='file')return {...base,event:row.action==='removed'?'native_file_removed':'native_file_changed',
   fileExt:row.fileExt,...(row.bytes!=null?{bytes:row.bytes}:{})};
 if(row.kind==='session'&&row.phase==='error')return {...base,event:'native_monitor_error'};
 return null;
}
async function startDiagnosticPanel({exportDirectory}={}){
 const token=crypto.randomBytes(24).toString('hex');
 const nonce=crypto.randomBytes(16).toString('base64');
 const events=[];
 const counters={total:0,approved:0,saved:0,failed:0};
 let boundPort=null,stopObserver=null;
 function reportJSON(){
   // Whitelisted events are already sanitized at emit() time.
   return JSON.stringify({schema:1,engine:'DICloak 3.0.7',
     diagnostic:'0.4.2',delivery:'v30.0.15-motor042-rc2',
     coverage:'partial',events,counters},null,2);
 }
 function saveReport(){
   let directory=exportDirectory;
   if(directory===undefined){
     try {directory=require('electron').app.getPath('downloads');}
     catch {return {ok:false,error:'DOWNLOAD_DIRECTORY_UNAVAILABLE'};}
   }
   if(typeof directory!=='string'||!path.isAbsolute(directory))
     return {ok:false,error:'DOWNLOAD_DIRECTORY_UNAVAILABLE'};
   // No user-controlled names or paths. Do not touch browser profile storage.
   const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\..*$/,'').replace('T','-');
   const fileName='Dyclok-Diagnostico-Motor042-'+stamp+'-'+crypto.randomBytes(4).toString('hex')+'.json';
   try{
     fs.mkdirSync(directory,{recursive:true});
     fs.writeFileSync(path.join(directory,fileName),reportJSON(),{
       encoding:'utf8',flag:'wx',mode:0o600
     });
     return {ok:true,fileName,eventCount:events.length};
   }catch{return {ok:false,error:'WRITE_ERROR'};}
 }
 const server=http.createServer((req,res)=>{
   const host='127.0.0.1:'+boundPort;
   const prefix='/diagnostico/'+token+'/';
   const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
     'X-Frame-Options':'DENY','Referrer-Policy':'no-referrer',
     'Cross-Origin-Resource-Policy':'same-origin'};
   const canSave=req.method==='POST'&&req.url===prefix+'save-json';
   if(req.headers.host!==host||
      !(req.method==='GET'||canSave)||
      (req.headers.origin && req.headers.origin!=='http://'+host)||
      (canSave && req.headers.origin!=='http://'+host)){
     res.writeHead(403,headers);res.end();return;
   }
   if(canSave){
     const result=saveReport();
     const status=result.ok?200:503;
     res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8'});
     res.end(JSON.stringify(result));return;
   }
   if(req.url===prefix){
     const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
     const csp="default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
     res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8',
       'Content-Security-Policy':csp});
     res.end(html.replaceAll('PANEL_CSP_NONCE',nonce));return;
   }
   if(req.url===prefix+'export'){
     const json=reportJSON();
     res.writeHead(200,{...headers,'Content-Type':'application/json; charset=utf-8',
       'Content-Disposition':'attachment; filename="Dyclok-Diagnostico-Motor-042.json"'});
     res.end(json);return;
   }
   if(req.url===prefix+'state'){
     res.writeHead(200,{...headers,'Content-Type':'application/json; charset=utf-8'});
     res.end(JSON.stringify({events,counters}));return;
   }
   res.writeHead(404,headers);res.end();
 });
 await new Promise((resolve,reject)=>{
   server.once('error',reject);
   server.listen(0,'127.0.0.1',resolve);
 });
 boundPort=server.address().port;
 function emit(entry){
   const event=validateDiagnostic(entry);
   events.push(event);
   if(events.length>400)events.shift();
   counters.total++;
   if(event.event==='response_approved')counters.approved++;
   if(event.event==='document_saved')counters.saved++;
   if(['operation_step_failed','api_failed','debugger_failed','response_failed','document_failed','connection_failed','native_http_error','native_monitor_error'].includes(event.event))
     counters.failed++;
 }
 emit({source:'programa',event:'panel_ready'});
 try {
   const app=require('electron').app;
   if(app && typeof app.getPath==='function')stopObserver=startCapture({pid:process.pid,
     labRoot:app?.getPath?.('userData'),
     emit:raw=>{const safe=mapNativeEvent(raw);if(safe)try{emit(safe);}catch{}}});
 }catch{/* unavailable outside packaged Electron; do not fabricate native events */}
 return Object.freeze({
   url:'http://127.0.0.1:'+boundPort+'/diagnostico/'+token+'/',
   emit,
   getState:()=>JSON.parse(JSON.stringify({events,counters})),
   stop:()=>{
     if(stopObserver){try{stopObserver();}catch{}stopObserver=null;}
     return new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
   }
 });
}
module.exports={startDiagnosticPanel,validateDiagnostic,SOURCES,EVENTS,mapNativeEvent};

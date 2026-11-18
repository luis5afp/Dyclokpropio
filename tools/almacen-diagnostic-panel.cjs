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

const SOURCES=new Set(['programa','servidor_pruebas','chromium','almacen']);
const EVENTS=new Set([
 'panel_ready','configuration_missing','profile_wait','profile_running','api_request','api_response',
 'embedded_ui_only','operation_open_requested','operation_step_completed','operation_step_failed',
 'stage_pre_data_inject','stage_fetch_env_info','stage_expand_check','stage_params_merge',
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
 if(input.sha256!==undefined){
   if(typeof input.sha256!=='string'||!/^[a-f0-9]{64}$/.test(input.sha256))
     throw Error('INVALID_DIAGNOSTIC_SHA256');
   out.sha256=input.sha256;
 }
 return Object.freeze(out);
}
async function startDiagnosticPanel(){
 const token=crypto.randomBytes(24).toString('hex');
 const nonce=crypto.randomBytes(16).toString('base64');
 const events=[];
 const counters={total:0,approved:0,saved:0,failed:0};
 let boundPort=null;
 const server=http.createServer((req,res)=>{
   const host='127.0.0.1:'+boundPort;
   const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
     'X-Frame-Options':'DENY','Referrer-Policy':'no-referrer',
     'Cross-Origin-Resource-Policy':'same-origin'};
   if(req.headers.host!==host||req.method!=='GET'||
      (req.headers.origin && req.headers.origin!=='http://'+host)){
     res.writeHead(403,headers);res.end();return;
   }
   const prefix='/diagnostico/'+token+'/';
   if(req.url===prefix){
     const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
     const csp="default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
     res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8',
       'Content-Security-Policy':csp});
     res.end(html.replaceAll('PANEL_CSP_NONCE',nonce));return;
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
   if(['api_failed','debugger_failed','response_failed','document_failed','connection_failed'].includes(event.event))
     counters.failed++;
 }
 emit({source:'programa',event:'panel_ready'});
 return Object.freeze({
   url:'http://127.0.0.1:'+boundPort+'/diagnostico/'+token+'/',
   emit,
   getState:()=>JSON.parse(JSON.stringify({events,counters})),
   stop:()=>new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()))
 });
}
module.exports={startDiagnosticPanel,validateDiagnostic,SOURCES,EVENTS};

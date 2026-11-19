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
const {makeOpeningAudit,renderAuditTXT}=require('./almacen-diagnostic-report.cjs');
const {safeHostname,ROUTE_WORDS,safeMime,safeEncoding,safeHttpProtocol,statusClass}=require('./almacen-http-context.cjs');

const SOURCES=new Set(['programa','servidor_pruebas','chromium','almacen']);
const EVENTS=new Set([
 'native_http_request','native_http_response','native_http_error','native_http_transfer',
 'native_fetch_request','native_fetch_response','native_fetch_error','native_fetch_complete',
 'native_http_socket','native_http_tcp','native_http_tls',
 'chromium_monitor_status','chromium_target_connected','chromium_network_request',
 'chromium_network_response','chromium_network_finish','chromium_network_fail',
 'chromium_network_redirect',
 'chromium_cookie_response','chromium_cookie_request',
 'native_process_seen','native_connection_seen','native_file_changed','native_file_removed','native_monitor_error',
 'capture_started','capture_finished','capture_unavailable',

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
 if(input.requestBytesDeclared!==undefined){
   if(!Number.isSafeInteger(input.requestBytesDeclared)||
      input.requestBytesDeclared<0||input.requestBytesDeclared>32*1024*1024)
     throw Error('INVALID_DIAGNOSTIC_SIZE');
   out.requestBytesDeclared=input.requestBytesDeclared;
 }
 for(const key of ['outboundBodyBytesQueued','inboundBodyBytesObserved']){
   if(input[key]!==undefined){
     if(!Number.isSafeInteger(input[key])||input[key]<0||input[key]>32*1024*1024)
       throw Error('INVALID_DIAGNOSTIC_SIZE');
     out[key]=input[key];
   }
 }
 for(const key of ['requestAuthorizationPresent','requestCookiePresent',
   'requestProxyAuthorizationPresent','responseSetCookiePresent','byteCountLimited',
   'socketReused','transportEncrypted','tlsAuthorized','cookieSetAttempt',
   'servedFromCache','servedFromServiceWorker']){
   if(input[key]!==undefined){
     if(typeof input[key]!=='boolean')throw Error('INVALID_DIAGNOSTIC_FLAG');
     out[key]=input[key];
   }
 }
 for(const key of ['routeDepth','routeMaskedSegments']){
   if(input[key]!==undefined){
     if(!Number.isInteger(input[key])||input[key]<0||input[key]>10)
       throw Error('INVALID_ROUTE_STRUCTURE');
     out[key]=input[key];
   }
 }
 if(input.queryKeyNames!==undefined){
   const approved=new Set(['page','limit','offset','size','sort','order','lang','language','version']);
   if(!Array.isArray(input.queryKeyNames)||input.queryKeyNames.length>9||
      !input.queryKeyNames.every(x=>approved.has(x)))throw Error('INVALID_QUERY_KEY_NAMES');
   out.queryKeyNames=[...input.queryKeyNames];
 }
 if(input.originHost!==undefined){
   if(safeHostname(input.originHost)!==input.originHost)
     throw Error('INVALID_ORIGIN_HOST');
   out.originHost=input.originHost;
 }
 for(const [field,allowed] of Object.entries({
   endpointArea:['other','proxy','cookie','cookies','session','auth','login',
     'env','profile','profiles','storage','fingerprint','network','gateway'],
   mediaType:['application/json','application/problem+json','application/xml',
     'application/javascript','application/wasm','application/octet-stream',
     'application/x-www-form-urlencoded','application/pdf',
     'text/html','text/plain','text/css','text/javascript','text/xml',
     'image/png','image/jpeg','image/gif','image/webp','image/svg+xml',
     'font/woff','font/woff2','multipart/form-data',
     'application/vnd.diloakpro-lab+json','other'],
   contentEncoding:['gzip','br','deflate','identity','zstd','other'],
   responseClass:['1xx','2xx','3xx','4xx','5xx','unknown'],
   httpProtocol:['http/1.0','http/1.1','h2','h3','http/2','http/3','quic','http','other'],
   monitorIssue:['none','disabled_by_default','missing_api_port','invalid_api_port',
     'missing_api_key','api_access_denied','api_endpoint_unsupported',
     'api_profile_mismatch','api_session_not_running','api_unreachable',
     'api_response_unavailable','cdp_connection_unavailable',
     'cdp_transport_missing','cdp_ws_invalid']
 })){
   if(input[field]!==undefined){
     if(!allowed.includes(input[field]))throw Error('INVALID_NETWORK_METADATA_ENUM');
     out[field]=input[field];
   }
 }
 for(const key of ['encodedBytes','blockedCookieCount','sentCookieCount']){
   if(input[key]!==undefined){
     if(!Number.isSafeInteger(input[key])||input[key]<0||input[key]>33554432)
       throw Error('INVALID_CHROMIUM_METRIC');
     out[key]=input[key];
   }
 }
 if(input.browserHost!==undefined){
   if(typeof input.browserHost!=='string'||input.browserHost.length>180||
      !((/^(?:[a-z0-9-]{1,63}\.)*[a-z0-9-]{1,63}$/.test(input.browserHost))||
        net.isIP(input.browserHost)))throw Error('INVALID_CHROMIUM_HOST');
   out.browserHost=input.browserHost;
 }
 for(const [field,allowed] of Object.entries({
   resourceType:['Document','Stylesheet','Image','Media','Font','Script',
     'TextTrack','XHR','Fetch','Prefetch','EventSource','WebSocket',
     'Manifest','SignedExchange','Ping','CSPViolationReport','Other'],
   monitorStatus:['not_configured','resolving','verified','active','unavailable','stopped'],
   transportProtocol:['http','https'],
   targetType:['page','iframe'],
   sessionMapping:['openapi_verified'],
   failureKind:['blocked','network_or_cancelled']
 })){
   if(input[field]!==undefined){
     if(!allowed.includes(input[field]))throw Error('INVALID_CHROMIUM_ENUM');
     out[field]=input[field];
   }
 }
 if(input.cookieBlockedReasons!==undefined){
   const allowed=new Set(['SecureOnly','NotOnPath','DomainMismatch',
     'SameSiteStrict','SameSiteLax','SameSiteUnspecifiedTreatedAsLax',
     'SameSiteNoneInsecure','UserPreferences','ThirdPartyPhaseout',
     'NameValuePairExceedsMaxSize','SchemefulSameSiteStrict',
     'SchemefulSameSiteLax','InvalidDomain','InvalidPrefix','UnknownError',
     'SyntaxError','SameSiteUnspecifiedLaxAllowUnsafe',
     'SamePartyFromCrossPartyContext',
     'SamePartyConflictsWithOtherAttributes',
     'SamePartyFromSamePartyContext','SamePartyExclusionOverruled','Other']);
   if(!Array.isArray(input.cookieBlockedReasons)||
      input.cookieBlockedReasons.length>15||
      !input.cookieBlockedReasons.every(v=>allowed.has(v)))
     throw Error('INVALID_COOKIE_REASONS');
   out.cookieBlockedReasons=[...input.cookieBlockedReasons];
 }
 if(input.tlsProtocol!==undefined){
   if(!['TLSv1.0','TLSv1.1','TLSv1.2','TLSv1.3'].includes(input.tlsProtocol))
     throw Error('INVALID_TLS_PROTOCOL');
   out.tlsProtocol=input.tlsProtocol;
 }
 if(input.transferState!==undefined){
   if(!['response_end','response_closed','request_error'].includes(input.transferState))
     throw Error('INVALID_DIAGNOSTIC_TRANSFER_STATE');
   out.transferState=input.transferState;
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
 if(input.peerIp!==undefined){
   if(typeof input.peerIp!=='string'||!net.isIP(input.peerIp))
     throw Error('INVALID_DIAGNOSTIC_IP');
   out.peerIp=input.peerIp;
 }
 if(input.peerPort!==undefined){
   if(!Number.isInteger(input.peerPort)||input.peerPort<1||input.peerPort>65535)
     throw Error('INVALID_DIAGNOSTIC_PORT');
   out.peerPort=input.peerPort;
 }
 if(input.fileExt!==undefined){
   if(!['txt','json','csv','zip','bin','pdf','other'].includes(input.fileExt))throw Error('INVALID_DIAGNOSTIC_EXTENSION');
   out.fileExt=input.fileExt;
 }
 if(input.captureId!==undefined){
   if(typeof input.captureId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(input.captureId))
     throw Error('INVALID_CAPTURE_ID');
   out.captureId=input.captureId;
 }
 if(input.captureRelation!==undefined){
   if(!['temporal','ambiguous'].includes(input.captureRelation))
     throw Error('INVALID_CAPTURE_RELATION');
   out.captureRelation=input.captureRelation;
 }
 if(input.finishReason!==undefined){
   if(!['completed','failed','timeout','restarted','capacity','shutdown'].includes(input.finishReason))
     throw Error('INVALID_CAPTURE_FINISH_REASON');
   out.finishReason=input.finishReason;
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
   const event={request:'native_http_request',response:'native_http_response',error:'native_http_error',transfer:'native_http_transfer',
     socket:'native_http_socket',tcp:'native_http_tcp',tls:'native_http_tls'}[row.phase];
   if(!event)return null;
   const out={...base,event,method:row.action,scope:row.scope,routeTemplate:row.routeTemplate,requestId:row.requestId};
   for(const key of ['originHost','routeDepth','routeMaskedSegments',
     'endpointArea','queryKeyNames','mediaType','contentEncoding','responseClass']){
     if(row[key]!==undefined)out[key]=row[key];
   }
   for(const key of ['status','elapsedMs','bytes','requestBytesDeclared',
     'outboundBodyBytesQueued','inboundBodyBytesObserved','byteCountLimited',
     'requestAuthorizationPresent','requestCookiePresent',
     'requestProxyAuthorizationPresent','responseSetCookiePresent','transferState','peerIp','peerPort',
     'socketReused','transportEncrypted','tlsAuthorized','tlsProtocol'])if(row[key]!=null)out[key]=row[key];
   return out;
 }
 if(row.kind==='fetch'){
   const event={request:'native_fetch_request',response:'native_fetch_response',
     error:'native_fetch_error',complete:'native_fetch_complete'}[row.phase];
   if(!event)return null;
   return {...base,event,method:row.action,scope:row.scope,
     routeTemplate:row.routeTemplate,requestId:row.requestId,
     ...(row.originHost?{originHost:row.originHost}:{}),
     ...(row.routeDepth!==undefined?{routeDepth:row.routeDepth}:{}),
     ...(row.routeMaskedSegments!==undefined?{routeMaskedSegments:row.routeMaskedSegments}:{}),
     ...(row.endpointArea?{endpointArea:row.endpointArea}:{}),
     ...(row.queryKeyNames?{queryKeyNames:row.queryKeyNames}:{}),
     ...(row.status!==undefined?{status:row.status}:{}),
     ...(row.elapsedMs!==undefined?{elapsedMs:row.elapsedMs}:{})};
 }
 if(row.kind==='chromium'){
   const event={status:'chromium_monitor_status',target:'chromium_target_connected',
     request:'chromium_network_request',response:'chromium_network_response',
     redirect:'chromium_network_redirect',
     finish:'chromium_network_finish',fail:'chromium_network_fail',
     cookie_response:'chromium_cookie_response',
     cookie_request:'chromium_cookie_request'}[row.phase];
   if(!event)return null;
   const out={...base,source:'chromium',event};
   for(const key of ['requestId','method','routeTemplate','browserHost',
     'routeDepth','routeMaskedSegments','queryKeyNames','endpointArea',
     'mediaType','httpProtocol','responseClass','servedFromCache',
     'servedFromServiceWorker','monitorIssue',
     'transportProtocol','resourceType','status','durationMs',
     'encodedBytes','blockedCookieCount','sentCookieCount',
     'cookieBlockedReasons','cookieSetAttempt','targetType',
     'monitorStatus','sessionMapping','failureKind','peerIp','peerPort']){
     if(row[key]!==undefined)out[key]=row[key];
   }
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
async function startDiagnosticPanel({exportDirectory,observeOnOpen=true}={}){
 const token=crypto.randomBytes(24).toString('hex');
 const nonce=crypto.randomBytes(16).toString('base64');
 const events=[];
 const counters={total:0,approved:0,saved:0,failed:0};
 const completedStages=new Set();
 const capture={status:'not_started',startedBeforeOpen:false,
   openStageCompleted:false,requestCountDuringOpening:0,
   ambiguousEventCount:0,finishReason:null,relation:'not_verified',
   captureId:null};
 const telemetry={browserProcessObserved:false,nodeRequests:0,
   fetchRequests:0,fetchResponses:0,fetchErrors:0,fetchCompletions:0,
   tcpConnections:0,tlsHandshakes:0,tlsAuthorized:0,
   chromiumStatus:'not_configured',chromiumIssue:'disabled_by_default',chromiumMapped:false,
   chromiumRequests:0,chromiumResponses:0,chromiumHttp200:0,
   chromiumFailures:0,chromiumFinished:0,chromiumTargets:0,
   chromiumSetCookieAttempts:0,chromiumCookiesBlocked:0,
   chromiumCookiesSent:0,chromiumEncodedBytes:0,
   chromiumHosts:new Set(),
   nodeResponses:0,nodeTransfers:0,uploadRouteRequests:0,declaredOutboundBytes:0,
   requestsWithKnownSize:0,outboundBodyBytesQueued:0,inboundBodyBytesObserved:0,
   byteCountLimited:0,requestsWithAuthorization:0,requestsWithCookie:0,
   requestsWithProxyAuthorization:0,responsesWithSetCookie:0};
 function checks(){
   const has=stage=>completedStages.has(stage);
   return {
     // Stage completion is not proof that stored secrets were restored.
     profileOpenStageCompleted:has('stage_open_env'),
     browserProcessObserved:telemetry.browserProcessObserved,
     proxyCheckStageCompleted:has('stage_proxy_check_result'),
     cookiePlanStageCompleted:has('stage_cookie_encrypt_plan'),
     extensionsCheckStageCompleted:has('stage_expand_check'),
     fingerprintParamsStageCompleted:has('stage_params_merge'),
     credentialsRestored:'not_verified',
     cookiesRestored:'not_verified',
     proxyExitAndAuthentication:'not_verified',
     browserSessionLinkedToRow:telemetry.chromiumMapped?
       'openapi_verified':'not_verified',
     capture:{
       status:capture.status,
       startedBeforeOpen:capture.startedBeforeOpen,
       openStageCompleted:capture.openStageCompleted,
       requestsBeforeOpenStageCompleted:capture.requestCountDuringOpening,
       ambiguousEvents:capture.ambiguousEventCount,
       finishReason:capture.finishReason,
       trafficAttribution:'temporal_only_not_chromium_verified'
     },
     networkMetadata:{
       nodeRequests:telemetry.nodeRequests,
       fetchRequests:telemetry.fetchRequests,
       fetchResponses:telemetry.fetchResponses,
       fetchErrors:telemetry.fetchErrors,
       fetchCompletions:telemetry.fetchCompletions,
       tcpConnections:telemetry.tcpConnections,
       tlsHandshakes:telemetry.tlsHandshakes,
       tlsAuthorized:telemetry.tlsAuthorized,
       networkCoverage:telemetry.chromiumMapped?
         'node_and_cdp_mapped_partial':'node_http_request_and_undici_fetch_partial_no_chromium',
       chromiumStatus:telemetry.chromiumStatus,
       chromiumIssue:telemetry.chromiumIssue,
       chromiumSessionMapped:telemetry.chromiumMapped,
       chromiumRequests:telemetry.chromiumRequests,
       chromiumResponses:telemetry.chromiumResponses,
       chromiumHttp200:telemetry.chromiumHttp200,
       chromiumFailures:telemetry.chromiumFailures,
       chromiumFinished:telemetry.chromiumFinished,
       chromiumTargets:telemetry.chromiumTargets,
       chromiumSetCookieAttempts:telemetry.chromiumSetCookieAttempts,
       chromiumCookiesBlocked:telemetry.chromiumCookiesBlocked,
       chromiumCookiesSent:telemetry.chromiumCookiesSent,
       chromiumEncodedBytes:telemetry.chromiumEncodedBytes,
       chromiumHostCount:telemetry.chromiumHosts.size,
       nodeResponses:telemetry.nodeResponses,
       nodeTransfers:telemetry.nodeTransfers,
       outboundBodyBytesQueued:telemetry.outboundBodyBytesQueued,
       inboundBodyBytesObserved:telemetry.inboundBodyBytesObserved,
       byteCountLimited:telemetry.byteCountLimited,
       requestsWithAuthorization:telemetry.requestsWithAuthorization,
       requestsWithCookie:telemetry.requestsWithCookie,
       requestsWithProxyAuthorization:telemetry.requestsWithProxyAuthorization,
       responsesWithSetCookie:telemetry.responsesWithSetCookie,
       byteCountingScope:'node_http_application_body_not_wire_traffic',
       uploadRouteRequests:telemetry.uploadRouteRequests,
       requestsWithKnownSize:telemetry.requestsWithKnownSize,
       declaredOutboundBytes:telemetry.declaredOutboundBytes
     }
   };
 }
 let boundPort=null,stopObserver=null;
 function makeReport(){
   const report={
     schema:2,engine:'DICloak 3.0.7',diagnostic:'0.4.2',
     delivery:'v30.0.22-diloakpro-rc9',coverage:'partial',
     exportedAt:new Date().toISOString(),
     events,counters,checks:checks()
   };
   return {...report,audit:makeOpeningAudit(report)};
 }
 function reportJSON(){return JSON.stringify(makeReport(),null,2);}
 function saveReport(){
   let directory=exportDirectory;
   if(directory===undefined){
     try{directory=require('electron').app.getPath('downloads');}
     catch{return {ok:false,error:'DOWNLOAD_DIRECTORY_UNAVAILABLE'};}
   }
   if(typeof directory!=='string'||!path.isAbsolute(directory))
     return {ok:false,error:'DOWNLOAD_DIRECTORY_UNAVAILABLE'};
   const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\..*$/,'').replace('T','-');
   const base='diloakPRO-Diagnostico-'+stamp+'-'+crypto.randomBytes(4).toString('hex');
   const fileName=base+'.json',txtFileName=base+'.txt';
   const jsonPath=path.join(directory,fileName),txtPath=path.join(directory,txtFileName);
   const report=makeReport();
   try{
     fs.mkdirSync(directory,{recursive:true});
     const json=JSON.stringify(report,null,2);
     const txt=renderAuditTXT(report);
     fs.writeFileSync(jsonPath,json,{encoding:'utf8',flag:'wx',mode:0o600});
     try{
       fs.writeFileSync(txtPath,txt,{encoding:'utf8',flag:'wx',mode:0o600});
     }catch{
       try{fs.unlinkSync(jsonPath);}catch{}
       throw Error('REPORT_PAIR_INCOMPLETE');
     }
     return {ok:true,fileName,txtFileName,eventCount:events.length};
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
       'Content-Disposition':'attachment; filename="diloakPRO-Diagnostico-RC6.json"'});
     res.end(json);return;
   }
   if(req.url===prefix+'state'){
     res.writeHead(200,{...headers,'Content-Type':'application/json; charset=utf-8'});
     res.end(JSON.stringify({events,counters,checks:checks(),audit:makeOpeningAudit({events,counters,checks:checks()})}));return;
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
   if(event.event==='capture_started'){
     capture.status='active';
     capture.startedBeforeOpen=false;
     capture.openStageCompleted=false;
     capture.requestCountDuringOpening=0;
     capture.ambiguousEventCount=0;
     capture.captureId=event.captureId||null;
     capture.finishReason=null;
     capture.relation=event.captureRelation||'not_verified';
     completedStages.clear();
   }
   if(event.event==='operation_open_requested'&&capture.status==='active')
     capture.startedBeforeOpen=true;
   if(event.event==='operation_step_completed'&&event.stage){
     completedStages.add(event.stage);
     if(event.stage==='stage_open_env')capture.openStageCompleted=true;
   }
   if(event.captureId&&event.captureId===capture.captureId){
     if(event.captureRelation==='ambiguous')capture.ambiguousEventCount++;
     if(event.event==='native_http_request'&&!capture.openStageCompleted)
       capture.requestCountDuringOpening++;
   }
   if(event.event==='capture_finished'&&event.captureId===capture.captureId){
     capture.status='finished';
     capture.finishReason=event.finishReason||'completed';
   }
   if(event.event==='capture_unavailable')capture.status='unavailable';
   if(event.event==='native_process_seen'&&event.processClass==='browser')
     telemetry.browserProcessObserved=true;
   if(event.event==='chromium_monitor_status'){
     telemetry.chromiumStatus=event.monitorStatus;
     if(event.monitorIssue)telemetry.chromiumIssue=event.monitorIssue;
     // A local API mapping alone is insufficient: require an active CDP
     // WebSocket before claiming the browser network is observable.
     if(event.monitorStatus==='active')telemetry.chromiumMapped=true;
   }
   if(event.event==='chromium_target_connected')telemetry.chromiumTargets++;
   if(event.event==='chromium_network_request'){
     telemetry.chromiumRequests++;
     if(event.browserHost&&telemetry.chromiumHosts.size<300)
       telemetry.chromiumHosts.add(event.browserHost);
   }
   if(event.event==='chromium_network_response'){
     telemetry.chromiumResponses++;
     if(event.status===200)telemetry.chromiumHttp200++;
   }
   if(event.event==='chromium_network_fail')telemetry.chromiumFailures++;
   if(event.event==='chromium_network_finish'){
     telemetry.chromiumFinished++;
     if(event.encodedBytes!==undefined)telemetry.chromiumEncodedBytes+=event.encodedBytes;
   }
   if(event.event==='chromium_cookie_response'){
     if(event.cookieSetAttempt)telemetry.chromiumSetCookieAttempts++;
     telemetry.chromiumCookiesBlocked+=event.blockedCookieCount||0;
   }
   if(event.event==='chromium_cookie_request'){
     telemetry.chromiumCookiesSent+=event.sentCookieCount||0;
     telemetry.chromiumCookiesBlocked+=event.blockedCookieCount||0;
   }
   if(event.event==='native_http_request'){
     telemetry.nodeRequests++;
     if(event.routeTemplate?.endsWith('/upload'))telemetry.uploadRouteRequests++;
     if(event.requestBytesDeclared!==undefined){
       telemetry.requestsWithKnownSize++;
       telemetry.declaredOutboundBytes+=event.requestBytesDeclared;
     }
   }
   if(event.event==='native_http_response')telemetry.nodeResponses++;
   if(event.event==='native_fetch_request')telemetry.fetchRequests++;
   if(event.event==='native_fetch_response')telemetry.fetchResponses++;
   if(event.event==='native_fetch_error')telemetry.fetchErrors++;
   if(event.event==='native_fetch_complete')telemetry.fetchCompletions++;
   if(event.event==='native_http_tcp')telemetry.tcpConnections++;
   if(event.event==='native_http_tls'){
     telemetry.tlsHandshakes++;
     if(event.tlsAuthorized)telemetry.tlsAuthorized++;
   }
   if(event.event==='native_http_transfer'){
     telemetry.nodeTransfers++;
     if(event.byteCountLimited)telemetry.byteCountLimited++;
     if(event.outboundBodyBytesQueued!==undefined)
       telemetry.outboundBodyBytesQueued+=event.outboundBodyBytesQueued;
     if(event.inboundBodyBytesObserved!==undefined)
       telemetry.inboundBodyBytesObserved+=event.inboundBodyBytesObserved;
     if(event.requestAuthorizationPresent)telemetry.requestsWithAuthorization++;
     if(event.requestCookiePresent)telemetry.requestsWithCookie++;
     if(event.requestProxyAuthorizationPresent)telemetry.requestsWithProxyAuthorization++;
     if(event.responseSetCookiePresent)telemetry.responsesWithSetCookie++;
   }
   events.push(event);
   if(events.length>2400)events.shift();
   counters.total++;
   if(event.event==='response_approved')counters.approved++;
   if(event.event==='document_saved')counters.saved++;
   if(['operation_step_failed','api_failed','debugger_failed','response_failed','document_failed','connection_failed','native_http_error','native_fetch_error','native_monitor_error',
     'chromium_network_fail'].includes(event.event))
     counters.failed++;
 }
 emit({source:'programa',event:'panel_ready'});
 try {
   const app=require('electron').app;
   if(observeOnOpen && app && typeof app.getPath==='function')stopObserver=startCapture({pid:process.pid,
     labRoot:app?.getPath?.('userData'),
     emit:raw=>{const safe=mapNativeEvent(raw);if(safe)try{emit(safe);}catch{}}});
 }catch{/* unavailable outside packaged Electron; do not fabricate native events */}
 return Object.freeze({
   url:'http://127.0.0.1:'+boundPort+'/diagnostico/'+token+'/',
   emit,
   getState:()=>JSON.parse(JSON.stringify({events,counters,checks:checks(),audit:makeOpeningAudit({events,counters,checks:checks()})})),
   stop:()=>{
     if(stopObserver){try{stopObserver();}catch{}stopObserver=null;}
     return new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
   }
 });
}
module.exports={startDiagnosticPanel,validateDiagnostic,SOURCES,EVENTS,mapNativeEvent};

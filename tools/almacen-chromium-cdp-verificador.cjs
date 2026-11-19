'use strict';
/**
 * Read-only Chromium network lifecycle observer. The source of browser WS
 * address is ONLY the vendor's localhost OpenAPI runtime status for an exact
 * profile identifier. Never scan ports, derive a WS URL from PID or attach to
 * arbitrary browsers. Do not request cookie stores, HTTP bodies, headers,
 * storage, passwords, credentials, page scripts or JavaScript contexts.
 *
 * This diagnostic can miss early browser navigation when attached after
 * opening. It reports cookie attempts and block reasons, not definitive
 * cookie persistence or proxy authentication.
 */
const crypto=require('node:crypto');
const net=require('node:net');
const {performance}=require('node:perf_hooks');
const {requestMetadata}=require('./almacen-observador-integrado.cjs');
const {safeMime,safeHttpProtocol,statusClass}=require('./almacen-http-context.cjs');
const {
  getRunningTestProfile,findBrowserWebSocket,validateLocalBrowserWebSocket
}=require('./dicloak-local-api-profile.cjs');

const RESOURCE_TYPES=new Set([
 'Document','Stylesheet','Image','Media','Font','Script','TextTrack',
 'XHR','Fetch','Prefetch','EventSource','WebSocket','Manifest',
 'SignedExchange','Ping','CSPViolationReport','Other'
]);
const BLOCKED_REASONS=new Set([
 'SecureOnly','NotOnPath','DomainMismatch','SameSiteStrict','SameSiteLax',
 'SameSiteUnspecifiedTreatedAsLax','SameSiteNoneInsecure','UserPreferences',
 'ThirdPartyPhaseout','NameValuePairExceedsMaxSize','SchemefulSameSiteStrict',
 'SchemefulSameSiteLax','InvalidDomain','InvalidPrefix','UnknownError',
 'SyntaxError','SameSiteUnspecifiedLaxAllowUnsafe','NotOnPath',
 'SamePartyFromCrossPartyContext','SamePartyConflictsWithOtherAttributes',
 'SamePartyFromSamePartyContext','SamePartyExclusionOverruled'
]);
const MAX_REQUESTS=1400, MAX_EVENTS=5000, MAX_COMMAND_MS=8000;
function safeNumber(v,max=32*1024*1024){
 return Number.isSafeInteger(v)&&v>=0&&v<=max?v:undefined;
}
function safeHost(urlValue){
 let u;
 try{u=new URL(String(urlValue||''));}catch{return null;}
 if(!['http:','https:'].includes(u.protocol)||u.username||u.password)return null;
 const hostname=u.hostname.toLowerCase();
 if(hostname.length>180||(!net.isIP(hostname)&&
   !/^(?:[a-z0-9-]{1,63}\.)*[a-z0-9-]{1,63}$/.test(hostname)))return null;
 const meta=requestMetadata([{method:'GET',hostname,path:u.pathname}],u.protocol);
 if(!meta)return null;
 return {browserHost:hostname,routeTemplate:meta.routeTemplate,
   routeDepth:meta.routeDepth,routeMaskedSegments:meta.routeMaskedSegments,
   endpointArea:meta.endpointArea,queryKeyNames:meta.queryKeyNames,
   transportProtocol:u.protocol==='https:'?'https':'http'};
}
function safeReasons(cookies){
 if(!Array.isArray(cookies))return {count:0,reasons:[]};
 const reasons=new Set();
 for(const entry of cookies.slice(0,128)){
   for(const reason of Array.isArray(entry?.blockedReasons)?entry.blockedReasons:[]){
     reasons.add(BLOCKED_REASONS.has(reason)?reason:'Other');
   }
 }
 return {count:Math.min(cookies.length,1024),reasons:[...reasons].slice(0,15)};
}
function safeResourceType(value){
 return RESOURCE_TYPES.has(value)?value:'Other';
}
function createCdpSessionMonitor({wsUrl,debugPort,emit,WebSocketImpl=globalThis.WebSocket}={}){
 validateLocalBrowserWebSocket(wsUrl,debugPort);
 if(typeof emit!=='function'||typeof WebSocketImpl!=='function')
   throw Error('CDP_MONITOR_DEPENDENCIES_UNAVAILABLE');
 let socket=null,nextId=0,live=true,closed=false,eventsSent=0;
 const pending=new Map(),sessions=new Set(),requests=new Map();
 const sendRow=row=>{
   if(!live||eventsSent>=MAX_EVENTS)return;
   eventsSent++;
   try{emit(row);}catch{/* observer must not alter the browser */ }
 };
 function send(method,params={},sessionId){
   if(!live||socket?.readyState!==1)return Promise.reject(Error('CDP_NOT_CONNECTED'));
   const id=++nextId;
   return new Promise((resolve,reject)=>{
     const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP_TIMEOUT'))},MAX_COMMAND_MS);
     timer.unref?.();
     pending.set(id,{resolve:result=>{clearTimeout(timer);resolve(result)},
       reject:error=>{clearTimeout(timer);reject(error)}});
     try{socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));}
     catch{pending.delete(id);clearTimeout(timer);reject(Error('CDP_SEND_FAILED'));}
   });
 }
 function findRequest(msg){
   const id=msg.params?.requestId;
   if(typeof id!=='string'||id.length>128||typeof msg.sessionId!=='string')return null;
   return requests.get(msg.sessionId+':'+id)||null;
 }
 function recordRequest(msg){
   const p=msg.params||{},url=safeHost(p.request?.url);
   if(!url||typeof msg.sessionId!=='string'||!sessions.has(msg.sessionId))return;
   const action=String(p.request?.method||'').toUpperCase();
   if(!['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(action))return;
   const id=p.requestId;
   if(typeof id!=='string'||id.length>128)return;
   const key=msg.sessionId+':'+id;
   if(requests.size>=MAX_REQUESTS)requests.delete(requests.keys().next().value);
   const prior=requests.get(key);
   if(prior&&p.redirectResponse){
     const status=safeNumber(p.redirectResponse.status,599);
     sendRow({kind:'chromium',phase:'redirect',requestId:prior.requestId,
       method:prior.method,browserHost:prior.browserHost,
       routeTemplate:prior.routeTemplate,endpointArea:prior.endpointArea,
       ...(status>=300&&status<=399?{status,responseClass:'3xx'}:{}),
       sessionMapping:'openapi_verified'});
   }
   const item={requestId:crypto.randomUUID(),started:performance.now(),
     ...url,method:action,resourceType:safeResourceType(p.type)};
   requests.set(key,item);
   sendRow({kind:'chromium',phase:'request',...item,sessionMapping:'openapi_verified'});
 }
 function receive(raw){
   if(!live)return;
   let msg;
   try{msg=JSON.parse(String(raw));}catch{return;}
   if(typeof msg.id==='number'){
     const op=pending.get(msg.id);
     if(op){pending.delete(msg.id);msg.error?op.reject(Error('CDP_COMMAND_REJECTED')):op.resolve(msg.result||{});}
     return;
   }
   if(typeof msg.method!=='string'||!msg.params)return;
   if(msg.method==='Target.attachedToTarget'){
     void initializeTarget(msg.params.sessionId,msg.params.targetInfo).catch(()=>{});
     return;
   }
   if(msg.method==='Target.detachedFromTarget'){
     if(typeof msg.params.sessionId==='string')sessions.delete(msg.params.sessionId);
     return;
   }
   if(typeof msg.sessionId!=='string'||!sessions.has(msg.sessionId))return;
   const p=msg.params;
   if(msg.method==='Network.requestWillBeSent'){recordRequest(msg);return;}
   const item=findRequest(msg);
   if(!item)return;
   const core={kind:'chromium',requestId:item.requestId,method:item.method,
     browserHost:item.browserHost,routeTemplate:item.routeTemplate,
     transportProtocol:item.transportProtocol,resourceType:item.resourceType,
     routeDepth:item.routeDepth,routeMaskedSegments:item.routeMaskedSegments,
     endpointArea:item.endpointArea,queryKeyNames:item.queryKeyNames,
     sessionMapping:'openapi_verified'};
   if(msg.method==='Network.responseReceived'){
     const response=p.response||{},status=safeNumber(response.status,599);
     sendRow({...core,phase:'response',
       ...(status>=100?{status,responseClass:statusClass(status)}:{ }),
       mediaType:safeMime(response.mimeType),
       httpProtocol:safeHttpProtocol(response.protocol),
       servedFromCache:response.fromDiskCache===true,
       servedFromServiceWorker:response.fromServiceWorker===true,
       durationMs:Math.min(3600000,Math.max(0,Math.round(performance.now()-item.started))),
       ...(typeof response.remoteIPAddress==='string'&&net.isIP(response.remoteIPAddress)?
         {peerIp:response.remoteIPAddress}:{}),
       ...(safeNumber(response.remotePort,65535)>0?{peerPort:response.remotePort}:{})});
     return;
   }
   if(msg.method==='Network.responseReceivedExtraInfo'){
     // Inspect header NAMES only, never response.headers values.
     const headerNames=Object.keys(p.headers||{});
     const cookieSetAttempt=headerNames.some(name=>name.toLowerCase()==='set-cookie');
     const blocked=safeReasons(p.blockedCookies);
     if(cookieSetAttempt||blocked.count){
       sendRow({...core,phase:'cookie_response',cookieSetAttempt,
         blockedCookieCount:blocked.count,cookieBlockedReasons:blocked.reasons});
     }
     return;
   }
   if(msg.method==='Network.requestWillBeSentExtraInfo'){
     // associatedCookies elements contain actual cookie values: never read them.
     const associated=Array.isArray(p.associatedCookies)?p.associatedCookies:[];
     let sent=0,blocked=0;const reasons=new Set();
     for(const entry of associated.slice(0,256)){
       const blocks=Array.isArray(entry?.blockedReasons)?entry.blockedReasons:[];
       if(blocks.length){
         blocked++;
         for(const r of blocks)reasons.add(BLOCKED_REASONS.has(r)?r:'Other');
       }else sent++;
     }
     if(associated.length)sendRow({...core,phase:'cookie_request',
       sentCookieCount:sent,blockedCookieCount:blocked,
       cookieBlockedReasons:[...reasons].slice(0,15)});
     return;
   }
   if(msg.method==='Network.loadingFinished'||msg.method==='Network.loadingFailed'){
     requests.delete(msg.sessionId+':'+p.requestId);
     sendRow({...core,phase:msg.method==='Network.loadingFinished'?'finish':'fail',
       durationMs:Math.min(3600000,Math.max(0,Math.round(performance.now()-item.started))),
       ...(msg.method==='Network.loadingFinished'?
         { ...(safeNumber(p.encodedDataLength)!==undefined?{encodedBytes:p.encodedDataLength}:{})}:
         {failureKind:p.blockedReason?'blocked':'network_or_cancelled'})});
   }
 }
 async function initializeTarget(sessionId,info){
   if(!live||typeof sessionId!=='string'||sessions.has(sessionId)||
      !['page','iframe'].includes(info?.type))return;
   sessions.add(sessionId);
   try{
     await send('Network.enable',{maxTotalBufferSize:8*1024*1024},sessionId);
     sendRow({kind:'chromium',phase:'target',targetType:info.type,sessionMapping:'openapi_verified'});
     await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:false,
       flatten:true},sessionId).catch(()=>{});
   }catch{sessions.delete(sessionId);}
 }
 async function start(){
   if(socket)throw Error('CDP_ALREADY_STARTED');
   socket=new WebSocketImpl(wsUrl);
   await new Promise((resolve,reject)=>{
     let finished=false;
     const timer=setTimeout(()=>{if(!finished){finished=true;reject(Error('CDP_CONNECTION_TIMEOUT'))}},8000);
     timer.unref?.();
     socket.addEventListener('open',()=>{if(!finished){finished=true;clearTimeout(timer);resolve();}},{once:true});
     socket.addEventListener('error',()=>{if(!finished){finished=true;clearTimeout(timer);reject(Error('CDP_CONNECTION_FAILED'));}},{once:true});
     socket.addEventListener('message',ev=>receive(ev.data));
   });
   if(!live)return;
   await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:false,flatten:true});
   const all=await send('Target.getTargets');
   for(const t of Array.isArray(all.targetInfos)?all.targetInfos:[]){
     if(t.type!=='page'||typeof t.targetId!=='string')continue;
     try{
       const attached=await send('Target.attachToTarget',{targetId:t.targetId,flatten:true});
       await initializeTarget(attached.sessionId,t);
     }catch{/* one page failing must not block the others */}
   }
 }
 async function stop(){
   if(closed)return;
   closed=true;live=false;
   for(const op of pending.values())op.reject(Error('CDP_MONITOR_STOPPED'));
   pending.clear();requests.clear();sessions.clear();
   if(socket)try{socket.close();}catch{}
 }
 return Object.freeze({start,stop,receive});
}
/**
 * Runtime configuration is opt-in. Secrets stay in the environment and are
 * never copied to events, panel or logs. No API key => no CDP attachment.
 */
// Public finite-state explanation; never emit environment or API key values.
function diagnosticConfig(config={}){
 if(config.DILOAKPRO_DIAG_CDP_ENABLE!=='1')
   return {enabled:false,issue:'disabled_by_default'};
 const portText=String(config.DILOAKPRO_DIAG_API_PORT||'');
 if(!portText)return {enabled:false,issue:'missing_api_port'};
 const port=Number(portText);
 if(!/^\d{4,5}$/.test(portText)||!Number.isInteger(port)||
   port<1024||port>65535)return {enabled:false,issue:'invalid_api_port'};
 if(typeof config.DICLOAK_LOCAL_API_KEY!=='string'||
   config.DICLOAK_LOCAL_API_KEY.length<12)
   return {enabled:false,issue:'missing_api_key'};
 return {enabled:true,port,issue:'none'};
}
function safeApiProblem(error){
 const msg=String(error?.message||'');
 if(/_HTTP_401|_HTTP_403/.test(msg))return 'api_access_denied';
 if(/_HTTP_404|LOCAL_API_ENDPOINT_INVALID/.test(msg))return 'api_endpoint_unsupported';
 if(/DICLOAK_RUNTIME_PROFILE_MISMATCH|LOCAL_API_PROFILE_ID_MISMATCH/.test(msg))
   return 'api_profile_mismatch';
 if(/LOCAL_API_KEY_MISSING|START_REJECTED/.test(msg))return 'api_access_denied';
 if(/ECONNREFUSED|ECONNRESET|ETIMEDOUT|TIMEOUT|EHOSTUNREACH/.test(msg))
   return 'api_unreachable';
 return 'api_response_unavailable';
}
function startVerifiedBrowserNetwork({
  profileId,emit,
  config=process.env,
  getSession=getRunningTestProfile,
  discover=findBrowserWebSocket,
  createSession=createCdpSessionMonitor,
  retryCount=12,retryMs=1200
}={}){
 if(typeof profileId!=='string'||typeof emit!=='function')
   throw TypeError('BROWSER_MONITOR_CONFIG_INVALID');
 let live=true,session=null;
 const safeSend=row=>{if(live)try{emit(row);}catch{}};
 const setup=diagnosticConfig(config);
 async function begin(){
   if(!setup.enabled){
     safeSend({kind:'chromium',phase:'status',monitorStatus:'not_configured',
       monitorIssue:setup.issue});
     return;
   }
   safeSend({kind:'chromium',phase:'status',monitorStatus:'resolving',
     monitorIssue:'none'});
   let status=null,reason='api_response_unavailable';
   for(let i=0;i<retryCount&&live;i++){
     try{
       status=await getSession({apiPort:setup.port,
         apiKey:config.DICLOAK_LOCAL_API_KEY,profileId});
       if(status)break;
       reason='api_session_not_running';
     }catch(error){
       reason=safeApiProblem(error);
       if(['api_access_denied','api_endpoint_unsupported','api_profile_mismatch'].includes(reason))
         break;
     }
     if(i+1<retryCount)await new Promise(resolve=>{
       const timer=setTimeout(resolve,retryMs);timer.unref?.();
     });
   }
   if(!live)return;
   if(!status||status.sessionIdentityVerifiedByOpenAPI!==true||
      status.profileId!==profileId){
     if(status)reason='api_profile_mismatch';
     safeSend({kind:'chromium',phase:'status',monitorStatus:'unavailable',
       monitorIssue:reason});
     return;
   }
   safeSend({kind:'chromium',phase:'status',monitorStatus:'verified',
     monitorIssue:'none'});
   try{
     const ws=status.webSocketUrl||await discover(status.debugPort);
     if(!live)return;
     validateLocalBrowserWebSocket(ws,status.debugPort);
     session=createSession({wsUrl:ws,debugPort:status.debugPort,emit:safeSend});
     await session.start();
     if(!live){await session.stop();return;}
     safeSend({kind:'chromium',phase:'status',monitorStatus:'active',
       monitorIssue:'none'});
   }catch(error){
     let issue='cdp_connection_unavailable';
     if(/CDP_MONITOR_DEPENDENCIES_UNAVAILABLE/.test(String(error?.message||'')))
       issue='cdp_transport_missing';
     else if(/BROWSER_DEBUG_URL/.test(String(error?.message||'')))
       issue='cdp_ws_invalid';
     if(live)safeSend({kind:'chromium',phase:'status',monitorStatus:'unavailable',
       monitorIssue:issue});
     if(session)await session.stop().catch(()=>{});
   }
 }
 void begin().catch(()=>{
   if(live)safeSend({kind:'chromium',phase:'status',monitorStatus:'unavailable',
     monitorIssue:'api_response_unavailable'});
 });
 return ()=>{
   live=false;
   if(session)void session.stop().catch(()=>{});
 };
}
module.exports={safeHost,safeReasons,diagnosticConfig,safeApiProblem,createCdpSessionMonitor,startVerifiedBrowserNetwork};

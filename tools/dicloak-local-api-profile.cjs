'use strict';

/**
 * Native-local DICloak OpenAPI client. API Key is local process-only.
 * Neither profile credentials nor browser cookie jars are requested.
 * Supported documented start endpoints:
 * V1 PATCH /openapi/v1/env/:id/open
 * V2 POST /openapi/v2/profiles/:id/start
 */
const http=require('node:http');
const {validateProfileId}=require('./almacen-perfil-readonly.js');
const LIMIT=128*1024;

function apiBase(port) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error('DICLOAK_API_PORT_INVALID');
  return 'http://127.0.0.1:'+port;
}
function validDebugPort(port) {
  const n=Number(port);
  if (!Number.isInteger(n)||n<1024||n>65535)
    throw new Error('DICLOAK_DEBUG_PORT_UNAVAILABLE');
  return n;
}
function validateLocalBrowserWebSocket(value,expectedPort) {
  if(typeof value!=='string')throw new Error('BROWSER_DEBUG_URL_INVALID');
  let url;
  try{url=new URL(value)}catch{throw new Error('BROWSER_DEBUG_URL_INVALID')}
  if(url.protocol!=='ws:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||
     Number(url.port)!==validDebugPort(expectedPort)||url.username||url.password||
     !url.pathname.startsWith('/devtools/browser/')||url.search||url.hash)
    throw new Error('BROWSER_DEBUG_URL_NOT_LOCAL');
  return value;
}
function requestJson({apiPort,apiKey,method,path,body,onDiagnostic=()=>{}}) {
  const base=apiBase(apiPort);
  if(typeof apiKey!=='string'||apiKey.length<12||apiKey.includes('\r')||apiKey.includes('\n'))
    return Promise.reject(new Error('LOCAL_API_KEY_MISSING'));
  if(!['GET','PATCH','POST'].includes(method)||!/^\/openapi\/v[12]\/[A-Za-z0-9/_-]+$/.test(path))
    return Promise.reject(new Error('LOCAL_API_ENDPOINT_INVALID'));
  const bytes=body===undefined?null:Buffer.from(JSON.stringify(body));
  const emit=(event,extra={})=>{try{onDiagnostic({source:'programa',event,...extra})}catch{/* audit cannot interrupt API */}};
  emit('api_request');
  return new Promise((resolve,reject)=>{
    let settled=false;
    const fail=e=>{if(!settled){settled=true;reject(e)}};
    const req=http.request(base+path,{
      method,timeout:15000,
      headers:{
        'X-API-KEY':apiKey,
        'Accept':'application/json',
        ...(bytes?{'Content-Type':'application/json','Content-Length':String(bytes.length)}:{})
      }
    },resp=>{
      emit('api_response',{status:resp.statusCode});
      if(resp.statusCode!==200){resp.resume();return fail(new Error('DICLOAK_LOCAL_API_HTTP_'+resp.statusCode))}
      const chunks=[];let size=0;
      resp.on('data',x=>{size+=x.length;if(size>LIMIT){fail(new Error('DICLOAK_LOCAL_API_RESPONSE_TOO_LARGE'));req.destroy()}else chunks.push(x)});
      resp.once('error',fail);
      resp.once('end',()=>{
        if(settled)return;
        try{
          const json=JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if(json.code!==0||!json.data||typeof json.data!=='object')
            throw Error('DICLOAK_LOCAL_API_START_REJECTED');
          settled=true;resolve(json.data);
        }catch(e){fail(e)}
      });
    });
    req.once('error',fail);
    req.once('timeout',()=>req.destroy(new Error('DICLOAK_LOCAL_API_TIMEOUT')));
    req.end(bytes);
  });
}
async function startTestProfile({apiPort,apiKey,profileId,version='v1',onDiagnostic=()=>{}}) {
  validateProfileId(profileId);
  if(!['v1','v2'].includes(version))throw Error('DICLOAK_LOCAL_API_VERSION_INVALID');
  const method=version==='v2'?'POST':'PATCH';
  const resource=version==='v2'?'/openapi/v2/profiles/'+profileId+'/start':
    '/openapi/v1/env/'+profileId+'/open';
  // Do not bypass vendor proxy checks, sync settings, cookies or extension sync.
  const body=version==='v2'?{headless:false}:undefined;
  const data=await requestJson({apiPort,apiKey,method,path:resource,body,onDiagnostic});
  if(data.id!==undefined&&String(data.id)!==profileId)
    throw Error('LOCAL_API_PROFILE_ID_MISMATCH');
  const debugPort=validDebugPort(data.debug_port);
  if(data.web_socket_url)validateLocalBrowserWebSocket(data.web_socket_url,debugPort);
  return Object.freeze({
    profileId,
    debugPort,
    webSocketUrl:data.web_socket_url||null,
    // PID may help troubleshoot but is not a security identity token.
    profileStartedByOpenAPI:true
  });
}
async function getRunningTestProfile({apiPort,apiKey,profileId,onDiagnostic=()=>{}}) {
  validateProfileId(profileId);
  // V2 runtime endpoint returns the exact profile_id and its live debug port.
  // Unlike 'start', this request DOES NOT launch, close or alter the browser.
  const data=await requestJson({
    apiPort,apiKey,method:'GET',
    path:'/openapi/v2/profiles/'+profileId+'/session',onDiagnostic
  });
  if(String(data.profile_id)!==profileId)throw Error('DICLOAK_RUNTIME_PROFILE_MISMATCH');
  if(data.status!=='running')return null;
  const debugPort=validDebugPort(data.debug_port);
  if(data.web_socket_url)validateLocalBrowserWebSocket(data.web_socket_url,debugPort);
  return Object.freeze({
    profileId,debugPort,webSocketUrl:data.web_socket_url||null,
    profileStartedByOpenAPI:false,
    sessionIdentityVerifiedByOpenAPI:true
  });
}
async function waitForRunningTestProfile({
  apiPort,apiKey,profileId,waitSeconds=75,pollMs=1500,onDiagnostic=()=>{}
}) {
  if(!Number.isInteger(waitSeconds)||waitSeconds<1||waitSeconds>300 ||
     !Number.isInteger(pollMs)||pollMs<200||pollMs>15000)
    throw Error('DICLOAK_SESSION_POLL_CONFIG_INVALID');
  const attempts=Math.max(1,Math.ceil(waitSeconds*1000/pollMs));
  for(let i=0;i<attempts;i++){
    const result=await getRunningTestProfile({apiPort,apiKey,profileId,onDiagnostic});
    if(result)return result;
    if(i<attempts-1)await new Promise(resolve=>setTimeout(resolve,pollMs));
  }
  throw Error('DICLOAK_PROFILE_DID_NOT_START');
}

async function findBrowserWebSocket(debugPort) {
  validDebugPort(debugPort);
  const data=await new Promise((resolve,reject)=>{
    const req=http.get('http://127.0.0.1:'+debugPort+'/json/version',{
      timeout:5000,headers:{Accept:'application/json'}
    },res=>{
      if(res.statusCode!==200){res.resume();return reject(Error('CDP_DISCOVERY_FAILED'))}
      const list=[];let bytes=0;
      res.on('data',chunk=>{bytes+=chunk.length;if(bytes>LIMIT){req.destroy(Error('CDP_DISCOVERY_TOO_LARGE'))}else list.push(chunk)});
      res.once('end',()=>{try{resolve(JSON.parse(Buffer.concat(list).toString('utf8')))}catch{reject(Error('CDP_DISCOVERY_INVALID_JSON'))}});
      res.once('error',reject);
    });
    req.once('timeout',()=>req.destroy(Error('CDP_DISCOVERY_TIMEOUT')));
    req.once('error',reject);
  });
  const ws=data.webSocketDebuggerUrl;
  return validateLocalBrowserWebSocket(ws,debugPort);
}
module.exports={apiBase,validDebugPort,requestJson,startTestProfile,getRunningTestProfile,waitForRunningTestProfile,validateLocalBrowserWebSocket,findBrowserWebSocket};

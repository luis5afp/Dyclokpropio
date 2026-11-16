'use strict';

/**
 * Consent-only Chromium CDP document receiver.
 * The ONLY inspected response bodies come from an explicitly permitted test
 * server path. Nonmatching response events are discarded, never exported.
 * Does NOT read request headers, Set-Cookie, authentication material,
 * cookie stores, password databases, or proxy configuration.
 *
 * CDP returns a post-processing representation, not necessarily the exact
 * compressed HTTP wire bytes. Use server-side hashes to prove equality.
 */
const path=require('node:path');
const {createProfileTestReceiver}=require('./almacen-profile-test-receiver.cjs');
const {validateLocalBrowserWebSocket}=require('./dicloak-local-api-profile.cjs');
const MAX_RESPONSE_BYTES=32*1024*1024;

function validateDocumentName(responseUrl){
  const u=new URL(responseUrl);
  const segment=u.pathname.split('/').pop();
  if(!segment||segment.length>180)throw Error('DOCUMENT_NAME_UNSAFE');
  const text=decodeURIComponent(segment);
  if(!/^[\p{L}\p{N}][\p{L}\p{N} ._()-]{0,179}$/u.test(text)||
     /[. ]$/u.test(text)|| text==='.'||text==='..')throw Error('DOCUMENT_NAME_UNSAFE');
  return text;
}
function decodeCdpBody(result){
  if(!result||typeof result.body!=='string'||typeof result.base64Encoded!=='boolean')
    throw Error('CDP_BODY_MISSING');
  if(result.body.length>MAX_RESPONSE_BYTES*2)throw Error('CDP_RESPONSE_TOO_LARGE');
  if(result.base64Encoded){
    if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(result.body))
      throw Error('CDP_INVALID_BASE64');
    const bytes=Buffer.from(result.body,'base64');
    if(bytes.length>MAX_RESPONSE_BYTES)throw Error('CDP_RESPONSE_TOO_LARGE');
    return bytes;
  }
  const bytes=Buffer.from(result.body,'utf8');
  if(bytes.length>MAX_RESPONSE_BYTES)throw Error('CDP_RESPONSE_TOO_LARGE');
  return bytes;
}
function createAllowedCdpRecorder({profileId,debugPort,wsUrl,rootFolder,testEndpointPrefix,WebSocketImpl=globalThis.WebSocket}){
  validateLocalBrowserWebSocket(wsUrl,debugPort);
  if(typeof WebSocketImpl!=='function')throw Error('NODE_22_WEBSOCKET_REQUIRED');
  const receiver=createProfileTestReceiver({rootFolder,testEndpointPrefix});
  const nativeSession=Object.freeze({kind:'local-openapi-vetted-chromium-session'});
  receiver.bindNativeSession(nativeSession,profileId);
  const accepted=receiver.scope;
  const pending=new Map();
  const requests=new Map();
  const pendingWrites=new Set();
  const stats={saved:0,failed:0,ignored:0,received:0};
  let socket=null,nextId=0;

  function send(method,params={},sessionId){
    if(!socket||socket.readyState!==1)return Promise.reject(Error('CDP_NOT_CONNECTED'));
    const id=++nextId;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP_COMMAND_TIMEOUT'))},10000);
      pending.set(id,{resolve:x=>{clearTimeout(timer);resolve(x)},reject:e=>{clearTimeout(timer);reject(e)}});
      socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
    });
  }
  async function recordResponse(message){
    const key=message.sessionId+':'+message.params.requestId;
    const item=requests.get(key);
    if(!item)return;
    requests.delete(key);
    try {
      const result=await send('Network.getResponseBody',{requestId:message.params.requestId},message.sessionId);
      const bytes=decodeCdpBody(result);
      // Only allowed test documents reach the persistence API.
      await receiver.recordDocument({
        nativeSession,responseUrl:item.url,
        originalName:item.filename,bodyBytes:bytes
      });
      stats.saved++;
    }catch {stats.failed++}
  }
  async function receive(raw){
    let msg;try{msg=JSON.parse(String(raw))}catch{return}
    if(typeof msg.id==='number'){
      const op=pending.get(msg.id);
      if(op){pending.delete(msg.id);msg.error?op.reject(Error('CDP_COMMAND_REJECTED')):op.resolve(msg.result)}
      return;
    }
    if(!msg.method||!msg.params)return;
    if(msg.method==='Target.attachedToTarget'){
      const {sessionId,targetInfo}=msg.params;
      if(!sessionId || !['page','iframe'].includes(targetInfo?.type))return;
      try{await send('Network.enable',{maxTotalBufferSize:64*1024*1024},sessionId)}
      catch{stats.failed++}
      return;
    }
    if(msg.method==='Network.responseReceived'){
      stats.received++;
      const response=msg.params.response;
      if(!msg.sessionId || !response || response.status!==200 ||
         !isApproved(response.url,accepted)){stats.ignored++;return}
      let filename;
      try{filename=validateDocumentName(response.url)}
      catch{stats.ignored++;return}
      const mime=String(response.mimeType||'').toLowerCase();
      // No HTML or javascript, which may contain session-related secrets.
      if(/(?:html|javascript)/.test(mime)){stats.ignored++;return}
      requests.set(msg.sessionId+':'+msg.params.requestId,{filename,url:response.url});
      return;
    }
    if(msg.method==='Network.loadingFinished'&&msg.sessionId){
      const key=msg.sessionId+':'+msg.params.requestId;
      if(!requests.has(key))return;
      const promise=recordResponse(msg);
      pendingWrites.add(promise);promise.finally(()=>pendingWrites.delete(promise));
      return;
    }
    if(msg.method==='Network.loadingFailed'&&msg.sessionId){
      requests.delete(msg.sessionId+':'+msg.params.requestId);
    }
  }
  function isApproved(url,scope){
    let u;try{u=new URL(url)}catch{return false}
    return u.origin===scope.origin&&u.pathname.startsWith(scope.prefix)&&
      !u.username&&!u.password&&!u.search&&!u.hash;
  }
  async function start(){
    if(socket)throw Error('CDP_ALREADY_STARTED');
    socket=new WebSocketImpl(wsUrl);
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('CDP_CONNECTION_TIMEOUT')),10000);
      socket.addEventListener('open',()=>{clearTimeout(timer);resolve()},{once:true});
      socket.addEventListener('error',()=>{clearTimeout(timer);reject(Error('CDP_CONNECTION_FAILED'))},{once:true});
      socket.addEventListener('message',event=>{void receive(event.data).catch(()=>stats.failed++)});
    });
    await send('Target.setAutoAttach',{
      autoAttach:true,waitForDebuggerOnStart:false,flatten:true
    });
    return {ok:true,attachedToLocalBrowser:true,testScope:accepted.origin+accepted.prefix};
  }
  async function stop(){
    if(socket && socket.readyState===1)socket.close();
    await Promise.allSettled([...pendingWrites]);
    for(const op of pending.values())op.reject(Error('CDP_DISCONNECTED'));
    pending.clear();requests.clear();
    receiver.unbindNativeSession(nativeSession);
    return Object.freeze({...stats,changedNativeChromiumStorage:false,
      note:'Only allowlisted test document bodies; CDP may return decompressed bytes'});
  }
  return Object.freeze({start,stop,stats,receive});
}
module.exports={createAllowedCdpRecorder,validateDocumentName,decodeCdpBody};

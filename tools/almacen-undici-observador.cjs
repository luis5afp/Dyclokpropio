'use strict';
/**
 * Observes Node fetch/undici diagnostic-channel lifecycle only.
 * No request or response bodies, raw URLs, headers, cookies, tokens,
 * authentication material or profile identifiers are ever retained.
 * This is not Chromium network monitoring.
 */
const diagnostics=require('node:diagnostics_channel');
const {performance}=require('node:perf_hooks');
const crypto=require('node:crypto');
const {requestMetadata}=require('./almacen-observador-integrado.cjs');

const NAMES=Object.freeze([
  ['undici:request:create','request'],
  ['undici:request:headers','response'],
  ['undici:request:trailers','complete'],
  ['undici:request:error','error']
]);

function startUndiciTrace(emit){
  if(typeof emit!=='function')throw new TypeError('EMIT_REQUIRED');
  const tracked=new WeakMap();
  const subscriptions=[];
  let active=true;
  const publish=(data)=>{
    if(!active)return;
    try{emit(data);}catch{/* never interrupt the application's network */ }
  };
  function observe(phase,message){
    if(!active||!message||typeof message!=='object')return;
    const req=message.request;
    if(!req||typeof req!=='object')return;
    if(phase==='request'){
      let meta;
      try{
        const origin=new URL(String(req.origin||''));
        if(origin.protocol!=='http:'&&origin.protocol!=='https:')return;
        meta=requestMetadata([{method:req.method,hostname:origin.hostname,
          path:req.path||'/'}],origin.protocol);
      }catch{return;}
      if(!meta)return;
      const item={requestId:crypto.randomUUID(),started:performance.now(),
        meta,completed:false};
      tracked.set(req,item);
      publish({kind:'fetch',phase:'request',action:meta.action,
        scope:meta.scope,routeTemplate:meta.routeTemplate,
        requestId:item.requestId});
      return;
    }
    const item=tracked.get(req);
    if(!item||item.completed)return;
    if(phase==='response'){
      const status=message.response?.statusCode;
      publish({kind:'fetch',phase,action:item.meta.action,
        scope:item.meta.scope,routeTemplate:item.meta.routeTemplate,
        requestId:item.requestId,
        ...(Number.isInteger(status)&&status>=100&&status<=599?{status}:{ }),
        elapsedMs:Math.min(3600000,Math.max(0,
          Math.round(performance.now()-item.started)))});
    }else{
      item.completed=true;
      publish({kind:'fetch',phase,action:item.meta.action,
        scope:item.meta.scope,routeTemplate:item.meta.routeTemplate,
        requestId:item.requestId,elapsedMs:Math.min(3600000,Math.max(0,
          Math.round(performance.now()-item.started)))});
      tracked.delete(req);
    }
  }
  for(const [name,phase] of NAMES){
    const channel=diagnostics.channel(name);
    const handler=msg=>{try{observe(phase,msg);}catch{}};
    channel.subscribe(handler);
    subscriptions.push([channel,handler]);
  }
  return ()=>{
    if(!active)return;
    active=false;
    for(const [channel,handler] of subscriptions){
      try{channel.unsubscribe(handler);}catch{}
    }
  };
}
module.exports={startUndiciTrace};

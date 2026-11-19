'use strict';
/**
 * Temporal capture for a user-initiated profile opening. The IPC handler
 * starts the observer synchronously before the vendor's open callback runs.
 * This is NOT a verified mapping between network traffic and Chromium profile.
 * No row ID, credentials, cookies, proxy configuration or URLs are exported.
 */
const crypto=require('node:crypto');
const {mapNativeEvent}=require('./almacen-diagnostic-panel.cjs');
const {startCapture}=require('./almacen-observador-integrado.cjs');

const MAX_ACTIVE=6;
const MAX_RUNTIME_MS=120000;
const GRACE_MS=15000;

function createOpeningCaptureCoordinator({
  emitToProfile, startObserver=startCapture, getLabRoot=()=>undefined,
  graceMs=GRACE_MS, maxMs=MAX_RUNTIME_MS, pid=process.pid
}={}){
  if(typeof emitToProfile!=='function'||typeof startObserver!=='function')
    throw new TypeError('DIAGNOSTIC_CAPTURE_DEPENDENCY');
  if(!Number.isInteger(graceMs)||graceMs<1||graceMs>60000||
     !Number.isInteger(maxMs)||maxMs<graceMs||maxMs>300000)
    throw new TypeError('DIAGNOSTIC_CAPTURE_TIMEOUT');
  const active=new Map();
  let stopObserver=null,closed=false;

  function send(profileId,event){
    try{emitToProfile(profileId,event);}catch{/* never interrupt browser open */}
  }
  function finish(profileId,reason='completed'){
    const item=active.get(profileId);
    if(!item)return;
    if(item.timer)clearTimeout(item.timer);
    if(item.timeout)clearTimeout(item.timeout);
    active.delete(profileId);
    send(profileId,{source:'programa',at:new Date().toISOString(),event:'capture_finished',
      captureId:item.captureId,finishReason:reason});
    if(active.size===0&&stopObserver){
      const stop=stopObserver;stopObserver=null;
      try{stop();}catch{}
    }
  }
  function recordRaw(raw){
    const sanitized=mapNativeEvent(raw);
    if(!sanitized||active.size===0)return;
    // Network activity belongs to the Electron process, not a verified
    // profile. Concurrent opens are explicitly labelled ambiguous.
    const captureRelation=active.size===1?'temporal':'ambiguous';
    for(const [profileId,item] of active){
      send(profileId,{...sanitized,
        captureId:item.captureId,captureRelation});
    }
  }
  function arm(profileId){
    if(closed)return {ok:false,captureStarted:false,reason:'SHUTDOWN'};
    if(active.has(profileId))finish(profileId,'restarted');
    if(active.size>=MAX_ACTIVE)return {ok:false,captureStarted:false,
      reason:'CONCURRENT_LIMIT'};
    const captureId=crypto.randomUUID();
    active.set(profileId,{captureId,timer:null,timeout:null});
    if(!stopObserver){
      try{
        let root;
        try{root=getLabRoot();}catch{}
        const stop=startObserver({emit:recordRaw,pid,labRoot:root});
        if(typeof stop!=='function')throw Error('OBSERVER_STOP_MISSING');
        stopObserver=stop;
      }catch{
        active.delete(profileId);
        send(profileId,{source:'programa',at:new Date().toISOString(),event:'capture_unavailable'});
        return {ok:false,captureStarted:false,reason:'OBSERVER_UNAVAILABLE'};
      }
    }
    const item=active.get(profileId);
    item.timeout=setTimeout(()=>finish(profileId,'timeout'),maxMs);
    item.timeout.unref?.();
    send(profileId,{source:'programa',at:new Date().toISOString(),event:'capture_started',captureId,
      captureRelation:active.size===1?'temporal':'ambiguous'});
    return {ok:true,captureStarted:true,profileVerified:false,
      coverage:'node_http_and_windows_process_metadata'};
  }
  function stage(profileId,signal,stage){
    const item=active.get(profileId);
    if(!item)return;
    const ended=signal==='step_complete'&&stage==='stage_open_env';
    const failed=signal==='step_failed';
    if(!ended&&!failed)return;
    if(item.timer)clearTimeout(item.timer);
    item.timer=setTimeout(()=>finish(profileId,failed?'failed':'completed'),graceMs);
    item.timer.unref?.();
  }
  function shutdown(){
    if(closed)return;
    closed=true;
    for(const id of [...active.keys()])finish(id,'shutdown');
  }
  return Object.freeze({arm,stage,finish,shutdown,
    activeCount:()=>active.size});
}
module.exports={createOpeningCaptureCoordinator,MAX_RUNTIME_MS,GRACE_MS};
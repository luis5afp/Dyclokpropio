'use strict';

/**
 * Stable IPC binding for the exact ORIGINAL clear-dev-cache callback.
 *
 * The recovered Electron main bundle registers its own async
 * (event,{clearTypes,id,localDataConfig}) via ipcMain.handle(). Yet Windows
 * v30.0.11 reported IPC_NO_HANDLER during paramsMerge. Register one stable
 * early handle before the main runtime loads and capture the later ORIGINAL
 * callback (instead of allowing a temporary unregistered channel).
 *
 * Keep all native deletion rules, types, results and failures intact. An
 * absent native callback is an ERROR, never a fabricated success.
 * Electron 31 ipcMain has handle()/removeHandler(), but does NOT expose
 * hasHandler(); never require an undocumented method to register transport.
 *
 * No profile identifiers, file paths, cache flags or results are logged.
 */
const CHANNEL = 'clear-dev-cache';
const ORIGINAL_UNAVAILABLE = 'CACHE_ORIGINAL_HANDLER_NOT_REGISTERED';

function trustedMainWindow(event) {
  try {
    const u = new URL(event?.senderFrame?.url);
    return u.protocol === 'file:' && u.pathname.toLowerCase().endsWith('/dist/index.html');
  } catch { return false; }
}

function installCacheIpcCompatibility(ipcMain, {waitMs = 1800, onOriginalRegistered, onOriginalRemoved} = {}) {
  if (!ipcMain ||
    typeof ipcMain.handle !== 'function' ||
    typeof ipcMain.removeHandler !== 'function') {
    throw new TypeError('Electron ipcMain.handle/removeHandler required');
  }
  // hasHandler() is NOT part of the supported Electron 31 ipcMain API.
  // The optional probe helps test doubles that expose it, but production
  // installation must not depend on it (v30.0.12 silently skipped install).
  const checkNative = typeof ipcMain.hasHandler === 'function'
    ? ipcMain.hasHandler.bind(ipcMain) : null;
  if (checkNative && checkNative(CHANNEL)) {
    // Do not override an earlier native registration.
    return {status:()=>({hasHandler:true,originalRegistered:true,stableAdapter:false})};
  }
  const timeoutMs = Number.isFinite(waitMs) ? Math.max(0,Math.min(5000,waitMs)) : 1800;
  const nativeHandle = ipcMain.handle;
  const nativeRemoveHandler = ipcMain.removeHandler;
  let original = null;
  let releaseWait;
  let registration = new Promise(resolve=>{releaseWait=resolve;});
  let originalRegistrations = 0;

  // Register before loading the recovered original Electron entrypoint.
  // This is the ONLY transport shim; it never manipulates the profile data.
  nativeHandle.call(ipcMain,CHANNEL,async function forwardToOriginal(event,payload) {
    if(!trustedMainWindow(event))throw new Error('DYCLOK_CACHE_IPC_DENIED');
    if(!original){
      if(timeoutMs===0)throw new Error(ORIGINAL_UNAVAILABLE);
      let timer;
      try{
        await Promise.race([
          registration,
          new Promise((_,reject)=>{timer=setTimeout(
            ()=>reject(new Error(ORIGINAL_UNAVAILABLE)),timeoutMs);})
        ]);
      }finally{if(timer)clearTimeout(timer);}
    }
    const callback=original;
    if(typeof callback!=='function')throw new Error(ORIGINAL_UNAVAILABLE);
    return callback.call(this,event,payload);
  });

  ipcMain.handle=function interceptOriginalRegistration(channel,handler) {
    if(channel===CHANNEL){
      if(typeof handler!=='function')throw new TypeError('Original cache IPC callback must be a function');
      original=handler;
      originalRegistrations++;
      try { if(typeof onOriginalRegistered==='function') onOriginalRegistered(); } catch {}
      releaseWait();
      // Electron ipcMain.handle normally returns undefined.
      return undefined;
    }
    return nativeHandle.apply(this,arguments);
  };
  ipcMain.removeHandler=function trackOriginalUnregistration(channel) {
    if(channel===CHANNEL){
      // Honor original unregistration logically, while keeping the stable
      // IPC transport installed. Until the original registers again, the
      // router fails explicitly instead of clearing or claiming success.
      original=null;
      try { if(typeof onOriginalRemoved==='function') onOriginalRemoved(); } catch {}
      registration=new Promise(resolve=>{releaseWait=resolve;});
      return undefined;
    }
    return nativeRemoveHandler.apply(this,arguments);
  };
  return {
    status(){return {
      hasHandler:checkNative ? checkNative(CHANNEL) : true,
      originalRegistered:typeof original==='function',
      stableAdapter:true,originalRegistrations
    };}
  };
}
module.exports={CHANNEL,ORIGINAL_UNAVAILABLE,trustedMainWindow,installCacheIpcCompatibility};

'use strict';
/**
 * First-party test-server receiver, not a general browser interceptor.
 *
 * To be called from a trusted Chromium browser-session lifecycle adapter
 * after the vendor process supplies a REAL session identity (not row ID from
 * renderer IPC). It saves only opaque document bodies from explicitly allowed
 * test-server URL prefixes. Never copies request/response headers or cookies,
 * Authorization, browser password stores, proxy secrets or session databases.
 *
 * There is deliberately no automatic CDP connection, browser profile
 * discovery, nor unrestricted "log all traffic" feature in this module.
 */
const path=require('node:path');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const {archiveOriginalFile}=require('./almacen-original-files.js');
const {validateProfileId,isAbsoluteLocalFolder}=require('./almacen-perfil-readonly.js');
const MAX_BYTES=32*1024*1024;

function parseTestScope(raw) {
  if(typeof raw!=='string'||raw.length>2048)throw Error('TEST_ENDPOINT_NOT_CONFIGURED');
  let u;try{u=new URL(raw);}catch{throw Error('INVALID_TEST_ENDPOINT');}
  const loopback=['127.0.0.1','localhost','[::1]'].includes(u.hostname);
  if((u.protocol!=='https:'&&!(loopback&&u.protocol==='http:'))||
    u.username||u.password||u.search||u.hash||
    u.pathname==='/'||!u.pathname.endsWith('/'))throw Error('INVALID_TEST_ENDPOINT');
  return Object.freeze({origin:u.origin,prefix:u.pathname});
}
function isInScope(responseUrl,scope) {
  let u;try{u=new URL(responseUrl);}catch{return false;}
  return u.origin===scope.origin &&
    u.pathname.startsWith(scope.prefix)&&
    !u.username&&!u.password&&!u.search&&!u.hash;
}
function createProfileTestReceiver({rootFolder,testEndpointPrefix}) {
  if(!isAbsoluteLocalFolder(rootFolder))throw Error('INVALID_STORAGE_ROOT');
  const scope=parseTestScope(testEndpointPrefix);
  const assigned=new WeakMap();
  const boundIds=new Set();
  function bindNativeSession(nativeSession,profileId) {
    validateProfileId(profileId);
    if(!nativeSession||typeof nativeSession!=='object'||
       assigned.has(nativeSession)||boundIds.has(profileId))throw Error('INVALID_SESSION_BINDING');
    // Never allow an untrusted renderer to provide nativeSession.
    assigned.set(nativeSession,profileId);
    boundIds.add(profileId);
  }
  function getProfile(nativeSession) {
    const id=typeof nativeSession==='object'&&nativeSession!==null?
      assigned.get(nativeSession):undefined;
    if(!id)throw Error('UNVERIFIED_CHROMIUM_SESSION');
    return id;
  }
  async function recordDocument({nativeSession,responseUrl,originalName,bodyBytes}) {
    const profileId=getProfile(nativeSession);
    if(!isInScope(responseUrl,scope))throw Error('SERVER_OUTSIDE_TEST_SCOPE');
    if(!Buffer.isBuffer(bodyBytes)||bodyBytes.length>MAX_BYTES)throw Error('INVALID_RESPONSE_BODY');
    // A real browser adapter must call this for explicitly approved test
    // download events. It must never forward cookies or auth headers.
    await fs.mkdir(rootFolder,{recursive:true,mode:0o700});
    const rootStat=await fs.lstat(rootFolder);
    if(!rootStat.isDirectory()||rootStat.isSymbolicLink())throw Error('UNSAFE_STORAGE_ROOT');
    const saved=await archiveOriginalFile({
      rootFolder,profileId,eventId:crypto.randomUUID(),originalName,payload:bodyBytes
    });
    return Object.freeze({
      ok:true,profileId,originalName,
      byteLength:saved.byteLength,sha256:saved.sha256,
      unchanged:true,transport:'preapproved test document body',
      scope:scope.origin+scope.prefix
    });
  }
  function unbindNativeSession(nativeSession) {
    const id=getProfile(nativeSession);
    boundIds.delete(id);
    assigned.delete(nativeSession);
  }
  return Object.freeze({bindNativeSession,recordDocument,unbindNativeSession,scope});
}
module.exports={createProfileTestReceiver,parseTestScope,isInScope,MAX_BYTES};

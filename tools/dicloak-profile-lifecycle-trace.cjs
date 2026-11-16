'use strict';

/**
 * Trace only lifecycle states of an explicitly selected DICloak test profile.
 * Never log URL, response body, request headers, cookies, usernames, passwords,
 * proxy credentials, API keys or browser debugging WebSocket addresses.
 */
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const {validateProfileId,isAbsoluteLocalFolder}=
  require('./almacen-perfil-readonly.js');

const EVENTS=new Set([
  'monitor_created','waiting_for_profile','profile_running',
  'debugger_connected','test_receiver_ready',
  'test_capture_finished','profile_stopped','monitor_error'
]);
const REASONS=new Set([
  'API_UNAVAILABLE','SESSION_NOT_RUNNING','SESSION_ID_MISMATCH',
  'DEBUGGER_UNAVAILABLE','NO_AUTHORIZED_DOCUMENTS','DOCUMENTS_SAVED',
  'CAPTURE_ERRORS','UNKNOWN_ERROR'
]);
const MAX_EVENTS=128;
function createProfileLifecycleTrace({profileId,rootFolder,clock=()=>new Date()}) {
  validateProfileId(profileId);
  if(!isAbsoluteLocalFolder(rootFolder))throw Error('INVALID_STORAGE_ROOT');
  const timeline=[];
  const started=clock().toISOString();
  function mark(event,reason=null){
    if(!EVENTS.has(event))throw Error('UNSAFE_DIAGNOSTIC_EVENT');
    if(reason!==null&&!REASONS.has(reason))throw Error('UNSAFE_DIAGNOSTIC_REASON');
    if(timeline.length>=MAX_EVENTS)throw Error('DIAGNOSTIC_EVENT_LIMIT');
    timeline.push(Object.freeze({event,reason,at:clock().toISOString()}));
  }
  async function finish({recording=null}={}){
    const safeRecording={};
    for(const k of ['saved','failed','ignored','received','approved','attachedTargets','enabledTargets']){
      const val=recording?.[k];
      if(val===undefined)continue;
      if(!Number.isSafeInteger(val)||val<0)throw Error('UNSAFE_DIAGNOSTIC_COUNTER');
      safeRecording[k]=val;
    }
    const report={
      schemaVersion:1,
      kind:'test-profile-lifecycle-diagnostics',
      profileId,
      createdAt:started,
      events:timeline,
      captureScope:'operator-approved-test-documents-only',
      cookiesOrCredentialsExported:false,
      remoteServerVerified:false,
      fullTrafficCaptured:false,
      status:'LOCAL_RUNTIME_ONLY',
      recording:safeRecording
    };
    const folder=path.join(rootFolder,profileId,'diagnosticos');
    await fs.mkdir(folder,{recursive:true,mode:0o700});
    const stat=await fs.lstat(folder);
    if(!stat.isDirectory()||stat.isSymbolicLink())throw Error('UNSAFE_DIAGNOSTIC_FOLDER');
    const output=path.join(folder,Date.now()+'-'+crypto.randomUUID()+'.json');
    await fs.writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
    return Object.freeze({saved:true,output,report});
  }
  return Object.freeze({mark,finish,timeline});
}
module.exports={createProfileLifecycleTrace,EVENTS,REASONS};

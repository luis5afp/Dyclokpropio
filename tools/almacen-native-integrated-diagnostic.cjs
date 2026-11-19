'use strict';
/**
 * Embedded DICloak 3.0.7 profile-opening diagnostic.
 * This records the first-party Vue renderer's opening lifecycle
 * callbacks plus sanitized metadata from selected Node network transports.
 * It does NOT control authentication or inspect Chromium's private traffic.
 *
 * The renderer's row id is NOT proof of Chromium session identity. Any future
 * network data must be joined using a verified native Chromium session, not
 * the row id alone. Never record response bodies, headers, cookies, tokens,
 * credentials, proxy configuration, URLs or native Chromium databases.
 */
const {validateProfileId}=require('./almacen-perfil-readonly.js');
const {senderIsApp}=require('./almacen-native-chromium-audit.cjs');
const {startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const {startCapture}=require('./almacen-observador-integrado.cjs');
const {createOpeningCaptureCoordinator}=require('./almacen-captura-temprana.cjs');

const SHOW_CHANNEL='almacen-diag:show';
const EVENT_CHANNEL='almacen-diag:event';
const SIGNALS=new Set(['open_requested','step_start','step_complete','step_failed']);
const MAX_PER_PROFILE=850;
const MAX_PROFILES=32;

const STAGES=new Map([
  ['PRE_DATA_INJECT','stage_pre_data_inject'],
  ['PRE_CHECK','stage_pre_check'],
  ['CHOOSE_KERNEL','stage_choose_kernel'],
  ['PRE_PROXY_CHECK','stage_pre_proxy_check'],
  ['CATCH_ERROR','stage_catch_error'],
  ['POLYFILL_ROW_DATA','stage_polyfill_row_data'],
  ['RPA_PRE_INJECT','stage_rpa_pre_inject'],
  ['LOCK_ENV_RPA','stage_lock_env_rpa'],
  ['MERGE_ENV_PARAMS_RPA','stage_merge_env_params_rpa'],
  ['FETCH_ENV_INFO','stage_fetch_env_info'],
  ['PROXY_CHECK','stage_proxy_check'],
  ['PROXY_CHECK_RESULT','stage_proxy_check_result'],
  ['EXPAND_CHECK','stage_expand_check'],
  ['PARAMS_MERGE','stage_params_merge'],
  ['LOCK_ENV','stage_lock_env'],
  ['OPEN_ENV','stage_open_env'],
  ['COOKIE_ENCRYPT_PLAN','stage_cookie_encrypt_plan'],
  ['TIMEOUT','stage_timeout'],
  ['BACKEND_DATA_FETCH','stage_backend_data_fetch'],
  ['DATA_SYNC_START','stage_data_sync_start'],
  ['LOCALSTORAGE_DOWNLOAD','stage_localstorage_download'],
  ['LOCALSTORAGE_EXTRACT','stage_localstorage_extract'],
  ['LOCALSTORAGE_SYNC','stage_localstorage_sync'],
  ['INDEXEDDB_DOWNLOAD','stage_indexeddb_download'],
  ['INDEXEDDB_EXTRACT','stage_indexeddb_extract'],
  ['INDEXEDDB_SYNC','stage_indexeddb_sync'],
  ['EXTENSION_EXTRACT','stage_extension_extract'],
  ['EXTENSION_DOWNLOAD','stage_extension_download'],
  ['BROWSER_START','stage_browser_start']
]);
function safeStage(value) {
  if(typeof value!=='string'||value.length>80)return 'stage_unknown';
  const code=value.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  return STAGES.get(code)||'stage_unknown';
}
function safeEvent(signal,phase) {
  if(!SIGNALS.has(signal))throw Error('DIAG_INVALID_SIGNAL');
  let event;
  if(signal==='open_requested')event='operation_open_requested';
  else if(signal==='step_failed')event='operation_step_failed';
  else if(signal==='step_complete')event='operation_step_completed';
  else event=safeStage(phase);
  // Keep the stage of a completed/failed operation, not only a generic
  // "completed" event. It is a fixed whitelist label, not raw vendor text.
  const stage=signal==='step_failed'||signal==='step_complete'?
    safeStage(phase):undefined;
  // Vendor stepType values may not be present in this renderer's enum.
  // Keep only a bounded integer code for unknown stages so we can map
  // it later without logging sensitive native values or message contents.
  const isUnknown=signal==='step_start'&&event==='stage_unknown'||
    (signal==='step_complete'||signal==='step_failed')&&stage==='stage_unknown';
  const codeString=typeof phase==='number'?String(phase):phase;
  const phaseCode=isUnknown&&typeof codeString==='string'&&
    /^(?:0|[1-9][0-9]{0,2})$/.test(codeString)&&Number(codeString)<=255?
    Number(codeString):undefined;
  return Object.freeze({
    source:'programa',event,at:new Date().toISOString(),
    ...(stage?{stage}:{}),
    ...(phaseCode!==undefined?{phaseCode}:{})
  });
}
function createNativeDiagnosticController({
  startPanel=startDiagnosticPanel,createWindow,
  // Tests inject a no-op; the packaged app explicitly injects startCapture.
  startObserver=()=>()=>{},getLabRoot=()=>undefined,
  graceMs=15000,maxMs=120000
}={}) {
  if(typeof startPanel!=='function'||typeof createWindow!=='function')
    throw Error('DIAG_MISSING_WINDOW_FACTORY');
  const history=new Map();
  const windows=new Map();
  const stageStarts=new Map();
  function record(profileId,item){
    if(!history.has(profileId)){
      if(history.size>=MAX_PROFILES)history.delete(history.keys().next().value);
      history.set(profileId,[]);
    }
    const list=history.get(profileId);
    list.push(item);
    if(list.length>MAX_PER_PROFILE)list.shift();
    const current=windows.get(profileId);
    if(current)current.panel.emit(item);

  }
  const coordinator=createOpeningCaptureCoordinator({
    emitToProfile:record,startObserver,getLabRoot,graceMs,maxMs
  });
  function note(profileId,signal,phase=''){
    validateProfileId(profileId);
    let capture=null;
    if(signal==='open_requested'){
      // Bounded per-opening memory; no profile ID is serialized into the JSON.
      // Stop a previous unfinished capture; no reports are written to disk.
      coordinator.finish(profileId,'restarted');
      history.delete(profileId);
      // Synchronous IPC arms the Node observer before the vendor's open().
      capture=coordinator.arm(profileId);
    }
    const base=safeEvent(signal,phase);
    const stage=safeStage(phase),key=profileId+'|'+stage;
    let durationMs;
    if(signal==='step_start')stageStarts.set(key,Date.now());
    if(signal==='step_complete'||signal==='step_failed'){
      const from=stageStarts.get(key);
      if(from!==undefined)durationMs=Math.min(3600000,Math.max(0,Date.now()-from));
      stageStarts.delete(key);
    }
    const item=Object.freeze({...base,...(durationMs===undefined?{}:{durationMs})});
    record(profileId,item);
    if(signal==='step_complete'||signal==='step_failed')
      coordinator.stage(profileId,signal,stage);
    return {ok:true,recorded:true,nativeChromiumSessionVerified:false,
      ...(capture?{captureStarted:capture.captureStarted}: {})};
  }
  async function show(profileId,parentWindow){
    validateProfileId(profileId);
    const current=windows.get(profileId);
    if(current){
      current.window.focus?.();
      return {ok:true,opened:true,alreadyOpened:true,
        httpBodiesCaptured:false,actualNativeSessionVerified:false};
    }
    let panel=null,window=null;
    try{
      // Do not start a second observer when a user opens this panel later.
      panel=await startPanel({observeOnOpen:false});
      // Events from the Vue table are informational; they have NOT been
      // verified against a native browser identity or vendor server.
      panel.emit({source:'programa',event:'embedded_ui_only'});
      for(const item of history.get(profileId)||[])panel.emit(item);
      window=await createWindow({profileId,parentWindow,url:panel.url});
      const entry={panel,window};
      windows.set(profileId,entry);
      if(typeof window.on==='function'){
        window.on('closed',()=>{
          if(windows.get(profileId)===entry)windows.delete(profileId);
          void panel.stop().catch(()=>{});
        });
      }
      return {ok:true,opened:true,alreadyOpened:false,
        httpBodiesCaptured:false,actualNativeSessionVerified:false};
    }catch{
      if(panel)await panel.stop().catch(()=>{});
      if(window&&typeof window.close==='function')window.close();
      return {ok:false,reason:'PANEL_NO_DISPONIBLE'};
    }
  }
  return Object.freeze({
    note,show,shutdown:coordinator.shutdown,
    snapshot:profileId=>{
      validateProfileId(profileId);
      return [...(history.get(profileId)||[])];
    }
  });
}
function createDiagnosticWindow({BrowserWindow,profileId,parentWindow,url}) {
  const win=new BrowserWindow({
    width:1120,height:730,minWidth:760,minHeight:520,
    show:true,autoHideMenuBar:true,backgroundColor:'#171b20',
    title:'Almacén | Diagnóstico de apertura',
    parent:parentWindow||undefined,modal:false,
    webPreferences:{
      nodeIntegration:false,contextIsolation:true,sandbox:true,
      webSecurity:true,devTools:false,
      partition:'temp:dicloak-almacen-diagnostics'
    }
  });
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  return win.loadURL(url).then(()=>win);
}
function install(){
  const {app,ipcMain,BrowserWindow}=require('electron');
  if(!app.isPackaged||ipcMain.listenerCount(EVENT_CHANNEL)>0)return;
  const controller=createNativeDiagnosticController({
    createWindow:args=>createDiagnosticWindow({...args,BrowserWindow}),
    startObserver:startCapture,
    getLabRoot:()=>undefined
  });
  app.once('before-quit',()=>controller.shutdown());
  ipcMain.handle(SHOW_CHANNEL,async(event,profileId)=>{
    if(!senderIsApp(event,BrowserWindow))return {ok:false,reason:'VENTANA_NO_AUTORIZADA'};
    try{
      return await controller.show(profileId,BrowserWindow.fromWebContents(event.sender));
    }catch{return {ok:false,reason:'ID_PERFIL_INVALIDO'}}
  });
  ipcMain.on(EVENT_CHANNEL,(event,profileId,signal,phase)=>{
    // open_requested is a synchronous IPC. Always return to avoid deadlocks,
    // even when the sender is untrusted or the row identifier is invalid.
    if(!senderIsApp(event,BrowserWindow)){
      if(signal==='open_requested')event.returnValue={ok:false,captureStarted:false};
      return;
    }
    try{
      const result=controller.note(profileId,signal,phase);
      if(signal==='open_requested')event.returnValue=result;
    }catch{
      if(signal==='open_requested')event.returnValue={ok:false,captureStarted:false};
    }
  });
}
module.exports={
  SHOW_CHANNEL,EVENT_CHANNEL,SIGNALS,STAGES,
  safeStage,safeEvent,createNativeDiagnosticController,
  createDiagnosticWindow,install
};

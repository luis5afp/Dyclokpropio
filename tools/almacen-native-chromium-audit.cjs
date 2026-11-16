'use strict';

/**
 * Opt-in integrity check of a manually selected, CLOSED Chromium test profile.
 * Does not read cookie values, decode SQLite databases or export browser
 * credentials. It stores only grouped sizes and SHA-256 fingerprints in a
 * separate Almacén directory and opens that directory in Explorer.
 *
 * Important: a manually selected native directory is not an automatically
 * verified DICloak profile identity. Do not claim this observes HTTP traffic.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { auditNativeProfile, compareAuditReports } =
  require('./audit-chromium-native-storage.cjs');
const { validateProfileId, isAbsoluteLocalFolder } =
  require('./almacen-perfil-readonly.js');

const CHANNEL = 'almacen-lab:open';
const CATEGORY_LABELS = Object.freeze({
  cookies: 'Cookies nativas',
  credentialsNative: 'Credenciales nativas',
  localStorage: 'Local Storage',
  indexedDB: 'IndexedDB',
  sessionStorage: 'Session Storage',
  webStorage: 'WebStorage',
  serviceWorker: 'Service Worker',
  preferences: 'Preferencias'
});

async function plainDirectory(dir) {
  if (!isAbsoluteLocalFolder(dir)) throw Error('RUTA_NO_LOCAL');
  const s = await fs.lstat(dir);
  if (!s.isDirectory() || s.isSymbolicLink()) throw Error('CARPETA_NO_SEGURA');
  return dir;
}
function hasNativeFiles(report) {
  return Object.values(report.categories).some(x=>x.files>0);
}
async function runReadOnlyAudit({ rootFolder, profileId, nativeFolder, previousReport }) {
  validateProfileId(profileId);
  await plainDirectory(nativeFolder);
  await plainDirectory(rootFolder);
  const report = await auditNativeProfile(nativeFolder);
  if (!hasNativeFiles(report)) throw Error('NO_ES_CARPETA_DE_PERFIL_CHROMIUM');
  const own=path.join(rootFolder,profileId);
  try { await fs.mkdir(own,{mode:0o700}); }
  catch(e){if(e.code!=='EEXIST')throw e;}
  await plainDirectory(own);
  const reports=path.join(own,'auditorias');
  try { await fs.mkdir(reports,{mode:0o700}); }
  catch(e){if(e.code!=='EEXIST')throw e;}
  await plainDirectory(reports);

  const comparison=previousReport?compareAuditReports(previousReport,report):null;
  const entry={
    schemaVersion:1,
    kind:'manual-native-integrity-audit',
    capturedAt:new Date().toISOString(),
    profileRowId:profileId,
    profileDirectoryIdentityVerifiedAutomatically:false,
    explicitUserSelection:true,
    sourceContentsCopied:false,
    credentialsOrCookiesDecrypted:false,
    realNetworkTrafficCaptured:false,
    audit:report,
    comparison
  };
  // Never include the selected native folder path in reports.
  const output=path.join(reports,Date.now()+'-'+crypto.randomUUID()+'.json');
  await fs.writeFile(output,JSON.stringify(entry,null,2)+'\n',{flag:'wx',mode:0o600});
  return {entry,output,folder:own};
}

function createAlmacenNativeAuditController({rootFolder,dialogApi,shellApi,auditFn=runReadOnlyAudit}) {
  if(!isAbsoluteLocalFolder(rootFolder))throw Error('NO_SE_PUEDE_USAR_ALMACEN');
  const bound=new Map();
  const reports=new Map();
  const working=new Set();
  async function askDialog(method,window,options) {
    if(!dialogApi || typeof dialogApi[method]!=='function')throw Error('DIALOGO_NO_DISPONIBLE');
    return window?dialogApi[method](window,options):dialogApi[method](options);
  }
  async function open(profileId,parentWindow) {
    validateProfileId(profileId);
    if(working.has(profileId))return {ok:false,reason:'AUDITORIA_EN_CURSO'};
    working.add(profileId);
    try{
      let nativeFolder=bound.get(profileId);
      if(!nativeFolder) {
        const chosen=await askDialog('showOpenDialog',parentWindow,{
          title:'Almacén: seleccionar carpeta Chromium de prueba (perfil cerrado)',
          properties:['openDirectory'],
          buttonLabel:'Vincular carpeta de prueba'
        });
        if(chosen?.canceled || !chosen?.filePaths?.length){
          return {ok:false,reason:'SELECCION_CANCELADA'};
        }
        nativeFolder=await plainDirectory(chosen.filePaths[0]);
        if(nativeFolder===rootFolder || nativeFolder.startsWith(rootFolder+path.sep))
          return {ok:false,reason:'NO_SELECCIONE_ALMACEN_COMO_PERFIL'};
        if([...bound].some(([key,value])=>key!==profileId&&value.toLowerCase()===nativeFolder.toLowerCase()))
          return {ok:false,reason:'LA_CARPETA_YA_ESTA_VINCULADA_A_OTRO_PERFIL'};
      }
      const confirm=await askDialog('showMessageBox',parentWindow,{
        type:'warning',
        buttons:['Cancelar','Confirmo perfil de pruebas cerrado'],
        defaultId:0,
        cancelId:0,
        message:'Auditar el almacenamiento nativo de este perfil de prueba',
        detail:'Elija solamente la carpeta del perfil Chromium correspondiente a la fila. Cierre ese navegador antes de continuar. Solo se calcularán tamaños y hashes; no se extraerán cookies, contraseñas ni datos de sesión.'
      });
      if(confirm?.response!==1)return {ok:false,reason:'AUDITORIA_CANCELADA'};
      await fs.mkdir(rootFolder,{recursive:true,mode:0o700});
      await plainDirectory(rootFolder);
      const result=await auditFn({rootFolder,profileId,nativeFolder,previousReport:reports.get(profileId)});
      bound.set(profileId,nativeFolder);
      reports.set(profileId,result.entry.audit);
      if(!shellApi || typeof shellApi.openPath!=='function')
        return {ok:false,reason:'EXPLORADOR_NO_DISPONIBLE'};
      const shellError=await shellApi.openPath(result.folder);
      if(shellError!=='')return {ok:false,reason:'ERROR_ABRIENDO_EXPLORADOR'};
      return {
        ok:true,
        opened:true,
        nativeAudit:true,
        realNetworkTrafficCaptured:false,
        sessionIdentityVerifiedAutomatically:false,
        firstAudit:!result.entry.comparison,
        categoryFileCounts:Object.fromEntries(Object.entries(result.entry.audit.categories)
          .map(([k,v])=>[k,v.files]))
      };
    }catch(error){
      return {ok:false,reason:String(error.message||'AUDITORIA_NO_DISPONIBLE')};
    }finally{working.delete(profileId);}
  }
  return Object.freeze({open});
}
function senderIsApp(event,BrowserWindow) {
  if(!event?.sender || !event?.senderFrame ||
    event.sender.mainFrame!==event.senderFrame)return false;
  if(!BrowserWindow.getAllWindows().some(w=>w.webContents===event.sender))return false;
  const url=event.sender.getURL?.();
  try{
    const parsed=new URL(url);
    return parsed.protocol==='file:' ||
      ((parsed.protocol==='http:'||parsed.protocol==='https:') &&
       ['localhost','127.0.0.1','[::1]'].includes(parsed.hostname));
  }catch{return false;}
}
function install() {
  const {app,dialog,shell,ipcMain,BrowserWindow}=require('electron');
  if(!app.isPackaged || ipcMain.listenerCount(CHANNEL)>0) return;
  const rootFolder=path.join(process.env.LOCALAPPDATA ||
    path.join(os.homedir(),'AppData','Local'),'DICloak-Nativo-Almacen-Audit-034');
  const controller=createAlmacenNativeAuditController({rootFolder,dialogApi:dialog,shellApi:shell});
  ipcMain.handle(CHANNEL, async (event,profileId)=>{
    if(!senderIsApp(event,BrowserWindow))return {ok:false,reason:'VENTANA_NO_AUTORIZADA'};
    if(typeof profileId!=='string')return {ok:false,reason:'ID_PERFIL_INVALIDO'};
    return controller.open(profileId,BrowserWindow.fromWebContents(event.sender));
  });
  console.log('[Almacén] auditoría local nativa disponible solo con selección y confirmación');
}

module.exports={
  CHANNEL, CATEGORY_LABELS, createAlmacenNativeAuditController,
  runReadOnlyAudit, senderIsApp, install
};

/* DyclokPRO v6.15 — expose durable per-account archives under the install folder.
 * This creates ONE Windows NTFS junction:
 *   %LOCALAPPDATA%\Programs\DyclokPRO\Cuentas ->
 *   %LOCALAPPDATA%\DyclokPRO\Cuentas
 * The original archive remains the only physical store. No cookie/token copying,
 * permission changes, data deletion, migration or authentication modifications.
 */
(function(){
"use strict";
const {app,ipcMain,shell}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os");
const UUID=/^[0-9a-f]{32}$/;
const args=process.argv.filter(s=>s.startsWith("--dyclok-account="));
if(args.length>1||args.some(s=>!UUID.test(s.slice("--dyclok-account=".length))))
  throw Error("Invalid account identity for install folder");
const account=args.length?args[0].slice("--dyclok-account=".length):"legacy";
const local=process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local");
const target=path.join(local,"DyclokPRO","Cuentas");
const expectedInstall=path.join(local,"Programs","DyclokPRO");
const actualInstall=path.dirname(process.execPath);
const junction=path.join(expectedInstall,"Cuentas");
let lastError="";
function isInstalledHere(){
  return process.platform==="win32" &&
    path.resolve(actualInstall).toLowerCase()===path.resolve(expectedInstall).toLowerCase()
}
function normalize(p){
  return path.normalize(p).replace(/^\\\\\?\\/,"").replace(/[\\/]+$/,"").toLowerCase()
}
function checkLink(){
  try{
    if(!fs.lstatSync(junction).isSymbolicLink())return false;
    return normalize(fs.realpathSync(junction))===normalize(fs.realpathSync(target))
  }catch{return false}
}
function ensureLink(){
  if(!isInstalledHere()){
    lastError="DyclokPRO no se está ejecutando desde su carpeta de instalación habitual.";
    return false
  }
  try{
    fs.mkdirSync(target,{recursive:true,mode:0o700});
    if(fs.existsSync(junction)||fs.existsSync(junction)&&!checkLink()){
      if(!checkLink()){
        lastError="La carpeta Cuentas de la instalación ya existe y no apunta al archivo persistente. No se modificó.";
        return false
      }
      lastError="";return true
    }
    // lstat also detects a broken link. Never overwrite ANY existing link or directory.
    try{
      fs.lstatSync(junction);
      lastError="La ruta Cuentas ya existe. No se modificó.";
      return false
    }catch(e){if(e.code!=="ENOENT")throw e}
    fs.symlinkSync(target,junction,"junction"); // Windows NTFS junction: no elevation needed.
    if(!checkLink())throw Error("No se pudo validar el enlace de carpetas.");
    lastError="";return true
  }catch(e){
    lastError="No se pudo enlazar la carpeta de instalación: "+(e?.code||e?.message||"error");
    return false
  }
}
function trusted(ev){
  try{
    if(!ev.senderFrame||ev.senderFrame!==ev.sender.mainFrame)return false;
    const url=new URL(ev.senderFrame.url);
    return url.protocol==="file:"&&/\/dist\/index\.html$/i.test(url.pathname)
  }catch{return false}
}
function guard(ev){if(!trusted(ev))throw Error("Acceso a las carpetas no autorizado")}
function status(){
  const linked=ensureLink();
  const root=linked?junction:target;
  return {
    linked,
    folder:path.join(root,account,"ArchivoOriginal","Perfiles"),
    accountsFolder:root,
    originalStorage:target,
    message:linked?"Carpeta Cuentas vinculada sin duplicar archivos.":lastError,
    account
  }
}
ipcMain.handle("dyclokpro:archive:installFolderStatus",ev=>{guard(ev);return status()});
ipcMain.handle("dyclokpro:archive:openInstallFolder",async ev=>{
  guard(ev);
  const result=status();
  const stable=path.join(target,account,"ArchivoOriginal","Perfiles");
  fs.mkdirSync(stable,{recursive:true,mode:0o700});
  const message=await shell.openPath(result.folder);
  if(message)throw Error(message);
  return {opened:true,...result};
});
app.whenReady().then(()=>{ensureLink()}).catch(()=>{});
})();
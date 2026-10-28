/* DyclokPRO v6.21: expose the actual DyclokPRO installer version to the
 * legacy Electron renderer and disable the legacy desktop auto-downloader.
 * This DOES NOT change login tokens, server authorization, minimum-version
 * rules applied by a remote server, or Chromium's browser version.
 */
(function(){
"use strict";
const {app,ipcMain}=require("electron");
const VERSION="6.21.0";
const UPDATE_CHANNELS=new Set([
 "update-app","update-app-check-pack","update-app-full-update",
 "update-app-patch-update","update-app-cancel-download","update-app-restart"
]);
const originalOn=ipcMain.on.bind(ipcMain),originalHandle=ipcMain.handle.bind(ipcMain);
ipcMain.on=function(channel,listener){
 if(UPDATE_CHANNELS.has(channel))return this;
 return originalOn(channel,listener)
};
ipcMain.handle=function(channel,listener){
 if(UPDATE_CHANNELS.has(channel)){
  return originalHandle(channel,async()=>({
   disabled:true,manualUpdatesOnly:true,
   message:"Las actualizaciones automáticas del cliente DyclokPRO están desactivadas."
  }))
 }
 if(channel==="version-local-info"){
  return originalHandle(channel,async(...args)=>{
   const value=await listener(...args);
   const installed=app.getVersion();
   // This is the genuine app.asar package version, not an invented server token.
   if(installed!==VERSION)throw Error("El paquete DyclokPRO no tiene la versión interna esperada.");
   if(!value||typeof value!=="object")return {version:installed,platform:process.platform};
   return {...value,version:installed}
  })
 }
 return originalHandle(channel,listener)
};
// No automatic app update checks, installs, restarts, redirects or downloads.
// Provider-side minimum-version rules and login decisions remain unchanged.
})();
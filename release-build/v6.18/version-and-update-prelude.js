/* DyclokPRO v6.18: legacy updater isolation and truthful version reporting.
 * Load BEFORE original main bundle, after app.setPath account isolation bootstrap.
 * Does not change remote minimum-version requirements, tokens, authentication,
 * or provider-enforced logout.
 */
(function(){
"use strict";
const {app,ipcMain}=require("electron");
const CHANNELS=new Set([
 "update-app","update-app-check-pack","update-app-full-update",
 "update-app-patch-update","update-app-cancel-download","update-app-restart"
]);
const handle=ipcMain.handle.bind(ipcMain),on=ipcMain.on.bind(ipcMain);
ipcMain.on=function(channel,listener){
 if(CHANNELS.has(channel))return this;
 return on(channel,listener);
};
ipcMain.handle=function(channel,listener){
 if(CHANNELS.has(channel)){
  return handle(channel,async()=>({
   disabled:true,manualUpdatesOnly:true,
   message:"La actualización automática heredada de escritorio está desactivada; utilice GitHub Releases."
  }));
 }
 if(channel==="version-local-info"){
  return handle(channel,async(...args)=>{
   const original=await listener(...args);
   const actual=app.getVersion();
   if(!/^\d+\.\d+\.\d+(?:[-+].*)?$/.test(actual))throw Error("Invalid installed application version");
   return original && typeof original==="object"
     ? {...original,version:actual}
     : {version:actual,platform:process.platform};
  });
 }
 return handle(channel,listener);
};
})();

/* DyclokPRO v6.22 compatibility experiment.
 * Preserve DICloak v6.16's genuine internal 2.8.17 version and its original
 * version-local-info IPC handler. Never replace an app/server version with
 * the DyclokPRO installer/marketing version.
 *
 * Keep v6.21's manual-only desktop update channels for a controlled A/B
 * comparison. Do not modify authorization, cookies, tokens or sessions.
 */
(function(){
"use strict";
const {ipcMain}=require("electron");
const CHANNELS=new Set([
 "update-app","update-app-check-pack","update-app-full-update",
 "update-app-patch-update","update-app-cancel-download","update-app-restart"
]);
const originalOn=ipcMain.on.bind(ipcMain);
const originalHandle=ipcMain.handle.bind(ipcMain);
ipcMain.on=function(channel,listener){
 if(CHANNELS.has(channel))return this;
 return originalOn(channel,listener);
};
ipcMain.handle=function(channel,listener){
 if(CHANNELS.has(channel)){
  return originalHandle(channel,async()=>({
   disabled:true,manualUpdatesOnly:true,
   message:"Las actualizaciones automáticas de DyclokPRO permanecen desactivadas."
  }));
 }
 return originalHandle(channel,listener);
};
})();
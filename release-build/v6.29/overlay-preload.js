/* DyclokPRO v6.29: explicit, narrow renderer bridge appended AFTER official preload.
 * Does not replace or inspect window.DIC, auth headers, tokens or signed requests.
 */
(function(){
"use strict";
const {contextBridge,ipcRenderer}=require("electron");
const ALLOWED=new Set([
 "dyclokpro:raw:save","dyclokpro:raw:open","dyclokpro:raw:status",
 "dyclokpro:users:list","dyclokpro:users:open",
 "dyclokpro:users:rename","dyclokpro:users:active"
]);
const bridge=Object.freeze({
 invoke:(channel,data)=>{
  if(typeof channel!=="string"||!ALLOWED.has(channel))return Promise.reject(Error("IPC channel not allowed"));
  return ipcRenderer.invoke(channel,data);
 }
});
contextBridge.exposeInMainWorld("dyclokPROArchive",bridge);
})();

/* DyclokPRO v6.13 — direct, fully local Chromium profile access.
 * No remote authentication/authorization bypass. Does not read, copy or
 * change server-managed profile cookies, tokens or identity information.
 */
(function(){
"use strict";
const {ipcMain}=require("electron");
const fs=require("fs"),path=require("path"),cp=require("child_process");
const BROWSER_MANAGER="Dyclokpro_Perfiles_Locales.exe";
let startedAt=0;
function localSender(event){
 try{
  const frame=event.senderFrame;
  if(!frame||frame!==event.sender.mainFrame)return false;
  const url=new URL(frame.url);
  return url.protocol==="file:"&&/\/dist\/index\.html$/i.test(url.pathname);
 }catch{return false}
}
ipcMain.handle("dyclokpro:localprofiles:open",async event=>{
 if(!localSender(event))throw Error("Local profile launcher is only available to the DyclokPRO window");
 if(process.platform!=="win32")throw Error("Local profiles require Windows");
 const executable=path.join(path.dirname(process.execPath),BROWSER_MANAGER);
 if(!fs.existsSync(executable))throw Error("Administrador de perfiles locales no instalado. Reinstala DyclokPRO completo.");
 if(Date.now()-startedAt<850)return {started:true,reusedClick:true};
 return new Promise((resolve,reject)=>{
  let child;
  try{child=cp.spawn(executable,[],{cwd:path.dirname(executable),
    windowsHide:false,detached:false,stdio:"ignore",shell:false});
  }catch(e){reject(Error("No se pudo abrir el administrador local: "+e.message));return}
  let settled=false;
  const finish=(error)=>{
   if(settled)return;
   settled=true;
   child.removeListener("error",onError);
   if(error)reject(Error("No se pudo abrir perfiles locales: "+error.message));
   else{startedAt=Date.now();child.unref?.();resolve({started:true})}
  };
  const onError=error=>finish(error);
  child.once("error",onError);
  child.once("spawn",()=>finish());
 });
});
})();
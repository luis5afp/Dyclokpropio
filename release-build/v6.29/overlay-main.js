/* DyclokPRO v6.29: independent accounts, no changes to official 3.0.7 API/auth.
 * Runs before the ORIGINAL official Electron main.js.
 * Keep existing Cuentas and browser data intact; new engine uses its own subdirectory.
 */
(function() {
"use strict";
const {app,ipcMain,shell}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto"),cp=require("child_process");
const root=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),"DyclokPRO","Cuentas");
const arg=process.argv.filter(s=>s.startsWith("--dyclok-account="));
if(arg.length>1)throw Error("Duplicate account argument");
const id=arg.length?arg[0].slice("--dyclok-account=".length):"legacy";
if(!/^(?:legacy|[a-f0-9]{32})$/.test(id))throw Error("Invalid Dyclok account");
const dir=path.join(root,id,"Engine307");
const userData=path.join(dir,"UserData");
const sessionData=path.join(dir,"SessionData");
fs.mkdirSync(userData,{recursive:true,mode:0o700});
fs.mkdirSync(sessionData,{recursive:true,mode:0o700});
if(app.isReady())throw Error("Cannot isolate account after Electron ready");
app.setPath("userData",userData);
app.setPath("sessionData",sessionData);
if(process.argv.includes("--dyclok-self-test")){
 const target=path.join(os.tmpdir(),"dyclokpro-v629-test-"+id+".json");
 fs.writeFileSync(target,JSON.stringify({id,userData,sessionData,version:app.getVersion()}),"utf8");
 process.exit(0);
}
function trust(ev){
 if(!ev?.senderFrame||ev.senderFrame!==ev.sender?.mainFrame)throw Error("Untrusted frame");
 const u=new URL(ev.senderFrame.url);
 if(u.protocol!=="file:"||!/\/dist\/index\.html$/i.test(u.pathname))throw Error("Not a main DICloak window");
}
function list(){
 fs.mkdirSync(root,{recursive:true,mode:0o700});
 const ids=["legacy"];
 for(const d of fs.readdirSync(root,{withFileTypes:true})){
  if(d.isDirectory()&&/^[a-f0-9]{32}$/.test(d.name)&&!ids.includes(d.name))ids.push(d.name);
 }
 return ids.map(x=>{
  let label=x==="legacy"?"Principal":"Cuenta "+x.slice(0,6);
  try{
   const val=fs.readFileSync(path.join(root,x,"cuenta-nombre.txt"),"utf8").trim();
   if(val&&val.length<=80)label=val;
  }catch{}
  return {id:x,label,current:x===id};
 });
}
ipcMain.handle("dyclokpro:users:list",ev=>{trust(ev);return list()});
ipcMain.handle("dyclokpro:users:rename",(ev,p)=>{
 trust(ev);
 const name=typeof p?.name==="string"?p.name.trim():"";
 if(!name||name.length>80||/[\r\n\x00-\x1f]/.test(name))throw Error("Invalid account name");
 const target=typeof p?.id==="string"?p.id:"";
 if(!/^(?:legacy|[a-f0-9]{32})$/.test(target))throw Error("Invalid account");
 const accountDir=path.join(root,target);
 if(!fs.existsSync(accountDir))throw Error("Account does not exist");
 fs.writeFileSync(path.join(accountDir,"cuenta-nombre.txt"),name,{mode:0o600});
 return list();
});
ipcMain.handle("dyclokpro:users:open",(ev,p)=>{
 trust(ev);
 const requested=typeof p?.id==="string"?p.id:"";
 if(requested&&requested===id)return {alreadyOpen:true};
 if(requested&&!/^(?:legacy|[a-f0-9]{32})$/.test(requested))throw Error("Invalid account");
 let dest=requested;
 if(!dest){
  dest=crypto.randomBytes(16).toString("hex");
  fs.mkdirSync(path.join(root,dest,"Engine307"),{recursive:true,mode:0o700});
 }
 if(!fs.existsSync(path.join(root,dest)))throw Error("Account missing");
 const child=cp.spawn(process.execPath,["--dyclok-account="+dest],{
  detached:true,stdio:"ignore",windowsHide:false,env:process.env
 });
 child.on("error",()=>{});
 child.unref();
 return {created:!requested,id:dest};
});
ipcMain.handle("dyclokpro:users:active",ev=>{trust(ev);return{id,version:app.getVersion()}});
})();

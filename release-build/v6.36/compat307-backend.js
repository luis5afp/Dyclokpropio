/* DyclokPRO v6.36 — adapter for DICloak's *documented* local Open API.
 * Runs as a companion to the old v6.28 renderer; does NOT replace or intercept
 * the legacy frontend's authentication, X-DC headers or /gin/v1/env/list.
 * The official 3.0.7 client must run and authorize the API itself.
 */
(function(){
"use strict";
const {ipcMain}=require("electron");
const http=require("http"),fs=require("fs"),os=require("os"),path=require("path"),crypto=require("crypto");
const MAX=8*1024*1024;
const ID=/^(?:[0-9]{1,25}|[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9-]{27,36})$/i;
const ACCOUNT=/^[a-f0-9]{32}$/;
const arg=process.argv.filter(x=>x.startsWith("--dyclok-account="));
if(arg.length>1||arg.some(x=>!ACCOUNT.test(x.slice("--dyclok-account=".length))))
 throw Error("Invalid Dyclok account argument");
const account=arg.length?arg[0].slice("--dyclok-account=".length):"legacy";
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),"DyclokPRO","Cuentas",account,"ArchivoOriginal","Perfiles");
function trust(e){
 const f=e&&e.senderFrame;
 if(!f||f!==e.sender?.mainFrame)throw Error("Untrusted app frame");
 const url=new URL(f.url);
 if(url.protocol!=="file:"||!/\/dist\/index\.html$/i.test(url.pathname))
  throw Error("Only main DyclokPRO UI can use the Open API bridge");
}
function validate(x){
 const port=Number(x?.port);
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error("Invalid local API port");
 const apiKey=x?.apiKey;
 if(typeof apiKey!=="string"||apiKey.length<8||apiKey.length>512||
    /[\r\n\x00-\x1f]/.test(apiKey))throw Error("Invalid Local API key");
 return {port,apiKey};
}
function get(v,route){
 const {port,apiKey}=validate(v);
 // No remote hosts, no redirects or proxy; exactly one vendor-owned service
 // already listening on the user's loopback network interface.
 if(!/^\/openapi\/v[12]\/[a-z0-9/?=&._-]+$/i.test(route))
  throw Error("Unapproved Open API endpoint");
 return new Promise((resolve,reject)=>{
  const req=http.request({hostname:"127.0.0.1",port,path:route,method:"GET",
    timeout:11000,headers:{"X-API-KEY":apiKey,"Accept":"application/json"}},
   response=>{
    if(response.statusCode!==200){response.resume();reject(Error("Local API HTTP "+response.statusCode));return}
    const chunks=[];let bytes=0;
    response.on("data",chunk=>{
      bytes+=chunk.length;
      if(bytes>MAX){req.destroy(Error("Local API response exceeds size limit"));return}
      chunks.push(chunk);
    });
    response.on("end",()=>{
      const raw=Buffer.concat(chunks);
      try{
        const value=JSON.parse(raw.toString("utf8"));
        if(!value||value.code!==0){
          const code=Number.isInteger(value?.code)?value.code:"unknown";
          // Do not show server 'msg': it might contain private context.
          reject(Error("Official Local API rejected the request (code "+code+")."));
          return;
        }
        resolve({raw,value});
      }catch{reject(Error("Local API did not return valid JSON"))}
    });
    response.on("error",reject);
   });
  req.on("timeout",()=>req.destroy(Error("Local API timed out")));
  req.on("error",reject);
  req.end();
 });
}
function profiles(data){
 let list=Array.isArray(data)?data:Array.isArray(data?.list)?data.list:
          Array.isArray(data?.records)?data.records:null;
 if(!list)throw Error("Unsupported profile list format");
 return list.map(p=>{
  const id=String(p?.id??p?.env_id??"");
  const name=typeof p?.name==="string"?p.name.trim():"";
  return ID.test(id)&&name.length&&name.length<=300?{id,name}:null;
 }).filter(Boolean);
}
function cleanName(v){
 let s=String(v||"").trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,"_").replace(/[. ]+$/g,"");
 if(s.length>75)s=s.slice(0,75);
 if(/^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(s))s="_"+s;
 if(!s||s==="."||s==="..")throw Error("Invalid profile name");
 return s;
}
function archive(profile,raw,kind){
 const id=String(profile?.id||"");
 const name=cleanName(profile?.name);
 if(!ID.test(id)||!["detalle-v2","lista-v2","lista-v1"].includes(kind))throw Error("Invalid archive record");
 const directory=kind.startsWith("lista-")?path.join(BASE,"General"):
   path.join(BASE,name+" ["+id+"]");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");
 for(let i=0;i<10;i++){
  const filename=path.join(directory,stamp+"_"+kind+"_"+crypto.randomBytes(6).toString("hex")+".json");
  try{
   // Write exact bytes from the authorized API; never JSON.stringify them.
   fs.writeFileSync(filename,raw,{flag:"wx",mode:0o600});
   return {saved:true,profile:id};
  }catch(e){if(e.code!=="EEXIST")throw e}
 }
 throw Error("Unable to create unique local copy");
}
async function status(e,input){
 trust(e);
 const {value}=await get(input,"/openapi/v2/status");
 return {serviceReady:value?.data?.status==="ok",apiVersion:String(value?.data?.api_version||"unknown"),
  clientVersion:String(value?.data?.client_version||"unknown").slice(0,40)};
}
async function components(e,input){
 trust(e);
 const cap=await get(input,"/openapi/v2/capabilities");
 const version=await get(input,"/openapi/v2/version");
 const src=cap.value?.data||{}, info=version.value?.data||{};
 const names=["profiles","cookies","proxies","fingerprints","bookmarks","extensions","tags",
  "profile_groups","members","permissions","start_stop","kernels"];
 const declared={};
 for(const k of names)declared[k]=typeof src[k]==="boolean"?src[k]:null;
 const raw=info.kernel?.installed;
 const installed=Array.isArray(raw)?raw.filter(x=>typeof x==="string").map(x=>x.slice(0,45)).slice(0,30):[];
 return {apiVersion:String(info.api_version||"unknown").slice(0,40),
  clientVersion:String(info.client_version||"unknown").slice(0,40),
  installedKernels:installed,capabilities:declared};
}
async function list(e,input){
 trust(e);
 const page=Number(input?.page||1);
 if(!Number.isInteger(page)||page<1||page>30)throw Error("Invalid page");
 const version=input?.version==="v1"?"v1":"v2";
 const route=version==="v1"?"/openapi/v1/env/list?page_no="+page+"&page_size=50":
  "/openapi/v2/profiles?page="+page+"&page_size=50";
 const {value,raw}=await get(input,route);
 const rows=profiles(value?.data);
 const next=typeof value.next==="string"?value.next:null;
 return {version,page,rows,returned:rows.length,next,availableForArchive:true};
}
async function detail(e,input){
 trust(e);
 const id=String(input?.id||"");
 if(!ID.test(id))throw Error("Invalid profile ID");
 const {value}=await get(input,"/openapi/v2/profiles/"+id);
 if(!value.data||typeof value.data!=="object")throw Error("Invalid profile detail");
 const data=value.data;
 const reported=String(data.id||"");
 if(reported!==id)throw Error("Profile ID mismatch");
 return {id,name:String(data.name||"").slice(0,300),
  proxyAvailable:!!data.proxy_binding,
  fingerprintAvailable:!!data.fingerprint,
  advancedAvailable:!!data.advanced,
  // No cookie values, passwords, authorization headers or tokens leave main.
  detailAvailable:true};
}
async function saveDetail(e,input){
 trust(e);
 const id=String(input?.id||"");
 if(!ID.test(id))throw Error("Invalid profile ID");
 const {raw,value}=await get(input,"/openapi/v2/profiles/"+id);
 const name=String(value?.data?.name||"");
 if(String(value?.data?.id||"")!==id)throw Error("Profile ID mismatch");
 // Save only one-profile, successful payload. No server-provided paths.
 return archive({id,name},raw,"detalle-v2");
}
async function saveList(e,input){
 trust(e);
 const page=Number(input?.page||1);
 if(!Number.isInteger(page)||page<1||page>30)throw Error("Invalid page");
 const version=input?.version==="v1"?"v1":"v2";
 const route=version==="v1"?"/openapi/v1/env/list?page_no="+page+"&page_size=50":
  "/openapi/v2/profiles?page="+page+"&page_size=50";
 const {value,raw}=await get(input,route);
 profiles(value?.data);
 return archive({id:"1",name:"General"},raw,version==="v1"?"lista-v1":"lista-v2");
}
ipcMain.handle("dyclokpro:compat307:status",status);
ipcMain.handle("dyclokpro:compat307:components",components);
ipcMain.handle("dyclokpro:compat307:list",list);
ipcMain.handle("dyclokpro:compat307:detail",detail);
ipcMain.handle("dyclokpro:compat307:save-detail",saveDetail);
ipcMain.handle("dyclokpro:compat307:save-list",saveList);
})();
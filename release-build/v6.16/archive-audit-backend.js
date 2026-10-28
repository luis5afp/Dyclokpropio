/* DyclokPRO v6.16 - privacy-safe audit of existing archive files.
 * Does not decrypt, copy, import, export or inspect the values of cookies,
 * credentials, tokens, navigation history or Chromium profile databases.
 * Archived API responses are NOT equivalent to Chromium's internal cookie jar.
 */
(function(){
"use strict";
const {ipcMain}=require("electron");
const fs=require("fs"),path=require("path"),os=require("os");
const UUID=/^[0-9a-f]{32}$/;
const args=process.argv.filter(a=>a.startsWith("--dyclok-account="));
if(args.length>1||args.some(a=>!UUID.test(a.slice("--dyclok-account=".length))))
 throw Error("Invalid account archive identifier");
const account=args.length?args[0].slice("--dyclok-account=".length):"legacy";
const BASE=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),"AppData","Local"),
 "DyclokPRO","Cuentas",account,"ArchivoOriginal","Perfiles");
const TYPES=["cookies","proxy","configuracion","parametros","otros"];
const LIMIT=1000;
function validSender(ev){
 try{
  if(!ev.senderFrame||ev.senderFrame!==ev.sender.mainFrame)return false;
  const u=new URL(ev.senderFrame.url);
  return u.protocol==="file:"&&/\/dist\/index\.html$/i.test(u.pathname)
 }catch{return false}
}
function requireMain(ev){
 if(!validSender(ev))throw Error("Acceso al diagnóstico de archivos no autorizado");
}
function scan(){
 fs.mkdirSync(BASE,{recursive:true,mode:0o700});
 const profiles=[];
 let actualFiles=0,invalidFiles=0,referenceOnly=0;
 const entries=fs.readdirSync(BASE,{withFileTypes:true});
 for(const entry of entries){
  if(profiles.length>=LIMIT)break;
  if(!entry.isDirectory()||!(/^(?:general|perfil-[0-9a-z_.-]{1,35})$/i).test(entry.name))continue;
  const root=path.join(BASE,entry.name);
  let reference=false;
  try{reference=fs.lstatSync(path.join(root,"referencia.json")).isFile()}catch{}
  const categories=[];
  for(const type of TYPES){
   const file=path.join(root,type,"latest.enc");
   try{
    const stat=fs.lstatSync(file);
    if(!stat.isFile())continue; // Do not follow links outside the archive.
    const fd=fs.openSync(file,"r");
    let magic=Buffer.alloc(3),count=0;
    try{count=fs.readSync(fd,magic,0,3,0)}finally{fs.closeSync(fd)}
    const supported=count===3&&["v10","v11"].includes(magic.toString("ascii"));
    categories.push({type,bytes:stat.size,updatedAt:stat.mtime.toISOString(),
      status:supported?"encrypted_file_present":"unrecognized_file"});
    actualFiles++;
    if(!supported)invalidFiles++;
   }catch(e){if(e.code!=="ENOENT")invalidFiles++}
  }
  if(reference&&categories.length===0)referenceOnly++;
  profiles.push({
   id:entry.name==="general"?"General":entry.name.slice(7),
   folder:entry.name,
   referenceOnly:reference&&categories.length===0,
   categories
  });
 }
 profiles.sort((a,b)=>a.folder.localeCompare(b.folder,undefined,{numeric:true}));
 return {
  account,folder:BASE,profiles,
  summary:{profileFolders:profiles.length,archivedFiles:actualFiles,
    unknownFormatFiles:invalidFiles,onlyReferences:referenceOnly},
  archiveScope:"electron_api_responses_only",
  chromiumCookieStatus:"not_collected",
  chromiumExplanation:"Este archivo no accede a las cookies internas de ginsbrowser.exe. Para perfiles usados en otra computadora, los datos no están en este equipo.",
  encryptionExplanation:"Se comprueba solo la cabecera v10/v11 y el tamaño del archivo. Nunca se descifra ni se extrae su contenido."
 };
}
ipcMain.handle("dyclokpro:archive:audit",ev=>{
 requireMain(ev);
 return scan();
});
})();
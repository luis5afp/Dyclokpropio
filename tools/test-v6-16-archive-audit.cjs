#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),
 path=require("node:path"),os=require("node:os"),vm=require("node:vm");
const backend=fs.readFileSync(path.join(__dirname,"../release-build/v6.16/archive-audit-backend.js"),"utf8");
const frontend=fs.readFileSync(path.join(__dirname,"../release-build/v6.16/archive-ui.js"),"utf8");
assert(!backend.includes("decryptString(")&&!backend.includes("cookies.get(")&&
 !backend.includes("ginsbrowser.exe --")&&!backend.includes("copyFileSync("),
 "Audit must not decrypt, read browser cookies or copy private session files");
for(const word of ['api("audit")','Comprobar archivos reales','Cookies internas de Chromium: NO recopiladas',
 'status==="encrypted_file_present"','Solo referencia; ninguna respuesta archivada']){
 assert(frontend.includes(word),"Missing honest archive state: "+word)
}
const base=fs.mkdtempSync(path.join(os.tmpdir(),"dyclokpro-v616-audit-"));
const a="0123456789abcdef0123456789abcdef";
function app(account){
 const handlers=new Map();
 const electron={ipcMain:{handle:(event,callback)=>handlers.set(event,callback)}};
 const proc={argv:["DICloak.exe",...(account?["--dyclok-account="+account]:[])],
   env:{LOCALAPPDATA:base}};
 vm.runInNewContext(backend,{require:x=>({electron,fs,path,os})[x],process:proc,URL,Buffer},
  {filename:"archive-audit-backend.js"});
 const frame={url:"file:///C:/Users/USER/AppData/Local/Programs/DyclokPRO/resources/app.asar.unpacked/dist/index.html"};
 const event={senderFrame:frame,sender:{mainFrame:frame}};
 return {call:()=>handlers.get("dyclokpro:archive:audit")(event),
  unsafe:()=>handlers.get("dyclokpro:archive:audit")({senderFrame:{url:"https://foreign.example/"},sender:{mainFrame:{url:"https://foreign.example/"}}})}
}
try{
 const root=path.join(base,"DyclokPRO","Cuentas","legacy","ArchivoOriginal","Perfiles");
 const profile=path.join(root,"perfil-244");
 fs.mkdirSync(profile,{recursive:true});
 fs.writeFileSync(path.join(profile,"referencia.json"),JSON.stringify({kind:"profile_open_requested"}));
 const prior=app(null).call();
 assert.equal(prior.summary.onlyReferences,1);
 assert.equal(prior.summary.archivedFiles,0);
 assert.equal(prior.chromiumCookieStatus,"not_collected");
 const file=path.join(profile,"cookies","latest.enc");
 fs.mkdirSync(path.dirname(file),{recursive:true});
 const secret="DO_NOT_EXPOSE_COOKIE_VALUE_OR_TOKEN";
 fs.writeFileSync(file,Buffer.concat([Buffer.from("v10"),Buffer.from(secret)]));
 fs.mkdirSync(path.join(profile,"proxy"),{recursive:true});
 fs.writeFileSync(path.join(profile,"proxy","latest.enc"),Buffer.from("not encrypted"));
 const r=app(null).call();
 assert.equal(r.summary.archivedFiles,2);
 assert.equal(r.summary.onlyReferences,0);
 assert.equal(r.summary.unknownFormatFiles,1);
 assert.equal(r.profiles[0].categories.find(x=>x.type==="cookies").status,"encrypted_file_present");
 assert.equal(r.profiles[0].categories.find(x=>x.type==="cookies").bytes,3+secret.length);
 assert.equal(r.profiles[0].categories.find(x=>x.type==="proxy").status,"unrecognized_file");
 assert.equal(JSON.stringify(r).includes(secret),false,"Never reveal raw cookies in metadata");
 const other=app(a).call();
 assert.equal(other.summary.archivedFiles,0,"Accounts must not see each other's files");
 assert.equal(other.account,a);
 assert.throws(()=>app(null).unsafe(),/no autorizado/);
 assert.equal(fs.readFileSync(file,"utf8"),"v10"+secret,"Audit must not modify sensitive data");
 console.log("API_COOKIE_ARCHIVE_NOT_MISLABELED_AS_CHROMIUM=PASS");
 console.log("ENCRYPTED_FILE_METADATA_ONLY_NO_SECRET_VALUES=PASS");
 console.log("REFERENCE_ONLY_NOT_A_COOKIE_DOWNLOAD=PASS");
 console.log("ACCOUNT_ISOLATION_AND_UNTRUSTED_FRAME_REJECTION=PASS");
 console.log("CORRUPT_ARCHIVE_HEADER_DIAGNOSTIC=PASS");
}finally{fs.rmSync(base,{recursive:true,force:true})}

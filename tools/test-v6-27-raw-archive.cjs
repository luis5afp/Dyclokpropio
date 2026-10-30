#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.join(__dirname,"..");
const source=fs.readFileSync(path.join(root,"tools/release-v6-27-plain-archive.py"),"utf8");
const ui=fs.readFileSync(path.join(root,"release-build/v6.27/raw-archive-ui.js"),"utf8");
const backend=fs.readFileSync(path.join(root,"release-build/v6.27/raw-archive-backend.js"),"utf8");
assert(source.includes("2.8.17"));
assert(source.includes("SOURCE_SHA")&&source.includes("MAIN_SHA")&&source.includes("API_BUNDLE_SHA"));
assert(source.includes("new_main=backend+b"));
assert(ui.includes("profileName")&&ui.includes("profileId"));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"v627-"));
const handlers={};
const frame={url:"file:///C:/DyclokPRO/resources/app.asar.unpacked/dist/index.html"};
const event={senderFrame:frame,sender:{mainFrame:frame}};
try{
 vm.runInNewContext(backend,{
  require(name){
   if(name==="electron")return {ipcMain:{handle(name,fn){handlers[name]=fn}},shell:{openPath:async()=>""}};
   return require(name);
  },
  process:{argv:[],env:{LOCALAPPDATA:temp}},Buffer,URL,Date,console
 });
 const data={raw:'{"data":{"id":"2097722254089396228","name":"Perfil Demo","value":"abc"}}',route:"/gin/v1/env/open_detail/2097722254089396228",status:200,method:"GET",contentType:"application/json",profileId:"2097722254089396228",profileName:"Perfil Demo"};
 const save=handlers["dyclokpro:raw:save"];
 assert.equal(save(event,data).saved,true);
 assert.equal(save(event,data).saved,true);
 const folder=path.join(temp,"DyclokPRO","Cuentas","legacy","ArchivoOriginal","Perfiles","Perfil Demo [2097722254089396228]");
 const entries=fs.readdirSync(folder);
 assert.equal(entries.length,2);
 for(const file of entries)assert.equal(fs.readFileSync(path.join(folder,file),"utf8"),data.raw);
 console.log("PASS: original response text, profile name, unique files, native runtime guards");
}finally{fs.rmSync(temp,{recursive:true,force:true})}

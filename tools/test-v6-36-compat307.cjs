"use strict";
/* No live user credentials or network requests. Mock IPC + loopback response
 * to prove strict handling of official 3.0.7 APIs from the v6.28 client.
 */
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const {EventEmitter}=require("node:events");
const code=fs.readFileSync("release-build/v6.36/compat307-backend.js","utf8");
const ui=fs.readFileSync("release-build/v6.36/compat307-ui.js","utf8");
const build=fs.readFileSync("tools/release-v6-36-from-v628-compat.py","utf8");
const handlers=new Map(),writes=[];
const path=require("node:path"),realRequire=require;
const mainFrame={url:"file:///C:/Program%20Files/DyclokPRO/resources/app.asar/dist/index.html"};
const authorized={senderFrame:mainFrame,sender:{mainFrame}};
const wrongFrame={senderFrame:{url:"https://example.com/"},sender:{mainFrame}};
let responseRaw=Buffer.from('{"code":0,"data":{"list":[{"id":"2097722254089396228","name":"Test Profile"}]}}');
let statusCode=200,requested=[];
const http={
 request(args,receive){
  assert.equal(args.hostname,"127.0.0.1");
  assert.equal(args.method,"GET");
  assert(!args.path.includes("..")&&!args.path.includes("%"));
  assert(args.path.startsWith("/openapi/v"));
  assert.equal(args.headers["X-API-KEY"],"1234567890ABCDEF");
  requested.push(args.path);
  const req=new EventEmitter();
  req.end=()=>{
   setImmediate(()=>{
    const res=new EventEmitter();res.statusCode=statusCode;res.resume=()=>{};
    receive(res);
    res.emit("data",responseRaw);res.emit("end");
   });
  };
  req.destroy=e=>req.emit("error",e);
  return req;
 }
};
const mockfs={
 mkdirSync(){},
 writeFileSync(filename,data,options){
  if(options?.flag==="wx"&&writes.some(x=>x.path===filename)){
   const e=new Error("duplicate");e.code="EEXIST";throw e;
  }
  writes.push({path:filename,bytes:Buffer.from(data)});
 }
};
const vmRequire=name=>name==="electron"?{ipcMain:{handle:(name,fn)=>handlers.set(name,fn)}}:
 name==="http"?http:name==="fs"?mockfs:realRequire(name);
vm.runInNewContext(code,{require:vmRequire,process:{argv:[],env:{LOCALAPPDATA:"C:/Sandbox"}},URL,
  Buffer,Promise,Error,Number,String,Date,RegExp,console}, {timeout:5000});
const invoke=(name,data,ev=authorized)=>handlers.get("dyclokpro:compat307:"+name)(ev,data);
async function rejects(label,fn,pattern){
 await assert.rejects(fn,pattern,label);
}
(async()=>{
 assert.equal(handlers.size,6);
 const creds={port:"52140",apiKey:"1234567890ABCDEF"};
 let profiles=await invoke("list",{...creds,version:"v2",page:1});
 assert.equal(profiles.rows[0].id,"2097722254089396228");
 assert.equal(profiles.rows[0].name,"Test Profile");
 assert.equal(profiles.version,"v2");
 assert.deepEqual(requested,["/openapi/v2/profiles?page=1&page_size=50"]);
 responseRaw=Buffer.from(' { "code": 0, "data": { "id": "2097722254089396228", "name": "Perfil Real", "proxy_binding": { "password": "NO_REVELAR" } } }\n');
 let result=await invoke("detail",{...creds,id:"2097722254089396228"});
 assert.equal(result.proxyAvailable,true);
 assert(!JSON.stringify(result).includes("NO_REVELAR"));
 await invoke("save-detail",{...creds,id:"2097722254089396228"});
 assert.equal(writes.length,1);
 assert.equal(writes[0].bytes.toString("utf8"),responseRaw.toString("utf8"),"original JSON bytes changed");
 assert(writes[0].path.includes("Perfil Real [2097722254089396228]"));
 const saved=writes.length;
 responseRaw=Buffer.from('{"code":300003,"msg":"error","data":null}');
 await rejects("300003 cannot be archived",
  ()=>invoke("save-detail",{...creds,id:"2097722254089396228"}),/300003/);
 assert.equal(writes.length,saved);
 responseRaw=Buffer.from('{"code":0,"data":{"profiles":true,"cookies":false,"bookmarks":true,"fingerprints":true}}');
 let resCount=0;
 const originalEnd=http.request;
 http.request=(args,receive)=>{
  if(args.path==="/openapi/v2/version")
   responseRaw=Buffer.from('{"code":0,"data":{"api_version":"2.0.0","client_version":"3.0.7","kernel":{"installed":["142.0.7444.273"]}}}');
  return originalEnd(args,receive);
 };
 const component=await invoke("components",creds);
 assert.equal(component.clientVersion,"3.0.7");
 assert.equal(component.capabilities.profiles,true);
 assert.equal(component.capabilities.cookies,false);
 assert.equal(component.capabilities.bookmarks,true);
 assert.equal(component.capabilities.extensions,null);
 assert.deepEqual(Array.from(component.installedKernels),["142.0.7444.273"]);
 http.request=originalEnd;
 await rejects("request from alien frame",
  ()=>invoke("list",creds,wrongFrame),/Untrusted/);
 await rejects("invalid operation-like profile ID",
  ()=>invoke("detail",{...creds,id:"open_detail"}),/Invalid profile ID/);
 await rejects("no remote host injection",
  ()=>invoke("list",{...creds,port:999999}),/Invalid local API port/);
 await rejects("CRLF API key blocked",
  ()=>invoke("list",{...creds,apiKey:"1234567890\nInjected:"}),/Invalid Local API key/);
 responseRaw=Buffer.from('{"code":0,"data":{"list":[{"id":"1876881021063852034","name":"Perfil V1"}]}}');
 await invoke("list",{...creds,version:"v1",page:1});
 assert(requested.includes("/openapi/v1/env/list?page_no=1&page_size=50"));
 await invoke("save-list",{...creds,version:"v1",page:1});
 assert(writes.some(x=>x.path.includes("General")));
 assert(ui.includes("type=\"password\""));
 assert(ui.includes('key.value=""'));
 assert(ui.includes("Motor oficial 3.0.7"));
 assert(ui.includes("Componentes"));
 assert(!ui.includes("XMLHttpRequest.prototype"));
 assert(build.includes("SOURCE_SHA=\"954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606\""));
 assert(build.includes("ORIGINAL_AUTH_BUNDLE_SHA"));
 assert(!code.includes("X-DC-M1")&&!code.includes("X-DC-M2"));
 console.log("PASS: exact v6.28 base source hash guard");
 console.log("PASS: official v1/v2 Open API read-only profiles");
 console.log("PASS: genuine official Local API capability flags and Chromium kernels");
 console.log("PASS: original JSON bytes retained under real profile ID/name");
 console.log("PASS: HTTP 200 business error 300003 rejected");
 console.log("PASS: untrusted IPC, invalid profile IDs, CRLF and remote URL blocked");
 console.log("PASS: original v6.28 login and renderer network API not hooked");
})().catch(e=>{console.error(e);process.exitCode=1});

"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const legacy=fs.readFileSync("release-build/v6.28/raw-archive-ui.js","utf8");
const next=fs.readFileSync("release-build/v6.36/raw-archive-ui.js","utf8");
assert(legacy.includes('if(!obj||typeof obj!=="object")return;'));
assert(next.includes("if(!Number.isInteger(obj.code)||obj.code!==0)return;"));
// All archive functionality after the introduced check remains identical.
// Exclude the explanatory banner, which is not executable functionality.
const active=next.replace(' // Official JSON API uses code=0 for success; HTTP 200 with 300003 is NOT valid.\n if(!Number.isInteger(obj.code)||obj.code!==0)return;\n',"");
const withoutHeader=s=>s.replace(/^\/\*[^]*?\*\//,"");
assert.equal(withoutHeader(active),withoutHeader(legacy),"Unexpected modification to legacy archive logic");
const calls=[];
class FakeXHR {
 constructor(){this.listeners={};this.status=200;this.responseType="";this.responseText="";}
 open(method,url){this.method=method;this.url=url}
 send(){}
 addEventListener(name,cb){this.listeners[name]=cb}
 getResponseHeader(){return "application/json"}
 complete(json){this.responseText=json;this.listeners.loadend?.()}
}
const window={ipcRenderer:{invoke:async(channel,payload)=>{calls.push({channel,payload});return{saved:true}}}};
const document={readyState:"loading",addEventListener(){}};
vm.runInNewContext(next,{XMLHttpRequest:FakeXHR,window,document,URL,TextEncoder,WeakSet,Map,
  location:{href:"https://app.dicloak.com/"}},{timeout:5000});
async function run(){
 const bad=new FakeXHR();bad.open("POST","https://gin-server.dicloak.com/gin/v1/env/list");bad.send();
 bad.complete('{"code":300003,"msg":"session expired","data":{"list":[]}}');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls.length,0,"300003 must not be archived");
 const good=new FakeXHR();good.open("POST","https://gin-server.dicloak.com/gin/v1/env/list");good.send();
 const raw='{"code":0,"msg":"ok","data":{"list":[{"id":"2097722254089396228","name":"Real profile"}]}}';
 good.complete(raw);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls.length,1,"valid JSON response should still be archived");
 assert.equal(calls[0].channel,"dyclokpro:raw:save");
 assert.equal(calls[0].payload.raw,raw,"original JSON bytes modified");
 assert.equal(calls[0].payload.profileId,"","A profile list is not a single profile");
 console.log("PASS: legacy v6.28 archive unchanged except code=0 guard");
 console.log("PASS: HTTP 200 + code 300003 rejected");
 console.log("PASS: real successful list remains saved verbatim in General");
}
run().catch(e=>{console.error(e);process.exitCode=1});

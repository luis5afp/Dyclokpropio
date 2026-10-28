#!/usr/bin/env node
"use strict";
// Regression tests for the logic which v6.9 incorrectly reported as "lista".
// Uses mocked Electron windows; does not read account credentials or launch apps.
const assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"../release-build/v6.10/main-account-prelude.js"),"utf8");
const begin=source.indexOf("// Cross-process switching:");
const end=source.indexOf("\nasync function start(id){",begin);
assert(begin>=0&&end>begin,"Cannot locate cross-account focus code");
assert(source.includes("const already=await focusRunningAccount(id);\n if(already)return already;"),"Live accounts must not respawn");
const base=fs.mkdtempSync(path.join(os.tmpdir(),"dyclokpro-focus-regression-"));
let windows=[];
const fakeElectron={BrowserWindow:{getAllWindows:()=>windows}};
const context={fs,path,crypto,BASE:base,active:"legacy",UUID:/^[0-9a-f]{32}$/,
 process:{platform:"win32",pid:123456},setTimeout,clearTimeout,setInterval,clearInterval,
 require:(name)=>{assert.equal(name,"electron");return fakeElectron},
 app:{whenReady:()=>new Promise(()=>{}),on:()=>{}}
};
vm.runInNewContext(source.slice(begin,end)+"\nglobalThis.testing={focusOwnWindow,focusRunningAccount};",context);
function windowFixture(url,grantsFocus){
 let top=false,visible=true,focused=false;
 const trace=[];
 const win={id:42,webContents:{getURL:()=>url},
   isDestroyed:()=>false,isMinimized:()=>false,restore:()=>trace.push("restore"),
   isVisible:()=>visible,show:()=>{visible=true;trace.push("show")},
   moveTop:()=>trace.push("moveTop"),focus:()=>{trace.push("focus");if(grantsFocus)focused=true},
   isFocused:()=>focused,isAlwaysOnTop:()=>top,
   setAlwaysOnTop:v=>{top=v;trace.push("top:"+v)}};
 return {win,trace};
}
(async()=>{
 try{
  const primary=windowFixture("file:///C:/Program%20Files/DyclokPRO/dist/index.html#/profiles",true);
  const popup=windowFixture("about:blank",true);
  windows=[popup.win,primary.win];
  const ok=await context.testing.focusOwnWindow();
  assert.equal(ok.focused,true,"Must verify actual focus state");
  assert(primary.trace.includes("focus"),"Must activate the primary account window");
  assert(!popup.trace.includes("focus"),"Must not raise a dialog instead of account");

  const denied=windowFixture("file:///C:/app/dist/index.html",false);
  windows=[denied.win];
  const notFocused=await context.testing.focusOwnWindow();
  assert.equal(notFocused.focused,false,"Failed focus must never be reported successful");
  assert.equal(notFocused.visible,true);
  assert(denied.trace.includes("top:true")&&denied.trace.includes("top:false"),"Must try z-order fallback and restore normal window state");

  const id="abcdefabcdefabcdefabcdefabcdef12",pid=765432;
  fs.writeFileSync(path.join(base,"running-"+id+".json"),
    JSON.stringify({account:id,pid,when:Date.now()}));
  const attempt=context.testing.focusRunningAccount(id);
  let requestFile;
  for(let i=0;i<70;i++){
    await new Promise(r=>setTimeout(r,10));
    requestFile=fs.readdirSync(base).find(name=>name.startsWith("focus-"+id+"-")&&name.endsWith(".request.json"));
    if(requestFile)break;
  }
  assert(requestFile,"Focus request should target existing account");
  const request=JSON.parse(fs.readFileSync(path.join(base,requestFile),"utf8"));
  fs.writeFileSync(path.join(base,"focus-"+request.nonce+".ack.json"),
    JSON.stringify({account:id,pid,focused:false,visible:true}));
  const result=await attempt;
  assert.equal(result.reused,true,"Account is already running");
  assert.equal(result.focused,false,"Must not report account ready on failed focus");
  assert.equal(result.visible,true);
  console.log("WINDOW_SELECTION_PRIMARY_NOT_SPLASH=PASS");
  console.log("ACTUAL_FOREGROUND_VERIFICATION=PASS");
  console.log("WINDOW_Z_ORDER_FALLBACK_RESTORED=PASS");
  console.log("LIVE_ACCOUNT_NOT_DUPLICATED_ON_FOCUS_FAILURE=PASS");
 }finally{fs.rmSync(base,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

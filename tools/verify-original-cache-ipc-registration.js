'use strict';
// Read-only inspection of the recovered obfuscated runtime. Executes it only
// inside a sandbox with inert dependencies. Does not load Electron or touch
// any real profile or user files. The runtime normally stops at its mock.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../dist-electron/main-CuCOh59n.js'),'utf8');
let dummy;
const fn=function(){return dummy;};
dummy=new Proxy(fn,{
  get(t,key) {
    if(key==='then')return undefined;
    if(key===Symbol.toPrimitive)return ()=>0;
    if(key==='toString')return ()=>'';
    if(key==='valueOf')return ()=>0;
    if(key==='prototype')return fn.prototype;
    return dummy;
  },
  apply(){return dummy;},construct(){return dummy;},
  has(){return true;},set(){return true;},
  ownKeys(t){return Reflect.ownKeys(t);},
  getOwnPropertyDescriptor(t,key){return Reflect.getOwnPropertyDescriptor(t,key)||
      {configurable:true,writable:true,enumerable:true,value:dummy};}
});
const fakeProcess={env:{},platform:'win32',arch:'x64',versions:{},
  cwd:()=>__dirname,nextTick:()=>{},on(){},once(){},removeListener(){}};
const sandbox={module:{exports:{}},exports:{},require:()=>dummy,process:fakeProcess,
  console:{log(){},warn(){},error(){},info(){},debug(){}},
  Buffer,URL,URLSearchParams,TextEncoder,TextDecoder,
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},queueMicrotask(){}};
sandbox.global=sandbox;sandbox.globalThis=sandbox;
try{vm.runInNewContext(source,sandbox,{filename:'main-CuCOh59n.js',timeout:5000});}
catch(e){/* A sandboxed recovered app is expected not to finish initialization. */}
assert.equal(typeof sandbox._0x28d9a9,'function','Main string decoder unavailable in sandbox');
assert.equal(typeof sandbox._0x1acd6a,'function','Secondary decoder unavailable in sandbox');
// Reconstruct the exact statically inspected main registration:
// Vv='clear-dev-'+_0x1acd6a(-0x499,0x2222)
// x.ipcMain[_0x3f3e18('0x22c7','0x419e')](Vv,_0x2a7edd)
// _0x3f3e18(a,b) = _0x28d9a9(b,a - -0x346)
const name='clear-dev-'+sandbox._0x1acd6a(-0x499,0x2222);
const method=sandbox._0x28d9a9('0x419e',0x22c7+0x346);
assert.equal(name,'clear-dev-cache','Recovered main cache target changed unexpectedly');
assert.equal(method,'handle','Expected recovered cache IPC registration through handle()');
console.log('Original Electron registration for '+name+': ipcMain.'+method);
console.log('Original handler signature: async(event,{clearTypes,id,localDataConfig})');

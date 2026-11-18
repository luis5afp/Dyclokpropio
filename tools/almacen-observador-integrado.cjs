'use strict';
// diloakPRO 30.0.16: opt-in diagnostics; no HTTP bodies/headers, URLs with queries,
// credentials, browser profile contents or arbitrary private file paths.
const http=require('node:http'), https=require('node:https');
const net=require('node:net'), path=require('node:path'), fs=require('node:fs');
const crypto=require('node:crypto');
const {execFile}=require('node:child_process');
const {performance}=require('node:perf_hooks');
const METHODS=new Set(['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS']);
const PARTS=new Set('api gin openapi v1 v2 v3 v4 v5 v6 env envs profile profiles request start stop open close login logout sync data local remote status config info list update version download upload check proxy browser extension extensions user users get set settings health events session sessions http auth files file desktop windows'.split(' '));
function requestMetadata(args,protocol) {
  const target=args[0];
  const opts={...(target&&typeof target==='object'&&!(target instanceof URL)?target:{}),
    ...(args[1]&&typeof args[1]==='object'?args[1]:{})};
  let url;
  if(typeof target==='string'||target instanceof URL)try{url=new URL(String(target),protocol+'//localhost');}catch{}
  const action=String(opts.method||'GET').toUpperCase();
  if(!METHODS.has(action))return null;
  const hostname=String(opts.hostname||opts.host||url?.hostname||'').toLowerCase();
  const scope=/^(?:localhost|127(?:\.\d{1,3}){3}|\[?::1\]?)$/.test(hostname)?'local':'remote';
  let pathname;
  try{pathname=new URL(String(opts.path||opts.pathname||url?.pathname||'/'),'http://localhost').pathname;}catch{pathname='/';}
  const segments=pathname.split('/').filter(Boolean).slice(0,8);
  return {action,scope,routeTemplate:'/'+segments.map(v=>PARTS.has(v.toLowerCase())?v.toLowerCase():':id').join('/')};
}
function startNodeHttpTrace(emit) {
  const restores=[];
  for(const [mod,proto] of [[http,'http:'],[https,'https:']]){
    const original=mod.request;
    function traced(...args) {
      const req=original.apply(this,args);
      let meta;
      try{meta=requestMetadata(args,proto);}catch{return req;}
      if(!meta)return req;
      const requestId=crypto.randomUUID(),started=performance.now();
      // Content-Length is a declared size, not proof of actual bytes transmitted.
      // Never read request body, cookies, authorization or any other headers.
      let requestBytesDeclared=null;
      try{
        const length=req.getHeader('content-length');
        if(typeof length==='string' && /^\d{1,8}$/.test(length)){
          const parsed=Number(length);
          if(parsed<=33554432)requestBytesDeclared=parsed;
        }
      }catch{}
      const base={kind:'http',transport:'node',phase:'request',
        action:meta.action,scope:meta.scope,routeTemplate:meta.routeTemplate,requestId,
        ...(requestBytesDeclared===null?{}:{requestBytesDeclared})};
      try{emit(base);}catch{}
      let done=false;
      function finish(phase,res){
        if(done)return;done=true;
        const length=res?.headers?.['content-length'];
        const bytes=typeof length==='string'&&/^\d{1,8}$/.test(length)?Number(length):null;
        try{emit({...base,phase,elapsedMs:Math.max(0,Math.round(performance.now()-started)),
          status:Number.isInteger(res?.statusCode)?res.statusCode:null,
          bytes:Number.isSafeInteger(bytes)&&bytes<=33554432?bytes:null});}catch{}
      }
      req.once('response',res=>finish('response',res));
      req.once('error',()=>finish('error'));
      return req;
    }
    mod.request=traced;
    restores.push(()=>{if(mod.request===traced)mod.request=original;});
  }
  return ()=>restores.forEach(fn=>fn());
}
const PS=[
  "$ErrorActionPreference='Stop'",
  "$rootPid=__PID__",
  "$all=@(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name)",
  "$ids=New-Object 'System.Collections.Generic.HashSet[int]'",
  "[void]$ids.Add([int]$rootPid)",
  "for($n=0;$n -lt 8;$n++){foreach($item in $all){if($ids.Contains([int]$item.ParentProcessId)){[void]$ids.Add([int]$item.ProcessId)}}}",
  "$p=@($all | Where-Object {$ids.Contains([int]$_.ProcessId)} | Select-Object -First 80 -Property ProcessId,ParentProcessId,Name)",
  "$t=@(Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object {$ids.Contains([int]$_.OwningProcess) -and $_.RemotePort -gt 0} | Select-Object -First 150 -Property OwningProcess,RemoteAddress,RemotePort)",
  "$u=@(Get-NetUDPEndpoint -ErrorAction SilentlyContinue | Where-Object {$ids.Contains([int]$_.OwningProcess)} | Select-Object -First 80 -Property OwningProcess,LocalPort)",
  "ConvertTo-Json -InputObject @{processes=$p;tcp=$t;udp=$u} -Compress -Depth 3"
].join('\n');
function processClass(name){
  if(/^(?:DICloak|Dyclokpropio)\.exe$/i.test(name))return 'app';
  if(/^(?:chrome|chromium|ginsbrowser)\.exe$/i.test(name))return 'browser';
  if(/^gost\.exe$/i.test(name))return 'proxy';
  return 'child';
}
function parseWindowsSample(snapshot,emit,seen=new Set(),excludedPids=new Set()){
  if(!snapshot||typeof snapshot!=='object')return;
  // The PowerShell sampler itself is a temporary child process. Exclude its
  // entire subtree rather than repeatedly reporting the monitor as app work.
  const ignored=new Set(excludedPids);
  const processes=Array.isArray(snapshot.processes)?snapshot.processes:[];
  for(let i=0;i<8;i++){
    for(const p of processes){
      if(ignored.has(Number(p.ParentProcessId)))ignored.add(Number(p.ProcessId));
    }
  }
  for(const p of processes){
    if(ignored.has(Number(p.ProcessId)))continue;
    const pid=Number(p.ProcessId),ppid=Number(p.ParentProcessId);
    if(!Number.isSafeInteger(pid)||pid<1||!Number.isSafeInteger(ppid)||ppid<0)continue;
    const key='p:'+pid+':'+ppid;
    if(seen.has(key))continue;seen.add(key);
    emit({kind:'process',phase:'info',action:'seen',pid,ppid,processClass:processClass(p.Name)});
  }
  for(const [protocol,items] of [['TCP',snapshot.tcp],['UDP',snapshot.udp]]){
    for(const c of Array.isArray(items)?items:[]){
      const pid=Number(c.OwningProcess),port=Number(protocol==='TCP'?c.RemotePort:c.LocalPort);
      if(ignored.has(pid))continue;
      if(!Number.isSafeInteger(pid)||pid<1||!Number.isInteger(port)||port<0||port>65535)continue;
      const remoteIp=protocol==='TCP'&&net.isIP(c.RemoteAddress)?c.RemoteAddress:null;
      const key='c:'+pid+':'+protocol+':'+(remoteIp||'')+':'+port;
      if(seen.has(key))continue;seen.add(key);
      emit({kind:'connection',phase:'info',action:'seen',pid,protocol,remoteIp,remotePort:port});
    }
  }
}
function startWindowsSampler(emit,pid=process.pid){
  if(process.platform!=='win32')return ()=>{};
  let live=true,busy=false,errors=0;const seen=new Set();
  const script=PS.replace('__PID__',String(pid));
  function poll(){
    if(!live||busy||seen.size>=1500)return;busy=true;
    const child=execFile('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],
      {windowsHide:true,timeout:15000,maxBuffer:1500000},(err,stdout)=>{
        busy=false;if(!live)return;
        if(err){if(errors++<2)emit({kind:'session',phase:'error',code:'MONITOR_ERROR'});return;}
        try{parseWindowsSample(JSON.parse(stdout),emit,seen,new Set([child.pid]));}
        catch{if(errors++<2)emit({kind:'session',phase:'error',code:'MONITOR_ERROR'});}
      });
  }
  poll();const timer=setInterval(poll,6000);timer.unref?.();
  return ()=>{live=false;clearInterval(timer);};
}
function startLabWatcher(emit,root){
  if(process.platform!=='win32'||typeof root!=='string'||!path.isAbsolute(root))return ()=>{};
  const dir=path.join(root,'dyclok-diagnostic-lab');
  try{fs.mkdirSync(dir,{recursive:true});}catch{return ()=>{};}
  const recent=new Map();let watcher;
  try{watcher=fs.watch(dir,{persistent:false},(_,name)=>{
    if(typeof name!=='string'||name==='.'||name==='..'||name.includes('/')||name.includes('\\'))return;
    const now=Date.now();if(now-(recent.get(name)||0)<1500)return;recent.set(name,now);
    const ext=path.extname(name).slice(1).toLowerCase();
    const fileExt=['txt','json','csv','zip','bin','pdf'].includes(ext)?ext:'other';
    fs.promises.stat(path.join(dir,name)).then(stat=>{
      if(stat.isFile())emit({kind:'file',phase:'info',action:'changed',fileExt,
        bytes:Number.isSafeInteger(stat.size)&&stat.size<=33554432?stat.size:null});
    }).catch(()=>emit({kind:'file',phase:'info',action:'removed',fileExt}));
  });}catch{return ()=>{};}
  return ()=>watcher.close();
}
function startCapture({emit,pid=process.pid,labRoot}={}){
  if(typeof emit!=='function')throw new TypeError('emit required');
  const safeEmit=e=>{try{emit(e);}catch{}},stops=[];
  for(const factory of [()=>startNodeHttpTrace(safeEmit),
    ()=>startWindowsSampler(safeEmit,pid),()=>startLabWatcher(safeEmit,labRoot)]){
    try{stops.push(factory());}catch{safeEmit({kind:'session',phase:'error',code:'MONITOR_ERROR'});}
  }
  let stopped=false;
  return ()=>{if(stopped)return;stopped=true;for(const stop of stops)try{stop();}catch{}};
}
module.exports={requestMetadata,startNodeHttpTrace,parseWindowsSample,startCapture,processClass};
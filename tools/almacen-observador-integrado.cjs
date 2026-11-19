'use strict';
// Metadata-only by default. Literal synthetic response capture requires an exact
// user-allowlisted test URL AND a response fixture marker; never global logging.
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
// Count only bytes, never inspect or retain the transmitted content.
const MAX_REPORTED_BODY_BYTES=32*1024*1024;
function chunkSize(chunk,encoding){
  if(Buffer.isBuffer(chunk)||chunk instanceof Uint8Array)return chunk.byteLength;
  if(typeof chunk==='string'){
    try{return Buffer.byteLength(chunk,typeof encoding==='string'?encoding:'utf8');}
    catch{return null;}
  }
  return null;
}
// Explicit test fixture URL. Remote traffic must be HTTPS; HTTP is permitted on
// loopback only. This does not grant access to arbitrary vendor endpoints.
const MAX_LAB_CAPTURE_BYTES=64*1024;
const LAB_RESPONSE_MARKER='synthetic-only-v1';
function normalizeLabUrl(value){
  if(typeof value!=='string'||value.length>2048)return null;
  try{
    const url=new URL(value);
    if(url.username||url.password||url.hash)return null;
    if(url.protocol==='https:')return url;
    if(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname))
      return url;
  }catch{}
  return null;
}
function isLabResponse(res){
  const marker=res?.headers?.['x-diloakpro-fixture'];
  const type=res?.headers?.['content-type'];
  return marker===LAB_RESPONSE_MARKER&&typeof type==='string'&&
    /^application\\/vnd\\.diloakpro-lab\\+json(?:;|$)/i.test(type);
}
function labCookieValues(res){
  const raw=Array.isArray(res?.rawHeaders)?res.rawHeaders:[];
  const cookies=[];
  for(let i=0;i+1<raw.length;i+=2){
    if(String(raw[i]).toLowerCase()!=='set-cookie')continue;
    if(cookies.length>=8)return null;
    const value=raw[i+1];
    if(typeof value!=='string'||Buffer.byteLength(value,'utf8')>8192)return null;
    cookies.push(value);
  }
  return cookies;
}
function startNodeHttpTrace(emit,{labLiteralUrl=process.env.DILOAKPRO_TEST_LITERAL_URL}={}) {
  const allowedLabUrl=normalizeLabUrl(labLiteralUrl);
  const restores=[];
  for(const [mod,proto] of [[http,'http:'],[https,'https:']]){
    const original=mod.request;
    function traced(...args) {
      const req=original.apply(this,args);
      let meta;
      try{meta=requestMetadata(args,proto);}catch{return req;}
      if(!meta)return req;
      let matchedLabUrl=false;
      if(allowedLabUrl)try{
        // Compare exact URL including pathname and query, not just hostname.
        // The URL is used only as a predicate; it is not logged.
        const host=req.getHeader('host');
        const pathValue=req.path;
        const current=new URL(String(pathValue),proto+'//'+String(host));
        matchedLabUrl=current.href===allowedLabUrl.href;
      }catch{}
      const requestId=crypto.randomUUID(),started=performance.now();
      let requestBytesDeclared=null;
      try{
        const length=req.getHeader('content-length');
        if(typeof length==='string'&&/^\\d{1,8}$/.test(length)){
          const parsed=Number(length);
          if(parsed<=MAX_REPORTED_BODY_BYTES)requestBytesDeclared=parsed;
        }
      }catch{}
      const base={kind:'http',transport:'node',phase:'request',
        action:meta.action,scope:meta.scope,routeTemplate:meta.routeTemplate,requestId,
        ...(requestBytesDeclared===null?{}:{requestBytesDeclared})};
      const safeEmit=row=>{try{emit(row);}catch{}};
      safeEmit(base);
      let outbound=0,inbound=0,limited=false,transferred=false,done=false;
      const add=(direction,chunk,encoding)=>{
        const n=chunkSize(chunk,encoding);
        if(n===null)return;
        if(!Number.isSafeInteger(n)||n<0)return;
        if(direction==='out'){
          outbound+=n;
          if(outbound>MAX_REPORTED_BODY_BYTES)limited=true;
        }else{
          inbound+=n;
          if(inbound>MAX_REPORTED_BODY_BYTES)limited=true;
        }
      };
      const originalWrite=req.write;
      req.write=function(chunk,...rest){
        const result=originalWrite.apply(this,arguments);
        add('out',chunk,rest[0]);
        return result;
      };
      const originalEnd=req.end;
      req.end=function(chunk,...rest){
        const previous=outbound;
        const result=originalEnd.apply(this,arguments);
        // Node normally calls req.write() from end(chunk); avoid double count.
        if(outbound===previous)add('out',chunk,rest[0]);
        return result;
      };
      function indicators(res){
        let auth=false,cookie=false,proxyAuth=false;
        try{
          auth=req.hasHeader('authorization');
          cookie=req.hasHeader('cookie');
          proxyAuth=req.hasHeader('proxy-authorization');
        }catch{}
        const responseSetCookiePresent=Boolean(res&&res.headers&&
          Object.prototype.hasOwnProperty.call(res.headers,'set-cookie'));
        return {requestAuthorizationPresent:auth,requestCookiePresent:cookie,
          requestProxyAuthorizationPresent:proxyAuth,responseSetCookiePresent};
      }
      function transfer(state,res){
        if(transferred)return;
        transferred=true;
        safeEmit({...base,phase:'transfer',transferState:state,...indicators(res),
          byteCountLimited:limited,
          ...(limited?{}:{
            outboundBodyBytesQueued:outbound,inboundBodyBytesObserved:inbound
          })});
      }
      function finish(phase,res){
        if(done)return;
        done=true;
        const length=res?.headers?.['content-length'];
        const bytes=typeof length==='string'&&/^\\d{1,8}$/.test(length)?
          Number(length):null;
        let peerIp=null,peerPort=null;
        try{
          const address=res?.socket?.remoteAddress;
          const port=res?.socket?.remotePort;
          if(typeof address==='string'&&net.isIP(address))peerIp=address;
          if(Number.isInteger(port)&&port>=1&&port<=65535)peerPort=port;
        }catch{}
        safeEmit({...base,phase,elapsedMs:Math.max(0,Math.round(performance.now()-started)),
          status:Number.isInteger(res?.statusCode)?res.statusCode:null,
          bytes:Number.isSafeInteger(bytes)&&bytes<=MAX_REPORTED_BODY_BYTES?bytes:null,
          ...(peerIp?{peerIp}:{}),...(peerPort?{peerPort}:{}),
          ...indicators(res)});
      }
      // Install before the caller's response callback, without subscribing
      // to 'data' or changing the response stream's flow mode.
      req.prependOnceListener('response',res=>{
        const fixture=matchedLabUrl&&isLabResponse(res);
        let labChunks=[],labBytes=0,labLimited=false;
        const originalPush=res.push;
        res.push=function(chunk,...rest){
          const result=originalPush.apply(this,arguments);
          add('in',chunk,rest[0]);
          if(fixture&&chunk!=null&&!labLimited){
            const bytes=Buffer.isBuffer(chunk)?chunk:
              chunk instanceof Uint8Array?Buffer.from(chunk):
              typeof chunk==='string'?Buffer.from(chunk,typeof rest[0]==='string'?rest[0]:'utf8'):null;
            if(!bytes||labBytes+bytes.length>MAX_LAB_CAPTURE_BYTES){
              labLimited=true;labChunks=[];
            }else{labBytes+=bytes.length;labChunks.push(Buffer.from(bytes));}
          }
          return result;
        };
        res.once('end',()=>{
          if(fixture&&!labLimited){
            const cookies=labCookieValues(res);
            if(cookies!==null){
              const body=Buffer.concat(labChunks,labBytes);
              let literalBodyText=null;
              try{
                const decoded=new TextDecoder('utf-8',{fatal:true}).decode(body);
                if(Buffer.from(decoded,'utf8').equals(body))literalBodyText=decoded;
              }catch{}
              safeEmit({...base,phase:'lab_literal',
                literalBodyBase64:body.toString('base64'),
                literalBodySha256:crypto.createHash('sha256').update(body).digest('hex'),
                ...(literalBodyText!==null?{literalBodyText}:{}),
                literalSetCookieValues:cookies});
            }
          }
          transfer('response_end',res);
        });
        res.once('close',()=>transfer('response_closed',res));
        finish('response',res);
      });
      req.once('error',()=>{
        finish('error');
        transfer('request_error');
      });
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
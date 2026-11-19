'use strict';
/**
 * Explicit opt-in, exact-origin lab-only response recording.
 * Keeps only AES-256-GCM ciphertext of raw response headers/body from the
 * authorized lab origin. The live Node stream is not consumed, modified,
 * redirected or delayed by filesystem writes.
 * NEVER use as a generic traffic recorder; default is completely disabled.
 */
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const MAGIC=Buffer.from([0x44,0x50,0x4c,0x41,0x42,0x30,0x31,0x00]); // DPLAB01\0
const AAD=Buffer.from('diloakpro-lab-response-v1','ascii');
const MAX_BODY=4*1024*1024, MAX_FILES=24, MAX_TOTAL=16*1024*1024;
const MAX_META=64*1024;
function parseLabOrigin(text){
  if(typeof text!=='string'||text.length>240)return null;
  let u;
  try{u=new URL(text);}catch{return null;}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||
     u.pathname!=='/'||u.search||u.hash)return null;
  const host=u.hostname.toLowerCase();
  if(!host||host.length>180||host.includes('*')||
     host.endsWith('.dicloak.net')||host.endsWith('.dicloak.com')||
     host==='dicloak.net'||host==='dicloak.com'||
     host.endsWith('.ipflygates.com')||host==='ipflygates.com')return null;
  const isLoopback=['localhost','127.0.0.1','[::1]'].includes(host);
  if(u.protocol==='http:'&&!isLoopback)return null;
  if(host!== 'localhost'&&!net.isIP(host.replace(/^\[|\]$/g,''))&&
     !/^(?:[a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/.test(host))return null;
  return u.origin;
}
function requestLabUrl(args,protocol){
  try{
    const input=args[0],opt1=args[1],isURL=typeof input==='string'||input instanceof URL;
    const opts={...(!isURL&&input&&typeof input==='object'?input:{}),
      ...(opt1&&typeof opt1==='object'?opt1:{})};
    const host=String(opts.hostname||opts.host||'');
    const port=opts.port?':'+String(opts.port):'';
    const p=String(opts.path||opts.pathname||'/');
    const url=isURL?new URL(String(input)):new URL(protocol+'//'+host+port+p);
    // If options supply a distinct target or protocol, fail closed.
    if(isURL&&opts.hostname&&url.hostname.toLowerCase()!==String(opts.hostname).toLowerCase())return null;
    if(isURL&&opts.port&&Number(opts.port)!==Number(url.port|| (url.protocol==='https:'?443:80)))return null;
    if(url.protocol!==protocol||url.username||url.password)return null;
    return url;
  }catch{return null;}
}
function makeHeader(res,requestUrl,method){
  const rawHeaders=Array.isArray(res?.rawHeaders)?res.rawHeaders:[];
  if(rawHeaders.length>240||!rawHeaders.every(x=>typeof x==='string'&&x.length<8192))return null;
  const data=JSON.stringify({
    schema:1,receivedAt:new Date().toISOString(),
    requestUrl:String(requestUrl),method:String(method||'GET'),
    statusCode:res?.statusCode,statusMessage:String(res?.statusMessage||''),
    rawResponseHeaders:rawHeaders,
    bodyStorage:'original Node IncomingMessage stream bytes, before application decompression'
  });
  const content=Buffer.from(data,'utf8');
  if(content.length>MAX_META)return null;
  const prefix=Buffer.allocUnsafe(4);prefix.writeUInt32BE(content.length,0);
  return [prefix,content];
}
function deriveKey(passphrase,salt){
 return crypto.scryptSync(passphrase,salt,32,{N:16384,r:8,p:1,maxmem:64*1024*1024});
}
function createLabResponseCapture({config=process.env,root,emit=()=>{}}={}){
  if(config.DILOAKPRO_LAB_CAPTURE_ENABLE!=='1')return null;
  const allowedOrigin=parseLabOrigin(config.DILOAKPRO_LAB_CAPTURE_ORIGIN);
  const passphrase=config.DILOAKPRO_LAB_CAPTURE_PASSPHRASE;
  let enabled=false,sessions=0,totalBody=0;
  const activeResponses=new Set();
  const publish=row=>{try{emit(row);}catch{}};
  if(!allowedOrigin){
    publish({kind:'lab',phase:'unavailable',reason:'invalid_lab_origin'});return null;
  }
  if(typeof passphrase!=='string'||passphrase.length<16){
    publish({kind:'lab',phase:'unavailable',reason:'missing_passphrase'});return null;
  }
  if(typeof root!=='string'||!path.isAbsolute(root)){
    publish({kind:'lab',phase:'unavailable',reason:'invalid_lab_root'});return null;
  }
  const folder=path.join(root,'LabCaptures',
    new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(4).toString('hex'));
  try{fs.mkdirSync(folder,{recursive:true,mode:0o700});}catch{
    publish({kind:'lab',phase:'unavailable',reason:'lab_directory_failed'});return null;
  }
  const salt=crypto.randomBytes(16);
  let key;
  try{key=deriveKey(passphrase,salt);}catch{
    publish({kind:'lab',phase:'unavailable',reason:'lab_encryption_failed'});return null;
  }
  enabled=true;
  publish({kind:'lab',phase:'active',reason:'enabled'});
  function begin({args,protocol,res,method='GET'}={}){
    if(!enabled||sessions>=MAX_FILES||totalBody>=MAX_TOTAL)return null;
    const url=requestLabUrl(args,protocol);
    if(!url||url.origin!==allowedOrigin)return null;
    const h=makeHeader(res,url,method);
    if(!h){publish({kind:'lab',phase:'skipped',reason:'lab_metadata_too_large'});return null;}
    sessions++;
    const id=crypto.randomUUID(),nonce=crypto.randomBytes(12);
    let cipher,chunks=[],bodyBytes=0,ok=true,done=false;
    try{
      cipher=crypto.createCipheriv('aes-256-gcm',key,nonce);
      cipher.setAAD(AAD);
      chunks.push(cipher.update(h[0]),cipher.update(h[1]));
    }catch{
      publish({kind:'lab',phase:'skipped',reason:'lab_encryption_failed'});return null;
    }
    const release=()=>{done=true;chunks=[];activeResponses.delete(cancel);};
    const cancel=()=>{release();};
    activeResponses.add(cancel);
    const add=(chunk,encoding)=>{
      if(!enabled||!ok||done||chunk===null||chunk===undefined)return;
      let content;
      if(Buffer.isBuffer(chunk)||chunk instanceof Uint8Array)content=chunk;
      else if(typeof chunk==='string'){
        try{content=Buffer.from(chunk,typeof encoding==='string'?encoding:'utf8');}
        catch{ok=false;return;}
      }else{ok=false;return;}
      if(content.length>MAX_BODY-bodyBytes||content.length>MAX_TOTAL-totalBody){
        ok=false;chunks=[];publish({kind:'lab',phase:'skipped',reason:'lab_size_limit'});
        return;
      }
      bodyBytes+=content.length;totalBody+=content.length;
      try{chunks.push(cipher.update(content));}catch{ok=false;chunks=[];}
    };
    function complete(state){
      if(done)return;
      done=true;
      activeResponses.delete(cancel);
      if(!enabled||state!=='response_end'||!ok){
        chunks=[];return;
      }
      let output;
      try{
        chunks.push(cipher.final());
        const tag=cipher.getAuthTag();
        output=Buffer.concat([MAGIC,salt,nonce,tag,...chunks]);
      }catch{
        publish({kind:'lab',phase:'skipped',reason:'lab_encryption_failed'});
        chunks=[];return;
      }
      chunks=[];
      const fileName=id+'.dplab';
      void fs.promises.writeFile(path.join(folder,fileName),output,{flag:'wx',mode:0o600})
        .then(()=>publish({kind:'lab',phase:'saved',reason:'encrypted',
          encryptedBytes:output.length,receivedBodyBytes:bodyBytes}))
        .catch(()=>publish({kind:'lab',phase:'unavailable',reason:'lab_write_failed'}))
        .finally(()=>output.fill(0));
    }
    return Object.freeze({add,complete});
  }
  return Object.freeze({begin,stop:()=>{
    if(!enabled)return;
    enabled=false;
    for(const cancel of activeResponses)try{cancel();}catch{}
    activeResponses.clear();
    key.fill(0);
    publish({kind:'lab',phase:'stopped',reason:'capture_finished'});
  },folder,allowedOrigin});
}
function decryptLabCapture(bytes,passphrase){
 if(!Buffer.isBuffer(bytes)||bytes.length<52||!bytes.subarray(0,8).equals(MAGIC))
   throw Error('INVALID_LAB_CAPTURE');
 const salt=bytes.subarray(8,24),nonce=bytes.subarray(24,36),
   tag=bytes.subarray(36,52),data=bytes.subarray(52);
 const key=deriveKey(passphrase,salt);
 try{
   const decipher=crypto.createDecipheriv('aes-256-gcm',key,nonce);
   decipher.setAAD(AAD);decipher.setAuthTag(tag);
   const output=Buffer.concat([decipher.update(data),decipher.final()]);
   if(output.length<4)throw Error('INVALID_LAB_CONTENT');
   const size=output.readUInt32BE(0);
   if(size>MAX_META||size>output.length-4)throw Error('INVALID_LAB_METADATA');
   let metadata;
   try{metadata=JSON.parse(output.subarray(4,4+size).toString('utf8'));}
   catch{throw Error('INVALID_LAB_METADATA');}
   return {metadata,body:output.subarray(4+size)};
 }finally{key.fill(0);}
}
module.exports={parseLabOrigin,requestLabUrl,createLabResponseCapture,decryptLabCapture};

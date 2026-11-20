'use strict';
// Captura opcional y acotada de TU origen de laboratorio; la interfaz principal
// de diloakPRO nunca pide configuración ni activa esta función por defecto.
// Conserva el cuerpo Node IncomingMessage tal como llega, ANTES de descomprimir.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const net=require('node:net');
const MAGIC=Buffer.from('DPLAB01\0','binary');
const AAD=Buffer.from('diloakpro-lab-response-v1','ascii');
const MAX_BODY=4*1024*1024, MAX_FILES=24, MAX_TOTAL=16*1024*1024;
function parseLabOrigin(value){
  if(typeof value!=='string'||value.length>240)return null;
  let u;try{u=new URL(value);}catch{return null;}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||
     u.pathname!=='/'||u.search||u.hash)return null;
  const host=u.hostname.toLowerCase();
  if(!host||host.length>180||host.includes('*')||
     /(^|\.)dicloak\.(?:com|net)$|(^|\.)ipflygates\.com$/.test(host))return null;
  const loopback=['localhost','127.0.0.1','[::1]'].includes(host);
  if(u.protocol==='http:'&&!loopback)return null;
  if(!loopback&&!net.isIP(host.replace(/^\[|\]$/g,''))&&
     !/^(?:[a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/.test(host))return null;
  return u.origin;
}
function requestLabUrl(args,protocol){
  try{
    const first=args[0],options=args[1]&&typeof args[1]==='object'?args[1]:{};
    const isURL=typeof first==='string'||first instanceof URL;
    const opts={...(!isURL&&first&&typeof first==='object'?first:{}),...options};
    const u=isURL?new URL(String(first)):
      new URL(protocol+'//'+String(opts.hostname||opts.host||'')+
       (opts.port?':'+String(opts.port):'')+String(opts.path||opts.pathname||'/'));
    if(u.protocol!==protocol||u.username||u.password)return null;
    if(isURL&&opts.hostname&&u.hostname.toLowerCase()!==String(opts.hostname).toLowerCase())return null;
    if(isURL&&opts.port&&Number(opts.port)!==Number(u.port||(u.protocol==='https:'?443:80)))return null;
    return u;
  }catch{return null;}
}
function createLabResponseCapture({config=process.env,root,emit=()=>{}}={}){
  if(config.DILOAKPRO_LAB_CAPTURE_ENABLE!=='1')return null;
  const origin=parseLabOrigin(config.DILOAKPRO_LAB_CAPTURE_ORIGIN);
  const phrase=config.DILOAKPRO_LAB_CAPTURE_PASSPHRASE;
  const announce=(phase,reason,more={})=>{
    try{emit({kind:'lab',phase,reason,...more});}catch{}
  };
  if(!origin){announce('unavailable','invalid_origin');return null;}
  if(typeof phrase!=='string'||phrase.length<16){
    announce('unavailable','missing_passphrase');return null;
  }
  if(typeof root!=='string'||!path.isAbsolute(root)){
    announce('unavailable','invalid_root');return null;
  }
  const dir=path.join(root,'LabCaptures',
    new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(4).toString('hex'));
  let key;
  const salt=crypto.randomBytes(16);
  try{
    fs.mkdirSync(dir,{recursive:true,mode:0o700});
    key=crypto.scryptSync(phrase,salt,32,{N:16384,r:8,p:1,maxmem:64*1024*1024});
  }catch{announce('unavailable','initialization_failed');return null;}
  let running=true,savedCount=0,bodyTotal=0;
  const active=new Set();
  announce('active','configured');
  function begin({args,protocol,res,method='GET'}={}){
    if(!running||savedCount>=MAX_FILES||bodyTotal>=MAX_TOTAL)return null;
    const u=requestLabUrl(args,protocol);
    if(!u||u.origin!==origin)return null; // Fail closed on third-party traffic.
    const rawHeaders=res&&Array.isArray(res.rawHeaders)?res.rawHeaders:[];
    if(rawHeaders.length>240||!rawHeaders.every(x=>typeof x==='string'&&x.length<8192))
      return null;
    const meta=Buffer.from(JSON.stringify({
      schema:1,requestUrl:String(u),method:String(method),receivedAt:new Date().toISOString(),
      statusCode:res.statusCode,statusMessage:String(res.statusMessage||''),
      rawResponseHeaders:rawHeaders,
      boundary:'node_incoming_message_before_content_decoding'
    }),'utf8');
    if(meta.length>65536)return null;
    savedCount++;
    const id=crypto.randomUUID(),nonce=crypto.randomBytes(12);
    const serverHeader=res.headers&&res.headers['x-diloakpro-body-sha256'];
    const serverSha=typeof serverHeader==='string'&&/^[a-f0-9]{64}$/i.test(serverHeader)?
      serverHeader.toLowerCase():null;
    const sha=crypto.createHash('sha256');
    let cipher,chunks=[],size=0,valid=true,finished=false;
    try{
      cipher=crypto.createCipheriv('aes-256-gcm',key,nonce);
      cipher.setAAD(AAD);
      const length=Buffer.alloc(4);length.writeUInt32BE(meta.length);
      chunks.push(cipher.update(length),cipher.update(meta));
    }catch{announce('unavailable','encryption_failed');return null;}
    const cancel=()=>{finished=true;chunks=[];active.delete(cancel);};
    active.add(cancel);
    function add(chunk,encoding){
      if(finished||!valid||!running||chunk==null)return;
      let bytes;
      try{
        bytes=Buffer.isBuffer(chunk)||chunk instanceof Uint8Array?Buffer.from(chunk):
          typeof chunk==='string'?Buffer.from(chunk,typeof encoding==='string'?encoding:'utf8'):null;
      }catch{bytes=null;}
      if(!bytes||bytes.length>MAX_BODY-size||bytes.length>MAX_TOTAL-bodyTotal){
        valid=false;chunks=[];announce('skipped','size_or_type_limit');return;
      }
      size+=bytes.length;bodyTotal+=bytes.length;
      try{sha.update(bytes);chunks.push(cipher.update(bytes));}catch{valid=false;chunks=[];}
    }
    function complete(state){
      if(finished)return;
      finished=true;active.delete(cancel);
      if(!running||state!=='response_end'||!valid){chunks=[];return;}
      let data;
      try{
        chunks.push(cipher.final());
        data=Buffer.concat([MAGIC,salt,nonce,cipher.getAuthTag(),...chunks]);
      }catch{chunks=[];announce('unavailable','encryption_failed');return;}
      chunks=[];
      const clientSha=sha.digest('hex');
      const same=serverSha===null?null:serverSha===clientSha;
      const reason=same===true?'sha256_match':same===false?'sha256_mismatch':
        serverHeader===undefined?'server_proof_missing':'invalid_server_proof';
      const proof={
        schema:1,version:'diloakPRO 30.0.27 candidato',
        receivedBodyBoundary:'node_http_incoming_message_before_content_decoding',
        fileName:id+'.dplab',receivedBytes:size,clientSha256:clientSha,
        serverSha256:serverSha,byteForByteMatchesServer:same,reason
      };
      void fs.promises.writeFile(path.join(dir,id+'.dplab'),data,{flag:'wx',mode:0o600})
        .then(()=>fs.promises.writeFile(path.join(dir,id+'.proof.json'),
          JSON.stringify(proof,null,2)+'\n',{flag:'wx',mode:0o600}))
        .then(()=>{
          announce('saved','encrypted',{receivedBytes:size});
          announce(same===true?'verified':'unverified',reason);
        }).catch(()=>announce('unavailable','write_failed'))
        .finally(()=>data.fill(0));
    }
    return {add,complete};
  }
  function stop(){
    if(!running)return;
    running=false;
    for(const cancel of active)try{cancel();}catch{}
    active.clear();key.fill(0);
    announce('stopped','capture_finished');
  }
  return {origin,dir,begin,stop};
}
function decryptLabCapture(bytes,phrase){
  if(!Buffer.isBuffer(bytes)||bytes.length<52||!bytes.subarray(0,8).equals(MAGIC))
    throw new Error('INVALID_LAB_CAPTURE');
  const salt=bytes.subarray(8,24),nonce=bytes.subarray(24,36),
    tag=bytes.subarray(36,52),body=bytes.subarray(52);
  const key=crypto.scryptSync(phrase,salt,32,{N:16384,r:8,p:1,maxmem:64*1024*1024});
  try{
    const decipher=crypto.createDecipheriv('aes-256-gcm',key,nonce);
    decipher.setAAD(AAD);decipher.setAuthTag(tag);
    const plain=Buffer.concat([decipher.update(body),decipher.final()]);
    if(plain.length<4)throw new Error('INVALID_LAB_CONTENT');
    const length=plain.readUInt32BE(0);
    if(length>65536||length>plain.length-4)throw new Error('INVALID_LAB_METADATA');
    return {metadata:JSON.parse(plain.subarray(4,4+length).toString('utf8')),
      body:plain.subarray(4+length)};
  }finally{key.fill(0);}
}
module.exports={parseLabOrigin,requestLabUrl,createLabResponseCapture,decryptLabCapture};

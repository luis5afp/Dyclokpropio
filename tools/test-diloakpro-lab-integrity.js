'use strict';
// Datos totalmente inventados: prueba de igualdad de bytes y cifrado local.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const crypto=require('node:crypto');
const zlib=require('node:zlib');
const {createLabResponseCapture,parseLabOrigin,decryptLabCapture}=
  require('../src/main/diloakpro-lab-response-capture.js');
const {startNodeHttpTrace}=require('../src/main/diagnostic-observer.js');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-lab-test-'));
const fakeJson=Buffer.from(JSON.stringify({
  profile:{credentials:{username:'fake@example.invalid',password:'FICTICIA-NO-UTILIZAR'},
    cookies:[{name:'LAB',value:'COOKIES-DE-PRUEBA'}],
    proxy:{host:'127.0.0.1',password:'CLAVE-DE-PRUEBA'},
    extensions:[{id:'extension-ficticia'}],
    fingerprint:{timezone:'America/Lima'},
    chromium:{args:['--window-size=800,600']}}
}),'utf8');
function waitFor(check,timeout=4000){
  const start=Date.now();
  return new Promise((resolve,reject)=>{
    function tick(){
      if(check())return resolve();
      if(Date.now()-start>timeout)return reject(new Error('TEST_TIMEOUT'));
      setTimeout(tick,20);
    }
    tick();
  });
}
async function scenario(gzip,validProof){
  const raw=gzip?zlib.gzipSync(fakeJson):fakeJson;
  const server=http.createServer((req,res)=>{
    res.setHeader('Content-Type','application/json');
    if(gzip)res.setHeader('Content-Encoding','gzip');
    if(validProof===true)res.setHeader('X-Diloakpro-Body-SHA256',
      crypto.createHash('sha256').update(raw).digest('hex'));
    else if(validProof===false)res.setHeader('X-Diloakpro-Body-SHA256','0'.repeat(64));
    res.end(raw);
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const origin='http://127.0.0.1:'+server.address().port;
  const root=fs.mkdtempSync(path.join(temp,'capture-'));
  const events=[];
  const capture=createLabResponseCapture({config:{
    DILOAKPRO_LAB_CAPTURE_ENABLE:'1',
    DILOAKPRO_LAB_CAPTURE_ORIGIN:origin,
    DILOAKPRO_LAB_CAPTURE_PASSPHRASE:'SOLO-DATOS-DE-PRUEBA-2026'
  },root,emit:e=>events.push(e)});
  assert.ok(capture);
  const stopTrace=startNodeHttpTrace(()=>{},{labCapture:capture});
  try{
    const incoming=await new Promise((resolve,reject)=>{
      http.get(origin+'/lab',res=>{
        const chunks=[];
        res.on('data',chunk=>chunks.push(chunk));
        res.on('end',()=>resolve(Buffer.concat(chunks)));
        res.on('error',reject);
      }).on('error',reject);
    });
    assert.deepEqual(incoming,raw);
    await waitFor(()=>fs.readdirSync(capture.dir).filter(x=>x.endsWith('.proof.json')).length===1);
    const proofName=fs.readdirSync(capture.dir).find(x=>x.endsWith('.proof.json'));
    const proof=JSON.parse(fs.readFileSync(path.join(capture.dir,proofName),'utf8'));
    assert.equal(proof.receivedBytes,raw.length);
    assert.equal(proof.clientSha256,crypto.createHash('sha256').update(raw).digest('hex'));
    assert.equal(proof.byteForByteMatchesServer,validProof===null?null:validProof);
    const encrypted=fs.readFileSync(path.join(capture.dir,proof.fileName));
    assert.equal(encrypted.includes(fakeJson),false);
    const decrypted=decryptLabCapture(encrypted,'SOLO-DATOS-DE-PRUEBA-2026');
    assert.deepEqual(decrypted.body,raw);
    assert.equal(decrypted.metadata.requestUrl,origin+'/lab');
    assert.equal(events.some(e=>e.kind==='lab'&&e.phase==='saved'),true);
  }finally{
    stopTrace();
    capture.stop();
    await new Promise(ok=>server.close(ok));
  }
}
(async()=>{
  assert.equal(createLabResponseCapture({config:{},root:temp}),null);
  assert.equal(parseLabOrigin('https://gin-server.dicloak.net'),null);
  assert.equal(parseLabOrigin('http://not-local.example.invalid'),null);
  assert.equal(parseLabOrigin('http://127.0.0.1:8765'),'http://127.0.0.1:8765');
  await scenario(false,true);
  await scenario(true,true);
  await scenario(true,false);
  await scenario(false,null);
  console.log('PASS: dylokPRO exact-origin encrypted lab capture, HTTP and gzip SHA-256.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{
  fs.rmSync(temp,{recursive:true,force:true});
});

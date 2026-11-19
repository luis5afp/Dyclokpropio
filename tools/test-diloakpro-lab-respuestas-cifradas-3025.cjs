'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const zlib=require('node:zlib');
const {
 parseLabOrigin,requestLabUrl,createLabResponseCapture,decryptLabCapture
}=require('./diloak-lab-response-capture.cjs');
const {startNodeHttpTrace,startCapture}=require('./almacen-observador-integrado.cjs');
const {validateDiagnostic,mapNativeEvent,startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const SECRET='FAKE_ONLY_AUTH_COOKIE_PROXY_TOKEN_2FA_2026';
const PASSPHRASE='Correct-Horse-Battery-Staple-Lab-Only-2026';

test('capture only strict exact origin: vendor domains blocked, remote plain HTTP refused',()=>{
 assert.equal(parseLabOrigin('https://gin-server.dicloak.net'),null);
 assert.equal(parseLabOrigin('https://ltrack.dicloak.com'),null);
 assert.equal(parseLabOrigin('http://accel.ipflygates.com:5001'),null);
 assert.equal(parseLabOrigin('https://*.example.test'),null);
 assert.equal(parseLabOrigin('http://test.example.test:8080'),null);
 assert.equal(parseLabOrigin('https://lab.example.test:9443'),'https://lab.example.test:9443');
 assert.equal(parseLabOrigin('http://127.0.0.1:14444'),'http://127.0.0.1:14444');
 assert.equal(parseLabOrigin('https://lab.example.test/path'),null);
 assert.equal(parseLabOrigin('https://lab.example.test?token='+SECRET),null);
 assert.equal(requestLabUrl(['http://127.0.0.1:14444/a?token='+SECRET],
   'http:')?.origin,'http://127.0.0.1:14444');
 assert.equal(requestLabUrl(['https://lab.example.test/a'],'http:'),null);
});

test('explicit AES-GCM lab capture preserves original headers, URL, and compressed binary body without altering stream',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloak-lab-e2e-'));
 const body=zlib.gzipSync(Buffer.from(JSON.stringify({
   email:'test@example.test',password:SECRET,proxy:{password:SECRET},
   cookie:'SESSION='+SECRET,token:SECRET,twoFactorCode:'000000'
 })));
 const server=http.createServer((req,res)=>{
   res.writeHead(200,{'Content-Type':'application/json',
     'Content-Encoding':'gzip','Set-Cookie':'lab_token='+SECRET+'; HttpOnly'});
   res.write(body.subarray(0,16));res.end(body.subarray(16));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port,origin='http://127.0.0.1:'+port;
 const rows=[];
 const capture=createLabResponseCapture({
  root:dir,emit:row=>rows.push(row),
  config:{DILOAKPRO_LAB_CAPTURE_ENABLE:'1',
    DILOAKPRO_LAB_CAPTURE_ORIGIN:origin,
    DILOAKPRO_LAB_CAPTURE_PASSPHRASE:PASSPHRASE}
 });
 assert.ok(capture);
 const stop=startNodeHttpTrace(row=>rows.push(row),{labCapture:capture});
 try{
   const url=origin+'/gin/v1/env/'+SECRET+'?auth='+SECRET;
   const got=await new Promise((resolve,reject)=>{
     http.get(url,res=>{
       const chunks=[];res.on('data',x=>chunks.push(x));
       res.on('end',()=>resolve(Buffer.concat(chunks)));
       res.on('error',reject);
     }).on('error',reject);
   });
   assert.deepEqual(got,body,'server bytes unchanged for the application');
   for(let i=0;i<60&&!rows.some(x=>x.kind==='lab'&&x.phase==='saved');i++)
     await new Promise(resolve=>setTimeout(resolve,10));
   assert.ok(rows.some(x=>x.kind==='lab'&&x.phase==='saved'));
   const files=fs.readdirSync(capture.folder);
   assert.equal(files.length,1);
   assert.ok(files[0].endsWith('.dplab'));
   const encrypted=fs.readFileSync(path.join(capture.folder,files[0]));
   assert.ok(!encrypted.includes(Buffer.from(SECRET)));
   assert.ok(!encrypted.includes(Buffer.from('Set-Cookie')));
   const clear=decryptLabCapture(encrypted,PASSPHRASE);
   assert.equal(clear.metadata.requestUrl,url);
   assert.equal(clear.metadata.statusCode,200);
   assert.ok(clear.metadata.rawResponseHeaders.includes('Set-Cookie'));
   assert.ok(clear.metadata.rawResponseHeaders.some(x=>x.includes(SECRET)));
   assert.deepEqual(clear.body,body,'binary bytes exactly match compressed server response');
   assert.ok(!JSON.stringify(rows).includes(SECRET));
   assert.ok(!JSON.stringify(rows).includes(url));
   const safe=rows.map(mapNativeEvent).filter(Boolean).map(validateDiagnostic);
   const panel=await startDiagnosticPanel({observeOnOpen:false});
   try{
     for(const row of safe)panel.emit(row);
     const state=panel.getState();
     assert.equal(state.checks.networkMetadata.labCaptureSaved,1);
     assert.equal(state.checks.networkMetadata.labCaptureBytes,body.length);
     assert.ok(!JSON.stringify(state).includes(SECRET));
   }finally{await panel.stop();}
   assert.throws(()=>decryptLabCapture(encrypted,'incorrect-passphrase'),
     /auth|authenticate|Unsupported state/i);
   const modified=Buffer.from(encrypted);
   modified[modified.length-1]^=0x01;
   assert.throws(()=>decryptLabCapture(modified,PASSPHRASE),
     /auth|authenticate|Unsupported state/i);
 }finally{
   stop();capture.stop();await new Promise(resolve=>server.close(resolve));
   fs.rmSync(dir,{recursive:true,force:true});
 }
});

test('disabled or invalid lab consent writes no files, no passive credential capture',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloak-no-lab-'));
 try{
   assert.equal(createLabResponseCapture({root:dir,config:{}}),null);
   assert.deepEqual(fs.readdirSync(dir),[]);
   const reasons=[];
   assert.equal(createLabResponseCapture({root:dir,
     config:{DILOAKPRO_LAB_CAPTURE_ENABLE:'1',
       DILOAKPRO_LAB_CAPTURE_ORIGIN:'https://gin-server.dicloak.net',
       DILOAKPRO_LAB_CAPTURE_PASSPHRASE:PASSPHRASE},
     emit:r=>reasons.push(r)}),null);
   assert.equal(reasons[0].reason,'invalid_lab_origin');
   assert.deepEqual(fs.readdirSync(dir),[]);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('capture is origin-and-port-specific, never records other localhost origin',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloak-lab-filter-'));
 const servers=[];
 async function server(){
   const s=http.createServer((req,res)=>res.end('private synthetic '+SECRET));
   await new Promise(resolve=>s.listen(0,'127.0.0.1',resolve));
   servers.push(s);return s;
 }
 const a=await server(),b=await server();
 const config={DILOAKPRO_LAB_CAPTURE_ENABLE:'1',
   DILOAKPRO_LAB_CAPTURE_ORIGIN:'http://127.0.0.1:'+a.address().port,
   DILOAKPRO_LAB_CAPTURE_PASSPHRASE:PASSPHRASE};
 const rows=[],cap=createLabResponseCapture({config,root:dir,emit:r=>rows.push(r)});
 const stop=startNodeHttpTrace(x=>rows.push(x),{labCapture:cap});
 try{
   await new Promise((resolve,reject)=>{
     const req=http.get('http://127.0.0.1:'+b.address().port+'/session',res=>{
       res.resume();res.once('end',resolve);
     });req.once('error',reject);
   });
   await new Promise(resolve=>setTimeout(resolve,15));
   assert.deepEqual(fs.readdirSync(cap.folder),[]);
   assert.equal(rows.filter(x=>x.phase==='saved').length,0);
 }finally{
   stop();cap.stop();
   await Promise.all(servers.map(s=>new Promise(resolve=>s.close(resolve))));
   fs.rmSync(dir,{recursive:true,force:true});
 }
});

test('capture validation never accepts raw password material in browser diagnostics',()=>{
 assert.throws(()=>validateDiagnostic({source:'programa',event:'lab_capture_saved',
   labReason:'password='+SECRET}),/INVALID_LAB_REASON/);
 assert.throws(()=>validateDiagnostic({source:'programa',event:'lab_capture_saved',
   labReceivedBodyBytes:SECRET}),/INVALID_LAB_SIZE/);
 const mapped=mapNativeEvent({kind:'lab',phase:'saved',reason:'encrypted',
   encryptedBytes:420,receivedBodyBytes:123,headers:{Cookie:SECRET},
   responseBody:SECRET});
 const safe=validateDiagnostic(mapped);
 assert.equal(safe.labReceivedBodyBytes,123);
 assert.ok(!JSON.stringify(safe).includes(SECRET));
});

test('disabled startCapture remains entirely metadata-only without userData directory',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloak-lab-off-'));
 const previous=process.env.DILOAKPRO_LAB_CAPTURE_ENABLE;
 delete process.env.DILOAKPRO_LAB_CAPTURE_ENABLE;
 try{
   const stop=startCapture({emit:()=>{},labRoot:dir,pid:process.pid});
   stop();
   assert.deepEqual(fs.readdirSync(dir),[]);
 }finally{
   if(previous===undefined)delete process.env.DILOAKPRO_LAB_CAPTURE_ENABLE;
   else process.env.DILOAKPRO_LAB_CAPTURE_ENABLE=previous;
   fs.rmSync(dir,{recursive:true,force:true});
 }
});

'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const {mapNativeEvent,validateDiagnostic,startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const SECRET='AUTH_PASSWORD_COOKIE_SESSION_SHOULD_NOT_APPEAR_2026';

test('server response reaches DICloak unchanged: observer only HMACs chunks before stream consumption',async()=>{
 const input=Buffer.from(JSON.stringify({token:SECRET,auth:SECRET,proxyPassword:SECRET,cookie:SECRET}));
 const server=http.createServer((req,res)=>{
   res.writeHead(200,{'Content-Type':'application/json',
     'Set-Cookie':'session='+SECRET+'; HttpOnly'});
   res.write(input.subarray(0,17));
   res.end(input.subarray(17));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const traces=[];
 const stop=startNodeHttpTrace(row=>traces.push(row));
 let responseData;
 try{
   responseData=await new Promise((resolve,reject)=>{
     const req=http.request('http://127.0.0.1:'+server.address().port+'/gin/v1/env/'+SECRET,
       res=>{
         assert.equal(res.statusCode,200);
         const chunks=[];
         res.on('data',chunk=>chunks.push(chunk));
         res.once('end',()=>resolve(Buffer.concat(chunks)));
         res.once('error',reject);
       });
     req.once('error',reject);req.end();
   });
   assert.deepEqual(responseData,input,'application must receive byte-identical response body');
   const transfer=traces.find(e=>e.phase==='transfer'&&e.transferState==='response_end');
   assert.ok(transfer,'completion must be observed');
   assert.equal(transfer.inboundBodyBytesObserved,input.length);
   assert.equal(transfer.inboundStreamComplete,true);
   assert.equal(transfer.proofScope,'node_received_stream_hmac_ephemeral');
   assert.match(transfer.inboundStreamProof,/^[a-f0-9]{64}$/);
   assert.ok(transfer.inboundChunkCount>=1);
   assert.ok(!JSON.stringify(traces).includes(SECRET),'not one raw value in trace');
   assert.ok(!JSON.stringify(traces).includes(input.toString('utf8')));
   const safe=traces.map(mapNativeEvent).filter(Boolean).map(validateDiagnostic);
   const panel=await startDiagnosticPanel({observeOnOpen:false});
   try{
     for(const e of safe)panel.emit(e);
     const state=panel.getState();
     assert.equal(state.checks.networkMetadata.nodeInboundProofs,1);
     assert.equal(state.audit.summary.receivedStreamProofs,1);
     assert.equal(state.audit.http[0].inboundStreamProof,transfer.inboundStreamProof);
     assert.equal(state.audit.http[0].inboundStreamComplete,true);
     assert.ok(!JSON.stringify(state).includes(SECRET));
     assert.equal(state.audit.verification.serverToClientPayloadEqual,
       'not_verified_without_paired_proofs');
   }finally{await panel.stop();}
 }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

test('proof is capture-scoped, not a reusable unkeyed content digest',async()=>{
 const observations=[];
 for(let run=0;run<2;run++){
   const server=http.createServer((req,res)=>res.end('test response content'));
   await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
   const traces=[],stop=startNodeHttpTrace(e=>traces.push(e));
   try{
     await new Promise((resolve,reject)=>{
       const req=http.get('http://127.0.0.1:'+server.address().port+'/data',
         res=>{res.resume();res.once('end',resolve);res.once('error',reject)});
       req.once('error',reject);
     });
     observations.push(traces.find(x=>x.phase==='transfer')?.inboundStreamProof);
   }finally{stop();await new Promise(resolve=>server.close(resolve));}
 }
 assert.equal(observations.length,2);
 assert.ok(observations.every(x=>typeof x==='string'&&x.length===64));
 assert.notEqual(observations[0],observations[1],
   'different capture keys prevent tracking raw payload across captures');
 assert.notEqual(observations[0],crypto.createHash('sha256').update('test response content').digest('hex'),
   'proof does not expose an ordinary SHA-256 digest of private payload');
});

test('incomplete transfer cannot appear as fully received proof',async()=>{
 const server=http.createServer((req,res)=>{
   res.writeHead(200,{'Content-Length':250});
   res.write('partial body');
   setImmediate(()=>res.destroy());
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const traces=[],stop=startNodeHttpTrace(e=>traces.push(e));
 try{
   await new Promise(resolve=>{
     const req=http.get('http://127.0.0.1:'+server.address().port+'/private',
       res=>{res.on('data',()=>{});res.once('close',resolve);res.on('error',()=>{})});
     req.once('error',resolve);
   });
   const transfer=traces.find(x=>x.phase==='transfer');
   assert.ok(transfer);
   assert.equal(transfer.inboundStreamComplete,false);
   assert.equal(transfer.inboundStreamProof,undefined);
 }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

test('schema never accepts raw response contents or untrusted fingerprint strings',()=>{
 assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_transfer',
   inboundStreamProof:SECRET}),/INVALID_INBOUND_STREAM_PROOF/);
 assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_transfer',
   inboundChunkCount:'password='+SECRET}),/INVALID_INBOUND_CHUNK_COUNT/);
 assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_transfer',
   proofScope:'raw-payload'}),/INVALID_INBOUND_PROOF_SCOPE/);
 const safe=validateDiagnostic({source:'programa',event:'native_http_transfer',
   proofScope:'node_received_stream_hmac_ephemeral',
   inboundStreamProof:'f'.repeat(64),inboundChunkCount:2,inboundStreamComplete:true,
   rawBody:SECRET,headers:{cookie:SECRET},responseBody:SECRET});
 assert.ok(!JSON.stringify(safe).includes(SECRET));
});

test('UI documents passive receive before Chromium; no automatic archive',()=>{
 const ui=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
 const script=ui.split('<script nonce="PANEL_CSP_NONCE">')[1]?.split('</script>')[0];
 assert.ok(script);new vm.Script(script);
 assert.match(ui,/Recepción pasiva antes de crear Chromium/);
 const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-3015.js'),'utf8');
 assert.ok(!builder.includes("'almacen-diagnostic-archive.cjs'"));
 const native=fs.readFileSync(path.join(__dirname,'almacen-native-integrated-diagnostic.cjs'),'utf8');
 assert.ok(!native.includes('createDiagnosticArchive('));
});

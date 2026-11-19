'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const {mapNativeEvent,validateDiagnostic,startDiagnosticPanel}=
  require('./almacen-diagnostic-panel.cjs');

test('bidirectional Node HTTP metadata preserves bytes but never secrets',async()=>{
  const secret='SUPER_PRIVATE_3018';
  const sent='hello';
  const received='server-ok';
  const server=http.createServer(async(req,res)=>{
    let length=0;
    for await(const chunk of req)length+=chunk.length;
    assert.equal(length,Buffer.byteLength(sent));
    res.setHeader('Set-Cookie','session='+secret+'; HttpOnly');
    res.setHeader('Content-Type','text/plain');
    res.end(received);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const rows=[],stop=startNodeHttpTrace(row=>rows.push(row));
  try{
    await new Promise((resolve,reject)=>{
      const req=http.request({hostname:'127.0.0.1',port:server.address().port,
        method:'POST',path:'/api/'+secret+'?token='+secret},res=>{
          res.on('data',()=>{});
          res.on('end',resolve);
          res.on('error',reject);
        });
      req.setHeader('Authorization','Bearer '+secret);
      req.setHeader('Cookie','SESSION='+secret);
      req.setHeader('Proxy-Authorization','Basic '+secret);
      req.on('error',reject);
      req.write('he');req.end('llo');
    });
    const request=rows.find(x=>x.phase==='request');
    const response=rows.find(x=>x.phase==='response');
    const transfer=rows.find(x=>x.phase==='transfer');
    assert.ok(request&&response&&transfer);
    assert.equal(transfer.outboundBodyBytesQueued,5);
    assert.equal(transfer.inboundBodyBytesObserved,Buffer.byteLength(received));
    assert.equal(transfer.transferState,'response_end');
    assert.equal(transfer.requestAuthorizationPresent,true);
    assert.equal(transfer.requestCookiePresent,true);
    assert.equal(transfer.requestProxyAuthorizationPresent,true);
    assert.equal(transfer.responseSetCookiePresent,true);
    assert.equal(response.status,200);
    assert.equal(request.routeTemplate,'/api/:id');
    const sanitized=validateDiagnostic(mapNativeEvent(transfer));
    assert.equal(sanitized.outboundBodyBytesQueued,5);
    assert.equal(sanitized.inboundBodyBytesObserved,9);
    assert.ok(!JSON.stringify(rows).includes(secret));
    assert.ok(!JSON.stringify(sanitized).includes(secret));
  }finally{
    stop();
    await new Promise(resolve=>server.close(resolve));
  }
});

test('panel aggregates only whitelisted transfer metrics',async()=>{
  const panel=await startDiagnosticPanel({observeOnOpen:false});
  try{
    const row={source:'programa',event:'native_http_transfer',
      outboundBodyBytesQueued:10,inboundBodyBytesObserved:20,
      byteCountLimited:false,transferState:'response_end',
      requestAuthorizationPresent:true,requestCookiePresent:false,
      requestProxyAuthorizationPresent:false,responseSetCookiePresent:true,
      password:'FORBIDDEN',cookies:'FORBIDDEN'};
    panel.emit(row);
    const result=panel.getState();
    const network=result.checks.networkMetadata;
    assert.equal(network.nodeTransfers,1);
    assert.equal(network.outboundBodyBytesQueued,10);
    assert.equal(network.inboundBodyBytesObserved,20);
    assert.equal(network.requestsWithAuthorization,1);
    assert.equal(network.responsesWithSetCookie,1);
    assert.equal(result.events[0].password,undefined);
    assert.equal(result.events[0].cookies,undefined);
    assert.throws(()=>validateDiagnostic({source:'programa',
      event:'native_http_transfer',requestCookiePresent:'SECRET'}),/INVALID_DIAGNOSTIC_FLAG/);
    assert.throws(()=>validateDiagnostic({source:'programa',
      event:'native_http_transfer',outboundBodyBytesQueued:-1}),/INVALID_DIAGNOSTIC_SIZE/);
  }finally{await panel.stop();}
});

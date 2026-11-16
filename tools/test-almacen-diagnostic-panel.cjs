'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {startDiagnosticPanel,validateDiagnostic}=
  require('./almacen-diagnostic-panel.cjs');
const {safeCode}=require('./run-dicloak-diagnostic-panel.cjs');

async function get(url,{host,origin}={}){
  const parsed=new URL(url);
  const opts={
    hostname:'127.0.0.1',
    port:parsed.port,path:parsed.pathname,
    headers:{...(host?{host}:{}) ,...(origin?{origin}:{})}
  };
  return new Promise((resolve,reject)=>{
    http.get(opts,res=>{
      const parts=[];
      res.on('data',x=>parts.push(x));
      res.on('end',()=>resolve({
        status:res.statusCode,headers:res.headers,
        body:Buffer.concat(parts).toString('utf8')
      }));
    }).once('error',reject);
  });
}

test('diagnostics UI serves only localhost token and sanitizes all events',async()=>{
  const panel=await startDiagnosticPanel();
  try {
    const page=await get(panel.url);
    assert.equal(page.status,200);
    assert.match(page.body,/Diagnóstico de comunicación/);
    assert.match(page.headers['content-security-policy'],/default-src 'none'/);
    assert.equal(page.headers['referrer-policy'],'no-referrer');
    assert.equal(page.body.includes('FAKE_COOKIE'),false);
    assert.equal(page.body.includes('cookieStorage'),false);
    const stateUrl=panel.url+'state';
    const initial=JSON.parse((await get(stateUrl)).body);
    assert.equal(initial.counters.total,1);
    assert.equal(initial.events[0].event,'panel_ready');
    panel.emit({
      source:'servidor_pruebas',event:'response_approved',status:200,
      cookie:'secret-cookie-must-not-appear',
      authorization:'Bearer SECRET',
      responseBody:'SECRET_SERVER_DATA'
    });
    panel.emit({source:'almacen',event:'document_saved',bytes:5,
      sha256:'a'.repeat(64),url:'https://private.example/secret'});
    panel.emit({source:'programa',event:'configuration_missing'});
    const state=await get(stateUrl);
    const report=JSON.parse(state.body);
    assert.equal(report.counters.approved,1);
    assert.equal(report.counters.saved,1);
    assert.equal(report.counters.total,4);
    assert.ok(!state.body.includes('secret-cookie'));
    assert.ok(!state.body.includes('Bearer'));
    assert.ok(!state.body.includes('SECRET_SERVER_DATA'));
    assert.ok(!state.body.includes('private.example'));
    assert.equal(report.events[2].bytes,5);
    assert.equal(report.events[2].sha256,'a'.repeat(64));
    assert.equal((await get('http://127.0.0.1:'+new URL(panel.url).port+'/wrong/')).status,404);
    assert.equal((await get(stateUrl,{host:'malicious.example'})).status,403);
    assert.equal((await get(stateUrl,{origin:'https://untrusted.example'})).status,403);
  }finally{await panel.stop();}
});

test('event schema rejects untrusted status, size, hashes, sources and message types',()=>{
  for(const bad of [
    {source:'servidor_pruebas',event:'raw_cookie_header'},
    {source:'browser',event:'document_saved'},
    {source:'chromium',event:'document_saved',status:900},
    {source:'chromium',event:'document_saved',bytes:-1},
    {source:'almacen',event:'document_saved',sha256:'secret-instead-of-a-hash'},
    {source:'programa',event:'profile_running',bytes:2**60}
  ])assert.throws(()=>validateDiagnostic(bad),/INVALID_DIAGNOSTIC_/);
  const accepted=validateDiagnostic({source:'programa',event:'profile_wait',
    password:'hidden',cookie:'not disclosed',requestBody:'not disclosed'});
  assert.equal(JSON.stringify(accepted).includes('hidden'),false);
  assert.equal(safeCode(new Error('key=test-secret')), 'DIAGNOSTIC_FAILED');
  assert.equal(safeCode(new Error('LOCAL_API_KEY_MISSING')),'LOCAL_API_KEY_MISSING');
});

test('dashboard reports configuration missing without claiming a network response',async()=>{
 const panel=await startDiagnosticPanel();
 try{
  panel.emit({source:'programa',event:'configuration_missing'});
  const state=panel.getState();
  assert.equal(state.counters.total,2);
  assert.equal(state.counters.saved,0);
  assert.equal(state.counters.approved,0);
  assert.equal(state.events.at(-1).event,'configuration_missing');
 }finally{await panel.stop();}
});

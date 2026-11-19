'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const {startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const {mapNativeEvent,startDiagnosticPanel,validateDiagnostic}=
  require('./almacen-diagnostic-panel.cjs');

function requestAndDrain(url){
  return new Promise((resolve,reject)=>{
    const req=http.request(url,res=>{
      const chunks=[];
      res.on('data',chunk=>chunks.push(chunk));
      res.on('end',()=>resolve(Buffer.concat(chunks)));
      res.on('error',reject);
    });
    req.on('error',reject);
    req.end();
  });
}

test('opt-in exact lab URL stores literal synthetic server response, Set-Cookie and JSON export',async()=>{
  const fixture={
    correo:'prueba+ñ@ejemplo.invalid',
    contrasena:'FALSA_Aa09!ñ💡|=+',
    cookie:'sesion=EJEMPLO-no-valida-456==',
    proxy:{usuario:'testOnly',clave:'Proxy-PRUEBA?!',host:'proxy.example.invalid',puerto:3128}
  };
  const textBody=JSON.stringify(fixture,null,2)+'\\n';
  const body=Buffer.from(textBody,'utf8');
  const cookies=['sesion=SOLO_PRUEBA_123; HttpOnly; Path=/',
    'marca=ñ; Secure; Path=/'];
  let sendMarker=true,sendContentType=true;
  const server=http.createServer((req,res)=>{
    if(sendMarker)res.setHeader('X-diloakpro-fixture','synthetic-only-v1');
    res.setHeader('Content-Type',sendContentType?
      'application/vnd.diloakpro-lab+json; charset=utf-8':'application/json');
    res.setHeader('Set-Cookie',cookies);
    res.end(body);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/lab/synthetic?exact=1';
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-fixture-'));
  const panel=await startDiagnosticPanel({observeOnOpen:false,exportDirectory:dir});
  const raws=[],stop=startNodeHttpTrace(row=>{
    raws.push(row);
    const safe=mapNativeEvent(row);
    if(safe)panel.emit(safe);
  },{labLiteralUrl:url});
  try{
    const got=await requestAndDrain(url);
    assert.ok(got.equals(body));
    const captured=panel.getState().events.filter(x=>x.event==='native_http_lab_literal');
    assert.equal(captured.length,1);
    const literal=captured[0];
    assert.equal(literal.source,'servidor_pruebas');
    assert.equal(literal.literalBodyText,textBody);
    assert.equal(literal.literalBodyBase64,body.toString('base64'));
    assert.equal(literal.literalBodySha256,crypto.createHash('sha256').update(body).digest('hex'));
    assert.deepEqual(literal.literalSetCookieValues,cookies);
    assert.equal(panel.getState().checks.networkMetadata.labLiteralResponseCount,1);
    const response=await fetch(panel.url+'export');
    assert.equal(response.status,200);
    const exported=await response.json();
    assert.deepEqual(exported.events.find(e=>e.event==='native_http_lab_literal'),literal);
    assert.equal(exported.events.find(e=>e.event==='native_http_lab_literal').literalBodyText,textBody);
    const saved=await fetch(panel.url+'save-json',{method:'POST',
      headers:{Origin:new URL(panel.url).origin}});
    assert.equal(saved.status,200);
    const info=await saved.json();
    assert.equal(info.ok,true);
    const localJSON=JSON.parse(fs.readFileSync(path.join(dir,info.fileName),'utf8'));
    assert.deepEqual(localJSON.events.find(e=>e.event==='native_http_lab_literal'),literal);

    sendMarker=false;
    await requestAndDrain(url);
    sendMarker=true;sendContentType=false;
    await requestAndDrain(url);
    sendContentType=true;
    await requestAndDrain(url.replace('exact=1','exact=2'));
    assert.equal(panel.getState().events.filter(e=>e.event==='native_http_lab_literal').length,1,
      'normal response, wrong content-type and wrong URL must never expose bodies');
    assert.equal(raws.filter(e=>e.phase==='lab_literal').length,1);
    assert.ok(!JSON.stringify(raws.filter(e=>e.phase!=='lab_literal')).includes('FALSA_Aa09'));
  }finally{
    stop();
    await panel.stop();
    await new Promise(resolve=>server.close(resolve));
    fs.rmSync(dir,{recursive:true,force:true});
  }
});

test('panel button endpoint fetches configured synthetic URL and stores exact server values',async()=>{
  const body=Buffer.from('{"correo":"lab@ejemplo.invalid","clave":"PRUEBA_Lab_999"}\\n','utf8');
  const cookie='test_session=XYZFALSA; HttpOnly; Path=/';
  let marked=true;
  const server=http.createServer((req,res)=>{
    if(marked)res.setHeader('X-Diloakpro-Fixture','synthetic-only-v1');
    res.setHeader('Content-Type','application/vnd.diloakpro-lab+json');
    res.setHeader('Set-Cookie',cookie);
    res.end(body);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const previous=process.env.DILOAKPRO_TEST_LITERAL_URL;
  process.env.DILOAKPRO_TEST_LITERAL_URL=
    'http://127.0.0.1:'+server.address().port+'/lab/verified';
  let panel;
  try{
    panel=await startDiagnosticPanel({observeOnOpen:false});
    const post=()=>fetch(panel.url+'run-lab',{method:'POST',
      headers:{Origin:new URL(panel.url).origin}});
    const result=await post();
    assert.equal(result.status,200);
    assert.equal((await result.json()).ok,true);
    const json=await (await fetch(panel.url+'export')).json();
    const literal=json.events.find(e=>e.event==='native_http_lab_literal');
    assert.equal(literal.literalBodyText,body.toString('utf8'));
    assert.equal(literal.literalBodyBase64,body.toString('base64'));
    assert.deepEqual(literal.literalSetCookieValues,[cookie]);
    assert.equal(json.checks.networkMetadata.labLiteralCaptureRequested,true);
    marked=false;
    const rejected=await post();
    assert.equal(rejected.status,422);
    assert.equal(json.events.filter(e=>e.event==='native_http_lab_literal').length,1);
    assert.equal(panel.getState().events.filter(e=>e.event==='native_http_lab_literal').length,1);
  }finally{
    if(panel)await panel.stop();
    if(previous===undefined)delete process.env.DILOAKPRO_TEST_LITERAL_URL;
    else process.env.DILOAKPRO_TEST_LITERAL_URL=previous;
    await new Promise(resolve=>server.close(resolve));
  }
});

test('normal events cannot inject lab-only values; malformed payload and hashes are rejected',()=>{
  const fields={literalBodyText:'pass',literalBodyBase64:'cGFzcw==',
    literalBodySha256:crypto.createHash('sha256').update('pass').digest('hex'),
    literalSetCookieValues:[]};
  assert.throws(()=>validateDiagnostic({
    source:'programa',event:'native_http_response',...fields
  }),/LAB_PAYLOAD_OUTSIDE_FIXTURE/);
  assert.throws(()=>validateDiagnostic({
    source:'servidor_pruebas',event:'native_http_lab_literal',...fields,
    literalBodySha256:'0'.repeat(64)
  }),/INVALID_LAB_FIXTURE/);
  assert.throws(()=>validateDiagnostic({
    source:'servidor_pruebas',event:'native_http_lab_literal',...fields,
    literalBodyText:'alterado'
  }),/INVALID_LAB_FIXTURE/);
});

test('panel embedded script compiles with synthetic-literal view',()=>{
  const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
  const script=html.split('<script nonce="PANEL_CSP_NONCE">')[1]?.split('</script>')[0];
  assert.ok(script);
  new vm.Script(script);
  assert.ok(html.includes('id="lab-literals"'));
});

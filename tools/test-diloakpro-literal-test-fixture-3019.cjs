'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {startNodeHttpTrace}=require('./almacen-observador-integrado.cjs');
const {startDiagnosticPanel,mapNativeEvent,validateDiagnostic}=
  require('./almacen-diagnostic-panel.cjs');

test('literal opt-in fixture can be visually verified in diagnostic and JSON without redaction',async()=>{
  const exactBody='{"correo":"persona+prueba@example.test","clave":"PRUEBA-ñ-123!","proxy":{"usuario":"proxy_demo","clave":"no-valida-456"},"cookies":"ID=abc_xyz; tema=oscuro","nota":"línea 1\\nlínea 2"}';
  const body=Buffer.from(exactBody,'utf8');
  const setCookie='ID=ficticio_áé-77; HttpOnly; Path=/';
  const server=http.createServer((req,res)=>{
    res.setHeader('Content-Type','application/vnd.diloakpro-lab+json');
    res.setHeader('X-Diloakpro-Fixture','synthetic-only-v1');
    res.setHeader('Set-Cookie',[setCookie,'OTRA=de_prueba; SameSite=Lax']);
    res.end(body);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/fixture';
  const emitted=[],stop=startNodeHttpTrace(row=>emitted.push(row),{labLiteralUrl:url});
  let panel;
  const downloads=fs.mkdtempSync(path.join(os.tmpdir(),'diloakpro-lab-'));
  try{
    const makeRequest=(target)=>new Promise((resolve,reject)=>{
      const req=http.get(target,res=>{
        const chunks=[];
        res.on('data',c=>chunks.push(c));
        res.on('end',()=>resolve(Buffer.concat(chunks)));
        res.on('error',reject);
      });req.on('error',reject);
    });
    const returned=await makeRequest(url);
    assert.deepEqual(returned,body,'app response is untouched');
    await makeRequest(url+'/other');
    const labs=emitted.filter(x=>x.phase==='lab_literal');
    assert.equal(labs.length,1,'only exact URL is allowed');
    const lab=labs[0];
    assert.equal(lab.literalBodyText,exactBody);
    assert.equal(lab.literalBodyBase64,body.toString('base64'));
    assert.equal(Buffer.compare(Buffer.from(lab.literalBodyBase64,'base64'),body),0);
    assert.equal(lab.literalBodySha256,crypto.createHash('sha256').update(body).digest('hex'));
    assert.deepEqual(lab.literalSetCookieValues,[setCookie,'OTRA=de_prueba; SameSite=Lax']);
    assert.ok(!emitted.find(x=>x.phase==='request').literalBodyText);
    panel=await startDiagnosticPanel({exportDirectory:downloads,observeOnOpen:false});
    panel.emit(mapNativeEvent(lab));
    const state=panel.getState();
    const recorded=state.events.find(x=>x.event==='native_http_lab_literal');
    assert.equal(recorded.literalBodyText,exactBody);
    assert.deepEqual(recorded.literalSetCookieValues,lab.literalSetCookieValues);
    assert.equal(state.checks.networkMetadata.labLiteralResponseCount,1);
    const exported=await fetch(panel.url+'export').then(r=>r.json());
    const saved=exported.events.find(x=>x.event==='native_http_lab_literal');
    assert.equal(saved.literalBodyText,exactBody);
    assert.deepEqual(saved.literalSetCookieValues,lab.literalSetCookieValues);
    assert.deepEqual(Buffer.from(saved.literalBodyBase64,'base64'),body);
    assert.throws(()=>validateDiagnostic({source:'programa',event:'native_http_response',
      literalBodyText:exactBody}),/LAB_PAYLOAD_OUTSIDE_FIXTURE/);
    assert.throws(()=>validateDiagnostic({source:'servidor_pruebas',event:'native_http_lab_literal',
      literalBodyBase64:lab.literalBodyBase64,literalBodySha256:'f'.repeat(64),
      literalSetCookieValues:[]}),/INVALID_LAB_FIXTURE/);
    const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
    const script=html.split('<script nonce="PANEL_CSP_NONCE">')[1]?.split('</script>')[0];
    new vm.Script(script);
    assert.ok(html.includes('id="lab-literals"'));
  }finally{
    stop();
    if(panel)await panel.stop();
    await new Promise(resolve=>server.close(resolve));
    fs.rmSync(downloads,{recursive:true,force:true});
  }
});

test('without an exact URL opt-in or response fixture marker no literal content is retained',async()=>{
  const secret='SYNTHETIC-ONLY-NEVER-PERSIST';
  const server=http.createServer((req,res)=>{
    res.setHeader('Content-Type','application/vnd.diloakpro-lab+json');
    if(req.url==='/marked')res.setHeader('X-Diloakpro-Fixture','synthetic-only-v1');
    res.end(JSON.stringify({password:secret}));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  const rows=[];
  const stop=startNodeHttpTrace(row=>rows.push(row),{labLiteralUrl:base+'/marked'});
  try{
    const call=target=>new Promise((resolve,reject)=>{
      http.get(target,res=>{res.resume();res.once('end',resolve);res.once('error',reject)})
        .once('error',reject);
    });
    await call(base+'/unmarked');
    assert.equal(rows.filter(r=>r.phase==='lab_literal').length,0);
    assert.ok(!JSON.stringify(rows).includes(secret));
  }finally{stop();await new Promise(resolve=>server.close(resolve));}
});

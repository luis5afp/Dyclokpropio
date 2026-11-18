'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {main}=require('./run-dicloak-diagnostic-panel.cjs');
const {getRunningTestProfile}=require('./dicloak-local-api-profile.cjs');

test('without an OpenAPI key diagnostic panel never contacts DICloak or alters login session',async()=>{
  let outboundCalls=0;
  const originalRequest=http.request;
  const originalGet=http.get;
  http.request=(...args)=>{outboundCalls++;throw Error('UNEXPECTED_OUTBOUND_REQUEST')};
  http.get=(...args)=>{outboundCalls++;throw Error('UNEXPECTED_OUTBOUND_GET')};
  let panel;
  try{
    panel=await main({
      DICLOAK_TEST_PROFILE_ID:'synthetic_test',
      DICLOAK_TEST_ENDPOINT_PREFIX:'https://lab.example.test/fixtures/',
      DICLOAK_LOCAL_API_PORT:'52100'
      // Deliberately NO DICLOAK_LOCAL_API_KEY
    });
    const state=panel.getState();
    assert.equal(outboundCalls,0,'no requests to the vendor Local API or any server');
    assert.equal(state.counters.saved,0);
    assert.equal(state.counters.approved,0);
    assert.equal(state.events.some(x=>x.event==='configuration_missing'),true);
    assert.equal(state.events.some(x=>x.event==='profile_running'),false);
    assert.equal(state.events.some(x=>x.event==='api_request'),false);
    assert.equal(state.events.some(x=>x.event==='api_response'),false);
  }finally{
    http.request=originalRequest;
    http.get=originalGet;
    if(panel)await panel.stop();
  }
});

test('local API rejects expired/unauthorized API key without modifying sign-in or retrying',async()=>{
  let calls=0;
  const server=http.createServer((req,res)=>{
    calls++;
    assert.equal(req.method,'GET');
    assert.equal(req.url,'/openapi/v2/profiles/synthetic_test/session');
    res.writeHead(401,{'content-type':'application/json'});
    res.end(JSON.stringify({message:'test only: API key expired'}));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const events=[];
  try{
    await assert.rejects(
      getRunningTestProfile({
        apiPort:server.address().port,
        apiKey:'SYNTHETIC_INVALID_KEY',
        profileId:'synthetic_test',
        onDiagnostic:event=>events.push(event)
      }),/DICLOAK_LOCAL_API_HTTP_401/
    );
    assert.equal(calls,1,'no repeated authentication attempts');
    assert.deepEqual(events.map(x=>x.event),['api_request','api_response']);
    assert.equal(events[1].status,401);
    assert.ok(!JSON.stringify(events).includes('SYNTHETIC_INVALID_KEY'));
    assert.ok(!JSON.stringify(events).includes('API key expired'));
  }finally{
    await new Promise(resolve=>server.close(resolve));
  }
});

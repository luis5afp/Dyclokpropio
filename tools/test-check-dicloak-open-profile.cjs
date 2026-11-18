'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {checkProfileState}=require('./check-dicloak-open-profile.cjs');

test('read-only Local API V2 diagnostic matches profile and exposes no browser secrets',async()=>{
  const methods=[];
  let running=false;
  const server=http.createServer((req,res)=>{
    methods.push({method:req.method,url:req.url});
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({code:0,data:{
      profile_id:'test_901',status:running?'running':'stopped',
      debug_port:running?19222:null,web_socket_url:null,
      session_id:'SENSITIVE_RANDOM_SESSION_IGNORED',
      name:'PRIVATE_PROFILE_NAME_IGNORED'
    }}));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const args={apiPort:server.address().port,apiKey:'FAKE_LOCAL_API_KEY_FOR_TEST',profileId:'test_901'};
    const before=await checkProfileState(args);
    assert.equal(before.running,false);
    running=true;
    const after=await checkProfileState(args);
    assert.equal(after.running,true);
    assert.equal(after.localDebuggerAvailable,true);
    assert.equal(after.sensitiveFieldsRead,false);
    assert.ok(!JSON.stringify(after).includes('SENSITIVE_RANDOM'));
    assert.ok(!JSON.stringify(after).includes('PRIVATE_PROFILE'));
    assert.deepEqual(methods,[
      {method:'GET',url:'/openapi/v2/profiles/test_901/session'},
      {method:'GET',url:'/openapi/v2/profiles/test_901/session'}
    ]);
  }finally{await new Promise(resolve=>server.close(resolve));}
});

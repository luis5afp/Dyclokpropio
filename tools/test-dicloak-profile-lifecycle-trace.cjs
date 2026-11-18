'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {createProfileLifecycleTrace}=
  require('./dicloak-profile-lifecycle-trace.cjs');
const {configFromEnv}=
  require('./run-dicloak-openapi-test-receiver.cjs');

test('records only sanitized profile opening lifecycle, not cookies or API secrets',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-opening-audit-'));
  try{
    const ts=[
      new Date('2026-11-16T13:00:00Z'),
      new Date('2026-11-16T13:00:01Z'),
      new Date('2026-11-16T13:00:02Z'),
      new Date('2026-11-16T13:00:03Z')
    ];
    const trace=createProfileLifecycleTrace({profileId:'test_profile_014',rootFolder:root,
      clock:()=>ts.shift()||new Date('2026-11-16T13:00:04Z')});
    trace.mark('monitor_created');
    trace.mark('waiting_for_profile');
    trace.mark('profile_running');
    const result=await trace.finish({recording:{
      saved:2,failed:0,ignored:11,received:13
    }});
    const content=await fs.readFile(result.output,'utf8');
    const report=JSON.parse(content);
    assert.equal(report.profileId,'test_profile_014');
    assert.equal(report.events.length,3);
    assert.equal(report.recording.saved,2);
    assert.equal(report.fullTrafficCaptured,false);
    assert.equal(report.cookiesOrCredentialsExported,false);
    assert.equal(report.remoteServerVerified,false);
    assert.ok(!content.includes('web_socket_url'));
    assert.ok(!content.includes('authorization'));
    assert.ok(!content.includes('password'));
    assert.ok(!content.includes('cookie='));
  }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('rejects arbitrary event strings and untrusted diagnostic payloads',async()=>{
 const base=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-opening-deny-'));
 try{
  const trace=createProfileLifecycleTrace({profileId:'profile_1',rootFolder:base});
  assert.throws(()=>trace.mark('http_headers','Cookie: private'),/UNSAFE_DIAGNOSTIC_EVENT/);
  assert.throws(()=>trace.mark('monitor_error','secret:xxx'),/UNSAFE_DIAGNOSTIC_REASON/);
  await assert.rejects(trace.finish({recording:{saved:-1}}),/UNSAFE_DIAGNOSTIC_COUNTER/);
  await assert.rejects(trace.finish({recording:{saved:1.5}}),/UNSAFE_DIAGNOSTIC_COUNTER/);
 }finally{await fs.rm(base,{recursive:true,force:true});}
});

test('test profile config has attach mode by default and never emits credentials',()=>{
 const options=configFromEnv({
   DICLOAK_LOCAL_API_KEY:'TEST_FAKE_XXXXX_FAKE',
   DICLOAK_TEST_PROFILE_ID:'profile_7',
   DICLOAK_TEST_ENDPOINT_PREFIX:'https://example.test/allowed/'
 });
 assert.equal(options.mode,'attach');
 assert.equal(options.profileId,'profile_7');
 assert.equal(options.testEndpointPrefix,'https://example.test/allowed/');
});

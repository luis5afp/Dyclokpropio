'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {createProfileTestReceiver,parseTestScope,isInScope}=require('./almacen-profile-test-receiver.cjs');

test('trusted Chromium sessions remain isolated; real bytes preserved by profile',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-test-rec-'));
 try{
  const receiver=createProfileTestReceiver({
    rootFolder:root,
    testEndpointPrefix:'https://lab.example.test/approved-fixtures/'
  });
  const a=Object.freeze({kind:'native-session-A'});
  const b=Object.freeze({kind:'native-session-B'});
  receiver.bindNativeSession(a,'native_524');
  receiver.bindNativeSession(b,'native_815');
  const one=Buffer.from([0,255,0x50,0x4b,0x03,0x04,0x11,0x80]);
  const two=Buffer.from('FAKE_TEST_JSON_ONLY\r\n','utf8');
  const ra=await receiver.recordDocument({
    nativeSession:a,
    responseUrl:'https://lab.example.test/approved-fixtures/file.zip',
    originalName:'captura-original.zip',bodyBytes:one
  });
  const rb=await receiver.recordDocument({
    nativeSession:b,
    responseUrl:'https://lab.example.test/approved-fixtures/file.json',
    originalName:'captura-original.json',bodyBytes:two
  });
  assert.equal(ra.profileId,'native_524');
  assert.equal(rb.profileId,'native_815');
  assert.equal(ra.sha256,crypto.createHash('sha256').update(one).digest('hex'));
  assert.equal(rb.sha256,crypto.createHash('sha256').update(two).digest('hex'));
  for(const [id,filename,original] of [
    ['native_524','captura-original.zip',one],
    ['native_815','captura-original.json',two]
  ]){
    const events=await fs.readdir(path.join(root,id,'archivos'));
    assert.equal(events.length,1);
    const copy=await fs.readFile(path.join(root,id,'archivos',events[0],filename));
    assert.ok(copy.equals(original),'original body bytes must match');
  }
  receiver.unbindNativeSession(a);
  await assert.rejects(receiver.recordDocument({
    nativeSession:a,responseUrl:'https://lab.example.test/approved-fixtures/file.zip',
    originalName:'x.zip',bodyBytes:one
  }),/UNVERIFIED_CHROMIUM_SESSION/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('never accept remote pages outside the exact test prefix, redirects or URLs with queries',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-test-deny-'));
 try {
  const receiver=createProfileTestReceiver({
    rootFolder:root,testEndpointPrefix:'https://lab.example.test/approved-fixtures/'
  });
  const native=Object.freeze({x:1});
  receiver.bindNativeSession(native,'native_524');
  for(const url of [
   'https://lab.example.test/other',
   'https://lab.example.test/approved-fixtures?item=1',
   'https://evil.example/approved-fixtures/file.json',
   'https://lab.example.test/approved-fixtures/file.json?token=secret',
   'http://lab.example.test/approved-fixtures/file.json'
  ]) {
   await assert.rejects(receiver.recordDocument({
    nativeSession:native,responseUrl:url,
    originalName:'test.json',bodyBytes:Buffer.from('{}')
   }),/SERVER_OUTSIDE_TEST_SCOPE/);
  }
  assert.deepEqual(await fs.readdir(root),[],'no paths created for rejected requests');
 }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('rejects duplicate binding and unknown renderer-supplied session',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-receiver-binding-'));
 try {
  const receiver=createProfileTestReceiver({rootFolder:root,
    testEndpointPrefix:'http://127.0.0.1:11234/approved/'});
  const a={verified:'A'},b={verified:'B'};
  receiver.bindNativeSession(a,'profile_one');
  assert.throws(()=>receiver.bindNativeSession(b,'profile_one'),/INVALID_SESSION_BINDING/);
  assert.throws(()=>receiver.bindNativeSession(a,'profile_two'),/INVALID_SESSION_BINDING/);
  await assert.rejects(receiver.recordDocument({
   nativeSession:b,
   responseUrl:'http://127.0.0.1:11234/approved/file.txt',
   originalName:'t.txt',bodyBytes:Buffer.from('Hello')
  }),/UNVERIFIED_CHROMIUM_SESSION/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('only a canonical, explicit HTTPS test scope or loopback HTTP is accepted',()=>{
 assert.equal(parseTestScope('https://lab.example.test/approved/').origin,'https://lab.example.test');
 assert.equal(parseTestScope('http://127.0.0.1:5000/lab/').origin,'http://127.0.0.1:5000');
 for(const bad of [
   'http://lab.example.test/approved/',
   'https://lab.example.test/',
   'https://lab.example.test/approved?x=1',
   'https://user:pass@lab.example.test/approved/',
   'https://lab.example.test/approved/#fragment'
 ])assert.throws(()=>parseTestScope(bad),/INVALID_TEST_ENDPOINT/);
 const scope=parseTestScope('https://lab.example.test/approved/');
 assert.equal(isInScope('https://lab.example.test/approved/file.json',scope),true);
 assert.equal(isInScope('https://lab.example.test/approvedness/file.json',scope),false);
});

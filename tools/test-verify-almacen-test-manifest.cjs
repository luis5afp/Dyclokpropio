'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {verifyTestManifest}=require('./verify-almacen-test-manifest.cjs');

const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
test('matches exact first-party fixture bytes and detects omissions or modifications',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-test-manifest-'));
 const good=Buffer.from([0,255,128,80,75,3,4,90]);
 const absent=Buffer.from('not transmitted');
 try {
  const event=path.join(root,'profile_test_11','archivos','event_a');
  await fs.mkdir(event,{recursive:true});
  await fs.writeFile(path.join(event,'test-data.bin'),good);
  const baseline=[{name:'test-data.bin',byteLength:good.length,sha256:digest(good)}];
  const perfect=await verifyTestManifest({rootFolder:root,profileId:'profile_test_11',manifest:baseline});
  assert.equal(perfect.complete,true);
  assert.equal(perfect.matched,1);
  const missing=await verifyTestManifest({rootFolder:root,profileId:'profile_test_11',manifest:[
    ...baseline,{name:'missing.txt',byteLength:absent.length,sha256:digest(absent)}
  ]});
  assert.equal(missing.complete,false);
  assert.equal(missing.missingOrChanged,1);
  await fs.writeFile(path.join(event,'test-data.bin'),Buffer.from('modified'));
  const changed=await verifyTestManifest({rootFolder:root,profileId:'profile_test_11',manifest:baseline});
  assert.equal(changed.complete,false);
  assert.equal(changed.sameNameDifferentBytes,1);
  assert.equal(changed.manifestAuthenticatedByTool,false);
  assert.equal(changed.fullNetworkTrafficVerified,false);
  assert.ok(!JSON.stringify(changed).includes('modified'));
 }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('does not read outside designated profile and rejects malicious document names',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-test-manifest-deny-'));
 try{
  const bad={name:'../Login Data',byteLength:2,sha256:digest(Buffer.from('hi'))};
  await assert.rejects(verifyTestManifest({rootFolder:root,profileId:'profile_1',manifest:[bad]}),
    /Unsafe original filename/);
  const legitimate={name:'file.json',byteLength:2,sha256:digest(Buffer.from('{}'))};
  const absent=await verifyTestManifest({rootFolder:root,profileId:'profile_1',manifest:[legitimate]});
  assert.equal(absent.expected,1);
  assert.equal(absent.matched,0);
  assert.equal(absent.complete,false);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});

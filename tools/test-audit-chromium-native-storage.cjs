'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fsp = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { auditNativeProfile, compareAuditReports, checkName } =
  require('./audit-chromium-native-storage.cjs');

test('Chromium native audit reads synthetic fixture files without exposing cookie or password bytes',async()=>{
  const base=await fsp.mkdtemp(path.join(os.tmpdir(),'dicloak-native-audit-'));
  try{
    await fsp.mkdir(path.join(base,'Network'));
    await fsp.mkdir(path.join(base,'Local Storage','leveldb'),{recursive:true});
    await fsp.writeFile(path.join(base,'Network','Cookies'),Buffer.from('SYNTHETIC_TEST_COOKIE_VALUE_NOT_FOR_LOGS'));
    await fsp.writeFile(path.join(base,'Login Data'),Buffer.from('SYNTHETIC_TEST_PASSWORD_VALUE_NOT_FOR_LOGS'));
    await fsp.writeFile(path.join(base,'Local Storage','leveldb','00001.ldb'),Buffer.from([0,255,128,42]));
    await fsp.writeFile(path.join(base,'Preferences'),Buffer.from('{}'));
    const beforeContents=await fsp.readFile(path.join(base,'Network','Cookies'));
    const first=await auditNativeProfile(base);
    const reportJson=JSON.stringify(first);
    assert.equal(first.noContentExported,true);
    assert.equal(first.categories.cookies.files,1);
    assert.equal(first.categories.credentialsNative.files,1);
    assert.equal(first.categories.localStorage.files,1);
    assert.equal(first.categories.preferences.files,1);
    assert.ok(!reportJson.includes('SYNTHETIC_TEST_COOKIE_VALUE_NOT_FOR_LOGS'));
    assert.ok(!reportJson.includes('SYNTHETIC_TEST_PASSWORD_VALUE_NOT_FOR_LOGS'));
    assert.ok(beforeContents.equals(await fsp.readFile(path.join(base,'Network','Cookies'))));
    const stable=await auditNativeProfile(base);
    assert.equal(compareAuditReports(first,stable).categories.cookies.changed,false);
    await fsp.writeFile(path.join(base,'Network','Cookies'),Buffer.from('SYNTHETIC_TEST_COOKIE_VALUE_NEW'));
    const changed=await auditNativeProfile(base);
    const comparison=compareAuditReports(first,changed);
    assert.equal(comparison.categories.cookies.changed,true);
    assert.equal(comparison.categories.localStorage.changed,false);
    assert.equal(comparison.categories.credentialsNative.changed,false);
    assert.ok(!JSON.stringify(comparison).includes('SYNTHETIC_TEST_COOKIE_VALUE'));
  }finally{await fsp.rm(base,{recursive:true,force:true});}
});

test('native storage audit includes SQLite wal and does not decrypt or parse content',async()=>{
  const base=await fsp.mkdtemp(path.join(os.tmpdir(),'dicloak-audit-wal-'));
  try{
    await fsp.mkdir(path.join(base,'Network'));
    await fsp.writeFile(path.join(base,'Network','Cookies'),Buffer.from([1,2,3]));
    await fsp.writeFile(path.join(base,'Network','Cookies-wal'),Buffer.from([255,0,128]));
    const audit=await auditNativeProfile(base);
    assert.equal(audit.categories.cookies.files,2);
    assert.equal(audit.categories.cookies.totalBytes,6);
    assert.match(audit.categories.cookies.sha256,/^[0-9a-f]{64}$/);
  }finally{await fsp.rm(base,{recursive:true,force:true});}
});

test('native audit rejects invalid or symlinked selected profiles',async t=>{
  const base=await fsp.mkdtemp(path.join(os.tmpdir(),'dicloak-audit-deny-'));
  const link=base+'-link';
  try{
    assert.throws(()=>checkName(base,'../escape'),/Invalid native storage path/);
    try{await fsp.symlink(base,link,'dir');}
    catch(e){if(['EPERM','EACCES','ENOSYS'].includes(e.code)){t.diagnostic('Symlinks unavailable');return;}throw e;}
    await assert.rejects(auditNativeProfile(link),/regular profile directory/);
    await fsp.mkdir(path.join(base,'Network'));
    await fsp.symlink(path.join(base,'Network'),path.join(base,'Local Storage'),'dir');
    await assert.rejects(auditNativeProfile(base),/Symbolic link/);
  }finally{
    await fsp.rm(link,{force:true});
    await fsp.rm(base,{recursive:true,force:true});
  }
});

test('receiving identical server bytes is distinct from native Chromium storage hash',async()=>{
  const payload=Buffer.from('Set-Cookie: fake_session=TEST_ONLY; Path=/; HttpOnly\r\n');
  const digest=crypto.createHash('sha256').update(payload).digest('hex');
  assert.match(digest,/^[a-f0-9]{64}$/);
  const base=await fsp.mkdtemp(path.join(os.tmpdir(),'dicloak-audit-distinction-'));
  try{
    await fsp.mkdir(path.join(base,'Network'));
    await fsp.writeFile(path.join(base,'Network','Cookies'),Buffer.from('ENCRYPTED_PLACEHOLDER_NO_DECRYPTION'));
    const audit=await auditNativeProfile(base);
    assert.notEqual(audit.categories.cookies.sha256,digest,
      'the native container should not be compared to a server HTTP value');
  }finally{await fsp.rm(base,{recursive:true,force:true});}
});

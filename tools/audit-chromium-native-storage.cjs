#!/usr/bin/env node
'use strict';

/**
 * Read-only integrity audit for a CLOSED Chromium test profile.
 * Does not copy, decrypt, parse, alter or export cookies, passwords, tokens,
 * browser settings or databases. Only emits aggregate SHA-256 digests by
 * native storage category for opt-in comparison.
 *
 * This is not a network capture tool. Server bytes and native Chromium
 * database bytes are different representations and must not be compared
 * as if they were the same payload.
 */
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const GROUPS = Object.freeze({
  cookies: ['Network/Cookies','Cookies'],
  credentialsNative: ['Login Data','Login Data For Account'],
  localStorage: ['Local Storage'],
  indexedDB: ['IndexedDB'],
  sessionStorage: ['Session Storage'],
  webStorage: ['WebStorage'],
  serviceWorker: ['Service Worker'],
  preferences: ['Preferences','Secure Preferences','Network Persistent State']
});
const MAX_ENTRIES = 20000;
const MAX_FILE_SIZE = 1024 * 1024 * 1024;

function checkName(root, relative) {
  if (path.isAbsolute(relative) || relative.includes('\0') ||
      relative.split('/').some(x => x === '..' || x === '.')) {
    throw new Error('Invalid native storage path');
  }
  const resolved = path.resolve(root, ...relative.split('/'));
  if (resolved !== path.resolve(root) &&
      !resolved.startsWith(path.resolve(root) + path.sep)) {
    throw new Error('Outside the selected profile root');
  }
  return resolved;
}
function matchesNativeFile(name, relative) {
  // Include SQLite write-ahead log and shared-memory siblings, if present.
  if (name === 'Network/Cookies' || name === 'Cookies' ||
      name === 'Login Data' || name === 'Login Data For Account') {
    return relative === name ||
      relative === name+'-wal' ||
      relative === name+'-shm' ||
      relative === name+'-journal';
  }
  return relative === name || relative.startsWith(name+'/');
}
async function enumerate(root) {
  const found = [];
  const walk = async (absolute, relative) => {
    const info = await fsp.lstat(absolute);
    if (info.isSymbolicLink()) throw new Error('Symbolic link in selected profile storage');
    if (info.isDirectory()) {
      if (relative && !Object.values(GROUPS).flat().some(n =>
        matchesNativeFile(n,relative) || matchesNativeFile(relative,n))) return;
      const children = (await fsp.readdir(absolute)).sort();
      for (const child of children) {
        if (found.length > MAX_ENTRIES) throw new Error('Excessive native storage entries');
        const next = relative ? relative+'/'+child : child;
        await walk(checkName(root,next),next);
      }
    } else if (info.isFile()) {
      if (info.size > MAX_FILE_SIZE) throw new Error('Native storage file is too large for audit');
      const group = Object.entries(GROUPS).find(([,names]) =>
        names.some(name => matchesNativeFile(name,relative)));
      if (group) found.push({absolute,relative,group:group[0],size:info.size});
    }
  };
  await walk(root,'');
  return found;
}
async function digestFile(absolute, expectedSize) {
  const infoBefore = await fsp.stat(absolute);
  if (!infoBefore.isFile() || infoBefore.size !== expectedSize) {
    throw new Error('Profile changed while reading; close Chromium and retry');
  }
  const h=crypto.createHash('sha256');
  await new Promise((resolve,reject) => {
    const stream=fs.createReadStream(absolute,{flags:'r'});
    stream.on('data',part=>h.update(part));
    stream.once('error',reject);
    stream.once('end',resolve);
  });
  const infoAfter=await fsp.stat(absolute);
  if (infoAfter.size !== infoBefore.size ||
      infoAfter.mtimeMs !== infoBefore.mtimeMs ||
      infoAfter.ctimeMs !== infoBefore.ctimeMs ||
      infoAfter.ino !== infoBefore.ino) {
    throw new Error('Profile changed while reading; close Chromium and retry');
  }
  return h.digest('hex');
}
async function auditNativeProfile(profileRoot) {
  if (typeof profileRoot!=='string' || !path.isAbsolute(profileRoot)) {
    throw new Error('Provide an absolute, explicitly selected test profile directory');
  }
  const stat=await fsp.lstat(profileRoot);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Not a regular profile directory');
  const files=await enumerate(profileRoot);
  const result={schemaVersion:1,kind:'chromium-native-storage-integrity-only',noContentExported:true,
    note:'Chromium must be stopped for a consistent profile snapshot',categories:{}};
  for(const [group] of Object.entries(GROUPS)) {
    const list=files.filter(x=>x.group===group).sort((a,b)=>a.relative.localeCompare(b.relative));
    const h=crypto.createHash('sha256');
    let bytes=0;
    for(const file of list) {
      const digest=await digestFile(file.absolute,file.size);
      h.update(Buffer.from(file.relative,'utf8'));
      h.update(Buffer.from([0]));
      h.update(digest,'utf8');
      h.update(Buffer.from([0]));
      bytes+=file.size;
    }
    result.categories[group]={
      files:list.length,
      totalBytes:bytes,
      sha256:list.length?h.digest('hex'):null
    };
  }
  return result;
}
function compareAuditReports(before,after) {
  if(before?.schemaVersion!==1 || after?.schemaVersion!==1 ||
      !before?.categories || !after?.categories) throw Error('Incompatible native audit reports');
  const categories={};
  for(const k of Object.keys(GROUPS)){
    const a=before.categories[k],b=after.categories[k];
    if(!a || !b)throw Error('Missing audit category '+k);
    categories[k]={changed:a.sha256!==b.sha256 || a.files!==b.files,
      beforeFiles:a.files,afterFiles:b.files};
  }
  return {kind:'native-files-changed-check',categories,
    caution:'Changed files do not prove that any particular HTTP payload was received'};
}
if(require.main===module){
  const profileRoot=process.argv[2];
  if(!profileRoot){console.error('Usage: node audit-chromium-native-storage.cjs <closed-test-profile-dir>');process.exitCode=2;}
  else auditNativeProfile(profileRoot).then(report=>console.log(JSON.stringify(report,null,2)))
    .catch(error=>{console.error('Audit failed: '+error.message);process.exitCode=1;});
}
module.exports={auditNativeProfile,compareAuditReports,checkName,matchesNativeFile,GROUPS};

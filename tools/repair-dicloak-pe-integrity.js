#!/usr/bin/env node
'use strict';

/**
 * Rebuild Windows packaging metadata for an altered DICloak 3.0.7 ASAR,
 * without disabling Electron's ASAR-integrity fuse.
 *
 * Experimental only: editing an Authenticode-signed PE invalidates the
 * vendor's signature. Publication requires independent authorization and
 * signing with the distributor's own code-signing certificate.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const fromBuild = createRequire(path.join(__dirname, '../release-build/native-0.3.3/package.json'));
const { NtExecutable, NtExecutableResource } = fromBuild('resedit');
const { headerHash } = require('./inspect-dicloak-pe-asar-integrity.js');

const VENDOR_PE_SHA = 'e00064c5195235a4eb492194cd0136cc7d81c7be8eab9acb75ffdb6e26e0c29f';
const VENDOR_ASAR_SHA = 'b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf';
const SENTINEL = Buffer.from('dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
function assert(condition,message){if(!condition)throw new Error('BLOCKED: '+message);}
function fuses(buf) {
  const index = buf.indexOf(SENTINEL);
  assert(index >= 0 && buf.indexOf(SENTINEL,index+SENTINEL.length) === -1,
    'unexpected Electron fuse wire');
  const verPos = index+SENTINEL.length;
  const len = buf[verPos+1];
  assert(len > 0 && len < 100, 'invalid Electron fuse wire length');
  return Buffer.from(buf.subarray(verPos,verPos+2+len));
}
function resourceOf(exe){
  const list = NtExecutableResource.from(exe);
  const entries = list.entries.filter(e=>String(e.type).toUpperCase()==='INTEGRITY' &&
    String(e.id).toUpperCase()==='ELECTRONASAR');
  assert(entries.length === 1, 'expected one ElectronAsar integrity resource');
  const entry=entries[0];
  const all=JSON.parse(Buffer.from(entry.bin).toString('utf8').replace(/\0+$/,''));
  assert(Array.isArray(all),'invalid PE-integrity resource JSON');
  const matches=all.filter(x=>String(x.file).replace(/\//g,'\\').toLowerCase()==='resources\\app.asar' &&
    String(x.alg).toLowerCase()==='sha256');
  assert(matches.length === 1,'expected exact resources\\app.asar integrity hash');
  return {list,entry,all,item:matches[0]};
}
function repair(folder,originalAsarPath){
  const exePath=path.join(folder,'DICloak.exe');
  const asarPath=path.join(folder,'resources','app.asar');
  const manifestPath=path.join(folder,'resources','dyclok-native-update-ui-manifest.json');
  const original=fs.readFileSync(exePath);
  assert(sha(original)===VENDOR_PE_SHA,'vendor executable differs from pinned original');
  assert(sha(fs.readFileSync(originalAsarPath))===VENDOR_ASAR_SHA,
    'baseline original ASAR differs from pinned official source');
  assert(fs.existsSync(manifestPath),'missing patch manifest');
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  assert(['0.2.0','0.3.0','0.3.1','0.3.2','0.3.3'].includes(manifest.deliveryVersion) &&
    manifest.modifiedAsarSha256===sha(fs.readFileSync(asarPath)),
    'ASAR patch manifest differs from staged build');
  const oldDigest=headerHash(originalAsarPath);
  const newDigest=headerHash(asarPath);
  assert(oldDigest!==newDigest,'ASAR header must differ');
  const originalWire=fuses(original);

  const pe=NtExecutable.from(original,{ignoreCert:true});
  const {list,entry,all,item}=resourceOf(pe);
  assert(item.value===oldDigest,'original executable did not validate original ASAR');
  item.value=newDigest;
  const replacement=Buffer.from(JSON.stringify(all),'utf8');
  entry.bin=replacement.buffer.slice(replacement.byteOffset,replacement.byteOffset+replacement.byteLength);
  list.outputResource(pe);
  const modified=Buffer.from(pe.generate());
  assert(sha(modified)!==VENDOR_PE_SHA,'updated PE did not change');
  assert(fuses(modified).equals(originalWire),'Electron fuse states changed');

  const test=resourceOf(NtExecutable.from(modified,{ignoreCert:true}));
  assert(test.item.value===newDigest,'rebuilt PE does not reference new ASAR header');
  const stage=exePath+'.integrity-stage';
  assert(!fs.existsSync(stage),'temporary rebuilt executable already exists');
  try{
    fs.writeFileSync(stage,modified,{flag:'wx'});
    assert(sha(fs.readFileSync(stage))===sha(modified),'PE write verification failed');
    fs.renameSync(stage,exePath);
  } finally {
    if(fs.existsSync(stage)) fs.rmSync(stage,{force:true});
  }
  manifest.originalExecutableSha256=VENDOR_PE_SHA;
  manifest.executableSha256=sha(modified);
  manifest.rebuiltExecutableSha256=sha(modified);
  manifest.originalEmbeddedHeaderSha256=oldDigest;
  manifest.rebuiltEmbeddedHeaderSha256=newDigest;
  manifest.embeddedAsarIntegrityStillEnabled=true;
  manifest.electronFuseWireUnchanged=true;
  manifest.vendorAuthenticodeSignaturePreserved=false;
  manifest.needsOwnCodeSigningBeforePublicDistribution=true;
  fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  console.log('REPACKAGED_PE_INTEGRITY='+JSON.stringify({
    oldHeader:oldDigest,newHeader:newDigest,
    originalPeSha256:VENDOR_PE_SHA,rebuiltPeSha256:sha(modified),
    fuseWireUnchanged:true,needsIndependentSigning:true
  }));
}
if(require.main===module){
  const folder=process.argv[2],originalAsar=process.argv[3];
  assert(folder && originalAsar,'usage: repair-dicloak-pe-integrity.js <folder> <original.asar>');
  repair(path.resolve(folder),path.resolve(originalAsar));
}
module.exports={repair,fuses};

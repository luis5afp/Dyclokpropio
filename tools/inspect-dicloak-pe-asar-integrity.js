#!/usr/bin/env node
'use strict';

// Read-only PE resource diagnostic for DICloak 3.0.7, with no binary patching.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const fromBuild = createRequire(path.join(__dirname, '../release-build/native-0.4.1/package.json'));
const { NtExecutable, NtExecutableResource } = fromBuild('resedit');
const asar = fromBuild('@electron/asar');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

function headerHash(file) {
  const raw = asar.getRawHeader(file);
  const content = typeof raw.header === 'string' ? raw.header :
    typeof raw.headerString === 'string' ? raw.headerString : JSON.stringify(raw.header);
  if (typeof content !== 'string' || !content.startsWith('{')) {
    throw new Error('Unrecognized ASAR header representation');
  }
  return sha(Buffer.from(content,'utf8'));
}
function inspect(executable, original, patched) {
  const pe = NtExecutable.from(fs.readFileSync(executable), { ignoreCert: true });
  const resources = NtExecutableResource.from(pe).entries;
  const integrity = resources.filter(e =>
    String(e.type).toUpperCase() === 'INTEGRITY' &&
    String(e.id).toUpperCase() === 'ELECTRONASAR'
  );
  if (integrity.length !== 1) {
    throw new Error('Expected exactly one native ElectronAsar Integrity resource, got ' +
      integrity.length + '; visible types=' +
      [...new Set(resources.map(e => String(e.type)))].join(','));
  }
  const record = JSON.parse(Buffer.from(integrity[0].bin).toString('utf8').replace(/\0+$/,''));
  const match = record.filter(e => String(e.file).replace(/\//g,'\\').toLowerCase() ===
    'resources\\app.asar' && String(e.alg).toLowerCase() === 'sha256');
  if (match.length !== 1) throw new Error('ASAR Integrity PE resource does not name app.asar');
  const officialHeader = headerHash(original);
  const changedHeader = headerHash(patched);
  if (officialHeader !== match[0].value) {
    throw new Error('Original vendor PE resource does not validate original vendor ASAR');
  }
  if (officialHeader === changedHeader) throw new Error('Modified ASAR header did not change');
  const report = {
    originalPEHasEmbeddedAsarIntegrity: true,
    originalHeaderSHA256MatchesPE: true,
    changedHeaderSHA256: changedHeader,
    peIntegrityExpectedHeaderSHA256: match[0].value,
    changedHeaderMatchesOriginalPE: changedHeader === match[0].value,
    resourceType: integrity[0].type,
    resourceId: integrity[0].id,
    peResourceEntries: resources.length
  };
  console.log('PE_ASAR_INTEGRITY_DIAGNOSTIC=' + JSON.stringify(report));
  return report;
}
if (require.main === module) {
  const [exe, official, edited] = process.argv.slice(2);
  if (!exe || !official || !edited) {
    throw new Error('Usage: node inspect-dicloak-pe-asar-integrity.js <DICloak.exe> <official.asar> <modified.asar>');
  }
  inspect(exe, official, edited);
}
module.exports = {inspect,headerHash};

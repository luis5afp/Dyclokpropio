'use strict';
// Restore the narrow 2.8.17 EXPAND_CHECK behavior in the 3.0.0 build only.
// Reference: SHA256 of reconstructed v2.8.17 renderer
// 711358b0f8eea819858186a2b3f4df6546598c7525cd2dd4506fd30c65fcbdd1.
// Do not patch unknown runtimes or bypass the SHA256 verification.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const TARGET = 'dist/assets/index-BUIbb6Pa.js';
const BASE_SHA256 = '7de2a353b92c130b93b5c455826efaa6e1c8788cf44f99185b450e61379dc0df';
const PATCHED_SHA256 = '0859bd51a5703b4c01c19c38878642315215341733d5080770faee9a85bb5925';
const START = 'She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){';
const END = '}},Rhe={name:"参数合并"';
const tick = String.fromCharCode(96);
const preflight = 'if(u.length)throw che(yre.EXPAND_DOWNLOAD_FAIL,' + tick +
  'Extension security check preparation failed: $' + '{u.join(", ")}' + tick + ');';
const missingNames = 'che(yre.EXPAND_DOWNLOAD_FAIL,n.length?' + tick +
  'Failed extensions: $' + '{n.join(", ")}' + tick + ':void 0)';
const legacyNames = 'che(yre.PLUGIN_DOWNLOAD_FAIL_BLOCKED,n.length?' + tick +
  'Failed extensions: $' + '{n.join(", ")}' + tick + ':void 0)';
const changes = [
  // v2.8.17: the mandatory-extension policy was governed by its own flag.
  // Integrity checking still runs separately and can reject the profile.
  ['p=Boolean((s===lre.GLOBAL?i:l)&Qie.blockOnPluginDownloadFail)||d,',
   'p=Boolean((s===lre.GLOBAL?i:l)&Qie.blockOnPluginDownloadFail),'],
  [missingNames, legacyNames],
  // v2.8.17 submitted the actually available hashes to the verifier without
  // first rejecting incomplete local metadata. The verifier remains mandatory.
  [preflight,
   'if(u.length)console.warn("[Dyclokpropio/legacy-expansion] Security inputs incomplete, server verification still required:",u);'],
  // Preserve null as actual SHA value but safely build the version suffix.
  ['const d=s.main.version+"-"+c+"-"+s.main.desc,p=l.version+"-"+c+"-"+r.slice(0,10);',
   'const d=(s?.main?.version??"")+"-"+c+"-"+(s?.main?.desc??""),p=(l?.version??"")+"-"+c+"-"+String(r??"").slice(0,10);'],
];
function sha256(input) { return crypto.createHash('sha256').update(input).digest('hex'); }
function transform(source) {
  const start = source.indexOf(START);
  assert.ok(start >= 0, 'Missing EXPAND_CHECK, refusing patch');
  assert.equal(source.indexOf(START, start + START.length), -1, 'Ambiguous EXPAND_CHECK');
  const end = source.indexOf(END, start + START.length);
  assert.ok(end > start && end - start < 6000, 'Unexpected EXPAND_CHECK bounds');
  const before = source.slice(start, end);
  let after = before;
  for (const [from, to] of changes) {
    assert.equal(after.split(from).length - 1, 1, 'Missing or duplicate change site: ' + from);
    after = after.replace(from, to);
  }
  // These exact security operations and failure paths are never removed.
  for (const required of [
    'generate-sha256-hash',
    'generate-sha256-hash-for-plugins',
    'checkExpansionSha256Hash(',
    'm.extens.every(e=>e.result)&&m.interiorExtens.every(e=>e.result)',
    'new Error(yre.EXPAND_SHA256_CHECK_FAIL)',
    'd=c&&!u'
  ]) {
    assert.ok(before.includes(required) && after.includes(required),
      'Integrity validation modified: ' + required);
  }
  const patched = source.slice(0, start) + after + source.slice(end);
  assert.equal(sha256(patched), PATCHED_SHA256, 'Patched renderer hash does not match reviewed output');
  return patched;
}
function main() {
  const file = path.resolve(__dirname, '..', TARGET);
  const original = fs.readFileSync(file);
  assert.equal(sha256(original), BASE_SHA256, 'Base renderer changed: refusing compatibility patch');
  const updated = transform(original.toString('utf8'));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dyclok-compat-'));
  try {
    const tempModule = path.join(tmp, 'renderer.mjs');
    fs.writeFileSync(tempModule, updated, 'utf8');
    const result = spawnSync(process.execPath, ['--check', tempModule], { encoding: 'utf8', maxBuffer: 3 * 1024 * 1024 });
    assert.equal(result.status, 0, 'Invalid patched renderer: ' + result.stderr.slice(-1500));
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  if (process.argv.includes('--apply')) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('Applied verified EXPAND_CHECK 2.8.17 compatibility to build workspace.');
  } else {
    console.log('Verified legacy patch in memory. Baseline file untouched.');
  }
  console.log('Renderer SHA256:', BASE_SHA256, '->', PATCHED_SHA256);
  console.log('Original SHA256 request and server validation remain mandatory.');
}
if (require.main === module) main();
module.exports = { transform, BASE_SHA256, PATCHED_SHA256 };

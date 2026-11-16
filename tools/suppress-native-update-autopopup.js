'use strict';

/**
 * Controlled patch for the exact DICloak 3.0.7 UI render chunk.
 *
 * It disables only the update-center popover's automatic opening.
 * Manual click on the notifications bell, update polling, download and forced
 * security-update UI are left untouched.
 *
 * IMPORTANT: this pure transformation DOES NOT patch or repackage vendor
 * app.asar. The original ASAR contains integrity records; rebuilding with
 * coherent integrity metadata and runtime smoke tests is a separate step.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');

const TARGET_FILE = 'dist/assets/index-bGjMkmkL.js';
const ORIGINAL = 'P(()=>Tt.value,e=>{e&&N(()=>{It(!0),b.value=!0})})';
const PATCHED = 'P(()=>Tt.value,e=>{e&&N(()=>{void 0,b.value=!0})})';
const MARKERS = Object.freeze([
  'update.updateCenter',
  'update.softUpdate',
  'update.notification',
  'openOrCloseTip',
  'update-app'
]);

function count(source, needle) {
  return source.split(needle).length - 1;
}

function preview(source) {
  if (typeof source !== 'string' || !MARKERS.every(s => source.includes(s))) {
    throw new Error('BLOCKED: original 3.0.7 update component not identified');
  }
  if (count(source, ORIGINAL) !== 1) {
    throw new Error('BLOCKED: automatic popup watcher missing or duplicated');
  }
  // A same-length source edit makes the code difference especially easy to
  // review, but does NOT bypass or restore cryptographic ASAR integrity.
  if (ORIGINAL.length !== PATCHED.length) throw new Error('Unexpected source size change');
  const output = source.replace(ORIGINAL, PATCHED);
  if (count(output, ORIGINAL) !== 0 || count(output, PATCHED) !== 1) {
    throw new Error('BLOCKED: uncontrolled update popup edit');
  }
  if (!MARKERS.every(s => output.includes(s))) throw new Error('Required update functions removed');
  return output;
}

function hash(source) {
  return crypto.createHash('sha256').update(source).digest('hex');
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) throw new Error('Supply an EXTRACTED official UI JS file; no ASAR modification is performed');
  const original = fs.readFileSync(file, 'utf8');
  const changed = preview(original);
  console.log(JSON.stringify({
    file: TARGET_FILE,
    originalSha256: hash(original),
    previewSha256: hash(changed),
    autoPopupDisabled: true,
    manualUpdateUIAndChecksPreserved: true,
    originalAsarModified: false
  }, null, 2));
}
module.exports = { TARGET_FILE, ORIGINAL, PATCHED, MARKERS, preview, hash };

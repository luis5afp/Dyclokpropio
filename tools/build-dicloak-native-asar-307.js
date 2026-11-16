#!/usr/bin/env node
'use strict';

/**
 * DICloak Nativo 0.2.0 - guarded renderer-only ASAR rebuild.
 *
 * The official DICloak.exe stays byte-for-byte unchanged. This script accepts
 * ONLY the pinned vendor 3.0.7 archive and renderer hashes, updates exactly
 * one renderer member, recomputes that member's ASAR SHA256 integrity records
 * and leaves every other member and its offsets untouched. It never changes
 * the vendor login, API signatures, or the mandatory-update UI.
 *
 * Run only in an isolated build directory containing the verified original.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const requireBuild = createRequire(path.join(__dirname, '../release-build/native-0.2.0/package.json'));
const asar = requireBuild('@electron/asar');
const popup = require('./suppress-native-update-autopopup.js');
const downloaded = require('./suppress-native-download-confirmation.js');

const PINNED_VENDOR_ASAR = 'b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf';
const PINNED_RENDERER_SHA = '4f9b3c29e8a894b20f83ad458880bac3075d08ce46155ab25dfb89445b8fba02';
const MEMBER = 'dist/assets/index-bGjMkmkL.js';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

function assert(condition, message) {
  if (!condition) throw new Error('BLOCKED: ' + message);
}
function readEntryHeader(archive) {
  const raw = asar.getRawHeader(archive);
  const headerText = raw.header;
  const headBytes = raw.headerSize;
  assert(typeof headerText === 'string' && Number.isInteger(headBytes), 'unrecognized ASAR header');
  const index = JSON.parse(headerText);
  const target = index.files?.dist?.files?.assets?.files?.['index-bGjMkmkL.js'];
  assert(target && !target.unpacked && /^\d+$/.test(String(target.offset)), 'target not packed');
  assert(target.size === 125532, 'unexpected target byte length');
  return { headerText, headBytes, target };
}
function readExact(file, offset, length) {
  const fd = fs.openSync(file, 'r');
  try {
    const content = Buffer.alloc(length);
    assert(fs.readSync(fd, content, 0, length, offset) === length, 'truncated ASAR member');
    return content;
  } finally { fs.closeSync(fd); }
}

function applyBoth(source) {
  const withoutPopup = popup.preview(source);
  const withoutDownloadDialog = downloaded.preview(withoutPopup);
  const before = Buffer.byteLength(source, 'utf8');
  const after = Buffer.byteLength(withoutDownloadDialog, 'utf8');
  const missing = before - after;
  assert(missing > 0 && missing < 3000, 'unexpected modal size difference');
  assert(withoutDownloadDialog.split(downloaded.END).length === 2, 'ambiguous download modal end');
  // Keep the exact ASAR data offsets for every member; JS whitespace is inert.
  const padded = withoutDownloadDialog.replace(downloaded.END, ' '.repeat(missing) + downloaded.END);
  assert(Buffer.byteLength(padded, 'utf8') === before, 'ASAR renderer size changed');
  assert(padded.includes('ue.value&&100===j.value&&(E.value=!0)'), 'mandatory update UI missing');
  assert(padded.includes('update.updateCenter'), 'manual update center missing');
  assert(padded.includes('openOrCloseTip'), 'manual notice trigger missing');
  assert(!padded.includes(downloaded.START), 'optional download popup remains');
  assert(!padded.includes(popup.ORIGINAL), 'automatic update popover remains');
  const checked = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: padded, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024
  });
  assert(checked.status === 0, 'generated renderer JS syntax failed: ' + (checked.stderr || ''));
  return Buffer.from(padded, 'utf8');
}
function integrityOf(data, blockSize) {
  assert(Number.isInteger(blockSize) && blockSize > 0 && blockSize <= 16777216,
    'invalid ASAR integrity block size');
  const blocks = [];
  for (let i = 0; i < data.length; i += blockSize) {
    blocks.push(sha(data.subarray(i, i + blockSize)));
  }
  return { hash: sha(data), blocks };
}
function replaceHeaderIntegrity(headerText, existing, next) {
  const oldSerialized = JSON.stringify(existing);
  const newSerialized = JSON.stringify(next);
  assert(oldSerialized.length === newSerialized.length, 'integrity metadata length changed');
  assert(headerText.split(oldSerialized).length === 2, 'ASAR integrity header not uniquely found');
  const revised = headerText.replace(oldSerialized, newSerialized);
  assert(Buffer.byteLength(revised) === Buffer.byteLength(headerText), 'ASAR header size changed');
  return revised;
}
function rebuild(folder) {
  const originalArchive = path.join(folder, 'resources', 'app.asar');
  const executable = path.join(folder, 'DICloak.exe');
  assert(fs.existsSync(executable), 'DICloak.exe missing');
  assert(!fs.existsSync(path.join(folder, 'DyclokPRO.exe')), 'old launcher present');
  assert(sha(fs.readFileSync(originalArchive)) === PINNED_VENDOR_ASAR,
    'vendor ASAR SHA256 does not match exact pinned 3.0.7 build');

  const peBefore = sha(fs.readFileSync(executable));
  const { headerText, headBytes, target } = readEntryHeader(originalArchive);
  const fileStart = 8 + headBytes + Number(target.offset);
  const rawFile = readExact(originalArchive, fileStart, target.size);
  assert(sha(rawFile) === PINNED_RENDERER_SHA, 'official renderer SHA256 mismatch');
  const record = target.integrity;
  assert(record && record.algorithm === 'SHA256' && Array.isArray(record.blocks),
    'original ASAR member integrity missing');
  const expected = integrityOf(rawFile, record.blockSize);
  assert(record.hash === expected.hash && JSON.stringify(record.blocks) === JSON.stringify(expected.blocks),
    'original ASAR integrity record does not match content');

  const edited = applyBoth(rawFile.toString('utf8'));
  const replacementRecord = {
    ...record,
    hash: sha(edited),
    blocks: integrityOf(edited, record.blockSize).blocks
  };
  const revisedHeader = replaceHeaderIntegrity(headerText, record, replacementRecord);
  const headerBytePos = readExact(originalArchive, 8, headBytes)
    .indexOf(Buffer.from(headerText, 'utf8'));
  assert(headerBytePos >= 0, 'ASAR header payload not found');

  const staging = originalArchive + '.patched-tmp';
  const backup = originalArchive + '.verified-original-bak';
  assert(!fs.existsSync(staging) && !fs.existsSync(backup),
    'refusing to overwrite an existing build staging file');
  try {
    fs.copyFileSync(originalArchive, staging, fs.constants.COPYFILE_EXCL);
    const fd = fs.openSync(staging, 'r+');
    try {
      assert(fs.writeSync(fd, edited, 0, edited.length, fileStart) === edited.length,
        'failed writing renderer member');
      const newHeaderBytes = Buffer.from(revisedHeader, 'utf8');
      assert(fs.writeSync(fd, newHeaderBytes, 0, newHeaderBytes.length, 8 + headerBytePos) ===
        newHeaderBytes.length, 'failed writing integrity header');
      fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
    assert(fs.statSync(staging).size === fs.statSync(originalArchive).size,
      'rebuilt archive size changed');
    const verified = readEntryHeader(staging);
    assert(verified.target.integrity.hash === replacementRecord.hash,
      'new ASAR integrity metadata not readable');
    const newData = readExact(staging, fileStart, target.size);
    assert(sha(newData) === replacementRecord.hash, 'repacked renderer bytes differ');
    const newIntegrity = integrityOf(newData, record.blockSize);
    assert(JSON.stringify(newIntegrity.blocks) === JSON.stringify(replacementRecord.blocks),
      'new integrity blocks invalid');
    assert(sha(fs.readFileSync(executable)) === peBefore, 'original DICloak.exe was modified');

    // Swap only after verification; never include the backup in the installer.
    fs.renameSync(originalArchive, backup);
    try { fs.renameSync(staging, originalArchive); }
    catch (e) { fs.renameSync(backup, originalArchive); throw e; }
    fs.unlinkSync(backup);
    const manifest = {
      deliveryVersion: '0.2.0',
      originalEngine: 'DICloak 3.0.7',
      executableSha256: peBefore,
      officialAsarSha256: PINNED_VENDOR_ASAR,
      modifiedAsarSha256: sha(fs.readFileSync(originalArchive)),
      originalRendererSha256: PINNED_RENDERER_SHA,
      updatedRendererSha256: sha(edited),
      modifiedFile: MEMBER,
      changes: ['hide_optional_update_center_auto_popup', 'hide_optional_download_complete_prompt'],
      mandatoryUpdateCheckPreserved: true,
      vendorAuthenticationUnchanged: true
    };
    fs.writeFileSync(path.join(folder, 'resources', 'dyclok-native-update-ui-manifest.json'),
      JSON.stringify(manifest, null, 2) + '\n');
    return manifest;
  } finally {
    if (fs.existsSync(staging)) fs.unlinkSync(staging);
  }
}
if (require.main === module) {
  const folder = process.argv[2];
  assert(folder, 'Usage: build-dicloak-native-asar-307.js <unpacked-official-folder>');
  console.log(JSON.stringify(rebuild(path.resolve(folder)), null, 2));
}
module.exports = { applyBoth, integrityOf, replaceHeaderIntegrity, readEntryHeader, rebuild };

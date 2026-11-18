'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { START, END, REPLACEMENT, MUST_RETAIN, preview } = require('./suppress-native-download-confirmation.js');

const confirmation = START +
  '\x60<h1>update.downloadCompleted</h1> update.noteTip\x60,"",{confirmButtonText:"update.installNow",cancelButtonText:"update.installLater"})' +
  '.then(()=>{he.value?vt():$e()}).catch(()=>{})';
const fixture = MUST_RETAIN.join(';') + ';' + confirmation + END + 'return Promise.resolve()}';

test('optional downloaded-installer confirmation no longer interrupts UI', () => {
  const changed = preview(fixture);
  assert.equal(changed.includes(START), false);
  assert.equal(changed.includes(REPLACEMENT), true);
  assert.equal(changed.includes(END), true);
});

test('mandatory upgrade behavior and download progress remain untouched', () => {
  const changed = preview(fixture);
  for (const marker of MUST_RETAIN) assert.ok(changed.includes(marker), marker);
  assert.ok(changed.includes('ue.value&&100===j.value&&(E.value=!0)'));
  assert.ok(changed.includes('ue.value||100!==j.value||dt()'));
});

test('fail closed if the original confirmation structure changed', () => {
  assert.throws(() => preview('unrelated'), /unknown DICloak/);
  assert.throws(() => preview(fixture.replace(START, 'dt=()=>other(')), /markers/);
  assert.throws(() => preview(fixture+confirmation+END), /repeated/);
  assert.throws(() => preview(fixture.replace('update.noteTip', 'omitted-in-body')), /confirmation body/);
});

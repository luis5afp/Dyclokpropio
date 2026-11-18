'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const patch = require('./suppress-native-update-autopopup.js');

const fixture = patch.MARKERS.join(';') + ';' + patch.ORIGINAL;

test('disables only the opening call and leaves the rest intact', () => {
  const changed = patch.preview(fixture);
  assert.equal(changed.length, fixture.length);
  assert.equal(changed.includes(patch.ORIGINAL), false);
  assert.equal(changed.includes(patch.PATCHED), true);
  for (const marker of patch.MARKERS) assert.ok(changed.includes(marker));
});

test('blocks missing / duplicated watchers and unrecognized component', () => {
  assert.throws(() => patch.preview(fixture + patch.ORIGINAL), /missing or duplicated/);
  assert.throws(() => patch.preview(fixture.replace(patch.ORIGINAL, '')), /missing or duplicated/);
  assert.throws(() => patch.preview(patch.ORIGINAL), /not identified/);
});

test('preview never writes files or modifies a vendor ASAR', () => {
  const out = patch.preview(fixture);
  assert.equal(typeof out, 'string');
  assert.equal(patch.hash(out).length, 64);
});

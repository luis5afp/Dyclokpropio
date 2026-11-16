'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  compareVersions, selectLatestRelease, parseChecksum, assertGithubUrl
} = require('../src/main/silent-auto-update.js');

const asset = (tag, name) => ({
  name,
  browser_download_url: 'https://github.com/luis5afp/Dyclokpropio/releases/download/' + tag + '/' + name
});
function release(tag, opts = {}) {
  const version = tag.slice(1);
  return {
    tag_name: tag,
    draft: !!opts.draft,
    prerelease: !!opts.prerelease,
    assets: [
      asset(tag, 'Dyclokpropio_' + version + '_win_x64.exe'),
      asset(tag, 'SHA256SUMS.txt')
    ]
  };
}

test('delivery versions compare numerically, not lexically', () => {
  assert.equal(compareVersions('30.0.10', '30.0.9'), 1);
  assert.equal(compareVersions('30.0.9', '30.0.10'), -1);
  assert.equal(compareVersions('30.0.10', '30.0.10'), 0);
  assert.throws(() => compareVersions('6.44', '30.0.1'));
});

test('only newer stable Dyclokpropio releases qualify', () => {
  const releases = [
    release('v6.44', { prerelease: true }),
    release('v30.0.21', { prerelease: true }),
    release('v30.0.20', { draft: true }),
    release('v30.0.18'),
    release('v30.0.19'),
    release('v30.0.17')
  ];
  assert.equal(selectLatestRelease(releases, '30.0.17').version, '30.0.19');
  assert.equal(selectLatestRelease(releases, '30.0.19'), null);
});

test('unrelated installers, missing sums and malicious asset URLs are ignored', () => {
  const impostor = release('v30.0.22');
  impostor.assets[0].browser_download_url = 'https://example.com/evil.exe';
  const missing = release('v30.0.23');
  missing.assets.pop();
  assert.equal(selectLatestRelease([impostor, missing], '30.0.10'), null);
});

test('checksum must correspond exactly to the expected installer', () => {
  const name = 'Dyclokpropio_30.0.19_win_x64.exe';
  const sum = 'a'.repeat(64);
  assert.equal(parseChecksum(sum + '  ' + name + '\r\n', name), sum);
  assert.throws(() => parseChecksum(sum + '  unrelated.exe', name));
});

test('download source rejects non-GitHub and non-HTTPS URLs', () => {
  assert.throws(() => assertGithubUrl('http://github.com/fake.exe'));
  assert.throws(() => assertGithubUrl('https://github.com.evil.test/x'));
  assert.throws(() => assertGithubUrl('https://evil.test/x'));
  assert.equal(assertGithubUrl('https://release-assets.githubusercontent.com/x').hostname,
    'release-assets.githubusercontent.com');
});

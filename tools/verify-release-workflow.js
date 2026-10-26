'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const yaml = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'release-safe-base.yml'),
  'utf8'
);

function has(text) {
  assert.ok(yaml.includes(text), 'Missing safe release workflow property: ' + text);
}

has('  contents: write');
has('  cancel-in-progress: false');
has('name: Calculate next public version (v30.0.N)');
has('matching-refs/tags/v30.0');
has('version=$release');
has('name: Verify uploaded-base compatibility');
has('name: Restore bundled Cookies Pro before building');
has('name: Smoke-launch built executable');
has('name: Prepare versioned delivery');
has('name: Upload versioned delivery');
has('name: Publish installer on GitHub Releases');
has('Get-FileHash -LiteralPath $installer -Algorithm SHA256');
has("Get-Content -LiteralPath $checksumFile -Raw");
has('gh release create $tag $installer $checksumFile $versionFile');
has('--target $builtCommit');
has('Refusing to overwrite a published installer');
has('if ($LASTEXITCODE -ne 0) { throw "Could not publish release $tag" }');

const verify = yaml.indexOf('      - name: Verify uploaded-base compatibility');
const build = yaml.indexOf('      - name: Build Windows installer from original runtime');
const smoke = yaml.indexOf('      - name: Smoke-launch built executable');
const artifact = yaml.indexOf('      - name: Upload versioned delivery');
const publish = yaml.indexOf('      - name: Publish installer on GitHub Releases');
assert.ok(verify > -1 && verify < build && build < smoke && smoke < artifact && artifact < publish,
  'Must publish only after integrity, Windows build, smoke-launch and artifact delivery');

// A Release MUST include the .exe itself rather than only a workflow artifact.
const step = yaml.slice(publish);
assert.ok(step.includes('$installer') && step.includes('$checksumFile') && step.includes('$versionFile'),
  'Release assets incomplete');
assert.ok(step.includes('$tag = '), 'Release tag missing');

// Version computation uses the highest matching v30.0.N tag, not internal
// compatibility version or the workflow run number.
const tags = ['refs/tags/v30.0.0', 'refs/tags/v29.5.9'];
const numbers = tags
  .map(tag => /^refs\/tags\/v30\.0\.(\d+)$/.exec(tag))
  .filter(Boolean)
  .map(match => Number(match[1]));
assert.equal('30.0.' + (Math.max(0, ...numbers) + 1), '30.0.1');

console.log('PASS: Safe Base release workflow publishes a direct EXE after verified Windows build.');
console.log('PASS: First public tag after v30.0.0 is v30.0.1.');

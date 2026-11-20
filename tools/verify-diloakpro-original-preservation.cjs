'use strict';
// Release gate for the original *in-app* diloakPRO diagnostics; NEVER replace
// an incompatible engine just by changing its version string.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const requireText = (rel, fragments) => {
  const body = source(rel);
  const missing = fragments.filter(fragment => !body.includes(fragment));
  if (missing.length) throw new Error('DIAGNOSTIC_REGRESSION: ' + rel + ' missing ' + missing.join(', '));
};
function releaseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version || '');
  if (!match) return null;
  return match.slice(1).map(Number);
}
function versionIsCompatible(version, min = [3, 0, 5]) {
  const a = releaseVersion(version);
  if (!a) return false;
  for (let i = 0; i < 3; ++i) {
    if (a[i] !== min[i]) return a[i] > min[i];
  }
  return true;
}
const required = [
  ['src/renderer/diagnostic-panel.js', [
    'Diagnóstico de diloakPRO', 'Exportar JSON', 'Exportar TXT',
    'dyclok-diag-control', 'dyclok-diag-event'
  ]],
  ['src/main/diagnostic-console.js', [
    'createDiagnosticConsole', 'startCapture', 'IPC_NO_HANDLER', 'lab',
    'MAX_ROWS'
  ]],
  ['src/main/diagnostic-observer.js', [
    'startNodeHttpTrace', 'startWindowsSampler', 'labCapture'
  ]],
  ['src/main/diloakpro-lab-response-capture.js', [
    'sha256_match', 'sha256_mismatch', 'aes-256-gcm',
    'DILOAKPRO_LAB_CAPTURE_ORIGIN'
  ]],
  ['src/main/bundled-extension-bootstrap.js', [
    'createDiagnosticConsole', 'registerOpenStageDiagnostics',
    "module.exports = require('../../dist-electron/main.js')"
  ]],
  ['electron-builder.yml', [
    'src/main/diagnostic-console.js',
    'src/main/diagnostic-observer.js',
    'src/main/diloakpro-lab-response-capture.js'
  ]]
];
for (const [rel, fragments] of required) requireText(rel, fragments);
console.log('ORIGINAL_IN_APP_DIAGNOSTIC_UI_AND_OBSERVERS=PASS');
const app = JSON.parse(source('package.json'));
console.log('ORIGINAL_BUNDLED_RUNTIME_VERSION=' + app.version);
const compatible = versionIsCompatible(app.version);
if (!compatible) {
  console.error('BLOCKED: real original engine ' + app.version +
    ' is older than provider minimum 3.0.5. A marketing release number ' +
    'or altered string does not fix the underlying runtime.');
  if (process.argv.includes('--release-gate')) process.exitCode = 2;
} else {
  console.log('VERSION_DECLARED_COMPATIBLE=YES_BUT_LOGIN_AND_NATIVE_INTEGRITY_STILL_REQUIRE_WINDOWS_TESTS');
}
if (process.argv.includes('--release-gate') && compatible) {
  // A declared version is a necessary but NEVER sufficient release condition:
  // vendor-signed 3.0.9 must be validated separately, with real user login.
  console.error('BLOCKED: human-approved Windows login and Chromium validation not provided');
  process.exitCode = 3;
}

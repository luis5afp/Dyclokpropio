'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');

const EXPECTED = Object.freeze({
  'dist/index.html': 'fa8e6050165005724614d39b26641bdc4d1be1ceeea39bf7b0d84c49444dd667',
  'dist/assets/index-BUIbb6Pa.js': '7de2a353b92c130b93b5c455826efaa6e1c8788cf44f99185b450e61379dc0df',
  'dist-electron/main.js': '69d38eecb10637d8fc3e2cfd5b86ea79894315db13b41800b1f1c61aa2a65517',
  'dist-electron/main-CuCOh59n.js': '1fe224de31533973bffc386ee830c878c9ef2ce09199de3a4bc7c3268b9371ac',
  'dist-electron/preload/index.js': 'b27ea4bb8965032db87ca7c5513b4e0621b97a5d042a2f4c0ef307cd04c044d4',
  'dist-electron/openapi/app.js': '46fc08252f813edd2be51da02c5228e76d21c75d038d18351d308dc569a467e4',
  'dist-electron/openapi/index.js': 'b01036345dde745f5d80b32604ac5aee6d2ffd04c935e477f309b03408727ac5',
  'dist-electron/openapi/index-CazkkzsQ.js': 'aed89f230bc89e0e97f6a4e0a1fa5405c36a20963a56f2b76b3360d92f260001',
  'dist-electron/openapi/index-DpjISFhg.js': '813b226c7282f4072af52de5c1f1a2b2e91c107b68117b72ad474105f4c64b31',
  'dist-electron/synchronizer/index.js': 'd517a2011838ac6d418262ef7040d4f4bb8edd649c201e7249d48fb14524a49c',
  'dist-electron/worker/downloadWorker.js': 'cffba059fc7d5030e66a3ec1409f991b67890097dd23ee25a6273cbb7e61f3a4'
});

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
for (const [relative, expected] of Object.entries(EXPECTED)) {
  const file = path.join(ROOT, relative);
  if (!fs.existsSync(file)) throw new Error('Missing base file: ' + relative);
  const actual = sha256(file);
  if (actual !== expected) {
    throw new Error(relative + ' changed from uploaded-base hash. expected=' + expected + ' actual=' + actual);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const PACKAGE_IDENTITY = {
  name: 'DICloak',
  version: '3.0.0',
  patchVersion: '1.2.4.1',
  type: 'commonjs',
  main: 'dist-electron/main.js',
  homepage: 'https://dicloak.com/'
};
for (const [key, expected] of Object.entries(PACKAGE_IDENTITY)) {
  if (pkg[key] !== expected) {
    throw new Error('package.json compatibility field changed: ' + key + ' expected=' + expected + ' actual=' + pkg[key]);
  }
}
const requiredDependencies = {
  axios: '^1.6.8',
  electronStore: '^8.1.0',
  koa: '^2.15.3',
  vue: '^3.4.21'
};
if (pkg.dependencies.axios !== requiredDependencies.axios) throw new Error('axios dependency changed');
if (pkg.dependencies['electron-store'] !== requiredDependencies.electronStore) throw new Error('electron-store dependency changed');
if (pkg.dependencies.koa !== requiredDependencies.koa) throw new Error('koa dependency changed');
if (pkg.dependencies.vue !== requiredDependencies.vue) throw new Error('vue dependency changed');

const updateChunk = fs.readFileSync(path.join(ROOT, 'dist', 'assets', 'index-D2T4aaQJ.js'), 'utf8');
const oldPolling = 'De().then(()=>{ht()}),Y.value&&clearInterval(Y.value),Y.value=setInterval(()=>De().then(()=>{ht()}),6e5)';
if (updateChunk.includes(oldPolling)) throw new Error('Automatic startup/10-minute update check is still enabled');
if (!updateChunk.includes('/v1/app/notice')) throw new Error('Update/notice implementation was removed');
if (!updateChunk.includes('Y.value&&clearInterval(Y.value),Y.value=void 0')) throw new Error('Safe polling-disable marker missing');

console.log(JSON.stringify({
  uploadedBaseInstallerSha256: 'e29f761cce9a744d00dd1ccf82a29209a2f42c07b32c5567054419d08651dfde',
  internalCompatibilityVersion: pkg.version,
  serverAndConfigCriticalFilesUnchanged: Object.keys(EXPECTED).length,
  packageCompatibilityFieldsPreserved: Object.keys(PACKAGE_IDENTITY).length,
  automaticUpdateCheckAtStartup: false,
  periodicUpdateCheckEvery10Minutes: false,
  manualUpdateNoticeImplementationPreserved: true,
  productionMainEntry: pkg.main
}, null, 2));

'use strict';
// Build-only insertion of a UI script. Baseline and security checks run BEFORE
// this step, so committed recovered runtime assets remain unchanged.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const HTML = path.resolve(__dirname,'../dist/index.html');
const PANEL = path.resolve(__dirname,'../src/renderer/diagnostic-panel.js');
const OUT = path.resolve(__dirname,'../dist/dyclok-diagnostic-panel.js');
const BASE_SHA = 'fa8e6050165005724614d39b26641bdc4d1be1ceeea39bf7b0d84c49444dd667';
const ANCHOR = '<script type="module" crossorigin src="./assets/index-BUIbb6Pa.js"></script>';
const TAG = '<script defer src="./dyclok-diagnostic-panel.js"></script>';
function sha(buffer){return crypto.createHash('sha256').update(buffer).digest('hex');}
function transform(original){
  assert.equal(sha(original),BASE_SHA,'Original index.html has changed; refuse diagnostic UI patch');
  assert.equal(original.split(ANCHOR).length-1,1,'Expected one original renderer entry');
  assert.ok(!original.includes(TAG),'Duplicate diagnostic panel injection');
  return original.replace(ANCHOR,TAG+'\n    '+ANCHOR);
}
function main(){
  const html = fs.readFileSync(HTML,'utf8');
  const output = transform(html);
  const script = fs.readFileSync(PANEL,'utf8');
  assert.ok(script.includes('Diagnóstico') && script.includes('dyclok-diag-control'),'Missing panel UI');
  const vm = require('node:vm');
  new vm.Script(script,{filename:'dyclok-diagnostic-panel.js'});
  if(process.argv.includes('--apply')){
    fs.writeFileSync(OUT,script,'utf8');
    fs.writeFileSync(HTML,output,'utf8');
  }
  console.log('PASS: diagnostic button injected after guarded baseline; panel JavaScript valid.');
}
if(require.main===module)main();
module.exports={transform,BASE_SHA,TAG};

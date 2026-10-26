'use strict';
/**
 * Contracts for original signed/internal plugin tree:
 * - .automa, .simulation and .spoofing-video remain where recovered runtime expects
 * - the unrelated optional extension must never be in the hashed plugins tree
 * - optional ZIP stays packaged separately with its verified manifest.
 * Only analyses install build inputs, not user profiles.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const plugins=path.join(root,'plugins');
const original=['.automa','.simulation','.spoofing-video'].sort();
const names=fs.readdirSync(plugins,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort();
assert.deepEqual(names,original,
  'Original internally signed plugins directory has unexpected subfolders: '+JSON.stringify(names));
for(const item of original){
 const manifest=JSON.parse(fs.readFileSync(path.join(plugins,item,'manifest.json'),'utf8'));
 assert.ok(typeof manifest.name==='string' && typeof manifest.version==='string');
}
assert.equal(fs.existsSync(path.join(plugins,'.cookies-pro-privada')),false,
  'Optional bundled Cookies Pro incorrectly changes internally signed plugin content');
const optional=path.join(root,'optional-extensions','.cookies-pro-privada','manifest.json');
const bundled=JSON.parse(fs.readFileSync(optional,'utf8'));
assert.equal(bundled.name,'Cookies Pro Privada');
assert.equal(bundled.version,'16.9.10');
const cfg=fs.readFileSync(path.join(root,'electron-builder.yml'),'utf8');
assert.ok(cfg.includes('from: optional-extensions') && cfg.includes('to: optional-extensions'));
const bootstrap=fs.readFileSync(path.join(root,'src/main/bundled-extension-bootstrap.js'),'utf8');
assert.ok(bootstrap.includes("const ENABLE_BUNDLED_COOKIES_PRO = false;"));
assert.ok(bootstrap.includes("process.resourcesPath, 'optional-extensions', '.cookies-pro-privada'"));
console.log('PASS: Only three original internal plugin folders; optional extension never participates in their hash');
console.log('PASS: Optional extension resources available outside plugins, injection disabled');

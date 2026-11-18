'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {safeEvent}=require('./almacen-native-integrated-diagnostic.cjs');
const {validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');

test('unknown vendor phase numbers are retained as bounded nonsecret codes only',()=>{
 const start=safeEvent('step_start','17');
 assert.equal(start.event,'stage_unknown');
 assert.equal(start.phaseCode,17);
 const complete=safeEvent('step_complete','17');
 assert.equal(complete.stage,'stage_unknown');
 assert.equal(complete.phaseCode,17);
 const validated=validateDiagnostic(complete);
 assert.equal(validated.phaseCode,17);
 for(const value of [
   'Proxy-Authorization: secret','/cookies/path','256','-1',
   '1.3','01','SECRET_PASSPHRASE'
 ]){
   const event=safeEvent('step_complete',value);
   assert.equal(event.phaseCode,undefined);
   assert.equal(event.stage,'stage_unknown');
   assert.equal(event.event,'operation_step_completed');
   assert.deepEqual(Object.keys(event).sort(),['at','event','source','stage']);
 }
 const secret=safeEvent('step_complete','Proxy-Authorization: SECRET_TEST_TOKEN');
 assert.ok(!JSON.stringify(secret).includes('SECRET_TEST_TOKEN'));
 assert.equal(safeEvent('step_complete','LOCK_ENV').phaseCode,undefined);
 assert.equal(safeEvent('step_complete','LOCK_ENV').stage,'stage_lock_env');
});

test('diagnostic schema rejects arbitrary numeric codes on normal events',()=>{
 const ok=validateDiagnostic({source:'programa',event:'stage_unknown',phaseCode:10});
 assert.equal(ok.phaseCode,10);
 for(const bad of [
   {source:'programa',event:'stage_fetch_env_info',phaseCode:10},
   {source:'programa',event:'stage_unknown',phaseCode:300},
   {source:'programa',event:'stage_unknown',phaseCode:-1},
   {source:'programa',event:'stage_unknown',phaseCode:'10'},
   {source:'programa',event:'operation_step_failed',phaseCode:10},
 ])assert.throws(()=>validateDiagnostic(bad),/INVALID_DIAGNOSTIC_PHASE_CODE/);
});

test('embedded panel uses explicit high contrast colors and safe text-only rendering',()=>{
 const html=fs.readFileSync(path.join(__dirname,'almacen-diagnostic-panel.html'),'utf8');
 assert.match(html,/:root\{color-scheme:dark;/);
 assert.match(html,/background:#111923;color:#eef4fb/);
 assert.match(html,/th\{position:sticky;top:0;background:#25364b;color:#fff/);
 assert.match(html,/phaseCode/);
 assert.ok(!html.includes('color-scheme:light dark'));
 assert.ok(!html.includes('innerHTML'));
 assert.ok(html.includes('td.textContent=value'));
 assert.ok(html.includes('Date.parse(b.at)-Date.parse(a.at)'));
});


test('failed native profile-opening stage increments visible error count',async()=>{
 const {startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
 const panel=await startDiagnosticPanel();
 try{
  panel.emit({...safeEvent('step_failed','PROXY_CHECK')});
  panel.emit({...safeEvent('step_complete','OPEN_ENV')});
  const status=panel.getState();
  assert.equal(status.counters.total,3);
  assert.equal(status.counters.failed,1);
  assert.equal(status.counters.approved,0);
  assert.equal(status.counters.saved,0);
 }finally{
  await panel.stop();
 }
});

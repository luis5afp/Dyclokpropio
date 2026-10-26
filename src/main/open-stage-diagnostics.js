'use strict';

/**
 * Opt-in-by-build, redacted opening-stage diagnostics. The stage logger only
 * receives fixed stage names, phase and sanitized error codes. It never stores
 * environment IDs, usernames, URLs, cookies, credentials, paths, or stack traces.
 */
const fs = require('node:fs');
const path = require('node:path');
const CHANNEL = 'dyclok-open-stage';
const VALID_STEPS = new Set([
  'preDataInject','preCheck','cookieEncryptPlan','chooseKernel','preProxyCheck',
  'fetchEnvInfo','proxyCheck','proxyCheckResult','expandCheck','paramsMerge',
  'lockEnv','openEnv','catchError','timeout','polyfillRowData','rpaPreInject',
  'lockEnvRpa','mergeEnvParamsRpa'
]);
const VALID_PHASES = new Set(['start','success','fail','terminal']);
const VALID_CODES = /^[A-Z][A-Z0-9_]{2,79}$/;
const VALID_CLASSES = new Set([
  'Error','TypeError','ReferenceError','SyntaxError','RangeError',
  'AggregateError','NetworkError','AbortError','TimeoutError'
]);
function sanitize(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (!VALID_STEPS.has(payload.step) || !VALID_PHASES.has(payload.phase)) return null;
  const code = typeof payload.code === 'string' && VALID_CODES.test(payload.code)
    ? payload.code : 'UNCLASSIFIED';
  const errorClass = VALID_CLASSES.has(payload.errorClass) ? payload.errorClass : 'Other';
  return {utc:new Date().toISOString(),step:payload.step,phase:payload.phase,code,errorClass};
}
function registerOpenStageDiagnostics(ipcMain,app,{fileSystem=fs}={}){
  if(!ipcMain||typeof ipcMain.handle!=='function')throw new TypeError('Missing ipcMain.handle');
  ipcMain.handle(CHANNEL,async(_event,payload)=>{
    const entry=sanitize(payload);
    if(!entry||!app?.isReady?.()) return false;
    try{
      const userData=app.getPath('userData');
      if(!userData)return false;
      const file=path.join(userData,'dyclok-open-stage.jsonl');
      if(fileSystem.existsSync(file)&&fileSystem.statSync(file).size>262144){
        const old=file+'.old';
        if(fileSystem.existsSync(old))fileSystem.unlinkSync(old);
        fileSystem.renameSync(file,old);
      }
      fileSystem.appendFileSync(file,JSON.stringify(entry)+'\n',{encoding:'utf8',flag:'a',mode:0o600});
      return true;
    }catch{return false;}
  });
}
module.exports={CHANNEL,sanitize,registerOpenStageDiagnostics};

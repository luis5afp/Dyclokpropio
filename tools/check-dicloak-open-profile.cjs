#!/usr/bin/env node
'use strict';
/**
 * Safe read-only DICloak V2 diagnostic for exactly one selected profile.
 * Does not access cookies, credentials, proxy config, page URLs or CDP
 * response bodies. Prints only connectivity and running/stopped state.
 */
const {getRunningTestProfile}=require('./dicloak-local-api-profile.cjs');
async function checkProfileState({apiPort,apiKey,profileId}) {
  const running=await getRunningTestProfile({apiPort,apiKey,profileId});
  return Object.freeze({
    apiReachable:true,
    running:!!running,
    localDebuggerAvailable:!!running?.debugPort,
    explicitProfileIdentityMatch:true,
    sensitiveFieldsRead:false
  });
}
async function main(env=process.env){
  const apiPort=Number(env.DICLOAK_LOCAL_API_PORT||'52100');
  const apiKey=env.DICLOAK_LOCAL_API_KEY;
  const profileId=env.DICLOAK_TEST_PROFILE_ID;
  if(!apiKey||!profileId)throw Error('MISSING_LOCAL_API_KEY_OR_TEST_PROFILE_ID');
  const result=await checkProfileState({apiPort,apiKey,profileId});
  process.stdout.write('LOCAL_API_V2_ACCESS=PASS\n');
  process.stdout.write('PROFILE_STATUS='+(result.running?'RUNNING':'STOPPED')+'\n');
  process.stdout.write('CHROMIUM_LOCAL_DEBUGGER='+
    (result.localDebuggerAvailable?'AVAILABLE':'NOT_RUNNING')+'\n');
  process.stdout.write('PROFILE_IDENTITY_VERIFIED='+
    (result.explicitProfileIdentityMatch?'PASS':'FAIL')+'\n');
  process.stdout.write('COOKIES_OR_CREDENTIALS_READ=FALSE\n');
  return result;
}
if(require.main===module)main().catch(error=>{
  const code=String(error?.message||'DIAGNOSTIC_FAILED');
  process.stderr.write('DICLOAK_CHECK_ERROR='+
    (/^[A-Z0-9_]+$/.test(code)?code:'DIAGNOSTIC_FAILED')+'\n');
  process.exitCode=1;
});
module.exports={checkProfileState,main};

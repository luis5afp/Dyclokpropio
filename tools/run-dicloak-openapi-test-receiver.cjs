#!/usr/bin/env node
'use strict';
/**
 * Experimental, explicit opt-in runner. No credentials in arguments or logs.
 * Starts only the named own test profile via DICloak's documented Local API.
 * Works independently of the DICloak desktop vendor renderer.
 */
const path=require('node:path');
const os=require('node:os');
const fs=require('node:fs/promises');
const {startTestProfile,waitForRunningTestProfile,findBrowserWebSocket}=
  require('./dicloak-local-api-profile.cjs');
const {createAllowedCdpRecorder}=require('./almacen-allowed-cdp.cjs');
const {parseTestScope}=require('./almacen-profile-test-receiver.cjs');

function configFromEnv(env){
  const apiPort=Number(env.DICLOAK_LOCAL_API_PORT||'52100');
  const apiKey=env.DICLOAK_LOCAL_API_KEY;
  const profileId=env.DICLOAK_TEST_PROFILE_ID;
  const testEndpointPrefix=env.DICLOAK_TEST_ENDPOINT_PREFIX;
  const version=env.DICLOAK_LOCAL_API_VERSION||'v1';
  const mode=env.DICLOAK_TEST_OPERATION_MODE||'attach';
  if(!['attach','start'].includes(mode))throw Error('TEST_OPERATION_MODE_INVALID');
  const seconds=Number(env.DICLOAK_TEST_RECORD_SECONDS||'60');
  if(!profileId || !testEndpointPrefix || !apiKey)
    throw Error('CONFIG_MISSING: set local API key, test profile ID and approved test URL in environment');
  parseTestScope(testEndpointPrefix);
  if(!Number.isInteger(seconds)||seconds<2||seconds>300)
    throw Error('INVALID_TEST_DURATION_SECONDS');
  return {apiPort,apiKey,profileId,testEndpointPrefix,version,seconds,mode};
}
async function runLab(env=process.env){
 const config=configFromEnv(env);
 // Do not print or serialize API keys or debugging WebSocket URLs.
 process.stdout.write(config.mode==='attach'?
   'ESPERANDO_OPERACION_ABRIR=TRUE\n':'INICIANDO_PERFIL_DE_PRUEBA_POR_API=TRUE\n');
 const started=config.mode==='attach'?
   await waitForRunningTestProfile(config):
   await startTestProfile(config);
 const wsUrl=started.webSocketUrl||
    await findBrowserWebSocket(started.debugPort);
 const rootFolder=path.join(env.LOCALAPPDATA||path.join(os.homedir(),'AppData','Local'),
   'DICloak-Test-Server-Reception-036');
 await fs.mkdir(rootFolder,{recursive:true,mode:0o700});
 const recorder=createAllowedCdpRecorder({
   profileId:started.profileId,debugPort:started.debugPort,
   wsUrl,rootFolder,
   testEndpointPrefix:config.testEndpointPrefix
 });
 await recorder.start();
 process.stdout.write('DICLOAK_OPENAPI_SESSION_BOUND=PASS\n');
 process.stdout.write('AUTHORIZED_TEST_ENDPOINT_MONITOR=ACTIVE\n');
 try {
   await new Promise(resolve=>setTimeout(resolve,config.seconds*1000));
 }finally{
   const outcome=await recorder.stop();
   process.stdout.write('AUTHORIZED_TEST_DOCUMENTS_SAVED='+outcome.saved+'\n');
   process.stdout.write('AUTHORIZED_TEST_RECORDING_ERRORS='+outcome.failed+'\n');
   process.stdout.write('BROWSER_PROFILE_REMAINS_OPEN=TRUE\n');
   process.stdout.write('NATIVE_COOKIE_OR_PASSWORD_EXPORT=FALSE\n');
 }
}
if(require.main===module){
 runLab().catch(error=>{
   // Do not print error object, response bodies or any host-supplied content.
   const code=String(error?.message||'TEST_CONNECTION_FAILED');
   const safe=/^[A-Z0-9_]+$/.test(code)?code:'TEST_CONNECTION_FAILED';
   process.stderr.write('DICLOAK_TEST_ERROR='+safe+'\n');
   process.exitCode=1;
 });
}
module.exports={runLab,configFromEnv};

#!/usr/bin/env node
'use strict';
/**
 * Start a local diagnostics panel without requiring an API key.
 * If a real test profile and authorized test server were configured,
 * attach the opt-in observer. Otherwise display the missing
 * configuration event; never fake received data.
 */
const {startDiagnosticPanel}=require('./almacen-diagnostic-panel.cjs');
const {runLab}=require('./run-dicloak-openapi-test-receiver.cjs');
function safeCode(error){
  const code=String(error?.message||'DIAGNOSTIC_FAILED');
  return /^[A-Z0-9_]+$/.test(code)?code:'DIAGNOSTIC_FAILED';
}
async function main(env=process.env){
  const panel=await startDiagnosticPanel();
  process.stdout.write('PANEL_DIAGNOSTICO_LOCAL='+panel.url+'\n');
  process.stdout.write('PANEL_SOLO_EVENTOS_SANITIZADOS=TRUE\n');
  process.stdout.write('PARA_CERRAR_PRESIONE_CTRL_C=TRUE\n');
  if(env.DICLOAK_AUTOOPEN_DIAGNOSTIC_PANEL==='1' && process.platform==='win32'){
    const {spawn}=require('node:child_process');
    // Generated localhost URL only; never interpolate user-provided values.
    const child=spawn('cmd.exe',['/c','start','',panel.url],{
      windowsHide:true,stdio:'ignore'
    });
    child.once('error',()=>{});
  }
  process.once('SIGINT',()=>{
    void panel.stop().then(()=>{process.exitCode=0});
  });
  // No credentials: UI stays available and truthfully says "not connected".
  if(!env.DICLOAK_LOCAL_API_KEY||!env.DICLOAK_TEST_PROFILE_ID||
     !env.DICLOAK_TEST_ENDPOINT_PREFIX){
    panel.emit({source:'programa',event:'configuration_missing'});
    process.stdout.write('OBSERVADOR=NO_CONFIGURADO\n');
    process.stdout.write('NO_SE_HA_CAPTURADO_TRAFICO=TRUE\n');
    return panel;
  }
  try{
    await runLab(env,{onDiagnostic:panel.emit});
    process.stdout.write('OBSERVADOR=FINALIZADO\n');
  }catch(error){
    panel.emit({source:'programa',event:'connection_failed'});
    process.stderr.write('DIAGNOSTICO_ERROR='+safeCode(error)+'\n');
  }
  return panel;
}
if(require.main===module){
 main().catch(error=>{
   process.stderr.write('DIAGNOSTICO_ERROR='+safeCode(error)+'\n');
   process.exitCode=1;
 });
}
module.exports={main,safeCode};

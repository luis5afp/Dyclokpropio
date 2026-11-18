'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {EventEmitter}=require('node:events');
const {
  safeStage,safeEvent,createNativeDiagnosticController,
  createDiagnosticWindow
}=require('./almacen-native-integrated-diagnostic.cjs');

const builder=fs.readFileSync(path.join(__dirname,'build-dicloak-native-diagnostic-039.js'),'utf8');
function buildConst(name,next){
  const from=builder.indexOf('const '+name+'=');
  const to=builder.indexOf('const '+next+'=',from);
  assert.ok(from>=0&&to>from,'missing build constant '+name);
  return vm.runInNewContext(builder.slice(from,to)+'\n'+name);
}

test('safe opening stages use only fixed names, never proxy or cookie values',()=>{
  assert.equal(safeStage('FETCH_ENV_INFO'),'stage_fetch_env_info');
  assert.equal(safeStage('indexeddb-download'),'stage_indexeddb_download');
  assert.equal(safeStage('COOKIE_ENCRYPT_PLAN'),'stage_cookie_encrypt_plan');
  assert.equal(safeStage('Bearer token=TOP_SECRET'),'stage_unknown');
  assert.equal(safeEvent('open_requested').event,'operation_open_requested');
  assert.equal(safeEvent('step_failed','FAIL').event,'operation_step_failed');
  assert.equal(safeEvent('step_complete','FETCH_ENV_INFO').event,'operation_step_completed');
  assert.throws(()=>safeEvent('get_session_cookies',''),/DIAG_INVALID_SIGNAL/);
});

test('embedded diagnostics serve only 1 profile row and preserve ordering/ISO timestamps',async()=>{
  const created=[];
  const createWindow=async args=>{
    const win=new EventEmitter();
    win.focus=()=>win.focused=true;
    win.close=()=>win.emit('closed');
    created.push({...args,window:win});
    return win;
  };
  const c=createNativeDiagnosticController({createWindow});
  c.note('profile_7','open_requested');
  c.note('profile_7','step_start','fetch_env_info');
  c.note('profile_7','step_start','secret_password_123');
  c.note('profile_8','step_failed','proxy_secret=abc');
  assert.deepEqual(c.snapshot('profile_7').map(e=>e.event),[
    'operation_open_requested','stage_fetch_env_info','stage_unknown'
  ]);
  const shown=await c.show('profile_7',null);
  assert.equal(shown.ok,true);
  assert.equal(shown.httpBodiesCaptured,false);
  assert.equal(shown.actualNativeSessionVerified,false);
  assert.equal(created.length,1);
  assert.ok(created[0].url.startsWith('http://127.0.0.1:'));
  const opened=await c.show('profile_7',null);
  assert.equal(opened.alreadyOpened,true);
  assert.equal(created.length,1);
  c.note('profile_7','step_failed','proxy_check');
  assert.equal(c.snapshot('profile_7').at(-1).event,'operation_step_failed');
  assert.equal(c.snapshot('profile_8')[0].event,'operation_step_failed');
  assert.equal(c.snapshot('profile_7').length,4);
  assert.ok(!JSON.stringify(c.snapshot('profile_7')).includes('secret_password_123'));
  created[0].window.close();
  await new Promise(resolve=>setTimeout(resolve,40));
});

test('test native BrowserWindow opens an isolated sandboxed diagnostics tab only',async()=>{
  let options,allowedURL,windowOpened;
  class FakeWindow{
    constructor(o){
      options=o;
      this.webContents={
        setWindowOpenHandler:fn=>{windowOpened=fn},
        on:(name,fn)=>{assert.equal(name,'will-navigate');this.preventNavigation=fn}
      };
    }
    async loadURL(url){allowedURL=url;}
  }
  await createDiagnosticWindow({
    BrowserWindow:FakeWindow,profileId:'profile_7',parentWindow:null,
    url:'http://127.0.0.1:12345/diagnostico/mock/'
  });
  assert.ok(allowedURL.startsWith('http://127.0.0.1'));
  assert.equal(options.webPreferences.nodeIntegration,false);
  assert.equal(options.webPreferences.contextIsolation,true);
  assert.equal(options.webPreferences.sandbox,true);
  assert.equal(options.webPreferences.webSecurity,true);
  assert.equal(options.webPreferences.devTools,false);
  assert.deepEqual(windowOpened(),{action:'deny'});
});

for(const isolated of [true,false]){
  test('preload diagnostics IPC is restricted to named operations, isolated='+isolated,async()=>{
    const src=buildConst('PRELOAD_ADDITION','APP_MAIN_ADDITION');
    const calls=[],sent=[],surface={},window={};
    const api={
      invoke:async(...x)=>{calls.push(x);return {ok:true}},
      send:(...x)=>{sent.push(x)}
    };
    vm.runInNewContext(src,{
      process:{contextIsolated:isolated},window,console,
      require:()=>({
        contextBridge:{exposeInMainWorld:(k,v)=>{surface[k]=v}},
        ipcRenderer:api
      })
    });
    const bridge=isolated?surface.dicloakAlmacenLab:window.dicloakAlmacenLab;
    assert.equal(typeof bridge.diagnostic,'function');
    assert.equal((await bridge.diagnostic('profile_7')).ok,true);
    assert.equal((await bridge.open('profile_7')).ok,true);
    bridge.noteOpen('profile_7');
    bridge.noteStep('profile_7','FETCH_ENV_INFO');
    bridge.noteFailure('profile_7','LOCK_ENV');
    bridge.noteComplete('profile_7','OPEN_ENV');
    assert.equal(calls[0][0],'almacen-diag:show');
    assert.equal(calls[1][0],'almacen-lab:open');
    assert.deepEqual(sent.map(x=>x[0]),[
      'almacen-diag:event','almacen-diag:event',
      'almacen-diag:event','almacen-diag:event'
    ]);
    assert.equal(typeof bridge.invoke,'undefined');
    assert.equal(typeof bridge.send,'undefined');
  });
}

test('0.3.9 UI has Almacén and Diagnóstico side by side; vendor authentication is unchanged',()=>{
  const diag=buildConst('ADD_DIAG_COLUMN','FIELD_CONFIG');
  assert.ok(diag.includes('label:"Diagnóstico"'));
  assert.ok(diag.includes('width:162,align:"center"'));
  assert.ok(diag.includes('width:"135px",minWidth:"135px",height:"48px"'));
  assert.ok(builder.includes("onClick:t=>oi(e.row)"));
  assert.ok(builder.includes("No.onStepStart((e,t)=>{var a;"));
  assert.ok(builder.includes("No.onStepFail(async(e,t)=>{"));
  assert.ok(builder.includes("No.onStepComplete((e,t)=>{"));
  assert.ok(builder.includes('nativeIntegrityAuditReadOnly:true'));
  assert.ok(builder.includes('integratedDiagnosticUI:true'));
  assert.ok(builder.includes('realHttpBodiesCaptured:false'));
  assert.ok(builder.includes("deliveryVersion:'0.3.9'"));
  assert.ok(!builder.includes("sessionExpired=false"));
  assert.ok(!builder.includes("disableWebSecurity"));
});

'use strict';

/**
 * Minimal main-process startup health for Windows v30.0.14.
 * Fixed schema only. No profile IDs, paths, network data, cookies, URLs,
 * exception messages/stacks or arbitrary IPC channels are persisted.
 * Never changes the app's exception handling or original IPC semantics.
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = 'dyclok-startup-health.json';
const ALLOWED_CODES = new Set(['MODULE_NOT_FOUND','ERR_MODULE_NOT_FOUND','ENOENT','EACCES','EPERM','ERR_REQUIRE_ESM','ERR_INVALID_ARG_TYPE']);
const ALLOWED_ERRORS = new Set([
  'Error','TypeError','ReferenceError','SyntaxError','RangeError',
  'AggregateError','TimeoutError','AbortError'
]);

function createStartupHealth(app, {fileSystem = fs, processObject = process} = {}) {
  const state = {
    schema:1,
    bootstrapLoaded:true,
    originalEntrypointLoaded:false,
    electronReady:false,
    mainWindowCreated:false,
    originalCacheHandlerRegistered:false,
    originalCacheHandlerRegistrations:0,
    originalCacheHandlerRemovals:0,
    mainEntrypointErrorClass:'none',
    uncaughtErrorClass:'none',
    uncaughtErrorCode:'none',
    uncaughtSource:'none',
    uncaughtSourceColumn:0
  };
  function safeErrorClass(error) {
    const name=error && typeof error.name==='string' ? error.name : '';
    return ALLOWED_ERRORS.has(name) ? name : 'Other';
  }
  function saveErrorOrigin(error) {
    const code=error && typeof error.code==='string' ? error.code : '';
    state.uncaughtErrorCode=ALLOWED_CODES.has(code)?code:'Other';
    // Only classify stack locations within the known, SHA-guarded runtime.
    // No path, message, arbitrary name or stack content is written.
    const stack=error && typeof error.stack==='string' ? error.stack : '';
    const native=stack.match(/main-CuCOh59n\.js:1:(\d{1,8})/);
    const base=stack.match(/(?:dist-electron[\\/]main\.js|main\.js):(\d{1,5}):(\d{1,8})/);
    if(native && Number(native[1])>0 && Number(native[1])<7000000){
      state.uncaughtSource='protected-bundle';
      state.uncaughtSourceColumn=Number(native[1]);
    } else if(base){
      state.uncaughtSource='electron-main';
      state.uncaughtSourceColumn=0;
    } else {state.uncaughtSource='other';state.uncaughtSourceColumn=0;}
  }
  function safeOriginalBundleColumn(error) {
    try {
      const stack = typeof error?.stack === 'string' ? error.stack : '';
      const match = /main-CuCOh59n\.js:1:(\d{1,8})(?:\D|$)/.exec(stack);
      if (!match) return 0;
      const column = Number(match[1]);
      return Number.isSafeInteger(column) && column > 0 && column <= 6000000 ? column : 0;
    } catch { return 0; }
  }
  function save() {
    try {
      const home = app?.getPath?.('userData');
      if(typeof home!=='string' || !home) return false;
      fileSystem.mkdirSync(home,{recursive:true});
      fileSystem.writeFileSync(path.join(home,FILE),JSON.stringify(state)+'\n',
        {encoding:'utf8',mode:0o600,flag:'w'});
      return true;
    } catch { return false; } // Metadata recording cannot block startup.
  }
  try {
    if(app?.isReady?.()) state.electronReady = true;
    if(typeof app?.on==='function') {
      app.on('ready',()=>{state.electronReady=true;save();});
      app.on('browser-window-created',()=>{state.mainWindowCreated=true;save();});
    }
    // Monitor-only: do not add an uncaughtException handler that would
    // swallow or change the native Electron crash behavior.
    if(typeof processObject?.on==='function') {
      processObject.on('uncaughtExceptionMonitor',error=>{
        state.uncaughtErrorClass=safeErrorClass(error);
        saveErrorOrigin(error);save();
      });
    }
  } catch { /* Instrumentation must be optional. */ }
  save();
  return {
    originalRegistered() {
      state.originalCacheHandlerRegistered=true;
      state.originalCacheHandlerRegistrations++;
      save();
    },
    originalRemoved() {
      state.originalCacheHandlerRegistered=false;
      state.originalCacheHandlerRemovals++;
      save();
    },
    originalEntrypointLoaded() {state.originalEntrypointLoaded=true;save();},
    originalEntrypointFailed(error) {
      state.mainEntrypointErrorClass=safeErrorClass(error);save();
    },
    status:()=>({...state})
  };
}

module.exports={FILE,createStartupHealth};

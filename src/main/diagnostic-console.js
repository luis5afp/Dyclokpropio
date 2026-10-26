'use strict';

// The diagnostic console is intentionally metadata-only. Never serialize
// arbitrary IPC payloads, HTTP URLs, headers, bodies or exception messages.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const CONTROL = 'dyclok-diag-control';
const EVENT = 'dyclok-diag-event';
const MAX_BYTES = 1536 * 1024;
const MAX_ROWS = 3000;
const MAX_TAIL = 90;
const KINDS = new Set(['stage','ipc','http','session']);
const PHASES = new Set(['start','success','fail','terminal','request','response','error','info']);
const METHODS = new Set(['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS']);
const SCOPES = new Set(['app','local','remote','unknown']);
const RESULTS = new Set(['none','undefined','null','boolean','string','number','object','array','other']);
const STEPS = new Set([
  'preDataInject','preCheck','cookieEncryptPlan','chooseKernel','preProxyCheck',
  'fetchEnvInfo','proxyCheck','proxyCheckResult','expandCheck','paramsMerge',
  'lockEnv','openEnv','catchError','timeout','polyfillRowData','rpaPreInject',
  'lockEnvRpa','mergeEnvParamsRpa'
]);
const CHANNELS = new Set([
  'download-chrome-unzip-extension','generate-sha256-hash-for-plugins',
  'check-expansion-sha256-hash','stop-env','open-env','lock-env',
  'get-local-server-status','get-app-title',
  'clear-dev-cache','electron-store-get','electron-store-set','read-json-file',
  'generate-sha256-hash','get-cache-info'
]);
const CHECKPOINTS = new Set(['begin','config-ready','geo-start','geo-ready','cache-start','cache-success','cache-fail','keys-start','keys-success']);
const CODES = new Set([
  'UNKNOWN_ERROR','UNCLASSIFIED','EXPAND_DOWNLOAD_FAIL','EXPAND_CHECK_FAIL',
  'EXPAND_SHA256_CHECK_FAIL','EXPAND_SHA256_HASH_FAIL','EXPAND_MISSING',
  'NETWORK_ERROR','TIMEOUT_ERROR','ABORT_ERROR','IPC_ERROR','HTTP_ERROR',
  'LOCK_ENV_FAIL','OPEN_ENV_FAIL','PROXY_CHECK_FAIL','REQUEST_FAILED',
  'IPC_NO_HANDLER','IPC_PERMISSION','IPC_NOT_FOUND','IPC_TIMEOUT',
  'IPC_INVALID_ARGUMENT','IPC_TYPE_ERROR'
]);

function sanitize(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (!KINDS.has(payload.kind) || !PHASES.has(payload.phase)) return null;
  const kind = payload.kind;
  let action = 'other';
  if (kind === 'stage' && STEPS.has(payload.action)) action = payload.action;
  if (kind === 'ipc' && CHANNELS.has(payload.action)) action = payload.action;
  if (kind === 'http' && METHODS.has(payload.action)) action = payload.action;
  if (kind === 'session') action = 'recording';
  const status = Number.isInteger(payload.status) && payload.status >= 0 && payload.status <= 599
    ? payload.status : null;
  const elapsedMs = Number.isFinite(payload.elapsedMs) && payload.elapsedMs >= 0
    ? Math.min(3600000, Math.floor(payload.elapsedMs)) : null;
  return {
    utc: new Date().toISOString(), kind, phase: payload.phase, action,
    scope: SCOPES.has(payload.scope) ? payload.scope : 'unknown',
    status, elapsedMs,
    result: RESULTS.has(payload.result) ? payload.result : 'none',
    code: CODES.has(payload.code) ? payload.code : 'UNCLASSIFIED',
    checkpoint: kind === 'stage' && payload.action === 'paramsMerge' && CHECKPOINTS.has(payload.checkpoint)
      ? payload.checkpoint : 'none'
  };
}

function isTrusted(event) {
  try {
    const raw = event && event.senderFrame && event.senderFrame.url;
    const page = new URL(raw);
    return page.protocol === 'file:' && page.pathname.toLowerCase().endsWith('/dist/index.html');
  } catch { return false; }
}

function createDiagnosticConsole(ipcMain, app, {fileSystem = fs} = {}) {
  if (!ipcMain || typeof ipcMain.handle !== 'function') throw new TypeError('ipcMain required');
  let active = false;
  let rows = [];
  let file = null;
  let bytes = 0;
  let count = 0;
  let session = 0;

  function record(payload) {
    if (!active || count >= MAX_ROWS) return false;
    const row = sanitize(payload);
    if (!row) return false;
    row.seq = ++count;
    const line = JSON.stringify(row) + '\n';
    bytes += Buffer.byteLength(line);
    if (bytes > MAX_BYTES) { active = false; return false; }
    rows.push(row);
    if (rows.length > MAX_TAIL) rows.shift();
    try {
      fileSystem.appendFileSync(file, line, {encoding:'utf8',flag:'a',mode:0o600});
    } catch { active = false; return false; }
    return true;
  }

  function status() {
    return {active, count, limit:MAX_ROWS, tail:rows.slice(), hasCapture:!!file};
  }

  function start() {
    if (active) return status();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = app.getPath('userData');
    if (!dir) return {error:'UNAVAILABLE'};
    try {
      fileSystem.mkdirSync(dir,{recursive:true});
      file = path.join(dir,'dyclok-diagnostic-'+stamp+'-'+process.pid+'.jsonl');
      fileSystem.writeFileSync(file,'',{encoding:'utf8',flag:'wx',mode:0o600});
    } catch { file = null; return {error:'WRITE_ERROR'}; }
    active = true;
    rows = []; bytes = 0; count = 0; session++;
    record({kind:'session',phase:'start'});
    return status();
  }

  function stop() {
    if (active) record({kind:'session',phase:'terminal'});
    active = false;
    return status();
  }

  function exportReport() {
    if (!file) return {error:'NO_CAPTURE'};
    try {
      const dir = app.getPath('downloads');
      const raw = fileSystem.readFileSync(file,'utf8');
      const events = raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
      const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\..*/,'').replace('T','-');
      const fileName = 'Dyclok-Diagnostico-Completo-'+stamp+'.txt';
      const report = [
        'DYCLOKPROPIO - DIAGNOSTICO ESTRUCTURADO',
        'Incluye solo eventos, etapas, tipos de resultados, estado HTTP y tiempo.',
        'No contiene URLs, cuerpos, cabeceras, IDs de perfiles, cookies, tokens o claves.',
        'Eventos: '+events.length,
        'Cobertura: renderer fetch/XHR; IPC cuando el puente lo permite; pasos internos de apertura.',
        'El trafico de procesos nativos y navegadores externos no se captura.',
        '', ...events.map(row => JSON.stringify(row)), ''
      ].join('\n');
      fileSystem.mkdirSync(dir,{recursive:true});
      fileSystem.writeFileSync(path.join(dir,fileName),report,{encoding:'utf8',flag:'wx',mode:0o600});
      return {fileName, count:events.length};
    } catch { return {error:'EXPORT_ERROR'}; }
  }

  ipcMain.handle(CONTROL, async(event, operation) => {
    if (!isTrusted(event)) return {error:'DENIED'};
    if (operation === 'start') return start();
    if (operation === 'stop') return stop();
    if (operation === 'status') return status();
    if (operation === 'export') return exportReport();
    return {error:'UNKNOWN_OPERATION'};
  });
  ipcMain.handle(EVENT, async(event, payload) => {
    if (!isTrusted(event)) return false;
    return record(payload);
  });
  return {
    onStage(entry) {
      return record({kind:'stage',phase:entry.phase,action:entry.step,code:entry.code});
    },
    status
  };
}
module.exports = {CONTROL,EVENT,sanitize,isTrusted,createDiagnosticConsole};

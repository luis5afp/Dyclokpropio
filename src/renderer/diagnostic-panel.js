(function () {
  'use strict';
  // A UI-only instrument: no request headers, URLs, cookies, IPC arguments,
  // response bodies or free-form error strings are ever transmitted or stored.
  if (location.hash.indexOf('#/synchronizer/help') === 0) return;
  const CONTROL = 'dyclok-diag-control';
  const EVENT = 'dyclok-diag-event';
  const ipc = window.ipcRenderer;
  const originalInvoke = ipc && typeof ipc.invoke === 'function' ? ipc.invoke.bind(ipc) : null;
  let capturing = false;
  let opened = false;
  let ipcHooked = false;
  let root, panel, statusText, lines, startButton, stopButton, exportButton, modeText;
  const pending = new WeakMap();

  function send(payload) {
    if (!capturing || !originalInvoke) return;
    try {
      const task = originalInvoke(EVENT, payload);
      if (task && typeof task.catch === 'function') task.catch(function () {});
    } catch (_) {}
  }
  function scopeFor(value) {
    try {
      const text = typeof value === 'string' ? value : value && value.url;
      if (!text || typeof text !== 'string') return 'unknown';
      const u = new URL(text, location.href);
      if (u.protocol === 'file:') return 'app';
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]') return 'local';
      return 'remote';
    } catch (_) { return 'unknown'; }
  }
  function methodFor(value) {
    const method = String(value || 'GET').toUpperCase();
    return ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(method) ? method : 'GET';
  }
  function resultType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (value === undefined) return 'undefined';
    const type = typeof value;
    return ['boolean','string','number','object'].includes(type) ? type : 'other';
  }
  function elapsed(start) { return Math.max(0, Math.round(performance.now() - start)); }
  function ipcErrorCode(error) {
    // Inspect only for fixed error families. Never export the raw message/code.
    try {
      const msg = String(error && error.message || '');
      if (msg.includes('CACHE_ORIGINAL_HANDLER_NOT_REGISTERED')) return 'IPC_ORIGINAL_MISSING';
      if (/No handler registered|No handler for/i.test(msg)) return 'IPC_NO_HANDLER';
      if (/\b(?:EACCES|EPERM)\b|access is denied|permission denied/i.test(msg)) return 'IPC_PERMISSION';
      if (/\bENOENT\b|not found|does not exist/i.test(msg)) return 'IPC_NOT_FOUND';
      if (/\bETIMEDOUT\b|timed?\s?out/i.test(msg)) return 'IPC_TIMEOUT';
      if (/invalid argument|ERR_INVALID_ARG_TYPE/i.test(msg)) return 'IPC_INVALID_ARGUMENT';
      if (error && error.name === 'TypeError') return 'IPC_TYPE_ERROR';
    } catch (_) {}
    return 'IPC_ERROR';
  }

  // Best effort: Electron contextBridge may expose a read-only invoke function.
  // In that case, stage logs and fetch/XHR metadata still work.
  if (originalInvoke) {
    try {
      const old = ipc.invoke;
      const traced = function (channel) {
        const args = Array.prototype.slice.call(arguments, 1);
        if (!capturing || (typeof channel === 'string' && channel.indexOf('dyclok-') === 0)) {
          return old.apply(this, arguments);
        }
        const begin = performance.now();
        send({kind:'ipc',phase:'request',action:channel});
        let task;
        try { task = old.apply(this, [channel].concat(args)); }
        catch (_) {
          send({kind:'ipc',phase:'error',action:channel,elapsedMs:elapsed(begin),code:ipcErrorCode(_)});
          throw _;
        }
        if (task && typeof task.then === 'function') {
          Promise.resolve(task).then(function (value) {
            send({kind:'ipc',phase:'response',action:channel,elapsedMs:elapsed(begin),result:resultType(value)});
          }, function (error) {
            send({kind:'ipc',phase:'error',action:channel,elapsedMs:elapsed(begin),code:ipcErrorCode(error)});
          }).catch(function () {});
        }
        return task;
      };
      ipc.invoke = traced;
      ipcHooked = ipc.invoke === traced;
    } catch (_) {}
  }

  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch;
    window.fetch = function () {
      const args = arguments;
      const begin = performance.now();
      const first = args[0];
      const action = methodFor((args[1] && args[1].method) || (first && first.method));
      const scope = scopeFor(first);
      send({kind:'http',phase:'request',action,scope});
      let task;
      try { task = originalFetch.apply(this,args); }
      catch (error) {
        send({kind:'http',phase:'error',action,scope,elapsedMs:elapsed(begin),code:'NETWORK_ERROR'});
        throw error;
      }
      if (task && typeof task.then === 'function') {
        Promise.resolve(task).then(function (response) {
          send({kind:'http',phase:'response',action,scope,status:response.status,elapsedMs:elapsed(begin)});
        }, function () {
          send({kind:'http',phase:'error',action,scope,elapsedMs:elapsed(begin),code:'NETWORK_ERROR'});
        }).catch(function () {});
      }
      return task;
    };
  }

  if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
    try {
      const proto = window.XMLHttpRequest.prototype;
      const open = proto.open, sendXhr = proto.send;
      proto.open = function (method, url) {
        pending.set(this, {action:methodFor(method),scope:scopeFor(url)});
        return open.apply(this, arguments);
      };
      proto.send = function () {
        const entry = pending.get(this) || {action:'GET',scope:'unknown'};
        const begin = performance.now();
        let failed = false;
        send({kind:'http',phase:'request',action:entry.action,scope:entry.scope});
        this.addEventListener('error', function () { failed = true; }, {once:true});
        this.addEventListener('timeout', function () { failed = true; }, {once:true});
        this.addEventListener('abort', function () { failed = true; }, {once:true});
        this.addEventListener('loadend', function () {
          send({kind:'http',phase:failed?'error':'response',action:entry.action,scope:entry.scope,
            status:Number(this.status) || 0,elapsedMs:elapsed(begin),code:failed?'NETWORK_ERROR':'UNCLASSIFIED'});
        }, {once:true});
        return sendXhr.apply(this,arguments);
      };
    } catch (_) {}
  }

  function el(tag, textValue, parent) {
    const item = document.createElement(tag);
    if (textValue !== undefined) item.textContent = textValue;
    if (parent) parent.appendChild(item);
    return item;
  }
  async function command(op) {
    if (!originalInvoke) return {error:'IPC_UNAVAILABLE'};
    try { return await originalInvoke(CONTROL,op); }
    catch (_) { return {error:'IPC_UNAVAILABLE'}; }
  }
  function render(state) {
    if (!state || state.error) {
      statusText.textContent = 'Sin acceso al diagnóstico: ' + (state && state.error || 'UNKNOWN');
      return;
    }
    capturing = !!state.active;
    statusText.textContent = (capturing ? 'Grabando' : 'Detenido') +
      ' · ' + state.count + ' eventos' + (state.count >= state.limit ? ' · límite alcanzado' : '');
    startButton.disabled = capturing;
    stopButton.disabled = !capturing;
    exportButton.disabled = !state.hasCapture;
    modeText.textContent = 'Etapas de apertura + HTTP de interfaz' +
      (ipcHooked ? ' + IPC' : ' · IPC no interceptable; etapas disponibles');
    lines.textContent = '';
    const tail = Array.isArray(state.tail) ? state.tail.slice(-24) : [];
    if (!tail.length) {
      el('div','Sin eventos. Pulsa Iniciar y abre el perfil que falla.',lines);
    }
    for (const row of tail) {
      const textValue = [row.utc?.slice(11,19),row.kind,row.action,row.phase,
        row.status === null ? '' : 'HTTP '+row.status,
        row.code === 'UNCLASSIFIED' ? '' : row.code,
        row.checkpoint && row.checkpoint !== 'none' ? row.checkpoint : '',
        row.elapsedMs === null ? '' : row.elapsedMs+'ms'].filter(Boolean).join(' · ');
      el('div',textValue,lines);
    }
  }
  async function refresh() { if (opened) render(await command('status')); }
  function build() {
    if (document.getElementById('dyclok-diagnostic-host')) return;
    root = el('div',undefined,document.body);
    root.id = 'dyclok-diagnostic-host';
    const shadow = root.attachShadow({mode:'open'});
    const css = el('style',undefined,shadow);
    css.textContent = [
      ':host{all:initial;font-family:Arial,sans-serif}',
      'button{font:600 13px Arial,sans-serif;padding:9px 12px;cursor:pointer;color:#fafafa;background:#263a56;border:1px solid #64748b;border-radius:7px}',
      'button:disabled{opacity:.4;cursor:not-allowed}',
      '#toggle{position:fixed;bottom:18px;right:20px;z-index:2147483646;background:#1153a7;color:white;box-shadow:0 2px 10px #0008}',
      '#panel{display:none;position:fixed;bottom:62px;right:20px;width:min(435px,calc(100vw - 36px));max-height:75vh;z-index:2147483647;background:#141e2e;color:#eee;padding:16px;border-radius:10px;border:1px solid #55677f;box-shadow:0 10px 30px #000a;box-sizing:border-box}',
      '#panel.open{display:block}',
      'h2{font:600 18px Arial;margin:0 0 10px}',
      'p{font:12px/1.5 Arial;margin:8px 0;color:#c7d3e2}',
      '.buttons{display:flex;flex-wrap:wrap;gap:8px;margin:11px 0}',
      '#events{max-height:30vh;overflow:auto;background:#0b1220;border:1px solid #39475b;padding:8px;font:11px/1.6 Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}'
    ].join('');
    const toggle = el('button','Diagnóstico',shadow);
    toggle.id = 'toggle';
    panel = el('section',undefined,shadow); panel.id = 'panel';
    el('h2','Diagnóstico de Dyclok',panel);
    statusText = el('p','Detenido',panel);
    modeText = el('p','Captura de metadatos sin datos privados.',panel);
    el('p','No se guardan URLs, cookies, cuerpos HTTP, contraseñas ni contenido de perfiles.',panel);
    const buttons = el('div',undefined,panel); buttons.className='buttons';
    startButton = el('button','Iniciar',buttons);
    stopButton = el('button','Detener',buttons);
    exportButton = el('button','Exportar TXT',buttons);
    lines = el('div',undefined,panel); lines.id='events';
    el('p','El informe se guarda en Descargas. No captura procesos Chromium externos.',panel);
    const notice = el('p','',panel);
    toggle.addEventListener('click',function () {
      opened = !opened;
      panel.classList.toggle('open',opened);
      if (opened) void refresh();
    });
    startButton.addEventListener('click',async function () {
      notice.textContent='';
      render(await command('start'));
    });
    stopButton.addEventListener('click',async function () {
      render(await command('stop'));
    });
    exportButton.addEventListener('click',async function () {
      const result=await command('export');
      notice.textContent = result && result.fileName
        ? 'Informe guardado en Descargas: ' + result.fileName
        : 'No se pudo exportar: ' + (result && result.error || 'UNKNOWN');
    });
    void command('status').then(render);
    setInterval(function () { if (opened) void refresh(); },2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',build,{once:true});
  else build();
})();

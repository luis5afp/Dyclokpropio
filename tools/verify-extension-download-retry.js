'use strict';
const assert = require('node:assert/strict');
const { TARGET, installExtensionDownloadRetry, hasRetryableRequest } =
  require('../src/main/bundled-extension-download-retry.js');

async function main() {
  function harness({ results = [], payload = { expanId: 'extension-A', url: 'https://example.invalid/x.zip' }, throwError } = {}) {
    const registry = new Map(), calls = [], warnings = [], delays = [];
    const ipc = { handle(channel, fn) { registry.set(channel, fn); } };
    const originalHandle = ipc.handle;
    const restore = installExtensionDownloadRetry(ipc, {
      sleep: async (ms) => { delays.push(ms); },
      warn: msg => warnings.push(msg),
    });
    ipc.handle('unrelated-channel', () => 'unrelated');
    ipc.handle(TARGET, async (event, input) => {
      calls.push({ event, input });
      if (throwError) throw throwError;
      return results.shift();
    });
    return { async invoke() { return registry.get(TARGET)({ sender: 1 }, payload); },
      calls, warnings, delays, passthrough: registry.get('unrelated-channel')(),
      restore, ipc, originalHandle };
  }

  assert.equal(hasRetryableRequest({ expanId: 'a', url: 'https://example.org/a.zip' }), true);
  assert.equal(hasRetryableRequest({ expanId: 'a', url: 'file:///C:/bad.zip' }), false);
  assert.equal(hasRetryableRequest({ expanId: '', url: 'https://example.org/a.zip' }), false);
  let h = harness({ results: [false, true] });
  assert.equal(await h.invoke(), true); assert.equal(h.calls.length, 2);
  assert.equal(h.warnings.length, 1); assert.equal(h.delays.length, 1);
  assert.equal(h.passthrough, 'unrelated');
  h.restore(); assert.equal(h.ipc.handle, h.originalHandle);
  h = harness({ results: [false, false] });
  assert.equal(await h.invoke(), false);
  assert.equal(h.calls.length, 2, 'Must not fake success nor loop endlessly');
  h = harness({ results: [true] });
  assert.equal(await h.invoke(), true); assert.equal(h.calls.length, 1);
  h = harness({ results: [false, true], payload: { expanId: 'a', url: '' } });
  assert.equal(await h.invoke(), false);
  assert.equal(h.calls.length, 1, 'Invalid URL must not retry');
  h = harness({ throwError: new Error('HTTP 403') });
  await assert.rejects(h.invoke(), /HTTP 403/);
  assert.equal(h.calls.length, 1, 'Do not retry authorization/security exceptions');
  console.log('PASS: bounded extension retry preserves original results and security errors.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });

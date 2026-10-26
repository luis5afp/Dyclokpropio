'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { TARGET, installExtensionDownloadRetry, hasRetryableRequest } =
  require('../src/main/bundled-extension-download-retry.js');
const { createExtensionDiagnosticWriter } =
  require('../src/main/extension-download-diagnostics.js');

async function main() {
  function harness({ results = [], payload = { expanId: 'extension-A', extensionName: 'Test extension', url: 'https://example.invalid/download.zip' }, throwError } = {}) {
    const registry = new Map(), calls = [], warnings = [], delays = [], records = [];
    const ipc = { handle(channel, fn) { registry.set(channel, fn); } };
    const originalHandle = ipc.handle;
    const restore = installExtensionDownloadRetry(ipc, {
      sleep: async ms => { delays.push(ms); },
      warn: msg => warnings.push(msg),
      record: entry => records.push(entry),
    });
    ipc.handle('unrelated-channel', () => 'unrelated');
    ipc.handle(TARGET, async (event, input) => {
      calls.push({ event, input });
      if (throwError) throw throwError;
      return results.shift();
    });
    return { invoke: async () => registry.get(TARGET)({ sender: 1 }, payload),
      calls, warnings, delays, records, unrelated: registry.get('unrelated-channel')(),
      restore, ipc, originalHandle };
  }

  const good = { expanId: 'abc-123', url: 'https://example.org/archive.zip' };
  assert.equal(hasRetryableRequest(good), true);
  for (const bad of [
    { expanId: 'a', url: 'file:///C:/bad.zip' },
    { expanId: 'a', url: 'http://example.org/archive.zip' },
    { expanId: '', url: 'https://example.org/x.zip' },
    { expanId: '../escape', url: 'https://example.org/x.zip' },
    { expanId: 'a', url: 'https://user:password@example.org/x.zip' },
    { expanId: 'a', url: '' },
  ]) assert.equal(hasRetryableRequest(bad), false);

  let h = harness({ results: [false, true] });
  assert.equal(await h.invoke(), true); assert.equal(h.calls.length, 2);
  assert.equal(h.records.length, 0, 'A successful retry is not a persistent failure');
  assert.equal(h.delays.length, 1);
  h.restore(); assert.equal(h.ipc.handle, h.originalHandle);

  // Original runtime returns NULL from the IPC handler on exceptions it catches.
  h = harness({ results: [null, true] });
  assert.equal(await h.invoke(), true, 'Null must trigger one validated retry');
  assert.equal(h.calls.length, 2);
  h = harness({ results: [null, null] });
  assert.equal(await h.invoke(), null, 'Persistent null cannot become success');
  assert.equal(h.calls.length, 2);
  assert.deepEqual(h.records.map(r => [r.extensionId, r.result, r.retried]),
    [['extension-A', 'null', true]]);

  h = harness({ results: [false, false] });
  assert.equal(await h.invoke(), false); assert.equal(h.calls.length, 2);
  assert.equal(h.records[0].result, 'false');

  h = harness({ results: [false, true], payload: { expanId: 'a', url: '' } });
  assert.equal(await h.invoke(), false); assert.equal(h.calls.length, 1);
  assert.equal(h.records[0].retried, false, 'Bad URLs are diagnosed but never fetched');

  h = harness({ throwError: Error('401 request with secret token') });
  await assert.rejects(h.invoke(), /401/);
  assert.equal(h.calls.length, 1, 'Never retry integrity/auth exceptions');
  assert.equal(h.records[0].result, 'exception');
  assert.ok(!JSON.stringify(h.records).includes('secret token'));
  assert.equal(h.unrelated, 'unrelated');

  // Test that diagnostic data is written ONLY to a private, dedicated log.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'dyclok-extension-diagnostics-'));
  try {
    const app = { isReady: () => true, getPath: key => {
      assert.equal(key, 'userData');
      return temp;
    } };
    const record = createExtensionDiagnosticWriter(app);
    record({ extensionId: 'extension-A', extensionName: 'Test', result: 'null',
      retried: true, url: 'https://secret@example.org', token: 'secret' });
    const text = fs.readFileSync(path.join(temp, 'dyclok-extension-errors.jsonl'), 'utf8');
    const saved = JSON.parse(text.trim());
    assert.equal(saved.extensionId, 'extension-A');
    assert.equal(saved.result, 'null');
    assert.equal(saved.retried, true);
    assert.ok(!text.includes('secret') && !text.includes('url'));
    assert.deepEqual(fs.readdirSync(temp), ['dyclok-extension-errors.jsonl']);
    const before = text;
    const notReady = createExtensionDiagnosticWriter({isReady:()=>false,getPath:()=>temp});
    notReady({extensionId:'x', result:'false'});
    assert.equal(fs.readFileSync(path.join(temp,'dyclok-extension-errors.jsonl'),'utf8'), before);
  } finally {
    fs.rmSync(temp,{recursive:true,force:true});
  }

  const bootstrap = fs.readFileSync(
    path.join(__dirname, '..', 'src/main/bundled-extension-bootstrap.js'), 'utf8'
  );
  assert.ok(bootstrap.includes('record: createExtensionDiagnosticWriter('));
  assert.ok(bootstrap.indexOf('installExtensionDownloadRetry(ipcMain') <
    bootstrap.indexOf("require('../../dist-electron/main.js')"));

  console.log('PASS: false/null downloads retried once using original security checks.');
  console.log('PASS: persistent failures stay failures, sensitive errors are not logged.');
  console.log('PASS: diagnostics do not alter profiles and bootstrap loads before runtime.');
}
main().catch(error=>{console.error(error);process.exitCode=1});

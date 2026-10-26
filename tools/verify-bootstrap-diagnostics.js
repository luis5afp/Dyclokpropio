'use strict';

/**
 * Execute the REAL Electron bootstrap in an isolated VM with mocked Electron,
 * filesystem manifest and original runtime, then trigger a failed extension
 * download. Merely checking imports as text would not catch the previous bug:
 * ReferenceError inside a try/catch silently disabled retry and diagnostics.
 *
 * This test never launches browsers, downloads extensions or reads user data.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { EXTENSION_PUBLIC_KEY } = require('../src/main/bundled-extension-pin.js');

const root = path.resolve(__dirname, '..');
const bootstrapPath = path.join(root, 'src/main/bundled-extension-bootstrap.js');
const source = fs.readFileSync(bootstrapPath, 'utf8');
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'dyclok-extension-diagnostic-'));
const resourcesPath = path.join(fixture, 'resources');
const manifestPath = path.join(resourcesPath, 'plugins/.cookies-pro-privada/manifest.json');
const diagnosticPath = path.join(fixture, 'dyclok-extension-errors.jsonl');

async function main() {
  try {
    const handlers = new Map();
    const warnings = [];
    const ipcMain = {
      handle(channel, handler) {
        if (handlers.has(channel)) throw new Error('IPC handler already registered: ' + channel);
        handlers.set(channel, handler);
      },
    };
    const app = {
      isReady: () => true,
      getPath: (name) => {
        assert.equal(name, 'userData');
        return fixture;
      },
    };
    const fakeManifest = {
      name: 'Cookies Pro Privada',
      version: '16.9.10',
      key: EXTENSION_PUBLIC_KEY,
      action: { default_icon: { '16': 'icons/icon16.png' } },
    };
    const fakeFs = {
      existsSync(p) {
        if (p === manifestPath) return true;
        return fs.existsSync(p);
      },
      readFileSync(p, encoding) {
        if (p === manifestPath) return JSON.stringify(fakeManifest);
        return fs.readFileSync(p, encoding);
      },
    };
    const fakeChildProcess = {
      spawn: () => {},
      execFile: () => {},
    };
    const originalMain = { loaded: true };
    let mainLoaded = false;
    let attempts = 0;
    const fakeRequire = (name) => {
      switch (name) {
        case 'node:fs': return fakeFs;
        case 'node:path': return path;
        case 'node:child_process': return fakeChildProcess;
        case 'electron': return { ipcMain, app };
        case './bundled-extension-download-retry.js':
          return require('../src/main/bundled-extension-download-retry.js');
        case './extension-download-diagnostics.js':
          return require('../src/main/extension-download-diagnostics.js');
        case './bundled-extension-launch.js':
          return require('../src/main/bundled-extension-launch.js');
        case './bundled-extension-pin.js':
          return require('../src/main/bundled-extension-pin.js');
        case '../../dist-electron/main.js':
          mainLoaded = true;
          ipcMain.handle('download-chrome-unzip-extension', async () => {
            attempts++;
            return null;
          });
          return originalMain;
        default:
          throw new Error('Unexpected require in Electron bootstrap: ' + name);
      }
    };

    const out = { exports: {} };
    vm.runInNewContext(source, {
      require: fakeRequire,
      process: { resourcesPath },
      module: out,
      console: { warn: (...args) => warnings.push(args.map(String).join(' ')) },
    }, { filename: bootstrapPath, timeout: 2000 });

    assert.equal(mainLoaded, true, 'Original Electron runtime was not loaded');
    assert.equal(out.exports, originalMain, 'Bootstrapped app changed unexpectedly');
    assert.equal(warnings.length, 0,
      'Bootstrap reported an initialization error; download instrumentation is probably disabled');

    const handler = handlers.get('download-chrome-unzip-extension');
    assert.equal(typeof handler, 'function', 'Downloader was not registered by the main runtime');
    const secret = 'do-not-log-this-query-secret';
    const payload = {
      expanId: 'test-extension-123',
      extensionName: 'Mock Extension',
      url: 'https://example.test/extension.zip?token=' + secret,
    };
    assert.equal(await handler({}, payload), null,
      'Never manufacture a successful download result');
    assert.equal(attempts, 2, 'Expected one bounded retry, not an unlimited loop');
    assert.equal(fs.existsSync(diagnosticPath), true,
      'NO diagnostic record: downloader wrapper did not activate (regression)');
    const raw = fs.readFileSync(diagnosticPath, 'utf8');
    const lines = raw.trim().split(/\r?\n/);
    assert.equal(lines.length, 1);
    const entry = JSON.parse(lines[0]);
    assert.equal(entry.extensionId, 'test-extension-123');
    assert.equal(entry.extensionName, 'Mock Extension');
    assert.equal(entry.result, 'null');
    assert.equal(entry.retried, true);
    assert.equal(raw.includes('example.test'), false, 'Diagnostic leaked remote URLs');
    assert.equal(raw.includes(secret), false, 'Diagnostic leaked URL query data');
    assert.equal(raw.includes('profile'), false, 'Diagnostic should not store browser profile info');

    console.log('PASS: Electron bootstrap installs working retry BEFORE original runtime.');
    console.log('PASS: failed download writes redacted diagnostic record into userData.');
    console.log('PASS: original download failure remains a failure; no profile data touched.');
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}
main().catch(e => { console.error(e); process.exitCode = 1; });

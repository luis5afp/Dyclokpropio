'use strict';

/**
 * DICloak Nativo 0.3.0 experimental integration.
 *
 * A button in the original Profiles table triggers a SELF-CONTAINED local
 * fixture request on 127.0.0.1, archives synthetic Set-Cookie/credential/
 * proxy data under the selected profile's internal row.id, and opens the
 * folder. This module DOES NOT intercept or capture actual web browsing,
 * cookie jars or production proxies.
 *
 * It never accesses DICloak's identity/authentication/session databases.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const net = require('node:net');
const os = require('node:os');
const { createAlmacenLabBridge } = require('./almacen-lab-bridge.js');
const { validateProfileId } = require('./almacen-perfil-readonly.js');
const { makeServerFixtures } = require('./almacen-fixtures-valid.js');

const HANDLER = 'almacen-lab:open';
const bridges = new Map();
const running = new Map();

function serveFixture(headers, body) {
  return new Promise((resolve, reject) => {
    const server = net.createServer(socket => {
      socket.once('data', () => socket.end(Buffer.concat([headers, body])));
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}
function downloadFixture(port, requestPath) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    const chunks = [];
    socket.once('connect', () => socket.write('GET ' + requestPath + ' HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n'));
    socket.on('data', part => chunks.push(part));
    socket.once('error', reject);
    socket.once('end', () => {
      const response = Buffer.concat(chunks);
      const index = response.indexOf(Buffer.from('\r\n\r\n'));
      if (index < 0) return reject(new Error('Incomplete local fixture HTTP response'));
      resolve({
        rawHeaderBytes: response.subarray(0, index + 4),
        bodyBytes: response.subarray(index + 4)
      });
    });
  });
}
async function addFixture(profileId, bridge, sessionHandle) {
  // A real localhost TCP exchange for each *complete* fixture. The file is
  // archived from the raw bytes received, never from a fabricated extension.
  for (const item of makeServerFixtures(profileId)) {
    const headers = Buffer.from([
      'HTTP/1.1 200 OK',
      'Content-Type: ' + item.contentType,
      ...item.extraHeaders,
      'Content-Length: ' + item.bodyBytes.length,
      'Connection: close',
      '', ''
    ].join('\r\n'), 'utf8');
    const { server, port } = await serveFixture(headers, item.bodyBytes);
    try {
      const response = await downloadFixture(port, item.path);
      if (!response.rawHeaderBytes.equals(headers) ||
          !response.bodyBytes.equals(item.bodyBytes)) {
        throw new Error('Incomplete or modified mock response; not archiving');
      }
      await bridge.recordResponse({
        sessionHandle,
        responseUrl: 'http://127.0.0.1:' + port + item.path,
        ...response
      });
      await bridge.recordDownloadedFile({
        sessionHandle, originalName: item.originalName,
        payload: response.bodyBytes // exact bytes sent by local fixture server
      });
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  }
}
async function labOpen({ profileId, rootFolder, shellApi }) {
  validateProfileId(profileId);
  let state = bridges.get(profileId);
  if (!state) {
    const handle = Object.freeze({ profileId });
    const bridge = createAlmacenLabBridge({
      rootFolder, allowedProfiles: [profileId], shellApi
    });
    bridge.registerSession(handle, profileId);
    state = { handle, bridge, initialized: false };
    bridges.set(profileId, state);
  }
  if (!state.initialized) {
    const pending = running.get(profileId) || (async () => {
      await fs.mkdir(rootFolder, { recursive: true, mode: 0o700 });
      const stat = await fs.lstat(rootFolder);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Untrusted Almacén root');
      await addFixture(profileId, state.bridge, state.handle);
      state.initialized = true;
    })();
    running.set(profileId, pending);
    try { await pending; } finally { running.delete(profileId); }
  }
  const result = await state.bridge.openFolder(state.handle);
  return { ...result, laboratoryOnly: true, source: 'localhost mock fixture' };
}
function senderIsNativeApp(event, BrowserWindow) {
  if (!event?.sender || !event.senderFrame ||
      event.senderFrame !== event.sender.mainFrame) return false;
  if (!BrowserWindow.getAllWindows().some(w => w.webContents === event.sender)) return false;
  const current = event.sender.getURL?.() || '';
  try {
    const url = new URL(current);
    return url.protocol === 'file:' ||
      ((url.protocol === 'http:' || url.protocol === 'https:') &&
       ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname));
  } catch (_) { return false; }
}
function install() {
  const { app, ipcMain, BrowserWindow, shell } = require('electron');
  if (!app.isPackaged || ipcMain.listenerCount(HANDLER) > 0) return;
  const rootFolder = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
    'DICloak-Nativo-Almacen-Lab-033');
  ipcMain.handle(HANDLER, async (event, profileId) => {
    if (!senderIsNativeApp(event, BrowserWindow)) {
      return { ok: false, reason: 'UNTRUSTED_RENDERER' };
    }
    try {
      return await labOpen({ profileId, rootFolder, shellApi: shell });
    } catch (error) {
      console.warn('[Almacén laboratorio] No se pudo abrir:', error.message);
      return { ok: false, reason: 'LAB_STORAGE_UNAVAILABLE' };
    }
  });
  console.log('[Almacén laboratorio] Habilitado solo para pruebas locales');
}
module.exports = { install, labOpen, senderIsNativeApp, HANDLER };

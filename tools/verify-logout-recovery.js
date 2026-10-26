'use strict';

/**
 * Tests the NEW recovery module as well as the actual Vite chunk wiring.
 * Never touches profiles, cookies, credentials or external services.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'dist/assets/index-D2T4aaQJ.js'), 'utf8');
assert.ok(ui.startsWith('import{makeLogoutController as dyMakeLogoutController}from"./dyclok-logout-recovery.mjs";'));
assert.ok(ui.includes('ne=dyMakeLogoutController({'));
assert.ok(ui.includes('standardLogout:()=>_e(!0)'), 'Must invoke recovered original logout function');
assert.ok(ui.includes('openProfiles:()=>he.getters.ownOpenId'), 'Must check actual open profile state');
assert.ok(ui.includes('stopProfiles:()=>X.send(be,{callbackName:me.LOGOUT_STOP_ENV_SUCCESS})'),
  'Must keep original native STOP_ENV for active browsers');
assert.ok(ui.includes('localOnlyLogout:async()=>{S.clearState()'), 'Must use original auth state reset');
assert.ok(ui.includes('window.localStorage.removeItem("basic:state")'));
assert.ok(ui.includes('window.localStorage.removeItem("token:state")'));
assert.ok(ui.includes('he.getters.ownOpenId.length&&!t'), 'Team switch safety guard must remain unchanged');
assert.ok(!ui.includes('he.getters.ownOpenId.length&&X.isClient?ye(E("header.promptError"))'),
  'Permanent logout block was reintroduced');
assert.ok(ui.includes('/v1/app/notice'), 'Existing update code changed unexpectedly');

async function main() {
  const { makeLogoutController } = await import('../dist/assets/dyclok-logout-recovery.mjs');

  function harness({ client = true, open = [], standardError = false, pending = false } = {}) {
    const calls = { ipc: 0, standard: 0, local: 0, dialogs: [], log: [], timers: [], signedIn: true };
    const timers = [];
    const makeTimer = (cb, ms) => {
      const token = { cb, ms, cancelled: false };
      timers.push(token);
      return token;
    };
    const clearTimer = (token) => { token.cancelled = true; };
    let resolvePending;
    const logout = makeLogoutController({
      isClient: () => client,
      openProfiles: () => open,
      stopProfiles: () => { calls.ipc++; },
      standardLogout: () => {
        calls.standard++;
        if (standardError) return Promise.reject(new Error('Network unreachable'));
        if (pending) return new Promise(resolve => { resolvePending = resolve; });
        calls.signedIn = false;
        return Promise.resolve();
      },
      stillSignedIn: () => calls.signedIn,
      confirm: (opts) => { calls.dialogs.push(opts); },
      translate: (key) => key,
      localOnlyLogout: () => { calls.local++; calls.signedIn = false; },
      logError: (...args) => { calls.log.push(args); },
      schedule: makeTimer,
      clearSchedule: clearTimer,
      rescueDelayMs: 15000,
    });
    const tick = () => timers.filter(t => !t.cancelled).forEach(t => { t.cancelled = true; t.cb(); });
    return { logout, calls, tick, resolvePending: () => resolvePending?.() };
  }

  // The screenshot has the regular confirmation, hence ownOpenId was empty.
  // No IPC event is expected in that case. This is the principal regression.
  let h = harness();
  h.logout();
  assert.equal(h.calls.standard, 0, 'No action before confirmation');
  assert.equal(h.calls.dialogs.length, 1);
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.standard, 1, 'Must call direct logout when no browsers tracked');
  assert.equal(h.calls.ipc, 0, 'Do not wait for native callback with zero profiles');
  h.tick();
  assert.equal(h.calls.dialogs.length, 1, 'No fallback if login already cleared');

  // Programmatic pre-confirmed logout is unchanged with zero open browsers.
  h = harness();
  await h.logout(true);
  assert.equal(h.calls.standard, 1);
  assert.equal(h.calls.dialogs.length, 0);
  assert.equal(h.calls.ipc, 0);

  // With open profiles, require explicit confirmation and keep the native path.
  h = harness({ open: ['browser-244'] });
  h.logout(true);
  assert.equal(h.calls.dialogs.length, 1, 'Cannot silently bypass real open browsers');
  assert.equal(h.calls.ipc, 0);
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.ipc, 1);
  assert.equal(h.calls.standard, 0);
  assert.equal(h.calls.local, 0);
  h.tick();
  assert.equal(h.calls.dialogs.length, 2, 'Stalled IPC must present a second recovery confirmation');
  assert.equal(h.calls.local, 0, 'Never perform local-only signout automatically');
  assert.match(h.calls.dialogs[1].message, /sesión del servidor podría continuar activa/);
  await h.calls.dialogs[1].confirmCb();
  assert.equal(h.calls.local, 1);

  // A reporting/network promise that never settles cannot trap the user.
  h = harness({ pending: true });
  h.logout();
  const promise = h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.standard, 1);
  h.tick();
  assert.equal(h.calls.dialogs.length, 2, 'Hung logout should offer manual local fallback');
  assert.equal(h.calls.local, 0);
  await h.calls.dialogs[1].confirmCb();
  assert.equal(h.calls.local, 1);
  h.resolvePending();
  await promise;

  // An unexpected failure must not silently clear credentials.
  h = harness({ standardError: true });
  h.logout();
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.dialogs.length, 2, 'Failed logout should show recovery');
  assert.equal(h.calls.local, 0);
  assert.equal(h.calls.log.length, 1);

  // Web variant uses direct logout, not native Electron IPC.
  h = harness({ client: false, open: ['browser-244'] });
  h.logout();
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.standard, 1);
  assert.equal(h.calls.ipc, 0);

  console.log('PASS: no open profiles => direct logout, not native IPC');
  console.log('PASS: open profiles => confirmed native stop + optional local recovery');
  console.log('PASS: stalled/offline logout => second confirmation; no automatic data deletion');
  console.log('PASS: original profile isolation and team-switch checks retained');
}
main().catch(e => { console.error(e); process.exitCode = 1; });

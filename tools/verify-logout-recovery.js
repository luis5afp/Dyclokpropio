'use strict';
// Contract tests for the recovered Vue logout menu. Execute the actual
// compact handler with fake IPC/UI state; no login tokens or browser data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'dist', 'assets', 'index-D2T4aaQJ.js'),
  'utf8'
);
const begin = 'ne=e=>{const t=async()=>{X.isClient?';
const end = ',oe=b(null)';
const first = source.indexOf(begin);
assert.ok(first >= 0, 'Logout handler missing');
assert.equal(source.indexOf(begin, first + 1), -1, 'Ambiguous logout handler');
const last = source.indexOf(end, first);
assert.ok(last > first, 'Could not delimit logout handler');
const expression = source.slice(first + 'ne='.length, last);
assert.ok(expression.endsWith('}'), 'Logout handler incomplete');

// Team switching must still refuse to proceed while profiles are open.
assert.ok(
  source.includes('he.getters.ownOpenId.length&&!t'),
  'Team switching safety guard must remain unchanged'
);
// Both regular and stale-record logout paths use the original STOP_ENV IPC.
assert.ok(
  expression.includes('LOGOUT_STOP_ENV_SUCCESS'),
  'Native safe logout callback missing'
);
assert.ok(
  expression.includes('No se eliminarán los perfiles'),
  'Explicit non-destructive confirmation missing'
);

function makeHarness({ openProfiles = [], isClient = true } = {}) {
  const calls = { send: [], errors: [], dialogs: [], browserLogout: 0 };
  const context = {
    X: {
      isClient,
      send: (...args) => { calls.send.push(args); },
    },
    be: 'stop-all-environments',
    me: { LOGOUT_STOP_ENV_SUCCESS: 'logout-stopped' },
    he: { getters: { ownOpenId: openProfiles } },
    ye: (message) => { calls.errors.push(message); },
    E: (key) => key,
    ke: (options) => { calls.dialogs.push(options); },
    _e: async () => { calls.browserLogout += 1; },
  };
  return {
    calls,
    logout: vm.runInNewContext('(' + expression + ')', context),
  };
}

(async () => {
  let h = makeHarness({ openProfiles: ['orphan-profile-old-build'] });
  h.logout();
  assert.equal(h.calls.send.length, 0, 'Should not logout before user confirmation');
  assert.equal(h.calls.dialogs.length, 1, 'Stale-profile user must get a confirmation');
  assert.ok(h.calls.dialogs[0].message.includes('Si ya cerraste los navegadores'));
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.send.length, 1, 'User-confirmed safe STOP_ENV was not requested');
  assert.equal(h.calls.send[0][1].callbackName, 'logout-stopped');
  assert.equal(h.calls.errors.length, 0, 'Should not hard-block stale profile state');

  h = makeHarness({ openProfiles: [] });
  h.logout();
  assert.equal(h.calls.dialogs.length, 1, 'Normal logout confirmation missing');
  assert.equal(h.calls.send.length, 0);
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.send.length, 1);

  h = makeHarness({ openProfiles: [] });
  h.logout(true);
  assert.equal(h.calls.dialogs.length, 0, 'Already-confirmed logout should not prompt again');
  assert.equal(h.calls.send.length, 1);

  h = makeHarness({ openProfiles: ['profile-still-open'] });
  h.logout(true);
  assert.equal(h.calls.send.length, 0, 'Even auto logout must not bypass open-profile confirmation');
  assert.equal(h.calls.dialogs.length, 1);

  h = makeHarness({ openProfiles: ['profile-still-open'], isClient: false });
  h.logout();
  assert.equal(h.calls.dialogs.length, 1);
  await h.calls.dialogs[0].confirmCb();
  assert.equal(h.calls.browserLogout, 1, 'Browser logout regression');

  console.log('PASS: stale profile logout can be confirmed without deleting profiles.');
  console.log('PASS: no automatic bypass; original stop-environment IPC and team guard remain.');
})().catch((error) => { console.error(error); process.exitCode = 1; });

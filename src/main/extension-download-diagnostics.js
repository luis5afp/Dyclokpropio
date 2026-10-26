'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Record only the identity and result of failed extension download attempts.
 * No URLs, tokens, profile IDs, cookies, remote response bodies or stack traces.
 * Files live in Electron's existing userData folder, not in browser profiles.
 */
function createExtensionDiagnosticWriter(app, { fileSystem = fs } = {}) {
  return (entry) => {
    if (!app || !app.isReady || !app.isReady()) return;
    let base;
    try { base = app.getPath('userData'); } catch { return; }
    if (!base) return;
    const target = path.join(base, 'dyclok-extension-errors.jsonl');
    try {
      if (fileSystem.existsSync(target) && fileSystem.statSync(target).size > 262144) {
        // Rotate ONLY the diagnostic log. Never touch cache or browser data.
        const backup = target + '.old';
        if (fileSystem.existsSync(backup)) fileSystem.unlinkSync(backup);
        fileSystem.renameSync(target, backup);
      }
      const data = {
        utc: new Date().toISOString(),
        extensionId: entry.extensionId,
        extensionName: entry.extensionName,
        result: entry.result,
        retried: Boolean(entry.retried),
      };
      fileSystem.appendFileSync(target, JSON.stringify(data) + '\n', {
        flag: 'a', encoding: 'utf8', mode: 0o600,
      });
    } catch {
      // Logging must not prevent launching or interfere with extension checks.
    }
  };
}

module.exports = { createExtensionDiagnosticWriter };

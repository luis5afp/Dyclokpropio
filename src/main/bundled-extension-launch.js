'use strict';

const path = require('node:path');

/**
 * Add an application-bundled extension to Chromium processes launched by
 * Node's child_process. Does not change profile directories or other flags.
 * Official Google Chrome >=137 ignores --load-extension; Chromium forks
 * generally continue to support it. This module cannot intercept a browser
 * launched by an external native service; that requires integration in the
 * browser launcher itself.
 */
const CHROMIUM_EXE = /^(?:chrome|chromium|chrome-for-testing|dicloak-browser|dicloakbrowser|browser)(?:[._-].*)?(?:\.exe)?$/i;

function isChromiumBinary(exe) {
  if (typeof exe !== 'string') return false;
  const normalized = exe.replaceAll('\\', '/');
  return CHROMIUM_EXE.test(path.posix.basename(normalized).replace(/^['"]|['"]$/g, ''));
}

function injectFlag(args, extensionPath) {
  if (!Array.isArray(args)) return args;
  if (args.some((arg) => arg === '--disable-extensions')) {
    // Respect explicit security settings; don't covertly override them.
    return args;
  }
  const existing = args.findIndex((arg) => typeof arg === 'string' && arg.startsWith('--load-extension='));
  const flag = '--load-extension=' + extensionPath;
  if (existing === -1) return [...args, flag];
  const current = args[existing].slice('--load-extension='.length).split(',').filter(Boolean);
  if (!current.includes(extensionPath)) current.push(extensionPath);
  const result = [...args];
  result[existing] = '--load-extension=' + current.join(',');
  return result;
}

function makeLaunchHooks(cp, extensionPath, warn = console.warn, beforeBrowserLaunch = null) {
  const originalSpawn = cp.spawn;
  const originalExecFile = cp.execFile;
  if (typeof originalSpawn !== 'function' || typeof originalExecFile !== 'function') {
    throw new TypeError('child_process spawn and execFile must exist');
  }
  cp.spawn = function patchedSpawn(file, args, options) {
    if (isChromiumBinary(file)) {
      if (!Array.isArray(args)) {
        warn('Chrome lanzado sin lista de argumentos: no se pudo insertar la extension');
      } else {
        args = injectFlag(args, extensionPath);
        if (beforeBrowserLaunch && !args.includes('--disable-extensions')) beforeBrowserLaunch(args);
      }
    }
    return originalSpawn.call(this, file, args, options);
  };
  cp.execFile = function patchedExecFile(file, args, options, callback) {
    if (isChromiumBinary(file)) {
      if (!Array.isArray(args)) {
        warn('Chrome lanzado con execFile sin lista de argumentos: extension omitida');
      } else {
        args = injectFlag(args, extensionPath);
        if (beforeBrowserLaunch && !args.includes('--disable-extensions')) beforeBrowserLaunch(args);
      }
    }
    return originalExecFile.call(this, file, args, options, callback);
  };
  return () => {
    cp.spawn = originalSpawn;
    cp.execFile = originalExecFile;
  };
}

module.exports = { isChromiumBinary, injectFlag, makeLaunchHooks };

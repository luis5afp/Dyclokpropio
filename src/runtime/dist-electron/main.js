"use strict";

/**
 * Reconstructed readable equivalent of dist-electron/main.js.
 *
 * The original file is intentionally preserved as main.js.
 * This file was derived by evaluating the wrapper with mocked dependencies;
 * it does NOT execute the application bundle during reconstruction.
 */

const { BrowserWindow } = require("electron");

// These dependencies are loaded by the original wrapper for side effects or
// because the bundled Electron main process expects them to be available.
require("path");
require("child_process");
require("fs");
require("crypto");
require("ts-md5");
require("get-port-please");
require("lodash");

const mainBundle = require("./main-CuCOh59n.js");

Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
Object.defineProperty(exports, "BrowserWindow", {
  enumerable: true,
  get: () => BrowserWindow,
});

exports.envIdStopEnv = mainBundle.envIdStopEnv;
exports.fetchIpCheckKeyFromServer = mainBundle.fetchIpCheckKeyFromServer;
exports.getCurrentAppLogPath = mainBundle.getCurrentAppLogPath;
exports.getRpaTaskIdByPids = mainBundle.getRpaTaskIdByPids;
exports.log = mainBundle.log;
Object.defineProperty(exports, "logPath", {
  enumerable: true,
  get: () => mainBundle.logPath,
});
exports.rpaLog = mainBundle.rpaLog;

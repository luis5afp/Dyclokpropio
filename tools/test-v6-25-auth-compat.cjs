#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const pre=fs.readFileSync(path.join(__dirname,"../release-build/v6.25/compat-prelude.js"),"utf8");
const diagnostic=fs.readFileSync(path.join(__dirname,"../release-build/v6.25/live-diagnostics.js"),"utf8");
const calls=[];
vm.runInNewContext(pre,{require(x){calls.push(x);throw Error("Compatibility prelude must not import Electron")}}, {filename:"compat-prelude.js"});
assert.equal(calls.length,0);
assert(!/ipcMain\.(?:handle|on)\s*=|app\.setVersion|clearStorageData|\.cookies\./.test(pre));
assert(!/XMLHttpRequest\.prototype|window\.fetch\s*=|fetch\.prototype/.test(diagnostic),
  "Diagnostics must not alter the original request implementations");
assert(!/setImmediate\(createPanel\)/.test(diagnostic),"Panel cannot open automatically");
assert(diagnostic.includes("dyclokpro-side-diagnostics-toggle"));
assert(diagnostic.includes("smokeReady")&&diagnostic.includes("closedBySideButton"));
assert(diagnostic.includes("PROMISE_ERROR")&&diagnostic.includes("apiCode"));
console.log("NATIVE_V616_AUTH_AND_UPDATER_HOOKS_UNCHANGED=PASS");
console.log("V616_NATIVE_FETCH_AND_XMLHTTPREQUEST_UNTOUCHED=PASS");
console.log("SIDE_DIAGNOSTICS_BUTTON_STARTS_CLOSED=PASS");

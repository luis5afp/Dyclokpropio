#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const src=fs.readFileSync(path.join(__dirname,"release-v6-26-restore-runtime.py"),"utf8");
for(const wanted of [
 "03621252bb532766d984838213e25411b69220ff491ea86d0f81a928c104ff81",
 "0b2d43aa827f36c704f663253a859d3398125cdd184baaed2e0c648abfaf8a41",
 "734000957d8abc026e11b1a586cbad8aaf68dcdc998bc959ce67103b0269725d",
 'json.loads(raw).get("version")!="2.8.17"',
 "validate_native(rootdir)",
 "REMOTE_AUTHENTICATED_PROFILE_LIST=NOT_TESTED"
]) assert(src.includes(wanted),"Missing version/integrity preservation guard: "+wanted);
assert(!src.includes('pkg["version"]='),"Must not rewrite the native version");
assert(!src.includes("new_main=pre"),"Must not prepend authentication/diagnostic hooks");
const pack=JSON.parse(fs.readFileSync(path.join(__dirname,"../release-build/v6.26/package.json"),"utf8"));
const builder=JSON.parse(fs.readFileSync(path.join(__dirname,"../release-build/v6.26/electron-builder.json"),"utf8"));
assert.equal(pack.version,"6.26.0");
assert.equal(builder.artifactName,"DyclokPRO_6.26_win_x64.exe");
assert.equal(builder.nsis.deleteAppDataOnUninstall,false);
console.log("V626_V616_NATIVE_RUNTIME_PRESERVATION=PASS");
console.log("V626_MARKETING_VERSION_DISTINCT=PASS");
console.log("V626_ACCOUNT_DATA_SAFE_UNINSTALL_CONFIG=PASS");

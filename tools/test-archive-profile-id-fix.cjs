#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.join(__dirname,"..");
const original=fs.readFileSync(path.join(root,"release-build/v6.16/archive-ui.js"),"utf8");
const fixed=fs.readFileSync(path.join(root,"release-build/archive-profile-correction/archive-ui.js"),"utf8");
const start="function profileFrom(url,obj){",end="\nfunction classify(obj,route){";
function withoutProfileFrom(src) {
 const a=src.indexOf(start),b=src.indexOf(end,a);
 assert(a>=0&&b>a);
 return src.slice(0,a)+"PROFILE_ATTRIBUTION_ONLY"+src.slice(b);
}
assert.equal(withoutProfileFrom(fixed),withoutProfileFrom(original),
 "Only the profile association function may change, never fetch/XHR/auth or archiving");
const a=fixed.indexOf(start),b=fixed.indexOf(end,a);
const resolve=vm.runInNewContext("("+fixed.slice(a,b)+")",{
 URL, location:{href:"file:///C:/DyclokPRO/resources/app.asar.unpacked/dist/index.html"}
});
const server="https://gin-server.example.invalid/gin";
for(const p of [
 "/v1/env/open_detail","/v1/env/get_browser_data","/v1/env/proxy_use_ip",
 "/v1/env/summary","/v1/env/group","/v1/env/list"
]) {
 assert.equal(resolve(server+p,{}),"","False profile folder from endpoint "+p);
}
assert.equal(resolve(server+"/v1/env/open_detail",{data:{envId:"2097722254089396228"}}),
 "2097722254089396228");
assert.equal(resolve(server+"/v1/env/open_detail?profileId=240",{}),"240");
assert.equal(resolve(server+"/v1/env/2097722254089396228",{}),"2097722254089396228");
assert.equal(resolve(server+"/v1/profile/a24b46de6bef426cb34839b63c63ff11",{}),
 "a24b46de6bef426cb34839b63c63ff11");
assert.equal(resolve(server+"/v1/env/summary",{data:[]}),"");
assert.equal(resolve(server+"/v1/env/open_detail",{data:{token:"not-an-id"}}),"");
console.log("NO_BOGUS_API_OPERATION_PROFILE_FOLDERS=PASS");
console.log("EXPLICIT_REAL_PROFILE_IDS_PRESERVED=PASS");
console.log("ORIGINAL_AUTH_HTTP_COOKIE_CAPTURE_LOGIC_UNCHANGED=PASS");

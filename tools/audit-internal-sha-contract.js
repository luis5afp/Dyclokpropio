'use strict';
// Static inspection of the public, recovered renderer. Never invokes an API.
const fs=require('node:fs');
const r=fs.readFileSync('dist/assets/index-BUIbb6Pa.js','utf8');
const start=r.indexOf('She={name:"扩展检测",stepType:zde.EXPAND_CHECK,async handler(e){');
const end=r.indexOf('}},Rhe={name:',start);
if(start<0||end<=start||end-start>8000)throw Error('Unexpected recovered handler');
const body=r.slice(start,end);
console.log('EXPAND_HANDLER_START='+start+' LEN='+body.length);
console.log('EXPAND_HANDLER_PUBLIC_CODE_BEGIN');
console.log(body);
console.log('EXPAND_HANDLER_PUBLIC_CODE_END');
for(const needle of ['checkExpansionSha256Hash(', 'generate-sha256-hash-for-plugins','sha256Hash','sha256Key']){
const pos=body.indexOf(needle);console.log('MARKER_'+needle+'='+pos);}

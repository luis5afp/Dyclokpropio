'use strict';
/* Read-only vendor 3.0.7 module inspection; no profile or user data. */
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const asar=createRequire(path.join(__dirname,'../release-build/native-0.2.0/package.json'))('@electron/asar');
const archive=process.argv[2];
if(!archive)throw Error('missing original ASAR');
const raw=asar.getRawHeader(archive),header=typeof raw.header==='string'?JSON.parse(raw.header):raw.header;
const start=8+(raw.headerSize??raw.size);
function get(name){
 const segments=name.split('/');
 let n=header;for(const part of segments)n=n.files?.[part];
 if(!n||n.link||n.unpacked||!Number.isInteger(n.size))throw Error('missing module '+name);
 const buf=Buffer.alloc(n.size),fd=fs.openSync(archive,'r');
 try{if(fs.readSync(fd,buf,0,n.size,start+Number(n.offset))!==n.size)throw Error('short ASAR read')}
 finally{fs.closeSync(fd)}
 return buf.toString('utf8');
}
const pkg=JSON.parse(get('package.json'));
const mainFile=pkg.main?.replace(/^\.\//,'');
console.log('ALMACEN_NATIVE_MAIN='+JSON.stringify({main:mainFile,type:pkg.type,keys:Object.keys(pkg).slice(0,22)}));
if(mainFile && mainFile.endsWith('.js')){
 const content=get(mainFile);
 console.log('ALMACEN_NATIVE_MAIN_CODE='+JSON.stringify({length:content.length,start:content.slice(0,1400),end:content.slice(-1700),hasCommonJS:content.includes('require('),hasElectron:content.includes('electron')}));
}
const env=get('dist/assets/envList-CYDbiryu.js');
for (const needle of ['prop:"operation"', 'rowKey:"id"', 'label:oa("env.env.environmentStatus"', 'const ts=', 'ts=b(']) {
 const idx=env.indexOf(needle);
 console.log('ALMACEN_RENDER_ANCHOR='+JSON.stringify({needle,index:idx,context:idx<0?'':env.slice(Math.max(0,idx-320),idx+950)}));
}

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
const unpacked=[];
function visit(node,name){
  if(node.files){for(const [k,n] of Object.entries(node.files))visit(n,name?name+'/'+k:k);}
  else if(node.unpacked)unpacked.push(name);
}
visit(header,'');
console.log('ALMACEN_NATIVE_UNPACKED='+JSON.stringify({
  count:unpacked.length,files:unpacked.slice(0,120)
}));
const pkg=JSON.parse(get('package.json'));
const mainFile=pkg.main?.replace(/^\.\//,'');
console.log('ALMACEN_NATIVE_MAIN='+JSON.stringify({main:mainFile,type:pkg.type,keys:Object.keys(pkg).slice(0,22)}));
if(mainFile && mainFile.endsWith('.js')){
 const content=get(mainFile);
 console.log('ALMACEN_NATIVE_MAIN_CODE='+JSON.stringify({length:content.length,start:content.slice(0,1400),end:content.slice(-1700),hasCommonJS:content.includes('require('),hasElectron:content.includes('electron')}));
}

const field=get('dist/assets/TableFieldDialog-V53UVTu7.js');
const table=get('dist/assets/index-DYRLQ_ke.js');
const preload=get('dist-electron/preload/index.js');
console.log('ALMACEN_FIELD_DIALOG='+JSON.stringify({length:field.length,
  start:field.slice(0,3800),headOrder:field.slice(0,2700),end:field.slice(-330)}));
const tokens=['const A=','return[...','EnvironmentStatus','Operation','customFixedData','Be.value=[...n]','headerRender','render(l)'];
for(const [name,content] of [['field',field],['table',table],['preload',preload]]){
 for(const token of tokens){
  const idx=content.indexOf(token);
  if(idx>=0)console.log('ALMACEN_FIELD_DIAGNOSTIC='+JSON.stringify({name,token,at:idx,
   context:content.slice(Math.max(0,idx-550),Math.min(content.length,idx+1800))}));
 }
}
const env=get('dist/assets/envList-CYDbiryu.js');
const pos=env.indexOf('customFixedData:Fo.value');
console.log('ALMACEN_NATIVE_FIELD_PROP='+JSON.stringify({at:pos,
  context:pos>=0?env.slice(pos-320,pos+700):''}));
for (const needle of ['prop:"operation"', 'rowKey:"id"', 'label:oa("env.env.environmentStatus"', 'const ts=', 'ts=b(']) {
 const idx=env.indexOf(needle);
 console.log('ALMACEN_RENDER_ANCHOR='+JSON.stringify({needle,index:idx,context:idx<0?'':env.slice(Math.max(0,idx-320),idx+950)}));
}

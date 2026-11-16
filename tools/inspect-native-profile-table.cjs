'use strict';
/* Read-only inventory of original native profile-table JS modules. */
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const req=createRequire(path.join(__dirname,'../release-build/native-0.2.0/package.json'));
const asar=req('@electron/asar');
const archive=process.argv[2];
const raw=asar.getRawHeader(archive),head=typeof raw.header==='string'?JSON.parse(raw.header):raw.header;
const dataStart=8+(raw.headerSize??raw.size),fd=fs.openSync(archive,'r');
const paths=[];
function enumerate(node,name){
 if(node.files){for(const [part,child] of Object.entries(node.files))enumerate(child,name?name+'/'+part:part);}
 else paths.push({name,size:node.size,offset:node.offset});
}
enumerate(head,'');
console.log('ALMACEN_ASAR_NAMED_FILES='+JSON.stringify(
 paths.filter(x=>/env|profile|browser|download|file|table|store/i.test(x.name)&&
     x.name.startsWith('dist/assets/')&&x.name.endsWith('.js'))
 .map(x=>({name:x.name,size:x.size})).slice(0,160)));
function content(name){
 const meta=paths.find(x=>x.name===name);if(!meta)throw Error('Missing '+name);
 const b=Buffer.alloc(meta.size);
 if(fs.readSync(fd,b,0,b.length,dataStart+Number(meta.offset))!==b.length)throw Error('short');
 return b.toString('utf8');
}
const env=content('dist/assets/envList-CYDbiryu.js');
console.log('ALMACEN_ENVLIST_START='+JSON.stringify(env.slice(0,8000)));
console.log('ALMACEN_ENVLIST_END='+JSON.stringify(env.slice(-9000)));
const needles=['EnvTable','envTable','env-list-table','envListTable','rowKey','row-key','el-table','env.env.operation','env.env.serial','env.env.name','actionColumn','tableName','table-column','tableData'];
for(const n of needles){
 const pos=env.indexOf(n);if(pos>=0)console.log('ALMACEN_ENVLIST_MATCH='+JSON.stringify({name:n,at:pos,sample:env.slice(Math.max(0,pos-260),pos+650)}));
}
fs.closeSync(fd);

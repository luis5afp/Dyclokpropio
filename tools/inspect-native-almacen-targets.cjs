'use strict';
/* Inspect bounded, static source fragments from an exact vendor ASAR. Read-only. */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const from = createRequire(path.join(__dirname,'../release-build/native-0.2.0/package.json'));
const asar=from('@electron/asar');
const archive=process.argv[2];
if(!archive) throw new Error('ASAR path missing');
const raw=asar.getRawHeader(archive);
const index=typeof raw.header==='string'?JSON.parse(raw.header):raw.header;
const start=8+(raw.headerSize??raw.size);
function leaf(p){
 let n=index;
 for(const part of p.split('/'))n=n.files?.[part];
 if(!n||n.unpacked||n.link||!Number.isInteger(n.size))throw Error('Unknown member '+p);
 const fd=fs.openSync(archive,'r'),bytes=Buffer.alloc(n.size);
 try { if(fs.readSync(fd,bytes,0,bytes.length,start+Number(n.offset))!==bytes.length)throw Error('short read'); }
 finally{fs.closeSync(fd);}
 return bytes.toString('utf8');
}
const files=[
 'dist/assets/envList-CYDbiryu.js',
 'dist/assets/index-CZSYLU7X.js',
 'dist/assets/index-bGjMkmkL.js',
 'dist-electron/main-gLlCfI66.js'
];
const query={
 'dist/assets/envList-CYDbiryu.js':[
  'serialNum','envId','row-key','el-table-column','table-column',
  'env.env.serial','env.env.status','profile','download','onClick',
  'operate','getEnvList','getBrowserList','openBrowser','state','listData',
  'Operation','Status'
 ],
 'dist/assets/index-CZSYLU7X.js':[
  'download.default_directory','downloadPath','envId','serialNum',
  'userData','downloads','\\Downloads','downloadDir','directory',
  'openFile','openPath','shell.openPath','openFolder','openDirectory',
  'downloadFile','savePath','open-dialog','profile-id','open-downloads'
 ],
 'dist/assets/index-bGjMkmkL.js':[
  'openPath','openFile','download','envList','downloadPath','openFolder'
 ],
 'dist-electron/main-gLlCfI66.js':[
  'setSavePath','savePath','downloadFilePath','downloadUrl','profileId',
  'userData','user-data-dir','downloadPath','Downloads','download.default_directory',
  'openPath','openFolder','showItemInFolder','shell.openPath'
 ]
};
for(const file of files){
 const s=leaf(file);
 const matches=[];
 for(const token of query[file]){
  let i=0,hits=0;
  while((i=s.toLowerCase().indexOf(token.toLowerCase(),i))!==-1&&hits++<3){
   matches.push({token,pos:i,context:s.slice(Math.max(0,i-270),Math.min(s.length,i+500)).replace(/\s+/g,' ')});
   i+=token.length;
  }
 }
 const limit=file.includes('envList')?65:file.includes('index-CZ')?28:22;
 console.log('ALMACEN_UI_DETAIL='+JSON.stringify({file,bytes:s.length,found:matches.length,matches:matches.slice(0,limit)}));
}

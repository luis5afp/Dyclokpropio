'use strict';
const fs=require('node:fs');
const data=fs.readFileSync('dist-electron/main-CuCOh59n.js','utf8');
const offsets=[5447950,5848339,5885796];
console.log('MAIN_BUNDLE_CHARS='+data.length);
for(const off of offsets) {
 if(off>=data.length){console.log('OFFSET_OUT_OF_BOUNDS '+off);continue;}
 console.log('OFFSET='+off+' SNIPPET_START');
 console.log(data.slice(Math.max(0,off-1100),Math.min(data.length,off+1900)));
 console.log('SNIPPET_END');
}
for(const term of ['gost.exe','probe-gost-start','clear-dev-cache','function CL','await CL()','getPath("userData")','ipcMain.handle']){
 let n=0,p=0,pos=[];
 while((p=data.indexOf(term,p))!==-1&&n<20){n++;pos.push(p);p+=term.length;}
 console.log('TERM='+term+' FIRST_OCCURRENCES='+JSON.stringify(pos));
}

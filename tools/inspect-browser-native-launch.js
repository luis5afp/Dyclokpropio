'use strict';
/* Read-only static inventory: does not run original main code or browser. */
const fs=require('node:fs');
const main=fs.readFileSync('dist-electron/main-CuCOh59n.js','utf8');
const renderer=fs.readFileSync('dist/assets/index-BUIbb6Pa.js','utf8');
const patterns=['ginsbrowser.exe','Chromium','chrome.exe','kernel','run-env','start-chrome','spawn(','execFile(', 'gost.exe'];
for (const [name,src] of [['main',main],['renderer',renderer]]) {
  console.log('SOURCE='+name+' chars='+src.length);
  for (const token of patterns) {
    const hits=[];let p=0;
    while((p=src.indexOf(token,p))!==-1) {hits.push(p);p+=token.length;}
    console.log('TOKEN '+JSON.stringify(token)+' count='+hits.length+' sample='+JSON.stringify(hits.slice(0,14)));
    if(['ginsbrowser.exe','Chromium','chrome.exe','run-env','gost.exe'].includes(token)){
      for(const at of hits.slice(0,7)){
        const around=src.slice(Math.max(0,at-170),Math.min(src.length,at+220));
        console.log('CONTEXT '+name+'/'+token+'/'+at+' '+around.replace(/\s+/g,' ').slice(0,410));
      }
    }
  }
}

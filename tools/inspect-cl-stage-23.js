'use strict';
const fs=require('node:fs');
const src=fs.readFileSync('dist-electron/main-CuCOh59n.js','utf8');
for(const [label,from,to] of [
 ['STMT_21',5603406,5603491],
 ['STMT_22',5603491,5603657],
 ['STMT_23',5603657,5604548],
 ['STMT_24',5604548,5605019]
]){
 console.log('BEGIN_'+label);
 console.log(src.slice(from,to));
 console.log('END_'+label);
}

for(const name of ['WA','oN','Sn','GA']){
 const needles=['const '+name+'=','let '+name+'=',name+'=class','function '+name+'('];
 let positions=[];
 for(const needle of needles){
   let off=src.indexOf(needle);
   if(off>=0)positions.push({needle,offset:off,context:src.slice(Math.max(0,off-100),Math.min(src.length,off+900))});
 }
 console.log('SYMBOL_'+name+'_DEFINITIONS='+JSON.stringify(positions.slice(0,6)));
}

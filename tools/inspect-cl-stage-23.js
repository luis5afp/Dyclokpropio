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

for(const [name,rx] of [['WA',/\\b(?:class\\s+WA|WA\\s*=|function\\s+WA\\s*\\()/g],['oN',/\\b(?:const\\s+oN|oN\\s*=|function\\s+oN\\s*\\()/g],['Sn',/\\b(?:const\\s+Sn|Sn\\s*=|function\\s+Sn\\s*\\()/g],['GA',/\\b(?:const\\s+GA|GA\\s*=|function\\s+GA\\s*\\()/g]]){
 const matches=Array.from(src.matchAll(rx)).slice(0,5);
 console.log('SYMBOL_'+name+'_DEFINITIONS='+JSON.stringify(matches.map(m=>({offset:m.index,context:src.slice(Math.max(0,m.index-120),Math.min(src.length,m.index+650))}))));
}

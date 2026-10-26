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

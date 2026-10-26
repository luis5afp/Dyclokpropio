'use strict';
// Static, read-only analysis of publicly committed recovered main bundle.
// Does not evaluate app code, touch profiles, or send requests.
const fs=require('node:fs');
const path=require('node:path');
const file=path.join(__dirname,'../dist-electron/main-CuCOh59n.js');
const s=fs.readFileSync(file,'utf8');
function contexts(needle, before=800, after=1400, limit=8){
 let at=0, positions=[];
 while((at=s.indexOf(needle,at))>=0&&positions.length<limit){positions.push(at);at+=needle.length}
 console.log('TERM',JSON.stringify(needle),'COUNT-AT-LEAST',positions.length,'OFFSETS',positions.join(','));
 positions.forEach(pos=>console.log('EXCERPT',needle,'AT',pos,'\n'+s.slice(Math.max(0,pos-before),Math.min(s.length,pos+after))+'\nEND_EXCERPT'));
}
console.log('BUNDLE LENGTH',s.length);
contexts("Vv=",550,1100,12);
contexts("_0x2a7edd=",650,1000,3);
contexts("_0x2a7edd(",300,600,5);
contexts("Vv,_0x2a7edd",1100,1100,6);
contexts("Vv, _0x2a7edd",1100,1100,5);
contexts("_0x3f3e18('0x22c7','0x419e')",1000,1200,5);
contexts("_0x3f3e18('0x22c7', '0x419e')",1000,1200,5);

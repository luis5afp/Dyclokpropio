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

const acorn=require('acorn');
const target=s.indexOf("Vv,_0x2a7edd");
if(target<0)throw new Error('Handler registration changed');
const ast=acorn.parse(s,{ecmaVersion:'latest',sourceType:'script',allowReturnOutsideFunction:true});
function findPath(node, offset, path=[]) {
 if(!node||typeof node!=='object'||typeof node.start!=='number'||!(node.start<=offset&&offset<node.end))return null;
 const pathNew=[...path,node];
 for(const [key,value] of Object.entries(node)){
   if(key==='start'||key==='end')continue;
   if(Array.isArray(value)){
     for(const sub of value){
       const found=findPath(sub,offset,pathNew);
       if(found)return found;
     }
   }else if(value&&typeof value==='object'){
     const found=findPath(value,offset,pathNew);
     if(found)return found;
   }
 }
 return pathNew;
}
const parentPath=findPath(ast,target);
console.log('AST-REGISTER-PATH',JSON.stringify(parentPath.map((node,idx)=>({
 level:idx,type:node.type,start:node.start,end:node.end,
 span:node.end-node.start,
 opening:s.slice(node.start,Math.min(node.start+145,node.end)),
 closing:s.slice(Math.max(node.start,node.end-140),node.end),
 identifier:node.id&&node.id.name||undefined
}))));

const references=[];
function inspect(node,parent,ancestors=[]){
 if(!node||typeof node!=='object')return;
 if(node.type==='Identifier'&&node.name==='CL')references.push({
  start:node.start,parentType:parent?.type,
  ancestors:ancestors.slice(-5).map(x=>x.type),
  before:s.slice(Math.max(0,node.start-450),node.start),
  after:s.slice(node.end,Math.min(s.length,node.end+700))
 });
 for(const [name,value] of Object.entries(node)){
  if(name==='start'||name==='end')continue;
  if(Array.isArray(value))value.forEach(sub=>inspect(sub,node,[...ancestors,node]));
  else if(value&&typeof value==='object')inspect(value,node,[...ancestors,node]);
 }
}
inspect(ast,null);
console.log('CL-REF-COUNT',references.length);
references.slice(0,22).forEach(x=>console.log('CL-REF',JSON.stringify(x)));

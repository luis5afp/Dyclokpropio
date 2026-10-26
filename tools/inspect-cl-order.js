'use strict';
const fs=require('node:fs'),acorn=require('acorn');
const src=fs.readFileSync('dist-electron/main-CuCOh59n.js','utf8');
const label='const CL=async()=>';
const idx=src.indexOf(label);
if(idx<0)throw Error('CL declaration not found');
const fn=acorn.parseExpressionAt(src,idx+'const CL='.length,{ecmaVersion:'latest',ranges:true});
if(fn.type!=='ArrowFunctionExpression'||fn.body.type!=='BlockStatement')throw Error('Not recovered CL arrow: '+fn.type+'/'+fn.body?.type+' offset '+idx+' '+src.slice(idx,idx+70));
const body=fn.body.body;
const registrationAt=5848339;
console.log('STATIC_CL_BEGIN='+idx+' END='+fn.end+' TOP_LEVEL_STATEMENTS='+body.length+' REGISTRATION_OFFSET='+registrationAt);
function preview(st){
 const snippet=src.slice(st.start,Math.min(st.end,st.start+115)).replace(/\s+/g,' ');
 return {start:st.start,end:st.end,type:st.type,startsWith:snippet,containsRegister:st.start<=registrationAt&&st.end>=registrationAt,
  awaitTokens:(src.slice(st.start,st.end).match(/await\s/g)||[]).length};
}
for(const [i,st] of body.entries()){
 if(i<25 || i>body.length-12 || st.start<=registrationAt&&st.end>=registrationAt || st.start>registrationAt-6000&&st.start<registrationAt+500)
 console.log('CL_STATEMENT='+i+' '+JSON.stringify(preview(st)));
}
let regStatement=body.findIndex(st=>st.start<=registrationAt&&st.end>=registrationAt);
if(regStatement<0)throw Error('Registration offset not inside CL');
console.log('REGISTER_STATEMENT_INDEX='+regStatement+' OF='+body.length);
const awaitsBefore=body.slice(0,regStatement).reduce((n,st)=>n+(src.slice(st.start,st.end).match(/await\s/g)||[]).length,0);
console.log('AWAIT_TOKENS_BEFORE_REGISTRATION='+awaitsBefore);
for(let i=Math.max(0,regStatement-5);i<=Math.min(body.length-1,regStatement+5);i++){
 const st=body[i];console.log('NEAR_REG_'+i+' START='+st.start+' LEN='+(st.end-st.start)+' TEXT='+src.slice(st.start,Math.min(st.end,st.start+250)).replace(/\s+/g,' '));
}

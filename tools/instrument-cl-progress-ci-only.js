'use strict';
/** ANALYSIS BRANCH ONLY. Inserts numeric CL-entry checkpoints in CI staging copy.
 * This script MUST NOT run in the release workflow. Original source is
 * checked against immutable SHA256 before instrumentation. No user input.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),acorn=require('acorn');
const p=path.resolve('dist-electron/main-CuCOh59n.js');
const src=fs.readFileSync(p,'utf8');
const SHA=t=>crypto.createHash('sha256').update(t).digest('hex');
const expected='1fe224de31533973bffc386ee830c878c9ef2ce09199de3a4bc7c3268b9371ac';
if(SHA(src)!==expected)throw Error('Protected original byte hash changed');
const label='const CL=async()=>';
const idx=src.indexOf(label);
if(idx<0||src.indexOf(label,idx+1)!==-1)throw Error('Expected exactly one CL startup function');
const expr=acorn.parseExpressionAt(src,idx+'const CL='.length,{ecmaVersion:'latest'});
const fn=expr.type==='SequenceExpression'?expr.expressions[0]:expr;
if(fn.type!=='ArrowFunctionExpression'||fn.body.type!=='BlockStatement')throw Error('Unexpected original CL declaration');
const body=fn.body.body;
if(body.length!==48 || !body[42] || !src.slice(body[42].start,body[42].end).includes('ipcMain'))
 throw Error('Unexpected recovered cache-registration statement');
const mark=(n)=>{const marker=JSON.stringify(String(n));
 return ';try{const p=process.env.DYCLOK_CL_PROGRESS_FILE;if(p&&p.endsWith("dyclok-ci-cl-progress.txt"))require("node:fs").writeFileSync(p,'+marker+');}catch{};';
};
const patches=body.map((st,i)=>({pos:st.start,code:mark(i)}));
// Statement 23 is a comma sequence: WA.start, event binding, oN, Sn, GA,
// tray creation. Mark each sub-expression without changing its return value.
const stmt23=body[23];
if(stmt23.type!=='ExpressionStatement'||stmt23.expression.type!=='SequenceExpression')throw Error('Unexpected statement 23 sequence');
const exprs=stmt23.expression.expressions;
if(exprs.length<5||exprs.length>10)throw Error('Unexpected startup expression count');
const markExpr=n=>'(()=>{try{const p=process.env.DYCLOK_CL_PROGRESS_FILE;if(p&&p.endsWith("dyclok-ci-cl-progress.txt"))require("node:fs").writeFileSync(p,'+JSON.stringify(String(n))+');}catch{}})()';
for(const [i,ex] of exprs.entries()){
  patches.push({pos:ex.start,code:'('+markExpr('23.'+i)+',',priority:-1});
  patches.push({pos:ex.end,code:')'});
}
console.log('CI_STAGE_23_SUBEXPRESSIONS='+exprs.length);
patches.push({pos:fn.body.start+1,code:mark('ENTER')});
patches.sort((a,b)=>b.pos-a.pos || (a.priority??0)-(b.priority??0));
let next=src;
for(const {pos,code} of patches)next=next.slice(0,pos)+code+next.slice(pos);
if(!next.includes("const CL=async()=>{"))throw Error('Original function start modified');
fs.writeFileSync(p,next,'utf8');
console.log('CI_NUMERIC_CL_CHECKPOINTS='+patches.length);
console.log('ORIGINAL_SHA256_VERIFIED=true');
console.log('CI_INSTRUMENTED_MAIN_SHA256='+SHA(next));

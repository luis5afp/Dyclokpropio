#!/usr/bin/env node
'use strict';
/**
 * User-invoked lab decryption. Never sends contents, prints values, or
 * overwrites files. The passphrase is entered on a local TTY without echo.
 */
const fs=require('node:fs');
const path=require('node:path');
const {decryptLabCapture}=require('./diloak-lab-response-capture.cjs');
async function askHidden(){
  if(!process.stdin.isTTY||typeof process.stdin.setRawMode!=='function')
    throw Error('TTY_REQUIRED_USE_INTERACTIVE_TERMINAL');
  return new Promise((resolve,reject)=>{
    let password='';
    const input=process.stdin;
    process.stdout.write('Frase de cifrado del laboratorio (no se muestra): ');
    const oldRaw=input.isRaw;
    input.setRawMode(true);input.resume();
    const cleanup=()=>{
      input.off('data',onData);
      input.setRawMode(Boolean(oldRaw));
      input.pause();
      process.stdout.write('\n');
    };
    function onData(buf){
      for(const c of buf.toString('utf8')){
        if(c==='\r'||c==='\n'){cleanup();resolve(password);return;}
        if(c==='\u0003'){cleanup();reject(Error('CANCELLED_BY_USER'));return;}
        if(c==='\b'||c==='\u007f'){password=password.slice(0,-1);continue;}
        if(c>=' '&&c<='~'&&password.length<2048)password+=c;
      }
    }
    input.on('data',onData);
  });
}
async function main(args=process.argv.slice(2)){
  if(args.length!==2)throw Error('USO: node tools/diloak-lab-read.cjs archivo.dplab carpeta-de-salida');
  const [file,outDir]=args;
  const st=fs.statSync(file);
  if(!st.isFile()||st.size>5*1024*1024||!file.endsWith('.dplab'))
    throw Error('INVALID_LAB_FILE');
  if(!fs.existsSync(outDir)||!fs.statSync(outDir).isDirectory())
    throw Error('OUTPUT_DIRECTORY_MUST_EXIST');
  const passphrase=await askHidden();
  let clear;
  try{clear=decryptLabCapture(fs.readFileSync(file),passphrase);}
  catch{throw Error('DECRYPTION_FAILED_WRONG_PASSPHRASE_OR_CORRUPT_FILE');}
  const base=path.basename(file,'.dplab');
  const info=path.join(outDir,base+'.response.json');
  const body=path.join(outDir,base+'.response.body.bin');
  // Both output files are written only on explicit user request.
  fs.writeFileSync(info,JSON.stringify(clear.metadata,null,2)+'\n',{flag:'wx',mode:0o600});
  try{fs.writeFileSync(body,clear.body,{flag:'wx',mode:0o600});}
  catch(error){fs.rmSync(info,{force:true});throw error;}
  clear.body.fill(0);
  process.stdout.write('Desencriptado local. El cuerpo permanece en .response.body.bin.\n');
}
if(require.main===module)main().catch(error=>{
 process.stderr.write('Error: '+String(error.message||error)+'\n');process.exitCode=1;
});
module.exports={main};

#!/usr/bin/env node
'use strict';
/* Build DICloak 0.3.0 lab from an exact verified official 3.0.7 archive.
 * Changes ONLY three JS members. Rebuilds ASAR integrity; the PE resource
 * hash must subsequently be updated without flipping Electron fuses.
 */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const {createRequire}=require('node:module');
const asar=createRequire(path.join(__dirname,'../release-build/native-0.3.0/package.json'))('@electron/asar');
const popup=require('./suppress-native-update-autopopup.js');
const download=require('./suppress-native-download-confirmation.js');
const ASAR_SHA='b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf';
const PE_SHA='e00064c5195235a4eb492194cd0136cc7d81c7be8eab9acb75ffdb6e26e0c29f';
const COLUMN_ANCHOR='zo.isSelectTable?{}:{prop:"operation"';
const ADD_COLUMN='zo.isSelectTable?{}:{prop:"almacen_lab",label:"Almacén",fixed:"right",width:110,render:({row:e})=>se(Ae,{type:"primary",plain:!0,title:"Datos ficticios: laboratorio local",onClick:t=>{t.stopPropagation();const r=window.ipcRenderer;r&&r.invoke&&r.invoke("almacen-lab:open",e.id).catch(()=>{})}},{default:()=>"Abrir"})},';
const APP_MAIN_ADDITION='\n;try{require(require("node:path").join(process.resourcesPath,"almacen-lab","almacen-native-lab-main.cjs")).install()}catch(e){console.warn("[Almacén lab]",e.message)}\n';
const TARGETS=['dist-electron/main.js','dist/assets/envList-CYDbiryu.js','dist/assets/index-bGjMkmkL.js'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function check(ok,msg){if(!ok)throw Error('BLOCKED: '+msg)}
function parseJS(text,esm) {
  const r=spawnSync(process.execPath,esm?['--check','--input-type=module']:['--check'],{
    input:text,encoding:'utf8',maxBuffer:2*1024*1024
  });
  check(r.status===0,'modified JS syntax error: '+String(r.stderr).slice(0,500));
}
function patchUI(text) {
  check(text.split(COLUMN_ANCHOR).length===2,'expected one original operation column');
  check(text.includes('rowKey:"id"'),'native table no longer uses internal id');
  check(!text.includes('prop:"almacen_lab"'),'already patched native column');
  const result=text.replace(COLUMN_ANCHOR,ADD_COLUMN+COLUMN_ANCHOR);
  check(result.includes('label:oa("env.env.environmentStatus"'),'Estado missing');
  check(result.split('prop:"almacen_lab"').length===2,'Almacén not unique');
  parseJS(result,true);
  return result;
}
function patchMain(text) {
  check(text.includes('exports')&&!text.includes('almacen-native-lab-main.cjs'),'unknown native entry');
  const next=text+APP_MAIN_ADDITION;
  parseJS(next,false);
  return next;
}
function patchUpdateUI(text) {
  const result=download.preview(popup.preview(text));
  check(result.includes('ue.value&&100===j.value&&(E.value=!0)'),'mandatory update missing');
  parseJS(result,true);
  return result;
}
function listEntries(file) {
  const raw=asar.getRawHeader(file);
  const head=typeof raw.header==='string'?JSON.parse(raw.header):raw.header;
  check(head&&head.files,'missing ASAR header');
  const entries=[];
  function walk(node,name) {
    if(node.files)for(const [k,v]of Object.entries(node.files))walk(v,name?name+'/'+k:k);
    else entries.push({name,unpacked:!!node.unpacked,size:node.size});
  }
  walk(head,'');
  return entries;
}
function assertSameMembers(before,after) {
  const b=new Map(after.map(x=>[x.name,x]));
  check(before.length===after.length,'ASAR file count changed');
  for(const a of before) {
    const x=b.get(a.name);
    check(x,'ASAR entry missing '+a.name);
    check(a.unpacked===x.unpacked,'ASAR unpack flag changed '+a.name);
    if(!TARGETS.includes(a.name))check(a.size===x.size,'original file size changed '+a.name);
  }
}
async function build(folder) {
  const archive=path.join(folder,'resources','app.asar');
  const exe=path.join(folder,'DICloak.exe');
  check(sha(fs.readFileSync(archive))===ASAR_SHA,'pinned vendor app.asar mismatch');
  check(sha(fs.readFileSync(exe))===PE_SHA,'pinned vendor DICloak.exe mismatch');
  const original=listEntries(archive);
  const work=fs.mkdtempSync(path.join(os.tmpdir(),'dicloak-almacen-030-'));
  const extract=path.join(work,'original'),candidate=path.join(work,'new.asar');
  const backup=archive+'.verified-backup';
  check(!fs.existsSync(backup),'backup file already exists');
  try {
    fs.mkdirSync(extract);
    asar.extractAll(archive,extract);
    const read=n=>fs.readFileSync(path.join(extract,...n.split('/')),'utf8');
    const update={
      'dist-electron/main.js':patchMain(read('dist-electron/main.js')),
      'dist/assets/envList-CYDbiryu.js':patchUI(read('dist/assets/envList-CYDbiryu.js')),
      'dist/assets/index-bGjMkmkL.js':patchUpdateUI(read('dist/assets/index-bGjMkmkL.js'))
    };
    for(const [name,source]of Object.entries(update)){
      fs.writeFileSync(path.join(extract,...name.split('/')),source,'utf8');
    }
    await asar.createPackageWithOptions(extract,candidate,{
      unpack:'{**/*.node,dist-electron/worker/downloadWorker.cjs,node_modules/get-windows/main}'
    });
    const rebuilt=listEntries(candidate);
    assertSameMembers(original,rebuilt);
    const vendorUnpacked=path.join(folder,'resources','app.asar.unpacked');
    for(const member of original.filter(e=>e.unpacked)) {
      const parts=member.name.split('/');
      const a=path.join(vendorUnpacked,...parts),b=path.join(candidate+'.unpacked',...parts);
      check(fs.existsSync(a)&&fs.existsSync(b),'missing original unpacked '+member.name);
      check(sha(fs.readFileSync(a))===sha(fs.readFileSync(b)),
        'native unpacked payload changed '+member.name);
    }
    const checkDir=path.join(work,'verified');fs.mkdirSync(checkDir);
    asar.extractAll(candidate,checkDir);
    for(const member of original.filter(e=>!TARGETS.includes(e.name))){
      const parts=member.name.split('/');
      const a=path.join(extract,...parts),b=path.join(checkDir,...parts);
      check(fs.existsSync(a)&&fs.existsSync(b),'missing other member '+member.name);
      check(sha(fs.readFileSync(a))===sha(fs.readFileSync(b)),
        'unmodified member bytes changed '+member.name);
    }
    fs.renameSync(archive,backup);
    try{fs.copyFileSync(candidate,archive,fs.constants.COPYFILE_EXCL);}
    catch(error){fs.renameSync(backup,archive);throw error;}
    fs.unlinkSync(backup);
    const manifest={
      deliveryVersion:'0.3.0',originalEngine:'DICloak 3.0.7',
      executableSha256:PE_SHA,originalExecutableSha256:PE_SHA,
      officialAsarSha256:ASAR_SHA,modifiedAsarSha256:sha(fs.readFileSync(archive)),
      changedMembers:TARGETS,localhostOnly:true,capturesRealBrowsing:false,
      mandatoryUpdateCheckPreserved:true
    };
    fs.writeFileSync(path.join(folder,'resources','dyclok-native-update-ui-manifest.json'),
      JSON.stringify(manifest,null,2)+'\n');
    console.log('ALMACEN_030_ASAR_REBUILT='+JSON.stringify({
      members:original.length,unpacked:original.filter(e=>e.unpacked).length,
      changes:TARGETS,modifiedAsarSha256:manifest.modifiedAsarSha256
    }));
  } finally { fs.rmSync(work,{recursive:true,force:true}); }
}
if(require.main===module){
  const folder=process.argv[2];
  check(folder,'Usage: node build-dicloak-native-almacen-030.js <verified-official-app>');
  build(path.resolve(folder)).catch(error=>{console.error(error);process.exitCode=1});
}
module.exports={patchUI,patchMain,patchUpdateUI,listEntries,assertSameMembers};

#!/usr/bin/env node
'use strict';
/* Build DICloak 0.3.0 lab from an exact verified official 3.0.7 archive.
 * Changes ONLY three JS members. Rebuilds ASAR integrity; the PE resource
 * hash must subsequently be updated without flipping Electron fuses.
 */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const {createRequire}=require('node:module');
const asar=createRequire(path.join(__dirname,'../release-build/native-0.3.2/package.json'))('@electron/asar');
const popup=require('./suppress-native-update-autopopup.js');
const download=require('./suppress-native-download-confirmation.js');
const ASAR_SHA='b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf';
const PE_SHA='e00064c5195235a4eb492194cd0136cc7d81c7be8eab9acb75ffdb6e26e0c29f';
const COLUMN_ANCHOR='zo.isSelectTable?{}:{prop:"operation"';
const ADD_COLUMN='zo.isSelectTable?{}:{prop:"almacen_lab",label:"Almacén",fixed:"right",width:170,align:"center",resizable:!1,render:({row:e})=>se(Ae,{type:"primary",plain:!0,style:{width:"135px",minWidth:"135px",height:"48px",padding:"0",margin:"0"},title:"Almacén de pruebas (datos ficticios)",onClick:async t=>{t.stopPropagation();try{const b=window.dicloakAlmacenLab;const p=window.ipcRenderer;const abrir=b&&typeof b.open==="function"?b.open.bind(b):p&&typeof p.invoke==="function"?id=>p.invoke("almacen-lab:open",id):null;if(!abrir){window.alert("Almacén: conexión con Electron no disponible");return}const x=await abrir(String(e.id??""));if(!x||!x.ok){window.alert("Almacén: "+String(x&&x.reason||"No se pudo abrir la carpeta"))}}catch(x){window.alert("Almacén: "+String(x&&x.message||x))}}},{default:()=>"Abrir"})},';
const FIELD_CONFIG='customFixedData:[...(Array.isArray(Fo.value)?Fo.value:[]).filter(e=>e.key!=="almacen_lab"),{id:99999,key:"almacen_lab",label:"Almacén",checked:!0,disabled:!0,freeze:!1}]';
const FIELD_CONFIG_OLD='customFixedData:Fo.value';
const FIELD_DIALOG_MEMBER='dist/assets/TableFieldDialog-V53UVTu7.js';
const PRELOAD_MEMBER='dist-electron/preload/index.js';
const FIELD_SORT_OLD='i=new Set([e.Selection,e.Operation,...j]);return[...t?[t]:[],...l.filter(e=>!i.has(e.key)),...o?[o]:[],...s?[s]:[],...n?[n]:[]]';
const FIELD_SORT_NEW='i=new Set([e.Selection,e.Operation,...j,"almacen_lab"]),alm=l.find(e=>e.key==="almacen_lab");return[...t?[t]:[],...l.filter(e=>!i.has(e.key)),...o?[o]:[],...s?[s]:[],...alm?[alm]:[],...n?[n]:[]]';
const PRELOAD_ADDITION='\n;try{const {contextBridge,ipcRenderer}=require("electron");const api=Object.freeze({open:id=>ipcRenderer.invoke("almacen-lab:open",String(id))});if(process.contextIsolated){contextBridge.exposeInMainWorld("dicloakAlmacenLab",api)}else{window.dicloakAlmacenLab=api}}catch(e){console.warn("[Almacén Lab] No se pudo inicializar el puente:",e.message)}\n';
const APP_MAIN_ADDITION='\n;try{require("./almacen-lab/almacen-native-lab-main.cjs").install()}catch(e){console.warn("[Almacén lab]",e.message)}\n';
const TARGETS=['dist-electron/main.js','dist-electron/preload/index.js','dist/assets/envList-CYDbiryu.js','dist/assets/TableFieldDialog-V53UVTu7.js','dist/assets/index-bGjMkmkL.js'];
const LAB_MODULES=[
  'almacen-native-lab-main.cjs','almacen-lab-bridge.js','almacen-perfil-readonly.js',
  'almacen-respuesta-http-pruebas.js','almacen-original-files.js'
];
const LAB_DEST='dist-electron/almacen-lab/';
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
  let result=text.replace(COLUMN_ANCHOR,ADD_COLUMN+COLUMN_ANCHOR);
  check(result.split(FIELD_CONFIG_OLD).length===2,'vendor custom field config changed');
  result=result.replace(FIELD_CONFIG_OLD,FIELD_CONFIG);
  check(result.includes('label:oa("env.env.environmentStatus"'),'Estado missing');
  check(result.includes(FIELD_CONFIG),'Almacén not checked in saved column preferences');
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
function patchFieldDialog(text) {
  check(text.split(FIELD_SORT_OLD).length===2,'Vendor field ordering logic changed');
  const result=text.replace(FIELD_SORT_OLD,FIELD_SORT_NEW);
  check(result.includes('...s?[s]:[],...alm?[alm]:[],...n?[n]:[]'),
    'Almacén must be after Estado and before Operación');
  parseJS(result,true);
  return result;
}
function patchPreload(text) {
  check(text.includes("getSystemVersion") && !text.includes("dicloakAlmacenLab"),
    'Unknown preload API version');
  const result=text+PRELOAD_ADDITION;
  parseJS(result,false);
  return result;
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
  check(after.length===before.length+LAB_MODULES.length,'Unexpected new ASAR file count');
  const oldNames=new Set(before.map(e=>e.name));
  for(const extra of after.filter(e=>!oldNames.has(e.name))){
    check(extra.name.startsWith(LAB_DEST) &&
      LAB_MODULES.includes(extra.name.slice(LAB_DEST.length)) &&
      !extra.unpacked, 'Unexpected additional ASAR file '+extra.name);
  }
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
      'dist-electron/preload/index.js':patchPreload(read('dist-electron/preload/index.js')),
      'dist/assets/envList-CYDbiryu.js':patchUI(read('dist/assets/envList-CYDbiryu.js')),
      'dist/assets/TableFieldDialog-V53UVTu7.js':patchFieldDialog(read('dist/assets/TableFieldDialog-V53UVTu7.js')),
      'dist/assets/index-bGjMkmkL.js':patchUpdateUI(read('dist/assets/index-bGjMkmkL.js'))
    };
    for(const [name,source]of Object.entries(update)){
      fs.writeFileSync(path.join(extract,...name.split('/')),source,'utf8');
    }
    const nativeDir=path.join(extract,'dist-electron','almacen-lab');
    fs.mkdirSync(nativeDir);
    for(const moduleFile of LAB_MODULES) {
      const original=path.join(__dirname,moduleFile);
      check(fs.existsSync(original),'missing Almacén lab module '+moduleFile);
      fs.copyFileSync(original,path.join(nativeDir,moduleFile));
    }
    await asar.createPackageWithOptions(extract,candidate,{
      unpack:'{**/*.node,**/downloadWorker.cjs,**/main}'
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
      deliveryVersion:'0.3.2',originalEngine:'DICloak 3.0.7',
      executableSha256:PE_SHA,originalExecutableSha256:PE_SHA,
      officialAsarSha256:ASAR_SHA,modifiedAsarSha256:sha(fs.readFileSync(archive)),
      changedMembers:TARGETS,additionalMembers:LAB_MODULES,localhostOnly:true,capturesRealBrowsing:false,
      mandatoryUpdateCheckPreserved:true
    };
    fs.writeFileSync(path.join(folder,'resources','dyclok-native-update-ui-manifest.json'),
      JSON.stringify(manifest,null,2)+'\n');
    console.log('ALMACEN_030_ASAR_REBUILT='+JSON.stringify({
      members:original.length,unpacked:original.filter(e=>e.unpacked).length,
      changes:TARGETS,added:LAB_MODULES,modifiedAsarSha256:manifest.modifiedAsarSha256
    }));
  } finally { fs.rmSync(work,{recursive:true,force:true}); }
}
if(require.main===module){
  const folder=process.argv[2];
  check(folder,'Usage: node build-dicloak-native-almacen-030.js <verified-official-app>');
  build(path.resolve(folder)).catch(error=>{console.error(error);process.exitCode=1});
}
module.exports={patchUI,patchMain,patchPreload,patchFieldDialog,patchUpdateUI,listEntries,assertSameMembers};

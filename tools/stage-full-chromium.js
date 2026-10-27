#!/usr/bin/env node
'use strict';
/**
 * Stage the ENTIRE Chromium folder from a user-provided authorized legacy
 * installation ZIP. Never fetch a third-party archive or patch original JS.
 * Usage: node tools/stage-full-chromium.js --archive /path/to/DICloak.zip
 * The build directory Chromium/ must not preexist (fail closed).
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const AdmZip=require('adm-zip');

const versionPattern=/^Application\/(\d+\.\d+\.\d+\.\d+)\/chrome\.dll$/;
const minimumNames=['Application/ginsbrowser.exe','icudtl.dat','resources.pak','v8_context_snapshot.bin'];
const MAX_FILES=7000, MAX_BYTES=4_000_000_000;
function digest(buffer){return crypto.createHash('sha256').update(buffer).digest('hex')}
function sha256File(filename){
  const h=crypto.createHash('sha256'),fd=fs.openSync(filename,'r'),buf=Buffer.allocUnsafe(1024*1024);
  try {let n;while((n=fs.readSync(fd,buf,0,buf.length,null))>0)h.update(buf.subarray(0,n))}
  finally {fs.closeSync(fd)}
  return h.digest('hex');
}
function normal(name){return name.replace(/\\/g,'/')}
// Only ship runtime assets, never crash identifiers, user data or setup metrics
// from an already-used DICloak installation. These data can be regenerated.
function isRuntimeAsset(relative){
  const path=relative.replace(/\\/g,'/');
  if(/^(?:User Data|Application\/SetupMetrics)(?:\/|$)/i.test(path))return false;
  if(/^(?:Application|ginsbrowser)\//i.test(path))return true;
  return /^version\.json$/i.test(path);
}
function filenameSafe(relative){
  if(!relative || relative.startsWith('/')||relative.includes('//') || /^[a-z]:/i.test(relative) || /[\x00-\x1f:]/.test(relative))return false;
  const parts=relative.split('/');
  return parts.every(part=>part.length>0&&part!=='.'&&part!=='..'&& !/[<>|?*]/.test(part)&& !/[. ]$/.test(part)&& !/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i.test(part));
}

/** Map the separately compressed VERSION folder into Chromium/Application/VERSION.
 * Supports VERSION.zip with entries "chrome.dll", "VERSION/chrome.dll" or
 * "Chromium/Application/VERSION/chrome.dll" (and bounded wrapper folders).
 */
function versionArchiveEntries(filename){
  const zip=new AdmZip(filename),raw=zip.getEntries().filter(e=>!e.isDirectory);
  const candidates=[];
  const basename=path.basename(filename).replace(/\.zip$/i,'');
  for(const e of raw){
    const n=normal(e.entryName);
    if(!filenameSafe(n))throw Error('Unsafe source path in version archive');
    const m=n.match(/(?:^|\/)(\d+\.\d+\.\d+\.\d+)\/chrome\.dll$/i);
    if(m){
      const version=m[1],prefix=n.slice(0,n.length-'chrome.dll'.length);
      candidates.push({version,prefix});
    } else if(n.toLowerCase()==='chrome.dll'&&/^\d+\.\d+\.\d+\.\d+$/.test(basename)){
      candidates.push({version:basename,prefix:''});
    }
  }
  if(candidates.length!==1)throw Error('Separate version ZIP needs exactly one chrome.dll in one unambiguous version folder');
  const {version,prefix}=candidates[0];
  if(prefix.split('/').filter(Boolean).length>6)throw Error('Version folder nesting too deep');
  const mapped=[];
  for(const e of raw){
    const src=normal(e.entryName);
    if(!src.toLowerCase().startsWith(prefix.toLowerCase()))continue;
    const tail=src.slice(prefix.length);
    if(!tail)continue;
    if(!filenameSafe(tail))throw Error('Unsafe member path in version ZIP');
    const relative='Application/'+version+'/'+tail;
    if(!filenameSafe(relative)||!isRuntimeAsset(relative))throw Error('Invalid version archive resource');
    if((e.attr>>>16&0xf000)===0xa000)throw Error('Symlink in version archive rejected');
    mapped.push({zipEntry:e,relative,size:e.header.size});
  }
  if(!mapped.some(e=>e.relative.toLowerCase()==='application/'+version+'/chrome.dll'))throw Error('Separate version archive DLL missing');
  return {version,entries:mapped};
}

function inspect(zip,versionArchive=null){
  const list=zip.getEntries();
  // ZIPs made by Windows can contain Chromium/ or directly its contents.
  // Accept no more than three harmless wrapper directories, reject ambiguity.
  const roots=list.filter(e=>!e.isDirectory&&/^(?:[^/]+\/){0,3}(?:Chromium\/)?Application\/ginsbrowser\.exe$/i.test(normal(e.entryName)));
  if(roots.length!==1)throw Error('Exactly one Application/ginsbrowser.exe required in Chromium archive');
  const root=normal(roots[0].entryName).slice(0,-'Application/ginsbrowser.exe'.length);
  // Avoid reading any accidental profiles/app binaries outside the Chromium tree.
  const rootSegments=root.split('/').filter(Boolean);
  if(rootSegments.length && !rootSegments.some(s=>s.toLowerCase()==='chromium'))
    throw Error('Archive root must include Chromium folder, or Chromium contents at ZIP root');
  const entries=[];const names=new Set();let bytes=0;
  for(const e of list){
    const name=normal(e.entryName);
    if(!name.toLowerCase().startsWith(root.toLowerCase()))continue;
    // A contents-only ZIP must not include unrelated application files.
    const relative=name.slice(root.length).replace(/\/$/,'');
    if(!isRuntimeAsset(relative))continue;
    if(!relative)continue;
    if(!filenameSafe(relative))throw Error('Unsafe path inside Chromium ZIP');
    if((e.attr>>>16&0xf000)===0xa000)throw Error('Symlink inside Chromium ZIP rejected');
    const id=relative.toLowerCase();
    if(names.has(id))throw Error('Case-insensitive duplicate archive path');
    names.add(id);
    if(!e.isDirectory){
      bytes+=e.header.size;
      entries.push({zipEntry:e,relative,size:e.header.size});
    }
    if(entries.length>MAX_FILES||bytes>MAX_BYTES)throw Error('Chromium archive exceeds size/count bounds');
  }
  if(versionArchive){
    const extra=versionArchiveEntries(versionArchive);
    const seen=new Map(entries.map(e=>[e.relative.toLowerCase(),e]));
    for(const added of extra.entries){
      const name=added.relative.toLowerCase();
      const previous=seen.get(name);
      if(previous){
        if(previous.size!==added.size ||
           digest(previous.zipEntry.getData())!==digest(added.zipEntry.getData()))
          throw Error('Conflicting Chromium ZIP resources: '+added.relative);
        continue; // Two identical copies are safe; preserve primary archive source.
      }
      seen.set(name,added);
      entries.push(added);
      bytes+=added.size;
      if(entries.length>MAX_FILES||bytes>MAX_BYTES)throw Error('Combined Chromium archives exceed size/count bounds');
    }
  }
  if(entries.length<40)throw Error('Incomplete Chromium tree: fewer than 40 files');
  const files=new Map(entries.map(e=>[e.relative.toLowerCase(),e]));
  const versions=entries.filter(e=>versionPattern.test(e.relative)).map(e=>e.relative.match(versionPattern)[1]);
  if(versions.length!==1)throw Error('Exactly one native Chromium chrome.dll version required');
  const version=versions[0];
  for(const needed of minimumNames){
    const rel=needed==='Application/ginsbrowser.exe'?needed:'Application/'+version+'/'+needed;
    if(!files.has(rel.toLowerCase()))throw Error('Missing Chromium dependency '+rel);
  }
  const exe=files.get('application/ginsbrowser.exe');
  const dll=files.get(('Application/'+version+'/chrome.dll').toLowerCase());
  if(exe.size<1_000_000||dll.size<100_000_000)throw Error('Native browser EXE or DLL unexpectedly small');
  return {root,entries,files,version,bytes};
}

function assertWindowsX64PE(filename){
  const fd=fs.openSync(filename,'r');
  try{
    const prefix=Buffer.alloc(64);
    if(fs.readSync(fd,prefix,0,64,0)!==64||prefix.toString('ascii',0,2)!=='MZ')
      throw Error('Not a Windows executable/DLL (MZ header missing)');
    const at=prefix.readUInt32LE(0x3c);
    if(at<64||at>1024*1024||at+6>fs.fstatSync(fd).size)
      throw Error('Invalid Windows PE header offset');
    const pe=Buffer.alloc(6);
    if(fs.readSync(fd,pe,0,6,at)!==6||pe.toString('ascii',0,4)!=='PE\u0000\u0000')
      throw Error('Invalid Windows PE signature');
    if(pe.readUInt16LE(4)!==0x8664)
      throw Error('Native Chromium component is not Windows x64');
  }finally{fs.closeSync(fd)}
}

function stage(archive,into,opts={}){
  const target=path.resolve(into,'Chromium');
  if(fs.existsSync(target))throw Error('Chromium/ already exists; refusing overwrite');
  const zip=new AdmZip(archive);
  const inventory=inspect(zip,opts.versionArchive||null);
  const stageDir=path.join(path.dirname(target),'.dyclok-chromium-stage-'+crypto.randomBytes(8).toString('hex'));
  fs.mkdirSync(stageDir,{recursive:false});
  const hashes={};
  let committed=false;
  try{
    for(const file of inventory.entries){
      const dest=path.resolve(stageDir,...file.relative.split('/'));
      if(!dest.startsWith(stageDir+path.sep))throw Error('Zip extraction path escaped staging root');
      fs.mkdirSync(path.dirname(dest),{recursive:true});
      const buf=file.zipEntry.getData();
      if(buf.length!==file.size)throw Error('Uncompressed size mismatch: '+file.relative);
      fs.writeFileSync(dest,buf,{flag:'wx'});
      const normalized=file.relative.toLowerCase();
      if(normalized==='application/ginsbrowser.exe'||normalized.endsWith('/chrome.dll')&&versionPattern.test(file.relative)){
        hashes[file.relative]=digest(buf);
      }
    }
    if(opts.requirePE===true){
      assertWindowsX64PE(path.join(stageDir,'Application','ginsbrowser.exe'));
      assertWindowsX64PE(path.join(stageDir,'Application',inventory.version,'chrome.dll'));
    }
    if(fs.existsSync(target))throw Error('Chromium folder appeared concurrently');
    fs.renameSync(stageDir,target); committed=true;
    return {version:inventory.version,files:inventory.entries.length,bytes:inventory.bytes,
            archiveSha256:sha256File(archive),versionArchiveSha256:opts.versionArchive?sha256File(opts.versionArchive):null,criticalFiles:hashes};
  }finally{
    if(!committed)fs.rmSync(stageDir,{recursive:true,force:true});
  }
}
function validateInstalled(root){
  const target=path.resolve(root,'Chromium');
  const exe=path.join(target,'Application','ginsbrowser.exe');
  if(!fs.existsSync(exe)||fs.statSync(exe).size<1_000_000)throw Error('Missing/invalid installed ginsbrowser.exe');
  const versions=fs.readdirSync(path.join(target,'Application'),{withFileTypes:true})
    .filter(e=>e.isDirectory()&&/^\d+\.\d+\.\d+\.\d+$/.test(e.name)).map(e=>e.name);
  const real=versions.filter(v=>fs.existsSync(path.join(target,'Application',v,'chrome.dll')));
  if(real.length!==1)throw Error('Missing/ambiguous Chromium engine version directory');
  const version=real[0];
  for(const file of ['chrome.dll','icudtl.dat','resources.pak','v8_context_snapshot.bin']){
    if(!fs.existsSync(path.join(target,'Application',version,file)))throw Error('Incomplete installed kernel: '+file);
  }
  if(fs.statSync(path.join(target,'Application',version,'chrome.dll')).size<100_000_000)throw Error('Installed chrome.dll is undersized');
  return {version,exe:fs.statSync(exe).size,dll:fs.statSync(path.join(target,'Application',version,'chrome.dll')).size};
}
function main(args){
  if(args.includes('--verify-only')){
    const x=validateInstalled(process.cwd());console.log('CHROMIUM_VERIFIED='+JSON.stringify(x));return;
  }
  if(args.length!==2&&args.length!==4 || args[0]!=='--archive' || args.length===4&&args[2]!=='--version-archive')
    throw Error('Usage: node tools/stage-full-chromium.js --archive Chromium.zip [--version-archive 142.0.7444.273.zip] or --verify-only');
  if(!fs.existsSync(args[1]))throw Error('Authorized Chromium ZIP not found');
  if(args.length===4&&!fs.existsSync(args[3]))throw Error('Separate native version ZIP not found');
  const info=stage(args[1],process.cwd(),{requirePE:true,versionArchive:args.length===4?args[3]:null});
  validateInstalled(process.cwd());
  console.log('CHROMIUM_STAGED='+JSON.stringify(info));
}
if(require.main===module)try{main(process.argv.slice(2))}catch(err){console.error('CHROMIUM_PRECHECK_FAILED:',err.message);process.exitCode=1}
module.exports={filenameSafe,isRuntimeAsset,inspect,stage,validateInstalled,assertWindowsX64PE,versionArchiveEntries};

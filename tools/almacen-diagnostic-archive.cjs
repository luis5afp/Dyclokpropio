'use strict';
/**
 * On-disk archive for sanitized opening diagnostics only.
 * Profile identifiers never appear in filenames, directory names or reports.
 * An installation-local random HMAC key makes dictionary guessing difficult.
 * No browser databases, cookies, passwords, tokens, 2FA or HTTP bodies stored.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {validateDiagnostic}=require('./almacen-diagnostic-panel.cjs');
const {makeOpeningAudit,renderAuditTXT}=require('./almacen-diagnostic-report.cjs');
const MAX_REPORT_BYTES=4*1024*1024;
const ID=/^diloakPRO-Apertura-\d{8}-\d{6}-[a-f0-9]{12}$/;

function createDiagnosticArchive({rootDir}={}){
 if(typeof rootDir!=='string'||!path.isAbsolute(rootDir))
   throw new TypeError('ARCHIVE_ROOT_REQUIRED');
 const keyPath=path.join(rootDir,'.archive-key');
 let key=null;
 function ensure(){
   fs.mkdirSync(rootDir,{recursive:true,mode:0o700});
   if(!key){
     try{
       key=fs.readFileSync(keyPath);
     }catch(e){
       if(e.code!=='ENOENT')throw e;
       const fresh=crypto.randomBytes(32);
       try{fs.writeFileSync(keyPath,fresh,{flag:'wx',mode:0o600});}
       catch(err){if(err.code!=='EEXIST')throw err;}
       key=fs.readFileSync(keyPath);
     }
     if(key.length!==32)throw Error('ARCHIVE_KEY_INVALID');
   }
 }
 function subdir(profileId){
   if(typeof profileId!=='string'||!profileId||profileId.length>200)
     throw new TypeError('ARCHIVE_PROFILE_INVALID');
   ensure();
   const digest=crypto.createHmac('sha256',key).update(profileId,'utf8').digest('hex');
   return path.join(rootDir,'perfil-'+digest.slice(0,32));
 }
 function reportId(){
   const time=new Date().toISOString().replace(/[-:]/g,'').replace('T','-').slice(0,15);
   return 'diloakPRO-Apertura-'+time+'-'+crypto.randomBytes(6).toString('hex');
 }
 function safePath(dir,id,format){
   if(typeof id!=='string'||!ID.test(id)||!['json','txt'].includes(format))
     throw Error('ARCHIVE_ENTRY_INVALID');
   const filename=id+'.'+format;
   const full=path.join(dir,filename);
   if(path.dirname(full)!==dir)throw Error('ARCHIVE_PATH_INVALID');
   return full;
 }
 function read(profileId,id,format='json'){
   const file=safePath(subdir(profileId),id,format);
   const stat=fs.lstatSync(file);
   if(!stat.isFile()||stat.isSymbolicLink()||stat.size>MAX_REPORT_BYTES)
     throw Error('ARCHIVE_ENTRY_INVALID');
   return fs.readFileSync(file,'utf8');
 }
 function save(profileId,rawEvents){
   if(!Array.isArray(rawEvents))throw TypeError('ARCHIVE_EVENTS_INVALID');
   const dir=subdir(profileId);
   const events=rawEvents.slice(-850).map(validateDiagnostic);
   const counters={total:events.length,approved:0,saved:0,
     failed:events.filter(e=>['operation_step_failed','native_http_error','native_monitor_error'].includes(e.event)).length};
   const report={
     schema:2,engine:'DICloak 3.0.7',diagnostic:'0.4.2',
     delivery:'v30.0.20-diloakpro-rc7',coverage:'partial',
     exportedAt:new Date().toISOString(),savedAutomatically:true,
     events,counters,checks:{}
   };
   report.audit=makeOpeningAudit(report);
   const json=JSON.stringify(report,null,2),txt=renderAuditTXT(report);
   if(Buffer.byteLength(json,'utf8')>MAX_REPORT_BYTES||
      Buffer.byteLength(txt,'utf8')>MAX_REPORT_BYTES)
     throw Error('ARCHIVE_TOO_LARGE');
   fs.mkdirSync(dir,{recursive:true,mode:0o700});
   const id=reportId();
   const jsonPath=safePath(dir,id,'json'),txtPath=safePath(dir,id,'txt');
   // Both files are created exclusively, never overwrite older reports.
   fs.writeFileSync(jsonPath,json,{encoding:'utf8',flag:'wx',mode:0o600});
   try{fs.writeFileSync(txtPath,txt,{encoding:'utf8',flag:'wx',mode:0o600});}
   catch(e){try{fs.unlinkSync(jsonPath);}catch{}throw e;}
   return {id,exportedAt:report.exportedAt,firstOpeningRequestedAt:report.audit.timeline.firstOpeningRequestedAt,
     requests:report.audit.summary.requests,responses:report.audit.summary.responses,
     errors:report.audit.summary.errors,events:events.length,finishReason:report.audit.timeline.captureFinishReason};
 }
 function list(profileId,{limit=50}={}){
   const dir=subdir(profileId);
   let files;
   try{files=fs.readdirSync(dir,{withFileTypes:true});}
   catch(e){if(e.code==='ENOENT')return [];throw e;}
   const ids=files.filter(f=>f.isFile()&&ID.test(f.name.replace(/\.json$/,''))&&f.name.endsWith('.json'))
     .map(f=>f.name.slice(0,-5)).sort().reverse().slice(0,Math.max(1,Math.min(limit,100)));
   return ids.flatMap(id=>{
     try{
       const report=JSON.parse(read(profileId,id,'json'));
       const a=report.audit;
       if(!a||!a.summary||!a.timeline)return [];
       return [{id,exportedAt:report.exportedAt,
         firstOpeningRequestedAt:a.timeline.firstOpeningRequestedAt,
         finishReason:a.timeline.captureFinishReason,
         requests:a.summary.requests,responses:a.summary.responses,
         errors:a.summary.errors,events:report.events?.length||0}];
     }catch{return [];}
   });
 }
 return Object.freeze({save,list,read,rootDir});
}
module.exports={createDiagnosticArchive};

'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {createAlmacenNativeAuditController,senderIsApp,CHANNEL}=require('./almacen-native-chromium-audit.cjs');

async function setup(){
 const base=await fs.mkdtemp(path.join(os.tmpdir(),'dicloak-native-034-'));
 const native=path.join(base,'chromium-test-profile');
 const storage=path.join(base,'almacen-reports');
 await fs.mkdir(path.join(native,'Network'),{recursive:true});
 await fs.mkdir(path.join(native,'Local Storage','leveldb'),{recursive:true});
 const cookies=Buffer.from('FAKE_COOKIE_TEST_NO_EXPORT_123456');
 const password=Buffer.from('FAKE_PASSWORD_TEST_NO_EXPORT_ABC');
 await fs.writeFile(path.join(native,'Network','Cookies'),cookies);
 await fs.writeFile(path.join(native,'Login Data'),password);
 await fs.writeFile(path.join(native,'Local Storage','leveldb','000001.ldb'),Buffer.from([0,255,17]));
 return {base,native,storage,cookies,password};
}

test('Almacén selects a closed synthetic Chromium profile, hashes native files, saves only counts/digests and opens its folder',async()=>{
 const x=await setup();
 const opened=[],optionsSeen=[];
 const dialogApi={
   async showOpenDialog(options){optionsSeen.push(options);return {canceled:false,filePaths:[x.native]};},
   async showMessageBox(options){optionsSeen.push(options);return {response:1};}
 };
 const shellApi={async openPath(folder){opened.push(folder);return '';}};
 try{
  const c=createAlmacenNativeAuditController({rootFolder:x.storage,dialogApi,shellApi});
  const first=await c.open('internal_524');
  assert.equal(first.ok,true);
  assert.equal(first.firstAudit,true);
  assert.equal(first.categoryFileCounts.cookies,1);
  assert.equal(first.categoryFileCounts.credentialsNative,1);
  assert.equal(first.realNetworkTrafficCaptured,false);
  assert.equal(first.sessionIdentityVerifiedAutomatically,false);
  assert.deepEqual(opened,[path.join(x.storage,'internal_524')]);
  const folder=path.join(x.storage,'internal_524','auditorias');
  const entries=await fs.readdir(folder);
  assert.equal(entries.length,1);
  const contents=await fs.readFile(path.join(folder,entries[0]),'utf8');
  const saved=JSON.parse(contents);
  assert.equal(saved.profileDirectoryIdentityVerifiedAutomatically,false);
  assert.equal(saved.credentialsOrCookiesDecrypted,false);
  assert.equal(saved.sourceContentsCopied,false);
  assert.ok(!contents.includes(x.cookies.toString()));
  assert.ok(!contents.includes(x.password.toString()));
  assert.ok(!contents.includes(x.native));
  assert.ok((await fs.readFile(path.join(x.native,'Network','Cookies'))).equals(x.cookies));
  assert.ok((await fs.readFile(path.join(x.native,'Login Data'))).equals(x.password));
  const second=await c.open('internal_524');
  assert.equal(second.ok,true);
  assert.equal(second.firstAudit,false);
  assert.equal((await fs.readdir(folder)).length,2);
  assert.equal(optionsSeen.filter(x=>x.properties?.includes('openDirectory')).length,1,
    'profile path remains bound only in this process');
  assert.equal(optionsSeen.filter(x=>x.buttons?.includes('Confirmo perfil de pruebas cerrado')).length,2);
 }finally{await fs.rm(x.base,{recursive:true,force:true});}
});

test('cancellation does not read, modify or create reports',async()=>{
 const x=await setup();
 let opened=0;
 try{
  const c=createAlmacenNativeAuditController({rootFolder:x.storage,
    dialogApi:{async showOpenDialog(){return {canceled:true,filePaths:[]};}},
    shellApi:{async openPath(){opened++;return '';}}
  });
  const result=await c.open('internal_524');
  assert.equal(result.ok,false);
  assert.equal(result.reason,'SELECCION_CANCELADA');
  assert.equal(opened,0);
  await assert.rejects(fs.stat(x.storage),/ENOENT/);
 }finally{await fs.rm(x.base,{recursive:true,force:true});}
});

test('manual folder binding is not silently reused across different profiles',async()=>{
 const x=await setup();
 let dialogs=0;
 try{
  const c=createAlmacenNativeAuditController({rootFolder:x.storage,
    dialogApi:{
      async showOpenDialog(){dialogs++;return {canceled:false,filePaths:[x.native]};},
      async showMessageBox(){return {response:1};}
    },
    shellApi:{async openPath(){return '';}}
  });
  assert.equal((await c.open('profile_A')).ok,true);
  const blocked=await c.open('profile_B');
  assert.equal(blocked.ok,false);
  assert.equal(blocked.reason,'LA_CARPETA_YA_ESTA_VINCULADA_A_OTRO_PERFIL');
  assert.equal(dialogs,2);
 }finally{await fs.rm(x.base,{recursive:true,force:true});}
});

test('renderer validation accepts only a main frame of the app',()=>{
 const sender={getURL(){return 'file:///C:/Apps/DICloak/resources/app.asar/dist/index.html';}};
 const frame={};
 sender.mainFrame=frame;
 const Windows={getAllWindows(){return[{webContents:sender}]}};
 assert.equal(senderIsApp({sender,senderFrame:frame},Windows),true);
 assert.equal(senderIsApp({sender,senderFrame:{}},Windows),false);
 sender.getURL=()=> 'https://not-the-app.example';
 assert.equal(senderIsApp({sender,senderFrame:frame},Windows),false);
 assert.equal(CHANNEL,'almacen-lab:open');
});

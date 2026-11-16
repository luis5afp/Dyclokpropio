'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {archiveOriginalFile,validateSafeFileName}=require('./almacen-original-files.js');
const digest=buf=>require('node:crypto').createHash('sha256').update(buf).digest('hex');

test('preserves exact source bytes for TXT, ZIP, cookie-shaped opaque files and binary',async()=>{
  const top=await fs.mkdtemp(path.join(os.tmpdir(),'almacen-source-'));
  try{
    const datasets=[
      ['texto UTF8.txt',Buffer.from('Hola\r\náéí こんにちは\n')],
      ['datos.zip',Buffer.from([0x50,0x4b,0x03,0x04,0x00,0xff,0x7f,0x80])],
      ['cookies.dat',Buffer.from([0x00,0xff,0xf1,0x03,0x43,0x55])],
      ['archivo.pdf',Buffer.from('%PDF-1.7\n\x00\x01','binary')]
    ];
    const originalCopies=datasets.map(([,b])=>Buffer.from(b));
    for(let i=0;i<datasets.length;i++){
      const [originalName,payload]=datasets[i];
      const item=await archiveOriginalFile({
        rootFolder:top,profileId:'profile01',eventId:'event'+i,originalName,payload
      });
      assert.ok(item.file.includes(path.join('profile01','archivos','event'+i)));
      assert.ok((await fs.readFile(item.file)).equals(payload));
      assert.equal(item.sha256,digest(payload));
      assert.ok(payload.equals(originalCopies[i])); // input unchanged
      assert.equal(path.basename(item.file),originalName);
    }
    const files=await fs.readdir(path.join(top,'profile01','archivos'));
    assert.equal(files.length,4);
  } finally { await fs.rm(top,{recursive:true,force:true}); }
});

test('never replaces an earlier same-name file or crosses profile IDs',async()=>{
  const top=await fs.mkdtemp(path.join(os.tmpdir(),'almacen-events-'));
  try{
    const older=Buffer.from('original content');
    const newer=Buffer.from('newer content');
    const options={rootFolder:top,originalName:'result.txt',eventId:'downloadA'};
    const a=await archiveOriginalFile({...options,profileId:'profile01',payload:older});
    await assert.rejects(
      archiveOriginalFile({...options,profileId:'profile01',payload:newer}),
      /EEXIST/
    );
    assert.ok((await fs.readFile(a.file)).equals(older));
    const b=await archiveOriginalFile({...options,profileId:'profile02',payload:newer});
    assert.ok((await fs.readFile(b.file)).equals(newer));
    assert.notEqual(a.file,b.file);
  }finally{await fs.rm(top,{recursive:true,force:true});}
});

test('rejects unsafe filenames, path traversal and invalid event IDs',async()=>{
  const top=await fs.mkdtemp(path.join(os.tmpdir(),'almacen-invalid-'));
  try{
    for(const bad of ['../secret.txt','a/b.txt','a\\b.txt','CON.txt','name.', 'file:secret','file\nname']){
      assert.throws(()=>validateSafeFileName(bad));
      await assert.rejects(archiveOriginalFile({
        rootFolder:top,profileId:'profile01',eventId:'event01',
        originalName:bad,payload:Buffer.from('not saved')
      }));
    }
    await assert.rejects(archiveOriginalFile({
      rootFolder:top,profileId:'../other',eventId:'safe',
      originalName:'file.txt',payload:Buffer.alloc(0)
    }));
    await assert.rejects(archiveOriginalFile({
      rootFolder:top,profileId:'profile01',eventId:'../other',
      originalName:'file.txt',payload:Buffer.alloc(0)
    }));
  }finally{await fs.rm(top,{recursive:true,force:true});}
});

test('rejects symlinked Almacén root and payload decoding',async(t)=>{
  const top=await fs.mkdtemp(path.join(os.tmpdir(),'almacen-symlink-'));
  const link=top+'-link';
  try{
    try{await fs.symlink(top,link,'dir');}
    catch(e){if(['EPERM','EACCES','ENOSYS'].includes(e.code)){t.diagnostic('symlinks unavailable');return;}throw e;}
    await assert.rejects(archiveOriginalFile({
      rootFolder:link,profileId:'p1',eventId:'ev1',originalName:'file.txt',
      payload:Buffer.from('bytes')
    }),/symbolic-link/);
    await assert.rejects(archiveOriginalFile({
      rootFolder:top,profileId:'p1',eventId:'ev1',originalName:'file.txt',
      payload:'string to recode'
    }),/Buffer/);
  }finally{
    await fs.rm(link,{force:true});
    await fs.rm(top,{recursive:true,force:true});
  }
});

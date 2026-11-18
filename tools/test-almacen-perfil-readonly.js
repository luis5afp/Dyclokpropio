'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { validateProfileId, resolveExistingAlmacen, openAlmacen } = require('./almacen-perfil-readonly.js');

const fsApi = {
  lstatSync(p) {
    if (p.includes('notfound')) throw new Error('ENOENT');
    return { isDirectory: () => !p.includes('textfile'), isSymbolicLink: () => p.includes('symlink') };
  }
};

test('stable internal row.id is used; never use displayed serialNum', () => {
  assert.equal(validateProfileId('01909a1f-75ed-4790-bf20-2d079d950b5f'),
    '01909a1f-75ed-4790-bf20-2d079d950b5f');
  assert.throws(() => validateProfileId('../another-account'));
  assert.throws(() => validateProfileId('a/b'));
  assert.throws(() => validateProfileId(''));
});

test('does not guess or create a download folder when the mapping is unknown', () => {
  assert.deepEqual(resolveExistingAlmacen({ profileId: 'profile01', knownFolders: {}, fsApi }),
    { ok: false, reason: 'PROFILE_DOWNLOAD_LOCATION_NOT_KNOWN' });
});

test('rejects shared, network, missing, symlinked, or non-directory locations', () => {
  assert.equal(resolveExistingAlmacen({
    profileId: 'one', knownFolders: {one:'/tmp/download',two:'/tmp/download'}, fsApi
  }).reason, 'SHARED_FOLDER_CANNOT_ATTRIBUTE_TO_PROFILE');
  assert.equal(resolveExistingAlmacen({
    profileId: 'one', knownFolders: {one:'\\\\server\\share'}, fsApi
  }).reason, 'INVALID_DOWNLOAD_LOCATION');
  assert.equal(resolveExistingAlmacen({
    profileId: 'one', knownFolders: {one:'/tmp/notfound'}, fsApi
  }).reason, 'DOWNLOAD_FOLDER_NOT_FOUND');
  assert.equal(resolveExistingAlmacen({
    profileId: 'one', knownFolders: {one:'/tmp/symlink'}, fsApi
  }).reason, 'NOT_A_PLAIN_DIRECTORY');
  assert.equal(resolveExistingAlmacen({
    profileId: 'one', knownFolders: {one:'/tmp/textfile'}, fsApi
  }).reason, 'NOT_A_PLAIN_DIRECTORY');
});

test('detects different Windows spellings for the same shared download folder', () => {
  const result = resolveExistingAlmacen({
    profileId: 'profile01',
    knownFolders: { profile01: 'C:/Users/Example/Downloads', profile02: 'c:\\Users\\Example\\Downloads\\' },
    fsApi
  });
  assert.equal(result.reason, 'SHARED_FOLDER_CANNOT_ATTRIBUTE_TO_PROFILE');
});

test('opens only the exact trusted existing profile folder and never writes', async () => {
  const opened=[];
  const result=await openAlmacen({
    profileId:'profile01',
    knownFolders:{profile01:'/tmp/downloads-profile01',profile02:'/tmp/downloads-profile02'},
    fsApi, shellApi:{async openPath(folder){opened.push(folder); return '';}}
  });
  assert.deepEqual(result,{ok:true,opened:true});
  assert.deepEqual(opened,['/tmp/downloads-profile01']);
});

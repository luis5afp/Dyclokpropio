'use strict';

/**
 * READ-ONLY DICloak 3.0.7 download/storage and profile table survey.
 * Scans code from pinned vendor ASAR, never accesses user sessions or requests.
 * Emits file names and short bounded source fragments only.
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const fromBuild = createRequire(path.join(__dirname, '../release-build/native-0.2.0/package.json'));
const asar = fromBuild('@electron/asar');
const file = process.argv[2];
if (!file) throw new Error('Provide pinned vendor app.asar path.');
const raw = asar.getRawHeader(file);
const header = typeof raw.header === 'string' ? JSON.parse(raw.header) : raw.header;
const dataStart = 8 + (raw.headerSize ?? raw.size);
if (!header?.files || !Number.isInteger(dataStart)) throw new Error('Unknown ASAR index');

const contentFiles = [];
const fd = fs.openSync(file, 'r');
function walk(node, name) {
  if (node.files) {
    for (const [part,child] of Object.entries(node.files)) {
      walk(child, name ? name + '/' + part : part);
    }
    return;
  }
  if (!/\.(js|cjs|mjs|html)$/i.test(name) || /node_modules\//i.test(name) || !Number.isInteger(node.size) ||
      node.size <= 0 || node.size > 9 * 1024 * 1024 || node.link) return;
  let content;
  if (node.unpacked) {
    const unp = path.join(file+'.unpacked', ...name.split('/'));
    if (!fs.existsSync(unp)) return;
    content=fs.readFileSync(unp,'utf8');
  } else {
    if (!/^\d+$/.test(String(node.offset))) return;
    const bytes = Buffer.alloc(node.size);
    if (fs.readSync(fd,bytes,0,bytes.length,dataStart+Number(node.offset))!==bytes.length)throw Error('Short ASAR read '+name);
    content=bytes.toString('utf8');
  }
  contentFiles.push({name,source:content});
}
try{walk(header,'');}finally{fs.closeSync(fd);}
const uiTokens = [
  'profileList','profileId','profileName','profileNumber','checkIp','checkIP','groupId',
  'getProfileList','profileTable','browserList','openProfile','downloadPath',
  'Verificar IP','profileStatus','profileGroup','profileIdList','name:"profile"',
  'openedProfile','numberNameNotes','profileNum','openBrowser','profileDownload'
];
const backendTokens=[
  'will-download','setSavePath','getSavePath','savePath','downloadPath','downloadsPath',
  'downloadDir','downloadFolder','downloadDirectory','getPath("downloads"',
  "getPath('downloads'",'setDownloadPath','downloadItem','profileDataPath','profileFolder',
  'profileId','browserId','profile_id','downloadUrl','downloadFile'
];
const asContext=(s,i,n)=>s.slice(Math.max(0,i-85),Math.min(s.length,i+n)).replace(/\s+/g,' ').slice(0,n+110);
const names=[];
for (const {name,source} of contentFiles){
  const tokens=name.startsWith('dist-electron/')?backendTokens:uiTokens;
  const found=[];
  for (const t of tokens){
    const i=source.toLowerCase().indexOf(t.toLowerCase());
    if(i>=0) found.push({token:t,at:i,sample:asContext(source,i,180)});
  }
  if(found.length>0){
    const score=found.length+(name.includes('Profile')?4:0)+
      (found.some(x=>/will-download|setSavePath|downloadPath|profileTable|profileList/i.test(x.token))?5:0);
    names.push({name,bytes:Buffer.byteLength(source),score,matches:found.slice(0,13)});
  }
}
names.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
const compact=names.slice(0,34).map(e=>({name:e.name,bytes:e.bytes,score:e.score,
  tokens:e.matches.map(m=>m.token)}));
console.log('PROFILE_STORAGE_SURVEY_INDEX='+JSON.stringify({filesScanned:contentFiles.length,ranked:compact}));
for(const item of names.slice(0,18)){
  console.log('PROFILE_STORAGE_SURVEY_DETAIL='+JSON.stringify({
    file:item.name,score:item.score,matches:item.matches.slice(0,9)
  }));
}

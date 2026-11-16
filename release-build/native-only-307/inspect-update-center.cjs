'use strict';
/**
 * Read-only search of the official app.asar filesystem index and payload.
 * Using the raw header avoids Windows separator differences in older asar APIs.
 * Nothing is modified or saved from the vendor renderer.
 */
const fs = require('node:fs');
const path = require('node:path');
const asar = require('@electron/asar');

const archive = process.argv[2];
if (!archive) throw new Error('Usage: node inspect-update-center.cjs <app.asar>');
const raw = asar.getRawHeader(archive);
const header = typeof raw.header === 'string' ? JSON.parse(raw.header) :
  raw.header || JSON.parse(raw.headerString);
const headerSize = raw.headerSize ?? raw.size;
if (!header?.files || !Number.isInteger(headerSize)) {
  throw new Error('Unsupported ASAR header format');
}
const dataStart = 8 + headerSize;
const target = header.files?.dist?.files?.assets?.files?.['index-bGjMkmkL.js'];
if (!target) throw new Error('Expected update renderer not listed in original ASAR');
console.log('UPDATE_RENDERER_INTEGRITY=' + JSON.stringify({
  file: 'dist/assets/index-bGjMkmkL.js',
  size: target.size,
  offset: target.offset,
  sha256Blocks: Array.isArray(target.integrity?.blocks) ? target.integrity.blocks.length : 0,
  hasIntegrity: !!target.integrity
}));
const patterns = [
  /update\.updateCenter/g, /update\.versionUpdate/g,
  /update\.softUpdate/g, /updateCenter/g,
  /Centro de actualizaciones/g, /actualización versión/g,
  /update-app/g, /openOrCloseTip/g,
];
const matches = [];
let inspected = 0;
const fd = fs.openSync(archive, 'r');
function visit(node, member) {
  if (node.files) {
    for (const [name, child] of Object.entries(node.files)) {
      visit(child, member ? member + '/' + name : name);
    }
    return;
  }
  if (!/\.(?:js|html)$/i.test(member) || /node_modules\//.test(member) ||
      node.size > 65 * 1024 * 1024 || !Number.isInteger(node.size)) return;
  let data;
  if (node.unpacked) {
    const candidate = path.join(archive + '.unpacked', ...member.split('/'));
    if (!fs.existsSync(candidate)) return;
    data = fs.readFileSync(candidate);
  } else if (node.link) {
    return;
  } else {
    if (!/^\d+$/.test(String(node.offset))) return;
    data = Buffer.alloc(node.size);
    const read = fs.readSync(fd, data, 0, node.size, dataStart + Number(node.offset));
    if (read !== node.size) throw new Error('Short read of ASAR member ' + member);
  }
  inspected++;
  const source = data.toString('utf8');
  if (member === 'dist/assets/index-bGjMkmkL.js') {
    const i = source.indexOf('Tt=M(()=>');
    const j = source.indexOf('P(()=>Tt.value', i);
    console.log('NATIVE_UPDATE_AUTO_OPEN_CONTEXT=' + JSON.stringify({
      file: member, computedAt: i, watchAt: j, context: source.slice(i, i + 1450)
    }));
  }
  const found = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let hit;
    while ((hit = pattern.exec(source)) !== null && found.length < 15) {
      found.push({
        pattern: pattern.source, at: hit.index,
        snippet: source.slice(Math.max(0, hit.index - 320), hit.index + 560).replace(/[\r\n]/g, ' ')
      });
    }
  }
  if (found.length) matches.push({file: member, bytes: data.length, hits: found});
}
try {
  visit(header, '');
} finally {
  fs.closeSync(fd);
}
console.log(JSON.stringify({inspected, matches}, null, 2));
if (!matches.some(entry => entry.hits.some(h => h.pattern === 'update\\.updateCenter' || h.pattern === 'updateCenter'))) {
  throw new Error('No update center component found; fail closed');
}

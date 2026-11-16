'use strict';
/**
 * Read-only inspection of the recovered official DICloak app.asar.
 * Never emit credentials, cookies or private profile contents.
 */
const fs = require('node:fs');
const path = require('node:path');
const asar = require('@electron/asar');

const root = process.argv[2];
if (!root) throw new Error('Usage: node inspect-update-center.cjs <official-app.asar>');
const patterns = [
  /update\.updateCenter/g,
  /update\.versionUpdate/g,
  /update\.softUpdate/g,
  /updateCenter/g,
  /Centro de actualizaciones/g,
  /setInterval\([^)]{0,120}6e5/g,
  /update-app/g,
];
const paths = asar.listPackage(root).filter(file =>
  /\.(?:js|html)$/i.test(file) && !/node_modules/i.test(file)
);
const results = [];
for (const filename of paths) {
  const normalized = filename.replace(/\\/g, '/').replace(/^\/+/, '');
  let data;
  try { data = asar.extractFile(root, normalized); }
  catch (error) { console.warn('Skip unavailable ASAR member:', normalized, error.message); continue; }
  if (!Buffer.isBuffer(data) || data.length > 80 * 1024 * 1024) continue;
  const content = data.toString('utf8');
  const found = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null && found.length < 20) {
      found.push({
        match: pattern.source,
        index: match.index,
        sample: content.slice(Math.max(0, match.index - 100), match.index + 240).replace(/[\r\n]/g, ' ')
      });
    }
  }
  if (found.length) results.push({filename, bytes: data.length, matches: found});
}
console.log(JSON.stringify({filesExamined: paths.length, matches: results}, null, 2));
if (!results.some(row => row.matches.some(v => v.match.includes('updateCenter')))) {
  throw new Error('No exact update-center render component found: do not patch blindly');
}

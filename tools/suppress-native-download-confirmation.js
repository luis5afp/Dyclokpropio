'use strict';

/**
 * Pure preview for DICloak 3.0.7 OPTIONAL downloaded-installer prompt.
 * No vendor binaries, ASAR integrity records or security checks are edited.
 * The mandatory upgrade flow (E.value=!0) is intentionally untouched.
 */
const START = 'dt=()=>Pe.confirm(';
const END = ',pt=()=>{const e=gt();';
const REPLACEMENT = 'dt=()=>Promise.resolve()';
const MUST_RETAIN = Object.freeze([
  'update.updateCenter',
  'update.softUpdate',
  'update.notification',
  'ue.value&&100===j.value&&(E.value=!0)',
  'ue.value||100!==j.value||dt()',
  'openOrCloseTip'
]);

function count(text, needle) {
  return text.split(needle).length - 1;
}

function preview(source) {
  if (typeof source !== 'string' || !MUST_RETAIN.every(s => source.includes(s))) {
    throw new Error('BLOCKED: unknown DICloak version or missing security-update flow');
  }
  if (count(source, START) !== 1 || count(source, END) !== 1) {
    throw new Error('BLOCKED: optional confirmation markers missing or repeated');
  }
  const start = source.indexOf(START);
  const end = source.indexOf(END, start);
  if (end < start) throw new Error('BLOCKED: invalid optional prompt structure');
  const original = source.slice(start, end);
  for (const required of [
    'update.downloadCompleted', 'update.noteTip',
    'update.installNow', 'update.installLater',
    '.then(()=>', '.catch(()=>{})'
  ]) {
    if (!original.includes(required)) throw new Error('BLOCKED: unknown confirmation body');
  }
  const output = source.slice(0, start) + REPLACEMENT + source.slice(end);
  if (output.includes(START) || !output.includes(REPLACEMENT)) {
    throw new Error('BLOCKED: optional confirmation still present');
  }
  for (const keep of MUST_RETAIN) {
    if (!output.includes(keep)) throw new Error('BLOCKED: required update flow removed');
  }
  return output;
}

module.exports = { START, END, REPLACEMENT, MUST_RETAIN, preview };

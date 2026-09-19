'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGE1 = path.join(ROOT, 'reconstruction-work', 'main.stage1.js');
const ORIGINAL = path.join(ROOT, 'dist-electron', 'main-CuCOh59n.js');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'main-ipc-handlers.json');

const input = fs.existsSync(STAGE1) ? STAGE1 : ORIGINAL;
const source = fs.readFileSync(input, 'utf8');

function clip(offset, radius = 900) {
  const start = Math.max(0, offset - radius);
  const end = Math.min(source.length, offset + radius);
  return source.slice(start, end).replace(/\s+/g, ' ').trim();
}

const constants = new Map();

function parseStringConcat(expression) {
  const expr = expression.trim();
  if (!expr || expr.length > 500) return null;

  const stringToken = /(['"])(?:\\.|(?!\1)[^\\])*\1/g;
  const stripped = expr.replace(stringToken, 'S');

  if (!/^\s*S(?:\s*\+\s*S)*\s*$/.test(stripped)) return null;

  try {
    const value = require('vm').runInNewContext(expr, Object.create(null), {
      timeout: 50,
    });
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
}

const assignmentRegex =
  /\b([A-Za-z_$][\w$]*)\s*=\s*([^,;]{1,500})(?=\s*[,;])/g;

for (const match of source.matchAll(assignmentRegex)) {
  const value = parseStringConcat(match[2]);
  if (value !== null && /^[A-Za-z0-9_:.\/-]+$/.test(value)) {
    constants.set(match[1], value);
  }
}

function resolveChannel(expression) {
  const expr = expression.trim();

  const quoted = expr.match(/^(['"])([^'"]+)\1$/);
  if (quoted) return quoted[2];

  if (/^[A-Za-z_$][\w$]*$/.test(expr) && constants.has(expr)) {
    return constants.get(expr);
  }

  return null;
}

const registrations = [];
const seen = new Set();

const patterns = [
  {
    style: 'dot',
    regex: /\.\s*(handle|handleOnce|on|once)\s*\(\s*([^,()]{1,180})\s*,/g,
  },
  {
    style: 'bracket-single',
    regex: /\[\s*'(handle|handleOnce|on|once)'\s*\]\s*\(\s*([^,()]{1,180})\s*,/g,
  },
  {
    style: 'bracket-double',
    regex: /\[\s*"(handle|handleOnce|on|once)"\s*\]\s*\(\s*([^,()]{1,180})\s*,/g,
  },
];

for (const pattern of patterns) {
  for (const match of source.matchAll(pattern.regex)) {
    const method = match[1];
    const channelExpression = match[2].trim();
    const channel = resolveChannel(channelExpression);
    const offset = match.index || 0;

    const key = method + '|' + offset;
    if (seen.has(key)) continue;
    seen.add(key);

    registrations.push({
      method,
      style: pattern.style,
      channelExpression,
      channel,
      offset,
      context: clip(offset),
    });
  }
}

registrations.sort((a, b) => a.offset - b.offset);

const resolved = registrations.filter((item) => item.channel);
const likelyIpc = resolved.filter((item) =>
  /^[a-z][a-z0-9]*(?:[-:][a-z0-9_]+)+$/i.test(item.channel)
);

const byChannel = {};
for (const item of likelyIpc) {
  byChannel[item.channel] ||= [];
  byChannel[item.channel].push({
    method: item.method,
    channelExpression: item.channelExpression,
    offset: item.offset,
    context: item.context,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  input: path.relative(ROOT, input).replace(/\\/g, '/'),
  constantsRecovered: constants.size,
  registrationsFound: registrations.length,
  registrationsResolved: resolved.length,
  likelyIpcRegistrations: likelyIpc.length,
  uniqueLikelyIpcChannels: Object.keys(byChannel).length,
  channels: Object.fromEntries(
    Object.entries(byChannel).sort(([a], [b]) => a.localeCompare(b)),
  ),
  unresolved: registrations
    .filter((item) => !item.channel)
    .map((item) => ({
      method: item.method,
      channelExpression: item.channelExpression,
      offset: item.offset,
      context: item.context,
    })),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');

console.log('Recovered string constants: ' + report.constantsRecovered);
console.log('Likely IPC registrations: ' + report.likelyIpcRegistrations);
console.log('Unique IPC channels: ' + report.uniqueLikelyIpcChannels);

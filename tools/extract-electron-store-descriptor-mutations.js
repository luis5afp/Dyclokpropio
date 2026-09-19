'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRETTY = path.join(ROOT, 'reconstruction-work', 'main.stage1.pretty.js');
const SCHEMA = path.join(ROOT, 'reconstruction-analysis', 'electron-store-schema-recovery.json');
const OUT = path.join(ROOT, 'reconstruction-analysis', 'electron-store-descriptor-mutations.json');

const prettyLines = fs.readFileSync(PRETTY, 'utf8').split(/\r?\n/);
const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));

function stripQuoted(text) {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return null;
}

function findMutations(symbol) {
  const hits = [];
  const prefix = symbol + '[';

  for (let i = 0; i < prettyLines.length; i += 1) {
    const line = prettyLines[i];
    const start = line.indexOf(prefix);
    if (start < 0) continue;

    const keyStart = start + prefix.length;
    const keyEnd = line.indexOf(']', keyStart);
    if (keyEnd < 0) continue;

    const equals = line.indexOf('=', keyEnd);
    if (equals < 0) continue;

    const keyExpression = line.slice(keyStart, keyEnd).trim();
    const simpleKey = stripQuoted(keyExpression);
    if (!simpleKey) continue;

    let rhs = line.slice(equals + 1).trim();
    while (rhs.endsWith(',') || rhs.endsWith(';')) {
      rhs = rhs.slice(0, -1).trim();
    }

    let simpleValue = null;
    let valueKind = 'expression';

    const quoted = stripQuoted(rhs);
    if (quoted !== null) {
      simpleValue = quoted;
      valueKind = 'string';
    } else if (rhs === 'true' || rhs === '!0') {
      simpleValue = true;
      valueKind = 'boolean';
    } else if (rhs === 'false' || rhs === '!1') {
      simpleValue = false;
      valueKind = 'boolean';
    } else if (/^-?\d+(?:\.\d+)?$/.test(rhs)) {
      simpleValue = Number(rhs);
      valueKind = 'number';
    }

    hits.push({
      line: i + 1,
      key: simpleKey,
      valueKind,
      value: simpleValue,
      expression: rhs,
    });
  }

  return hits;
}

const descriptors = {};
for (const groupName of ['app', 'tracker']) {
  for (const field of schema[groupName].fields) {
    descriptors[field.descriptorSymbol] = {
      store: groupName,
      field: field.key,
      mutations: findMutations(field.descriptorSymbol),
    };
  }
}

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      descriptors,
    },
    null,
    2,
  ) + '\n',
);

const withMutations = Object.values(descriptors).filter(
  (entry) => entry.mutations.length > 0,
).length;

console.log('Schema descriptors inspected: ' + Object.keys(descriptors).length);
console.log('Descriptors with recovered mutations: ' + withMutations);

'use strict';

const {
  computeVersion,
  readConfig,
} = require('./set-build-version');

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ': expected ' + expected + ', got ' + actual);
  }
}

const config = readConfig();
const firstRun = config.workflowRunOffset + 1;

assertEqual(computeVersion(firstRun, config), '3.0.1', 'first automatic version');
assertEqual(computeVersion(firstRun + 1, config), '3.0.2', 'second automatic version');
assertEqual(computeVersion(firstRun + 9, config), '3.0.10', 'tenth automatic version');

console.log(
  JSON.stringify(
    {
      automaticVersioning: true,
      firstWorkflowRun: firstRun,
      firstVersion: computeVersion(firstRun, config),
      nextVersion: computeVersion(firstRun + 1, config),
      scheme: '3.0.<incrementing patch>',
    },
    null,
    2,
  ),
);

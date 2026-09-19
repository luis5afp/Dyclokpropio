'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'versioning.json');
const PACKAGE_PATH = path.join(ROOT, 'package.json');

function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function computeVersion(runNumber, config = readConfig()) {
  const run = Number(runNumber);
  if (!Number.isInteger(run) || run < 1) {
    throw new Error('A positive integer workflow run number is required.');
  }

  const patch =
    config.firstAutomaticPatch + (run - config.workflowRunOffset - 1);

  if (!Number.isInteger(patch) || patch < config.firstAutomaticPatch) {
    throw new Error(
      'Workflow run number ' +
        run +
        ' is older than the configured automatic-version baseline.',
    );
  }

  return [config.major, config.minor, patch].join('.');
}

function parseArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function assignVersion(runNumber) {
  const version = computeVersion(runNumber);
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n');

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'version=' + version + '\n');
  }

  console.log('Automatic build version: ' + version);
  return version;
}

if (require.main === module) {
  const runNumber =
    parseArg('--run-number') ||
    process.env.DYCLOK_VERSION_RUN ||
    process.env.GITHUB_RUN_NUMBER;

  assignVersion(runNumber);
}

module.exports = {
  assignVersion,
  computeVersion,
  readConfig,
};

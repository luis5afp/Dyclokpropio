'use strict';

// Independent updater for the recovered Dyclokpropio Windows installer.
// The vendor runtime and its own update IPC are intentionally not modified.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const https = require('node:https');
const crypto = require('node:crypto');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { spawn } = require('node:child_process');

const REPOSITORY = 'luis5afp/Dyclokpropio';
const VERSION_PATTERN = /^30\.0\.(0|[1-9]\d*)$/;
const ALLOWED_HOSTS = new Set([
  'api.github.com', 'github.com', 'release-assets.githubusercontent.com',
  'objects.githubusercontent.com'
]);
const MAX_METADATA_BYTES = 8 * 1024 * 1024;
const MAX_INSTALLER_BYTES = 600 * 1024 * 1024;

function compareVersions(a, b) {
  if (!VERSION_PATTERN.test(a) || !VERSION_PATTERN.test(b)) {
    throw new Error('Invalid Dyclokpropio delivery version');
  }
  const av = a.split('.').map(Number);
  const bv = b.split('.').map(Number);
  return av[2] === bv[2] ? 0 : av[2] > bv[2] ? 1 : -1;
}

function selectLatestRelease(releases, installedVersion) {
  if (!VERSION_PATTERN.test(installedVersion)) return null;
  let latest = null;
  for (const release of releases) {
    if (!release || release.draft || release.prerelease) continue;
    const tag = release.tag_name;
    if (typeof tag !== 'string' || !VERSION_PATTERN.test(tag.slice(1)) || tag[0] !== 'v') continue;
    const version = tag.slice(1);
    if (compareVersions(version, installedVersion) <= 0) continue;
    const installerName = 'Dyclokpropio_' + version + '_win_x64.exe';
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const installer = assets.find(a => a.name === installerName);
    const sums = assets.find(a => a.name === 'SHA256SUMS.txt');
    const prefix = 'https://github.com/' + REPOSITORY + '/releases/download/' + tag + '/';
    if (!installer || !sums ||
        installer.browser_download_url !== prefix + installerName ||
        sums.browser_download_url !== prefix + 'SHA256SUMS.txt') continue;
    if (!latest || compareVersions(version, latest.version) > 0) {
      latest = { version, installerName, installer, sums };
    }
  }
  return latest;
}

function parseChecksum(text, installerName) {
  if (typeof text !== 'string' || !/^Dyclokpropio_30\.0\.\d+_win_x64\.exe$/.test(installerName)) {
    throw new Error('Invalid installer checksum name');
  }
  for (const line of text.replace(/\r/g, '').split('\n')) {
    const match = /^([a-fA-F0-9]{64})[ \t]+\*?(\S+)$/.exec(line.trim());
    if (match && match[2] === installerName) return match[1].toLowerCase();
  }
  throw new Error('Installer SHA-256 missing from release');
}

function assertGithubUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname) ||
      url.username || url.password || url.port) {
    throw new Error('Untrusted update URL');
  }
  return url;
}

async function getResponse(value, consume, redirects = 0) {
  const url = assertGithubUrl(value);
  if (redirects > 6) throw new Error('Too many update redirects');
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Dyclokpropio-Windows-AutoUpdate',
        'Accept': url.hostname === 'api.github.com' ? 'application/vnd.github+json' : 'application/octet-stream'
      }
    }, res => {
      const code = res.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(code) && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        resolve(getResponse(next, consume, redirects + 1));
      } else if (code !== 200) {
        res.resume();
        reject(new Error('Update server HTTP ' + code));
      } else {
        resolve(consume(res));
      }
    });
    req.setTimeout(20000, () => req.destroy(new Error('Update request timeout')));
    req.on('error', reject);
  });
}

async function fetchText(url, maxBytes = MAX_METADATA_BYTES) {
  return getResponse(url, async response => {
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response) {
      bytes += chunk.length;
      if (bytes > maxBytes) throw new Error('Update response too large');
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
  });
}

async function fetchPublishedReleases() {
  const results = [];
  // The repository also publishes a *different* application (DyclokPRO v6.*).
  // Search only the v30.0.N stable releases and never install v6 artifacts.
  for (let page = 1; page <= 4; page += 1) {
    const endpoint = 'https://api.github.com/repos/' + REPOSITORY +
      '/releases?per_page=100&page=' + page;
    const batch = JSON.parse(await fetchText(endpoint));
    if (!Array.isArray(batch)) throw new Error('Invalid GitHub release response');
    results.push(...batch);
    if (batch.length < 100) break;
  }
  return results;
}

async function downloadVerifiedInstaller(url, file, expectedHash) {
  const actual = await getResponse(url, async response => {
    const declaredLength = Number(response.headers['content-length'] || 0);
    if (declaredLength > MAX_INSTALLER_BYTES) throw new Error('Update installer too large');
    const digest = crypto.createHash('sha256');
    let bytes = 0;
    const verify = new Transform({
      transform(chunk, encoding, callback) {
        bytes += chunk.length;
        if (bytes > MAX_INSTALLER_BYTES) {
          callback(new Error('Update installer too large'));
          return;
        }
        digest.update(chunk);
        callback(null, chunk);
      }
    });
    await pipeline(response, verify, fs.createWriteStream(file, { flags: 'wx' }));
    if (bytes === 0) throw new Error('Empty update installer');
    return digest.digest('hex');
  });
  if (actual !== expectedHash) throw new Error('Installer SHA-256 mismatch');
}

// Always wait for the old process to exit BEFORE NSIS replaces the .exe.
// NSIS /S skips its confirmation pages; /D preserves a custom install location.
function spawnSilentInstaller(installer, existingExe, parentPid, stagedDirectory) {
  const psLiteral = value => "'" + String(value).replace(/'/g, "''") + "'";
  const script = [
    "$ErrorActionPreference = 'Stop'",
    '$parentId = ' + Number(parentPid),
    '$installer = ' + psLiteral(installer),
    '$oldExe = ' + psLiteral(existingExe),
    '$staging = ' + psLiteral(stagedDirectory),
    'try {',
    '  $deadline = (Get-Date).AddMinutes(2)',
    '  while (Get-Process -Id $parentId -ErrorAction SilentlyContinue) {',
    '    if ((Get-Date) -ge $deadline) { exit 3 }',
    '    Start-Sleep -Milliseconds 350',
    '  }',
    '  $installDir = Split-Path -Parent $oldExe',
    '  $installArgs = "/S /D=" + $installDir',
    '  $result = Start-Process -FilePath $installer -ArgumentList $installArgs -Wait -PassThru -WindowStyle Hidden',
    '  if ($result.ExitCode -ne 0) { exit 4 }',
    '  if (-not (Test-Path -LiteralPath $oldExe -PathType Leaf)) { exit 5 }',
    '  Start-Process -FilePath $oldExe | Out-Null',
    '} finally {',
    '  Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue',
    '}'
  ].join('\r\n');
  const command = Buffer.from(script, 'utf16le').toString('base64');
  const worker = spawn('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden',
    '-EncodedCommand', command
  ], { detached: true, windowsHide: true, stdio: 'ignore' });
  if (!worker.pid) throw new Error('Could not start silent installer helper');
  worker.unref();
}

function readInstalledDeliveryVersion(resourcesPath) {
  const file = path.join(resourcesPath, 'auto-update-version.json');
  const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (metadata.family !== 'Dyclokpropio' || !VERSION_PATTERN.test(metadata.deliveryVersion)) {
    throw new Error('No release update channel configured for this build');
  }
  return metadata.deliveryVersion;
}

let checking = false;
async function runStartupUpdate(app) {
  if (checking || !app.isPackaged || process.platform !== 'win32' ||
      process.env.DYCLOKPROP_AUTO_UPDATE_DISABLED === '1') return;
  checking = true;
  let staged = null;
  let handedOff = false;
  try {
    const version = readInstalledDeliveryVersion(process.resourcesPath);
    const selected = selectLatestRelease(await fetchPublishedReleases(), version);
    if (!selected) return;
    const sumsText = await fetchText(selected.sums.browser_download_url, 16384);
    const sha256 = parseChecksum(sumsText, selected.installerName);
    if (selected.installer.digest && selected.installer.digest !== 'sha256:' + sha256) {
      throw new Error('GitHub asset digest differs from published checksum');
    }
    staged = await fsp.mkdtemp(path.join(os.tmpdir(), 'dyclokpropio-update-'));
    const installer = path.join(staged, selected.installerName);
    await downloadVerifiedInstaller(selected.installer.browser_download_url, installer, sha256);
    spawnSilentInstaller(installer, process.execPath, process.pid, staged);
    handedOff = true;
    // Close the existing app normally; the updater restarts the installed build.
    app.quit();
  } catch (error) {
    console.warn('[Dyclokpropio updater] La actualización no se pudo completar:', error.message);
  } finally {
    if (staged && !handedOff) {
      await fsp.rm(staged, { recursive: true, force: true }).catch(() => {});
    }
    checking = false;
  }
}

function scheduleStartupUpdate(app) {
  // Do not delay loading the original Electron runtime: its ready handlers must
  // be registered synchronously, even while the update check happens.
  app.whenReady().then(() => runStartupUpdate(app)).catch(error => {
    console.warn('[Dyclokpropio updater] No se pudo consultar GitHub:', error.message);
  });
}

module.exports = {
  compareVersions, selectLatestRelease, parseChecksum, assertGithubUrl,
  readInstalledDeliveryVersion, scheduleStartupUpdate
};

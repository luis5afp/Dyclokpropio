param(
  [Parameter(Mandatory=$true)]
  [ValidateScript({Test-Path -LiteralPath $_ -PathType Leaf})]
  [string] $ArchivoZipAntiguo,
  [string] $ZipVersionChromium
)
# Local Windows build. The authorized Chromium archive is only read on this PC.
# This script deliberately does NOT upload or publish proprietary binaries.
$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
function Check($last,[string]$what) {
  if($last -ne 0){throw ($what+' failed with exit code '+$last)}
}
function RunNode([string]$path,[switch]$apply) {
  $args1=@($path)
  if($apply){$args1+= '--apply'}
  & node @args1
  Check $LASTEXITCODE ('Node validation: '+$path)
}
$root=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sourceZip=(Resolve-Path -LiteralPath $ArchivoZipAntiguo).Path
$versionZip=$null
if($ZipVersionChromium){$versionZip=(Resolve-Path -LiteralPath $ZipVersionChromium -ErrorAction Stop).Path}
Push-Location $root
try{
  if(-not $IsWindows -and $PSVersionTable.PSVersion.Major -ge 6){
    throw 'The Chromium NSIS build must run on Windows x64'
  }
  foreach($command in @('node','npm','npx')){
    if(-not (Get-Command $command -ErrorAction SilentlyContinue)){
      throw ('Install Node.js + npm before building: '+$command)
    }
  }
  if(Test-Path -LiteralPath Chromium){
    throw 'Chromium already exists in source directory; refusing to overwrite'
  }
  Write-Host 'Step 1/7: Install verified Windows Electron build dependencies'
  & npm install --legacy-peer-deps
  Check $LASTEXITCODE 'npm install'
  Write-Host 'Step 2/7: Verify recovered rc4 baseline and original internal plugins'
  foreach($script in @(
    'tools/unpack-bundled-extension.js','tools/verify-build-assets.js',
    'tools/verify-original-plugin-isolation.js','tools/verify-bundled-extension.js',
    'tools/verify-safe-base.js','tools/verify-original-cache-ipc-registration.js',
    'tools/verify-cache-ipc-compatibility.js','tools/verify-startup-health.js',
    'tools/verify-bootstrap-diagnostics.js','tools/verify-extension-download-retry.js',
    'tools/verify-legacy-expansion-compat.js','tools/verify-expand-integrity-audit.js',
    'tools/verify-diagnostic-console.js','tools/verify-open-stage-diagnostics.js'
  )){RunNode $script}
  Write-Host 'Step 3/7: Apply checksum-guarded rc4 renderer diagnostics'
  foreach($script in @(
    'tools/apply-legacy-expand-check.js','tools/instrument-open-stages.js',
    'tools/instrument-params-merge.js','tools/install-diagnostic-panel.js',
    'tools/instrument-expand-integrity.js'
  )){RunNode $script -apply}
  Write-Host 'Step 4/7: Stage ALL original Chromium files from the authorized user ZIP'
  if($versionZip){
    & node tools/stage-full-chromium.js --archive $sourceZip --version-archive $versionZip
  }else{
    & node tools/stage-full-chromium.js --archive $sourceZip
  }
  Check $LASTEXITCODE 'stage complete original Chromium'
  & node tools/stage-full-chromium.js --verify-only
  Check $LASTEXITCODE 'verify local Chromium'
  Write-Host 'Step 5/7: Build native Electron/NSIS Windows installer'
  & npx electron-builder install-app-deps
  Check $LASTEXITCODE 'electron-builder install-app-deps'
  & npm run build:win -- --publish never
  Check $LASTEXITCODE 'build:win'
  Write-Host 'Step 6/7: Ensure no Chromium file was lost or changed in the installer'
  & node tools/verify-chromium-bundle.js release/win-unpacked
  Check $LASTEXITCODE 'verify full packaged Chromium'
  foreach($relative in @(
    'Dyclokpropio.exe','logo.ico','Chromium/Application/ginsbrowser.exe',
    'resources/app.asar','resources/plugins/.automa/manifest.json'
  )){
    if(-not (Test-Path -LiteralPath (Join-Path 'release/win-unpacked' $relative) -PathType Leaf)){
      throw ('Missing critical installer asset: '+$relative)
    }
  }
  Write-Host 'Step 7/7: Verify the original Electron cache IPC registration'
  $stamp=Get-Date
  $app=(Resolve-Path 'release/win-unpacked/Dyclokpropio.exe').Path
  $proc=Start-Process -FilePath $app -PassThru
  try{
    Start-Sleep -Seconds 22
    $results=@(Get-ChildItem -LiteralPath $env:APPDATA -File -Filter 'dyclok-startup-health.json' -Recurse -ErrorAction SilentlyContinue |
      Where-Object {$_.LastWriteTime -ge $stamp.AddSeconds(-5)} |
      Sort-Object LastWriteTime -Descending)
    if($results.Count -eq 0){throw 'No original Electron startup-health diagnostic'}
    $status=Get-Content -LiteralPath $results[0].FullName -Raw | ConvertFrom-Json
    if($status.electronReady -ne $true -or $status.originalCacheHandlerRegistered -ne $true){
      throw 'Original Electron/cache IPC startup regressed'
    }
    Write-Host 'PASS: native original cache IPC registered with complete Chromium packaged'
  }finally{
    $proc.Refresh()
    if(-not $proc.HasExited){Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue}
  }
  $built='release/Dyclokpropio_3.0.0_win_x64.exe'
  if(-not (Test-Path -LiteralPath $built -PathType Leaf)){throw 'NSIS installer missing'}
  $out='release-delivery'
  New-Item -ItemType Directory -Path $out -Force | Out-Null
  $name='Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe'
  $dst=Join-Path $out $name
  if(Test-Path -LiteralPath $dst){throw 'Existing complete installer cannot be overwritten'}
  Copy-Item -LiteralPath $built -Destination $dst
  $sha=(Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash.ToLowerInvariant()
  "$sha  $name" | Set-Content -LiteralPath (Join-Path $out 'SHA256SUMS-CHROMIUM-COMPLETO.txt') -Encoding ASCII
  @(
    'deliveryVersion=30.0.14-CHROMIUM-COMPLETO-PRUEBA',
    'source=rc4-verified-runtime',
    'completeChromiumBundled=true',
    'chromiumStagedFromUserOwnedArchive=true',
    ('separateChromiumVersionZipUsed=' + [bool]$versionZip),
    'nativeCacheIpcRegistered=true',
    'profile244OpenedOnUserPC=UNVERIFIED',
    'gostExeENOENT=NOT_YET_RESOLVED',
    'redistributionRights=NOT_ASSESSED'
  ) | Set-Content -LiteralPath (Join-Path $out 'TEST_STATUS-CHROMIUM-COMPLETO.txt') -Encoding ASCII
  Write-Host ('LOCAL_INSTALLER_READY: '+$name)
  Write-Host ('SHA256: '+$sha)
  Write-Host 'Do not publish publicly until redistribution permission for the vendor binaries is confirmed.'
}catch{
  Write-Error ('Chromium complete Windows build stopped: '+$_.Exception.Message)
  exit 1
}finally{Pop-Location}

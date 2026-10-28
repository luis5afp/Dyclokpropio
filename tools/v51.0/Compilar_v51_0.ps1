$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$payload = Join-Path $root 'payload'
$required = @('DICloak.exe','resources\app.asar','resources\app.asar.unpacked\dist\assets\index-C7Bw2kjt.js','resources\app.asar.unpacked\dist\assets\login-Ch9BezKr.js','Dyclokpro.ico')
foreach ($rel in $required) { if (-not (Test-Path (Join-Path $payload $rel))) { throw "Missing required file: $rel" } }
$node = Get-Command node -ErrorAction Stop
& node --check (Join-Path $payload 'resources\app.asar.unpacked\dist\assets\index-C7Bw2kjt.js')
if ($LASTEXITCODE -ne 0) { throw 'index syntax failure' }
& node --check (Join-Path $payload 'resources\app.asar.unpacked\dist\assets\login-Ch9BezKr.js')
if ($LASTEXITCODE -ne 0) { throw 'login syntax failure' }
$js = Get-Content (Join-Path $payload 'resources\app.asar.unpacked\dist\assets\index-C7Bw2kjt.js') -Raw
if (-not $js.Contains('t>=1000000000n&&t<100000000000n?t*1000n:t')) { throw 'Expected candidate token-expiry patch not detected' }
$nsis = @("${env:ProgramFiles(x86)}\NSIS\makensis.exe", "$env:ProgramFiles\NSIS\makensis.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nsis) { throw 'NSIS not found' }
& $nsis /V2 (Join-Path $root 'DyclokPRO_51.0.nsi')
if ($LASTEXITCODE -ne 0) { throw 'NSIS failed' }
Get-FileHash (Join-Path $root 'DyclokPRO_51.0_win_x64.exe') -Algorithm SHA256 | Format-List
Write-Warning 'UNVERIFIED installer; DO NOT publish before Windows functional tests'

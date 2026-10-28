$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$nsis = @("${env:ProgramFiles(x86)}\NSIS\makensis.exe", "$env:ProgramFiles\NSIS\makensis.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nsis) { throw 'Instale NSIS en Windows desde https://nsis.sourceforge.io/' }
if (-not (Test-Path '.\payload\DICloak.exe')) { throw 'Falta payload\DICloak.exe' }
if (-not (Test-Path '.\payload\resources\app.asar')) { throw 'Falta app.asar' }
if (-not (Test-Path '.\payload\Chromium\Application\ginsbrowser.exe')) { throw 'Falta navegador Chromium' }
& $nsis /V2 '.\DyclokPRO_50.9.nsi'
if ($LASTEXITCODE -ne 0) { throw 'Falló NSIS' }
Get-FileHash '.\DyclokPRO_50.9_win_x64.exe' -Algorithm SHA256
Write-Host 'No publicar sin verificar el login y los perfiles en Windows.'

param(
  [Parameter(Mandatory=$true)][string]$ArchivoZipAntiguo,
  [string]$ZipVersionChromium,
  [switch]$TengoPermisoRedistribucion
)
$ErrorActionPreference='Stop'
if(-not $TengoPermisoRedistribucion){
  throw 'Confirme que tiene derechos para redistribuir el motor con -TengoPermisoRedistribucion.'
}
if(-not (Get-Command gh -ErrorAction SilentlyContinue)){
  throw 'Instale GitHub CLI desde https://cli.github.com y ejecute gh auth login.'
}
& gh auth status
if($LASTEXITCODE -ne 0){throw 'Inicie sesion con gh auth login.'}
& gh release view v30.0.14 --repo luis5afp/Dyclokpropio 2>$null
if($LASTEXITCODE -eq 0){throw 'Ya existe v30.0.14; no se reemplazara.'}
$root=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$archive=(Resolve-Path -LiteralPath $ArchivoZipAntiguo).Path
if($ZipVersionChromium){
  $engine=(Resolve-Path -LiteralPath $ZipVersionChromium -ErrorAction Stop).Path
  & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'build-win-with-complete-chromium.ps1') -ArchivoZipAntiguo $archive -ZipVersionChromium $engine
}else{
  & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'build-win-with-complete-chromium.ps1') -ArchivoZipAntiguo $archive
}
if($LASTEXITCODE -ne 0){throw 'Compilacion completa de Chromium fallida: no se publico nada.'}
$dir=Join-Path $root 'release-delivery'
$files=@(
  'Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe',
  'SHA256SUMS-CHROMIUM-COMPLETO.txt',
  'TEST_STATUS-CHROMIUM-COMPLETO.txt'
)
$full=@()
foreach($file in $files){
  $dest=Join-Path $dir $file
  if(-not (Test-Path -LiteralPath $dest -PathType Leaf)){throw ('Archivo faltante: '+$file)}
  $full+=$dest
}
$sha=(Get-FileHash -LiteralPath $full[0] -Algorithm SHA256).Hash.ToLowerInvariant()
$sum=Get-Content -LiteralPath $full[1] -Raw
if(-not $sum.StartsWith($sha)){throw 'SHA256 del instalador no coincide'}
$state=Get-Content -LiteralPath $full[2] -Raw
if(-not $state.Contains('completeChromiumBundled=true') -or -not $state.Contains('nativeCacheIpcRegistered=true')){
  throw 'Fallo en control de Chromium completo o cache IPC; no se publicara.'
}
& gh release view v30.0.14 --repo luis5afp/Dyclokpropio 2>$null
if($LASTEXITCODE -eq 0){throw 'La release ya fue publicada por otro proceso.'}
$notes=@'
VERSIÓN DE PRUEBA v30.0.14 CON CHROMIUM COMPLETO.
Empaqueta el motor desde una fuente autorizada y verifica el SHA256 de
todos los archivos del motor y el registro del cache IPC original.

PENDIENTE: apertura visible de perfil 244 en PC real y posible ENOENT gost.exe.
Probar con copias de seguridad y en una instalacion separada.
'@
& gh release create v30.0.14 @full --repo luis5afp/Dyclokpropio --target 55844723d683ab9b9b314b42ff4ead4d0318093a --title 'Dyclokpropio v30.0.14 (PRUEBA - Chromium completo)' --notes $notes --prerelease --latest=false
if($LASTEXITCODE -ne 0){throw 'GitHub no pudo publicar el EXE'}
Write-Host 'RELEASE_V30_0_14_PUBLICADA=True'
Write-Host 'URL: https://github.com/luis5afp/Dyclokpropio/releases/tag/v30.0.14'

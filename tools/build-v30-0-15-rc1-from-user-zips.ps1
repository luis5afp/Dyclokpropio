# Dyclokpropio 30.0.15-rc1: compilacion LOCAL y experimental con Chromium 142.
# No borra perfiles ni publica binarios. Requiere el ZIP base completo.
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][ValidateScript({Test-Path -LiteralPath $_ -PathType Leaf})][string]$ChromiumBaseZip,
  [Parameter(Mandatory=$true)][ValidateScript({Test-Path -LiteralPath $_ -PathType Leaf})][string]$ChromiumVersionZip
)
$ErrorActionPreference='Stop'
$expectedVersion='142.0.7444.273'
$expectedSha='02ac2000010e709262394e59a2875a7efab34d5fdc8fa0886d8517c70a87f5ca'
$root=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$base=(Resolve-Path -LiteralPath $ChromiumBaseZip).Path
$version=(Resolve-Path -LiteralPath $ChromiumVersionZip).Path
if($base -eq $version){throw 'El ZIP base y el ZIP de version deben ser distintos'}
foreach($needed in @('tools/build-win-with-complete-chromium.ps1','tools/stage-full-chromium.js')){
  if(-not (Test-Path -LiteralPath (Join-Path $root $needed) -PathType Leaf)){throw ('Falta constructor necesario: '+$needed)}
}
$actualSha=(Get-FileHash -LiteralPath $version -Algorithm SHA256).Hash.ToLowerInvariant()
if($actualSha -ne $expectedSha){throw ('ZIP 142 distinto del recibido y revisado. SHA256='+$actualSha)}
Add-Type -AssemblyName 'System.IO.Compression' -ErrorAction Stop
Add-Type -AssemblyName 'System.IO.Compression.FileSystem' -ErrorAction Stop
$zip=[System.IO.Compression.ZipFile]::OpenRead($version)
try {
  $expectedNames=@('chrome.dll','chrome_elf.dll','resources.pak','icudtl.dat','v8_context_snapshot.bin')
  $seen=@{}
  foreach($entry in $zip.Entries){
    $name=$entry.FullName.Replace('\','/')
    if($name.StartsWith('/') -or $name -match '(^|/)\.\.?(/|$)' -or $name -match '^[a-zA-Z]:'){
      throw ('Ruta insegura en ZIP versionado: '+$name)
    }
    $id=$name.ToLowerInvariant()
    if($seen.ContainsKey($id)){throw ('Ruta repetida en ZIP versionado: '+$name)}
    $seen[$id]=$entry
  }
  foreach($needed in $expectedNames){
    $id=($expectedVersion+'/'+$needed).ToLowerInvariant()
    if(-not $seen.ContainsKey($id)){throw ('Falta componente Chromium: '+$id)}
  }
  if($seen[($expectedVersion+'/chrome.dll').ToLowerInvariant()].Length -ne 279044656){
    throw 'La DLL de Chromium tiene un tamano inesperado'
  }
  if($zip.Entries.Count -ne 277){throw 'Inventario ZIP versionado inesperado'}
}finally{$zip.Dispose()}
$out=Join-Path $root 'release-delivery'
$fileName='Dyclokpropio_30.0.15-rc1_CHROMIUM_142_PRUEBA_win_x64.exe'
$dest=Join-Path $out $fileName
if(Test-Path -LiteralPath $dest){throw ('No se sobrescriben versiones publicadas/locales: '+$dest)}
Write-Host 'ZIP Chromium 142: SHA256, inventario y archivos esenciales confirmados.'
Write-Host 'Validando e integrando el ZIP base (incluido ginsbrowser.exe)...'
& powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'tools/build-win-with-complete-chromium.ps1') -ArchivoZipAntiguo $base -ZipVersionChromium $version
if($LASTEXITCODE -ne 0){throw 'El constructor completo o sus pruebas Windows fallaron. No hay instalador nuevo.'}
$old=Join-Path $out 'Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe'
$oldStatus=Join-Path $out 'TEST_STATUS-CHROMIUM-COMPLETO.txt'
foreach($needed in @($old,$oldStatus)){
  if(-not (Test-Path -LiteralPath $needed -PathType Leaf)){throw ('Resultado de compilacion ausente: '+$needed)}
}
$status=Get-Content -LiteralPath $oldStatus -Raw
foreach($flag in @('completeChromiumBundled=true','nativeCacheIpcRegistered=true')){
  if(-not $status.Contains($flag)){throw ('Prueba del constructor sin evidencia: '+$flag)}
}
Copy-Item -LiteralPath $old -Destination $dest -ErrorAction Stop
$sha=(Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash.ToLowerInvariant()
($sha+'  '+$fileName) | Set-Content -LiteralPath (Join-Path $out 'SHA256SUMS-v30.0.15-rc1.txt') -Encoding ASCII
@(
  'deliveryVersion=30.0.15-rc1',
  'channel=EXPERIMENTAL_NO_ESTABLE',
  'internalCompatibilityVersion=3.0.0',
  'chromiumVersion=142.0.7444.273',
  ('versionZipSha256='+$expectedSha),
  'completeChromiumBundled=true',
  'nativeCacheIpcRegistered=true',
  'realProfileOpeningValidated=false',
  'gostExeENOENT=UNRESOLVED',
  'redistributionRights=NOT_VERIFIED',
  'publishedToGithub=false'
) | Set-Content -LiteralPath (Join-Path $out 'TEST_STATUS-v30.0.15-rc1.txt') -Encoding ASCII
Write-Host ('Instalador de PRUEBA compilado localmente: '+$dest)
Write-Host ('SHA256='+$sha)
Write-Host 'No esta publicado; probar perfiles reales antes de distribuir.'

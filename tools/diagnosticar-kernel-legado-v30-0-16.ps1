# Diagnostico de ubicacion del kernel nativo para la reconstruccion 2.8.17.
# SOLO LECTURA: no ejecuta Chromium, no consulta datos de perfiles, no toca sesiones.
# Compatible con Windows PowerShell 5.1.
[CmdletBinding()]
param([string]$ExePath)
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ExePath)) {
  Add-Type -AssemblyName System.Windows.Forms
  $dialog = New-Object System.Windows.Forms.OpenFileDialog
  $dialog.Title = 'Selecciona DICloak.exe de la VERSION INSTALADA 30.0.16-rc1'
  $dialog.Filter = 'Aplicacion instalada (DICloak.exe;Dyclokpropio.exe)|DICloak.exe;Dyclokpropio.exe|Ejecutables (*.exe)|*.exe'
  $dialog.CheckFileExists = $true
  if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
    Write-Host 'Cancelado. No se ha modificado nada.'; exit 0
  }
  $ExePath = $dialog.FileName
}
$exe = (Resolve-Path -LiteralPath $ExePath).Path
if ((Split-Path $exe -Leaf) -notin @('DICloak.exe','Dyclokpropio.exe')) {
  throw 'Debes seleccionar el ejecutable de la aplicacion INSTALADA, no el instalador de Descargas.'
}
$root = Split-Path $exe -Parent
$lines = New-Object 'System.Collections.Generic.List[string]'
function Add-Line([string]$text) { [void]$lines.Add($text); Write-Host $text }
function Exists([string]$relative,[string]$type='Leaf') {
  $file = Join-Path $root $relative
  return [bool](Test-Path -LiteralPath $file -PathType $type)
}
function Check([string]$relative,[string]$type='Leaf') {
  $exists = Exists $relative $type
  Add-Line (($relative + ' = ' + $(if($exists){'PRESENTE'}else{'AUSENTE'})))
  return $exists
}
Add-Line 'DYCLOK v30.0.16-rc1 - DIAGNOSTICO DE KERNEL (SOLO LECTURA)'
Add-Line ('Fecha_UTC='+(Get-Date).ToUniversalTime().ToString('o'))
Add-Line ('EJECUTABLE_INSTALADO='+(Split-Path $exe -Leaf))
Add-Line ('INSTALACION_EN_CARPETA_ARCHIVOS_PROGRAMA=' + ($root -match '(?i)\\program files( \(x86\))?\\'))
Add-Line ('RECURSOS_ASAR=' + $(if(Exists 'resources\app.asar'){'PRESENTE'}else{'AUSENTE'}))
Add-Line ('RECURSOS_ASAR_UNPACKED=' + $(if(Exists 'resources\app.asar.unpacked' 'Container'){'PRESENTE'}else{'AUSENTE'}))

$engine = Check 'Chromium\Application\ginsbrowser.exe'
$dll = Check 'Chromium\Application\142.0.7444.273\chrome.dll'
$manifest = Check 'Chromium\version.json'
[void](Check 'Chromium\ginsbrowser' 'Container')
[void](Check 'Chromium\Application\chrome_proxy.exe')
[void](Check 'plugins' 'Container')
[void](Check 'vendor' 'Container')

if ($engine) {
  try {
    $got = (Get-FileHash -LiteralPath (Join-Path $root 'Chromium\Application\ginsbrowser.exe') -Algorithm SHA256).Hash.ToLowerInvariant()
    Add-Line ('GINBROWSER_ORIGINAL_SHA256=' + $(if($got -eq '21c398f5c5771fca444114fd919e3656ef7ac3d62b2c0df330ea8a28ae307f26'){'COINCIDE'}else{'DIFERENTE'}))
  } catch { Add-Line 'GINBROWSER_ORIGINAL_SHA256=NO_CALCULADO' }
}
if ($dll) {
  try {
    $got = (Get-FileHash -LiteralPath (Join-Path $root 'Chromium\Application\142.0.7444.273\chrome.dll') -Algorithm SHA256).Hash.ToLowerInvariant()
    Add-Line ('CHROME_DLL_ORIGINAL_SHA256=' + $(if($got -eq 'f15100d61f86614c35172e9cc484f236f8a12f0746e562128d6e2a9aacef6f59'){'COINCIDE'}else{'DIFERENTE'}))
  } catch { Add-Line 'CHROME_DLL_ORIGINAL_SHA256=NO_CALCULADO' }
}
if ($manifest) {
  try {
    $obj = Get-Content -LiteralPath (Join-Path $root 'Chromium\version.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    $v = [string]$obj.main.version
    if ($v -match '^\d+[.]\d+[.]\d+$') { Add-Line ('VERSION_PAQUETE_CHROMIUM='+$v) }
    else { Add-Line 'VERSION_PAQUETE_CHROMIUM=FORMATO_NO_RECONOCIDO' }
  } catch { Add-Line 'VERSION_PAQUETE_CHROMIUM=ERROR_LECTURA_MANIFIESTO' }
}
$parent = Join-Path $root 'Chromium\Application'
if (Test-Path -LiteralPath $parent -PathType Container) {
  $versions = @(Get-ChildItem -LiteralPath $parent -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d+(\.\d+){3}$' } | Select-Object -ExpandProperty Name)
  Add-Line ('VERSIONES_CARPETAS_EN_APPLICATION='+$(if($versions.Count){$versions -join ','}else{'NINGUNA'}))
}
foreach ($alt in @('resources\Chromium\Application\ginsbrowser.exe','resources\app\Chromium\Application\ginsbrowser.exe')) {
  Add-Line ($alt+'='+$(if(Exists $alt){'PRESENTE'}else{'AUSENTE'}))
}
$native = @(Get-Process -Name 'ginsbrowser' -ErrorAction SilentlyContinue)
Add-Line ('PROCESOS_GINSBROWSER_ACTIVOS='+$native.Count)

if (-not ($engine -and $dll -and $manifest)) {
  Add-Line 'RESULTADO=RUNTIME_NATIVO_INCOMPLETO_EN_LA_RUTA_ESPERADA'
} else {
  Add-Line 'RESULTADO=BINARIOS_PRESENTES_REVISAR_MAPEO_KERNEL_VERSION_O_RUTAS_DE_APP'
}
$outBase = Join-Path $env:USERPROFILE 'Downloads'
if (-not (Test-Path -LiteralPath $outBase -PathType Container)) {
  $outBase = [Environment]::GetFolderPath('Desktop')
}
$out = Join-Path $outBase 'Dyclok_Informe_Kernel_30_0_16.txt'
[System.IO.File]::WriteAllLines($out,$lines.ToArray(),([System.Text.UTF8Encoding]::new($false)))
Write-Host ''
Write-Host ('Informe guardado: '+$out) -ForegroundColor Green
Write-Host 'Adjunta el informe. No contiene rutas privadas, cookies, contrasenas, ni IDs de perfiles.'

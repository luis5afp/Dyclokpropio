@echo off
setlocal DisableDelayedExpansion
title Dyclok - Comparador de carpetas de instalacion
set "DYCLOK_SELF=%~f0"
set "DYCLOK_ZIP_OLD=%~1"
set "DYCLOK_ZIP_NEW=%~2"
echo.
echo DYCLOK - COMPARACION SEGURA DE INSTALACIONES
echo Lee el indice de los ZIP, NO extrae archivos, NO cambia perfiles.
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$r=[IO.File]::ReadAllText($env:DYCLOK_SELF);$m='::==DYCLOK_PS_BEGIN==';$i=$r.LastIndexOf($m);if($i -lt 0){throw 'Falta el contenido del comparador'};& ([scriptblock]::Create($r.Substring($i+$m.Length)))"
set "DYCLOK_EXIT=%ERRORLEVEL%"
echo.
if not "%DYCLOK_EXIT%"=="0" echo Comparacion incompleta. Revise el mensaje anterior.
if not defined DYCLOK_CI pause
exit /b %DYCLOK_EXIT%
::==DYCLOK_PS_BEGIN==
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Choose-Zip([string]$preferred, [string]$filename, [string]$caption) {
  if ($preferred -and (Test-Path -LiteralPath $preferred -PathType Leaf)) {
    return (Resolve-Path -LiteralPath $preferred).Path
  }
  foreach ($dir in @((Split-Path -Parent $env:DYCLOK_SELF), (Join-Path $env:USERPROFILE 'Downloads'))) {
    if (-not $dir) { continue }
    $candidate = Join-Path $dir $filename
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
  }
  try {
    Add-Type -AssemblyName System.Windows.Forms
    $picker = New-Object System.Windows.Forms.OpenFileDialog
    $picker.Title = $caption
    $picker.Filter = 'Archivos ZIP (*.zip)|*.zip'
    $picker.Multiselect = $false
    if ($picker.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
      return $picker.FileName
    }
  } catch {
    Write-Host 'No fue posible abrir el selector de archivos.'
  }
  throw "No se selecciono $filename."
}

function Index-Zip([string]$fileName) {
  $archive = [System.IO.Compression.ZipFile]::OpenRead($fileName)
  try {
    $files = New-Object System.Collections.Generic.List[object]
    foreach ($entry in $archive.Entries) {
      $name = $entry.FullName.Replace('\','/').TrimStart('/')
      if (-not $name -or $name.EndsWith('/')) { continue }
      # No extract or read the file data. Only examine the ZIP central directory.
      $name = [regex]::Replace($name, '[\x00-\x1f\x7f]', '?')
      $files.Add([pscustomobject]@{Path=$name;Bytes=[long]$entry.Length;Packed=[long]$entry.CompressedLength})
    }
    # Discard a single enclosing directory such as DICloak/ or Dyclokpropio/.
    $firstSegments = @($files | ForEach-Object { ($_.Path -split '/')[0] } | Sort-Object -Unique)
    if ($firstSegments.Count -eq 1 -and $files.Count -gt 0) {
      $single = $firstSegments[0] + '/'
      $allInside = @($files | Where-Object { -not $_.Path.StartsWith($single, [System.StringComparison]::OrdinalIgnoreCase) })
      if ($allInside.Count -eq 0) {
        foreach ($item in $files) { $item.Path = $item.Path.Substring($single.Length) }
      }
    }
    $result = @{}
    $duplicates = 0
    foreach ($entry in $files) {
      if ($result.ContainsKey($entry.Path)) { $duplicates++; continue }
      $result[$entry.Path] = $entry
    }
    return [pscustomobject]@{Files=$result;DuplicatePaths=$duplicates;Count=$files.Count}
  } finally {
    $archive.Dispose()
  }
}

function Display-Bytes([long]$value) {
  return ('{0:N2} MB' -f ($value / 1MB))
}
function Add-Line([string]$line='') {
  [void]$script:report.Add($line)
}
function Format-File($item) {
  return ("{0}  [{1}]" -f $item.Path, (Display-Bytes $item.Bytes))
}
function Show-Group([string]$heading, $items, [int]$limit=400) {
  Add-Line ''
  Add-Line $heading
  Add-Line ('Cantidad total: ' + @($items).Count)
  $count = 0
  foreach ($item in @($items | Sort-Object -Property Path)) {
    if ($count -ge $limit) { break }
    Add-Line ('  ' + (Format-File $item))
    $count++
  }
  if (@($items).Count -gt $limit) { Add-Line ('  ... listado abreviado; ' + (@($items).Count - $limit) + ' entradas mas') }
}

try {
  $oldZip = Choose-Zip $env:DYCLOK_ZIP_OLD 'DICloak.zip' 'Seleccione DICloak.zip (2.8.17)'
  $newZip = Choose-Zip $env:DYCLOK_ZIP_NEW 'Dyclokpropio.zip' 'Seleccione Dyclokpropio.zip (30.0.13)'
  if ([string]::Equals($oldZip,$newZip,[System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Los dos ZIP son el mismo archivo.'
  }
  Write-Host ('Leyendo ZIP antiguo: ' + [IO.Path]::GetFileName($oldZip))
  $old = Index-Zip $oldZip
  Write-Host ('Leyendo ZIP nuevo:   ' + [IO.Path]::GetFileName($newZip))
  $new = Index-Zip $newZip

  $oldOnly = New-Object System.Collections.Generic.List[object]
  $newOnly = New-Object System.Collections.Generic.List[object]
  $sizeDiff = New-Object System.Collections.Generic.List[object]
  $common = 0
  foreach ($key in $old.Files.Keys) {
    if (-not $new.Files.ContainsKey($key)) {
      $oldOnly.Add($old.Files[$key])
    } else {
      $common++
      if ($old.Files[$key].Bytes -ne $new.Files[$key].Bytes) {
        $sizeDiff.Add([pscustomobject]@{
          Path=$key; Bytes=$old.Files[$key].Bytes;
          NewBytes=$new.Files[$key].Bytes
        })
      }
    }
  }
  foreach ($key in $new.Files.Keys) {
    if (-not $old.Files.ContainsKey($key)) { $newOnly.Add($new.Files[$key]) }
  }
  $critical = '(?i)(^|/)(ginsbrowser\.exe|gost\.exe|dicsyncservice\.exe|app\.asar|app\.asar\.unpacked|ffmpeg\.exe|chrome(_100|_200)_percent\.pak|resources\.pak|icudtl\.dat|v8_context_snapshot\.bin|snapshot_blob\.bin|libffmpeg\.dll|[^\s/]+\.(dll|node))$'
  $oldCritical = @($oldOnly | Where-Object { $_.Path -match $critical })
  $newCritical = @($newOnly | Where-Object { $_.Path -match $critical })
  $oldCore = @($old.Files.Values | Where-Object { $_.Path -match '(?i)(^|/)ginsbrowser\.exe$' })
  $newCore = @($new.Files.Values | Where-Object { $_.Path -match '(?i)(^|/)ginsbrowser\.exe$' })
  $script:report = New-Object System.Collections.Generic.List[string]
  Add-Line 'DYCLOK - COMPARACION DE ARCHIVOS DE INSTALACION'
  Add-Line ('Generado: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
  Add-Line 'FUENTE: indice de archivos de los ZIP, sin extraer ni ejecutar sus contenidos.'
  Add-Line 'IMPORTANTE: mismo tamano no significa mismo contenido. app.asar puede incluir muchos archivos.'
  Add-Line ''
  Add-Line ('Antigua: ' + [IO.Path]::GetFileName($oldZip))
  Add-Line ('Nueva:   ' + [IO.Path]::GetFileName($newZip))
  Add-Line ('Archivos antigua: ' + $old.Files.Count)
  Add-Line ('Archivos nueva:   ' + $new.Files.Count)
  Add-Line ('Rutas comunes:    ' + $common)
  Add-Line ('Solo antigua:    ' + $oldOnly.Count)
  Add-Line ('Solo nueva:      ' + $newOnly.Count)
  Add-Line ('Misma ruta, distinto tamano: ' + $sizeDiff.Count)
  Add-Line ('Duplicados interna antigua: ' + $old.DuplicatePaths)
  Add-Line ('Duplicados interna nueva:   ' + $new.DuplicatePaths)
  Add-Line ''
  Add-Line 'INDICADOR DE NUCLEO CHROMIUM (ginsbrowser.exe)'
  Add-Line ('Cantidad antigua: ' + $oldCore.Count)
  foreach ($entry in $oldCore) { Add-Line ('  ANTIGUA: ' + (Format-File $entry)) }
  Add-Line ('Cantidad nueva: ' + $newCore.Count)
  foreach ($entry in $newCore) { Add-Line ('  NUEVA: ' + (Format-File $entry)) }
  Add-Line 'No encontrar Chromium dentro del ZIP no demuestra que el arranque IPC falle por esa causa.'
  Show-Group 'EJECUTABLES/DLL/NATIVOS CRITICOS SOLO EN ANTIGUA' $oldCritical 500
  Show-Group 'EJECUTABLES/DLL/NATIVOS CRITICOS SOLO EN NUEVA' $newCritical 500
  Show-Group 'TODOS LOS ARCHIVOS SOLO EN ANTIGUA' $oldOnly 700
  Show-Group 'TODOS LOS ARCHIVOS SOLO EN NUEVA' $newOnly 700
  Add-Line ''
  Add-Line 'ARCHIVOS EN AMBAS, PERO CON TAMANO DIFERENTE'
  Add-Line ('Cantidad total: ' + $sizeDiff.Count)
  foreach ($entry in @($sizeDiff | Sort-Object -Property Path | Select-Object -First 600)) {
    Add-Line ('  ' + $entry.Path + ': antigua=' + (Display-Bytes $entry.Bytes) + ', nueva=' + (Display-Bytes $entry.NewBytes))
  }
  if ($sizeDiff.Count -gt 600) { Add-Line ('  ... ' + ($sizeDiff.Count - 600) + ' entradas mas') }
  Add-Line ''
  Add-Line 'NOTA DE SEGURIDAD: el informe enumera nombres relativos del ZIP, no lee cookies, perfiles, claves ni cuerpos de archivos.'
  $downloads = Join-Path $env:USERPROFILE 'Downloads'
  [void][IO.Directory]::CreateDirectory($downloads)
  $dest = Join-Path $downloads ('Dyclok_Comparacion_Instalaciones_' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.txt')
  [IO.File]::WriteAllLines($dest,$report,[System.Text.Encoding]::UTF8)
  Write-Host ''
  Write-Host 'INFORME GUARDADO CORRECTAMENTE:'
  Write-Host $dest
  Write-Host ('Solo en antigua: ' + $oldOnly.Count + '; solo en nueva: ' + $newOnly.Count)
  Write-Host 'Envie solamente este TXT para el analisis, no copias de perfiles.'
} catch {
  Write-Host ('ERROR: ' + $_.Exception.Message)
  exit 1
}

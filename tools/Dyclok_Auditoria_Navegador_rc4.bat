@echo off
setlocal EnableExtensions
title Dyclokpropio - Auditoria de Chromium rc4
set "DYCLOK_AUDIT_FILE=%~f0"
echo.
echo   DYCLOKPROPIO - AUDITORIA LOCAL DE NAVEGADOR
echo   Solo lectura. No modifica perfiles, cache ni instalaciones.
echo.
powershell.exe -NoLogo -NoProfile -STA -ExecutionPolicy Bypass -Command "$s=[System.IO.File]::ReadAllText($env:DYCLOK_AUDIT_FILE); $m=':__DYCLOK_AUDIT_PS__'; $i=$s.LastIndexOf($m); if($i -lt 0){throw 'Missing embedded script'}; & ([ScriptBlock]::Create($s.Substring($i+$m.Length)))"
set "_DYCLOK_EXIT=%ERRORLEVEL%"
echo.
if not "%_DYCLOK_EXIT%"=="0" echo ERROR: la auditoria no termino correctamente. Codigo %_DYCLOK_EXIT%
echo Pulse una tecla para salir.
pause >nul
exit /b %_DYCLOK_EXIT%
:__DYCLOK_AUDIT_PS__
$ErrorActionPreference = 'Stop'
try {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.Application]::EnableVisualStyles()

  function Select-Exe([string]$title, [string]$filter) {
    $dlg = New-Object System.Windows.Forms.OpenFileDialog
    $dlg.Title = $title
    $dlg.Filter = $filter
    $dlg.CheckFileExists = $true
    if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
      return $dlg.FileName
    }
    return $null
  }
  $exe = Select-Exe 'Seleccione Dyclokpropio.exe de v30.0.14-rc4' 'Dyclokpropio.exe|Dyclokpropio.exe|Aplicaciones Windows (*.exe)|*.exe'
  if (-not $exe) { Write-Host 'Cancelado. No se modifico nada.'; return }
  if ([IO.Path]::GetFileName($exe) -ine 'Dyclokpropio.exe') {
    throw 'Debe seleccionar el ejecutable Dyclokpropio.exe actualizado.'
  }
  $root = [IO.Path]::GetDirectoryName($exe)
  $lines = New-Object 'System.Collections.Generic.List[string]'
  function Log([string]$t) {
    [void]$lines.Add($t)
    Write-Host $t
  }
  Log 'DYCLOKPROPIO - AUDITORIA DEL NAVEGADOR (SOLO LECTURA)'
  Log ('Fecha local: ' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
  Log 'No contiene rutas absolutas, URLs, cookies, tokens, lineas de comando ni datos de perfiles.'
  Log 'No identifica con certeza el origen de navegadores de otras instalaciones.'
  Log ('Version Windows: ' + [Environment]::OSVersion.Version.ToString())
  $exeItem = Get-Item -LiteralPath $exe
  Log ('EJECUTABLE_NUEVO: existe, bytes=' + $exeItem.Length)
  $appRoot = Join-Path $root 'Chromium\Application'
  $engine = Join-Path $appRoot 'ginsbrowser.exe'
  $kernelPresent = Test-Path -LiteralPath $engine -PathType Leaf
  Log ('NUEVO_GINSBROWSER_PRESENTE=' + $kernelPresent)
  $versionDirs = @()
  if (Test-Path -LiteralPath $appRoot -PathType Container) {
    $versionDirs = @(Get-ChildItem -LiteralPath $appRoot -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } | Sort-Object Name)
  }
  Log ('NUEVO_CARPETAS_VERSION_CHROMIUM=' + $versionDirs.Count)
  foreach ($v in $versionDirs) {
    $dll = Join-Path $v.FullName 'chrome.dll'
    $pak = Join-Path $v.FullName 'resources.pak'
    $snapshot = Join-Path $v.FullName 'v8_context_snapshot.bin'
    Log ('NUEVO_KERNEL version=' + $v.Name +
      ' chrome.dll=' + (Test-Path -LiteralPath $dll -PathType Leaf) +
      ' resources.pak=' + (Test-Path -LiteralPath $pak -PathType Leaf) +
      ' snapshot=' + (Test-Path -LiteralPath $snapshot -PathType Leaf))
  }

  Write-Host ''
  Write-Host 'Opcional: seleccione DICloak.exe ANTIGUO para comparar solo el motor.'
  Write-Host 'Puede cancelar esta segunda ventana; no se copiara ningun archivo.'
  $oldExe = Select-Exe 'Opcional: seleccionar DICloak.exe antiguo, o cancelar' 'DICloak.exe|DICloak.exe|Aplicaciones Windows (*.exe)|*.exe'
  if ($oldExe) {
    if ([IO.Path]::GetFileName($oldExe) -ine 'DICloak.exe') { throw 'Seleccione DICloak.exe antiguo o cancele.' }
    $oldRoot = [IO.Path]::GetDirectoryName($oldExe)
    $oldApp = Join-Path $oldRoot 'Chromium\Application'
    Log ('ANTIGUO_GINSBROWSER_PRESENTE=' + (Test-Path -LiteralPath (Join-Path $oldApp 'ginsbrowser.exe') -PathType Leaf))
    $oldVersions = @()
    if (Test-Path -LiteralPath $oldApp -PathType Container) {
      $oldVersions = @(Get-ChildItem -LiteralPath $oldApp -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' })
    }
    Log ('ANTIGUO_CARPETAS_VERSION_CHROMIUM=' + $oldVersions.Count)
    foreach ($v in $oldVersions) {
      Log ('ANTIGUO_KERNEL version=' + $v.Name +
        ' chrome.dll=' + (Test-Path -LiteralPath (Join-Path $v.FullName 'chrome.dll') -PathType Leaf))
    }
  } else { Log 'ANTIGUO_NO_SELECCIONADO' }

  function Snapshot {
    # ProcessName / PID / visible main window only. Never gather command lines.
    @(Get-Process -Name 'ginsbrowser','chrome','chromium','msedge' -ErrorAction SilentlyContinue |
      ForEach-Object {
        [pscustomobject]@{
          name = $_.ProcessName.ToLowerInvariant()
          pid = [int]$_.Id
          visible = ($_.MainWindowHandle -ne [IntPtr]::Zero)
        }
      })
  }
  $before = @(Snapshot)
  Log ('ANTES_PROCESOS_CANDIDATOS=' + $before.Count)
  Log ('ANTES_VENTANAS_CANDIDATAS=' + @($before | Where-Object {$_.visible}).Count)
  Log ('ANTES_DYCLOK_EXE=' + @(Get-Process -Name Dyclokpropio -ErrorAction SilentlyContinue).Count)
  Log ('ANTES_DICLOAK_EXE=' + @(Get-Process -Name DICloak -ErrorAction SilentlyContinue).Count)
  Write-Host ''
  Write-Host 'En Dyclokpropio: cierre el perfil 244 si muestra Cerrar.'
  Write-Host 'Pulse ENTER aqui JUSTO ANTES de pulsar Abrir en el perfil 244.'
  [void][Console]::ReadLine()
  $watchStart = Get-Date
  $seen = @{}
  $gone = New-Object 'System.Collections.Generic.HashSet[int]'
  $initialIds = @{}
  foreach ($p in $before) { $initialIds[$p.pid] = $true }
  $last = @()
  for ($tick = 0; $tick -lt 40; $tick++) {
    $current = @(Snapshot)
    foreach ($p in $current) {
      if (-not $seen.ContainsKey($p.pid)) {
        $seen[$p.pid] = @{name=$p.name;visible=$p.visible;existing=$initialIds.ContainsKey($p.pid)}
      }
      if ($p.visible) {$seen[$p.pid].visible=$true}
    }
    foreach ($k in @($seen.Keys)) {
      if (-not @($current | Where-Object {$_.pid -eq $k}).Count) {[void]$gone.Add([int]$k)}
    }
    $last = $current
    Start-Sleep -Milliseconds 750
  }
  Log ('MONITOREO_DESDE=' + $watchStart.ToString('HH:mm:ss'))
  Log ('MONITOREO_HASTA=' + (Get-Date).ToString('HH:mm:ss'))
  Log ('DESPUES_PROCESOS_CANDIDATOS=' + $last.Count)
  Log ('DESPUES_VENTANAS_CANDIDATAS=' + @($last | Where-Object {$_.visible}).Count)
  foreach ($name in @('ginsbrowser','chrome','chromium','msedge')) {
    $arr = @($seen.Values | Where-Object {$_.name -eq $name})
    $fresh = @($arr | Where-Object {-not $_.existing})
    Log ('OBSERVADO_'+$name.ToUpperInvariant()+'_PROCESOS_NUEVOS=' + $fresh.Count)
    Log ('OBSERVADO_'+$name.ToUpperInvariant()+'_CON_VENTANA=' + @($fresh | Where-Object {$_.visible}).Count)
  }
  Log ('PROCESOS_OBSERVADOS_QUE_DESAPARECIERON=' + $gone.Count)
  Log ('DESPUES_DYCLOK_EXE=' + @(Get-Process -Name Dyclokpropio -ErrorAction SilentlyContinue).Count)
  Log ('DESPUES_DICLOAK_EXE=' + @(Get-Process -Name DICloak -ErrorAction SilentlyContinue).Count)
  if (-not $kernelPresent -and $versionDirs.Count -eq 0) {
    Log 'INTERPRETACION: faltan archivos del nucleo Chromium JUNTO AL EXE nuevo. Verificar si se usa un nucleo en otra ruta.'
  }
  if (@($seen.Values | Where-Object {-not $_.existing}).Count -eq 0) {
    Log 'INTERPRETACION: no se observaron procesos de navegador nuevos. Un proceso muy breve podria escapar al sondeo.'
  }
  Log 'El estado Cerrar en la interfaz NO comprueba por si solo la existencia de una ventana nativa.'
  $dir = Join-Path $env:USERPROFILE 'Downloads'
  if (-not (Test-Path -LiteralPath $dir -PathType Container)) {$dir = [Environment]::GetFolderPath('Desktop')}
  $dest = Join-Path $dir ('Dyclok-Auditoria-Chromium-' + (Get-Date).ToString('yyyyMMdd-HHmmss') + '.txt')
  [IO.File]::WriteAllLines($dest, $lines.ToArray(), [Text.UTF8Encoding]::new($false))
  Write-Host ''
  Write-Host 'INFORME creado en Descargas (o Escritorio):'
  Write-Host ([IO.Path]::GetFileName($dest))
  Write-Host 'Suba el TXT a ChatGPT. No cambie ni copie perfiles durante la prueba.'
} catch {
  Write-Host ('ERROR_DEL_AUDITOR=' + $_.Exception.GetType().Name)
  Write-Host 'No se modifico ningun perfil o instalacion.'
  exit 1
}

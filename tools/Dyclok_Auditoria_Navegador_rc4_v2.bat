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
  Log 'DYCLOKPROPIO - AUDITORIA DEL NAVEGADOR V2 (SOLO LECTURA)'
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
  $oldRoot = $null
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

  function WithinFolder([string]$candidate, [string]$base) {
    if (-not $candidate -or -not $base) { return $false }
    try {
      $full = [IO.Path]::GetFullPath($candidate)
      $folder = [IO.Path]::GetFullPath($base).TrimEnd('\\') + '\\'
      return $full.StartsWith($folder, [StringComparison]::OrdinalIgnoreCase)
    } catch { return $false }
  }
  function Origin([string]$candidate) {
    if (-not $candidate) {return 'unknown'}
    if (WithinFolder $candidate $root) {return 'new-install'}
    if ($oldRoot -and (WithinFolder $candidate $oldRoot)) {return 'old-install'}
    if (WithinFolder $candidate $env:LOCALAPPDATA) {return 'local-appdata'}
    if (WithinFolder $candidate $env:APPDATA) {return 'roaming-appdata'}
    if (WithinFolder $candidate $env:ProgramFiles) {return 'program-files'}
    if (WithinFolder $candidate ${env:ProgramFiles(x86)}) {return 'program-files-x86'}
    return 'other'
  }
  $allProcessesSupported = $true
  function Snapshot {
    $names = @('ginsbrowser.exe','chrome.exe','chromium.exe','msedge.exe')
    try {
      $all = @(Get-CimInstance -ClassName Win32_Process -ErrorAction Stop)
    } catch {
      $script:allProcessesSupported=$false
      $all=@()
    }
    $byPid=@{}
    foreach($p in $all){$byPid[[int]$p.ProcessId]=$p}
    $visibleIds=@{}
    foreach($p in @(Get-Process -Name 'ginsbrowser','chrome','chromium','msedge' -ErrorAction SilentlyContinue)){
      if($p.MainWindowHandle -ne [IntPtr]::Zero){$visibleIds[[int]$p.Id]=$true}
    }
    $result=@()
    foreach($p in $all){
      if($names -notcontains $p.Name.ToLowerInvariant()){continue}
      $linked=$false
      $cursor=$p
      $visited=@{}
      for($n=0;$n -lt 12;$n++){
        if($null -eq $cursor){break}
        $id=[int]$cursor.ProcessId
        if($visited.ContainsKey($id)){break}
        $visited[$id]=$true
        if($cursor.Name -ieq 'Dyclokpropio.exe' -and
           $cursor.ExecutablePath -and
           [string]::Equals($cursor.ExecutablePath,$exe,[StringComparison]::OrdinalIgnoreCase)){
          $linked=$true
          break
        }
        $ppid=[int]$cursor.ParentProcessId
        if($ppid -le 0 -or -not $byPid.ContainsKey($ppid)){break}
        $cursor=$byPid[$ppid]
      }
      $result+= [pscustomobject]@{
        name=$p.Name.Substring(0,$p.Name.Length-4).ToLowerInvariant()
        pid=[int]$p.ProcessId
        visible=$visibleIds.ContainsKey([int]$p.ProcessId)
        origin=(Origin ([string]$p.ExecutablePath))
        linked=$linked
      }
    }
    return @($result)
  }
  $before = @(Snapshot)
  Log ('WMI_PROCESS_INFO_DISPONIBLE=' + $allProcessesSupported)
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
        $seen[$p.pid] = @{name=$p.name;visible=$p.visible;existing=$initialIds.ContainsKey($p.pid);origin=$p.origin;linked=$p.linked}
      }
      if ($p.visible) {$seen[$p.pid].visible=$true}
      if ($p.linked) {$seen[$p.pid].linked=$true}
      if ($seen[$p.pid].origin -eq 'unknown' -and $p.origin -ne 'unknown') {$seen[$p.pid].origin=$p.origin}
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
  foreach ($name in @('ginsbrowser','chrome','chromium','msedge')) {
    $fresh = @($seen.Values | Where-Object {$_.name -eq $name -and -not $_.existing})
    Log ('PROCESOS_NUEVOS_'+$name.ToUpperInvariant()+'_DESCENDIENTES_DE_DYCLOK=' + @($fresh | Where-Object {$_.linked}).Count)
    foreach ($area in @('new-install','old-install','local-appdata','roaming-appdata','program-files','program-files-x86','other','unknown')) {
      $num = @($fresh | Where-Object {$_.origin -eq $area}).Count
      if($num){Log ('PROCESOS_NUEVOS_'+$name.ToUpperInvariant()+'_ORIGEN_'+$area+'='+$num)}
    }
  }
  Log ('DESPUES_DYCLOK_EXE=' + @(Get-Process -Name Dyclokpropio -ErrorAction SilentlyContinue).Count)
  Log ('DESPUES_DICLOAK_EXE=' + @(Get-Process -Name DICloak -ErrorAction SilentlyContinue).Count)
  if (-not $kernelPresent -and $versionDirs.Count -eq 0) {
    Log 'INTERPRETACION: faltan archivos del nucleo Chromium JUNTO AL EXE nuevo. Verificar si se usa un nucleo en otra ruta.'
  }
  if (@($seen.Values | Where-Object {-not $_.existing}).Count -eq 0) {
    Log 'INTERPRETACION: no se observaron procesos de navegador nuevos. Un proceso muy breve podria escapar al sondeo.'
  }
  Log 'Descendiente = proceso con antecesor Dyclokpropio.exe seleccionado; no indica por si solo que la ventana se haya creado.'
  Log 'Origen = categoria de ubicacion, sin revelar rutas completas ni lineas de comandos.'
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

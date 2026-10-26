@echo off
setlocal EnableExtensions
title Dyclokpropio - Recuperar Chromium propio 2.8.17
set "DYCLOK_RESTORE_SELF=%~f0"
echo.
echo  DYCLOKPROPIO - RECUPERAR MOTOR CHROMIUM DE SU COPIA ANTIGUA
echo  SOLO copia Chromium/Application; NO cambia perfiles ni hash de extensiones.
echo  Seleccione su archivo DICloak.zip y la instalacion nueva Dyclokpropio.exe.
echo.
powershell.exe -NoProfile -NoLogo -STA -ExecutionPolicy Bypass -Command "$raw=[IO.File]::ReadAllText($env:DYCLOK_RESTORE_SELF);$tag=':__DYCLOK_KERNEL_PS__';$idx=$raw.LastIndexOf($tag);if($idx -lt 0){throw 'Embedded script missing'};& ([ScriptBlock]::Create($raw.Substring($idx+$tag.Length)))"
set "_RESULT=%ERRORLEVEL%"
echo.
if not "%_RESULT%"=="0" echo  No se completo la restauracion. Codigo: %_RESULT%.
echo  Pulse una tecla para terminar.
pause >nul
exit /b %_RESULT%
:__DYCLOK_KERNEL_PS__
$ErrorActionPreference = 'Stop'
$archive = $null
$stage = $null
$committed = $false
$report = New-Object 'System.Collections.Generic.List[string]'
function Note([string]$text) {
  $null=$report.Add($text)
  Write-Host $text
}
function Pick([string]$title,[string]$filter) {
  $dlg=New-Object System.Windows.Forms.OpenFileDialog
  $dlg.Title=$title
  $dlg.Filter=$filter
  $dlg.CheckFileExists=$true
  if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){return $null}
  return $dlg.FileName
}
function Record([string]$status){
  $folder=Join-Path $env:USERPROFILE 'Downloads'
  if(-not [IO.Directory]::Exists($folder)){
    $folder=[Environment]::GetFolderPath('Desktop')
  }
  $dest=Join-Path $folder ('Dyclok-Restaurar-Chromium-'+(Get-Date).ToString('yyyyMMdd-HHmmss')+'.txt')
  $null=$report.Add(('RESULTADO='+$status))
  [IO.File]::WriteAllLines($dest,$report.ToArray(),(New-Object Text.UTF8Encoding($false)))
  Write-Host ('Informe guardado: '+[IO.Path]::GetFileName($dest))
}
try {
  Add-Type -AssemblyName System.Windows.Forms
  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.Windows.Forms.Application]::EnableVisualStyles()

  Note 'DYCLOK - RESTAURACION CONTROLADA DEL NUCLEO CHROMIUM ORIGINAL'
  Note 'Solo componentes originales Chromium; no perfiles, cookies, extensiones ni archivos ASAR.'
  $zip = Pick 'Seleccione SU DICloak.zip original (2.8.17)' 'Archivos ZIP (*.zip)|*.zip'
  if(-not $zip){Note 'CANCELADO_ARCHIVO_ORIGINAL';return}
  $exe = Pick 'Seleccione Dyclokpropio.exe de v30.0.14-rc4' 'Dyclokpropio.exe|Dyclokpropio.exe|Aplicaciones (*.exe)|*.exe'
  if(-not $exe){Note 'CANCELADO_EJECUTABLE_NUEVO';return}
  if([IO.Path]::GetFileName($exe) -ine 'Dyclokpropio.exe'){
    throw (New-Object System.InvalidOperationException('NOT_DYCLOKPROP_IO_EXE'))
  }
  $root=[IO.Path]::GetDirectoryName($exe)
  if(-not (Test-Path -LiteralPath (Join-Path $root 'resources\app.asar') -PathType Leaf)){
    throw (New-Object System.InvalidOperationException('NOT_PACKAGED_DYCLOK'))
  }
  $target=Join-Path $root 'Chromium'
  if(Test-Path -LiteralPath $target) {
    throw (New-Object System.InvalidOperationException('TARGET_CHROMIUM_ALREADY_EXISTS'))
  }

  $archive=[IO.Compression.ZipFile]::OpenRead($zip)
  $prefix='Chromium/'
  $entries=@($archive.Entries | Where-Object {
    $_.FullName.StartsWith($prefix,[StringComparison]::OrdinalIgnoreCase) -and
    -not $_.FullName.EndsWith('/')
  })
  if($entries.Count -lt 40 -or $entries.Count -gt 5000){
    throw (New-Object System.InvalidOperationException('CHROMIUM_FILE_COUNT_INVALID'))
  }
  $required=@('Chromium/Application/ginsbrowser.exe')
  $ver=@($entries | Where-Object {$_.FullName -match '^Chromium/Application/(\d+\.\d+\.\d+\.\d+)/chrome\.dll$'})
  if($ver.Count -ne 1){
    throw (New-Object System.InvalidOperationException('NO_SINGLE_VERSIONED_CHROME_DLL'))
  }
  $kernelVer=[regex]::Match($ver[0].FullName,'^Chromium/Application/([^/]+)/chrome\.dll$').Groups[1].Value
  foreach($relative in @('icudtl.dat','resources.pak','v8_context_snapshot.bin')){
    $required+=('Chromium/Application/'+$kernelVer+'/'+$relative)
  }
  foreach($name in $required) {
    if(-not @($entries|Where-Object{$_.FullName -ieq $name}).Count) {
      throw (New-Object System.InvalidOperationException('REQUIRED_CHROMIUM_COMPONENT_MISSING'))
    }
  }
  $total=[long]0
  $used=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
  foreach($entry in $entries){
    $name=$entry.FullName.Replace('\','/')
    if($name -match '(^|/)\.\.(/|$)' -or
       $name -match '[\x00-\x1f:]' -or
       $name -notmatch '^Chromium/Application/[A-Za-z0-9._/@()+ -]+(?:/[A-Za-z0-9._/@()+ -]+)*$'){
      throw (New-Object System.InvalidOperationException('UNSAFE_ARCHIVE_ENTRY'))
    }
    if(-not $used.Add($name)){throw (New-Object System.InvalidOperationException('DUPLICATE_ARCHIVE_PATH'))}
    $total+=[long]$entry.Length
    if($total -gt 3000000000){throw (New-Object System.InvalidOperationException('ARCHIVE_EXCEEDS_LIMIT'))}
  }
  Note ('ARCHIVO_CHROMIUM_VALIDADO=True')
  Note ('VERSION_NUCLEO='+$kernelVer)
  Note ('ARCHIVOS_CHROMIUM='+$entries.Count)
  Note ('BYTES_SIN_COMPRIMIR='+$total)
  $archiveHash=(Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant()
  Note ('SHA256_ZIP_ORIGINAL='+$archiveHash)
  $text='Se instalara SOLO la carpeta Chromium/Application desde el ZIP seleccionado.'+
    [Environment]::NewLine+'No se sobrescribiran archivos existentes.'+
    [Environment]::NewLine+'No se cambiaran datos de perfiles ni comprobaciones de seguridad.'+
    [Environment]::NewLine+'Version de nucleo: '+$kernelVer+
    [Environment]::NewLine+[Environment]::NewLine+'Continuar?'
  $answer=[System.Windows.Forms.MessageBox]::Show($text,'Confirmar restauracion Chromium',
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Question)
  if($answer -ne [System.Windows.Forms.DialogResult]::Yes){
    Note 'CANCELADO_POR_EL_USUARIO'
    return
  }

  $stage=Join-Path $root ('._dyclok_chromium_staging_'+[guid]::NewGuid().ToString('N'))
  [IO.Directory]::CreateDirectory($stage)|Out-Null
  $stageFull=[IO.Path]::GetFullPath($stage).TrimEnd('\')+'\'
  $copied=0
  foreach($entry in $entries) {
    $relative=$entry.FullName.Substring($prefix.Length).Replace('/','\')
    $dest=[IO.Path]::GetFullPath((Join-Path $stage $relative))
    if(-not $dest.StartsWith($stageFull,[StringComparison]::OrdinalIgnoreCase)){
      throw (New-Object System.InvalidOperationException('ARCHIVE_PATH_ESCAPE'))
    }
    [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($dest))|Out-Null
    $input=$null
    $output=$null
    try {
      $input=$entry.Open()
      $output=New-Object IO.FileStream($dest,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write)
      $input.CopyTo($output)
    } finally {
      if($null -ne $output){$output.Dispose()}
      if($null -ne $input){$input.Dispose()}
    }
    if((Get-Item -LiteralPath $dest).Length -ne $entry.Length) {
      throw (New-Object System.IO.InvalidDataException('MISMATCH_IN_EXTRACTED_SIZE'))
    }
    $copied++
  }
  $stagedExe=Join-Path $stage 'Application\ginsbrowser.exe'
  $stagedDll=Join-Path (Join-Path $stage ('Application\'+$kernelVer)) 'chrome.dll'
  foreach($file in @($stagedExe,$stagedDll)){
    if(-not (Test-Path -LiteralPath $file -PathType Leaf)){
      throw (New-Object System.InvalidOperationException('REQUIRED_BINARY_NOT_STAGED'))
    }
  }
  $exeSHA=(Get-FileHash -LiteralPath $stagedExe -Algorithm SHA256).Hash.ToLowerInvariant()
  $dllSHA=(Get-FileHash -LiteralPath $stagedDll -Algorithm SHA256).Hash.ToLowerInvariant()
  Note ('SHA256_GINSBROWSER='+$exeSHA)
  Note ('SHA256_CHROME_DLL='+$dllSHA)
  if(Test-Path -LiteralPath $target){
    throw (New-Object System.InvalidOperationException('TARGET_APPEARED_DURING_EXTRACTION'))
  }
  [IO.Directory]::Move($stage,$target)
  $committed=$true
  Note ('COPIED_CHROMIUM_FILES='+$copied)
  Note ('CHROMIUM_INSTALLED=True')
  Note ('NUEVO_GINSBROWSER_PRESENTE='+(Test-Path -LiteralPath (Join-Path $target 'Application\ginsbrowser.exe')))
  Note ('NO_SE_MODIFICARON_PERFILES=True')
  Note 'SIGUIENTE_PASO: cierre Dyclokpropio por completo, reinicie y pruebe el perfil 244 una sola vez.'
  Note 'ESTA PRUEBA NO GARANTIZA QUE EL LAUNCHER USE ESTA UBICACION NI QUE CHROMIUM ABRA.'
  Record 'SUCCESS'
} catch {
  $kind=$_.Exception.GetType().Name
  $known='UNKNOWN'
  $message=[string]$_.Exception.Message
  if($message -in @('NOT_DYCLOKPROP_IO_EXE','NOT_PACKAGED_DYCLOK',
    'TARGET_CHROMIUM_ALREADY_EXISTS','CHROMIUM_FILE_COUNT_INVALID',
    'NO_SINGLE_VERSIONED_CHROME_DLL','REQUIRED_CHROMIUM_COMPONENT_MISSING',
    'UNSAFE_ARCHIVE_ENTRY','DUPLICATE_ARCHIVE_PATH','ARCHIVE_EXCEEDS_LIMIT',
    'ARCHIVE_PATH_ESCAPE','MISMATCH_IN_EXTRACTED_SIZE','REQUIRED_BINARY_NOT_STAGED',
    'TARGET_APPEARED_DURING_EXTRACTION')){$known=$message}
  if($kind -in @('UnauthorizedAccessException','SecurityException')){$known='NO_WRITE_PERMISSION'}
  Note ('ERROR_CLASS='+$kind)
  Note ('ERROR_CATEGORY='+$known)
  Note 'No se cambiaron perfiles. Si falla por permisos, es necesario acceso a la carpeta de instalacion.'
  try {Record 'FAIL'} catch {}
  exit 1
} finally {
  if($null -ne $archive){$archive.Dispose()}
  if(-not $committed -and $stage -and (Test-Path -LiteralPath $stage)){
    # Only remove the uniquely named staging folder created by this tool.
    [IO.Directory]::Delete($stage,$true)
  }
}

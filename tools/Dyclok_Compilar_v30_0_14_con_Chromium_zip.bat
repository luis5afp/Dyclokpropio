@echo off
setlocal EnableExtensions DisableDelayedExpansion
title Dyclokpropio v30.0.14 - Compilar con Chromium completo
set "DYCLOK_BUILD_BAT=%~f0"
echo.
echo   Dyclokpropio v30.0.14 - COMPILADOR LOCAL
echo   Usa Chromium.zip de SU equipo y conserva la instalacion existente.
echo   Necesita Git, Node.js y npm instalados.
echo.
powershell.exe -NoLogo -NoProfile -STA -ExecutionPolicy Bypass -Command "$f=[IO.File]::ReadAllText($env:DYCLOK_BUILD_BAT);$m=':__DYCLOK_BUILD_PS__';$i=$f.LastIndexOf($m);if($i -lt 0){throw 'Script marker missing'};& ([ScriptBlock]::Create($f.Substring($i+$m.Length)))"
set "DYCLOK_RETURN=%ERRORLEVEL%"
echo.
if not "%DYCLOK_RETURN%"=="0" echo Compilacion no completada. Codigo: %DYCLOK_RETURN%
echo Pulse una tecla para salir.
pause >nul
exit /b %DYCLOK_RETURN%
:__DYCLOK_BUILD_PS__
$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
$transcript=$false
function Report([string]$message){
  Write-Host $message
}
try{
  Add-Type -AssemblyName System.Windows.Forms
  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.Windows.Forms.Application]::EnableVisualStyles()
  $dlg=New-Object System.Windows.Forms.OpenFileDialog
  $dlg.Title='Selecciona el Chromium.zip ORIGINAL que acabas de subir'
  $dlg.Filter='Archivo Chromium (*.zip)|*.zip'
  $dlg.CheckFileExists=$true
  if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){
    Report 'CANCELADO: no se hizo ninguna modificacion.'
    return
  }
  $zip=$dlg.FileName
  $versionZip=$null
  $extraDialog=New-Object System.Windows.Forms.OpenFileDialog
  $extraDialog.Title='Opcional: selecciona 142.0.7444.273.zip (Cancelar si el motor ya esta completo en Chromium.zip)'
  $extraDialog.Filter='ZIP de la version Chromium (*.zip)|*.zip'
  $extraDialog.CheckFileExists=$true
  if($extraDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){
    $versionZip=$extraDialog.FileName
    if([IO.Path]::GetFullPath($versionZip) -ieq [IO.Path]::GetFullPath($zip)){
      throw 'La carpeta principal y el ZIP de version deben ser archivos distintos.'
    }
  }
  $extraNames=@()
  $nativeVersion=''
  if($versionZip){
    $nativeVersion=[IO.Path]::GetFileNameWithoutExtension($versionZip)
    if($nativeVersion -notmatch '^\d+\.\d+\.\d+\.\d+$'){
      throw 'ZIP_VERSION_INVALIDO: se espera un archivo llamado 142.0.7444.273.zip.'
    }
    $vArchive=[IO.Compression.ZipFile]::OpenRead($versionZip)
    try{
      $extraNames=@($vArchive.Entries|Where-Object{-not [string]::IsNullOrEmpty($_.Name)}|
        ForEach-Object{$_.FullName.Replace('\','/')})
    }finally{$vArchive.Dispose()}
    $extraDll=@($extraNames|Where-Object{
      $_ -ieq 'chrome.dll' -or
      $_ -match ('(^|/)'+[regex]::Escape($nativeVersion)+'/chrome\.dll$')
    })
    if($extraDll.Count -ne 1){
      throw 'ZIP_VERSION_INVALIDO: no hay un unico chrome.dll con la version indicada.'
    }
    $extraPrefix=$extraDll[0].Substring(0,$extraDll[0].Length-'chrome.dll'.Length)
    foreach($needed in @('icudtl.dat','resources.pak','v8_context_snapshot.bin')){
      if($extraNames -notcontains ($extraPrefix+$needed)){
        throw 'ZIP_VERSION_INCOMPLETO: faltan archivos obligatorios.'
      }
    }
    Report ('CHROMIUM_VERSION_ZIP='+$nativeVersion)
    Report ('CHROMIUM_VERSION_ZIP_ARCHIVOS='+$extraNames.Count)
  }
  $archive=[IO.Compression.ZipFile]::OpenRead($zip)
  try{
    $names=@($archive.Entries | Where-Object {-not [string]::IsNullOrEmpty($_.Name)} | ForEach-Object {$_.FullName.Replace('\','/')})
    $engine=@($names | Where-Object {$_ -match '^(?:[^/]+/){0,3}(?:Chromium/)?Application/ginsbrowser\.exe$'})
    $dll=@($names | Where-Object {$_ -match '^(?:[^/]+/){0,3}(?:Chromium/)?Application/\d+\.\d+\.\d+\.\d+/chrome\.dll$'})
    if($engine.Count -ne 1 -or ($dll.Count -ne 1 -and -not $versionZip)) {
      throw 'ZIP_INCOMPLETO: falta ginsbrowser.exe o no hay chrome.dll y tampoco ZIP de version.'
    }
    # Resolve archives with Chromium/ and those with Application/ at ZIP root.
    $one=$engine[0]
    $prefix=$one.Substring(0,$one.Length-'Application/ginsbrowser.exe'.Length)
    $version=$nativeVersion
    if($dll.Count -eq 1){
      $primaryVersion=[regex]::Match($dll[0],'Application/(\d+\.\d+\.\d+\.\d+)/chrome\.dll$').Groups[1].Value
      if($version -and $primaryVersion -ne $version){
        throw 'VERSIONES_INCOMPATIBLES: los ZIP indican versiones diferentes de chrome.dll.'
      }
      $version=$primaryVersion
    }
    if(-not $version){throw 'ZIP_INCOMPLETO: falta la version del motor Chromium'}
    foreach($required in @('Application/'+$version+'/icudtl.dat',
                           'Application/'+$version+'/resources.pak',
                           'Application/'+$version+'/v8_context_snapshot.bin')){
      $nativeRelative=$required.Substring(('Application/'+$version+'/').Length)
      if($names -notcontains ($prefix+$required) -and
         (-not $versionZip -or $extraNames -notcontains ($extraPrefix+$nativeRelative))){
        throw 'ZIP_INCOMPLETO: falta dependencia nativa de Chromium.'
      }
    }
    $runtime=@($names|Where-Object {
      $_.StartsWith($prefix,[StringComparison]::OrdinalIgnoreCase) -and
      $_.Substring($prefix.Length) -match '^(Application/|ginsbrowser/|version\.json$)'
    })
    if($runtime.Count -lt 40 -and -not $versionZip){throw 'ZIP_INCOMPLETO: menos de 40 archivos del motor Chromium.'}
    $versionFile=@($names|Where-Object{$_ -ieq ($prefix+'version.json')})
    $bundles=@($names|Where-Object{$_ -match '(?i)\.ginsextension[23]\.zip$'})
    Report ('CHROMIUM_ZIP_VERIFICADO: entradas='+$names.Count)
    Report ('CHROMIUM_NUCLEO_VERSION='+$version)
    Report ('CHROMIUM_ARCHIVOS_RUNTIME='+$runtime.Count)
    Report ('CHROMIUM_VERSION_JSON_PRESENTE='+($versionFile.Count -eq 1))
    Report ('CHROMIUM_BUNDLES_EXTENSION_ZIP='+$bundles.Count)
    Report 'CHROMIUM_GINSBROWSER=ENCONTRADO'
    Report 'CHROMIUM_CHROME_DLL=ENCONTRADO'
  }finally{$archive.Dispose()}
  $originalSha=(Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant()
  Report ('CHROMIUM_ZIP_SHA256='+$originalSha)
  if($versionZip){
    $versionSHA=(Get-FileHash -LiteralPath $versionZip -Algorithm SHA256).Hash.ToLowerInvariant()
    Report ('CHROMIUM_VERSION_ZIP_SHA256='+$versionSHA)
  }
  foreach($command in @('git','node','npm')){
    if(-not (Get-Command $command -ErrorAction SilentlyContinue)){
      throw ('FALTA_HERRAMIENTA: '+$command+'. Instale Git for Windows y Node.js LTS.')
    }
  }
  $downloads=Join-Path $env:USERPROFILE 'Downloads'
  if(-not (Test-Path -LiteralPath $downloads -PathType Container)) {
    $downloads=[Environment]::GetFolderPath('Desktop')
  }
  $dest=Join-Path $downloads 'Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe'
  if(Test-Path -LiteralPath $dest){
    throw 'ARCHIVO_EXISTENTE: renombre o retire primero el instalador de pruebas de Descargas.'
  }
  $confirm=[System.Windows.Forms.MessageBox]::Show(
    'Se descargara el codigo del repositorio luis5afp/Dyclokpropio, se instalaran las dependencias necesarias y se compilara un EXE local con su Chromium.zip.'+
    [Environment]::NewLine+'No se modificaran los perfiles ni se reemplazara el programa instalado.'+
    [Environment]::NewLine+'El EXE no sera publicado automaticamente en GitHub.'+
    [Environment]::NewLine+[Environment]::NewLine+'Desea continuar?',
    'Crear instalador de prueba v30.0.14',
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Question)
  if($confirm -ne [System.Windows.Forms.DialogResult]::Yes){Report 'CANCELADO: no se hizo ninguna modificacion.';return}
  $workspace=Join-Path $downloads ('Dyclok_Build_30_0_14_'+(Get-Date).ToString('yyyyMMdd_HHmmss'))
  [IO.Directory]::CreateDirectory($workspace) | Out-Null
  $log=Join-Path $workspace 'compilacion.txt'
  Start-Transcript -LiteralPath $log | Out-Null
  $transcript=$true
  Report 'FASE 1: Descargar codigo con correcciones de rc4 e integracion Chromium.'
  & git clone --depth 1 --branch 'feature/v30-0-14-rc4-chromium-completo-20261026' --single-branch 'https://github.com/luis5afp/Dyclokpropio.git' (Join-Path $workspace 'fuente')
  if($LASTEXITCODE -ne 0){throw 'No se pudo descargar la rama de compilacion desde GitHub.'}
  $source=Join-Path $workspace 'fuente'
  $build=Join-Path $source 'tools/build-win-with-complete-chromium.ps1'
  if(-not (Test-Path -LiteralPath $build)){throw 'Falta el compilador del repositorio.'}
  Report 'FASE 2: Validar Chromium real y compilar instalador completo.'
  if($versionZip){
    & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $build -ArchivoZipAntiguo $zip -ZipVersionChromium $versionZip
  }else{
    & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $build -ArchivoZipAntiguo $zip
  }
  if($LASTEXITCODE -ne 0){throw 'Compilacion o verificacion fallida. No se ha creado una release.'}
  $from=Join-Path $source 'release-delivery/Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe'
  $status=Join-Path $source 'release-delivery/TEST_STATUS-CHROMIUM-COMPLETO.txt'
  $sums=Join-Path $source 'release-delivery/SHA256SUMS-CHROMIUM-COMPLETO.txt'
  foreach($p in @($from,$status,$sums)){
    if(-not (Test-Path -LiteralPath $p -PathType Leaf)){throw 'Compilacion incompleta: falta el instalador o sus verificaciones.'}
  }
  $state=Get-Content -LiteralPath $status -Raw
  if(-not $state.Contains('completeChromiumBundled=true') -or
     -not $state.Contains('nativeCacheIpcRegistered=true')){
    throw 'La integridad o el registro IPC no fue confirmado: instalador bloqueado.'
  }
  $hash=(Get-FileHash -LiteralPath $from -Algorithm SHA256).Hash.ToLowerInvariant()
  if(-not (Get-Content -LiteralPath $sums -Raw).StartsWith($hash)){
    throw 'Los SHA256 del instalador no coinciden.'
  }
  [IO.File]::Copy($from,$dest,$false)
  [IO.File]::WriteAllText((Join-Path $downloads 'Dyclokpropio_30.0.14_SHA256.txt'),($hash+'  '+[IO.Path]::GetFileName($dest)))
  Report 'RESULTADO=COMPILACION_LOCAL_CORRECTA'
  Report ('EXE_INSTALABLE='+[IO.Path]::GetFileName($dest))
  Report ('SHA256='+$hash)
  Report 'El perfil 244 aun requiere prueba real. No ejecute instalador sobre copia que funciona.'
  [System.Windows.Forms.MessageBox]::Show(
    'Se creo el instalador de prueba en su carpeta Descargas.'+
    [Environment]::NewLine+[IO.Path]::GetFileName($dest)+
    [Environment]::NewLine+'Conserve una copia de seguridad y pruebe el perfil 244 en instalacion separada.',
    'Compilacion completada',[System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null
}catch{
  $msg=[string]$_.Exception.Message
  Report ('ERROR_DEL_COMPILADOR='+$msg)
  Report 'No se instalo nada ni se modificaron perfiles.'
  exit 1
}finally{
  if($transcript){try{Stop-Transcript | Out-Null}catch{}}
}

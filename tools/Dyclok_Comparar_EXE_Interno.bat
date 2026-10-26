@echo off
setlocal DisableDelayedExpansion
title Dyclok - Analisis interno de ejecutables
set "DYCLOK_SELF=%~f0"
set "DYCLOK_OLD=%~1"
set "DYCLOK_NEW=%~2"
echo.
echo COMPARADOR EXE DICLOAK / DYCLOKPROPIO
echo Solo lectura. No ejecuta ni modifica los programas.
echo.
powershell.exe -NoProfile -NoLogo -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:DYCLOK_SELF);$m='::==DYCLOK_EXE_INSPECTOR==';$p=$s.LastIndexOf($m);if($p -lt 0){throw 'Inspector no encontrado'};& ([scriptblock]::Create($s.Substring($p+$m.Length)))"
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" echo ERROR: No se genero el informe.
echo.
if not defined DYCLOK_CI pause
exit /b %RC%
::==DYCLOK_EXE_INSPECTOR==
$ErrorActionPreference='Stop'
function Select-Exe([string]$preferred,[string]$file,[string]$prompt){
  if($preferred -and (Test-Path -LiteralPath $preferred -PathType Leaf)){
    return (Resolve-Path -LiteralPath $preferred).Path
  }
  $dirs=@((Split-Path -Parent $env:DYCLOK_SELF),(Join-Path $env:USERPROFILE 'Downloads'))
  foreach($dir in $dirs){
    if(!$dir){continue}
    $candidate=Join-Path $dir $file
    if(Test-Path -LiteralPath $candidate -PathType Leaf){return $candidate}
  }
  Add-Type -AssemblyName System.Windows.Forms
  $dlg=New-Object System.Windows.Forms.OpenFileDialog
  $dlg.Title=$prompt;$dlg.Filter='Programas Windows (*.exe)|*.exe'
  if($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){return $dlg.FileName}
  throw 'No se selecciono un EXE.'
}
function TextValue($value){
  if($null -eq $value){return 'NO_DISPONIBLE'}
  $s=([string]$value) -replace '[\x00-\x1f\x7f]',' '
  if($s.Length -gt 120){$s=$s.Substring(0,120)}
  if(!$s.Trim()){return 'NO_DISPONIBLE'}
  return $s
}
function Inspect-PE([string]$file) {
  $fs=[IO.File]::Open($file,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::ReadWrite)
  $br=New-Object System.IO.BinaryReader($fs)
  try {
    if($fs.Length -lt 1024){throw 'Archivo demasiado pequeno para PE'}
    if($br.ReadUInt16() -ne 0x5a4d){throw 'Cabecera DOS MZ ausente'}
    $fs.Position=0x3c
    $peOffset=[int64]$br.ReadUInt32()
    if($peOffset -lt 64 -or $peOffset -gt 32MB -or $peOffset+300 -ge $fs.Length){
      throw 'Offset PE invalido'
    }
    $fs.Position=$peOffset
    if($br.ReadUInt32() -ne 0x00004550){throw 'Firma PE no encontrada'}
    $machine=$br.ReadUInt16()
    $nSec=$br.ReadUInt16()
    $timestamp=$br.ReadUInt32()
    $fs.Position=$peOffset+20
    $optSize=$br.ReadUInt16()
    $characteristics=$br.ReadUInt16()
    $opt=$peOffset+24
    $fs.Position=$opt
    $magic=$br.ReadUInt16()
    if($magic -ne 0x20b -and $magic -ne 0x10b){throw 'Formato PE32/PE32+ no reconocido'}
    $fs.Position=$opt+16
    $entrypoint=$br.ReadUInt32()
    $fs.Position=$opt+56
    $imageSize=$br.ReadUInt32()
    $fs.Position=$opt+64
    $checksum=$br.ReadUInt32()
    $fs.Position=$opt+68
    $subsystem=$br.ReadUInt16()
    $dirstart=$opt+96
    $peFormat='PE32 (32-bit)'
    if($magic -eq 0x20b){$dirstart=$opt+112;$peFormat='PE32+ (64-bit)'}
    $fs.Position=$dirstart+16
    $resourceRva=$br.ReadUInt32();$resourceBytes=$br.ReadUInt32()
    $fs.Position=$dirstart+32
    $certOffset=$br.ReadUInt32();$certBytes=$br.ReadUInt32()
    $secStart=$opt+$optSize
    $sects=New-Object System.Collections.Generic.List[object]
    $fs.Position=$secStart
    for($i=0;$i -lt [Math]::Min($nSec,80);$i++){
      $namebytes=$br.ReadBytes(8)
      $name=([Text.Encoding]::ASCII.GetString($namebytes)).Trim([char]0)
      $virtualSize=$br.ReadUInt32()
      $virtualAddress=$br.ReadUInt32()
      $rawSize=$br.ReadUInt32()
      $rawAddress=$br.ReadUInt32()
      $fs.Position+=16
      $sects.Add([pscustomobject]@{Name=$name;RawBytes=$rawSize;VirtualBytes=$virtualSize})
    }
    return [pscustomobject]@{
      Machine=('0x{0:X4}' -f $machine)
      PEFormat=$peFormat
      NumberOfSections=$nSec
      BuildTimestampHex=('0x{0:X8}' -f $timestamp)
      EntryPointHex=('0x{0:X8}' -f $entrypoint)
      SizeOfImage=$imageSize
      PEChecksumHex=('0x{0:X8}' -f $checksum)
      Subsystem=$subsystem
      ResourcesBytes=$resourceBytes
      CertificateBytes=$certBytes
      Sections=$sects.ToArray()
    }
  }finally{$br.Dispose();$fs.Dispose()}
}
function Analyze([string]$file){
  $info=Get-Item -LiteralPath $file
  $version=$info.VersionInfo
  $signature=Get-AuthenticodeSignature -LiteralPath $file
  $pe=Inspect-PE $file
  return [pscustomobject]@{
    Name=[IO.Path]::GetFileName($file)
    Bytes=$info.Length
    SHA256=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
    FileVersion=TextValue $version.FileVersion
    ProductVersion=TextValue $version.ProductVersion
    ProductName=TextValue $version.ProductName
    CompanyName=TextValue $version.CompanyName
    OriginalFilename=TextValue $version.OriginalFilename
    SignatureStatus=[string]$signature.Status
    PE=$pe
  }
}
function Add-Record([System.Collections.Generic.List[string]]$lines,[string]$name,$o){
  $lines.Add("=== $name ===")
  foreach($key in @('Name','Bytes','SHA256','FileVersion','ProductVersion','ProductName','CompanyName','OriginalFilename','SignatureStatus')){
    $lines.Add(("{0}: {1}" -f $key,$o.$key))
  }
  foreach($key in @('Machine','PEFormat','NumberOfSections','BuildTimestampHex','EntryPointHex','SizeOfImage','PEChecksumHex','Subsystem','ResourcesBytes','CertificateBytes')){
    $lines.Add(("PE.{0}: {1}" -f $key,$o.PE.$key))
  }
  foreach($section in $o.PE.Sections){
    $lines.Add(("PE.Section: {0} raw={1} virtual={2}" -f $section.Name,$section.RawBytes,$section.VirtualBytes))
  }
  $lines.Add('')
}
try {
  $oldPath=Select-Exe $env:DYCLOK_OLD 'DICloak.exe' 'Seleccione el ejecutable antiguo DICloak.exe'
  $newPath=Select-Exe $env:DYCLOK_NEW 'Dyclokpropio.exe' 'Seleccione el ejecutable nuevo Dyclokpropio.exe'
  if([string]::Equals($oldPath,$newPath,[StringComparison]::OrdinalIgnoreCase)){throw 'Se selecciono el mismo archivo dos veces.'}
  Write-Host 'Leyendo estructura PE y versiones de ambos ejecutables...'
  $old=Analyze $oldPath
  $new=Analyze $newPath
  $lines=New-Object System.Collections.Generic.List[string]
  $lines.Add('DYCLOK - COMPARACION ESTRUCTURAL DE DOS EJECUTABLES WINDOWS')
  $lines.Add('Solo metadatos de ejecutables y cabeceras PE. No ejecuta programas, no abre perfiles.')
  $lines.Add('No contiene rutas absolutas, claves, cookies ni texto libre de los programas.')
  $lines.Add(('Generado: '+(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')))
  $lines.Add('')
  Add-Record $lines 'EJECUTABLE ANTIGUO' $old
  Add-Record $lines 'EJECUTABLE NUEVO' $new
  $lines.Add('=== DIFERENCIAS IMPORTANTES ===')
  foreach($field in @('Bytes','SHA256','FileVersion','ProductVersion','ProductName','CompanyName','OriginalFilename','SignatureStatus')){
    if($old.$field -ne $new.$field){$lines.Add(("{0}: ANTIGUO=[{1}] NUEVO=[{2}]" -f $field,$old.$field,$new.$field))}
  }
  foreach($field in @('Machine','PEFormat','BuildTimestampHex','EntryPointHex','SizeOfImage','Subsystem','ResourcesBytes','CertificateBytes')){
    if($old.PE.$field -ne $new.PE.$field){$lines.Add(("PE.{0}: ANTIGUO=[{1}] NUEVO=[{2}]" -f $field,$old.PE.$field,$new.PE.$field))}
  }
  $dest=Join-Path (Join-Path $env:USERPROFILE 'Downloads') ('Dyclok_Analisis_EXE_Interno_'+(Get-Date -Format 'yyyyMMdd_HHmmss')+'.txt')
  [IO.Directory]::CreateDirectory((Split-Path -Parent $dest)) | Out-Null
  [IO.File]::WriteAllLines($dest,$lines,[Text.Encoding]::UTF8)
  Write-Host 'INFORME GUARDADO:'
  Write-Host $dest
  Write-Host 'Sube solo el TXT. El programa no fue modificado.'
}catch{
  Write-Host ("ERROR EN LINEA "+$_.InvocationInfo.ScriptLineNumber+": "+$_.Exception.Message)
  exit 1
}

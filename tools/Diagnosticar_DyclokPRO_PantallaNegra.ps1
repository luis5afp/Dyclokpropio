# DyclokPRO - diagnosticar pantalla negra y cierre inesperado.
# Solo lectura: no cambia cookies, perfiles, sesiones, cuenta ni instalacion.
# No envia datos a internet. Revise el TXT antes de compartirlo.
$ErrorActionPreference = 'Continue'
$now = Get-Date
$desktop = [Environment]::GetFolderPath('Desktop')
if(-not $desktop -or -not (Test-Path $desktop)) { $desktop=$env:USERPROFILE }
$out = Join-Path $desktop ('DyclokPRO_informe_cierre_'+$now.ToString('yyyyMMdd_HHmmss')+'.txt')
$lines=New-Object 'System.Collections.Generic.List[string]'
function Add-Line([string]$s) { [void]$lines.Add($s) }
function Clean-Line([string]$s) {
 if(-not $s){return ''}
 return ($s -replace '(?i)C:\\Users\\[^\\\s]+\\','C:\Users\[USUARIO]\' -replace '[\r\n]+',' | ')
}
Add-Line 'DyclokPRO - INFORME DE CIERRE (SOLO LECTURA)'
Add-Line 'Revisar antes de compartir. No se extraen contrasenas, tokens, cookies ni datos del navegador.'
Add-Line ('Hora local: '+$now.ToString('yyyy-MM-dd HH:mm:ss'))
Add-Line ''
Add-Line '=== INSTALACION ==='
$exe=Join-Path $env:LOCALAPPDATA 'Programs\DyclokPRO\DICloak.exe'
if(Test-Path -LiteralPath $exe -PathType Leaf){
 try{
  $i=Get-Item -LiteralPath $exe
  Add-Line ('Archivo ejecutable: '+$i.Name)
  Add-Line ('Version de archivo: '+$i.VersionInfo.FileVersion)
  Add-Line ('Modificado: '+$i.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))
 }catch{Add-Line ('Error al inspeccionar EXE: '+$_.Exception.GetType().Name)}
}else{Add-Line 'No se encontro DICloak.exe en la ruta habitual de DyclokPRO.'}
Add-Line ''
Add-Line '=== EVENTOS DE FALLO DE WINDOWS: ULTIMAS 3 HORAS ==='
try{
 $ev=Get-WinEvent -FilterHashtable @{LogName='Application';Id=@(1000,1001,1002,1026);StartTime=$now.AddHours(-3)} -ErrorAction Stop |
  Where-Object { $_.Message -match '(?i)DICloak|DyclokPRO|ginsbrowser' } |
  Sort-Object TimeCreated -Descending | Select-Object -First 15
 if(-not $ev){Add-Line 'No se encontraron eventos de fallo relacionados.'}
 foreach($e in $ev){
  Add-Line ('Evento: '+$e.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')+' / '+$e.ProviderName+' / ID '+$e.Id)
  $msg=Clean-Line $e.Message
  Add-Line ($msg.Substring(0,[Math]::Min(1300,$msg.Length)))
  Add-Line ''
 }
}catch{Add-Line ('No se pudo consultar Visor de eventos: '+$_.Exception.GetType().Name)}
Add-Line '=== REGISTRO DYCLOKPRO, CUENTA PRINCIPAL ==='
$dir=Join-Path $env:LOCALAPPDATA 'DyclokPRO\Cuentas\legacy\Diagnosticos'
try{
 if(Test-Path -LiteralPath $dir){
  $latest=Get-ChildItem -LiteralPath $dir -File -Filter '*.txt' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if($latest){
   Add-Line ('Archivo: '+$latest.Name)
   Add-Line ('Modificado: '+$latest.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))
   Get-Content -LiteralPath $latest.FullName -Tail 180 | ForEach-Object {Add-Line (Clean-Line $_)}
  }else{Add-Line 'No hay TXT de diagnostico.'}
 }else{Add-Line 'Carpeta de diagnostico no encontrada.'}
}catch{Add-Line ('Error al leer registro local: '+$_.Exception.GetType().Name)}
Add-Line ''
Add-Line '=== FIN ==='
try{
 [System.IO.File]::WriteAllLines($out,[string[]]$lines,[System.Text.UTF8Encoding]::new($true))
 Write-Host ('Informe creado: '+$out)
 Start-Process -FilePath notepad.exe -ArgumentList ('"'+$out+'"')
}catch{Write-Error ('No se pudo guardar el informe: '+$_.Exception.Message);exit 1}

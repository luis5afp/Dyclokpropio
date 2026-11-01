# Diagnostico DyclokPRO v6.37: de dónde proviene la ventana DICloak.
# Solo lectura: nunca lee archivos de sesión, cookies, contraseña, perfiles,
# cabeceras HTTP, líneas de comandos ni identificadores de dispositivo.
param([string]$Output="")
$ErrorActionPreference='Stop'
$base=Join-Path $env:LOCALAPPDATA "DyclokPRO"
if(-not $Output){$Output=Join-Path $env:TEMP "DyclokPRO_Diagnostico_Motor.txt"}
$shaMap=@{
 'aabad1798fc7bba5391a161a823cd9a875317f587d413fa72f01e8178a26c7e8'='DyclokPRO v6.36: motor heredado 2.8.17 (version declarada 3.0.7)'
 'ef36e6ff2e72b1bacf8174a5e1ba5c5c930b13a229d28f37b8e6822796c5fadd'='DyclokPRO v6.28: motor heredado 2.8.17 (version declarada 3.0.7)'
 'b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf'='DICloak 3.0.7 OFICIAL intacto'
}
$logs=[System.Collections.Generic.List[string]]::new()
$logs.Add('DYCLOKPRO_DIAGNOSTICO_MOTOR_V637')
$logs.Add('Fecha local: '+[DateTimeOffset]::Now.ToString('yyyy-MM-dd HH:mm:ss zzz'))
$logs.Add('Modalidad: SOLO LECTURA, sin secretos, sin cerrar procesos')
$logs.Add('Motor identificado por SHA256 de app.asar (no por titulo ni version)')
$names=@('DICloak','DyclokPRO')
$ps=@(Get-Process -ErrorAction SilentlyContinue | Where-Object {$names -contains $_.ProcessName})
if($ps.Count -eq 0){$logs.Add('PROCESOS: Ninguno de los dos nombres esta abierto')}
foreach($p in $ps){
 try{
  $exe=$p.Path
  if([string]::IsNullOrWhiteSpace($exe)){$logs.Add('PROCESO_SIN_RUTA: PID '+$p.Id);continue}
  $dir=Split-Path -Parent $exe
  $asar=Join-Path $dir 'resources\app.asar'
  $origin='otra ubicacion'
  if($dir.StartsWith((Join-Path $env:LOCALAPPDATA 'Programs\DyclokPRO'),
       [StringComparison]::OrdinalIgnoreCase)){$origin='instalacion DyclokPRO'}
  elseif($dir.StartsWith((Join-Path $env:LOCALAPPDATA 'Programs\DICloak'),
       [StringComparison]::OrdinalIgnoreCase)){$origin='instalacion DICloak oficial'}
  elseif($dir.StartsWith((Join-Path $env:ProgramFiles 'DICloak'),
       [StringComparison]::OrdinalIgnoreCase)){$origin='Program Files DICloak'}
  $logs.Add('PROCESO: '+$p.ProcessName+' PID '+$p.Id+' | Origen: '+$origin)
  if($p.MainWindowTitle -match 'DICloak\s*-\s*V3\.0\.7\s*\|\s*1\.2\.4\.1'){
   $logs.Add('TITULO: coincide con el de la captura (no identifica motor)')
  }elseif([string]::IsNullOrWhiteSpace($p.MainWindowTitle)){
   $logs.Add('TITULO: sin ventana principal en este proceso')
  }else{$logs.Add('TITULO: diferente de la captura (omitido por privacidad)')}
  if(Test-Path -LiteralPath $asar -PathType Leaf){
   $sha=(Get-FileHash -LiteralPath $asar -Algorithm SHA256).Hash.ToLowerInvariant()
   if($shaMap.ContainsKey($sha)){$logs.Add('MOTOR_REAL: '+$shaMap[$sha])}
   else {$logs.Add('MOTOR_REAL: version no reconocida en referencias verificadas')}
   $logs.Add('ASAR_SHA256: '+$sha)
   $index=Join-Path $dir 'resources\app.asar.unpacked\dist\index.html'
   $logs.Add('INTERFAZ_HTML: '+(Test-Path -LiteralPath $index -PathType Leaf))
   $compat=Join-Path $dir 'resources\app.asar.unpacked\dist\dyclokpro-compat307.js'
   $logs.Add('ADAPTADOR_API_V636: '+(Test-Path -LiteralPath $compat -PathType Leaf))
  }else{$logs.Add('ASAR: no encontrado para este proceso')}
 }catch{$logs.Add('PROCESO: ruta no consultable; no se eleva privilegio')}
}
$logs.Add('Nota: Si el motor es v6.36, el cierre al cargar perfiles puede deberse a la API antigua.')
$logs.Add('Nota: La pantalla negra necesita eventos de carga de Electron para determinar la causa.')
$parent=Split-Path -Parent $Output
if($parent -and -not(Test-Path $parent)){New-Item -ItemType Directory -Path $parent -Force|Out-Null}
$logs|Set-Content -LiteralPath $Output -Encoding UTF8
Write-Output ('Informe sin credenciales: '+$Output)
$logs|ForEach-Object {Write-Output $_}

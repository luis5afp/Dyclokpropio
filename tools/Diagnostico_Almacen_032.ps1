# Comprobación de solo lectura de DICloak Almacén 0.3.2
# No cierra ventanas, altera perfiles ni modifica archivos.
$ErrorActionPreference='Stop'
$base=Join-Path $env:LOCALAPPDATA 'Programs\DICloak-Nativo-Almacen-Lab-032'
$exe=Join-Path $base 'DICloak.exe'
$manifest=Join-Path $base 'resources\dyclok-native-update-ui-manifest.json'
Write-Host '--- Diagnóstico DICloak Almacén ---'
Write-Host ('EXE 0.3.2 instalado: '+(Test-Path -LiteralPath $exe -PathType Leaf))
if(Test-Path -LiteralPath $manifest -PathType Leaf){
 try {
   $m=Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json
   Write-Host ('Versión del paquete: '+$m.deliveryVersion)
 } catch { Write-Warning 'No se pudo leer el manifiesto' }
} else {Write-Host 'Manifiesto 0.3.2 ausente'}
$procs=@(Get-CimInstance Win32_Process -Filter "Name = 'DICloak.exe'" -ErrorAction SilentlyContinue)
if($procs.Count -eq 0){Write-Host 'DICloak.exe activos: ninguno'}
foreach($group in ($procs | Group-Object ExecutablePath)){
 $p=$group.Name
 $is032=$p -and [string]::Equals($p,$exe,[StringComparison]::OrdinalIgnoreCase)
 $label=if($is032){'INSTALACION 0.3.2'}elseif($p -match 'DICloak-Nativo-Almacen-Lab-03[01]'){'INSTALACION ANTERIOR 0.3.0 / 0.3.1'}elseif($p){'OTRA INSTALACION'}else{'RUTA NO ACCESIBLE'}
 Write-Host ("Proceso(s): {0} | {1}" -f $group.Count,$label)
}
Write-Host 'Fin del diagnóstico; no se ha modificado nada.'

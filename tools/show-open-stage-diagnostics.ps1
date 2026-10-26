<#
.SYNOPSIS
  Exporta los eventos estructurados de apertura de Dyclokpropio.
.DESCRIPTION
  SOLO LECTURA de dyclok-open-stage.jsonl. No accede a perfiles, cookies,
  contraseñas, historial o URLs. Omite ubicaciones de los archivos locales.
#>
[CmdletBinding()]
param([ValidateRange(5,200)][int]$Last=80)
$ErrorActionPreference='Stop'
$parents=@($env:APPDATA,$env:LOCALAPPDATA)
$names=@('DICloak','Dyclokpropio','Dyclok')
$entries=@()
foreach($parent in $parents) {
  if(-not $parent){continue}
  foreach($name in $names){
    $base=Join-Path $parent $name
    foreach($suffix in @('dyclok-open-stage.jsonl','dyclok-open-stage.jsonl.old')){
      $file=Join-Path $base $suffix
      if(-not (Test-Path -LiteralPath $file -PathType Leaf)){continue}
      foreach($line in @(Get-Content -LiteralPath $file -Tail $Last -ErrorAction Stop)){
        try {
          $item=$line|ConvertFrom-Json -ErrorAction Stop
          $step=[string]$item.step; $phase=[string]$item.phase
          if($step -notmatch '^[a-zA-Z]{3,35}$' -or $phase -notin @('start','success','fail','terminal')){continue}
          $code=[string]$item.code; if($code -notmatch '^[A-Z][A-Z0-9_]{2,79}$'){$code='UNCLASSIFIED'}
          $cls=[string]$item.errorClass; if($cls -notmatch '^[A-Za-z]{3,35}$'){$cls='Other'}
          $utc=[string]$item.utc; if($utc -notmatch '^\d{4}-\d\d-\d\dT'){$utc='UNKNOWN_TIME'}
          $entries+= [pscustomobject]@{UTC=$utc;Etapa=$step;Estado=$phase;Codigo=$code;Clase=$cls}
        }catch{}
      }
    }
  }
}
$outDir=Join-Path $env:USERPROFILE 'Downloads'
if(-not(Test-Path -LiteralPath $outDir -PathType Container)){$outDir=[Environment]::GetFolderPath('Desktop')}
$out=Join-Path $outDir 'Dyclok-Diagnostico-Etapas.txt'
$lines=New-Object System.Collections.Generic.List[string]
$lines.Add('DYCLOKPROPIO - DIAGNOSTICO REDACTADO DE APERTURA v30.0.8')
$lines.Add('No incluye identificadores de perfiles, URLs, cookies ni rutas.')
$lines.Add('Eventos encontrados: '+$entries.Count)
if($entries.Count){
 $lines.Add('Ultimos eventos, del mas antiguo al mas reciente:')
 $lines.Add(($entries|Sort-Object UTC |Select-Object -Last $Last|Format-Table -AutoSize|Out-String -Width 170))
}else{
 $lines.Add('SIN EVENTOS: comprueba que se instaló y ejecutó v30.0.8; abre un perfil una vez antes del script.')
 $lines.Add('Si aun no hay eventos, la etapa puede fallar antes de abrir el renderer, o usar otro directorio userData.')
}
[System.IO.File]::WriteAllLines($out,$lines,[System.Text.UTF8Encoding]::new($false))
Write-Host ('Informe creado: '+$out) -ForegroundColor Cyan
Write-Host 'Adjunta el TXT generado. No borra ni modifica perfiles.'
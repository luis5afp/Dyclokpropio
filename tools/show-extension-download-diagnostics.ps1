<# 
.SYNOPSIS
  Mostrar errores de descarga de extensiones de Dyclokpropio sin leer perfiles.
.DESCRIPTION
  Consulta exclusivamente el diagnostico de errores del descargador de la
  aplicacion. No requiere privilegios de administrador, no borra archivos,
  no lee tokens, cookies ni contrasenas, y no descarga ningun archivo.
  Si no hay registros, la falla puede ocurrir ANTES o DESPUES del descargador
  (configuracion de perfiles o validacion de seguridad).
#>
[CmdletBinding()]
param(
  [ValidateRange(1,100)] [int]$Last = 15
)
$ErrorActionPreference = 'Stop'
$files = New-Object 'System.Collections.Generic.List[string]'
foreach ($parent in @($env:APPDATA, $env:LOCALAPPDATA)) {
  if (-not $parent) { continue }
  foreach ($name in @('Dyclokpropio', 'DICloak', 'Dyclok')) {
    $file = Join-Path (Join-Path $parent $name) 'dyclok-extension-errors.jsonl'
    if (Test-Path -LiteralPath $file -PathType Leaf) { $files.Add($file) }
  }
}
if ($files.Count -eq 0) {
  Write-Host 'No hay registro del descargador. El fallo puede estar en la comprobacion de seguridad, una asignacion incompleta o una etapa anterior del perfil.' -ForegroundColor Yellow
  Write-Host 'No borres la cache ni elimines extensiones sin revisar primero el detalle de error.'
  return
}
foreach ($file in $files) {
  Write-Host ('Diagnostico: ' + $file) -ForegroundColor Cyan
  $lines = @(Get-Content -LiteralPath $file -Tail $Last -ErrorAction Stop)
  foreach ($line in $lines) {
    try {
      $entry = $line | ConvertFrom-Json -ErrorAction Stop
      [pscustomobject]@{
        UTC = [string]$entry.utc
        ExtensionId = [string]$entry.extensionId
        ExtensionName = [string]$entry.extensionName
        Result = [string]$entry.result
        Retry = [bool]$entry.retried
      }
    } catch {
      Write-Warning 'Se omitio una linea invalida del registro.'
    }
  } | Format-Table -AutoSize
}

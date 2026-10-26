<#
.SYNOPSIS
  Respaldar y reinicializar SOLO la cache de EXTENSIONES de DICloak.
.DESCRIPTION
  Para EXPAND_DOWNLOAD_FAIL provocado por cache de extensiones corrupta.
  No elimina perfiles, cookies, navegadores ni datos de autenticacion.
  Es obligatorio obtener la ruta desde DICloak > Personal > Configuracion
  > Carpeta de cache. Por defecto solo muestra lo que haria.
  El respaldo se realiza por RENOMBRADO dentro del mismo volumen y
  DICloak tendra que descargar las extensiones otra vez.
.EXAMPLE
  .\repair-extension-cache.ps1 -CacheFolder "C:\Users\usuario\.DICloakCache"
.EXAMPLE
  .\repair-extension-cache.ps1 -CacheFolder "D:\DICloakCache" -Apply
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$CacheFolder,

  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($CacheFolder).TrimEnd('\', '/')
$driveRoot = [IO.Path]::GetPathRoot($root).TrimEnd('\', '/')
if ($root -eq $driveRoot -or $root.Length -lt 5) {
  throw 'La ruta indicada es demasiado general. Selecciona la carpeta de cache de DICloak.'
}
if (-not (Test-Path -LiteralPath $root -PathType Container)) {
  throw 'No existe la carpeta indicada. Verifica la ruta en Configuracion de DICloak.'
}
$cacheInfo = Get-Item -LiteralPath $root -Force
if ($cacheInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) {
  throw 'La carpeta de cache es un enlace o punto de union; no se modifica.'
}
$expansion = Join-Path $root 'expansion'
if (-not (Test-Path -LiteralPath $expansion -PathType Container)) {
  Write-Host 'No existe la cache expansion; nada que respaldar.'
  Write-Host 'Comprueba en Extensiones que el ZIP asignado al perfil 244 se pueda descargar.'
  return
}
$extensionInfo = Get-Item -LiteralPath $expansion -Force
if ($extensionInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) {
  throw 'La carpeta expansion es un enlace; no se modifica.'
}
Write-Host 'Se encontro la cache local de extensiones.' -ForegroundColor Cyan
Write-Host 'NO se tocaran browsers, carpetas de perfiles ni archivos de sesion.'
Write-Host 'DICloak debera descargar las extensiones otra vez desde el servidor.'
if (-not $Apply) {
  Write-Host '[SIMULACION] Para respaldar la cache, ejecuta de nuevo con -Apply.'
  return
}

# Never interfere with a running app or its synchronization service.
$processes = @('DICloak', 'Dyclokpropio', 'DicSyncService')
$running = @($processes | ForEach-Object { Get-Process -Name $_ -ErrorAction SilentlyContinue } |
  Where-Object { $null -ne $_ })
if ($running.Count -gt 0) {
  throw 'Cierra DICloak/Dyclokpropio y sus perfiles antes de ejecutar esta operacion.'
}
Write-Host 'Escribe RESPALDAR para confirmar (no se eliminaran archivos):' -ForegroundColor Yellow
$confirmation = Read-Host
if ($confirmation -cne 'RESPALDAR') {
  Write-Host 'Operacion cancelada. No se hicieron cambios.'
  return
}
$backupFolder = Join-Path $root '.dyclok-backup-extensiones'
if (-not (Test-Path -LiteralPath $backupFolder)) {
  New-Item -ItemType Directory -Path $backupFolder | Out-Null
}
if ((Get-Item -LiteralPath $backupFolder -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) {
  throw 'La carpeta de respaldos es un enlace; no se modifica.'
}
$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$backup = Join-Path $backupFolder ('expansion-' + $timestamp + '-' + [guid]::NewGuid().ToString('N').Substring(0,8))
Move-Item -LiteralPath $expansion -Destination $backup -ErrorAction Stop
Write-Host 'Respaldo de extensiones creado sin eliminarlas.' -ForegroundColor Green
Write-Host "Ubicacion local del respaldo: $backup"
Write-Host 'Abre Dyclokpropio y vuelve a intentar abrir el perfil.'
Write-Host 'Si la descarga falla otra vez, el problema probablemente sea la URL, los permisos, la red o el archivo de extension asignado.'

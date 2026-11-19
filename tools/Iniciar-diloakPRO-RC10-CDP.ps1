#requires -Version 5.1
<#
.SYNOPSIS
  Starts diloakPRO with opt-in Chromium network diagnosis for one session.
.DESCRIPTION
  The key is entered invisibly, passed only as process environment, never
  saved in files or shown in logs. Requires user-authorized DICloak Open API
  and enabled Remote Inspector for the tested profile.
.EXAMPLE
  .\Iniciar-diloakPRO-RC10-CDP.ps1 -ExecutablePath 'C:\...\DICloak.exe' -OpenApiPort 52140
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [string] $ExecutablePath,
  [Parameter(Mandatory=$true)]
  [ValidateRange(1024,65535)]
  [int] $OpenApiPort
)
$ErrorActionPreference='Stop'
$path = (Resolve-Path -LiteralPath $ExecutablePath -ErrorAction Stop).ProviderPath
if (-not (Test-Path -LiteralPath $path -PathType Leaf) -or
    [IO.Path]::GetExtension($path) -ne '.exe') {
  throw 'La ruta no señala a un ejecutable EXE válido.'
}
# Avoid Electron single-instance handoff to an existing process without flags.
$already = @(Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $_.ProcessName -match '^(DICloak|diloakPRO)$' })
if ($already.Count -gt 0) {
  throw 'Cierra completamente diloakPRO/DICloak antes de ejecutar este lanzador.'
}
Write-Host 'El diagnóstico utiliza Open API en 127.0.0.1 y el puerto indicado.'
Write-Host 'La clave no se muestra ni se escribe en disco.'
$secure = Read-Host 'Introduce la clave de Open API local' -AsSecureString
$ptr=[IntPtr]::Zero
$key=$null
try {
  $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $key=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  if ([string]::IsNullOrWhiteSpace($key) -or $key.Length -lt 12) {
    throw 'La clave de Open API local no es válida.'
  }
  $env:DILOAKPRO_DIAG_CDP_ENABLE='1'
  $env:DILOAKPRO_DIAG_API_PORT=[string]$OpenApiPort
  $env:DICLOAK_LOCAL_API_KEY=$key
  $null=Start-Process -FilePath $path -WorkingDirectory ([IO.Path]::GetDirectoryName($path)) -PassThru
  Write-Host 'diloakPRO iniciado. Abre un perfil de prueba y consulta Diagnóstico → Ver.'
  Write-Host 'Si CDP no está disponible, el panel mostrará la causa.'
} finally {
  Remove-Item Env:\DILOAKPRO_DIAG_CDP_ENABLE -ErrorAction SilentlyContinue
  Remove-Item Env:\DILOAKPRO_DIAG_API_PORT -ErrorAction SilentlyContinue
  Remove-Item Env:\DICLOAK_LOCAL_API_KEY -ErrorAction SilentlyContinue
  if ($ptr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
  $key=$null
  if ($secure) {$secure.Dispose()}
}

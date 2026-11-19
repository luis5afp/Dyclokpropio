#requires -Version 5.1
<#
.SYNOPSIS
  Launches diloakPRO with explicit encrypted capture of synthetic test-server responses.
.DESCRIPTION
  Exact origin only, one opening session. No generic interception or
  third-party response capture. Passphrase is prompted invisibly and
  removed from the parent PowerShell environment after launch.
.EXAMPLE
  .\Iniciar-diloakPRO-RC12-LAB.ps1 -ExecutablePath 'C:\...\DICloak.exe' -LabOrigin 'http://127.0.0.1:8080'
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string] $ExecutablePath,
  [Parameter(Mandatory=$true)][string] $LabOrigin
)
$ErrorActionPreference='Stop'
$path=(Resolve-Path -LiteralPath $ExecutablePath -ErrorAction Stop).ProviderPath
if (-not (Test-Path -LiteralPath $path -PathType Leaf) -or
    [IO.Path]::GetExtension($path).ToLowerInvariant() -ne '.exe') {
  throw 'La ruta no contiene un ejecutable EXE válido.'
}
$uri=$null
if (-not [Uri]::TryCreate($LabOrigin,[UriKind]::Absolute,[ref]$uri)) {
  throw 'Debes escribir la URL de origen exacta de tu servidor de laboratorio.'
}
if ($uri.Scheme -notin @('http','https') -or $uri.UserInfo -ne '' -or
    $uri.AbsolutePath -ne '/' -or $uri.Query -ne '' -or $uri.Fragment -ne '') {
  throw 'El origen solo puede contener protocolo, dominio/IP y puerto, sin ruta ni datos privados.'
}
if ($uri.Scheme -eq 'http' -and $uri.Host -notin @('localhost','127.0.0.1','::1')) {
  throw 'Solo se admite HTTP sin cifrar para un servidor en localhost.'
}
if ($uri.Host -match '(?i)(^|\.)dicloak\.(net|com)$|(^|\.)ipflygates\.com$') {
  throw 'El laboratorio no puede capturar servidores del fabricante.'
}
$processes=@(Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.ProcessName -match '^(DICloak|diloakPRO)$'
})
if ($processes.Count -gt 0)throw 'Cierra completamente DICloak/diloakPRO antes de iniciar esta prueba.'
Write-Host 'Activando SOLO respuestas del origen autorizado:' $uri.GetLeftPart([UriPartial]::Authority)
Write-Host 'Se guardarán como archivos cifrados .dplab; no guardamos la clave de cifrado.'
$secure=Read-Host 'Frase de cifrado de laboratorio (mínimo 16 caracteres)' -AsSecureString
$ptr=[IntPtr]::Zero
$passphrase=$null
try{
  $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $passphrase=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  if ([string]::IsNullOrWhiteSpace($passphrase) -or $passphrase.Length -lt 16) {
    throw 'La frase de cifrado debe tener al menos 16 caracteres.'
  }
  $env:DILOAKPRO_LAB_CAPTURE_ENABLE='1'
  $env:DILOAKPRO_LAB_CAPTURE_ORIGIN=$uri.GetLeftPart([UriPartial]::Authority)
  $env:DILOAKPRO_LAB_CAPTURE_PASSPHRASE=$passphrase
  Start-Process -FilePath $path -WorkingDirectory ([IO.Path]::GetDirectoryName($path)) | Out-Null
  Write-Host 'diloakPRO iniciado. Abre tu perfil de laboratorio y consulta Diagnóstico → Ver.'
  Write-Host 'Los ficheros cifrados estarán bajo LabCaptures en la carpeta de datos de usuario de diloakPRO.'
}finally{
  Remove-Item Env:\DILOAKPRO_LAB_CAPTURE_ENABLE -ErrorAction SilentlyContinue
  Remove-Item Env:\DILOAKPRO_LAB_CAPTURE_ORIGIN -ErrorAction SilentlyContinue
  Remove-Item Env:\DILOAKPRO_LAB_CAPTURE_PASSPHRASE -ErrorAction SilentlyContinue
  if ($ptr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
  $passphrase=$null
  if ($secure) {$secure.Dispose()}
}

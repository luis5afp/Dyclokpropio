<#
.SYNOPSIS
  Diagnostico NO destructivo de instalaciones y estados de Dyclokpropio.
.DESCRIPTION
  No pide credenciales, no cierra procesos, no borra perfiles y NO lee
  cookies, contrasenas, tokens, bases de datos, ni historiales.
  Registra nombres y versiones de instaladores, existencia de carpetas
  de datos y numero de procesos relevantes. No incluye rutas de usuario.
.EXAMPLE
  .\tools\diagnose-session-windows.ps1
.EXAMPLE
  .\tools\diagnose-session-windows.ps1 -ReportPath "$env:USERPROFILE\Desktop\Dyclok-diagnostico.json"
#>
[CmdletBinding()]
param([string]$ReportPath)

$ErrorActionPreference = 'Stop'

function Get-InstalledProducts {
    $keys = @(
      'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
      'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
      'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
    )
    $items = @()
    foreach ($key in $keys) {
        foreach ($item in @(Get-ItemProperty -Path $key -ErrorAction SilentlyContinue)) {
            if ($null -eq $item -or -not $item.DisplayName) { continue }
            if ($item.DisplayName -match '(?i)dicloak|dyclokpropio') {
                $items += [pscustomobject]@{
                    Name = [string]$item.DisplayName
                    Version = [string]$item.DisplayVersion
                    Scope = if ($key.StartsWith('HKCU')) { 'Usuario' } else { 'Sistema' }
                }
            }
        }
    }
    return @($items)
}

function Get-DataFolders {
    $candidates = @(
        @{ Scope = 'Roaming'; Base = $env:APPDATA; Name = 'DICloak' },
        @{ Scope = 'Roaming'; Base = $env:APPDATA; Name = 'Dyclokpropio' },
        @{ Scope = 'Local'; Base = $env:LOCALAPPDATA; Name = 'DICloak' },
        @{ Scope = 'Local'; Base = $env:LOCALAPPDATA; Name = 'Dyclokpropio' }
    )
    $items = @()
    foreach ($item in $candidates) {
        if (-not $item.Base) { continue }
        $target = Join-Path $item.Base $item.Name
        $items += [pscustomobject]@{
            Location = $item.Scope + '/' + $item.Name
            Exists = [bool](Test-Path -LiteralPath $target -PathType Container)
        }
    }
    return $items
}

function Get-ProgramProcesses {
    $names = @('Dyclokpropio', 'DICloak', 'DicSyncService', 'chrome', 'chromium')
    $items = @()
    foreach ($name in $names) {
        $processes = @(Get-Process -Name $name -ErrorAction SilentlyContinue)
        $items += [pscustomobject]@{
            Name = $name
            Count = @($processes).Count
            Note = if ($name -in @('chrome', 'chromium')) {
                'Pueden pertenecer a otros programas; NO cerrar automaticamente'
            } else { '' }
        }
    }
    return $items
}

$result = [ordered]@{
    Tool = 'Dyclokpropio session diagnosis (read-only)'
    TimestampUtc = (Get-Date).ToUniversalTime().ToString('o')
    InstalledProducts = @(Get-InstalledProducts)
    DataFolders = @(Get-DataFolders)
    RunningProcesses = @(Get-ProgramProcesses)
    ImportantNotes = @(
        'Las carpetas de datos solo se comprueban; NO se lee su contenido.',
        'Esta prueba no confirma si los perfiles existen en el servicio remoto.',
        'Si hay varias instalaciones, NO desinstales ni borres carpetas antes de respaldarlas.',
        'Chrome puede estar en uso por otros programas; no se cierran procesos automaticamente.'
    )
}
$json = ConvertTo-Json -InputObject $result -Depth 5

Write-Host '===== Diagnostico Dyclokpropio (SOLO LECTURA) =====' -ForegroundColor Cyan
Write-Host $json
if (-not [string]::IsNullOrWhiteSpace($ReportPath)) {
    $parent = Split-Path -Parent $ReportPath
    if (-not $parent -or -not (Test-Path -LiteralPath $parent -PathType Container)) {
        throw 'La carpeta destino no existe; no se creo ningun archivo.'
    }
    $json | Set-Content -LiteralPath $ReportPath -Encoding utf8
    Write-Host "Resumen guardado en el archivo indicado." -ForegroundColor Green
}

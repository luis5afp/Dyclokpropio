<#
.SYNOPSIS
  Asigna un grupo de extensiones de DICloak a todos los perfiles existentes.
.DESCRIPTION
  Usa exclusivamente la API LOCAL documentada por DICloak. No instala la
  extension ZIP: primero subela en Extensiones y activala en ese grupo.
  Sin -Apply solo muestra una simulacion. No guarda la clave de API.
  -Continuous mantiene la sincronizacion de perfiles nuevos mientras el
  proceso de PowerShell permanezca abierto.
.EXAMPLE
  .\tools\set-extension-group-for-profiles.ps1 -GroupId '123456789'
.EXAMPLE
  .\tools\set-extension-group-for-profiles.ps1 -GroupId '123456789' -Apply
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[0-9]+$')]
    [string]$GroupId,

    [string]$ApiBase = 'http://127.0.0.1:52100/openapi',

    [switch]$Apply,
    [switch]$ReplaceExistingGroups,
    [switch]$Continuous,

    [ValidateRange(30, 3600)]
    [int]$PollSeconds = 60
)

$ErrorActionPreference = 'Stop'

if ($Continuous -and -not $Apply) {
    throw 'La opcion -Continuous requiere -Apply.'
}

$parsedUri = [uri]$ApiBase
if ($parsedUri.Scheme -ne 'http' -or $parsedUri.Host -notin @('127.0.0.1', 'localhost', '::1')) {
    throw 'Por seguridad solo se admite la API HTTP local (127.0.0.1 o localhost).'
}
$apiRoot = $ApiBase.TrimEnd('/')
if (-not $apiRoot.EndsWith('/openapi')) {
    throw 'La URL debe terminar en /openapi.'
}

Write-Host 'Introduce la clave de la API LOCAL de DICloak; no se guardara en disco.'
$secret = Read-Host 'Clave API' -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw 'La clave API no puede estar vacia.'
}
$headers = @{ 'x-api-key' = $apiKey }

function Invoke-LocalApi {
    param([string]$Method, [string]$Path, $Body = $null)
    $args = @{
        Uri = "$apiRoot$Path"
        Method = $Method
        Headers = $headers
        ErrorAction = 'Stop'
        TimeoutSec = 30
    }
    if ($null -ne $Body) {
        $args['Body'] = ConvertTo-Json -InputObject $Body -Compress -Depth 8
        $args['ContentType'] = 'application/json'
    }
    $response = Invoke-RestMethod @args
    if ($null -eq $response -or [string]$response.code -ne '0') {
        throw ('Error API local: ' + [string]$response.msg)
    }
    return $response
}

function Get-AllProfiles {
    $page = 1
    $pageSize = 100
    $profiles = New-Object System.Collections.ArrayList
    $ids = New-Object 'System.Collections.Generic.HashSet[string]'
    do {
        $res = Invoke-LocalApi -Method 'GET' -Path "/v1/env/list?page_no=$page&page_size=$pageSize"
        $rows = @($res.data.list | Where-Object { $null -ne $_ })
        foreach ($row in $rows) {
            if ([string]::IsNullOrWhiteSpace([string]$row.id)) {
                throw 'La API devolvio un perfil sin id; se cancela.'
            }
            if ($ids.Add([string]$row.id)) { [void]$profiles.Add($row) }
        }
        $total = [int]$res.data.total
        $page++
        if ($page -gt 10000) { throw 'Demasiadas paginas; se cancela por seguridad.' }
    } while ($rows.Count -gt 0 -and $profiles.Count -lt $total)
    if ($profiles.Count -lt $total) {
        throw "Lista incompleta: $($profiles.Count) de $total; no se realizara ningun cambio."
    }
    return $profiles.ToArray()
}

function Apply-Group {
    $profiles = @(Get-AllProfiles)
    $changed = 0
    $skipped = 0
    $errors = 0
    foreach ($profile in $profiles) {
        $existing = [string]$profile.extensions_groupId
        if (-not $existing) { $existing = [string]$profile.extensions_group_id }
        $allowed = ([string]$profile.extensions_type -eq 'ALLOW')
        $label = '#' + [string]$profile.serial_num + ' (' + [string]$profile.id + ')'

        if ($existing -eq $GroupId -and $allowed) {
            $skipped++
            continue
        }
        if ($existing -and $existing -ne $GroupId -and -not $ReplaceExistingGroups) {
            Write-Warning "$label: tiene otro grupo de extensiones ($existing); omitido para no eliminar extensiones."
            $skipped++
            continue
        }

        if (-not $Apply) {
            Write-Host "[SIMULACION] $label => grupo $GroupId; extensiones ALLOW"
            $changed++
            continue
        }

        try {
            $id = [uri]::EscapeDataString([string]$profile.id)
            Invoke-LocalApi -Method 'PUT' -Path "/v1/env/$id" -Body @{
                extensions_type = 'ALLOW'
                extensions_group_id = $GroupId
            } | Out-Null
            Write-Host "[ACTUALIZADO] $label"
            $changed++
        } catch {
            Write-Warning "[ERROR] $label : $($_.Exception.Message)"
            $errors++
        }
    }
    Write-Host "Perfiles encontrados=$($profiles.Count); $(if($Apply){'actualizados'}else{'pendientes'})=$changed; omitidos=$skipped; errores=$errors"
    if ($errors) { throw "$errors perfiles fallaron; revisa los errores antes de continuar." }
}

Write-Host "Grupo destino: $GroupId"
if ($ReplaceExistingGroups) {
    Write-Warning 'Se reemplazaran grupos de extensiones existentes. Esto puede quitar otras extensiones.'
}
if (-not $Apply) {
    Write-Host 'MODO SIMULACION: no se modificara ningun perfil. Usa -Apply despues de revisar.'
}
do {
    Apply-Group
    if ($Continuous) {
        Write-Host "Nueva comprobacion en $PollSeconds segundos. Ctrl+C para detener."
        Start-Sleep -Seconds $PollSeconds
    }
} while ($Continuous)

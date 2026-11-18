# Diagnostico_Almacen_033.ps1
# Solo lectura; no muestra valores ficticios ni datos de cuentas.
$ErrorActionPreference = 'Stop'
$root = Join-Path $env:LOCALAPPDATA 'DICloak-Nativo-Almacen-Lab-033'
Write-Host '=== DICloak Almacen 0.3.3 - diagnostico sin datos privados ==='
if (!(Test-Path -LiteralPath $root -PathType Container)) {
  Write-Host 'RESULTADO: CARPETA_LAB_033_NO_ENCONTRADA'
  Write-Host 'Abre la version 0.3.3, pulsa Almacen > Abrir y repite.'
  exit 0
}
$profiles = @(Get-ChildItem -LiteralPath $root -Directory -ErrorAction Stop)
Write-Host ("PERFILES_CON_CARPETA: {0}" -f $profiles.Count)
$index = 0
foreach ($profile in $profiles) {
  $index++
  $files = Join-Path $profile.FullName 'archivos'
  $responses = Join-Path $profile.FullName 'respuestas-pruebas'
  $json = @(); $txt = @(); $zip = @(); $headers = @(); $bodies = @()
  if (Test-Path -LiteralPath $files -PathType Container) {
    $json = @(Get-ChildItem -LiteralPath $files -Recurse -File -Filter 'datos-prueba.json')
    $txt = @(Get-ChildItem -LiteralPath $files -Recurse -File -Filter 'ejemplo-lab.txt')
    $zip = @(Get-ChildItem -LiteralPath $files -Recurse -File -Filter 'ejemplo-lab.zip')
  }
  if (Test-Path -LiteralPath $responses -PathType Container) {
    $headers = @(Get-ChildItem -LiteralPath $responses -Recurse -File -Filter 'headers.raw')
    $bodies = @(Get-ChildItem -LiteralPath $responses -Recurse -File -Filter 'body.raw')
  }
  $jsonHasFields = $false
  foreach ($file in $json) {
    try {
      $obj = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
      if (($obj.PSObject.Properties.Name -contains 'cookie_de_prueba') -and ($obj.PSObject.Properties.Name -contains 'credencial') -and ($obj.PSObject.Properties.Name -contains 'proxy')) {
        $jsonHasFields = $true
        break
      }
    } catch {}
  }
  $cookieHeader = $false
  foreach ($file in $headers) {
    try {
      $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
      $text = [System.Text.Encoding]::Latin1.GetString($bytes)
      if ($text.Contains('Set-Cookie: dicloak_lab=')) {
        $cookieHeader = $true
        break
      }
    } catch {}
  }
  Write-Host ("PERFIL_DE_PRUEBA_{0}: JSON={1} TXT={2} ZIP={3} HEADERS_RAW={4} BODY_RAW={5}" -f $index,$json.Count,$txt.Count,$zip.Count,$headers.Count,$bodies.Count)
  Write-Host ("PERFIL_DE_PRUEBA_{0}: CAMPOS_JSON_DEMO={1} SET_COOKIE_HTTP_DEMO={2}" -f $index,$jsonHasFields,$cookieHeader)
}
Write-Host 'Estos son datos de muestra del servidor local, no del navegador.'
Write-Host 'FIN: no se modifico ningun archivo o perfil.'

# Publica SOLO la compilacion experimental LEGADO que ya esta en tu PC.
# No recompila, no modifica perfiles, no borra datos ni descarga Chromium.
# No es una correccion del fallo "Kernel faltante para este perfil".
# Ejecutar en Windows PowerShell 5.1, con GitHub CLI (gh) autenticado.
[CmdletBinding()]
param([string] $ExePath)
$ErrorActionPreference = 'Stop'
$repo = 'luis5afp/Dyclokpropio'
$tag = 'v30.0.16-rc1'
$ref = 'feature/v30-0-16-rc1-restore-2817-base-20261027'
$name = 'Dyclokpropio_30.0.16-rc1_LEGADO_PRUEBA_win_x64.exe'
Write-Host 'Dyclokpropio v30.0.16-rc1 - PUBLICACION DE PRUEBA, ERROR KERNEL CONOCIDO'
if (-not (Get-Command gh.exe -ErrorAction SilentlyContinue)) {
  throw 'No encuentro gh.exe. Instala GitHub CLI o utiliza la pagina de Releases para subir el EXE de tu PC.'
}
if ([string]::IsNullOrWhiteSpace($ExePath)) {
  $found = @(Get-ChildItem -LiteralPath (Join-Path $env:USERPROFILE 'Documents') -Recurse -File -Filter $name -ErrorAction SilentlyContinue)
  if ($found.Count -eq 1) {
    $ExePath = $found[0].FullName
  } else {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = 'Selecciona el instalador EXPERIMENTAL v30.0.16-rc1 que compilaste'
    $dialog.Filter = 'Instalador v30.0.16-rc1 (*.exe)|*.exe'
    $dialog.CheckFileExists = $true
    $dialog.FileName = $name
    if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
      Write-Host 'Cancelado sin publicar.'
      exit 0
    }
    $ExePath = $dialog.FileName
  }
}
$resolved = (Resolve-Path -LiteralPath $ExePath -ErrorAction Stop).Path
if ((Split-Path -Leaf $resolved) -ne $name) {
  throw ('Nombre de instalador inesperado. Se esperaba: '+ $name)
}
$file = Get-Item -LiteralPath $resolved
if ($file.Length -lt 20000000) {
  throw 'El archivo pesa menos de 20 MB; no parece el instalador NSIS completo.'
}
$reader = [System.IO.File]::OpenRead($resolved)
try {
  $b1 = $reader.ReadByte()
  $b2 = $reader.ReadByte()
  if ($b1 -ne 77 -or $b2 -ne 90) { throw 'No parece ser un EXE valido (cabecera MZ ausente).' }
} finally { $reader.Dispose() }
$sha = (Get-FileHash -LiteralPath $resolved -Algorithm SHA256).Hash.ToLowerInvariant()
Write-Host ('Archivo: '+$resolved)
Write-Host ('Bytes: '+$file.Length)
Write-Host ('SHA256: '+$sha)
Write-Warning 'La prueba del perfil 244 FALLO: Kernel faltante para este perfil.'
Write-Warning 'NO es un instalador corregido ni estable; la recompilacion fue ensamblada localmente desde componentes de terceros.'
Write-Warning 'No utilizar sobre una instalacion funcional. Respaldar los perfiles antes de instalar.'
Write-Warning 'Asegurate de contar con permiso de redistribucion para publicar los binarios incluidos.'
$work = Join-Path $env:TEMP ('dyclok-publicar-v30-0-16-rc1-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work -Force | Out-Null
$shaFile = Join-Path $work 'SHA256SUMS.txt'
$statusFile = Join-Path $work 'TEST_STATUS.txt'
$notesFile = Join-Path $work 'RELEASE_NOTES.txt'
[System.IO.File]::WriteAllText($shaFile, $sha+'  '+$name+[Environment]::NewLine, [System.Text.Encoding]::ASCII)
$status = @(
  'Version: v30.0.16-rc1',
  'Estado: EXPERIMENTAL; NO FUNCIONA CORRECTAMENTE',
  'Fallo reproducido: Kernel faltante para este perfil.',
  'Perfil 244: NO abre ventana Chromium',
  'Perfiles 243/240: NO validados',
  'El instalador se genero en el PC del usuario a partir del runtime legado 2.8.17.',
  'No reemplazar una instalacion funcional.',
  ('SHA256: '+$sha),
  ('Bytes: '+$file.Length)
)
[System.IO.File]::WriteAllLines($statusFile,$status,[System.Text.Encoding]::ASCII)
$notes = @(
  '# Dyclokpropio v30.0.16-rc1 - PRUEBA CON FALLO DE KERNEL',
  '',
  '**AVISO: NO FUNCIONAL, NO INSTALAR COMO VERSION ESTABLE.**',
  '',
  '- Compilacion Windows x64 local basada en el runtime Electron del instalador legado 2.8.17.',
  '- Error conocido y reproducido: "Kernel faltante para este perfil" al pulsar Abrir.',
  '- No hay confirmacion de apertura del perfil 244 ni de los perfiles 243 y 240.',
  '- El repositorio solo documenta el experimento: el EXE se construyo localmente con binarios adicionales que no estan versionados en Git.',
  '- No sustituir una instalacion funcional. Respaldar perfiles antes de cualquier prueba.',
  '- Redistribuir los componentes de terceros solo con los derechos correspondientes.',
  '',
  'Ver TEST_STATUS.txt y SHA256SUMS.txt.'
)
[System.IO.File]::WriteAllLines($notesFile,$notes,[System.Text.Encoding]::ASCII)
$confirm = Read-Host 'Para subir PUBLICAMENTE esta version CON FALLO a tu GitHub escribe PUBLICAR PRUEBA'
if ($confirm -cne 'PUBLICAR PRUEBA') {
  Write-Host 'Cancelado: no se creo ninguna publicacion.'
  exit 0
}
& gh.exe auth status
if ($LASTEXITCODE -ne 0) {
  throw 'GitHub CLI no esta autenticado. Ejecuta gh auth login.'
}
Write-Host ('Creando pre-release '+$tag+' en '+$repo+' ...')
& gh.exe release create $tag $resolved $shaFile $statusFile --repo $repo --target $ref --prerelease --latest=false --title 'Dyclokpropio v30.0.16-rc1 (PRUEBA - KERNEL FALTANTE)' --notes-file $notesFile
if ($LASTEXITCODE -ne 0) {
  throw 'No se pudo crear la release. Si el tag ya existe, compruebalo en GitHub; no se modifico ni sobrescribio.'
}
Write-Host 'PUBLICADO COMO PRE-RELEASE EXPERIMENTAL:'
Write-Host ('https://github.com/'+$repo+'/releases/tag/'+$tag)

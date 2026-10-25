param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    throw "Usa una version con formato X.Y.Z, por ejemplo: 30.0.1"
}

$Branch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $Branch -ne 'main') {
    throw "Debes situarte en la rama main antes de crear una version. Rama actual: $Branch"
}

$Changes = @(git status --porcelain)
if ($LASTEXITCODE -ne 0 -or $Changes.Count -gt 0) {
    throw "Hay cambios sin confirmar. Crea un commit o limpia tu copia antes de publicar."
}

$Tag = "v$Version"

Write-Host "Sincronizando main y etiquetas..." -ForegroundColor Cyan
git fetch origin main --tags
if ($LASTEXITCODE -ne 0) { throw "Fallo git fetch" }
git pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { throw "Fallo git pull" }

$Existing = @(git tag --list $Tag)
if ($LASTEXITCODE -ne 0 -or $Existing.Count -gt 0) {
    throw "La etiqueta $Tag ya existe o no se pudo consultar."
}

Write-Host "Creando tag $Tag..." -ForegroundColor Cyan
git tag -a $Tag -m "Dyclokpropio $Version"
if ($LASTEXITCODE -ne 0) { throw "Fallo git tag" }
git push origin $Tag
if ($LASTEXITCODE -ne 0) { throw "Fallo git push" }

Write-Host ""
Write-Host "Tag $Tag publicado." -ForegroundColor Green
Write-Host "GitHub Actions verificara el runtime y adjuntara el instalador Windows al Release si las pruebas y la compilacion terminan correctamente." -ForegroundColor Green

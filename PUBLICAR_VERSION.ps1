param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

if ($Version -notmatch "^\d+\.\d+\.\d+$") {
    throw "Usa una version con formato X.Y.Z, por ejemplo: 30.0.1"
}

$Tag = "v$Version"

Write-Host "Actualizando rama main..." -ForegroundColor Cyan
git pull --ff-only origin main

Write-Host "Creando tag $Tag..." -ForegroundColor Cyan
git tag -a $Tag -m "Dyclokpropio $Version"
git push origin $Tag

Write-Host ""
Write-Host "Tag $Tag publicado." -ForegroundColor Green
Write-Host "GitHub Actions construira el instalador Windows y lo adjuntara al Release si la compilacion finaliza correctamente." -ForegroundColor Green

# Versiones instalables de Dyclokpropio

El proyecto puede generar un instalador NSIS de Windows x64 usando el runtime recuperado. Se distinguen dos números:

- **Versión interna:** `3.0.0` en `package.json`, conservada para compatibilidad con el runtime original.
- **Versión de entrega:** la etiqueta de GitHub (por ejemplo `v30.0.1`), usada para nombrar el instalador y el Release. No se escribe en `package.json`.

## Antes de publicar

```powershell
npm install --legacy-peer-deps
npx electron-builder install-app-deps
node tools/verify-build-assets.js
node tools/verify-safe-base.js
npm run build:win
```

Las comprobaciones verifican recursos disponibles y hashes críticos. La compilación por sí sola **no garantiza** que los perfiles, servicios ni funciones de la aplicación funcionen: se necesita una prueba en Windows antes de distribuir el `.exe`.

## Publicación por GitHub Actions

1. Revisa y fusiona los cambios en `main`, después de probarlos.
2. En `main`, publica una etiqueta con formato `vX.Y.Z` (por ejemplo, `v30.0.1`).
3. La acción [Build Windows Installer](../.github/workflows/release-windows.yml) verifica la base, instala las dependencias y crea el instalador.
4. El Release de esa etiqueta recibe `Dyclokpropio_30.0.1_win_x64.exe` y `SHA256SUMS.txt`. El nombre es de entrega; no altera la versión interna.

El script `PUBLICAR_VERSION.ps1` puede crear y enviar la etiqueta desde tu computadora después de situarte en `main` y confirmar el estado local:

```powershell
.\PUBLICAR_VERSION.ps1 30.0.1
```

## Compilar sin publicar

En GitHub, abre **Actions → Build Windows Installer → Run workflow**. La ejecución manual adjunta el instalador y `SHA256SUMS.txt` como artefactos descargables de la propia ejecución, sin crear un nuevo GitHub Release.

## Qué no debe hacerse

No copies `SourceData/` al repositorio para reproducir el instalador, ya que es un perfil de navegador potencialmente privado. No cambies hashes de `tools/verify-safe-base.js` para forzar una publicación sin investigar antes la diferencia.

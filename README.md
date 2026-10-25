# Dyclokpropio — recuperación del instalador Windows

Esta copia se reconstruyó a partir de **Dyclokpropio_30.0.0_win_x64.exe** (SHA-256: `e29f761cce9a744d00dd1ccf82a29209a2f42c07b32c5567054419d08651dfde`). **El nombre del archivo es 30.0.0, pero la versión interna recuperada de `package.json` es 3.0.0**. No deben confundirse estas versiones.

## Qué contiene este repositorio

- El runtime compilado de Electron 31.7.7 (`dist-electron/`) y la interfaz compilada Vue/Vite (`dist/`).
- El worker desempaquetado, `DicSyncService.exe`, las extensiones de `plugins/`, FFmpeg, el icono de bandeja y `resources/elevate.exe`.
- `package.original.json` tal como se extrajo de `app.asar`, y `package.json` adaptado para ejecutar y empaquetar la recuperación.
- `src/`, que contiene **reconstrucciones parciales para mantenimiento**, no el código fuente completo original. El punto de entrada del build habitual sigue siendo `dist-electron/main.js`.

**No es el proyecto fuente original.** La distribución incluía bundles compilados/ofuscados, no todos los archivos `.vue`, `.ts` ni la configuración original de desarrollo. Un cambio en `src/` no modifica automáticamente el instalador habitual.

### Archivos omitidos a propósito

No se conserva `SourceData/` en Git: es un perfil de Chromium presente en el instalador de referencia que puede contener historial o datos personales. **No lo subas a un repositorio público.** Las dependencias y módulos nativos de Electron se recuperan durante `npm install` y el paso `electron-builder install-app-deps`, en lugar de versionar `node_modules/`.

Consulta [RUNTIME_FILES_REQUIRED.md](RUNTIME_FILES_REQUIRED.md) para comprobar los recursos presentes.

## Ejecutar el proyecto recuperado (Windows)

```powershell
npm install --legacy-peer-deps
node tools/verify-build-assets.js
node tools/verify-safe-base.js
npm start
```

Las dos verificaciones comprueban, respectivamente, que existen los recursos necesarios y que los once archivos críticos protegidos coinciden con la base analizada. **No sustituyen una prueba funcional de la interfaz, los servicios o los perfiles de navegador en Windows.**

## Crear un instalador Windows x64

```powershell
npm install --legacy-peer-deps
npx electron-builder install-app-deps
node tools/verify-build-assets.js
node tools/verify-safe-base.js
npm run build:win
```

El instalador aparece en `release/`. El flujo de GitHub Actions aplica estas verificaciones antes de publicar. Al usar una etiqueta como `v30.0.1`, el instalador se entrega con el nombre `Dyclokpropio_30.0.1_win_x64.exe` sin cambiar la versión interna 3.0.0 del runtime recuperado. Consulta [docs/RELEASES.md](docs/RELEASES.md).

## Recomendaciones al modificar

1. Conserva una rama o etiqueta de la recuperación original.
2. Haz cambios en otra rama y compara su comportamiento en Windows.
3. No reemplaces los bundles críticos sin pruebas ni actualices hashes únicamente para silenciar una verificación.
4. Si aparece el código fuente original, migra las mejoras y deja de editar directamente los bundles compilados.

La interfaz recuperada tiene deshabilitada la comprobación **automática** de actualizaciones al iniciar y cada diez minutos. El mecanismo de avisos/actualización sigue incluido; esto es una modificación deliberada respecto del instalador original y está documentada en [docs/UPLOADED_BASE_3.0.0.md](docs/UPLOADED_BASE_3.0.0.md).

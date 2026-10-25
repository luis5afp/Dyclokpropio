# Recursos necesarios para el build de Windows

## Estado del repositorio

Este repositorio **sí incluye** los archivos de runtime principales usados en la reconstrucción:

- `dist/` y `dist-electron/`, incluido `dist-electron/worker/downloadWorker.js`.
- `dist/assets/sync/DicSyncService.exe`.
- `plugins/` (tres extensiones recuperadas).
- `vendor/ffmpeg/bin/ffmpeg.exe`.
- `resources/elevate.exe` y `resources/electron/tray-icon.png`.

La lista de archivos incluidos se comprueba con:

```powershell
node tools/verify-build-assets.js
```

Para validar los hashes protegidos del runtime original:

```powershell
node tools/verify-safe-base.js
```

Ambas comprobaciones deben pasar antes de emitir un instalador nuevo. Las bibliotecas `node_modules/` y los módulos nativos se instalan por separado con `npm install --legacy-peer-deps` y `npx electron-builder install-app-deps` en Windows.

## Archivo excluido deliberadamente

`SourceData/` **no se incluye** en Git. El instalador de origen contiene un perfil de navegador Chromium y puede contener información privada (cookies, historial u otros datos del perfil). No es código fuente y **no debe subirse al repositorio público**. Tampoco es un requisito configurado en `electron-builder.yml` para este build.

El instalador reconstruido puede no reproducir al byte la instalación original. La ausencia de `SourceData/`, las dependencias reconstruidas, la firma y la modificación intencional del chequeo automático de actualizaciones son diferencias relevantes. Para garantizar el funcionamiento hay que probar la aplicación ya instalada en Windows.

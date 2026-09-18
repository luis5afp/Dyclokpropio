# Archivos de runtime no incluidos en Git

Esta copia está pensada para un repositorio GitHub público y omite datos/binarios que no conviene versionar como código fuente.

La recuperación completa conserva aparte:

- `SourceData/`
- `plugins/`
- `vendor/ffmpeg/bin/ffmpeg.exe`
- `resources/elevate.exe`
- `resources/electron/tray-icon.png`
- `dist/assets/sync/DicSyncService.exe`

Para intentar reproducir exactamente el instalador recuperado, copia esos elementos desde el paquete completo antes de ejecutar `npm run build:win`.

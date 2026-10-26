# v30.0.13 — reparar el adaptador IPC de caché en Electron 31

El TXT del 2026-10-26 12:32 UTC contiene 263 eventos y tres intentos.
Los tres pasan expandCheck pero terminan en:
`paramsMerge/cache-start -> ipc clear-dev-cache IPC_NO_HANDLER -> cache-fail`.

## Causa concreta de v30.0.12
`installCacheIpcCompatibility` exigía `typeof ipcMain.hasHandler === 'function'`.
El runtime usa Electron 31.7.7, cuya implementación `ipcMain` ofrece
`handle`, `handleOnce`, `removeHandler`, pero NO `hasHandler`.
El requisito no se cumplía; el bootstrap absorbía esa excepción y por tanto
no instalaba el transporte estable. Las pruebas antiguas se equivocaban al
simular un `hasHandler` inexistente.

## Cambio
- El adaptador solo requiere las APIs documentadas `handle` y `removeHandler`.
- El chequeo `hasHandler` es estrictamente opcional para entornos simulados;
  en Electron 31 el puente se registra antes de cargar el runtime original.
- El runtime original sigue ejecutando su handler con parámetros y retornos
  reales; no se simula ninguna limpieza ni se alteran datos de perfil.
- El test de IPC y el de arranque simulan ahora `ipcMain` SIN `hasHandler`;
  el test confirma que el handler se registra, reenvía la operación real,
  mantiene falsos/nulos/excepciones y rechaza invocaciones no confiables.
- No se alteran verificadores SHA-256, cookies, archivos ni parámetros.

## Validación requerida
La compilación y el arranque Windows CI son necesarios antes de publicar.
La apertura real del perfil 244 debe probarse después: no hay garantía de
que no aparezca otro error en `paramsMerge` o en una etapa posterior.

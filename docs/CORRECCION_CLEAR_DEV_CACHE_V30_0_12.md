# v30.0.12 — restaurar disponibilidad del canal clear-dev-cache

## Datos verificados del informe
En la captura del 26-10-2026 a las 09:45 UTC hubo dos intentos
independientes con la misma secuencia: expandCheck success, paramsMerge
cache-start, clear-dev-cache IPC_NO_HANDLER, cache-fail y paramsMerge fail.
No llegó a keys-start, lockEnv ni openEnv.

## Código recuperado
El Electron main original define el canal Vv='clear-dev-cache' y el
manejador asíncrono _0x2a7edd(event,{clearTypes,id,localDataConfig}).
Un verificador en VM aislada determinó que lo registra mediante
**ipcMain.handle**, no ipcMain.on. Esto descartó un primer prototipo
que intentaba adaptar un listener 'on' a 'handle'.

La función original aplica reglas por tipos y políticas de limpieza;
realiza lecturas y operaciones selectivas sobre datos del perfil,
y devuelve resultados de éxito, salto y error. No se recreó ni omitió
esta rutina, ni se fabricaron hashes o resultados positivos.

## Corrección dirigida al error de transporte IPC
- Antes de cargar el runtime original, se instala un único
  ipcMain.handle('clear-dev-cache') que actúa como transportador estable.
- Cuando el runtime original intenta registrar SU handle, se captura
  la función original y se utiliza exclusivamente esa función con los
  parámetros sin cambios. No se modifica el contenido de los perfiles.
- Si el original aún no está registrado al invocar, se espera un tiempo
  acotado para permitir inicialización tardía.
- Si nunca se registra, se rechaza con
  CACHE_ORIGINAL_HANDLER_NOT_REGISTERED y un código diagnóstico filtrado
  IPC_ORIGINAL_MISSING. No se finge haber limpiado correctamente.
- Si el original devuelve false/null o produce una excepción, se propaga
  exactamente tal resultado. Los tipos de limpieza y su selectividad
  siguen siendo responsabilidad exclusiva del handler original.
- Si el original se desregistra, las llamadas siguen rechazándose hasta
  que se registre de nuevo. Solo el renderer local puede invocar el puente.
- Otros canales IPC, política SHA-256, extensiones y arranque normal
  permanecen sin modificaciones.

## Limitaciones
La comprobación de CI confirma el método de registro en el binario
recuperado; las pruebas automatizadas validan el transporte, pero no
reproducen el PC con el perfil 244. La v30.0.12 es una corrección
fundamentada para el IPC_NO_HANDLER, pero **no una confirmación de que
todos los perfiles ya abren**. El siguiente informe mostrará si
paramsMerge avanza a cache-success/keys-start y qué falla después.

Respaldar los perfiles y no borrar carpetas de caché ni deshabilitar
comprobaciones de integridad para forzar la apertura.

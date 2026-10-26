# v30.0.12 — puente IPC del limpiador original clear-dev-cache

## Evidencia del PC

En Dyclok-Diagnostico-Completo-20261026-094537.txt, dos aperturas independientes
completaron expandCheck y geo-ready. Ambas fallaron en paramsMerge:

- cache-start;
- ipc request clear-dev-cache;
- ipc error clear-dev-cache / IPC_NO_HANDLER;
- cache-fail;
- paramsMerge fail.

Por eso aún no se alcanzan keys-start, lockEnv ni openEnv.

## Implementación original recuperada

El runtime Electron 3.0.0 contiene la operación original
\`Vv='clear-dev-'+...\` con nombre resuelto clear-dev-cache y una función
asíncrona \`_0x2a7edd(event,{clearTypes,id,localDataConfig})\`.
La operación conserva la política de limpieza de datos por tipo, opciones de
configuración, directorios del perfil y resultados informativos. **No debe**
reimplementarse con borrados de rutas arbitrarias ni con un resultado falso
de éxito. El método de registro ofuscado se comprueba en CI mediante un
analizador en VM aislada; no se ejecuta la aplicación real en esa comprobación.

## Compatibilidad propuesta

Al arrancar Electron, se interceptan *solo los registros* del canal
clear-dev-cache. Si el runtime registra su manejador original mediante
ipcMain.on() y no existe un manejador para invoke(), la misma función
original se conecta a ipcMain.handle(). Así, ipcRenderer.invoke() ejecuta
el código de limpieza original conservando clearTypes/id/localDataConfig y
propagando los errores reales. Si el runtime instala posteriormente su
propio handle(), se retira el adaptador y tiene prioridad el original.

Solo el renderer local de la aplicación puede utilizar el puente.
No se graban IDs, cookies, rutas, argumentos ni resultados.
No se desactivan políticas de borrado selectivo, hashes, verificación remota,
extensiones ni controles de seguridad.

## Pruebas

- El puente no existe hasta observar un registro original; no inventa un
  resultado válido ante un manejador ausente.
- La ruta original se invoca exactamente una vez con los mismos parámetros,
  y las respuestas/rechazos se conservan.
- Un manejador nativo tardío tiene prioridad y los orígenes remotos se rechazan.
- Una prueba de arranque Electron simulado demuestra que el puente se instala
  antes del runtime recuperado.
- El instalador solo puede publicarse si pasan las pruebas, se genera EXE y
  la prueba de arranque de Windows termina sin errores.

**Estado**: corrección de compatibilidad dirigida al fallo capturado.
El arranque completo del perfil 244 debe validarse en el PC del usuario.

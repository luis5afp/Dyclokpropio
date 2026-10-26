# v30.0.11 — análisis del bloqueo en paramsMerge

El informe del 26-10-2026 contiene 180 eventos y dos intentos de abrir perfiles.
En ambos, expandCheck termina correctamente y paramsMerge falla inmediatamente
después de un IPC_ERROR con canal oculto como other.

El código original de paramsMerge configura idioma, zona horaria, acceso,
sincronización y tratamiento de datos locales. Bajo ciertas configuraciones
invoca clear-dev-cache, pero aún no se ha demostrado que esa llamada falle.

Se añaden únicamente checkpoints: begin, config-ready, geo-start, geo-ready,
cache-start, cache-success, cache-fail, keys-start y keys-success.
Se añaden los nombres de pocos canales IPC de lista fija y categorías de
error IPC: IPC_NO_HANDLER, IPC_NOT_FOUND, IPC_PERMISSION, IPC_TIMEOUT,
IPC_INVALID_ARGUMENT, IPC_TYPE_ERROR e IPC_ERROR.

La captura solo se activa tras pulsar Diagnóstico > Iniciar.
Los mensajes libres, argumentos, IDs de perfiles, cookies, URLs y rutas se omiten.
No se modifica el resultado ni se omite la limpieza de datos locales,
y los errores siguen propagándose normalmente.

IMPORTANTE: esta compilación es DIAGNÓSTICA. La causa del fallo en el PC
afectado todavía debe identificarse; no se declara corregida de forma definitiva.

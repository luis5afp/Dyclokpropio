# Base exacta subida por el usuario

Referencia:

- archivo: `Dyclokpropio_30.0.0_win_x64(2).exe`
- ProductVersion: `3.0.0`
- FileVersion: `3.0.0.2949`
- SHA-256: `e29f761cce9a744d00dd1ccf82a29209a2f42c07b32c5567054419d08651dfde`

La inspección estática confirmó que el `app.asar` usa el mismo runtime recuperado
que sirve de base al repositorio.

## Compatibilidad protegida

Producción conserva sin cambios el proceso principal, preload, OpenAPI,
sincronizador, package.json, index.html y la entrada principal del renderer.
Los hashes de esos archivos se verifican antes de compilar.

El código reconstruido bajo `src/` queda disponible para seguir editando y
entendiendo el programa, pero el build normal continúa usando el runtime
original.

## Cambio funcional mínimo

Solo se deshabilita el disparo automático de revisión de actualización al
iniciar la interfaz y el temporizador de 10 minutos.

La implementación de avisos/actualización sigue presente. No se cambian
endpoints generales, líneas API, almacenamiento, appId ni rutas de configuración.

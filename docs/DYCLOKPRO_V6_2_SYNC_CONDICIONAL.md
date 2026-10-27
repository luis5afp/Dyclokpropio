# Dyclokpro v6.2 — Sincronización condicional y perfiles locales

## Objetivo
Abrir perfiles **locales independientes** con Chromium incluido. Siempre que exista
un mecanismo de exportación/sincronización autorizado para el perfil administrado,
importar sus datos únicamente después de validar permiso, integridad y compatibilidad.

## Hallazgo técnico confirmado
El control original del perfil remoto requiere una respuesta de `/v1/env/{id}/lock_env`
con token para determinados flujos. Dicho token no equivale al token general de sesión
almacenado en el cliente. Quitar esta dependencia no produce una API de cookies.

Según la documentación del proveedor, Data Sync puede incluir cookies, almacenamiento
local, IndexedDB, marcadores, contraseñas y datos de extensiones. Está gobernado por
permisos/planes/configuración. La Open API local necesita `X-API-KEY`. **No hay en el
material comprobado un endpoint autorizado específico que exporte el estado completo
de las cookies de cualquier perfil remoto para nuestro administrador local.**

Documentación pública:
- https://help.dicloak.com/global-settings-data-sync/
- https://help.dicloak.com/dicloak-api-browser-profile-interface/
- https://help.dicloak.com/api-development-guide/
- https://help.dicloak.com/create-profile-general-setting/

## Estados que debe mostrar la interfaz
1. **Local independiente**: creado y almacenado en `%LOCALAPPDATA%\Dyclokpro\LocalProfiles`.
   Abre su propia carpeta `User Data`; no necesita `lock_env`.
2. **Importación autorizada disponible**: el usuario exporta sus datos desde una
   interfaz del proveedor permitida, o autoriza un conector que provea la exportación.
   Validar contenido, alcance, dueño y tipo antes de importar.
3. **Copia local actualizada**: importar una copia verificada de manera atómica y
   registrar solo versión/fecha del respaldo, nunca contenido o secretos.
4. **Sin conexión / credenciales inválidas / no hay permiso**: no inventar token,
   no extraer nada mediante controles saltados. Conservar y abrir la última copia
   local **solo del perfil independiente autorizado** si existe.
5. **No hay copia local válida**: informar "Sin datos locales; exporta o inicia
   sesión con autorización". No fingir sincronización.

## Política de sincronización
- La comprobación de actualización de la **aplicación** permanece desactivada.
  No confundirla con la sincronización autorizada de **datos del navegador**.
- Siempre se opta por la última copia local íntegra frente a importar datos
  incompletos, antiguos o no autorizados.
- La sincronización no puede forzar una sesión remota vigente. Cookies caducadas,
  tokens revocados y sesiones invalidas pueden exigir volver a iniciar sesión.
- No exportar cookies, contraseñas o tokens a registros, informes, GitHub ni releases.
- No sobrescribir el perfil local mientras Chromium esté abierto.
- No borrar el perfil anterior tras errores de importación.
- Sin actualización silenciosa: mostrar fecha y origen (local o nube autorizada).
- No intentar reutilizar tokens de bloqueo remoto ni acceder a perfiles de terceros.
- Si el proveedor requiere `lock_env` para el perfil administrado, esa acción
  mantiene sus requisitos. El gestor local **no crea una excepción al control remoto**.

## Pruebas mínimas antes de publicar
- Chromium local inicia con un `--user-data-dir` nuevo y conserva datos después de cerrar.
- Abre dos perfiles diferentes en carpetas independientes y bloquea dos aperturas del mismo.
- Detecta y conserva copias tras error de conexión, error de permisos o datos truncados.
- Importación autorizada: cookies, LocalStorage, IndexedDB y proxy cuando sean exportables.
- El instalador conserva el navegador y perfiles previos de v6.1; no distribuye
  `SourceData` ni `Chromium/User Data`.
- Comprobar que el controlador remoto original sigue usando los permisos del proveedor.

## Estado
La rama `release/v6.2-local-chromium-profiles` incluye un prototipo del gestor local.
**Aún no tiene sincronizador remoto probado ni release v6.2 publicado.**

# DyclokPRO v6.37 — reconstrucción funcional sobre DICloak 3.0.7

## Modelo de integración

Separamos tres versiones:
- DyclokPRO: versión del instalador y de su código fuente propio, `6.37.0`.
- DICloak: versión del motor original, `3.0.7`.
- Parche del motor oficial: `1.2.4.1`.

No reemplazamos el cliente HTTP oficial 3.0.7 por el de 2.8.17 ni ajustamos su versión para simular compatibilidad. El ejecutable oficial y `resources/app.asar` permanecen byte por byte intactos. Antes de cada arranque se comprueban la versión PE `3.0.7.3079` y el hash del ASAR `b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf`.

## Matriz de paridad con v6.28

| Función solicitada | Situación en v6.37 | Código propio |
|---|---|---|
| Inicio de sesión real | Motor 3.0.7 original, no reimplementado | `Program.cs`, `Engine307Guard.cs` |
| Sesión principal persistente | Entorno Windows original preservado; prueba remota pendiente | `Program.cs` |
| Cuentas auxiliares | Aislamiento de APPDATA/LOCALAPPDATA; login remoto pendiente | `Program.cs` |
| Pestañas de cuentas | Integradas, nombre desde cuentas.json | `Program.cs` |
| Añadir cuenta | Integrado, crea identidad local y abre el motor oficial | `Program.cs` |
| Renombrar cuenta | Integrado, preserva campos existentes de cuentas.json | `Program.cs` |
| Cambio de cuenta | Foco de ventana sin alterar ASAR | `Program.cs` |
| Gestión de perfiles | Consulta lista oficial V1, con clave API local voluntaria | `OfficialProfilesV1Window.cs` |
| Abrir perfil | `PATCH /openapi/v1/env/{id}/open`, confirmación; prueba en cuenta real pendiente | `OfficialProfilesV1Window.cs` |
| Cerrar perfil | `PATCH /openapi/v1/env/{id}/close`, confirmación; prueba en cuenta real pendiente | `OfficialProfilesV1Window.cs` |
| Archivos automáticos | API V2 experimental opt-in; no se intercepta tráfico interno del motor | `OfficialApiArchiveWindow.cs` |
| Cookies / IndexedDB originales | NO reconstruidos ni extraídos automáticamente; sujetos a capacidad oficial | — |
| Panel de archivos existentes | Integrado, conteo y explorador por carpeta | `ArchiveAuditWindow.cs` |
| Perfiles locales | Integrado en solo lectura | `LocalProfilesWindow.cs` |
| Importar exportaciones | Copia de archivos elegidos, sin reescribir origen | `Program.cs` |
| Carpeta Cuentas junto a instalación | Enlace NTFS opcional con protección de datos | `Program.cs` |
| Diagnóstico lateral plegable | Botón `Diag`; eventos locales sin credenciales | `SessionDiagnostics.cs` |
| Diagnóstico de fallos de sesión | Registra inicio/cierre de proceso, NO respuesta interna del servidor | `SessionDiagnostics.cs` |
| Instalador EXE Windows x64 | Pipeline NSIS v6.37 con motor oficial; prerelease | `.github/workflows/publish-v6-37-reconstruction-official307.yml` |

## Seguridad y límites

- El API Key de Open API solo vive en memoria de la ventana, nunca en `cuentas.json`.
- `SessionDiagnostics.cs` guarda **tipo** de cuenta, eventos, PID, fecha UTC y códigos de salida; no copia las sesiones del navegador.
- No se cambian firmas `X-DC-M1`/`X-DC-M2`, no se reescriben rutas de autenticación, no se falsifican tokens.
- Un rechazo de API con código distinto de `0` es un error visible; no se reinterpreta como éxito.
- El módulo V2 de archivado puede guardar JSON con valores sensibles sin cifrar si el usuario lo habilita. Es experimental y **no debe activarse automáticamente**.

## Criterios para declarar reconstrucción final y versión estable

Todavía pendientes de prueba manual en Windows del usuario:
1. Iniciar sesión en el cliente oficial 3.0.7, cargar todos los perfiles sin regresar a login y reiniciar.
2. Abrir dos cuentas aisladas; cambiar de pestañas, comprobar nombres, no compartir sesiones.
3. Abrir/cerrar perfiles en cada cuenta desde la interfaz V1 con clave y permisos concedidos.
4. Validar todo el flujo de archivos y archivado con un perfil de prueba y constatar qué datos entrega realmente la API oficial.
5. Probar el instalador sobre la v6.28 con respaldo previo de `%LOCALAPPDATA%\DyclokPRO\Cuentas`.
6. Diagnosticar la pantalla negra si ocurre: diferencias entre fallo del renderer y cierre de proceso.

**Estado:** reconstrucción funcional de la envoltura DyclokPRO sobre motor 3.0.7 oficial, no reconstrucción del proyecto fuente propietario original. No debe describirse como 100% equivalente hasta cumplir las pruebas reales.

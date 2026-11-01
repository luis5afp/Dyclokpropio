# Despiece del motor DICloak 3.0.7 y adaptación sobre DyclokPRO v6.28

Fecha: 2026-10-31. Estado: rama experimental `fix/v6.36-desde-v6.28-base`; **NO es motor oficial sustituido ni versión estable publicada**.

## Fuentes y hashes de la comparación

**EXE base exacto:** `DyclokPRO_6.28_win_x64.exe`, 330 865 096 bytes, SHA-256 `954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606`, tag `v6.28`. Script fuente `tools/release-v6-28-internal307-ab.py`. Se construyó sobre cliente nativo v6.16/2.8.17 (SHA-256 de main original `0b2d43aa827f36c704f663253a859d3398125cdd184baaed2e0c648abfaf8a41`) cambiando *solo* el `package.json.version` a `3.0.7` como experimento.

**Motor oficial real:** `DICloak_3.0.7_win_x64.exe`, SHA-256 `01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae`. Su `resources/app.asar` original tiene SHA-256 `b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf`. Verificadores históricos del repositorio `tools/release-v6-29-official307.py` y `tools/release-v6-30-intact307.py`.

## Inventario estructural del motor y compatibilidad

| Subsistema | Binario v6.28 | Motor genuino 3.0.7 | Tratamiento |
|---|---|---|---|
| Proceso principal Electron | `dist-electron/main.js` original de 2.8.17 con prelude DyclokPRO | `dist-electron/main.js` y `main-gLlCfI66.js` del 3.0.7 | **No copiar** el principal nuevo sobre el antiguo; son compilaciones distintas |
| Frontend de login/lista de perfiles | `dist/assets/index-C7Bw2kjt.js`, SHA-256 `734000957d8abc026e11b1a586cbad8aaf68dcdc998bc959ce67103b0269725d` | `dist/assets/index-CZSYLU7X.js`, SHA-256 `d38fde9bc5cbb8e20a05833ac505660ba374c2788ef8888a5d4093ca1cfd270a` | **No intercambiar** bundles ni cabeceras firmadas |
| Preload y contexto IPC | Preload de la familia 2.8.17, `window.ipcRenderer` en los módulos de DyclokPRO | `dist-electron/preload/index.js` distinto; SHA `ddbb3adb390ac71e8eb5842da0835dd90f110eae12617e3593ec59be6e82ae1d` | IPC complementario explícito y restringido |
| Versión interna | Versión visible del package experimentalmente modificada a `3.0.7`; **funciones reales 2.8.17** | Versión del `package.json` oficial `3.0.7` | No convertir un número en falsa compatibilidad |
| Seguridad y firma | Antiguas funciones de autenticación/solicitudes; el cierre al cargar perfiles ha sido observado | Nuevas comprobaciones y validación de `app.asar` | **No eludir ni desactivar** comprobaciones |
| Perfiles del navegador | UI DyclokPRO integrada, selección y apertura | API oficial + núcleos de Chromium gestionados por versión | Acceso de solo lectura mediante API local oficial, no parche a `/gin/v1/env/list` |
| Múltiples cuentas de DICloak | Pestañas locales y `Cuentas/<id>/Electron` de v6.28 | Restricciones de acceso simultáneo del proveedor | Mantener archivos/tabs existentes, **no prometer múltiples logins simultáneos** |
| Archivos automáticos | `raw-archive-ui.js` intercepta respuestas XHR/fetch; `raw-archive-backend.js` escribe JSON sin cifrar | API local V1/V2 con clave autorizada | Módulo adicional opcional, no intercepta paquetes firmados |
| Cookies, marcadores, IndexedDB | JSON observados, no todos los archivos físicos | API y sincronización nativa gestionadas por el proveedor | No afirmar recuperación de bases de datos completas por un GET |
| Núcleos Chromium | Chromium 142 empaquetado y scripts existentes | Kernel descargado/gestionado por cliente oficial | No mezclar `chrome.dll`/extensiones entre generaciones |

## Interfaces oficiales identificadas por documentación del proveedor

- `GET http://127.0.0.1:<puerto>/openapi/v2/status`: estado y versión del servicio local.
- `GET .../openapi/v2/capabilities`: información declarada de capacidades.
- `GET .../openapi/v2/profiles?page=1&page_size=50`: listado con nombres e IDs.
- `GET .../openapi/v2/profiles/<id>`: detalle del perfil autorizado.
- `GET .../openapi/v1/env/list?page_no=1&page_size=50`: alternativa V1 documentada.
- `PATCH .../openapi/v1/env/<id>/open` y `POST .../openapi/v2/profiles/<id>/start` existen, pero **no se activan en el adaptador inicial** para no alterar estados del navegador ni provocar conflictos de sesión.

La clave `X-API-KEY` se introduce manualmente en la ventana y solo se envía al servicio local. No guardarla en disco ni en archivos de diagnóstico. El usuario debe habilitar Open API desde el programa oficial, y las solicitudes pueden no estar autorizadas por plan/permiso.

Documentación:
- https://help.dicloak.com/api-development-guide/
- https://help.dicloak.com/zh/local-api-v2-%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E6%8E%A5%E5%8F%A3/
- https://help.dicloak.com/zh/local-api-v2-%E7%8E%AF%E5%A2%83%E6%8E%A5%E5%8F%A3/
- https://help.dicloak.com/new-subscriber-getting-started-manual/

## Código realizado en v6.36 (sin reemplazar v6.28)

1. `release-build/v6.36/compat307-backend.js`: solo GET a `127.0.0.1`, valida puerto, clave, ruta y renderer, limita tamaño/tiempo, verifica `code===0`, rechaza `300003` y no imprime secretos. Permite consulta de lista V1/V2, detalle V2 y copia exacta de una respuesta individual en `ArchivoOriginal/Perfiles/<nombre> [<id>]`.
2. `release-build/v6.36/compat307-ui.js`: panel lateral **cerrado por defecto**, clave de API en campo de contraseña y borrado al ocultar, botón para listas, consulta de un perfil y guardado puntual. No intercepta XMLHttpRequest ni modifica el login.
3. `tools/release-v6-36-from-v628-compat.py`: comienza **exclusivamente** con el EXE original v6.28 cuyo SHA-256 coincide; comprueba el código HTTP y main originales, copia todos los recursos del v6.28 y agrega el adaptador opcional al propio paquete antiguo. Conserva la versión técnica ya experimental que tenía v6.28, **sin simular que contiene el motor genuino**.
4. `tools/test-v6-36-compat307.cjs`: test simulado para respuesta exitosa y rechazo `300003`, carpetas por nombre real, bytes idénticos, origen IPC y host local.
5. `release-build/v6.36/raw-archive-ui.js`: el mismo archivador de v6.28, con una única validación adicional (`code === 0`) para NO guardar como archivos originales respuestas de sesión rechazada `300003`; nunca altera las respuestas de red ni los códigos que recibe el cliente.
6. `tools/test-v6-36-archive-300003.cjs`: compara el JavaScript anterior y el nuevo tras normalizar los saltos de línea; simula una respuesta de error y otra válida y comprueba que esta última conserva su texto exacto.
7. `.github/workflows/test-v6-36-compat-from-v628.yml`: prueba en Windows, incluyendo extracción del instalador publicado exacto y revisión del arranque heredado.

## Qué NO se puede concluir ni prometer

- El adaptador NO arregla automáticamente el logout provocado por el frontend interno 2.8.17 de v6.28. No está validado con una sesión real ni sustituye el autenticador.
- La API del 3.0.7 **requiere que el cliente oficial esté funcionando y autorizado**. No se puede obtener acceso a su servicio fingiendo la versión de la app anterior.
- El proveedor no permite iniciar sesión en múltiples cuentas DICloak simultáneas en un único dispositivo en las condiciones descritas en su guía; varias ventanas de perfiles de una sola cuenta son otra función.
- No se ha demostrado que el servidor entregue los archivos originales físicos de Chromium, IndexedDB o LocalStorage mediante estas consultas. Solo guardar JSON de respuesta autorizada no equivale a descargar archivos completos del perfil.
- NO implementar un interceptor que transforme respuestas de `/gin/v1/env/list` ni falsifique tokens, `X-Version`, `X-DC-M1` o `X-DC-M2`. Si la sesión se rechaza, registrar el código redacted y dejar el cierre de sesión en manos del proveedor.

## Puerta de publicación

No declarar una siguiente versión «con motor 3.0.7 incorporado» solo porque se agregó la API local. Para ello haría falta un diseño acordado por el proveedor, con integridad del binario oficial conservada y pruebas completas de autenticación, listado y apertura de perfiles en un Windows real.

La rama v6.36 es por ahora una **adaptación experimental de la interfaz v6.28 al servicio API de 3.0.7**, no una release ni una sustitución del motor.

# DyclokPRO — reconstrucción compatible con el motor DICloak 3.0.7

## Qué significa «desmenuzar»

Esta línea de desarrollo analiza el paquete oficial **sin alterar el ejecutable o el ASAR** y produce un mapa de responsabilidades a partir de metadatos, tamaños, hashes y referencias estáticas. No afirma haber recuperado el proyecto fuente privado original. Las nuevas funciones se programan como código propio.

**Instalador original 3.0.7 (SHA256):** `01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae`.

**ASAR original (SHA256):** `b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf`.

**Versiones del paquete:** `version=3.0.7`, `patchVersion=1.2.4.1`.

## Mapa técnico real del ASAR 3.0.7

| Capa | Archivo identificado por análisis automático | Interfaz observable |
|---|---|---|
| Principal Electron | `dist-electron/main-gLlCfI66.js` | Ventanas, configuración, información de versión y servicios |
| API/red nativa | `dist-electron/openapi/appVersionHeaders-B8wop-qt.js` | Referencias a encabezados de versión y firma |
| Servicio API | `dist-electron/openapi/index-7A4pVWO9.js` | Servicios del proceso de API |
| IPC/preload | `dist-electron/preload/index.js` | Puente entre renderer y proceso principal |
| Interfaz | `dist/assets/index-CZSYLU7X.js` | Vista, sesión de frontend y llamadas IPC |
| Sincronización | `dist-electron/synchronizer/` | Funcionalidad de sincronización de ventanas |

Los nombres y símbolos se obtuvieron del ASAR oficial verificado. Una referencia literal a un encabezado no revela por sí sola el algoritmo que lo genera ni garantiza que una solicitud sea aceptada.

El archivo **`tools/map-official307-runtime.py`** genera:
- `engine307-map.json`: mapa de módulos principales, SHA256 y señales de integración.
- `engine307-report.md`: resumen en formato legible.

La prueba automática de Windows descarga y verifica el instalador original, construye el mapa y compila el lanzador independiente. El reporte JSON/Markdown se entrega como artefacto de GitHub Actions, sin exportar código propietario ni secretos.

## Código propio de DyclokPRO integrado

| Componente | Archivo propio | Situación |
|---|---|---|
| Lanzador, pestañas y cuentas | `release-build/v6.35/Launcher/Program.cs` | Existente y conectado |
| Verificación estricta de motor | `release-build/v6.35/Launcher/Engine307Guard.cs` | Nuevo y conectado al inicio de cada cuenta |
| Lista de perfiles del motor | `release-build/v6.35/Launcher/OfficialProfilesV1Window.cs` | Nuevo, conectado a ambos menús |
| Panel de diagnóstico | `release-build/v6.35/Launcher/ArchiveAuditWindow.cs` | Existente |
| Carpetas y perfiles locales | `release-build/v6.35/Launcher/LocalProfilesWindow.cs` | Existente |
| Archivo de API opcional | `release-build/v6.35/Launcher/OfficialApiArchiveWindow.cs` | Experimento independiente, no es el cliente HTTP de login |

La nueva ventana usa únicamente la API local documentada:
`GET http://127.0.0.1:<puerto>/openapi/v1/env/list?page_no=1&page_size=100`
con `X-API-KEY` aportada por el propietario. El cliente oficial realiza la autenticación del usuario; la clave local no se guarda en disco. El resultado de la API se acepta solo si su código de negocio es **0**. Si ocurre un error, se presenta sin cerrar la sesión.

## Diferencias respecto a v6.28

- La v6.28 cambia `package.json.version` del cliente 2.8.17 a 3.0.7, pero mantiene el bundle HTTP antiguo.
- Esta rama inicia **DICloak.exe original** y verifica que su ASAR es el oficial; no simula la versión 3.0.7.
- Las funciones DyclokPRO se construyen como código independiente, fuera del ASAR, en lugar de inyectarse al cliente autenticado.

## Funciones pendientes de integración y de validación

1. Reproducir login + carga real de perfiles en el motor 3.0.7 en Windows con la cuenta del usuario.
2. Comprobar persistencia en cuentas secundarias aisladas sin compartir tokens o cookies.
3. Comparar las funciones del panel v6.28 con el lanzador nuevo y reconstruir las restantes (sin volver a utilizar el cliente HTTP 2.8.17).
4. Resolver por diagnóstico la pantalla negra y diferenciar fallo del renderer, error de API, navegación a login y cierre del proceso.
5. Exportación de cookies y datos de navegador únicamente a través de los métodos que permita oficialmente el proveedor, con autorización y protección de secretos.
6. No publicar un EXE como estable sin pasar las pruebas de login/consulta de perfiles reales.

## Reproducción

El flujo en `.github/workflows/map-official307-runtime.yml` no necesita credenciales reales. Verifica hashes del proveedor, lista las capas, compila el código independiente de DyclokPRO, comprueba el motor sin abrir sesión y genera artefactos de arquitectura.

**Limitación:** no se reconstruye la lógica propietaria de firmas, la renovación de tokens ni la sesión remota desde los bundles minimizados. Esas operaciones siguen delegadas en el cliente oficial.

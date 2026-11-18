# diloakPRO 30.0.17 RC4 — captura automática desde Abrir

## Problema resuelto
En RC3 el controlador conservaba las etapas de apertura desde la interfaz,
pero los metadatos HTTP y procesos empezaban cuando se abría la ventana del
diagnóstico. Si Chromium se abría antes, las conexiones importantes no quedaban
registradas.

## Nueva secuencia
1. En una fila de prueba pulsar **Operación → Abrir**.
2. Antes de ejecutar la llamada nativa original, la interfaz envía un **IPC
   síncrono y limitado** `open_requested` al proceso principal.
3. El proceso principal arma un observador de metadatos por tiempo y emite
   `capture_started` con un UUID nuevo, que no contiene el ID del perfil.
4. El motor original ejecuta la apertura sin cambiar autenticación, cookies,
   huellas, proxy, integridad ni APIs del fabricante.
5. Se registran fases, solicitudes Node HTTP(S), respuestas, procesos e IP/puertos
   observados bajo una asociación **temporal**, no verificada. El controlador
   retiene hasta 350 eventos por perfil en memoria.
6. Al completar la etapa `OPEN_ENV`, o fallar, conserva 15 s de margen para
   respuestas tardías. Cierra el observador automáticamente; a los 120 s
   termina también por tiempo máximo.
7. El panel puede abrirse después: reproduce el buffer del perfil seleccionado,
   incluyendo inicio y fin de la captura. Exportar JSON sigue guardando en
   Descargas, sin credenciales ni contenido privado.
8. Si se abren varios perfiles a la vez, los eventos del observador global
   se etiquetan `ambiguous`. Nunca se atribuyen a un Chromium verificado.

## Garantías y limitaciones
- **No** recoge contraseñas, valores de cookies, cabeceras de autenticación,
  tokens, cuerpos HTTP, URLs completas, claves de proxy, rutas de perfiles,
  Local Storage ni IndexedDB.
- `Content-Length` es tamaño **declarado**; no acredita una transferencia.
- Solo se instrumenta el `node:http(s).request` del proceso principal,
  no tráfico HTTP de Chromium externo, WebSockets, `fetch` interno de Node,
  ni todo el tráfico cifrado.
- La conexión TCP observada no demuestra que el perfil o cuenta solicitados
  la originaran. La identidad Chromium–perfil queda **no verificada**.
- La pertenencia al perfil se conserva internamente solo para presentar el
  diagnóstico correspondiente; no se exporta el identificador privado.
- La captura se activa por la acción Abrir. No es un monitor persistente.
- No hay autorización de redistribución del motor propietario ni firma digital
  nueva; RC4 es experimental y para entornos de prueba.

## Validación
`node --test tools/test-diloakpro-captura-temprana-3017.cjs`
Comprueba captura anterior a la llamada nativa, conservación al abrir el panel
posteriormente, expiración, concurrencia ambigua, sanitización y estado de
cookies/credenciales/identidad sin falsas verificaciones.

La prueba de Windows CI reconstruye y comprueba ASAR, integridad del PE,
instalador NSIS, migración anterior y arranque. El inicio de sesión de un perfil
real debe comprobarse separadamente en el equipo de pruebas.

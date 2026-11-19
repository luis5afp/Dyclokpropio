# diloakPRO 30.0.22 RC9 — Tráfico Chromium identificado por perfil

## Objetivo

La RC8 observaba 4/4 solicitudes HTTP del proceso Electron y 3 sesiones TLS válidas, pero **no** la actividad HTTP del navegador externo. Se añade un diagnóstico de solo lectura del navegador Chromium al que DICloak asigne el perfil durante Operación → Abrir.

## Activación segura

La integración CDP es **optativa**. Por defecto permanece desconectada y muestra «No configurada». Para habilitarla en una sesión de laboratorio autorizada, la instalación necesita tres variables **antes de arrancar diloakPRO**:

- `DILOAKPRO_DIAG_CDP_ENABLE=1`: aceptación explícita de supervisar los metadatos de Chromium.
- `DILOAKPRO_DIAG_API_PORT`: puerto de la API local del fabricante en `127.0.0.1`.
- `DICLOAK_LOCAL_API_KEY`: clave válida de la API local, proporcionada por el usuario y **no copiada a informes ni registros**.

No se conecta al navegador usando un PID, una URL WebSocket arbitraria o un escáner de puertos. La API local debe responder al endpoint de sesión `GET /openapi/v2/profiles/:id/session`, devolver **ese mismo perfil** en estado `running` e indicar su puerto de depuración. La dirección WebSocket se valida como **loopback y puerto exacto**. Si no existe ese endpoint, falta clave o la API no confirma el perfil, el monitor informa «No disponible». No se finge verificación de Chromium.

El monitor se inicia **después** de la etapa de apertura del motor y se detiene junto con la captura temporal. Por lo tanto puede perder peticiones que Chromium haya realizado al arrancar. No inicia ni reinicia el navegador, y no modifica cookies ni configuración.

## Datos que observa al habilitarse

- **HTTP de las páginas:** dominio de destino, plantilla de ruta (segmentos variables sustituidos por `:id`), método HTTP, tipo de recurso (Document, XHR, Fetch, Script, Image…), estado de respuesta (incluido `200`), duración, bytes codificados al terminar y fallos.
- **Respuesta HTTP y origen:** IP/puerto remotos si CDP los proporciona. Estos pueden corresponder a proxy, CDN o servidor; no verifican una salida de proxy por sí solos.
- **Cookies:** únicamente si existió una cabecera llamada `Set-Cookie`, contador de cookies asociadas a solicitudes y **motivos permitidos** de cookies bloqueadas reportados por CDP. No se conservan ni se consultan valores de cookies.
- **Vinculación:** registro `openapi_verified` significa que la **API local del fabricante** comunicó una correspondencia entre ID de perfil y sesión CDP, no una prueba criptográfica.

## Límites reales

- Un `HTTP 200` significa respuesta correcta de ese servidor web. No prueba que el navegador haya aceptado o guardado cookies, ni que la configuración del proxy sea correcta.
- Los eventos `Network.responseReceivedExtraInfo` de CDP pueden documentar **rechazos y motivos**, pero no garantizan que una cookie haya quedado guardada persistentemente. Una cookie asociada a una solicitud sí indica que CDP informó su uso en esa solicitud; el valor permanece inaccesible para el diagnóstico.
- CDP conectado después de abrir **no reconstruye el tráfico anterior**.
- Pueden faltar peticiones de service workers, navegación muy temprana, protocolos no HTTP, sockets privados o páginas no supervisadas.
- No se ejecutan `Network.getResponseBody`, `Network.getCookies`, `Storage.getCookies`, `Runtime.evaluate` ni extracción de contraseñas, tokens, 2FA o cabeceras/cuerpos.
- **No hay guardado automático.** La captura es temporal y reside en memoria; exportar JSON/TXT es una acción explícita del usuario. Los archivos de antiguas RC no se eliminan.
- La exportación manual incluirá dominios visitados e IP/puertos; conviene revisar los informes antes de compartirlos.
- Para demostrar realmente el egreso del proxy puede usarse una página de comprobación propia/autorizada; el monitor no navega automáticamente por cuenta del usuario.

## Pruebas

`node --test tools/test-diloakpro-chromium-cdp-3022.cjs`

Simulan OpenAPI y CDP, verifican respuesta `200` de una página, correlación de solicitudes, intento `Set-Cookie`, bloqueo por `SecureOnly`, uso de cookies **sin valores**, rechazo de perfiles incorrectos, y cierre del monitor al terminar la captura.

Windows CI también prueba las regresiones del motor 0.4.2, reempaquetado ASAR/PE, instalación NSIS, migración desde RC2 y arranque básico. Las pruebas simuladas no reemplazan una prueba real contra una API local del fabricante disponible y autorizada.

Versión experimental, sin firma digital propia; la redistribución de componentes originales requiere permiso.

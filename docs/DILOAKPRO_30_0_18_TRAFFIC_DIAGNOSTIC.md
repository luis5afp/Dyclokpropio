# diloakPRO — Diagnóstico bidireccional HTTP, propuesta RC5

## Objetivo
En el panel «Diagnóstico de comunicación» observar la comunicación entre el proceso principal de diloakPRO y los servidores, distinguiendo solicitudes salientes y respuestas entrantes, sin recolectar cuerpos ni credenciales.

## Alcance técnico
- El observador se activa al pulsar **Abrir** un perfil de prueba y se detiene automáticamente según el coordinador RC4.
- Los eventos `native_http_request` y `native_http_response` conservan método, plantilla de ruta, estado, latencia y tamaño declarado, si existe.
- `native_http_transfer` registra bytes del **cuerpo** proporcionados al cliente Node HTTP(S) para envío y bytes recibidos mediante el flujo HTTP observado. Son métricas de la aplicación, **no** bytes de red garantizados ni prueba de aceptación por el servidor.
- Se registran únicamente booleanos de presencia para `Authorization`, `Proxy-Authorization`, `Cookie` y `Set-Cookie`. No se registran nombres de cuenta ni valores.
- La respuesta puede terminar normalmente (`response_end`) o cerrarse antes de completar la lectura (`response_closed`); errores de solicitud (`request_error`).
- Hay un límite de 32 MiB por cuerpo. Si se supera, se marca `byteCountLimited` y se omiten los contadores de esa transferencia en lugar de presentar una cifra engañosa.
- El panel muestra resúmenes y las columnas «Cuerpo salida», «Cuerpo entrada» e «Indicadores»; la exportación JSON reutiliza la misma lista de claves permitidas.

## Límites y privacidad
- **Sin** cookies ni tokens, contraseñas, credenciales de proxy, cabeceras completas, parámetros de consulta, datos de Local Storage/IndexedDB, ni cuerpos HTTP.
- Se trata de tráfico de `node:http(s).request` del proceso principal Electron. No intercepta todo Chromium, el tráfico de `fetch`, WebSocket ni TLS cifrado de otros procesos.
- No se instala un proxy MITM ni se desactiva TLS.
- La asociación al perfil sigue siendo temporal, nunca se presenta como identidad Chromium comprobada.
- **Todavía no es un instalador de producción.** Se necesitan CI, verificación de uso real en Windows y permisos de distribución antes de empaquetarlo.

## Verificación rápida
`node --test tools/test-diloakpro-trafico-bidireccional-3018.cjs`

La prueba utiliza un servidor local y comprueba bytes de ida/vuelta, presencia sin valores de cabeceras y sanitización del JSON.

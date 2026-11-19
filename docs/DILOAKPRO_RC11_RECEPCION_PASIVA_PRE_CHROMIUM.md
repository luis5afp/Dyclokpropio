# diloakPRO 30.0.24 RC11 — Recepción pasiva antes de Chromium

## Objetivo exacto

La observación principal es **servidor de configuración → proceso Electron/diloakPRO → preparación del perfil**. No se necesita entrar en GinsBrowser, F12, Open API ni CDP para este tramo. La captura ya empieza en `Operación → Abrir` y el observador HTTP principal se ha registrado en el proceso Electron.

## Cómo funciona

En el evento de respuesta de `node:http(s).request` se registra temporalmente la llamada `IncomingMessage.push(chunk)`, que introduce cada fragmento recibido en el stream normal de Node. El observador calcula un **HMAC-SHA256 con clave aleatoria efímera** sobre los fragmentos mientras pasan, cuenta bytes/fragmentos y llama a la función original con los mismos argumentos, sin suscribirse a `data`, sin leer o cambiar la respuesta y sin dirigirla a otro destino.

Los comprobantes están etiquetados como:
- `proofScope: node_received_stream_hmac_ephemeral`
- `inboundStreamComplete` indica finalización observada por Node (no aplicación correcta en Chromium).
- `inboundStreamProof` contiene el HMAC solo si la recepción finaliza normalmente y no supera el límite de medición.
- `inboundChunkCount` refleja el número de fragmentos recibidos.
- `inboundBodyBytesObserved` son bytes del stream Node (posiblemente aún comprimidos), no bytes sobre el cable ni del navegador.

La clave HMAC se elimina al detener la captura y **no se exporta**. Distintas ejecuciones no producen el mismo comprobante para un mismo contenido, evitando etiquetas permanentes de respuestas sensibles.

## Límites y seguridad

- El inspector no guarda ni exporta cuerpos de respuesta, tokens, cookies, contraseñas, cabeceras completas ni credenciales de proxy. No almacena automáticamente ningún archivo.
- El comprobante no permite reconstruir el cuerpo ni confirmar byte a byte lo enviado por el servidor, porque no existe una prueba coordinada con el origen.
- Se observa parte de `node:http(s).request`, no necesariamente todo el tráfico generado por librerías nativas, Electron `net`, `fetch`/Undici ni Chromium.
- En `fetch` el observador existente solo capta metadatos de ciclo de vida; **no** garantiza una huella del cuerpo recibido.
- El método `push` observa los bytes introducidos en el stream de Node. No verifica el uso posterior, la descompresión realizada por el programa, ni el traslado correcto a Chromium.
- Una respuesta cerrada antes de `end`, excesivamente grande o no procesable se marca como incompleta o sin comprobante, nunca como idéntica a su origen.
- No se instala un proxy, no se modifica TLS, no se parchean las cabeceras ni se altera la gestión del perfil.
- Los dominios y metadatos existentes pueden seguir apareciendo como información auxiliar; la **recepción previa a Chromium es la sección prioritaria**.

## Pruebas

`node --test tools/test-diloakpro-recepcion-pasiva-3024.cjs`

El test comprueba que una respuesta con contraseñas/cookies de laboratorio llega idéntica al consumidor habitual, que los valores no aparecen en eventos o informes, que el HMAC cambia entre capturas, que las transferencias incompletas no generan comprobante de flujo completo, y que el panel sigue sin archivado automático.

Esta versión sigue siendo experimental; necesita prueba en Windows para comprobar que el nuevo punto de instrumentación no modifica el comportamiento del motor original. La redistribución de componentes originales del fabricante requiere autorización.

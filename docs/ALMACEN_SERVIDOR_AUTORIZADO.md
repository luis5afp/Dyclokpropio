# Almacén: conexión controlada a un endpoint de servidor propio

## Causa del problema

Las versiones 0.3.0–0.3.3 únicamente consultaban un servidor de prueba
creado dentro del proceso Node.js en `127.0.0.1`. Los valores `FAKE_`
no procedían de las páginas visitadas por DICloak y no demuestran una
integración con el servidor de laboratorio del usuario.

**No hay URL ni ruta API del servidor del usuario en el repositorio.**
No debemos inventarla ni asumir que los endpoints internos del proveedor
DICloak se pueden utilizar para extraer sesiones de navegación.

## Conector preparado, pero NO activado

`tools/almacen-servidor-autorizado.js` implementa una llamada **GET
explícita** a un endpoint HTTP(S) del operador del laboratorio, con
estas restricciones:

- URL completa exacta definida en el **proceso principal de confianza**;
  la interfaz no puede decidir otro dominio ni cambiar la ruta.
- HTTPS obligatorio para un servidor no local; HTTP solo en
  `localhost`, `127.0.0.1` o `[::1]`.
- No envía cookies, contraseñas, `Authorization`, tokens del perfil,
  proxies con credenciales ni cabeceras de la sesión Chromium.
- No sigue redirecciones, no admite URLs con credenciales o queries
  sensibles, y limita tiempo y tamaño de respuesta.
- Recibe el cuerpo HTTP como **Buffer original**, sin descifrar,
  transformar, ofuscar ni descomprimir su contenido. En HTTPS el
  transporte TLS es descifrado normalmente por la biblioteca de red;
  no implica guardar bytes cifrados de la conexión TLS.
- Puede guardar ese Buffer en `Almacén/<ID interno>/archivos/<eventId>`
  mediante el archivador existente. No guarda las cabeceras
  `Set-Cookie` ni valores de autenticación de servidores reales.
- No modifica ni lee la cookie jar ni la configuración de proxy de
  los perfiles existentes.

## Para habilitarlo con el servidor correcto

El operador debe proporcionar la **URL HTTPS exacta de un endpoint
dedicado de pruebas** que controle y cuyo contenido no tenga credenciales
o sesiones auténticas, por ejemplo una ruta `/api/almacen-fixture`
que entregue el documento JSON/TXT/ZIP de ensayo. No enviar usuarios,
contraseñas, tokens ni cookies por el chat. Si la API requiere
autenticación, preparar una credencial de servicio limitada dentro
del servidor (no reutilizar la cookie del perfil); la versión actual
**no** implementa autenticación.

Una vez conocida la ruta real, el siguiente cambio de aplicación
debería usar el conector con un botón de prueba de comunicación,
verificando dos perfiles y los bytes recibidos antes de distribuir
un instalador. **El botón Almacén → Abrir actual no queda conectado
automáticamente a este adaptador.** Tampoco crea un interceptor
silencioso de todas las solicitudes y respuestas HTTP del navegador.

## Validación

`node --test tools/test-almacen-servidor-autorizado.js` verifica
respuestas originales por HTTP local, rechazo de URL no autorizada,
ausencia de cookies/credenciales en solicitudes, no redirección y
límites de respuesta. El proceso no usa ni muestra valores privados.

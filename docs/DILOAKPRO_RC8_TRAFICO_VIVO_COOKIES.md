# diloakPRO 30.0.21 RC8 — Tráfico en vivo sin archivado automático

## Cambios solicitados
- Se elimina el archivado de diagnósticos cuando termina una apertura.
- El botón **Diagnóstico → Ver** sigue mostrando la sesión temporal en memoria.
- El monitor de Node ahora cubre HTTP(S) y fetch/Undici cuando esta última API usa los canales de diagnóstico de Node.
- Se añaden eventos de asignación de socket, establecimiento TCP y negociación TLS del transporte Node HTTP(S), limitados a estados, IP y puertos observados, versión TLS y validación del certificado (sí/no).
- Se amplía a 2400 eventos la ventana del panel; una captura puede truncarse.
- El observador de procesos en Windows toma muestras aproximadamente cada 3,5 segundos; no es un registro continuo de paquetes.
- No se crea la carpeta de laboratorio mediante el observador.
- Los informes JSON/TXT siguen disponibles **únicamente si el usuario pulsa expresamente Exportar**. No se generan archivos de forma automática.
- No se borran silenciosamente los archivos que guardó RC7: solo el usuario debe decidir si elimina su historial anterior.

## Cómo llegan y se crean las cookies en Chromium

Existen distintas rutas posibles que deben distinguirse antes de atribuir las cookies a un servidor o al motor de apertura:

1. **HTTP Set-Cookie**: una respuesta del servidor solicita a Chromium crear una cookie. El navegador comprueba dominio, ruta, expiración, Secure, HttpOnly, SameSite, partición, políticas y otras restricciones.
2. **JavaScript document.cookie** o **Cookie Store API**: una página crea o modifica cookies según las políticas del navegador. Una cookie HttpOnly no es accesible por JavaScript.
3. **APIs de administración del navegador**: CDP, extensiones con permiso o integraciones nativas pueden establecer cookies explícitamente.
4. **Restauración del perfil**: la base nativa de cookies puede contener datos persistentes creados en sesiones anteriores. Su representación en disco puede estar cifrada y no coincide con la cabecera HTTP original.

**Importante:** el evento stage_cookie_encrypt_plan únicamente confirma que se ejecutó la fase de preparación que la interfaz expone. No verifica cuál de las cuatro rutas anteriores se utilizó ni si Chromium aceptó las cookies. Ver Set-Cookie en una respuesta de Node http tampoco prueba que llegase al almacén de Chromium.

Para comprobar la instalación con garantías, el siguiente paso es usar una **sesión Chromium identificada por el motor** o una página de ensayo autorizada donde el navegador confirme una cookie de prueba sin exportar su valor. El proceso Node principal no tiene esa vinculación todavía. Por eso la interfaz muestra «No verificado».

## Cobertura real

| Componente | Observación |
| --- | --- |
| Apertura en interfaz | Etapas, duraciones, fallos |
| Node HTTP(S) | Ruta anonimizada, estado, tiempos, bytes del cuerpo observados, socket/TCP/TLS |
| Node fetch/Undici | Inicio, respuesta, finalización/error, ruta anonimizada y tiempo |
| Chromium externo | Procesos y conexiones de muestreo, sin cuerpos ni cabeceras |
| Cookies en Chromium | Preparación de interfaz; aplicación real NO verificada |
| Credenciales/2FA | NO verificadas, sin registrar valores |

No se instala interceptación TLS, no se modifica la autenticación, no se exportan cookies, contraseñas, tokens ni códigos 2FA. Las capturas Node HTTP(S) y Undici son parciales; pueden faltar módulos nativos, WebSocket, HTTP/2, sockets fuera de Node y tráfico de Chromium. Los sockets reutilizados no cuentan como conexiones TCP nuevas. Las IP visibles pueden corresponder a proxies.

## Comprobación
`node --test tools/test-diloakpro-trafico-vivo-3021.cjs`

Los tests comprueban que los datos HTTP de laboratorio no se filtran, que los eventos fetch se correlacionan, que los metadatos TLS se sanean y que abrir el panel no crea archivos. Windows CI recompila ASAR/NSIS y comprueba migración y arranque. Esta versión sigue siendo experimental y requiere probarse con un perfil propio en Windows antes de promocionarla a estable.

No redistribuir componentes originales del fabricante sin confirmar los permisos correspondientes.

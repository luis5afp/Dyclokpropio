# RC2 LAB — comparar el JSON enviado por nuestro servidor con el recibido por Chromium

## Auditoría de campos del servidor (datos sintéticos)

El capturador Node de laboratorio audita **dos direcciones diferentes**:
- `client-to-server`: campos JSON de solicitudes, por ejemplo correo o contraseña
  de prueba enviados en el formulario de inicio de sesión;
- `server-to-client`: campos JSON de respuestas, como email, configuración de
  proxy, extensiones o fingerprint, **solo cuando realmente estén presentes**.

En `*.proof.json` se guarda la **cantidad de propiedades** por categoría
(`email`, `password`, `proxy`, `extension`, `fingerprint`, `cookie`,
`session`), nunca el valor de esos campos. Eso es una detección por nombre
de propiedad, no una certificación de que la configuración se aplicó.

También se guarda `setCookieHeaderCount`, la cantidad de cabeceras
`Set-Cookie` emitidas por el servidor, y si llegó una cabecera `Cookie`
del navegador. Sus valores reales **no** se exportan. Solo las cookies
**ficticias** cuyo nombre empieza por `DILOAKPRO_TEST_` se incluyen,
con límite estricto de tamaño, dentro del `*.dplabsrv` cifrado.
Las contraseñas, tokens o cookies de autenticación reales nunca deben usarse
en esas rutas de prueba.

El contenido JSON de las rutas permitidas permanece cifrado en `*.dplabsrv`
y puede inspeccionarse con una contraseña de laboratorio. No publiques ese
archivo ni su contraseña; evita colocar datos reales en los JSON de prueba.

**Limitaciones técnicas:** proxy y extensiones pueden estar configurados
localmente y no viajar como JSON HTTP. El servidor generalmente recibe
contraseñas para autenticación; enviarlas en respuestas sería una exposición
de seguridad. El auditor muestra **lo efectivamente presente**, no inventa
valores ausentes.

## Objetivo
La pregunta correcta no es «¿hubo actividad TCP?», sino «¿el mismo JSON que nuestro
servidor escribió llegó intacto al Chromium del perfil de prueba?».

El diagnóstico usa **dos fuentes independientes** para una misma transacción:
1. El servidor Node de laboratorio escribe un cuerpo JSON no comprimido, añade
   `X-Diloakpro-Lab-Id` (ID aleatorio de 24 caracteres hexadecimales) y
   `X-Diloakpro-Lab-SHA256` (SHA-256 de los bytes JSON generados).
   Registra el mismo ID y SHA en su archivo `*.proof.json` y guarda
   ambos cuerpos (solicitud y respuesta) **cifrados** en `*.dplabsrv`.
2. Chromium, mediante el **CDP autorizado del perfil**, recibe esa respuesta
   real. En `Network.loadingFinished`, el monitor ejecuta
   `Network.getResponseBody`, obtiene temporalmente el JSON y calcula
   **su propio SHA-256**. No guarda el cuerpo ni lee tokens.
3. El usuario puede pulsar **Importar prueba servidor** en RC2 para cargar
   un `*.proof.json` de su servidor. El monitor compara **ID + código HTTP +
   SHA del servidor + SHA del navegador**. Solo entonces confirma la
   comparación entre fuentes independientes.

No se inyecta tráfico dentro del cliente, ni se modifica el ejecutable
DICloak 3.0.9 / `resources/app.asar`.

## Cómo se prueba con tráfico real de la ruta de laboratorio
1. Instalar el middleware `tools/lab-server/first-party-http-recorder.cjs`
   en un **servidor Node propio** de pruebas, junto al manejador real de la
   ruta `/__diloakpro_lab__/test`. Habilitarlo expresamente, con una
   contraseña de cifrado segura. No habilitar rutas de producción.
2. Abrir el perfil de prueba en DICloak y habilitar CDP solo si su
   interfaz oficial lo permite. El monitor RC2 puede conectar al puerto de
   ese perfil mediante la API local autorizada.
3. En el panel **Comparar JSON laboratorio**, escribir solo el *origen*,
   por ejemplo `https://pruebas.tu-dominio.example` (sin ruta ni credenciales)
   y pulsar **Activar**.
4. Con CDP conectado, visitar desde ese perfil la ruta
   `/__diloakpro_lab__/test`. La respuesta debe ser un JSON UTF-8 enviado
   en una sola llamada `res.end(...)`, **sin gzip ni brotli**, de hasta
   128 KiB. No se analizan respuestas de dominios o rutas distintos.
5. En el panel aparecerá `COINCIDE`, `DIFERENTE` o
   `NO_VERIFICADO` con el ID único. Descarga del servidor el `*.proof.json`
   que coincida con ese ID y pulsa **Importar prueba servidor**.
6. Exportar el diagnóstico RC2. El JSON/TXT incluye los hashes, los IDs y
   el resultado; no incluye cuerpos JSON ni cookies. El servidor mantiene
   el cuerpo real **cifrado** para quien tenga el permiso y la contraseña.

## Cuándo dar por válida una comparación
- **COINCIDE:** el código HTTP, el ID y el SHA-256 de la prueba independiente
  del servidor coinciden con el SHA-256 calculado sobre la respuesta de
  laboratorio observada por Chromium.
- **DIFERENTE:** existe una discrepancia verificable entre ambas fuentes; hay
  que investigar si hubo transformación, errores en el servidor o datos distintos.
- **NO_VERIFICADO:** falta una fuente, CDP no estuvo disponible, la respuesta
  vino de caché/Service Worker, está comprimida, no incluye las dos cabeceras
  del laboratorio o el cuerpo no está disponible.

**Precisión:** `Network.getResponseBody` ofrece el cuerpo accesible para
Chromium (puede estar decodificado), **no** bytes de TCP/TLS ni encuadre HTTP.
Por ello solo comparamos respuestas JSON UTF-8 no comprimidas y dentro de
los límites indicados. No se afirma igualdad de paquetes de red.

## Límites de la implementación
- El monitor CDP RC2 observa por ahora el **primer target `page`** del
  puerto elegido. Si la ruta fue servida a otra pestaña, se informa
  NO_VERIFICADO.
- La captura del servidor y la del navegador deben corresponder al **mismo
  ID aleatorio de transacción**, nunca a solicitudes de prueba diferentes.
- Si solo ejecutamos una solicitud HTTP desde un programa auxiliar, eso
  prueba la comunicación de ese auxiliar, **no** el navegador de DICloak.
- La captura de servidor no demuestra por sí sola la aplicación de cookies,
  proxy, fingerprint, extensiones ni login web; se verifican por otros medios.
- Sin acceso al código de un servidor propio **no es posible instalar
  allí el capturador** desde esta rama. Los tests de CI usan un servidor
  sintético local, no los servidores privados del usuario.

## Pruebas automáticas
- `node tools/lab-server/test-first-party-http-recorder.cjs`: asegura
  ID/hash del servidor, respuesta real, cifrado y exclusión de otras rutas.
- `dotnet run -c Release --project tools/tests/rc2-archive/Archive.Tests.csproj`:
  prueba hash coincidente, discrepancia, base64 CDP, origen no autorizado,
  importación del archivo de prueba independiente y exportación segura.
- El workflow Windows genera el instalador solo después de superar esas
  pruebas y comprobar que el motor 3.0.9 conserva hashes y firma originales.

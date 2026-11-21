# RC2 LAB — captura de solicitudes y respuestas JSON del servidor propio

## Decisión técnica

**Sí podemos observar el tráfico HTTP real en un servidor que administramos.**
No es necesario un puerto CDP ni `X-API-KEY` para registrar el contenido que
**nuestro propio servidor** recibe y envía en rutas de laboratorio.

Sin embargo, una conexión TCP vista desde Windows, o una solicitud de prueba
generada por un monitor, no demuestra cuáles fueron los JSON que el motor
enviaba realmente. Para obtenerlos de manera fiable instrumentamos el **servidor
propio en la ruta de pruebas**, sin modificar el motor oficial DICloak 3.0.9.

El módulo añadido es:
`tools/lab-server/first-party-http-recorder.cjs`

### Qué guarda cuando está instalado EN el servidor propio

- Solicitud JSON real recibida en rutas de laboratorio.
- Respuesta JSON real generada por el servidor.
- Método HTTP, ruta sin parámetros de consulta, código de respuesta, hora UTC.
- SHA-256 de los bytes originales en el límite HTTP instrumentado para request
  y response; tamaño en bytes.
- Contenido exacto de los cuerpos HTTP en un archivo **AES-256-GCM cifrado**
  `.dplabsrv`. La passphrase no se guarda.
- Informe `.proof.json` sin cabeceras, cookies, IPs, claves ni cuerpos.
- Se limita a **1 MiB por mensaje**, **30 intercambios** y **12 MiB por sesión**.
- Si no hay consentimiento, no hay ruta habilitada o se supera un límite,
  **no** se guarda contenido.

**No graba automáticamente** tráfico privado de otros dominios, credenciales,
cookies ni el estado interno de Chromium. Si las rutas de prueba contienen
datos sensibles, el archivo cifrado debe mantenerse privado.

### Ejemplo de integración en un servidor Node.js que controlamos

Instala el módulo en el proyecto del servidor y colócalo **antes de que el
servidor consuma o transforme los cuerpos HTTP**.

```js
const http = require('node:http');
const { createFirstPartyRecorder } = require('./first-party-http-recorder.cjs');

const recorder = createFirstPartyRecorder({
  enabled: process.env.DILOAKPRO_LAB_CAPTURE_ENABLE === '1',
  labPathPrefix: '/__diloakpro_lab__/',
  passphrase: process.env.DILOAKPRO_LAB_CAPTURE_PASSPHRASE,
  directory: '/ruta/absoluta/privada/lab-captures'
});

const app = (req, res) => {
  // Reemplazar por el manejador real del servidor propio de laboratorio.
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, test: true }));
};

// Para activar: DILOAKPRO_LAB_CAPTURE_ENABLE=1, passphrase >=16 chars.
// Cuando no está activado, el servidor funciona sin el capturador.
http.createServer(recorder ? recorder.wrap(app) : app).listen(3000);
```

En Express, pasa el manejador Express a `recorder.wrap(app)` al crear el
servidor HTTP, antes de cualquier lectura del cuerpo. La ruta capturada debe
estar dentro del prefijo definido. Cambia el prefijo por una ruta de **tu propio
servidor de laboratorio**; evita rutas de producción y datos no desechables.

La implementación concreta depende del framework del servidor.
**Esta rama no despliega ni configura por sí sola el servidor remoto**.

### Prueba automática en GitHub

```bash
node tools/lab-server/test-first-party-http-recorder.cjs
```

La prueba envía un POST JSON ficticio a un servidor HTTP real de loopback,
comprueba la respuesta original, los dos SHA-256, recupera ambos cuerpos con la
contraseña de prueba y verifica que no se capturan rutas ajenas. Además prueba
que las cabeceras con tokens ficticios y los parámetros de consulta **no
aparezcan** en los metadatos exportados.

### Diferencias que deben mostrarse separadas en el informe

| Aspecto | Método | Qué demuestra |
|---|---|---|
| Datos originales recibidos/enviados | Captura dentro del propio servidor | Los cuerpos HTTP en ese límite de la aplicación |
| Recepción por Chromium | CDP autorizado u otra telemetría del navegador | Qué respuestas vio ese navegador concreto |
| Cookies / proxy / fingerprint aplicados | Verificación independiente del perfil de prueba | Estado efectivo de Chromium |
| Sesión autenticada | Endpoint propio de estado de la sesión de laboratorio | Autenticación de **ese** servicio, sin credenciales |

**No afirmar que se capturó tráfico del motor** hasta que un request real
procedente de la prueba llegue a la ruta instrumentada y se cree su prueba.

La captura de laboratorio original de Node de la reconstrucción 3.0.0 en
`src/main/diloakpro-lab-response-capture.js` no está integrada en la
versión de motor oficial 3.0.9. Este nuevo módulo, por su parte, corre
en el **servidor de laboratorio administrado por el usuario** y no requiere
modificar `app.asar` o interceptar HTTPS de un programa ajeno.

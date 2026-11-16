# DICloak: conectar Operación → Abrir al receptor de datos de prueba (0.3.6, herramienta experimental)

## Estado correcto

Se preparó una **herramienta complementaria**, todavía no incrustada
en `DICloak.exe`, que utiliza las APIs públicas oficiales de DICloak.
Con su modalidad predeterminada `attach` **no vuelve a abrir el perfil**:

1. Se ejecuta en el PC del usuario antes de pulsar **Operación → Abrir**.
2. Consulta `GET /openapi/v2/profiles/{profileId}/session` por HTTP
   **solamente en `127.0.0.1`**, con la clave que el usuario
   configura localmente; espera que el perfil esté `running`.
3. Comprueba que `profile_id` coincida exactamente con el autorizado,
   toma su `debug_port` o `web_socket_url` de localhost, y abre una
   conexión de depuración Chromium (CDP).
4. Solo cuando un documento procede de la ruta HTTPS de ensayo
   autorizada, recibe su cuerpo mediante `Network.getResponseBody`
   y lo almacena en una carpeta por ID de perfil. No consulta
   las cookies ni contraseñas de Chromium ni guarda cabeceras con
   tokens.
5. Pasado el intervalo de prueba, cierra únicamente el **observador**,
   no el navegador del perfil.

Los documentos se guardan en:

`%LOCALAPPDATA%\DICloak-Test-Server-Reception-036\<profile-id>\archivos\<evento>\<nombre>`

No inventa contenido `FAKE_`; guarda la representación que Chromium
expone al observador. **CDP puede entregar el cuerpo ya descomprimido o
transformado** y no garantiza que estén disponibles todas las
respuestas, especialmente las iniciadas antes de la conexión.
La verificación de igualdad byte a byte con el servidor requiere
comparar un hash SHA-256 de la misma representación (por ejemplo,
documento servido con `Content-Encoding: identity`).

## Configuración local (sin subir la clave al repositorio)

Requisitos:
- DICloak iniciado, con **Local Open API** habilitada en
  **Más → Configuración → Open API** y una cuenta de pruebas.
- DICloak debe admitir el endpoint **V2 de sesiones** y la opción
  *Remote Inspector/CDP* del perfil de pruebas debe estar habilitada.
- Node.js 22 y el repositorio `Dyclokpropio` descargado localmente.
- Un servidor HTTPS **propio y autorizado**, con ruta exclusiva de
  archivos de prueba (por ejemplo `https://lab.example.test/fixtures/`).
  Para localhost se permite `http://127.0.0.1:puerto/fixtures/`.
- Nunca usar la URL de un sitio de terceros, cookies de sesión o
  contraseñas auténticas.

Ejecutar en **PowerShell**, sustituyendo solamente las rutas y valores
locales autorizados:

```powershell
$env:DICLOAK_LOCAL_API_PORT = '52100' # usar el puerto mostrado en DICloak
$secret = Read-Host 'Clave local Open API' -AsSecureString
$env:DICLOAK_LOCAL_API_KEY = [System.Net.NetworkCredential]::new('', $secret).Password
$env:DICLOAK_TEST_PROFILE_ID = 'ID_INTERNO_DEL_PERFIL_DE_PRUEBAS'
$env:DICLOAK_TEST_ENDPOINT_PREFIX = 'https://TU-SERVIDOR-PROPIO/fixtures/'
$env:DICLOAK_TEST_OPERATION_MODE = 'attach'
$env:DICLOAK_TEST_RECORD_SECONDS = '120'
node tools/run-dicloak-openapi-test-receiver.cjs
Remove-Item Env:DICLOAK_LOCAL_API_KEY
```

Mientras aparezca `ESPERANDO_OPERACION_ABRIR=TRUE`, pulsar
**Operación → Abrir** en DICloak para el perfil indicado y visitar
los documentos del servidor de ensayo. El programa finaliza con
el número de documentos guardados y errores, sin imprimir valores
privados, URLs de depuración o claves.

`DICLOAK_TEST_OPERATION_MODE=start` ofrece una segunda modalidad
que **abre explícitamente el perfil de prueba mediante OpenAPI**
(V1 por defecto, V2 si se fija `DICLOAK_LOCAL_API_VERSION=v2`).
No usar esa modalidad si el perfil ya está abierto.

## Privacidad, seguridad y límites

- No hay registro global de navegación, interceptación TLS,
  exportación de cookies, lectura de `Login Data`, robo de
  credenciales ni importación de configuraciones de proxy.
- La ruta aprobada debe ser propiedad del operador. El receptor
  rechaza URLs con parámetros y dominios distintos y excluye
  contenido `text/html` y `javascript`.
- El receptor recibe cuerpos bajo el límite de 32 MiB y los
  almacena con el nombre del documento, conservando la copia
  que Chromium entrega; no modifica su almacenamiento nativo.
- Un archivo guardado no significa que Chromium haya aceptado
  una cabecera `Set-Cookie`. La integridad del almacenamiento
  Chromium se comprueba por otra auditoría de solo lectura.
- Ni el nombre del perfil ni el puerto de CDP son credenciales de
  autorización. La identidad se verifica mediante la API local
  autenticada y la exigencia de un WebSocket de localhost.
- **No se han ejecutado peticiones contra el PC, API Key o servidor
  real del usuario**. Se probaron simuladores de API y eventos CDP
  en Windows y Linux. El motor DICloak 3.0.7 podría no ofrecer
  Local API V2; se necesita probar `GET .../session` y no suponerlo.
- **No está integrado todavía dentro del instalador nativo** ni
  arranca automáticamente por un clic de Operación; el observador
  independiente debe estar ejecutándose para cubrir la sesión.
- La captura de CDP no garantiza la obtención de **todo** el contenido
  enviado por un servidor; respuestas perdidas, cacheadas,
  comprimidas o demasiado grandes requieren pruebas de cobertura.

## Fuentes técnicas oficiales

- Local API V2 Runtime: `https://dicloak.crisp.help/en/article/local-api-v2-runtime-interface-t3iabr/`
  (consulta de sesiones abiertas y puertos de depuración).
- Local API V2 Profile: `https://dicloak.crisp.help/en/article/local-api-v2-profile-interface-c8z7na/`
  (inicio de perfil y `debug_port`).
- Local API V1 Guide: `https://help.dicloak.com/api-development-guide/`
  (clave local y API de apertura de perfiles).

## Validación y pasos para una futura integración nativa

Pruebas: `node --test tools/test-dicloak-openapi-cdp-036.cjs`.

Para incluir esta función dentro del botón **Operación → Abrir**
sin un proceso independiente, hay que identificar el hook correcto
en el bundle oficial de DICloak 3.0.7, verificar que el endpoint de
sesiones esté habilitado en esa versión y decidir cómo proporcionar
localmente la clave API sin meterla en un repositorio o en el
renderer. Hasta que se haga eso y se validen respuestas de ensayo
reales, **no generar ni anunciar un instalador de captura completa**.

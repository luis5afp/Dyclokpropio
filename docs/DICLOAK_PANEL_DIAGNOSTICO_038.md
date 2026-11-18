# Panel Diagnóstico de comunicación — DICloak Almacén (prototipo 0.3.8)

## Qué muestra

Se creó un **panel web local**, aislado en 127.0.0.1, para ayudar
a distinguir la comunicación durante Operación → Abrir:

| Origen | Qué aparece en el panel |
| --- | --- |
| Programa / API local | Consulta de sesión, respuesta con código HTTP, perfil detectado, falta de configuración |
| Chromium | Depurador conectado y pestañas supervisadas |
| Servidor de pruebas autorizado | Eventos de respuesta aprobada y errores de carga |
| Almacén | Cantidad de documentos guardados, tamaño y SHA-256 (de documentos autorizados) |

**No** es una grabación de todas las llamadas de DICloak a su servidor.
Los eventos de API local corresponden al **observador de pruebas**,
no a todo el tráfico interno de la aplicación. Solo se obtienen cuerpos
de archivos de los endpoints de ensayos autorizados, no de dominios
arbitrarios. Tampoco muestra credenciales, cookies, tokens, cabeceras,
POST bodies, datos privados, claves API o WebSocket de depuración.

## Cómo abrirlo SIN clave Open API — útil para la incidencia actual

El usuario ya tiene esta carpeta clonada:

\`C:\Users\USER\Dyclokpropio-Lab-037\`

En **Windows PowerShell 5.1**:

\`\`\`powershell
cd "$env:USERPROFILE\Dyclokpropio-Lab-037"
git fetch origin feature/almacen-diagnostic-panel-038
git switch -c feature/almacen-diagnostic-panel-038 FETCH_HEAD
Test-Path .\tools\run-dicloak-diagnostic-panel.cjs
node .\tools\run-dicloak-diagnostic-panel.cjs
\`\`\`

El programa imprime \`PANEL_DIAGNOSTICO_LOCAL=http://127.0.0.1:...\`.
Abrir exactamente esa URL en el navegador del equipo. El panel
muestra \`Falta configuración\` y **cero** documentos recibidos si no
hay clave API, perfil o endpoint de ensayo configurados. Esto es
correcto: no se generan respuestas falsas.

Mantener PowerShell abierto mientras se consulta el panel. Detenerlo
con **Ctrl+C** al terminar. El panel se cierra; el navegador DICloak
permanece intacto.

Si la carpeta \`-037\` no existe, se puede clonar la rama nueva
directamente, sin escribir en \`C:\Windows\System32\`:

\`\`\`powershell
cd $env:USERPROFILE
git clone --branch feature/almacen-diagnostic-panel-038 --single-branch https://github.com/luis5afp/Dyclokpropio.git Dyclokpropio-Diagnostico
cd .\Dyclokpropio-Diagnostico
node .\tools\run-dicloak-diagnostic-panel.cjs
\`\`\`

## Cómo observar un perfil y un servidor **propio de pruebas**

Solo cuando la Open API V2 de DICloak esté habilitada y funcione, y
se tenga una ruta HTTPS de archivos de pruebas bajo control del
operador, configurar en la MISMA terminal:

\`\`\`powershell
$env:DICLOAK_LOCAL_API_PORT = '52100'  # usar el puerto real de tu instalación
$env:DICLOAK_TEST_PROFILE_ID = 'ID_INTERNO_DE_TU_PERFIL_FICTICIO'
$env:DICLOAK_TEST_ENDPOINT_PREFIX = 'https://tu-servidor-propio/fixtures/'
$env:DICLOAK_TEST_OPERATION_MODE = 'attach'
$env:DICLOAK_TEST_RECORD_SECONDS = '120'
$secret = Read-Host 'Clave Open API local' -AsSecureString
$env:DICLOAK_LOCAL_API_KEY = [System.Net.NetworkCredential]::new('', $secret).Password
node .\tools\run-dicloak-diagnostic-panel.cjs
\`\`\`

Abrir la URL \`PANEL_DIAGNOSTICO_LOCAL\`; **después** pulsar
**Operación → Abrir** para el mismo perfil y visitar los documentos del
servidor de pruebas. El panel diferencia los eventos locales del
observador, la identificación del perfil, la conexión al depurador y
los archivos guardados.

Al terminar:

\`\`\`powershell
Remove-Item Env:DICLOAK_LOCAL_API_KEY -ErrorAction SilentlyContinue
\`\`\`

No compartir la clave ni la URL del WebSocket de depuración. Los datos
nativos de Chromium no se editan, descifran o copian.

## Cómo funciona y sus límites

- Es una herramienta **independiente**, no una ventana integrada dentro
  de \`DICloak.exe\` o una modificación al botón Operación.
- Solo escucha en \`127.0.0.1\` con puerto aleatorio, URL secreta por
  ejecución, HTTP sin conexión remota, CSP restrictiva y respuestas
  sin caché. El acceso al estado requiere esa URL específica.
- El panel actualiza eventos sanitizados mediante polling local
  cada segundo, sin servicios externos de analítica.
- El programa comunica únicamente nombres de eventos predefinidos,
  códigos HTTP, tamaños y SHA-256 de documentos de laboratorio.
  Rechaza datos arbitrarios y no conserva el tráfico en bruto.
- Los cuerpos de documentos del servidor autorizado se guardan
  **por perfil** mediante el receptor existente bajo
  \`%LOCALAPPDATA%\DICloak-Test-Server-Reception-036\<ID>\archivos\`.
  El panel no persiste cuerpos de respuesta.
- Los bytes expuestos por CDP pueden haber sido descomprimidos por el
  navegador. Para demostrar fidelidad completa, contrastar hashes
  de documentos entre el servidor de pruebas y los archivos archivados;
  no basta con un \`200 OK\`.
- Los datos recibidos antes de que se conecte el depurador o fuera
  del alcance de la API no aparecerán; el panel **no afirma
  monitorizar ni conservar todo el tráfico**.
- Los perfiles reales y las instalaciones autenticadas aún no se
  han probado en CI. Las pruebas de Windows/Linux solo validan la
  lógica con un servidor y sesiones simulados.
- La versión original DICloak 3.0.7 puede carecer de Local OpenAPI V2
  o del puerto de depuración; eso debe comprobarse sin asumirlo.
- Sin clave API válida no puede verificar el estado del navegador
  ni enlazar una sesión; el panel informa esta limitación.

## Prueba automatizada

\`\`\`powershell
node --test .\tools\test-almacen-diagnostic-panel.cjs
\`\`\`

Cubre: aislamiento en localhost, URL aleatoria, CSP y políticas
anticarga remota, eventos filtrados, GET de prueba de la API local,
código HTTP visible, omisión de cookies, credenciales y contenidos,
y ausencia de falsos positivos cuando falta la clave.

**No publicar un instalador de captura completa** ni alterar
la aplicación original hasta probar un perfil de laboratorio real.

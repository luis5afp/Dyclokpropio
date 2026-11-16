# DICloak — diagnóstico de apertura y recepción de documentos de prueba (0.3.7, investigación)

## Arquitectura confirmada

Las llamadas de apertura del perfil en la interfaz recuperada utilizan un
flujo de apertura de navegador. La **API local V2** oficial permite observar
la sesión en ejecución mediante:
- `GET /openapi/v2/profiles/{profileId}/session`: estado `running` o
  `stopped`, `debug_port`, `web_socket_url`.
- `GET /openapi/v2/sessions`: lista de perfiles abiertos.

Esto **no significa** que una respuesta de red esté archivada:
el servidor de administración DICloak, el motor Chromium y los sitios
visitados son componentes distintos.

## Prueba previa: ¿Operación → Abrir crea una sesión identificable?

**No se necesita URL de servidor de pruebas todavía.** Se necesita
solamente el ID interno de un perfil **ficticio** y su clave Local API V2,
configurada localmente.

Desde Windows PowerShell 5.1, en la carpeta de este repositorio:

```powershell
cd "$env:USERPROFILE\Dyclokpropio-Lab"
Test-Path .\tools\check-dicloak-open-profile.cjs
# Debe aparecer True. Si es False, localizar/descargar la rama correcta.
$env:DICLOAK_LOCAL_API_PORT = '52100' # usar el puerto REAL mostrado por DICloak
$env:DICLOAK_TEST_PROFILE_ID = 'ID_INTERNO_DEL_PERFIL_FICTICIO'
$env:DICLOAK_LOCAL_API_KEY = [System.Net.NetworkCredential]::new(
    '', (Read-Host 'Clave Local API' -AsSecureString)).Password
node .\tools\check-dicloak-open-profile.cjs
```

Si aparece `PROFILE_STATUS=STOPPED`, pulsar en DICloak
**Operación → Abrir** para ESE mismo perfil y ejecutar el
comando `node .\tools\check-dicloak-open-profile.cjs` nuevamente.

La condición deseada es `PROFILE_STATUS=RUNNING`, seguida de
`CHROMIUM_LOCAL_DEBUGGER=AVAILABLE`. Eso solo demuestra que
DICloak identifica la sesión, no que se capturó alguna respuesta.

Al finalizar:

```powershell
Remove-Item Env:DICLOAK_LOCAL_API_KEY -ErrorAction SilentlyContinue
```

**No publicar valores de API Key, cookies, URLs de depuración o
credenciales.** Si falta la API V2 o no existe un perfil, la herramienta
da un código de error sin revelar la respuesta cruda. La versión 3.0.7
concreta debe validarse en el equipo antes de asumir compatibilidad.

## Recepción permitida de documentos

Después de validar la identidad de sesión, la herramienta independiente
`tools/run-dicloak-openapi-test-receiver.cjs` (modo `attach`)
espera la apertura de ese perfil y conecta un observador CDP limitado a
una ruta HTTPS propia de documentos de ensayo. Descarta eventos de
otros servidores sin guardar URLs, cabeceras, cuerpos ni credenciales.

Cambios de esta rama:

- Descubre y habilita vigilancia también en ventanas Chromium **ya
  abiertas** al conectarse, no solo nuevas pestañas.
- Registra por perfil en
  `%LOCALAPPDATA%\DICloak-Test-Server-Reception-036\<id>\diagnosticos\`
  un archivo JSON con estado temporal (`waiting_for_profile`,
  `profile_running`, `debugger_connected`, etc.) y contadores de
  respuestas del laboratorio (`saved`, `failed`, `approved`, etc.).
  **No guarda contraseñas, cookies, cabeceras, claves API ni URLs
  de depuración.**
- Archiva solo los cuerpos de documentos permitidos, preservando
  los bytes que **CDP entrega**; esos bytes podrían diferir del
  transporte HTTP real por decodificación/descompresión.
- `tools/verify-almacen-test-manifest.cjs` permite comparar, fuera
  de línea y por hash SHA-256, los archivos archivados contra el
  manifiesto de documentos de prueba que entregue el **servidor propio**
  del operador. Informa coincidencias, ausencias y diferencias sin
  volcar contenidos ni autenticar por sí solo la procedencia del
  manifiesto.

## Alcance y limitaciones

La petición de capturar todo el tráfico de todos los procesos
incluye potencialmente material de autenticación y sesiones de
terceros. **No se ha implementado un volcado indiscriminado de
cookies, tokens, contraseñas ni tráfico de otros dominios.**

No se puede concluir que `GET .../session` por sí solo indique los
archivos recibidos, ni que observar CDP garantice la captura del 100%
de las respuestas. La auditoría de archivos nativos Chromium (PR #48)
es independiente y no altera ni descifra bases de datos.

**Todavía no existe un instalador 0.3.7 ni enlace automático con el
botón Almacén**. Se requiere una validación del perfil, Local API
habilitada y una dirección HTTPS de servidor de prueba autorizada
para ensayar recepción real extremo a extremo.

## Fuentes técnicas

- DICloak Local API V2 Runtime:
  https://dicloak.crisp.help/en/article/local-api-v2-runtime-interface-t3iabr/
- DICloak Local API V2 Profile:
  https://dicloak.crisp.help/en/article/local-api-v2-profile-interface-c8z7na/
- Chromium DevTools Protocol:
  https://chromedevtools.github.io/devtools-protocol/tot/Target/
  https://chromedevtools.github.io/devtools-protocol/tot/Network/

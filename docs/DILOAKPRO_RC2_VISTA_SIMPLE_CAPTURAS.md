# RC2 LAB — captura, visualización y guardado para revisión manual

## Decisión de producto
El usuario desea **capturar, mostrar y guardar** evidencias. La comparación
contra su servidor es **manual**; diloakPRO no declara `COINCIDE` o
`DIFERENTE` por su cuenta.

## Requisito prioritario corregido: captura desde Windows, sin modificar el servidor

La fuente de captura debe ser **el equipo Windows donde corre diloakPRO**, no
un registrador que se instale ni ejecute en el servidor. El servidor del
experimento se mantiene como está. El objetivo es que diloakPRO observe,
muestre y almacene las respuestas **que llegan al cliente** (JSON y cabeceras
HTTP de prueba), incluyendo campos de cookies, cuenta, proxy o extensiones
**sintéticos** solo cuando aparezcan efectivamente en esas respuestas.
Los botones siguen siendo **Iniciar captura, Detener, Ver evidencias, Guardar**;
el usuario compara los datos manualmente. No hay veredicto automático.

**Restricción técnica:** el muestreo Windows/TCP y una captura pasiva de
paquetes no pueden revelar por sí solos cuerpos HTTP cifrados con HTTPS/TLS.
La API local del proveedor y CDP remoto tampoco están disponibles en el
entorno actual del usuario. Por lo tanto, la captura de los bytes descifrados
del cliente requiere un punto de observación autorizado en la máquina del
usuario, sin editar el servidor, y de momento **NO está implementada**.

Camino propuesto: modo cliente de laboratorio con **proxy local de diagnóstico**
explícito y limitado al origen de prueba. El perfil de prueba debe encaminar
su tráfico por ese proxy; para leer cuerpos HTTPS se requiere autorización
expresa y confianza en una CA de prueba, únicamente en dicho perfil. Esa
configuración inicial no se puede eliminar de forma mágica ni debe alterar
el proxy efectivo de otros perfiles o la instalación oficial de DICloak.
Si el navegador no permite configurar el proxy de prueba, estudiar
una extensión local autorizada con capacidad de depuración de pestaña,
sin puerto CDP remoto, sujeta a disponibilidad y permisos. Ninguna vía
puede prometer acceso universal a todo lo que recibe cualquier motor.

**Aceptación antes de anunciar listo:** pruebas de un JSON de laboratorio
HTTPS recibido por Chromium a través del punto de captura autorizado;
visibilidad del cuerpo y de cabeceras de prueba en **Ver evidencias**;
respaldo cifrado recuperable mediante contraseña; registro claro de
SIN_CUERPO_TLS si el contenido no puede inspeccionarse; comprobar que
no se alteró el motor oficial ni el servidor y que no se capturaron orígenes
terceros. Hasta superar esas pruebas, solo Windows/TCP y la captura
CDP previa están implementadas.

## Pantalla principal simplificada

| Botón | Acción real |
|---|---|
| **Iniciar captura** | Inicia diagnóstico Windows; si existe autorización local/API o CDP, también intenta observar el laboratorio. La captura cliente HTTPS sin CDP está pendiente |
| **Detener** | Detiene muestras Windows y guarda diagnóstico |
| **Ver evidencias** | Lista el estado, los hashes y el nombre del respaldo cifrado de cada respuesta de laboratorio |
| **Guardar** | Genera JSON, TXT y SHA-256 del diagnóstico |
| **Avanzado** | Incluye añadir archivo, abrir carpeta, restauración y ajustes de API/CDP y servidor de laboratorio |

La interfaz no requiere que el usuario compare nada. El propósito de guardar
**hash del servidor / hash del navegador / ID único** es facilitar la revisión
posterior de quien administra el servidor.

## Ejemplos de archivos propios

- `.crx` o `.xpi`: paquete de extensión exportado.
- `.zip`: archivo exportado por herramientas oficiales.
- `.json`: archivo de prueba (por ejemplo, configuración de proxy,
  fingerprint o cookies **sintéticas**).
- `.har`: exportación de red de una prueba que controlas.
- `.txt`: informe de laboratorio.

Todo archivo que elijas se guarda con **AES-256-GCM** en
`%LOCALAPPDATA%\diloakPRO\ArchivoRC2\Perfiles\Perfil-...\RespaldosCifrados`,
sin eliminar ni cambiar el original. El registro guarda fecha, tipo general,
tamaño y nombre del archivo cifrado; no copia el nombre original ni su
contenido a JSON/TXT abiertos. Una exportación guardada no demuestra que el
navegador la tenga aplicada.

## Qué es y qué no es captura

1. **Windows**: número de procesos y TCP; no muestra cuerpos HTTP.
2. **Servidor propio de laboratorio instrumentado**: función histórica opcional,
   pero **no es el modo solicitado ni sustituye la captura en Windows**.
3. **Chromium con CDP habilitado por el perfil**: previa elección explícita
   del origen y de una contraseña, se obtiene una respuesta JSON de
   `/__diloakpro_lab__/` con cabeceras de comprobante; se guarda su cuerpo
   sin transformarlo en un respaldo local AES-256-GCM (`.dlvault`), junto
   al ID, SHA-256 y tamaño en el inventario. No se compara automáticamente.
   La respuesta debe ser JSON UTF-8 no comprimido, hasta 128 KiB. La captura
   está limitada al primer target CDP `page`, y sin CDP no hay cuerpo guardado.
4. **Prueba independiente del servidor**: importar `*.proof.json` añade
   ID, SHA y categorías al visor como `IMPORTADO`, sin dictamen.
5. **Archivos elegidos por el usuario**: se copian cifrados para un eventual
   análisis local del propietario. No se extraen automáticamente cookies
   de Chromium, contraseñas, tokens o credenciales de proxy.

Las funciones técnicas que requieren consentimiento siguen conservando sus
controles originales en **Avanzado**, pero no abarrotan la vista principal.

## Pruebas
- `dotnet run -c Release --project tools/tests/rc2-archive/Archive.Tests.csproj`
  incluye comprobación del modo `CAPTURADO` sin veredicto.
- El workflow RC2 construye el ejecutable Windows solo si pasan las pruebas y
  comprueba que el DICloak 3.0.9 oficial siga intacto.
- No afirmar que funciona con cookies reales, proxy aplicado, extensiones
  cargadas o login sin pruebas independientes que lo demuestren.

## Detección automática del perfil y servidor de laboratorio

La vista principal ya no pide escribir el origen ni el puerto CDP.
**Iniciar captura** solicita consentimiento y contraseña del respaldo,
y consulta la **API local autorizada** para identificar un perfil en ejecución.
Si hay un único perfil, utiliza su `debug_port` oficial; si hay varios,
pide seleccionar uno para no mezclar capturas.

En la primera ejecución sin clave autorizada, pide **una sola vez por sesión**
la clave Open API local que el usuario ya ha obtenido legalmente.
**La cuenta web iniciada no proporciona automáticamente esta clave.**
No se leen archivos de claves del proveedor, llaveros, credenciales guardadas
ni cookies de otros sitios. No se prueban puertos al azar.

Una vez conectado CDP, el monitor reconoce automáticamente el origen
**solo al observar una nueva respuesta** HTTPS (o HTTP en localhost) con
ruta `/__diloakpro_lab__/`, cabeceras X-Diloakpro-Lab-Id y
X-Diloakpro-Lab-SHA256, y JSON no comprimido de hasta 128 KiB.
El origen queda bloqueado a la primera respuesta válida de laboratorio.
Se prefiere una pestaña de laboratorio que ya esté abierta en la lista CDP.
La función no puede recuperar peticiones anteriores a la conexión.

Si la API Open API no está disponible o el perfil no expone CDP,
la aplicación lo indica explícitamente: Windows/TCP no se convierte
mágicamente en captura de contenidos. Los controles manuales siguen
en **Avanzado** como alternativa.

Solo se conservan los contenidos del JSON de la ruta propia marcada:
el `Set-Cookie` de las cabeceras, cookies guardadas en Chromium, contraseñas
del navegador, autenticación proxy y archivos instalados de extensiones
requieren fuentes de evidencia diferentes y no se extraen automáticamente.
Las comparaciones con el servidor siempre son manuales.

## Captura cifrada del contenido de prueba (nueva)

Con un perfil de laboratorio abierto y CDP habilitado por el usuario:

1. Pulsar **Iniciar captura**. Confirmar que son datos desechables y
   establecer una contraseña local de al menos 12 caracteres. Si aún no
   está autorizada, proporcionar una vez la clave Open API local.
2. El programa selecciona el único perfil abierto o solicita elegir entre
   varios, obtiene su puerto CDP por la API autorizada y observa una nueva
   respuesta de prueba del servidor sin escribir el origen a mano.
3. En el navegador, navegar a la ruta del servidor
   `/__diloakpro_lab__/` instrumentada por el servidor propio. El navegador
   debe recibir una respuesta JSON con las cabeceras X-Diloakpro-Lab-Id y
   X-Diloakpro-Lab-SHA256.
4. En **Ver evidencias**, consultar `GUARDADO`, ID, SHA-256, tamaño y nombre
   del archivo `.dlvault`. **Guardar** exporta el inventario sanitizado.
5. Para examinar el JSON original sin crear otro archivo, pulsar
   **Ver evidencias → Ver JSON cifrado**, elegir el `.dlvault` y poner
   la contraseña. El contenido se muestra en una ventana temporal en memoria.
   También puede usarse **Avanzado → Restaurar respaldo** para crear
   una copia explícita en un destino elegido por el usuario.

El respaldo puede contener campos ficticios de correo, contraseña, proxy,
cookies, tokens y extensiones **solo si llegaron dentro del JSON de prueba**.
No captura automáticamente cabeceras Set-Cookie (que pueden requerir eventos
CDP adicionales), almacenamiento local de cookies, contraseñas del navegador,
autenticación de proxy ni archivos binarios de extensiones. No se observa
tráfico de terceros ni se altera el motor DICloak 3.0.9.

Si el navegador no entrega el cuerpo, el sistema registra NO_VERIFICADO.
Si el cuerpo se observa pero falla el cifrado, registra
CAPTURADO_SIN_GUARDAR. Nunca declara que los datos coinciden con el servidor.

La compilación y la prueba end-to-end en el perfil real del usuario deben
verificarse por separado; haber añadido código no equivale a confirmar
que el navegador del usuario entregó el cuerpo por CDP.

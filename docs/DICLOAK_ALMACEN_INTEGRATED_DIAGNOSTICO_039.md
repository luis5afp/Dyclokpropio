# DICloak Nativo 0.3.9 — Diagnóstico dentro del mismo programa

## Qué cambia
En la tabla de perfiles aparecen las columnas:

**Estado | Almacén | Diagnóstico | Operación**

- **Operación → Abrir** conserva su función nativa y comunica al panel
  que se solicitó abrir ese perfil.
- El manejador original de etapas de apertura notifica al panel fases
  de inicialización, información del perfil, proxy/huella, extensiones,
  sincronización cuando el motor las expone y arranque del navegador.
  Nunca transmite al panel la configuración ni sus valores.
- **Diagnóstico → Ver** abre una ventana hija segura dentro de la
  aplicación DICloak para la fila seleccionada. Puede abrirse
  **antes o después** de pulsar Operación → Abrir; los últimos
  150 eventos de ese ID se conservan en memoria durante la ejecución
  y aparecen cuando se abre el panel.
- **Almacén → Abrir** sigue siendo la auditoría manual de solo lectura
  para una carpeta Chromium de pruebas **cerrada**, como en 0.3.4.
  No confundir el botón de auditoría con la captura de red.

## Qué muestra exactamente
La ventana registra un conjunto fijo de tipos de eventos y tiempos:
- Solicitud de apertura al pulsar **Operación → Abrir**.
- Etapas de inicialización, consulta de información del perfil,
  comprobación de extensiones, mezcla de parámetros de huella,
  bloqueo de perfil, creación del navegador y otras etapas conocidas.
- Finalización o fallo de una etapa, **sin copiar textos de error que
  pudieran contener tokens o credenciales**.
- Mensaje permanente de que los eventos proceden de la interfaz
  y **todavía no prueban la identidad de la sesión nativa Chromium**.

En esta versión, la ventana **no intercepta todo el tráfico HTTP**.
No imprime ni archiva cookies, contraseñas, tokens de inicio de sesión,
cabeceras, cuerpos de peticiones, proxies o datos de terceros. Esto
evita registrar material sensible de manera masiva. Los componentes
de captura voluntaria de documentos de un servidor propio de pruebas
y comparación SHA-256 siguen disponibles **por separado en el
repositorio**, pero no se activan automáticamente en el ejecutable.

## Funcionamiento sin clave Open API
Para estas fases de la interfaz no se requiere clave Open API ni
modificar el navegador o la autenticación de cuenta del proveedor.
La clave Open API **no se extrae** de DICloak, y ninguna petición a
servidores se inicia por abrir el panel. Si ya hay una sesión de DICloak
caducada, el aviso oficial seguirá apareciendo: la versión experimental
no desactiva ni elude esa comprobación.

## Instalador experimental
Archivo, cuando su CI esté aprobado:
\`DICloak_Nativo_0.3.9_AlmacenDiagnostico_win_x64.exe\`

La compilación instala una copia independiente de la versión 0.3.4
bajo:
\`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Diagnostico-039\DICloak.exe\`

La ruta original de auditorías de 0.3.4 permanece separada.
El archivo \`DICloak.exe\` reconstruido pierde la firma Authenticode
original; no debe distribuirse como software oficial del fabricante
ni instalarse en equipos productivos sin autorización, firma propia y
validación adicional.

## Seguridad
- Ventana BrowserWindow con Node deshabilitado, aislamiento de
  contextos y sandbox habilitado; sin navegación externa ni
  apertura de ventanas no aprobadas.
- Panel HTTP de visualización exclusivamente en 127.0.0.1,
  puerto asignado por el sistema, ruta aleatoria, CSP restrictiva,
  política sin caché y sin contenido dinámico HTML sin escapar.
- Solo acepta eventos predefinidos (sin valores de cookie,
  contraseñas, proxies, urls o cuerpos de respuesta).
- Se valida que cada IPC provenga de una ventana de la aplicación.
- La atribución de los eventos a \`row.id\` es útil para depurar
  la interfaz **pero NO constituye una asociación verificada con la
  sesión nativa de Chromium**. No deducir tal identidad.
- No instala proxy MITM ni desactiva el cifrado, la política de
  cookies, WebSecurity, ASAR integrity o la autenticación.

## Limitaciones verificables
- Distingue **eventos declarados por el cliente** del contenido de
  respuestas HTTP. Que una etapa diga «descargando Local Storage»
  no prueba que se haya descargado contenido ni demuestra qué datos
  llegaron del servidor.
- No puede atribuir toda la navegación de todos los perfiles sin
  una conexión confiable al motor Chromium específico.
- Si la aplicación original no comunica cierta subetapa al
  manejador de eventos utilizado, el panel no la mostrará.
- El estado y la duración de las fases dependen de callbacks del
  motor original; no se infieren a partir de imágenes.
- El flujo «Almacén guarda todas las respuestas del servidor»
  **no está terminado**. Para una prueba extremo a extremo se
  requiere un servidor HTTPS de laboratorio autorizado y un
  manifiesto de tamaños/hashes para comparar.

## Verificación

- Tests de UI, IPC y sandbox:
  \`node --test tools/test-almacen-integrated-diagnostic-039.cjs\`
- Tests complementarios:
  \`node --test tools/test-almacen-diagnostic-panel.cjs\`
- GitHub Actions Windows + Linux:
  \`.github/workflows/test-almacen-integrated-diagnostic-039.yml\`
- Reempaquetado con fuente 3.0.7 cuyo SHA-256 es exacto,
  verificación de ASAR y de fuses originales, instalación aislada,
  prueba de arranque:
  \`.github/workflows/build-dicloak-native-039.yml\`

**La versión debe continuar como borrador hasta aprobar tanto la
compilación como una prueba manual autenticada de apertura de
perfil en el equipo del operador.**

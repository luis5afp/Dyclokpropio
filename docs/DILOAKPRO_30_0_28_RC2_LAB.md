# diloakPRO v30.0.28 RC2 LAB — diagnóstico HTTP/CDP opt-in

## Objetivo
Extender el diagnóstico externo de RC1 sin modificar el motor firmado DICloak **3.0.9**.
Esta es una **rama experimental**. No se publica automáticamente como release ni sustituye
la línea estable `v30.0.15`. El instalador RC2 utiliza una carpeta independiente.

## Nuevas funciones
- Conserva el botón flotante Diagnóstico, Iniciar/Detener, y contadores Windows
  de procesos, descendientes, Chromium y conexiones TCP.
- Añade **Conectar CDP** y **Desconectar** en el panel y un campo para introducir
  *manualmente* el puerto local de depuración autorizado (1024–65535).
- Consulta exclusivamente `127.0.0.1:<puerto>/json/list`, sin descubrir ni escanear puertos.
- Solo acepta un WebSocket de loopback y observa el **primer target de tipo `page`**.
- Registra eventos `HTTP_REQUEST`, `HTTP_RESPONSE` con código HTTP y
  `HTTP_FAILED`, además de errores/estados de conexión.
- Exporta **JSON schema 2** y **TXT** junto con las muestras originales de Windows.
- Limita a 600 los eventos CDP conservados en memoria.
- Nuevo panel **API V2 local (opt-in)**: introducir puerto de API local, clave `X-API-KEY`
  y el ID numérico de un perfil propio. Solo ejecuta consultas GET contra 127.0.0.1,
  sin guardar ni exportar la clave.
- Consulta el estado de la API, sus capacidades, el estado del perfil,
  los campos de configuración del proxy/extensiones y la existencia de la configuración
  de fingerprint. No exporta identidades, URLs ni valores sensibles.
- Si el perfil está abierto y la API devuelve `debug_port`, permite pulsar
  **Conectar CDP del perfil** sin tener que adivinar un puerto. No conecta
  automáticamente ni habilita Remote Inspector sin permiso.
- El JSON incluye una **matriz de evidencias**, que distingue procesos observados,
  tráfico HTTP observado vía CDP, configuración leída y datos todavía no verificados.

## Privacidad e integridad
- No guarda URL, dominio, ID de solicitud, cuerpos JSON, encabezados, cookies,
  credenciales ni tokens, ni los envía a ningún servidor.
- La clave local API V2 solo existe en memoria durante la solicitud; el campo
  se vacía tras pulsar Comprobar perfil. Los cuerpos JSON leídos de la API oficial
  nunca se incluyen íntegros en el informe: se reducen a estados de evidencia.
- Nunca inyecta JavaScript, intercepta autenticación ni modifica
  `DICloak.exe`, `app.asar`, el proxy o el perfil.
- No habilita depuración remota automáticamente ni intenta descubrir puertos.
  No dejes CDP abierto a redes externas: usa solo una interfaz local
  habilitada mediante funciones oficialmente soportadas.
- Cualquier dato no observable se informa como **NO VERIFICADO**.

## Cómo probarlo en Windows x64
1. Respaldar cuentas/perfiles y conservar el instalador RC1. No mezclar carpetas.
2. Compilar desde GitHub Actions
   `.github/workflows/build-diloakpro-309-rc2.yml`;
   descargar el artefacto **RC2 LAB** solo si todas las pruebas pasan.
3. Instalar en `%LOCALAPPDATA%\Programs\diloakPRO-Motor309-RC2-LAB`.
4. Abrir el acceso directo de RC2, pulsar **Diagnóstico → Iniciar**.
5. Para comprobar el perfil mediante API V2, habilitar la API local oficial
   y anotar **puerto API local** e **ID de perfil**. Introducir en el panel
   la clave API (sin compartirla) y pulsar **Comprobar perfil**.
6. Si la API devuelve el `debug_port` para el perfil abierto y Remote Inspector
   está permitido, pulsar **Conectar CDP del perfil**. De lo contrario,
   la captura Windows sigue funcionando y se marca CDP como NO VERIFICADO.
7. Abrir un perfil propio de prueba, detener y exportar JSON/TXT.
8. Comprobar por separado login real, apertura de Chromium y si los eventos
   pertenecen al perfil esperado. Esta RC2 no correlaciona aún todas las pestañas.

## Limitaciones explícitas
- Observa solo el primer target `page` visible en el puerto CDP seleccionado.
- Los eventos HTTP son metadatos, **no** respuestas originales exactas del servidor.
- Puede confirmar **configuración disponible**, no que Chromium haya aplicado
  cookies, proxy, fingerprint o extensiones ni que haya autenticación web.
- No descarga cookies, tokens, contraseñas o respuestas HTTP internas del proveedor.
  Para verificar cookies aplicadas se requiere una prueba por origen controlado;
  la API de cookies puede estar inhabilitada cuando hay cifrado protegido.
- El estado `running` de `/profiles/{id}/session` indica proceso activo,
  **no** sesión autenticada del usuario.
- No integra el diagnóstico interno R4 de la línea experimental anterior.
- GitHub Actions puede verificar compilación, instalación, firma y humo de arranque,
  pero **no** login real de la cuenta del usuario ni disponibilidad de CDP en su equipo.
- El puerto CDP puede estar deshabilitado por el proveedor: no se debe sortear su protección.

**Requisito de publicación:** no marcar esta RC2 como estable hasta verificar
integridad del motor oficial, compilación CI y funcionamiento real en Windows.

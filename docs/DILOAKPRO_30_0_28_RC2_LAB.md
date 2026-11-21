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

## Privacidad e integridad
- No guarda URL, dominio, ID de solicitud, cuerpos JSON, encabezados, cookies,
  credenciales ni tokens, ni los envía a ningún servidor.
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
5. Si el motor proporciona un puerto CDP de manera oficial y autorizada,
   introducirlo en la caja y pulsar **Conectar CDP**. Si no existe,
   el diagnóstico Windows sigue funcionando, sin asumir datos HTTP.
6. Abrir un perfil propio de prueba, detener y exportar JSON/TXT.
7. Comprobar por separado login real, apertura de Chromium y si los eventos
   pertenecen al perfil esperado. Esta RC2 no correlaciona aún todas las pestañas.

## Limitaciones explícitas
- Observa solo el primer target `page` visible en el puerto CDP seleccionado.
- Los eventos HTTP son metadatos, **no** respuestas originales exactas del servidor.
- No acredita si Chromium aplicó cookies, proxy, fingerprint, extensiones ni sesión.
- No integra el diagnóstico interno R4 de la línea experimental anterior.
- GitHub Actions puede verificar compilación, instalación, firma y humo de arranque,
  pero **no** login real de la cuenta del usuario ni disponibilidad de CDP en su equipo.
- El puerto CDP puede estar deshabilitado por el proveedor: no se debe sortear su protección.

**Requisito de publicación:** no marcar esta RC2 como estable hasta verificar
integridad del motor oficial, compilación CI y funcionamiento real en Windows.

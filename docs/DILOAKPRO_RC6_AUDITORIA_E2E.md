# diloakPRO 30.0.19 RC6 — auditoría integral de apertura, sin secretos

Esta revisión amplía el diagnóstico que aparece en **Perfiles → Diagnóstico → Ver**.
No cambia la autenticación ni el motor original DICloak 3.0.7.

## Flujo

1. La acción **Operación → Abrir** activa el observador en el proceso principal
   *antes* de solicitar la apertura del navegador.
2. El controlador conserva un historial limitado por perfil con marcas horarias
   originales; el panel puede abrirse después.
3. Se anotan etapas de configuración, proxy, preparación de cookies,
   extensiones, huella, almacenamiento y apertura, diferenciando
   *etapa completada* de *configuración aplicada/verificada*.
4. Se correlacionan las solicitudes y respuestas Node HTTP(S) observadas mediante
   un identificador aleatorio: método, ruta anonimizada, estado, latencia, bytes
   del cuerpo contados (si se observaron), indicadores de presencia de
   cabeceras y si no se observó respuesta.
5. Muestreo limitado de procesos y conexiones Windows; la atribución al
   perfil Chromium **no está verificada**. Si se abren dos perfiles, se
   indica asociación temporal ambigua.
6. Tras terminar la apertura se conserva una ventana de observación de
   15 segundos. El límite absoluto de captura es 120 segundos.
7. El botón **Guardar JSON + TXT en Descargas** genera dos archivos
   **con el mismo nombre base**, en la carpeta de Descargas del usuario.

## Informes

**JSON**: eventos normalizados, contadores, estados de apertura,
correlación de solicitudes/respuestas, cobertura y limitaciones.
**TXT**: cronología, resumen de HTTP/procesos, etapas y
solicitudes con resultados observados.

**Nunca se almacenan** contraseñas, correos de cuentas, tokens de acceso,
valores de cookies, secretos de proxy, códigos 2FA, contenido de las
respuestas, ni la base de datos de almacenamiento del navegador.
Los indicadores de presencia de cabeceras NO confirman que estas
se aplicaron correctamente.

El diagnóstico **no demuestra igualdad byte a byte** entre respuestas
del servidor y los datos usados por Chromium. Para validar esa
igualdad debe existir una comprobación acordada en el servidor y el
cliente de pruebas, vinculada a la misma solicitud, sin exportar
secretos ni digests débiles que permitan ataques de diccionario.

## Cobertura

- Sí: etapas de interfaz, parte de `node:http(s).request` del proceso
  Electron principal, estados HTTP, tiempos, tamaños y muestreo Windows.
- No: todo el tráfico Chromium, `fetch` no instrumentado, WebSocket,
  todas las cargas de cookies y LocalStorage del navegador, 2FA
  real y vinculaciones nativas comprobadas de Chromium-perfil.
- Un socket con una IP no prueba necesariamente la identidad del
  servidor final: podría corresponder a un proxy.
- Una solicitud sin respuesta registrada puede haber quedado fuera de
  la ventana de captura y no es automáticamente un fallo.
- Los informes incluyen IP/puertos observados; pueden ser
  sensibles, revisarlos antes de compartir.

## Instalación y seguridad

RC6 es una revisión **experimental**. Se conserva la identidad de
instalación `com.diloakpro.desktop` y la carpeta
`%LOCALAPPDATA%\\Programs\\diloakPRO`. Se mantiene la
lista estricta de versiones antiguas que se pueden desinstalar por
sus desinstaladores registrados. Las carpetas de perfiles y el
DICloak oficial no se borran.

No está firmada digitalmente con un certificado propio. La distribución
de componentes originales de terceros requiere los permisos correspondientes.

## Pruebas

```bash
node --test tools/test-diloakpro-auditoria-e2e-3019.cjs
node --test tools/test-almacen-json-export-rc2.cjs
```

Windows CI debe verificar el ASAR, PE, NSIS, instalación sobre RC2
y arranque básico. Debe realizarse una prueba posterior con un perfil
de laboratorio para confirmar el comportamiento real.

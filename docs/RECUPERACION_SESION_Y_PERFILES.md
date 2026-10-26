# Recuperar cierre de sesión cuando se mezclan versiones instaladas

## Segunda corrección: «Confirmar» no cerraba la sesión

La captura posterior al primer arreglo mostraba la confirmación **normal**,
no la advertencia para perfiles abiertos. El propio estado del renderer era,
por tanto, `ownOpenId.length === 0` en ese momento.

Al contrastarlo con el código fuente recuperado del `app.asar` original,
se encontró que la interfaz Electron siempre enviaba la orden
`stop-env` con `callbackName: logout-stop-env-success`, incluso cuando no
había ningún perfil abierto. Solo después de recibir el evento de respuesta
ejecutaba la función existente de cierre de sesión. Con un proceso auxiliar
desconectado, obsoleto o sin respuesta, **Confirmar no hacía nada**.

El código original de salida también ejecuta
`await Dre.stopReporting()` antes de limpiar la autenticación. Ese paso
puede fallar o quedar pendiente si falla la comunicación con el servicio.

### Comportamiento corregido

1. Sin perfiles abiertos registrados, la confirmación ejecuta directamente
   la función `kse(true)` del propio programa, conservando su intento de
   cerrar sesión en el servidor y su limpieza habitual.
2. Con perfiles abiertos registrados, mantiene la orden nativa de detener
   entornos, sin cerrar automáticamente navegadores por otra vía.
3. Si el flujo de salida no responde después de 15 segundos, o falla,
   muestra una **segunda confirmación opcional** para cerrar solo la
   sesión local. No ejecuta esa alternativa sin intervención del usuario.
4. La salida local de recuperación utiliza `GlobalState.clearState()`,
   elimina únicamente las claves de autenticación `basic:state` y
   `token:state` del almacenamiento de la interfaz y recarga la
   aplicación. No borra datos de perfiles, cookies, contraseñas ni
   instalaciones anteriores.

**Limitación de seguridad importante:** la recuperación local no puede
garantizar que el servidor haya invalidado la sesión remota ni que haya
cerrado navegadores que siguen abiertos. Se comunica explícitamente antes
de que el usuario confirme. Para una revocación completa, se necesita que
el servicio vuelva a estar disponible y/o cerrar la sesión en el servidor.

La recuperación es un módulo mantenible
`dist/assets/dyclok-logout-recovery.mjs`, cargado desde el componente
recuperado `index-D2T4aaQJ.js`. No altera los once archivos protegidos
del runtime ni el mecanismo de autenticación del navegador.

### Verificación

```powershell
node --check dist/assets/dyclok-logout-recovery.mjs
node tools/verify-logout-recovery.js
node tools/verify-safe-base.js
```

Las pruebas cubren salida directa cuando no hay perfiles, confirmación
de parada cuando los hay, respuesta que nunca llega, error de red,
recuperación local confirmada y conservación de la protección de cambio
de equipo.

## Qué se encontró en el código

En `dist/assets/index-D2T4aaQJ.js` la interfaz ejecutaba esta comprobación:
`he.getters.ownOpenId.length && X.isClient`. Si la lista local de identificadores
de perfiles abiertos no estaba vacía, **el botón rechazaba el cierre de sesión
sin comprobar si los procesos seguían existiendo** y solo mostraba
`header.promptError` ("Cierre el perfil antes de realizar esta operación").

La captura con "Error carga. Reintente" indica un fallo al obtener la lista
de perfiles; **no demuestra que los perfiles hayan sido borrados**. Tras
instalar y desinstalar versiones, pueden quedar estados locales antiguos,
aunque también podría haber un fallo de API, inicio de sesión, equipo o red.
No es posible distinguirlos solo por la imagen.

## Corrección realizada

En la primera corrección, si la lista de perfiles abiertos detectaba IDs (sean reales o obsoletos),
el menú Cerrar sesión muestra una **confirmación adicional** explicando que
se intentarán detener entornos aún activos. Solo con la confirmación del
usuario ejecuta el mecanismo ORIGINAL `X.send(...LOGOUT_STOP_ENV_SUCCESS)`.
El comportamiento para los demás casos se conserva.

- No se eliminan perfiles, cookies, bases de datos, tokens o configuraciones
  mediante un script externo.
- No se eliminan comprobaciones al cambiar de equipo.
- No se intenta cerrar sesión automáticamente ni se desactivan las medidas
  de protección del flujo original.
- No se fuerza la limpieza local si el servicio original falla: así evitamos
  dejar el programa en un estado contradictorio mientras haya entornos activos.
- Si el servicio de sesión o el backend no responde, la confirmación puede
  no resolver el problema: no se ha demostrado funcionamiento completo en
  una instalación Windows real.

## Diagnóstico seguro de varias instalaciones (Windows)

El script es **solo lectura** y NO pide contraseñas ni tokens:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\diagnose-session-windows.ps1
```

Muestra las versiones registradas en Programas, las carpetas candidatas de
datos de aplicación y la cantidad de procesos por nombre. No obtiene
cookies, historial, nombres de perfiles, sesiones, rutas privadas ni claves.
Nunca mata procesos ni desinstala aplicaciones.

Para guardar un resumen con un destino elegido por el usuario:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\diagnose-session-windows.ps1 -ReportPath "$env:USERPROFILE\Desktop\Dyclok-diagnostico.json"
```

## Procedimiento sugerido en el equipo afectado

1. Cierra todas las ventanas de perfil. No mates procesos Chrome genéricos
   porque pueden pertenecer a otras aplicaciones.
2. Ejecuta el diagnóstico para comprobar si hay dos instalaciones o procesos
   DICloak/Dyclokpropio simultáneos.
3. Antes de desinstalar cualquier versión, haz copia de seguridad de las
   carpetas de datos correspondientes y verifica que la copia sea legible.
4. Abre únicamente la versión nueva e intenta recargar la lista de perfiles.
5. Si la lista muestra "Error carga", verifica internet, sesión y equipo
   seleccionado. No uses el error como prueba de que no existen perfiles.
6. Selecciona **Cerrar sesión** y, si aparece la advertencia de entornos
   abiertos, cierra los perfiles reales antes de confirmar. Comprueba que
   vuelva a la pantalla de inicio de sesión.
7. Si el cierre no termina, conserva los datos y revisa los registros locales
   (sin compartir tokens/cookies) y la respuesta del servidor de DICloak.

## Por qué no cambiamos `appId`, `name` ni las rutas de datos

Electron utiliza por defecto el nombre de aplicación para definir su
directorio `userData`. Cambiar la identidad, `appId`, los nombres de
producto o las rutas sin migración probada puede hacer que desaparezcan de
la vista datos de la instalación anterior sin recuperarlos.

El instalador mantiene estos identificadores para preservar compatibilidad.
El desinstalador NSIS habitual no debería eliminar datos personales por
defecto, pero **no se puede afirmar lo mismo de instaladores anteriores o
personalizados sin auditarlos**. No se borra nada como parte de esta corrección.

## Pruebas

```powershell
node tools/verify-logout-recovery.js
node tools/verify-safe-base.js
```

La prueba ejecuta el controlador de menú extraído del bundle en un contexto
simulado y comprueba cinco casos: identificadores obsoletos, cierre normal,
cierre previamente confirmado, bloqueo de confirmaciones automáticas y
modo web. La prueba también exige que permanezca la protección de cambio
de equipo y el callback original de parada de perfiles.

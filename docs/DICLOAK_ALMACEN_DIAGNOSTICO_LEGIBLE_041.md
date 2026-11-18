# DICloak Nativo 0.4.1 — Diagnóstico legible y códigos de etapas desconocidas

## Hallazgos del registro real aportado

El operador confirmó que **Operación → Abrir** emitió 25 eventos entre las
8:08:12 y las 8:08:20 a. m. La obtención de configuración,
validación de proxy, comprobación del plan de cifrado, extensiones,
parámetros de huella, reserva del perfil y solicitud de apertura
del navegador se registraron como completadas.

El panel anterior, sin embargo, presentaba texto negro sobre un
fondo oscuro y tres fases iniciales «no identificadas». También
mostraba cero respuestas autorizadas, cero documentos guardados y cero
errores.

**Los ceros de HTTP no son una prueba de que el servidor no envió
datos.** En 0.4.1 la interfaz todavía no cuenta con un receptor
automático del tráfico del motor Chromium.

## Cambios

- Estilo oscuro explícito con colores de alto contraste para encabezados,
  tabla, tarjetas y mensajes, sin depender del tema heredado del
  contenedor Electron.
- Si el paso interno no corresponde a una fase conocida y su
  identificador es un entero de 0 a 255, el panel muestra su
  **código numérico**. Eso ayuda a identificar las tres fases
  que todavía faltan sin registrar valores privados.
- El proceso nativo descarta cualquier código que no sea un entero
  del intervalo permitido. Nunca acepta textos arbitrarios de
  errores del motor, proxies, cookies, nombres de usuario, tokens
  ni cuerpos HTTP.
- Se mantiene la detección por nombres simbólicos de las etapas
  que sí se reconocen, incluidos los resultados de comprobación
  del proxy.
- **No hay ningún cambio de inicio de sesión, HTTPS, cookies ni
  validaciones del fabricante.**

## Instalación experimental

La versión 0.4.1 se instala **por separado** de la 0.4.0 en:

`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Diagnostico-Legible-041\DICloak.exe`

Archivo esperado:
`DICloak_Nativo_0.4.1_AlmacenDiagnosticoLegible_win_x64.exe`

Pruebas de regresión Windows y Linux:
https://github.com/luis5afp/Dyclokpropio/actions/runs/44312110511

Compilación Windows, instalación aislada y smoke test del motor:
https://github.com/luis5afp/Dyclokpropio/actions/runs/44312382449

La compilación reconstruye el ejecutable, por lo que invalida la
firma digital Authenticode del fabricante. **No se debe distribuir como
DICloak oficial**, usar en producción ni eludir SmartScreen.

## Qué falta para cumplir el objetivo original de Almacén

1. Identificar la sesión nativa exacta del Chromium creado por el
   perfil. Las fases de interfaz no prueban esa identidad.
2. Conectar un receptor de documentos **solo de un servidor HTTPS
   de laboratorio autorizado** a esa sesión, sin copiar
   indiscriminadamente cookies de sesión, contraseñas ni tokens.
3. Comparar los bytes recibidos (teniendo en cuenta las
   transformaciones posibles de CDP) con el SHA-256 del documento
   original enviado por el servidor.
4. Verificar manualmente con un perfil ficticio que «Almacén → Abrir»
   muestra el material autorizado del perfil correcto.

Esta versión **solo corrige observabilidad y legibilidad**, no
realiza captura de tráfico completa.

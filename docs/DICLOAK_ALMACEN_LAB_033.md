# DICloak Nativo 0.3.3 — Almacén de laboratorio: archivos válidos y bytes idénticos

## Motivo de la corrección

En la versión 0.3.2, `ejemplo-lab.zip` contiene **solo 8 bytes de prueba**
que comienzan por `PK\x03\x04`. No es un ZIP real. Windows muestra
«El archivo tiene un formato desconocido o está dañado», aunque el archivo
se haya guardado fielmente. Cambiar los bytes de un archivo recibido no
resolvería el problema y contradiría la exigencia de preservar originales.

La solución correcta **no toca el archivo anterior**: la versión 0.3.3
crea un conjunto nuevo de respuestas completas de un servidor local
`127.0.0.1`, con documentos correctos que pueden abrirse.

## Archivos que recibirá cada perfil de prueba

Cada perfil tendrá una carpeta propia bajo:

`%LOCALAPPDATA%\DICloak-Nativo-Almacen-Lab-033\<row.id>\`

En `archivos\<evento>\` se guardarán los originales enviados
por el servidor de laboratorio, cada uno en su subcarpeta única:

- `datos-prueba.json`: JSON válido con cookie, credencial y proxy
  **ficticios**, con la misma representación UTF-8 y finales de línea
  que envió el servidor.
- `ejemplo-lab.txt`: texto de prueba válido, con finales de línea
  CRLF preservados.
- `ejemplo-lab.zip`: ZIP completo y válido que contiene
  `LEEME.txt`, verificado con `zipfile.testzip()`.
- `ejemplo-lab.bin`: binario de muestra que incluye bytes `00 FF 80`;
  no se convierte ni se decodifica.

En `respuestas-pruebas\<evento>\` se mantienen **exactamente** los
cuerpos de respuesta `body.raw` y las cabeceras `headers.raw` recibidos
por el arnés local. El `Set-Cookie` ficticio se conserva tal cual en
`headers.raw` y en JSON aparece además un valor de cookie ficticia.
No se exportan cookies auténticas del navegador.

**No hay filtro por extensión en el archivador**: recibir archivos
válidos de otros formatos es posible si el servidor de pruebas los entrega.
El archivador no comprime, cifra, ofusca, reescribe, renombra ni
descomprime ningún cuerpo recibido; el nombre original se conserva
cuando es seguro para Windows. Si el servidor manda un archivo corrupto,
se conserva **corrupto** y se señala el problema; no se falsifica una
reparación.

## Aislamiento y precauciones

- Instalación independiente:
  `%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Lab-033\DICloak.exe`
- Almacén nuevo en `Lab-033`: las muestras antiguas de `Lab-030`,
  incluido el ZIP incompleto, **no se borran ni sobrescriben**.
- Se mantiene la columna Almacén con botón Abrir y el sistema de avisos
  visible para fallas del puente de Electron.
- Pruebas unitarias comprueban identidad byte a byte por perfil,
  archivado de cabeceras y prueba completa del ZIP con la biblioteca
  `zipfile` de Python, además de los ensayos Windows de instalación
  y arranque.

## Alcance real

El botón **no captura automáticamente** respuestas de sitios externos,
cookies reales, contraseñas del navegador ni proxies de navegación. Esta
versión es un laboratorio que recibe muestras **ficticias** de un servidor
TCP local y las archiva. Para ampliar a otros servidores de prueba propios
hay que establecer explícitamente sus orígenes, límites y acceso; no se
debe asumir que cada petición HTTP contiene archivos descargables.

La versión todavía no es un Release estable. La modificación del motor
invalida la firma Authenticode del proveedor. Es necesaria autorización
de redistribución, firma propia y prueba manual de la interfaz.

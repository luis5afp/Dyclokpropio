# DICloak Nativo 0.3.4 — vinculación manual y auditoría de Chromium

## Qué funciona en esta versión de laboratorio

La columna **Almacén** y el botón **Abrir** siguen en el lugar acordado.
Su nueva acción conecta la fila seleccionada con una **carpeta Chromium
que el usuario elige expresamente** y calcula un resumen de integridad
del almacenamiento nativo. No crea respuestas de servidor ficticias.

Cada auditoría genera un archivo JSON de **metadatos solamente** bajo:

`%LOCALAPPDATA%\DICloak-Nativo-Almacen-Audit-034\<row.id>\auditorias\`

Se registran por categoría: número de archivos nativos, tamaño total,
hash SHA-256 agregado y, si es la segunda auditoría en la misma ejecución,
si el conjunto cambió. **No se escriben ni copian bases de datos de
Chromium, ni se descifran cookies ni contraseñas.**

## Procedimiento para validar con un perfil de prueba

1. Abrir DICloak y elegir un perfil que solo contenga **cuentas ficticias**.
   Si el navegador admite `chrome://version`, consultar allí la ruta
   exacta de su perfil Chromium; no adivinar rutas por el número visible.
2. Cerrar el navegador de **ese** perfil y asegurarse de que ya no lo
   está utilizando ningún proceso Chromium. Mantener la ventana de
   gestión DICloak abierta.
3. Pulsar **Almacén → Abrir** en la fila del perfil deseado.
4. Seleccionar **manualmente** la carpeta Chromium que acaba de identificar.
   El programa no determina automáticamente a qué fila pertenece la ruta.
5. Confirmar que el perfil de pruebas está cerrado. La auditoría
   calcula tamaños y hashes **de solo lectura**, guarda el informe en
   `Almacen-Audit-034` y abre el Explorador de Windows allí.
6. Repetir después de otra prueba de navegación, **cerrando primero**
   el navegador. El informe permite observar qué categorías cambiaron.

La vinculación se mantiene solo en memoria durante la ejecución
actual de DICloak, para que no haya una reasignación persistente y
silenciosa de carpetas. Si se reinicia DICloak, hay que volver a
seleccionar la carpeta. No se permite asociar la misma carpeta manual
a dos filas durante una misma ejecución.

Si se cancela la selección o la confirmación, no se toca ninguna carpeta
de origen. Si una carpeta no contiene archivos nativos reconocidos, la
auditoría se rechaza en lugar de crear una asociación falsa.

## Qué NO hace ni demuestra

- **No intercepta el tráfico HTTP** que circula por los navegadores
  de perfiles DICloak. No se ha localizado un punto de captura
  autorizado y verificado del motor Chromium separado.
- **No asegura que un perfil recibió todos los bytes enviados por el
  servidor**. Las cookies `Set-Cookie` pueden rechazarse o
  serializarse/cifrarse en SQLite; además un hash de SQLite no permite
  deducir qué respuesta concreta lo modificó.
- **No extrae ni guarda valores de cookies, contraseñas o tokens**.
  No desactiva el cifrado de Chromium ni cambia su configuración.
- **No establece aún conexión con el servidor real** del usuario:
  falta el dominio/endpoint HTTPS exacto que controle, un registro
  de hashes de las respuestas servidas y un vínculo confiable
  entre esas respuestas y la sesión Chromium del perfil.
- El usuario elige la carpeta manualmente: no se afirma que su
  identidad corresponde a `row.id` de modo automático.
- Los informes de hash son **metadatos**, no copias de seguridad
  de datos nativos.

## Instalación experimental

Compilación Windows:
`DICloak_Nativo_0.3.4_AlmacenAudit_win_x64.exe`

Ruta aislada:
`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Audit-034\DICloak.exe`

No sustituye las instalaciones 0.2.0 a 0.3.3. Mantiene un solo
`DICloak.exe` visible. El ejecutable reconstruido ya no conserva la
firma Authenticode del fabricante, por lo que no debe publicarse como
oficial sin permiso de distribución y firma propia.

**Pruebas automáticas:** auditoría con bases *sintéticas* en Windows
y Ubuntu, bloqueo de symlinks, rechazos de asociación doble,
preservación byte por byte de los originales y prueba de arranque del
ejecutable. No se ha comprobado la interfaz autenticada en CI.

## Siguiente integración

Para verificar recepción real extremo a extremo es necesario que el
servidor de pruebas registre el SHA-256 de cada cuerpo HTTP que entrega
y que se exponga una ruta de prueba autorizada. Después podrá
compararse con el hash calculado del **mismo cuerpo** por un receptor
autorizado. Esta comparación es diferente de la auditoría de
bases de datos Chromium, que se conserva por separado.

# Almacén por perfil — conservación de datos originales

## Alcance confirmado

El usuario quiere que **Almacén** guarde, para cada perfil de DICloak, el
material recibido del servidor **sin importar el formato**: TXT, ZIP, PDF,
imágenes, JSON y otros archivos, además de considerar cookies. No debemos
convertir, descomprimir, editar, recodificar ni ofuscar los archivos originales.

**Interfaz:** en la tabla Perfiles, crear la columna **Almacén** entre
**Estado** y **Operación**, con botón **Abrir** para cada fila. El resto
de la interfaz permanece igual.

## Qué significa realmente «todo»

Hay tres flujos técnicamente distintos:

1. **Archivos descargados:** documentos o binarios guardados por el navegador.
   Podemos archivarlos byte por byte, sin interpretar su tipo MIME y sin
   tocar el original; conservar su nombre original dentro de un subdirectorio
   único por evento para evitar sobrescrituras de nombres repetidos.
2. **Respuestas de red que nunca fueron archivos:** HTML, JSON, imágenes
   integradas en páginas, datos de API, streaming, etc. No todo lo que
   entrega un servidor aparece como archivo. Para registrar este flujo
   hacen falta eventos del navegador con asociación verificable al perfil.
   Las APIs estándar pueden entregar cuerpos **ya descomprimidos** o
   transformados por la pila de red; no se puede prometer conservación
   byte por byte de *la transmisión original* sin examinar el mecanismo
   real de captura. El nombre del fichero no cambia este límite.
3. **Cookies y autenticación:** las cookies pueden llegar por cabeceras
   `Set-Cookie` o establecerse por JavaScript. Pueden ser credenciales
   activas. Para mantenerlas exactamente como las gestiona el navegador,
   **no extraerlas, no descifrarlas, no exportarlas a TXT y no duplicarlas
   en una carpeta de acceso general**. Permanecen en el almacén nativo de
   cookies del perfil, con las protecciones propias del navegador. La
   interfaz Almacén podrá indicar que el almacenamiento nativo del perfil
   existe, sin mostrar el valor de cookies ni permitir leer sesiones ajenas.

No se presentará una carpeta de caché genérica como «todo el servidor».
No se simulará captura ni se ocultarán pérdidas de eventos.

## Modelo de almacenamiento de archivos en Almacén

- Crear una raíz controlada por la cuenta local de Windows; dentro usar
  exclusivamente `row.id`, la identidad interna del perfil. Nunca el número
  visible `serialNum` como clave de seguridad.
- Para cada descarga recibida mediante un **evento autenticado del motor**,
  guardar `Almacen/<profileId>/archivos/<eventId>/<originalName>`.
  Cada carpeta de evento es única y no se reutiliza, de modo que el nombre
  original se conserva sin sobrescribir otro archivo.
- Los bytes se escriben tal cual, sin transformación, descompresión ni
  modificación de formato. Se puede comprobar SHA-256 sobre una copia
  en memoria sin alterar el archivo.
- Se rechazan traversal, UNC/rutas remotas, rutas fuera del perfil,
  directorios simbólicos, nombres de archivos no seguros y vínculos
  entre dos identidades de perfil. No se reutilizarán rutas ambiguas.
- La captura no cambia el destino de descarga actual, la sesión de navegador,
  las cookies, la configuración de proxy ni la autenticación.
- La carpeta debe ser privada del usuario. En Windows, los permisos
  efectivos deben verificarse mediante ACL: `chmod` o `mode:0600`
  **no sustituyen** una comprobación de ACL en NTFS.
- Si se pierde un evento, se agota el espacio o una captura no es técnicamente
  posible, mostrar un error; **no afirmar que se guardó todo**.

## Situación del repositorio

Se verificó que `dist/assets/envList-CYDbiryu.js` compone la tabla de
perfiles y que `rowKey:"id"` representa el ID interno. El backend
disponible permanece ofuscado. Todavía **no** se ha verificado un punto de
captura que reciba todos los cuerpos de red y las descargas con el ID de perfil.

El módulo `tools/almacen-perfil-readonly.js` valida rutas existentes para
la futura acción Abrir. El módulo independiente
`tools/almacen-original-files.js` representa únicamente el receptor seguro
de **archivos ya entregados como bytes** por un evento confiable del motor.
No lee cookies ni intercepta tráfico de red por su cuenta.

## Pendiente antes de anunciar instalador nuevo

1. Identificar y probar con dos perfiles el evento confiable del motor que
   entrega descargas y el vínculo preciso con `row.id`, sin cambiar
   el comportamiento normal de DICloak.
2. Confirmar si el alcance incluye cuerpos de respuestas HTTP de páginas
   además de archivos. Un archivador de descargas **no equivale** a una
   captura completa del tráfico del perfil.
3. Integrar la columna y el canal IPC restringido en la compilación nativa.
4. Verificar permisos NTFS/ACL, espacio, interrupciones y restauración;
   probar TXT, ZIP, PDF, Unicode y nombres repetidos.
5. Probar instalación, arranque, perfiles, cookies y sesiones en Windows,
   preservando integridad ASAR y fuses.
6. Confirmar permisos de distribución y la firma de código propia antes
   de publicar la compilación como versión estable.

**Estado:** especificación actualizada y mecanismos aislados de prueba.
**No existe todavía un instalador que archive todo el tráfico del perfil**.

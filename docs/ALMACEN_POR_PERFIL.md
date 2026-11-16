# Investigación técnica — Almacén por perfil en DICloak Nativo 0.2.0

> **Cambio de alcance confirmado:** el usuario indicó que **Almacén** debe conservar
> todo tipo de material que el servidor entregue al perfil (TXT, ZIP,
> cookies y otros formatos), no únicamente descargas. La especificación
> actualizada está en [ALMACEN_DATOS_ORIGINALES.md](ALMACEN_DATOS_ORIGINALES.md).
> Las secciones siguientes documentan los hallazgos de la investigación
> inicial y **no representan todavía una captura completa de tráfico**.

## Solicitud visual

Incorporar la columna **Almacén** exactamente entre las columnas **Estado**
y **Operación** de la tabla **Perfiles**, con un botón **Abrir** en cada fila.
No alterar el resto del diseño, los textos, el flujo de cuentas, las sesiones,
la autenticación, los recursos del navegador ni el contenido de archivos.

## Hallazgos reproducidos sobre el ASAR oficial DICloak 3.0.7

Inspección de solo lectura realizada mediante el workflow
`.github/workflows/inspect-native-profile-storage.yml`:

1. La tabla se construye en
   `dist/assets/envList-CYDbiryu.js` y utiliza una lista de columnas
   calculadas. **Estado** es el campo `EnvironmentStatus`; **Operación**
   es `prop:"operation"`. Se puede insertar una definición adicional sin
   eliminar ni reemplazar las columnas existentes.
2. La fila utiliza `rowKey:"id"` y las acciones actuales reciben
   `e.row.id`. **Éste es el ID interno que debe asociarse a Almacén**;
   `serialNum` es solo el número visible (p. ej., 524, 815) y no garantiza
   una carpeta estable.
3. En el proceso principal obfuscado
   `dist-electron/main-gLlCfI66.js` aparecen manejadores de descargas
   de componentes, extensiones y recursos, además de llamadas a
   `shell.openPath`. Eso **no permite demostrar** que los documentos de
   cada navegador se descarguen en una carpeta individual.
4. En los archivos inspeccionados **no se identificó una correspondencia
   verificada de `row.id` a directorio de descargas de Chromium**.
   No corresponde adivinarla a partir de `serialNum`, ni abrir carpetas
   de caché, cookies o sesiones que contengan datos privados.
5. Las respuestas HTTP de API, HTML y JSON no son necesariamente archivos
   descargados. No se interceptarán ni almacenarán indiscriminadamente
   respuestas del servidor: podrían contener tokens, cookies u otros secretos.

## Comportamiento propuesto

- Encabezado **Almacén** con un botón **Abrir** por perfil.
- El botón abre **el Explorador de Windows en la carpeta de descargas
  ya registrada para el ID interno de ese perfil**, una vez que el motor
  haya confirmado esa correspondencia. Acepta cualquier formato
  (`.txt`, `.pdf`, `.zip`, imágenes, etc.) sin convertirlo ni renombrarlo.
- **Solo lectura de rutas y apertura de carpetas:** no mover, copiar, editar,
  descargar otra vez, convertir, desencriptar o alterar los archivos.
- Si la carpeta no existe, está compartida por varios perfiles, no es
  local o no se conoce su asignación real: mostrar **«Carpeta no disponible»**
  en vez de abrir una ruta de otro perfil.
- Almacenamiento de archivos de nuevas descargas: exige confirmar primero
  cómo Chromium decide dónde guardarlas. Si el navegador usa una carpeta
  de Windows común para todas las cuentas, **no se pueden separar con certeza
  las descargas antiguas por perfil**. Para las futuras se deberá registrar
  el evento de descarga con el ID interno correspondiente (sin leer datos
  de red ni contenido de archivos).

## Implementación preliminar entregada

`tools/almacen-perfil-readonly.js`:
- Valida el ID del perfil, la ubicación local y la existencia del directorio.
- Rechaza rutas de red, symlinks, rutas inexistentes y carpetas compartidas
  por múltiples perfiles.
- Invoca exclusivamente `shell.openPath` con la ubicación ya verificada.
- **No** incluye escritura, creación, borrado, copia, modificación o lectura
  de archivos descargados.

`tools/test-almacen-perfil-readonly.js` contiene pruebas para las
restricciones anteriores. Workflow de validación:
`.github/workflows/test-almacen-readonly.yml`.

## Lo que falta para un instalador funcional

1. Determinar desde el motor de Chromium el directorio de descarga efectivo
   de cada perfil (preferentemente a través de su configuración o evento
   de descarga), sin modificar credenciales ni cookies.
2. Conectar ese mapa al proceso principal Electron mediante un canal IPC
   restringido; no confiar en rutas arbitrarias enviadas por el renderer.
3. Insertar la columna en el componente Vue original con el mismo diseño.
   Probar columnas configurables, tamaños de ventana, selección y filas
   compartidas.
4. Reconstruir ASAR y su hash PE como en el laboratorio 0.2.0, manteniendo
   fuses de seguridad; no firmar el EXE con una identidad ajena.
5. Probar con dos perfiles y dos descargas distintas: TXT y PDF, además de
   archivos con nombres Unicode. Comprobar que **Abrir** no cruza carpetas.
6. Hacer copia de seguridad del programa y los perfiles antes de pruebas
   funcionales. Mantener PR en borrador hasta validar usuarios reales y
   disponer de autorización y firma propia para la distribución.

**Estado:** arquitectura y comprobaciones iniciales preparadas.
**NO** es un instalador con la nueva columna ya operativa; sin la asociación
real perfil/carpeta no sería correcto afirmar que Almacén muestra todas las
descargas del perfil.

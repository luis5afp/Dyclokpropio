# DICloak Nativo 0.3.1 — corrección visible de Almacén

## Por qué no se veía Almacén en la versión 0.3.0

La prueba de arranque anterior **no comprobaba la visualización de la tabla**
tras iniciar sesión. Al revisar los módulos compilados **originales** del
motor 3.0.7 descubrimos una causa concreta:

- `dist/assets/TableFieldDialog-V53UVTu7.js` convierte las columnas nuevas
  que no figuran en la configuración guardada en elementos con
  `checked:false`. El componente de la tabla filtra esos elementos.
- Al guardar `Almacén` solo en la lista de columnas, sin integrarla en la
  configuración visible, su encabezado y su botón podían no aparecer.
- El botón 0.3.0 llamaba `window.ipcRenderer`, sin comprobar que la
  aplicación expusiera ese objeto. El preload original usa una API
  restringida mediante contextBridge, no una API IPC general pública.

## Reparación 0.3.1

Se modifican únicamente los archivos compilados de interfaz y preload que
requiere esta característica, con la integridad del ASAR y del ejecutable
recalculadas y sin desactivar protecciones de Electron:

1. `envList-CYDbiryu.js`: se marca la nueva columna `almacen_lab` como
   `checked:true` en la configuración personalizada del usuario. No se
   reinician ni cambian las demás columnas existentes.
2. `TableFieldDialog-V53UVTu7.js`: se coloca Almacén **después de Estado
   y antes de Operación** en el orden final; las reglas de las otras
   columnas quedan intactas.
3. `dist-electron/preload/index.js`: expone únicamente el método
   `window.dicloakAlmacenLab.open(id)`; no se expone `ipcRenderer`
   genérico ni acceso a archivos, sesiones o cookies.
4. `dist-electron/main.js`: conserva el IPC restringido del laboratorio
   para almacenar muestras ficticias del servidor en 127.0.0.1 y abrir
   la carpeta correcta del ID interno elegido.

## Instalación y prueba

Archivo de ensayo:
`DICloak_Nativo_0.3.1_AlmacenLab_win_x64.exe`.

Se instala en:
`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Lab-031\`

**Importante:** la barra superior del motor todavía puede mostrar
`DICloak - V3.0.7 | 1.2.4.1`, porque 0.3.1 es la versión del
**instalador experimental**, no una versión cambiada del proveedor.
Para no abrir el ejecutable anterior por accidente, lanzar:

`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Lab-031\DICloak.exe`

Comprobar que la tabla muestre la columna **Almacén** entre Estado y
Operación. En dos perfiles de prueba, pulsar **Abrir** y observar que
Windows Explorer abra dos carpetas distintas bajo:

`%LOCALAPPDATA%\DICloak-Nativo-Almacen-Lab-030\<profileId>\`

El nombre de la carpeta de datos conserva el sufijo `030` porque
ambas versiones de laboratorio usan los mismos datos **ficticios**;
el instalador del programa 0.3.1 se guarda en otra carpeta y no sustituye
a 0.3.0 ni 0.2.0. Cada perfil genera `headers.raw`,
`body.raw`, `ejemplo-lab.txt` y `ejemplo-lab.zip`.

## Limitaciones y seguridad

- **Solo datos simulados de localhost.** Todavía NO captura respuestas,
  cookies, credenciales, proxies ni descargas reales de navegación.
- La prueba automática Windows comprueba el arranque y los hashes de
  instalación, pero **no ejecuta un login ni verifica píxeles de la tabla**.
  La comprobación visual requiere una prueba en un perfil ficticio.
- La reconstrucción altera el ejecutable del proveedor e invalida su
  firma Authenticode. Antes de distribución estable se requieren
  permisos de redistribución y firma propia.
- Mantener este cambio experimental en un PR Draft; no fusionar en
  `main` ni sustituir la versión 0.2.0 en uso hasta comprobarlo.

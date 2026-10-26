# Prueba de aislamiento: Cookies Pro Privada DESACTIVADA

Esta versión experimental de Dyclokpropio busca averiguar si la integración
automática de **Cookies Pro Privada v16.9.10** interviene en el error
`EXPAND_DOWNLOAD_FAIL` visto al abrir los perfiles 240, 243 y 244.

## Qué cambia

- **Inyección por nuestro cargador desactivada globalmente.** El bootstrap
  no añade `--load-extension`, no fija el icono de galleta en las
  preferencias de Chromium y no exige leer el `manifest.json` de Cookies Pro.
- **Extensión empaquetada pero inactiva.** Se conserva el ZIP y los recursos,
  sin desinstalar ni eliminar archivos, para poder revertir esta prueba.
- **Sin cambios** en la descarga y validación originales de las extensiones de
  DICloak (IPC `download-chrome-unzip-extension`), ni en perfiles,
  contraseñas, cookies, tokens o carpetas de caché.
- **Sin cambios** en la asignación de grupos de extensiones nativos. Si
  Cookies Pro también fue instalada como extensión por un grupo de DICloak
  o manualmente dentro del perfil, esa instalación independiente podría
  seguir cargándose y se deberá comprobar por separado.

## Cómo interpretar la prueba

1. Conserva una copia de seguridad de los perfiles. Cierra navegadores y
   aplicaciones de versiones anteriores, sin eliminar carpetas de datos.
2. Instala el EXE de diagnóstico publicado en GitHub Releases.
3. Abre el perfil 243 una sola vez, luego comprueba también los perfiles
   244 y 240. Si puedes crear un perfil temporal, pruébalo igualmente.
4. Si ya abren, es indicio de que la integración automática anterior
   interviene en el fallo. **No demuestra que el ZIP esté corrupto**; habría
   que aislar si afecta el flag de Chromium, la escritura de `Preferences`
   o la interacción entre ambos.
5. Si aparece el mismo `EXPAND_DOWNLOAD_FAIL`, la inyección automática de
   Cookies Pro no es suficiente para explicar el problema. Identifica
   extensiones del grupo asignado, recursos internos de
   `EXPAND_CHECK` y validación de seguridad. No desactives los controles
   de integridad solo para forzar que el perfil abra.
6. Si falla, vuelve a ejecutar `show-extension-download-diagnostics.ps1`
   desde la instalación nueva. Si no hay archivo de diagnóstico, no
   equivale a una descarga exitosa: el error puede producirse antes o después
   de la descarga, o en la verificación del paquete.

## Qué no demuestra la compilación

Las pruebas automáticas verifican que el cargador no inyecta Cookies Pro,
que los reintentos y diagnósticos de extensiones siguen activos y que el EXE
inicia. **No pueden comprobar la apertura real de los perfiles del usuario**,
porque el entorno de CI no tiene acceso a sus perfiles ni a su servidor.

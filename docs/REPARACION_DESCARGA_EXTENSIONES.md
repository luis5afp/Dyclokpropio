# Reparación del error EXPAND_DOWNLOAD_FAIL

## Qué significa exactamente

En el instalador recuperado de Dyclokpropio, el error
`EXPAND_DOWNLOAD_FAIL` se produce en la etapa **EXPAND_CHECK** al abrir
un perfil. El programa obtiene `extensionsList`, comprueba si cada
extensión habilitada está disponible localmente y solicita a su gestor
interno descargar o preparar las que falten.

El propio código distingue entre:
- Descarga fallida o excepción en `getCoreExpandList`.
- Extensión requerida que no aparece entre las descargadas cuando está
  activa `blockOnPluginDownloadFail` (o la protección de integridad).
- Fallo al preparar una comprobación de seguridad de extensiones.

**El mensaje por sí solo no identifica qué extensión ha fallado.**
La extensión Cookies Pro Privada empaquetada en
`resources/plugins/.cookies-pro-privada/` pertenece a un mecanismo
diferente al catálogo de extensiones de DICloak. Un ZIP local no repara
automáticamente un grupo que referencia un archivo remoto inexistente.

## Cambio incorporado en el ejecutable

`src/main/bundled-extension-download-retry.js` intercepta únicamente el
registro del manejador IPC `download-chrome-unzip-extension` y vuelve a
intentar **una sola vez** una descarga HTTPS que devuelva expresamente
`false`. El manejador original efectúa la descarga, instala, valida
el paquete y aplica las políticas de seguridad.

- No convierte fallos en éxitos ni modifica el grupo de extensiones.
- No intenta repetir excepciones de permisos, autenticación o verificación.
- No usa un ZIP diferente ni evita los checks SHA-256/MD5.
- No elimina archivos de extensiones ni datos de ningún perfil.
- Si el backend utiliza otro canal o la descarga falla siempre, no corrige
  ese caso. Se debe diagnosticar la URL/servicio o el grupo asignado.
- La función depende de que el runtime original registre el IPC por
  `ipcMain.handle`; el instalador debe probarse en Windows.

## Revisar el perfil 244 sin perder información

1. **Haz una copia de seguridad antes de modificar la instalación.**
   Cierra las ventanas de perfil y versiones antiguas.
2. Abre **Extensiones → Administración/Gestión de extensiones**.
   Consulta qué extensiones están habilitadas en el grupo que usa
   `KAIZEN/AUTOLOGIN (244)`. Revisa si todas tienen ZIP o URL disponible.
3. Si una extensión falla, prueba deshabilitarla y volverla a habilitar
   **solo si tienes permiso**. Para Cookies Pro, si quieres que DICloak la
   gestione por grupo, importa el paquete ZIP mediante **Añadir extensión →
   Subir paquete** y selecciona **Fijar siempre a la barra de herramientas**.
   Selecciona el grupo de extensiones correcto sin reemplazar otros grupos.
4. Revisa Internet, proxy y espacio libre en el disco que contiene la caché.
   La documentación oficial indica que ambos pueden impedir la descarga.
5. Si aún falla y el paquete remoto está disponible, prueba la recuperación
   de caché respaldada que se explica a continuación.

## Recuperación de caché de extensiones sin borrado

Obtén la **ruta de la caché** desde DICloak →
**Personal → Configuración → Carpeta de caché**. No supongas la ruta.

La herramienta `tools/repair-extension-cache.ps1` se incluye en el
instalador bajo `resources/tools/`. Por defecto solo muestra una
simulación. Requiere cerrar el programa para aplicar los cambios.

```powershell
# Revisión: no modifica nada
.\repair-extension-cache.ps1 -CacheFolder "D:\RUTA_REAL_DE_CACHE"

# Con copia de seguridad y confirmación de texto
.\repair-extension-cache.ps1 -CacheFolder "D:\RUTA_REAL_DE_CACHE" -Apply
```

Mueve únicamente `expansion/` a una carpeta de respaldo
`.dyclok-backup-extensiones/` dentro de la misma ubicación.
**No toca `browsers/`**, perfiles de Chromium, cookies, contraseñas,
`SourceData/` ni bases de datos. El gestor descargará las extensiones
necesarias otra vez al abrir el perfil.

No uses esta opción si necesitas abrir extensiones sin conexión o si la
extensión ya no está disponible en el servidor: la descarga seguirá fallando.
El respaldo permite recuperar los archivos anteriores manualmente.

## Protección de integridad

No se recomienda desactivar globalmente la opción
**«Cuando falla la descarga de la extensión, el perfil no se abre»**
ni el modo de protección contra modificaciones únicamente para esquivar
este error. Estas reglas pueden existir para impedir abrir un perfil
sin extensiones obligatorias.

## Diagnóstico adicional

Si la nueva versión no lo resuelve, anota:
- Si falla el perfil 244 solamente o también otro perfil.
- Los nombres de las extensiones habilitadas del grupo correspondiente.
- Si se descarga una extensión después de respaldar `expansion/`.
- La disponibilidad de red y el espacio libre aproximado.

Comparte únicamente esos datos, **nunca** contraseñas, claves API,
cookies, tokens o perfiles completos.

## Referencias oficiales

- https://help.dicloak.com/why-cant-i-open-the-browser-profile/
- https://help.dicloak.com/how-to-add-extensions-and-apply-them-to-profiles/

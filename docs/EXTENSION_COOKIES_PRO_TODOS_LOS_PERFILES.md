# Cookies Pro Privada 16.9.10 en todos los perfiles

Este documento sirve para la extensión ZIP proporcionada por el propietario del proyecto. **No contiene datos de cuentas, cookies o sesiones ni se incluye el ZIP en GitHub.** La versión original tiene un `manifest.json` de Manifest V3 y exige Chromium/Chrome **130 o superior**. El Chrome de cada perfil es distinto del Chromium que usa la interfaz Electron.

## Instalar en todos los perfiles desde Dyclokpropio

Esta es la ruta preferida, ya que usa el administrador de extensiones existente de DICloak sin modificar su runtime recuperado.

1. Descarga el ZIP preparado `Cookies_Pro_Privada_16.9.10_para_Dyclokpropio.zip` entregado por separado. Tiene `manifest.json` en la raíz del ZIP.
2. Abre **Extensiones / Gestión de extensiones** → **Añadir extensión** → **Subir paquete ZIP**.
3. Asigna el nombre **Cookies Pro Privada**, selecciona un **grupo de extensiones** y activa la extensión. Puedes habilitar la opción de fijarla a la barra.
4. En **Perfiles**, selecciona los perfiles actuales y abre **Más acciones → Editar perfil → Configuración avanzada → Extensiones**. Habilita las extensiones y selecciona el grupo que contiene Cookies Pro Privada. También puedes editar cada perfil por separado.
5. Abre un perfil y verifica en `chrome://extensions` que esté instalada, habilitada y sin errores.
6. En cada **perfil nuevo**, selecciona el mismo grupo de extensiones en la configuración avanzada antes de crearlo. Para creación en lote, establece el grupo de extensiones en las opciones avanzadas.

**Cuidado con los grupos existentes:** si los perfiles ya tienen otros grupos y otras extensiones, conviene añadir Cookies Pro Privada a esos grupos en Gestión de extensiones, en lugar de sustituir el grupo del perfil. Así no se pierden las extensiones previas.

Referencia: https://help.dicloak.com/how-to-add-extensions-and-apply-them-to-profiles/

## Herramienta opcional para aplicar el grupo masivamente por la API local

El script `tools/set-extension-group-for-profiles.ps1` permite asociar el grupo seleccionado a todos los perfiles a los que la API local tiene acceso. **No sube ni instala el ZIP**: primero añade y habilita la extensión con la interfaz.

La API local de DICloak debe estar habilitada. Obtén la clave API local y el ID numérico de tu grupo de extensiones. No los publiques en GitHub ni los compartas en capturas.

Desde la carpeta raíz del repositorio, en PowerShell, ejecuta una simulación:

```powershell
.\tools\set-extension-group-for-profiles.ps1 -GroupId 'ID_DEL_GRUPO'
```

Después de revisar los resultados:

```powershell
.\tools\set-extension-group-for-profiles.ps1 -GroupId 'ID_DEL_GRUPO' -Apply
```

Por defecto se omiten los perfiles que ya usan **otro grupo**, para no reemplazar sus extensiones. Solo si deseas sustituirlos, añade `-ReplaceExistingGroups` después de comprobar qué extensiones perderían. Ejecuta el modo simulación con esta opción antes de `-Apply`.

Para detectar y actualizar perfiles que crees mientras PowerShell permanezca abierto:

```powershell
.\tools\set-extension-group-for-profiles.ps1 -GroupId 'ID_DEL_GRUPO' -Apply -Continuous
```

Este modo consulta la API local cada 60 segundos; se detiene con Ctrl+C. **No instala un servicio de Windows, no ejecuta tareas en segundo plano al cerrar la consola y no sustituye la configuración correcta de los perfiles nuevos.**

Documentación de API: https://help.dicloak.com/dicloak-api-browser-profile-interface/

## Privacidad y compatibilidad

- La extensión solicita permisos para leer, modificar y borrar cookies y acceder a todos los sitios HTTP y HTTPS. Revísala y utilízala solo en perfiles que controles.
- Instalar el mismo código de extensión en distintos perfiles **no transfiere automáticamente** cookies, contraseñas ni sesiones entre ellos. Los datos que la extensión almacene o importe en un perfil deben mantenerse separados.
- Perfiles con un navegador anterior a la versión 130 no cumplen el mínimo declarado por la extensión. Una instalación correcta en un perfil no demuestra compatibilidad con otros kernels.
- El repositorio no contiene credenciales de la API local. La herramienta pide la clave en la consola y no la guarda en un archivo.
- Se recomienda probar primero en un perfil de prueba y respaldar los datos antes de realizar cambios en lote.

## Estado de la implementación

Se añadió la utilidad opcional de sincronización de grupo y esta guía. **No se modificó el código compilado responsable de abrir Chrome**. Instalar el ZIP y elegir el grupo en la cuenta local del usuario son pasos imprescindibles para que aparezca en los navegadores.

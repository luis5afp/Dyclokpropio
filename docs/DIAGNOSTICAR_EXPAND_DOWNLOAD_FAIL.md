# Diagnóstico de `EXPAND_DOWNLOAD_FAIL` en todos los perfiles

## Por qué se detiene en la tercera etapa

El código original de Dyclokpropio incluye el paso `EXPAND_CHECK`
(«Detectando extensiones»). Antes de iniciar Chromium:

1. Obtiene las extensiones **habilitadas y asignadas** al perfil.
2. Consulta la caché compartida y descarga/descomprime las que falten.
3. Si el equipo exige descargar todas las extensiones, impide abrir el
   perfil cuando alguna no se puede preparar.
4. Si está activada la comprobación de seguridad, verifica el hash de
   extensiones y recursos internos.

Un fallo aquí produce `EXPAND_DOWNLOAD_FAIL` incluso antes de que se
ejecute la carga local de Cookies Pro Privada en Chrome. Afectar al
perfil 244 **y** al 243 no permite afirmar qué extensión falla:
puede ser un grupo compartido, una URL remota inexistente, red, una
caché dañada o un archivo de seguridad ausente.

## Cambio en la siguiente versión

- El manejador Electron de descargas original puede devolver `null`
  cuando captura un error y `false` ante otros fallos. La versión
  30.0.3 reintentaba solo `false`; se corrigen **ambos** casos.
- Se realiza como máximo **un reintento**, usando el mismo manejador
  original y todas sus validaciones. No se simula éxito ni se evita
  la protección ante extensiones obligatorias.
- Si sigue fallando, se guarda únicamente el ID y nombre de la
  extensión, el resultado (`null`, `false` o `exception`) y la hora
  en el archivo `dyclok-extension-errors.jsonl` dentro del directorio
  `userData` de Electron. No se registran URLs, credenciales, cookies,
  rutas de perfiles ni contenido de servidores.
- El ajuste está instalado en el **descargador común**, por lo que aplica
  igualmente a perfiles actuales y futuros.

## Identificar la extensión concreta (Windows)

1. Cierra todas las ventanas de perfil y verifica que no haya
   instalaciones antiguas abiertas a la vez.
2. Abre Dyclokpropio actualizado y prueba el perfil 243 una sola vez.
3. Ejecuta el visor de diagnóstico, incluido en el instalador bajo
   `resources/tools/show-extension-download-diagnostics.ps1`.
   También puedes obtener el archivo desde el repositorio GitHub.
4. Ejecuta PowerShell desde la carpeta donde tengas el script:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\show-extension-download-diagnostics.ps1
```

5. Si muestra una extensión concreta, comprueba en
   **Extensiones / Gestión de extensiones** si su grupo está asignado,
   si el archivo ZIP remoto sigue accesible y si la extensión está
   realmente habilitada. Un archivo borrado o sin permisos **no se
   recupera instalando otra versión del programa**; hay que corregir
   su origen o su asignación en la cuenta.
6. Si no existe el registro, el error podría producirse en el paso
   de validación de seguridad, fuera del descargador que instrumentamos.
   Se debe verificar la política de seguridad y los recursos internos
   sin desactivarlos a ciegas.

Si se sospecha una caché local corrupta, el instalador incluye
`tools/repair-extension-cache.ps1`. **Primero** revísalo sin `-Apply`.
Solo respalda `expansion/` cuando se ejecuta explícitamente con
`-Apply`, se confirman las advertencias y Dyclokpropio está cerrado.
Nunca elimina carpetas de navegadores/perfiles.

## Límites

Este ajuste corrige un caso de reintento omitido y da datos verificables
del próximo fallo. **No se garantiza abrir los perfiles mientras falte
una extensión requerida**, y no hay acceso desde GitHub al servicio
remoto de extensiones ni al equipo Windows donde ocurre el error.

La validación automática solo simula el manejador; una prueba en el
equipo afectado y el diagnóstico específico son necesarios.

## Hallazgo del diagnóstico sin registros (versión v30.0.4)

El archivo con el mensaje «No hay registro del descargador» **no demuestra** que la descarga haya funcionado. Al revisar `src/main/bundled-extension-bootstrap.js` se encontró una omisión: se utilizaba `createExtensionDiagnosticWriter()` sin importarlo. La excepción `ReferenceError` era absorbida por el bloque `try/catch`, de modo que **se desactivaban tanto el reintento como el registro de fallos**, incluso si el instalador se compilaba correctamente.

La corrección incorpora la importación y una prueba que ejecuta el bootstrap real con Electron simulado, reproduce un resultado `null` y verifica que aparezca una entrada anónima en `dyclok-extension-errors.jsonl`. La prueba se ejecuta tanto en la revisión del código como **antes de publicar un EXE**.

### Diagnóstico después de la nueva instalación

1. Confirma que has instalado la nueva versión; no ejecutes una versión antigua en paralelo.
2. Abre **una vez** un perfil que falle (por ejemplo 243) y luego cierra esa ventana de error.
3. Desde PowerShell, ejecuta `show-extension-download-diagnostics.ps1` y comparte el resultado, quitando cualquier detalle que no desees revelar.
4. Si aparecen filas `null`, `false` o `exception`, el problema corresponde a una extensión descargada por el gestor original. Busca el ID/nombre en el grupo de extensiones y comprueba el paquete y permisos, no desactives controles de seguridad.
5. Si **sigue sin haber registro**, el error probablemente ocurrió fuera de este descargador, por ejemplo en la validación de seguridad o por una extensión asignada que no llegó a solicitarse. Se necesita capturar la etapa exacta o los registros originales del programa. No borramos datos ni prometemos que todos los perfiles abrirán sin identificar la causa.

**Importante:** corregir el diagnóstico no restaura por sí mismo archivos remotos desaparecidos, permisos de cuenta, seguridad interna ni listas de extensiones erróneas.

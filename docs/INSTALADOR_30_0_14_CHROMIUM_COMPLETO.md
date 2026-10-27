# Dyclokpropio v30.0.14 — integración de Chromium completo

## Base técnica conservada

El instalador se construye desde la revisión **b9b38dac246594977bcbb6e37a1cbe2ad28a8d50**, correspondiente al rc4 en que las verificaciones de extensiones y el registro IPC `clear-dev-cache` funcionaron. Se conserva el empaquetado de extensiones internas aisladas, `logo.ico`, bibliotecas existentes y el renderer de compatibilidad con checks SHA256.

## Diferencia detectada entre las carpetas entregadas

El ZIP antiguo DICloak 2.8.17 contiene `Chromium/Application/ginsbrowser.exe`, `Chromium/Application/142.0.7444.273/chrome.dll`, archivos `.pak`, `icudtl.dat`, `v8_context_snapshot.bin`, DLL, locales y la carpeta adicional `Chromium/ginsbrowser`. El ZIP nuevo no contiene este árbol. Por tanto la integración conserva **todos** los archivos situados bajo `Chromium/`, no solamente `Chromium/Application`.

## Generación del instalador local completo (Windows)

Prerequisitos: Windows x64, Node.js y npm, copia de origen autorizado **DICloak.zip**. Trabajar sobre esta rama del repositorio. Realizar antes copia de seguridad de perfiles y mantener cerrada la aplicación durante la compilación.

En Windows PowerShell, desde la raíz del repositorio:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-win-with-complete-chromium.ps1 -ArchivoZipAntiguo "C:\ruta\a\DICloak.zip"
```

El proceso valida la base rc4, aplica transformaciones SHA-guarded, extrae `Chromium/` a una carpeta de trabajo nueva sin sobrescribir, comprueba la versión y las dependencias nativas, crea el instalador NSIS y compara todos los archivos y SHA256 de los binarios críticos con los incluidos realmente en `release/win-unpacked`. Luego prueba en Windows el registro IPC nativo original. Si falla una validación, termina sin etiquetar como completado.

El instalador local resultante es `release-delivery/Dyclokpropio_30.0.14_CHROMIUM_COMPLETO_PRUEBA_win_x64.exe`, acompañado de `SHA256SUMS-CHROMIUM-COMPLETO.txt` y un `TEST_STATUS-CHROMIUM-COMPLETO.txt`.

### Límites

**Las pruebas automatizadas de GitHub han usado archivos sintéticos, NO el ZIP binario real proporcionado por el usuario.** Hasta completar el montaje real y abrir el perfil 244, esta construcción es **experimental**. El error `gost.exe ENOENT` puede ser independiente de Chromium.

**No se han subido ni publicado los binarios originales de DICloak** a un repositorio público: su licencia/permiso de redistribución debe verificarse. Los archivos del usuario se procesan únicamente en su PC. No mezclar `DICloak.exe` con la aplicación nueva, no desactivar hashes ni modificar perfiles.

### Requisitos para una publicación estable

1. Confirmar licencia y procedencia de binarios de Chromium/ginsbrowser y del servicio `gost.exe`.
2. Generar instalador reproducible en entorno Windows con fuente de Chromium autorizada.
3. Verificar árbol completo e identidad de DLL/EXE dentro del instalador, incluso en máquinas limpias.
4. Confirmar que el perfil 244 crea un proceso nativo **y ventana visible**; probar 243 y 240.
5. No declarar el perfil abierto en UI solo porque `openEnv` respondió `success`.


## Nuevos archivos entregados (26/oct/2026)

El usuario agregó `ginsbrowser.exe` (3.23 MB), `chrome_proxy.exe`,
`chrome.VisualElementsManifest.xml`, `version.json`,
`.ginsextension2.zip`, `.ginsextension3.zip`, `settings.dat` y dos
archivos `.pma`. El inventario original permite establecer:

| Archivo | Ruta relativa de la instalación antigua | Tratamiento |
| --- | --- | --- |
| ginsbrowser.exe | Chromium/Application/ginsbrowser.exe | Motor, obligatorio |
| chrome_proxy.exe | Chromium/Application/chrome_proxy.exe | Binario auxiliar |
| chrome.VisualElementsManifest.xml | Chromium/Application/chrome.VisualElementsManifest.xml | Manifiesto de interfaz |
| version.json | Chromium/version.json | Identidad de paquete, conservar |
| .ginsextension2.zip / .ginsextension3.zip | Paquetes asociados a Chromium/ginsbrowser; ubicación ZIP original no verificada | No sustituir automáticamente carpetas originales sin verificar |
| settings.dat | Chromium/User Data/Crashpad/settings.dat | **Estado de usuario: excluir del instalador público** |
| *.pma | Chromium/Application/SetupMetrics/*.pma | **Métricas de una instalación anterior: excluir del instalador público** |

El `version.json` enviado declara `main.version = 142.1.7` y las
extensiones internas `exension2` y `exension3` versión `142.1.7`.
La carpeta `Application/142.0.7444.273/` identifica el motor nativo.
Son dos identificadores distintos y no deben intercambiarse.

`Chromium.zip` de ~193 MB está adjunto a la conversación pero no se ha podido
inspeccionar byte por byte con las herramientas actuales. No basta con
haber recibido su nombre: hasta verificar el ZIP original y el manifiesto
no se puede asegurar que contenga `chrome.dll` y todas las bibliotecas.

La preparación automatizada conserva el código del motor, incluyendo
`Chromium/version.json` y `Chromium/ginsbrowser/`, pero **omite**
`Chromium/User Data/` y `Chromium/Application/SetupMetrics/` para evitar
republicar datos o identificadores de la instalación antigua. Pruebas
sintéticas verifican esa separación.

## Archivo adicional entregado: 142.0.7444.273.zip

El usuario también entregó `142.0.7444.273.zip` (aprox. 191 MB).
El entorno de lectura de archivos de la conversación devolvió un error de
ejecución al intentar abrirlo; **su contenido no está verificado directamente**.
Por la nomenclatura y el inventario de DICloak 2.8.17, se trata de la
carpeta `Chromium/Application/142.0.7444.273/`, donde se esperan
`chrome.dll`, `icudtl.dat`, `resources.pak`, `v8_context_snapshot.bin`
y otros componentes.

Se ha preparado importación de dos ZIP locales:

- `Chromium.zip`: carpeta principal, `Application/ginsbrowser.exe`,
  `Chromium/ginsbrowser/` y otros recursos.
- `142.0.7444.273.zip`: carpeta nativa de versión, ya sea con sus
  archivos en la raíz, en `142.0.7444.273/` o en
  `Chromium/Application/142.0.7444.273/`.

El importador combina las rutas SOLO en
`Chromium/Application/142.0.7444.273/`; si encuentra archivos repetidos,
rechaza contenidos diferentes y admite exclusivamente copias idénticas
comparadas por SHA-256. También comprueba versión única, rutas seguras y
que los ejecutables sean binarios Windows x64 de estructura PE válida.

Compilación privada desde una copia autorizada de ambos ZIP:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-win-with-complete-chromium.ps1 -ArchivoZipAntiguo "C:\ruta\Chromium.zip" -ZipVersionChromium "C:\ruta\142.0.7444.273.zip"
```

Alternativa: ejecutar `tools/Dyclok_Compilar_v30_0_14_con_Chromium_zip.bat`,
seleccionar el primer ZIP y después el segundo ZIP cuando se abra el
cuadro opcional. Ninguna compilación publica archivos automáticamente.
La validación del instalador debe usar el ZIP auténtico y confirmar la
apertura del perfil 244 antes de considerarlo funcional.

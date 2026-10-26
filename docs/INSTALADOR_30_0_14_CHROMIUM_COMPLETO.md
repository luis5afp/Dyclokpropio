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

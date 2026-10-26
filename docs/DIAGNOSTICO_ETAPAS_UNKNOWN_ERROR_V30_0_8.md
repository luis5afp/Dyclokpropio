# v30.0.8 — diagnóstico de UNKNOWN_ERROR por etapa

## Evidencia recibida
El archivo del usuario `Dyclok-UNKNOWN_ERROR-Informe.txt` de 2026-10-26 contiene
cero archivos de logs, cero coincidencias de eventos y cero fallos del
descargador. El cuadro de la v30.0.7 indicaba `UNKNOWN_ERROR` al abrir
el perfil 244, después de comenzar «Abriendo…». No permite clasificar
la causa y **no demuestra** que la regresión de `EXPAND_CHECK` esté resuelta.

## Qué incorpora esta versión
Esta versión **no modifica las reglas de apertura**, la seguridad,
la configuración de los perfiles ni la caché. Conserva la compatibilidad
2.8.17 aplicada en v30.0.7, con los límites ya documentados en
`docs/COMPATIBILIDAD_EXPAND_CHECK_2_8_17_V30_0_7.md`.

Se instrumenta el controlador existente `Jde` que registra el inicio,
éxito y fallo de cada paso de apertura. Los eventos se envían por el IPC
privado `dyclok-open-stage` y el proceso principal guarda
`dyclok-open-stage.jsonl` en el directorio `userData` de Electron.
No se registran identificadores de perfil, nombres, rutas, URLs, cookies,
contraseñas, tokens, detalles del proxy, cadenas libres de errores ni pilas.
Se guardan únicamente:
- UTC de la observación;
- tipo de paso del conjunto fijo (ej. `expandCheck`, `paramsMerge`, `lockEnv`, `openEnv`);
- fase (`start`, `success`, `fail`, `terminal`);
- código de error solo cuando es un token mayúsculo del formato permitido
  (en otro caso `UNCLASSIFIED`);
- clase de excepción restringida a una lista fija.

El archivo se rota al superar 256 KiB. Los errores de escritura del
diagnóstico son ignorados, para no impedir la apertura de perfiles.

## Para generar el informe en Windows
1. Respaldar la carpeta de perfiles, cerrar las aplicaciones anteriores e instalar v30.0.8.
2. Intentar abrir solamente el perfil 244 y reproducir una vez el error.
3. Descargar `tools/show-open-stage-diagnostics.ps1` del repositorio o
   utilizar el archivo incluido en la instalación, en `resources/tools/`.
4. Ejecutar desde PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\show-open-stage-diagnostics.ps1"
```

5. Adjuntar al soporte `Downloads\Dyclok-Diagnostico-Etapas.txt`.

Los resultados permiten diferenciar, por ejemplo, fallo en
`expandCheck` frente a fallo posterior en `paramsMerge` o `openEnv`.
Si el resultado sigue vacío se debe confirmar que se instaló esta versión y
revisar el arranque del renderer o la ruta `userData`, sin inventar una
causa.

## Pruebas
- Verificar con hash de entrada que el renderer modificado contiene la
  compatibilidad 2.8.17 revisada.
- Verificar sintaxis JavaScript.
- Ejecutar el helper real con códigos malformados y datos privados ficticios
  para comprobar que no aparecen en el archivo.
- Comprobar que el bootstrap registra el manejador IPC antes de cargar el
  runtime original.
- Conservar las pruebas SHA256 obligatorias y el smoke test del instalador.

La compilación y las pruebas **no demuestran** que los perfiles 243, 244
o 240 abran. El objetivo es identificar la etapa real sin cambios
especulativos adicionales.

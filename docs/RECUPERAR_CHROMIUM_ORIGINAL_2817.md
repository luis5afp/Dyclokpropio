# Recuperar el núcleo Chromium de una instalación propia de DICloak 2.8.17

**Diagnóstico de referencia (26/oct/2026):** en Dyclokpropio v30.0.14-rc4 el perfil 244 supera verificaciones, `paramsMerge`, limpieza de caché, `lockEnv` y `openEnv`. La UI muestra `Cerrar` pero no se ve ventana. Dos auditorías de Windows confirmaron `ginsbrowser.exe` ausente al lado del ejecutable nuevo, 0 versiones Chromium en esa ruta, ausencia de `%USERPROFILE%\.DICloakCache` y 0 procesos nuevos `ginsbrowser.exe`. Aparecieron 3 procesos Chrome que **no se vincularon** al proceso Dyclokpropio elegido; son hijos de otros Chrome. Esto apoya —sin probarla todavía de modo concluyente— la hipótesis de un núcleo no instalado o de una ruta de lanzamiento no recuperada.

La comparación de `DICloak.zip` (1350 archivos) contra `Dyclokpropio.zip` (745) sí demuestra que el ZIP antiguo incluye `Chromium/Application/ginsbrowser.exe` y `Chromium/Application/142.0.7444.273/chrome.dll` + recursos, mientras el nuevo paquete no.

## Reparación optativa exclusivamente local

La herramienta `tools/Dyclok_Restaurar_Chromium_2817_a_rc4.bat` recibe **dos selecciones voluntarias** por cuadro de diálogo:

1. **El ZIP de la instalación antigua que te pertenece** (`DICloak.zip`, no el ejecutable antiguo).
2. `Dyclokpropio.exe` de la instalación de prueba actual.

**Cierra Dyclokpropio antes de usarla** y conserva un respaldo de perfiles/instalación. Confirma la operación en el segundo cuadro de diálogo. El BAT selecciona únicamente las entradas bajo `Chromium/Application/` del ZIP y reconstruye esa carpeta en la raíz de la instalación nueva. Soporta ZIP con o sin carpeta contenedora (hasta tres niveles), detecta y rechaza rutas peligrosas, versiones ambiguas, núcleo incompleto y nombres duplicados. Extrae primero a un directorio temporal nuevo junto al EXE y verifica tamaño y SHA-256 de los dos binarios principales. Solo entonces cambia el nombre de ese directorio a `Chromium`.

No copia `DICloak.exe`, `app.asar`, perfiles, cookies, extensiones, configuración ni archivos externos al núcleo. Nunca sobreescribe una carpeta `Chromium` preexistente. No cambia la validación remota SHA-256, ni simula éxito en la apertura. Genera reporte TXT filtrado en Descargas o Escritorio.

Si el resultado es `CHROMIUM_INSTALLED=True`, reinicia **Dyclokpropio.exe** e intenta una apertura del perfil 244. Exporta el diagnóstico original; si la ventana no aparece, vuelve a usar la auditoría nativa de procesos, sin repetir extracciones ni mezclar ejecutables.

**Importante:** la presencia de los binarios en el directorio nuevo no confirma que el lanzador vaya a usar esa ubicación ni que su versión sea compatible con la seleccionada para el perfil. Esta herramienta es una prueba controlada de paridad de instalación, no un instalador estable ni una corrección garantizada. No hagas inicios de sesión sensibles hasta confirmar el comportamiento y la procedencia del núcleo. Los derechos de distribución/uso de componentes antiguos deben verificarse antes de incorporarlos a una descarga pública.

## Criterios de solución definitiva

- Obtener el núcleo Chromium completo por una fuente autorizada y verificar su SHA-256.
- Declarar en el paquete de Windows qué versión y ruta utiliza el runtime.
- Verificar el ejecutable, `chrome.dll` y las dependencias **antes** de devolver `openEnv success` o marcar el perfil como abierto.
- Confirmar en Windows un nuevo proceso de navegador **vinculado al perfil y una ventana visible**; no inferir éxito de `Cerrar` ni de procesos Chrome de otras aplicaciones.
- Probar también los perfiles 243/240 y mantener controles de integridad, limpieza de caché y datos de usuario intactos.

No se debe publicar una versión estable sin esas pruebas.
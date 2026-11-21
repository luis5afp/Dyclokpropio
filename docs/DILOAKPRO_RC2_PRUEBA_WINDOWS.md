# RC2 LAB — prueba controlada en Windows x64 (21 de noviembre de 2026)

**Estado:** versión experimental. Instalar solo después de que el workflow de GitHub Actions indique **Success** para el último commit de la rama `feature/diloakpro-30-0-28-rc2-cdp-monitor`. No confundir el éxito de una compilación anterior con el del commit nuevo.

## Antes de instalar
- Descarga el artefacto `diloakPRO-30-0-28-RC2-LAB-Windows-x64` desde el workflow **build-diloakpro-309-rc2**, correspondiente al último commit de la rama.
- Extrae el ZIP. Comprueba el SHA-256 del EXE contra el `SHA256SUMS.txt` usando PowerShell: `(Get-FileHash .\diloakPRO_30.0.28_RC2_LAB_win_x64.exe -Algorithm SHA256).Hash.ToLowerInvariant()`
- El instalador RC2 LAB usa una carpeta independiente y **no debe sustituir la versión estable**. El workflow debe comprobar que el ejecutable y el ASAR originales de DICloak 3.0.9 permanecen idénticos.
- Usa un **perfil de prueba**, nunca credenciales ni cookies reutilizables. Debe estar abierto y con CDP habilitado oficialmente en DICloak, y Open API local autorizada.

## Prueba del usuario
1. Inicia diloakPRO RC2 LAB en Windows; abre la ventana Diagnóstico.
2. Pulsa **Iniciar captura**; confirma que los datos son desechables y elige una contraseña local de 12+ caracteres para cifrar los cuerpos JSON.
3. Si esta sesión aún no tiene autorización, proporciona tu **clave Open API local** en el diálogo. No es tu correo ni tu contraseña de acceso a la web. No se guarda en informes. Si hay varios perfiles abiertos, elige el de laboratorio.
4. El monitor intenta identificar el perfil abierto, obtener su puerto CDP de la API autorizada y observar una respuesta nueva de una ruta propia `/__diloakpro_lab__/`. No te pide introducir URL ni puerto manualmente.
5. En el navegador del perfil, visita o genera una **respuesta nueva** JSON UTF-8 de hasta 128 KiB, sin compresión, de tu servidor de pruebas. La respuesta debe incluir las cabeceras `X-Diloakpro-Lab-Id` y `X-Diloakpro-Lab-SHA256`, emitidas por el módulo del servidor de laboratorio. Si tu servidor todavía no está instrumentado para esas cabeceras, la aplicación **no podrá reconocer ni guardar automáticamente** su JSON.
6. Pulsa **Ver evidencias**. Busca `GUARDADO`, el ID, los dos hashes, el tamaño y el nombre `respuesta-lab-*.dlvault`. Pulsa **Ver JSON cifrado**, selecciona esa captura e introduce tu contraseña: el contenido se muestra temporalmente, sin realizar ninguna comparación.
7. Pulsa **Detener** y después **Guardar**. Se genera un informe JSON/TXT/SHA-256 saneado. La revisión contra lo enviado por tu servidor la haces tú.

## Qué verificar y qué enviar si falla
- `CDP_NETWORK_ENABLED` indica que Chromium aceptó la observación de red; `CDP_UNAVAILABLE`, `CDP_NO_TARGET` o `CDP_ERROR` indican que no hay captura de cuerpo. Una sesión web iniciada no equivale a permiso de Open API/CDP.
- `GUARDADO` significa que hubo respuesta JSON de laboratorio recuperada y un respaldo cifrado; `CAPTURADO_SIN_GUARDAR` significa que falló el respaldo; cero evidencias **no** significa que los datos coincidan ni que no se hayan enviado.
- No se extraen automáticamente cookies guardadas en el navegador, contraseñas reales, tokens de terceros, configuraciones de proxy aplicadas ni archivos de extensiones. Solo puede contener esos campos si están realmente dentro del JSON desechable de la ruta de laboratorio.
- Si falla la prueba, envía únicamente el informe JSON/TXT/SHA-256 **saneado**, el estado visible de la aplicación y el identificador del workflow. No compartas la clave Open API, contraseñas, cookies reales ni el archivo descifrado.
- Los cuerpos HTTP anteriores a la conexión CDP no se recuperan retrospectivamente. El monitor mira una pestaña CDP autorizada; si esa pestaña no recibe la respuesta marcada, mostrará cero.
